# Agent file map

## Context ownership

| Path                                                                            | Owns                                                                    | Load when                            |
| ------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------ |
| `README.md`, `docs/README.md`                                                   | Entry points, local artifact/command navigation                         | Starting in the repository           |
| `docs/winwork/README.md`                                                        | Compact product model, roles and terminology                            | New to WinWork                       |
| `docs/winwork/features.md`                                                      | Feature coverage and current user clarifications                        | Designing a function                 |
| `docs/winwork/sources.md`                                                       | Provenance, source freshness and superseded decisions                   | Resolving a disputed claim           |
| `docs/project-context.md`                                                       | Presentation rationale, audiences, project evolution                    | Understanding why an artifact exists |
| `docs/contracting.md`, `docs/reports.md`, `docs/court.md`, `docs/onboarding.md` | Focused business and runtime contracts                                  | Working in that domain               |
| `description/`                                                                  | Detailed dated product/portfolio catalogue, F01–F75 and source evidence | A linked topic needs more depth      |
| `For Printing/`                                                                 | Dated Court captures and print ordering                                 | Preparing print material             |

The neighbouring portfolio project and private chats are provenance, not runtime dependencies. Their useful context is distilled under `docs/winwork/`; do not import editorial placeholders or confidential metrics into product UI.

Development tooling is owned by `scripts/doctor.mjs`, `playwright.config.ts`, `tests/`, `.codex/environments/environment.toml`, `.vscode/`, `package.json` and `.github/workflows/ci.yml`. Update [../development.md](../development.md) and the `development-environment` task area when their commands or responsibilities change. Browser reports belong in ignored `test-results/` and `playwright-report/`.

## Runtime dependency flow

```text
Incoming request
  -> middleware.ts (password/session gate)
     -> POST /api/auth/login -> Edge Function
     -> auth/session.ts (shared env, HMAC, cookie contract)
  -> Vercel static output + SPA rewrite
  -> browser
  -> src/main.tsx
  -> src/app/App.tsx
  -> src/app/router.tsx
  -> TrackSelector -> DemoFlowModal (temporary QA quick access)
  -> track PresentationConfig
  -> Presentation (URL, navigation, reset, fullscreen)
  -> SceneRenderer
     -> SlideScene -> PencilSlide -> exported HTML + optional DemoFlowModal
     -> DemoScene (generic fixture placeholder)
     -> MediaScene (placeholder)

Public court request
  -> middleware.ts (explicit GET/HEAD allowlist)
  -> /court rewrite -> /court-app/court.html
  -> src/court/main.tsx
  -> shared Presentation -> court config -> code-authored or Pencil-exported court slide

Offline court file
  -> court-offline.html -> src/court/offline-main.tsx -> HashRouter + OfflineInteractionHints
  -> shared Presentation -> court config -> shared slide/demo renderers
  -> publicAssetUrl -> build-time embedded data URL manifest
  -> scripts/package-offline-court.mjs -> dist/offline/Открыть презентацию WinWork.html

Offline contracting editions
  -> contracting-offline.html -> src/contracting/offline-main.tsx -> HashRouter
  -> shared Presentation -> edition's slides and stages -> role/stage shell + component scenes
  -> scripts/package-offline-contracting.mjs -> five standalone HTML files in dist/offline/

Offline My Performers table
  -> performers-offline.html -> src/performers/offline-main.tsx -> ContractingShell + PerformersTable
  -> scripts/build-offline-performers.mjs -> dist/offline/Мои исполнители — WinWork.html

Offline contracting reports
  -> contracting-reports-offline.html -> src/contracting/reports/offline-main.tsx -> HashRouter
  -> ContractingReports + ContractingShell -> form/list/detail -> data.ts + workbook.ts
  -> scripts/package-offline-contracting.mjs reports -> standalone reports HTML

DemoFlowModal
  -> DemoProduct(flowId)
  -> RegistrationDemo | PerformerRegistrationDemo | PerformerResponseDemo | TaskPaymentDemo | DesktopDemos | ManagerAppDemo
  -> ProductUI primitives + demo-product.css
```

