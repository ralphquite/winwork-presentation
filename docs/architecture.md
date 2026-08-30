# Текущая архитектура

## Назначение и граница

Репозиторий содержит одно статическое React SPA для детерминированных sales-презентаций. Это не production WinWork: продуктового сетевого слоя, аккаунтов, базы данных, аналитики и реальных пользовательских данных нет. Единственная серверная граница — Vercel password gateway из Routing Middleware и одной login-функции с двумя server-only secrets. Все состояния самой презентации локальны и сбрасываются remount’ом.

## Поток выполнения

```text
Incoming request
        |
        v
middleware.ts (password/session check before cache)
        |
        +-- no valid cookie --> login HTML / 401 / 503
        |
        +-- POST /api/auth/login --> Edge Function --> signed cookie
        |
        v
Vercel static output + SPA rewrite
        |
        v
Browser URL: /<track>?scene=<id>
        |
        v
src/app/router.tsx
        |
        v
PresentationConfig (ordered scenes)
        |
        v
Presentation (URL/history/keyboard/fullscreen/reset)
        |
        v
SceneRenderer (type dispatch + transition + error boundary)
        |
        +-- slide --> SlideScene
        |               +-- Pencil metadata --> PencilSlide iframe
        |               |                         +-- optional hotspot
        |               |                                  |
        |               |                                  v
        |               |                         DemoFlowModal
        |               |                                  |
        |               |                                  v
        |               |                         DemoProduct -> React flow
        |               +-- no Pencil metadata --> SceneFrame placeholder
        |
        +-- demo  --> DemoScene generic fixture placeholder
        |
        +-- media --> MediaScene placeholder
```

Все tracks используют один router, `Presentation` и `SceneRenderer`. Track config задаёт только порядок и данные сцен; новый track не должен создавать отдельный движок.

## Access gateway

Корневой `middleware.ts` работает в Vercel Edge runtime до cache и применяется ко всем путям, включая Vite assets, экспортированные HTML-слайды и их относительные изображения. Он пропускает только `POST /api/auth/login` в одноимённую Edge Function, не читая request body. Общая криптография и cookie policy находятся в `auth/session.ts`. `pnpm dev` запускает только локальный Vite SPA; полный access flow проверяется через `vercel dev`.

- `WINWORK_ACCESS_PASSWORD` — единственный credential, который вводит отдел продаж.
- `WINWORK_SESSION_SECRET` — отдельный случайный ключ подписи, не передаваемый пользователям.
- `POST /api/auth/login` в Edge Function сравнивает SHA-256 digests без раннего выхода, подписывает HMAC-SHA-256 token и устанавливает 30-дневную `HttpOnly; SameSite=Lax` cookie (`Secure` и `__Host-` на HTTPS).
- `POST /auth/logout` удаляет cookie. Смена любого секрета инвалидирует все активные sessions.
- До входа HTML navigation получает автономную страницу пароля, остальные ресурсы — `401`. Missing/weak configuration всегда даёт `503`.
- `returnTo` принимает только same-origin относительный путь, поэтому прямой `?scene=` восстанавливается без open redirect.

Пароль не входит в Vite bundle, URL, HTML или логи. Это coarse shared access для синтетической sales-демонстрации, а не персональная корпоративная авторизация.

## Маршруты и готовность

| Route         | Config                                  | Current state                                                      |
| ------------- | --------------------------------------- | ------------------------------------------------------------------ |
| `/enterprise` | `src/presentation/config/enterprise.ts` | 19 Pencil-backed slides; пять сцен открывают React demo-flow       |
| `/api`        | `src/presentation/config/api.ts`        | 16 Pencil-backed slides; без интерактивных demo-flow               |
| `/small`      | `src/presentation/config/small.ts`      | 14 Pencil-backed slides; одна сцена переиспользует React demo-flow |

`src/app/TrackSelector.tsx` показывает текущую готовность tracks и пытается войти в fullscreen перед переходом. Ошибка или отсутствие Fullscreen API не блокирует навигацию.

## Контракты сцен

`src/presentation/engine/types.ts` — authoritative contract:

- `PresentationConfig` ограничивает текущие track IDs и содержит ordered `scenes`.
- `PresentationScene` — discriminated union `slide | demo | media`.
- `SlideSceneDefinition` может содержать `pencil` metadata и один `demoFlow`.
- `DemoFlowId` — закрытый union пяти реализованных flows; один из них переиспользуется в двух tracks.
- `DemoFlowDefinition.hotspot` задаётся в координатах исходного canvas 1920 × 1080.

`SceneRenderer` и `DemoProduct` используют exhaustive switches. При расширении union нужно синхронно обновлять все dispatch points.

## Состояние и reset

Есть четыре независимых уровня состояния:

1. URL `scene` — источник истины для текущей сцены. Missing/invalid ID нормализуется к первой сцене через history replace; обычные переходы создают history entries. Другие query-параметры сохраняются.
2. `Presentation.revision` — увеличивается общим reset и входит в React key сцены, поэтому scene-local state размонтируется.
3. `DemoFlowModal.revision` — увеличивается reset/close и remount’ит выбранный product flow.
4. Состояние конкретного demo-flow — локальные `useState` внутри смонтированного React UI. Оно не хранится в config, URL или глобальном store.

