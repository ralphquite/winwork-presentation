# Текущая архитектура

## Назначение и граница

Репозиторий содержит одно статическое React SPA для детерминированных sales-презентаций. Это не production WinWork: сетевого слоя, backend, авторизации, базы данных, аналитики, секретов и runtime env-контракта нет. Все интерактивные состояния локальны и сбрасываются remount’ом.

## Поток выполнения

```text
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

## Маршруты и готовность

| Route         | Config                                  | Current state                                                      |
| ------------- | --------------------------------------- | ------------------------------------------------------------------ |
| `/enterprise` | `src/presentation/config/enterprise.ts` | 19 Pencil-backed slides; пять сцен открывают React demo-flow       |
| `/api`        | `src/presentation/config/api.ts`        | Technical placeholders                                             |
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

`src/presentation/config/enterprise.ts` программно сопоставляет 19 элементов массива с IDs и путями `ent-01` … `ent-19`. `src/presentation/config/small.ts` делает то же для 14 сцен `smb-01` … `smb-14`. `PencilSlide` загружает соответствующий HTML из track-specific директории в `public/` и масштабирует фиксированный canvas 1920 × 1080 по доступной области через `ResizeObserver`.

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

Vite собирает статический `dist/`. `vercel.json` содержит общий SPA rewrite в `/index.html`, поэтому прямые запросы к track routes обрабатывает React Router. CI устанавливает frozen pnpm lockfile под Node version из `.node-version` и запускает `pnpm check`.

## Расширение

Перед изменением используйте task-specific playbook в [`agents/change-playbooks.md`](agents/change-playbooks.md). Новый scene type допустим только если `slide`, `demo` и `media` не выражают требование; новый track добавляется data config + shallow route + selector card, без нового runtime.