## Ownership map

| Path                                                                                                                  | Owns                                                                                                                                      | Couple changes with                                                             |
| --------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `middleware.ts`                                                                                                       | Shared-password login/logout, signed session cookie, fail-closed request gate                                                             | `.env.example`, Vercel runtime checks, access docs                              |
| `api/auth/login.ts`                                                                                                   | Password form parsing, credential check, session issue, invalid-password redirect                                                         | Middleware allow-path and shared session module                                 |
| `auth/session.ts`                                                                                                     | Server-only env validation, return path, cookie, HMAC, expiry, password comparison                                                        | Middleware, login Function, auth contract check                                 |
| `.env.example`                                                                                                        | Names and minimum requirements of server-only access secrets                                                                              | Middleware and Vercel environment setup                                         |
| `tsconfig.json`                                                                                                       | Root TypeScript options consumed directly by Vercel Function and Middleware compilers                                                     | Server entrypoint imports and runtime globals                                   |
| `src/app/router.tsx`                                                                                                  | Protected SPA route-to-config mapping                                                                                                     | Track selector and target config                                                |
| `src/court/main.tsx`, `court.html`                                                                                    | Isolated public court entry and shared product-demo styles                                                                                | Court config, demo CSS, public build, middleware allowlist                      |
| `src/court/offline-main.tsx`, `src/court/OfflineInteractionHints.tsx`, `court-offline.html`                           | File-origin Court entry, three-button chrome, and contextual action hints using hash-backed history                                       | Shared Court config/engine, global presentation CSS, offline Vite config        |
| `vite.court-offline.config.ts`, `scripts/package-offline-court.mjs`                                                   | Single-file Court build, asset embedding, staging cleanup, and offline CSP                                                                | Court slides/assets, public asset resolver, package scripts                     |
| `src/presentation/publicAssetUrl.ts`                                                                                  | Web asset paths, embedded offline data URLs, and decoded HTML for offline slide srcDoc                                                    | Slide iframe and Court demo image consumers                                     |
| `src/app/salesRoutes.tsx`, `src/presentation/config/sales.ts`                                                         | Shared sales routes and track list for web/offline                                                                                        | Main router, offline entry, Vite slide manifest                                 |
| `src/app/offline-main.tsx`, `sales-offline.html`, `vite.sales-offline.config.ts`, `scripts/package-offline-sales.mjs` | Single-file sales app with all demos and onboarding                                                                                       | Shared routes, public assets, onboarding hash prefix                            |
| `src/contracting/`, `vite.contracting-offline.config.ts`, `scripts/package-offline-contracting.mjs`                   | Offline contracting scenario, role chrome, product states, and single-file build                                                          | Shared presentation engine, product primitives, and `tests/contracting.spec.ts` |
| `src/performers/`, `performers-offline.html`, `scripts/build-offline-performers.mjs`                                  | Standalone My Performers table, typed synthetic rows, original cell icons in `src/assets/performers/`, column controls, and offline build | Contracting desktop shell, WinWork fonts, and offline asset helpers             |
| `scripts/offline-assets.mjs`, `src/assets/sales/`                                                                     | Shared Court/Sales embedding helpers and licensed Inter fonts                                                                             | Both packagers and slide CSS                                                    |
| `src/app/TrackSelector.tsx`                                                                                           | Landing cards, QA flow shortcuts, fullscreen entry attempt, and access logout                                                             | Routes, demo flows, auth contract, and track readiness                          |
| `src/presentation/engine/types.ts`                                                                                    | Scene/config/demo-flow contracts                                                                                                          | All exhaustive render/dispatch switches                                         |
| `src/presentation/engine/Presentation.tsx`                                                                            | `?scene`, history writes, shortcuts, fullscreen, presentation reset                                                                       | Controls and all-route browser verification                                     |
| `src/presentation/engine/PresentationControls.tsx`                                                                    | Home, counter, picker, previous/next, reset, fullscreen controls                                                                          | Presentation callbacks and accessibility labels                                 |
| `src/presentation/engine/SceneRenderer.tsx`                                                                           | Scene-type dispatch, transition, scene remount boundary                                                                                   | Scene contracts/components                                                      |
| `src/presentation/config/enterprise.ts`                                                                               | Ordered 17-scene Enterprise route with stable sparse IDs and slide metadata                                                               | Matching HTML exports and demo-flow bindings                                    |
| `src/presentation/config/api.ts`                                                                                      | Ordered eight-scene API / Embedded route with stable sparse scene IDs                                                                     | Matching HTML exports                                                           |
| `src/presentation/config/small.ts`                                                                                    | Ordered 12-scene Small Business route and reused single-task binding                                                                      | Matching HTML exports and demo-flow binding                                     |
| `src/presentation/config/court.ts`                                                                                    | Ordered six-scene public court route, registry link, court demo bindings, and final Pencil statistics slide                               | Court slides/assets, shared demo flows, public entry                            |
| `src/presentation/config/shared.ts`                                                                                   | Shared placeholder definitions                                                                                                            | Placeholder track contracts only                                                |
| `src/presentation/scenes/SlideScene.tsx`                                                                              | Pencil-backed versus placeholder slide selection                                                                                          | `PencilSlide` and slide definition                                              |
| `src/presentation/slides/PencilSlide.tsx`                                                                             | 1920 × 1080 scaling, iframe, measured CTA/link overlays with config fallback, dialog open state                                           | Slide data-demo-flow markers, asset transport, hotspot bounds, modal behavior   |
| `src/demos/flows/enterprise.ts`                                                                                       | Five slide-hotspot definitions plus standalone quick-access flow definitions                                                              | Track slide mappings, `DemoFlowId`, dispatcher                                  |
| `src/presentation/flows/DemoFlowModal.tsx`                                                                            | Portal, modal reset, focus trap/restore, close semantics                                                                                  | Presentation keyboard guard and modal CSS                                       |
| `src/presentation/flows/DemoProduct.tsx`                                                                              | Exhaustive flow-ID-to-component dispatch                                                                                                  | `DemoFlowId` and flow component exports                                         |
| `src/presentation/flows/RegistrationDemo.tsx`                                                                         | Resettable legal-entity sign-in, registration, email, and cabinet flow                                                                    | Quick access, shared desktop shell, demo CSS                                    |
| `src/presentation/flows/TaskPaymentDemo.tsx`                                                                          | Resettable Marketplace, task-panel tabs, SMS confirmation, and paid-status flow                                                           | MarketplacePage, marketplaceData, shared desktop shell, demo CSS                |
| `src/presentation/flows/PerformerSelectionDemo.tsx`                                                                   | Resettable Marketplace and three-response performer-selection flow                                                                        | MarketplacePage, marketplaceData, shared desktop shell, demo CSS                |
| `src/presentation/flows/PerformerReviewsDrawer.tsx`                                                                   | Shared accessible performer-review drawer used by selection and completed-task payment                                                    | Selection/payment performer cards and demo CSS                                  |
| `src/presentation/flows/MarketplacePage.tsx`                                                                          | Shared desktop Marketplace heading, actions, filters, table, and pagination                                                               | Single-task, performer-selection, task-payment, demo CSS                        |
| `src/presentation/flows/marketplaceData.ts`                                                                           | Deterministic synthetic task rows and their shared type                                                                                   | MarketplacePage and scenario-specific task overrides                            |
| `src/presentation/flows/DesktopDemos.tsx`                                                                             | Four desktop product flows and their local state                                                                                          | Product primitives, demo CSS, reference images                                  |
| `src/presentation/flows/ManagerAppDemo.tsx`                                                                           | Stateful manager mobile app flow                                                                                                          | Demo CSS and mobile references                                                  |
| `src/presentation/flows/PerformerRegistrationDemo.tsx`                                                                | Ordered 11-state performer registration with click-through navigation                                                                     | Figma assets, quick access, demo CSS                                            |
| `src/presentation/flows/PerformerResponseDemo.tsx`                                                                    | Ordered Figma states 2.1–2.3 for the performer-response path                                                                              | Figma assets, quick access, court binding, demo CSS                             |
| `src/presentation/flows/ProductUI.tsx`                                                                                | Shared desktop shells, fields, drawer, modal, toast                                                                                       | Desktop/mobile consumers and demo CSS                                           |
| `src/presentation/flows/useTransientMessage.ts`                                                                       | Self-clearing local status messages                                                                                                       | Consumers that navigate/reset while a toast is visible                          |
| `src/styles/globals.css`                                                                                              | App shell, track selector, presentation controls, slide/modal layout                                                                      | Runtime and responsive behavior                                                 |
| `src/styles/demo-product.css`                                                                                         | Product recreation styling                                                                                                                | Demo components and approved visual references                                  |
| `public/enterprise-slides/`                                                                                           | Runtime Enterprise slide HTML and relative dependencies                                                                                   | Enterprise config and Pencil export source                                      |
| `public/api-slides/`                                                                                                  | Runtime API / Embedded slide HTML and relative dependencies                                                                               | API config and Pencil export source                                             |
| `public/small-slides/`                                                                                                | Runtime Small Business slide HTML and relative dependencies                                                                               | Small config and Pencil export source                                           |
| `public/court-slides/`                                                                                                | Runtime code-authored and Pencil-exported public court slides                                                                             | Court config, public assets and browser verification                            |
| `public/court-assets/`                                                                                                | Official public marks used only by court slides                                                                                           | Court slides and source verification                                            |
| `public/performer-registration-flow/`                                                                                 | Figma-sourced logos, flags, illustrations, and approved My Tax loading capture                                                            | React screens, court public access                                              |
| `public/performer-response-flow/`                                                                                     | Exact Figma-sourced graphics for performer-response states 2.1–2.3                                                                        | React screens, court public access                                              |
| `public/demo-flows/`                                                                                                  | QA-only flow screenshots                                                                                                                  | `design-qa.md`; never interactive runtime rendering                             |
| `public/winwork-logo.svg`                                                                                             | Runtime wordmark used by demo shells                                                                                                      | Product UI and manager login                                                    |
| `pencil/*.pen`                                                                                                        | Approved editable design sources                                                                                                          | Exported runtime/reference assets when explicitly updated                       |
| `design-qa.md`                                                                                                        | Latest recorded Enterprise visual/interaction evidence                                                                                    | Current implementation evidence only                                            |
| `vercel.json`                                                                                                         | SPA rewrite after the access gateway                                                                                                      | Middleware, router paths, and deployment verification                           |

