# Текущая архитектура

## Назначение и граница

Продуктовый смысл и область работы описаны в [WinWork-контексте](winwork/README.md) и [истории проекта](project-context.md). Эта страница описывает местный frontend; наличие функции в продуктовом каталоге не означает её полную реализацию здесь.

Репозиторий содержит защищённое статическое React SPA для детерминированных sales-презентаций и изолированную публичную React-точку входа для `/court`. Это не production WinWork: продуктового сетевого слоя, аккаунтов, базы данных, аналитики и реальных пользовательских данных нет. Единственная серверная граница — Vercel password gateway из Routing Middleware и одной login-функции с двумя server-only secrets. Все состояния самой презентации локальны и сбрасываются remount’ом.

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
        |
        +-- component --> React scene (offline contracting)
```

Все tracks используют общий `Presentation` и `SceneRenderer`. Защищённые tracks входят через основной router; `/court` использует отдельный Vite entry, но импортирует тот же engine. Track config задаёт порядок и содержимое сцен; новый track не должен создавать отдельный движок.

«Подрядная схема» использует изолированный Vite entry `src/contracting/offline-main.tsx` и hash-историю общего движка. Одна постоянно видимая панель управляет слайдами Pencil и прототипом. При сборке для каждого автономного файла выбираются вводные слайды и этапы нужных ролей. Кнопка на последнем слайде открывает первый доступный этап, а список в панели показывает этапы текущей версии. Сценарий и сборка описаны в [contracting.md](contracting.md).

Оффлайн Court-сборка входит через `src/court/offline-main.tsx` и также импортирует неизменённые `courtPresentation`, общий `Presentation`, renderer и demo-flow. Помимо `HashRouter` и встроенного asset transport, entry выбирает узкий вариант presentation chrome с тремя постоянно видимыми кнопками и монтирует `OfflineInteractionHints`: off-target click внутри demo-flow временно выделяет доступные действия верхнего видимого слоя только обводкой, без блика и пульсации. На слайдах и при открытой шторке выбора исполнителей подсказки отключены. Web-входы продолжают использовать стандартные controls. `publicAssetUrl` возвращает обычные публичные пути в web-сборках, а в автономном файле получает заранее встроенные `data:` URL для Court-слайдов и изображений. `publicAssetDocument` декодирует встроенный HTML для `iframe.srcDoc`, чтобы renderer мог измерять настоящие границы и скругления CTA.

`PencilSlide` совмещает обводки наведения и фокуса с элементами `data-demo-flow`, `data-presentation-next` и ссылками внутри документа слайда после его загрузки и готовности шрифтов. `ResizeObserver` обновляет размеры при изменении вёрстки. Координаты из config остаются fallback для демо и ссылок в экспортах без семантических меток.

Наблюдатель элементов iframe создаётся через `slideDocument.defaultView.ResizeObserver` в контексте самого документа. Документы без целевых элементов, включая начальный `about:blank`, не наблюдаются: это исключает цикл уведомлений Chrome при загрузке и смене слайдов. Chrome smoke-тесты собирают также `window.error`, поскольку такие события могут не попасть в Playwright `pageerror`.

## Access gateway

Корневой `middleware.ts` работает в Vercel Edge runtime до cache и применяется ко всем путям, включая Vite assets, экспортированные HTML-слайды и их относительные изображения. Публичный allowlist ограничен `/court`, `/court-app/*`, `/court-slides/*`, `/court-assets/*`, `/performer-registration-flow/*`, `/performer-response-flow/*` и `/winwork-logo.svg`; он принимает только `GET`/`HEAD`. Остальные пути остаются fail-closed, а `POST /api/auth/login` передаётся одноимённой Edge Function без чтения body. Общая криптография и cookie policy находятся в `auth/session.ts`. `pnpm dev` запускает локальный основной Vite SPA; полный access flow и отдельный court rewrite проверяются через `vercel dev`.

- `WINWORK_ACCESS_PASSWORD` — единственный credential, который вводит отдел продаж.
- `WINWORK_SESSION_SECRET` — отдельный случайный ключ подписи, не передаваемый пользователям.
- `POST /api/auth/login` в Edge Function сравнивает SHA-256 digests без раннего выхода, подписывает HMAC-SHA-256 token и устанавливает 30-дневную `HttpOnly; SameSite=Lax` cookie (`Secure` и `__Host-` на HTTPS).
- `POST /auth/logout` удаляет cookie. Смена любого секрета инвалидирует все активные sessions.
- До входа HTML navigation получает автономную страницу пароля, остальные ресурсы — `401`. Missing/weak configuration всегда даёт `503`.
- `returnTo` принимает только same-origin относительный путь, поэтому прямой `?scene=` восстанавливается без open redirect.

Пароль не входит в Vite bundle, URL, HTML или логи. Это coarse shared access для синтетической sales-демонстрации, а не персональная корпоративная авторизация.

## Маршруты и готовность

| Route         | Config                                  | Current state                                                                          |
| ------------- | --------------------------------------- | -------------------------------------------------------------------------------------- |
| `/enterprise` | `src/presentation/config/enterprise.ts` | 17 Pencil-backed slides; пять сцен открывают React demo-flow                           |
| `/api`        | `src/presentation/config/api.ts`        | 8 Pencil-backed slides; без интерактивных demo-flow                                    |
| `/small`      | `src/presentation/config/small.ts`      | 12 Pencil-backed slides; одна сцена переиспользует React demo-flow                     |
| `/court`      | `src/presentation/config/court.ts`      | 6 slides: пять code-authored и финальный Pencil export; слайды 2–5 открывают demo-flow |

`src/app/TrackSelector.tsx` показывает текущую готовность tracks и пытается войти в fullscreen перед переходом. Ошибка или отсутствие Fullscreen API не блокирует навигацию.

## Контракты сцен

`src/presentation/engine/types.ts` — authoritative contract:

- `PresentationConfig` ограничивает текущие track IDs и содержит ordered `scenes`.
- `PresentationScene` — discriminated union `slide | demo | media | component`; компонентная сцена передаёт React-содержимое через ту же границу перехода и сброса.
- `SlideSceneDefinition` может содержать `pencil` metadata, один legacy `demoFlow` или несколько `demoFlows`.
- `DemoFlowId` — закрытый union десяти реализованных flows; существующие реализации могут переиспользоваться в разных tracks.
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

`src/presentation/config/enterprise.ts` программно сопоставляет 17 элементов массива с сохранёнными стабильными IDs и путями. На позициях 5–6 идут `ent-06` → `ent-05`, на позициях 10–11 — `ent-11` → `ent-10`; IDs, HTML-файлы и demo bindings следуют за содержимым слайда. Новый `ent-18` расположен после `ent-13`, существующие `ent-14`, `ent-16` и `ent-17` не переименованы, а удалённый `ent-15` остаётся недоступен. `src/presentation/config/api.ts` задаёт восемь сцен со стабильными IDs `api-01`, `api-02`, `api-04` … `api-06`, `api-12`, `api-15` и `api-17`; удалённый `api-03` остаётся недоступен. `src/presentation/config/small.ts` задаёт 12 сцен `smb-01` … `smb-12`, а `src/presentation/config/court.ts` — шесть сцен `court-01` … `court-06`. `PencilSlide` загружает соответствующий HTML из track-specific директории в `public/` и масштабирует фиксированный canvas 1920 × 1080 по доступной области через `ResizeObserver`. Первые пять Court-слайдов собраны кодом в HTML/CSS, а финальный слайд статистики экспортирован из Pencil-кадра `rHcx4`; все они используют тот же renderer. Прозрачная React-ссылка на первом слайде открывает официальный реестр ФНС, две hotspot-кнопки на втором слайде открывают регистрацию и размещение задания, две CTA третьего слайда — регистрацию и путь отклика исполнителя, CTA четвёртого — выбор исполнителя, а CTA пятого — подтверждение оплаты.

Десять track scenes имеют двенадцать hotspot bindings на десять slide-bound React-компонентов:

| Track          | Scene      | Flow                     |
| -------------- | ---------- | ------------------------ |
| Enterprise     | `ent-04`   | `create-object`          |
| Enterprise     | `ent-05`   | `manager-app`            |
| Enterprise     | `ent-07`   | `create-activity`        |
| Enterprise     | `ent-08`   | `document-templates`     |
| Enterprise     | `ent-09`   | `single-task`            |
| Small Business | `smb-06`   | `single-task`            |
| Court          | `court-02` | `registration`           |
| Court          | `court-02` | `single-task`            |
| Court          | `court-03` | `performer-registration` |
| Court          | `court-03` | `performer-response`     |
| Court          | `court-04` | `performer-selection`    |
| Court          | `court-05` | `task-payment`           |

Базовые hotspot definitions находятся в `src/demos/flows/enterprise.ts`; Small Business и Court переиспользуют нужные flows с track-specific trigger label и bounds. `DemoProduct` связывает literal flow ID с React implementation. Сам iframe не управляет demo state.

`registration` доступен и как standalone quick-access flow на главной QA-панели, и из `court-02`. Его sign-in, registration, email-sent и signed-in состояния живут локально в `RegistrationDemo.tsx` и сбрасываются через общую remount-границу модального окна.

`task-payment` доступен на главной QA-панели и из CTA `court-05`. Он воспроизводит Marketplace, выполненное задание, пять вкладок task drawer, подтверждение через SMS-код `1234` и финальное состояние `Отправлено` / `ОПЛАЧЕН` полностью локально, без сетевого платежа; после оплаты действие отмены задания не показывается. Пустое поле SMS показывает placeholder `1234` и заполняется этим кодом по клику или клавиатурному фокусу; ручное редактирование остаётся доступным.

`performer-selection` доступен на главной QA-панели и из CTA `court-04`. Он переиспользует общую страницу Marketplace и стили task drawer из flow оплаты, открывает задание со статусом `ЕСТЬ ОТКЛИКИ`, сразу показывает вкладку `Отклики (3)` с тремя синтетическими карточками исполнителей и локальными действиями `Принять` / `Отказать`.

`performer-registration` доступен как standalone quick-access flow на главной странице и из CTA `court-03`. `PerformerRegistrationDemo.tsx` воспроизводит 11 утверждённых Figma-состояний внутри общего viewport высотой 979 px. Основные поверхности собраны React/CSS с точными растровыми логотипами, флагами и иллюстрациями из Figma; экран загрузки `Мой налог` по явному требованию использует утверждённый full-screen capture. Клик по любой точке поверхности переводит на следующий экран, визуальные controls внутри остаются инертными, а длинное содержимое прокручивается вертикально. Локальный индекс и scroll-reset сбрасываются общей remount-границей модального окна.

`performer-response` доступен на главной QA-панели и из второй CTA `court-03`. `PerformerResponseDemo.tsx` воспроизводит утверждённые Figma-состояния 2.1–2.3 в viewport 430 × 979 px: Marketplace, карточку задания до отклика и локальное состояние «На рассмотрении». Переходы выполняют семантические кнопки целевого задания и отклика, Back возвращает к Marketplace, а remount модального окна сбрасывает экран и scroll position. Сетевых вызовов, реального отклика и пользовательских данных нет.

## Product demo layer

- `DesktopDemos.tsx` содержит четыре desktop flow с реальными полями, таблицами, drawer/modal состояниями и локальными мутациями.
- `RegistrationDemo.tsx` содержит standalone desktop auth flow с click-to-fill полями и без сетевых вызовов.
- `TaskPaymentDemo.tsx` содержит standalone desktop flow оплаты выполненного задания с локальными tabs, SMS и сменой статуса.
- `PerformerSelectionDemo.tsx` содержит standalone desktop flow выбора исполнителя по трём откликам с локальными решениями по каждой карточке.
- `ManagerAppDemo.tsx` содержит один bounded mobile flow с внутренним screen state для login, orders, task creation, order details, payment, settings, notifications и chats.
- `PerformerRegistrationDemo.tsx` содержит 11-экранный Figma-derived mobile flow с локальным индексом, click-through навигацией и scroll-reset при смене шага.
- `PerformerResponseDemo.tsx` содержит трёхэкранный Figma-derived flow отклика исполнителя с локальным screen state и scroll reset.
- `ProductUI.tsx` владеет общими desktop primitives; `demo-product.css` — product-specific visual layer.
- `MarketplacePage.tsx` задаёт общую desktop-страницу Маркетплейса для `single-task`, `performer-selection` и `task-payment`: заголовок, действия, вкладки, фильтры, таблицу и пагинацию. `marketplaceData.ts` содержит общие синтетические строки; сценарии выбора и оплаты подставляют своё целевое задание и локальное действие открытия. Мобильный Маркетплейс управляющего остаётся отдельной поверхностью.
- Во всех трёх desktop-сценариях Маркетплейса шторки передаются через `DesktopShell.overlay` и рендерятся непосредственно внутри product viewport, вне прокручиваемого `main`. Затемнение закрывает всю оболочку; header, sidebar и основной контент получают `inert`, а скролл фона блокируется на время открытия шторки. Содержимое правой шторки прокручивается независимо.
- `useTransientMessage.ts` очищает success/status messages по таймеру и при размонтировании.

Desktop surface сохраняет минимальный рабочий canvas внутри overflow-safe container. Manager mobile surface имеет исходный viewport 430 × 812, а performer registration и performer response — общий viewport 430 × 979; все мобильные surfaces переходят в edge-to-edge режим на узком host viewport.

## Asset model

| Path                                          | Role                                                                          |
| --------------------------------------------- | ----------------------------------------------------------------------------- |
| `public/enterprise-slides/*.html`             | Runtime slide exports loaded by iframe                                        |
| `public/enterprise-slides/*.{png,svg,...}`    | Runtime dependencies referenced relatively by exported HTML                   |
| `public/api-slides/*`                         | Runtime API / Embedded exports and relative dependencies                      |
| `public/small-slides/*`                       | Runtime Small Business exports and relative dependencies                      |
| `public/court-slides/*`                       | Public code-authored and Pencil-exported court slides with shared styles      |
| `public/court-assets/*`                       | Public official third-party marks used by the court slides                    |
| `public/performer-registration-flow/assets/*` | Public Figma-sourced graphics plus the approved My Tax loading capture        |
| `public/performer-response-flow/assets/*`     | Public exact Figma graphics for performer-response states 2.1–2.3             |
| `public/winwork-logo.svg`                     | Runtime product wordmark                                                      |
| `public/demo-flows/*.png`                     | QA-only visual references; forbidden as interactive product surfaces          |
| `pencil/*.pen`                                | Approved editable design sources; not browser assets                          |
| `design-qa.md`                                | Recorded comparison and interaction evidence for the current Enterprise flows |
| `base_documentation/`                         | Historical bootstrap intent                                                   |

При замене HTML-экспорта все относительные assets должны оставаться рядом с ним. Runtime никогда не должен зависеть от `pencil/` или `/tmp`.

## Styling

`src/styles/globals.css` отвечает за application shell, selector, presentation controls, scene canvas и outer modal. `src/styles/demo-product.css` отвечает за recreated WinWork desktop/mobile UI. Деление нужно сохранять: presentation chrome не должен протекать в product recreation и наоборот.

## Build и deployment

Основной Vite build собирает защищённый SPA, второй build через `vite.court.config.ts` добавляет изолированный public entry в `dist/court-app/`. Vercel сначала запускает middleware; `/court` rewrites в `/court-app/court.html`, а защищённые filesystem misses идут в основной `/index.html`. Поэтому public bundle и его slides можно allowlist’ить по префиксу, не открывая основной SPA bundle или sales assets. Vercel компилирует `middleware.ts` и `api/` по compiler options корневого `tsconfig.json`; project reference на `tsconfig.node.json` для этого отдельного шага недостаточен. Относительные импорты server-side TypeScript используют runtime-окончание `.js`, которое TypeScript связывает с исходным `.ts` и Vercel сохраняет как поддерживаемый Edge import.

Третий build target через `vite.court-offline.config.ts` собирает Court entry без `publicDir`, после чего `scripts/package-offline-court.mjs` встраивает JavaScript, CSS, шесть slide documents и только необходимые публичные Court/flow assets в `dist/offline/Открыть презентацию WinWork.html`. Локальные пути разрешаются через manifest в `data:` URL, web-font запрос финального Pencil-слайда удаляется в пользу его system-font fallback, а CSP запрещает фоновые подключения. Staging-каталог удаляется после упаковки. Итог открывается напрямую через `file://`; внешний реестр ФНС остаётся обычной пользовательской ссылкой и не является runtime-зависимостью презентации.

Sales offline build через `vite.sales-offline.config.ts` использует `src/app/offline-main.tsx` и `createSalesRoutes(true)`: те же страницы и компоненты, но `createHashRouter` и скрытый gateway logout. `src/presentation/config/sales.ts` задаёт общий список tracks для router и build-manifest. `scripts/package-offline-sales.mjs` встраивает 37 активных слайдов из manifest, изображения (включая CSS backgrounds и соседние logos), Inter из `src/assets/sales/`, обе performer asset directories и manager login graphic. Для четырёх экспортов с Tailwind CDN utility CSS компилируется установленным Tailwind при сборке; внешний script удаляется. Onboarding imports включают шрифты и PDF/Excel; его hash в общем файле — `#/onboarding#topup`, а каталог содержит возврат на главную. `scripts/offline-assets.mjs` переиспользуется Court и Sales; Court сохраняет собственный ограниченный manifest. CSP запрещает runtime-сеть, JS/CSS/data assets встроены, staging удаляется. Результат — `dist/offline/Открыть продажи WinWork.html`.

CI устанавливает frozen pnpm lockfile под Node version из `.node-version`, Google Chrome и запускает `pnpm check` (статические проверки, build, web/offline smoke); полный build создаёт автономные Court, Onboarding и Sales HTML-файлы. Environment values на этапе CI не требуются, потому что gateway читает их только во время Vercel request.

## Расширение

Перед изменением используйте task-specific playbook в [`agents/change-playbooks.md`](agents/change-playbooks.md). Новый scene type допустим только если `slide`, `demo` и `media` не выражают требование; новый track добавляется data config + shallow route + selector card, без нового runtime.

## Standalone onboarding

The protected `/onboarding` route and standalone offline entry share `OnboardingPrototype` and the tariff/top-up/company/marketplace React flows through `OnboardingShell` and `OnboardingHelp`. This is a task catalog with `#tariff` / `#topup` / `#company` / `#marketplace` navigation, separate from track/scene dispatch. Its isolated styles and assets do not enter the public Court bundle. Contextual cards measure target bounds; the local help panel supports resume/repeat. Safe local-storage checkpoints persist only fixture-field identifiers and completion flags. See [onboarding.md](onboarding.md) for flow boundaries, source evidence and offline packaging.

## Standalone feature prototypes

Отчёты входят через `contracting-reports-offline.html` и `src/contracting/reports/offline-main.tsx`, используют `HashRouter` и общую `ContractingShell`, но не слайдовый `Presentation`. `ContractingReports.tsx` управляет ролью, навигацией, параметрами отчётов, локальным хранением и временем готовности; `data.ts` вычисляет выборку/итоги; `workbook.ts` создаёт XLSX в браузере. Сохраняются параметры, а не неизменяемый снимок строк. Контракт и бизнес-смысл — в [reports.md](reports.md).

Таблица «Мои исполнители» имеет отдельный вход `src/performers/offline-main.tsx` и упаковку `scripts/build-offline-performers.mjs`; переиспользует кабинет, хранит настройки локально. Эти прототипы не добавляют production API или маршруты в sales-приложение. Отдельные сборки не входят в обычный `pnpm build`/`pnpm check`.