Такое разделение обеспечивает прямые ссылки на презентационные сцены без сериализации внутреннего sales-demo сценария.

## Навигация и доступность

- `ArrowRight` и `ArrowLeft` меняют сцены; `F` переключает fullscreen.
- Глобальные shortcuts игнорируют modifier keys, input/select/textarea/contenteditable и элементы внутри `[data-presentation-modal="true"]`.
- Demo dialog создаётся через portal, блокирует body scroll, удерживает Tab-фокус, закрывается по `Escape`/backdrop/button и возвращает фокус trigger-кнопке.
- Presentation и modal transitions учитывают `prefers-reduced-motion`.
- Ошибки app/scene изолируются через `ErrorBoundary`.

Эти свойства являются runtime invariants, а не необязательной полировкой.

## Exported slides и demo-flow

`src/presentation/config/enterprise.ts` программно сопоставляет 19 элементов массива с IDs и путями `ent-01` … `ent-19`. `src/presentation/config/api.ts` делает то же для 16 сцен `api-01` … `api-16`, а `src/presentation/config/small.ts` — для 14 сцен `smb-01` … `smb-14`. `PencilSlide` загружает соответствующий HTML из track-specific директории в `public/` и масштабирует фиксированный canvas 1920 × 1080 по доступной области через `ResizeObserver`.

Шесть track scenes имеют hotspot binding на пять реализаций:

| Track          | Scene    | Flow                 |
| -------------- | -------- | -------------------- |
| Enterprise     | `ent-04` | `create-object`      |
| Enterprise     | `ent-05` | `manager-app`        |
| Enterprise     | `ent-07` | `create-activity`    |
| Enterprise     | `ent-08` | `document-templates` |
| Enterprise     | `ent-09` | `single-task`        |
| Small Business | `smb-06` | `single-task`        |

Базовые hotspot definitions находятся в `src/demos/flows/enterprise.ts`; Small Business переиспользует `single-task` с track-specific trigger label и bounds. `DemoProduct` связывает literal flow ID с React implementation. Сам iframe не управляет demo state.

## Product demo layer

- `DesktopDemos.tsx` содержит четыре desktop flow с реальными полями, таблицами, drawer/modal состояниями и локальными мутациями.
- `ManagerAppDemo.tsx` содержит один bounded mobile flow с внутренним screen state для login, orders, task creation, order details, payment, settings, notifications и chats.
- `ProductUI.tsx` владеет общими desktop primitives; `demo-product.css` — product-specific visual layer.
- `useTransientMessage.ts` очищает success/status messages по таймеру и при размонтировании.

Desktop surface сохраняет минимальный рабочий canvas внутри overflow-safe container. Mobile surface имеет исходный viewport 430 × 812 и переходит в edge-to-edge режим на узком host viewport.

## Asset model

| Path                                       | Role                                                                          |
| ------------------------------------------ | ----------------------------------------------------------------------------- |
| `public/enterprise-slides/*.html`          | Runtime slide exports loaded by iframe                                        |
| `public/enterprise-slides/*.{png,svg,...}` | Runtime dependencies referenced relatively by exported HTML                   |
| `public/api-slides/*`                      | Runtime API / Embedded exports and relative dependencies                      |
| `public/small-slides/*`                    | Runtime Small Business exports and relative dependencies                      |
| `public/winwork-logo.svg`                  | Runtime product wordmark                                                      |
| `public/demo-flows/*.png`                  | QA-only visual references; forbidden as interactive product surfaces          |
| `pencil/*.pen`                             | Approved editable design sources; not browser assets                          |
| `design-qa.md`                             | Recorded comparison and interaction evidence for the current Enterprise flows |
| `base_documentation/`                      | Historical bootstrap intent                                                   |

При замене HTML-экспорта все относительные assets должны оставаться рядом с ним. Runtime никогда не должен зависеть от `pencil/` или `/tmp`.

## Styling

`src/styles/globals.css` отвечает за application shell, selector, presentation controls, scene canvas и outer modal. `src/styles/demo-product.css` отвечает за recreated WinWork desktop/mobile UI. Деление нужно сохранять: presentation chrome не должен протекать в product recreation и наоборот.

## Build и deployment

Vite собирает статический `dist/`. Vercel сначала запускает password middleware; login POST уходит в Edge Function, существующие static files обслуживаются напрямую, а `vercel.json` применяет SPA rewrite в `/index.html` только после filesystem miss. Поэтому авторизованные прямые track routes обрабатывает React Router, а iframe HTML/assets сохраняют собственные пути. Vercel компилирует `middleware.ts` и `api/` по compiler options корневого `tsconfig.json`; project reference на `tsconfig.node.json` для этого отдельного шага недостаточен. Относительные импорты server-side TypeScript используют runtime-окончание `.js`, которое TypeScript связывает с исходным `.ts` и Vercel сохраняет как поддерживаемый Edge import. CI устанавливает frozen pnpm lockfile под Node version из `.node-version` и запускает `pnpm check`; environment values на этапе CI не требуются, потому что gateway читает их только во время Vercel request.

## Расширение

Перед изменением используйте task-specific playbook в [`agents/change-playbooks.md`](agents/change-playbooks.md). Новый scene type допустим только если `slide`, `demo` и `media` не выражают требование; новый track добавляется data config + shallow route + selector card, без нового runtime.