## Demo bindings

| Scene      | Flow ID                  | Entry definition                        | React implementation        |
| ---------- | ------------------------ | --------------------------------------- | --------------------------- |
| `ent-04`   | `create-object`          | `enterpriseDemoFlows.createObject`      | `CreateObjectDemo`          |
| `ent-05`   | `manager-app`            | `enterpriseDemoFlows.managerApp`        | `ManagerAppDemo`            |
| `ent-07`   | `create-activity`        | `enterpriseDemoFlows.createActivity`    | `CreateActivityDemo`        |
| `ent-08`   | `document-templates`     | `enterpriseDemoFlows.documentTemplates` | `DocumentTemplatesDemo`     |
| `ent-09`   | `single-task`            | `enterpriseDemoFlows.singleTask`        | `SingleTaskDemo`            |
| `smb-06`   | `single-task`            | reused as `smallSingleTaskDemo`         | `SingleTaskDemo`            |
| `court-02` | `registration`           | reused as `customerRegistrationFlow`    | `RegistrationDemo`          |
| `court-02` | `single-task`            | reused as `singleTaskFlow`              | `SingleTaskDemo`            |
| `court-03` | `performer-registration` | reused as `performerRegistrationFlow`   | `PerformerRegistrationDemo` |
| `court-03` | `performer-response`     | reused as `performerResponseFlow`       | `PerformerResponseDemo`     |
| `court-04` | `performer-selection`    | reused as `performerSelectionFlow`      | `PerformerSelectionDemo`    |
| `court-05` | `task-payment`           | reused as `paymentConfirmationFlow`     | `TaskPaymentDemo`           |

Quick access also exposes `task-payment` through `enterpriseDemoFlows.taskPayment`; `court-05` overrides its zero default bounds to align with the visible payment-confirmation CTA. Opening the completed target task starts on `Действия`; all five tabs remain available, and the performer card shares the selection-flow styling and clickable review drawer.

Quick access exposes `performer-selection` through `enterpriseDemoFlows.performerSelection`; `court-04` overrides its zero default bounds to align with the visible performer-selection CTA. The flow opens its target Marketplace row on the `Отклики (3)` tab and keeps all accept/reject decisions local to the modal mount.

Quick access and `court-03` expose `performer-registration`. It mounts `PerformerRegistrationDemo`, renders 11 ordered Figma-derived states, advances on any screen click, and keeps every state in one shared-height scrollable viewport. The product surfaces are React/CSS except for the explicitly approved full-screen `Мой налог` loading capture.

Quick access and the second CTA on `court-03` expose `performer-response`. It mounts `PerformerResponseDemo`, renders Figma states 2.1–2.3 inside a shared-height mobile viewport, and keeps task opening, Back, response submission, and scroll reset local to the modal mount.

## Asset roles

| Asset class                                   | Runtime?                                 | Rule                                                                                       |
| --------------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------ |
| `public/enterprise-slides/*.html`             | Yes                                      | Loaded by iframe; preserve 1920 × 1080 output and relative dependencies.                   |
| `public/enterprise-slides/*.{png,jpg,svg}`    | Yes when referenced by HTML              | Keep beside exports; verify missing-resource errors.                                       |
| `public/api-slides/*`                         | Yes when referenced by API config/HTML   | Follow the same export and dependency rules as Enterprise.                                 |
| `public/small-slides/*`                       | Yes when referenced by Small config/HTML | Follow the same export and relative-dependency rules as Enterprise.                        |
| `public/performer-registration-flow/assets/*` | Yes, public                              | Exact Figma graphics and approved My Tax capture; keep GET/HEAD-only access deterministic. |
| `public/performer-response-flow/assets/*`     | Yes, public                              | Exact Figma graphics for states 2.1–2.3; keep GET/HEAD-only access deterministic.          |
| `public/demo-flows/*.png`                     | No                                       | Visual comparison only; do not use for interaction.                                        |
| `public/winwork-logo.svg`                     | Yes                                      | Shared product wordmark.                                                                   |
| `pencil/*.pen` and adjacent source assets     | No                                       | Editable design source/reference, not a browser path.                                      |
| `/tmp/*` paths in `design-qa.md`              | No                                       | Ephemeral evidence from the recorded QA run; do not depend on them.                        |

## Onboarding catalog

`/onboarding` → `src/onboarding/OnboardingPrototype.tsx` → `TariffOnboardingDemo.tsx` / `TopUpOnboardingDemo.tsx` / `CompanyOnboardingDemo.tsx` / `MarketplaceOnboardingDemo.tsx`, with shared `OnboardingShell.tsx`, `OnboardingHelp.tsx` and `OnboardingTour.tsx`. `tariffState.ts`, `topUpState.ts`, `companyState.ts` and `marketplaceState.ts` own separate progress; `MarketplaceTaskForm.tsx` serves task creation and read-only details; `TariffPage.tsx` and `TopUpInvoice.tsx` are shared by tariff and top-up; `bankRequisites.ts` owns the three synthetic bank fixtures and copying; `topUpAssets.ts` maps them to embedded QR, PDF/XLSX and requisites downloads. `onboardingTypes.ts` owns the shared flow ID union. Styles and source assets are isolated in `src/styles/onboarding.css` and `src/assets/onboarding/`. The offline entry uses the same components through `vite.onboarding-offline.config.ts` and `scripts/package-offline-onboarding.mjs`. Start with [../onboarding.md](../onboarding.md); this flow does not extend `DemoFlowId` or the Court bundle.
