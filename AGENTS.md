# WinWork presentations and product prototypes

## Read first

1. Read this file completely.
2. Open `docs/agents/context-index.json`, select the task area that matches the request, and read only its `readFirst` files before broader exploration.
3. Use `docs/agents/file-map.md` when ownership or change coupling is unclear.
4. Use `docs/agents/change-playbooks.md` for repeatable change sequences.

If you are new to WinWork, read `docs/winwork/README.md` once before product work. `docs/README.md` is the human documentation index. Load only the relevant feature/topic after that; do not ingest the whole `description/` catalogue or chat history for every task.

## Project purpose and product context

This folder now supports WinWork feature design and local interactive prototypes as well as sales/court presentations. Product background and current user clarifications live in `docs/winwork/`; project rationale lives in `docs/project-context.md`. Start contractor work with `docs/contracting.md`, report work with `docs/reports.md`, and Court work with `docs/court.md`.

Keep three claims distinct: described WinWork product behavior, behavior actually implemented in this local prototype, and proposed/future production behavior. Latest direct user clarifications take precedence for intent; executable code defines what the prototype currently does. ChatGPT suggestions, portfolio placeholders and dated plans are not released product facts. Source provenance and reconciled conflicts are in `docs/winwork/sources.md`. The broader purpose does not authorize real backend/API/payment integrations.

## Source of truth

Use this precedence when sources disagree:

1. Executable code, `package.json`, toolchain config, and runtime assets referenced from `public/`.
2. `AGENTS.md` and focused current documentation under `docs/`.
3. Approved Pencil source and visual references under `pencil/`, plus `design-qa.md`.
4. `description/` (dated product/portfolio evidence) and `base_documentation/` (historical bootstrap intent), rather than current implementation state.

Never preserve a stale documentation claim over working code. Update the focused document in the same change when behavior, ownership, commands, routes, or file locations change.

## Current implementation state

- This repository contains deterministic presentations and local WinWork feature prototypes, not the production WinWork product.
- `/enterprise` is implemented as 17 exported Pencil slides. Existing scene IDs stay stable: the new `ent-18` is ordered after `ent-13`, while removed `ent-15` remains unavailable. Slides `ent-04`, `ent-05`, `ent-07`, `ent-08`, and `ent-09` open component-based React demo flows.
- `/small` is implemented as 12 exported Pencil slides. Slide `smb-06` reuses the component-based `single-task` demo flow.
- `/api` is implemented as eight exported Pencil slides with no interactive demo flows. Retained scenes keep stable IDs; removed `api-03` remains unavailable, and the final scene is `api-17`.
- `/court` is a public six-slide presentation for court demonstrations. The first five slides are code-authored and the final statistics slide is exported from Pencil. It uses an isolated public Vite bundle; `court-02` opens the legal-entity registration and single-task React demo flows, `court-03` opens performer registration and the three-state performer-response flow, `court-04` opens performer selection, and `court-05` opens the completed-task payment flow.
- `pnpm build:court:offline` produces `dist/offline/Открыть презентацию WinWork.html`: one self-contained file with the same six Court scenes and demo-flow components, hash-backed scene history, embedded runtime assets, three always-visible bottom-left navigation buttons, outline-only action hints inside demo flows (except the performer-selection drawer), and no server or installation requirement. Slide-background clicks never trigger hints; Court hover/focus overlays follow the rendered CTA bounds.
- `pnpm build:sales:offline` produces `dist/offline/Открыть продажи WinWork.html`: one password-free HTML containing the same landing page, 37 sales slides (17 Enterprise, 12 Small, 8 API), all 10 quick-access demos and all four onboarding scenarios. Shared sales routes use hash history and standard presentation controls. Inter, slide utility CSS, runtime images and onboarding downloads are embedded; no network or installation is required. The online gateway remains unchanged.
- `pnpm build:contracting:offline` produces five standalone files in `dist/offline/`. The full deck `Открыть подрядную схему WinWork.html` has five Pencil slides and the 15-stage, 35-screen prototype across customer, contractor, and performer. The prototype-only edition starts at the first demo screen. Each interactive audience deck includes five slides, the audience's cabinet and the performer app. The short customer deck contains ten static Pencil slides: four introductory slides, a three-step overview, connection, task creation, acceptance/payment, object limits, and the closing payment-control summary. One always-visible WinWork toolbar serves all editions. The shared engine owns hash history, reset, and shortcuts. The performer confirms completion before the contractor signs and the customer accepts and pays. See `docs/contracting.md` for filenames and targeted builds.
- `pnpm build:contracting:reports` separately packages a customer/contractor report prototype. It supports task registers, company summaries, period/status selection, local generation, same-window viewing and XLSX. It persists report parameters locally and derives rows from synthetic fixtures. Read `docs/reports.md`; do not interpret its simplified paid/completed mapping as production accounting.
- `pnpm build:performers:offline` separately packages the My Performers table prototype. Its synthetic rows, cell types, column settings, filters and sorting are owned by `src/performers/`. These standalone features are not sales routes or extra slides.
- The landing-page quick-access panel also exposes component-based `performer-selection`, `performer-registration`, and `performer-response` flows. Performer registration recreates the 11 approved Figma states with React surfaces and exact exported raster assets; only the explicitly approved `Мой налог` loading state is a full-screen capture. Any screen click advances, and content taller than the shared viewport scrolls vertically. Performer response recreates Figma states 2.1–2.3 with semantic actions for opening the target task, submitting the response, and returning from its detail screen.
- The active scene is URL state in `?scene=<stable-id>`; presentation and demo state are local and resettable.
- Exported slide HTML under `public/enterprise-slides/`, `public/api-slides/`, and `public/small-slides/`, code-authored and Pencil-exported HTML/CSS under `public/court-slides/`, and the Figma-sourced visual assets under `public/performer-registration-flow/` and `public/performer-response-flow/` are runtime content. PNG files under `public/demo-flows/` remain QA references and must not be used as interactive product UI.
- The Vercel access gateway uses Routing Middleware to protect the sales routes/assets and an Edge Function to process the password form. The narrowly allowlisted `/court`, `/court-app/*`, `/court-slides/*`, `/court-assets/*`, `/performer-registration-flow/*`, `/performer-response-flow/*`, and shared WinWork wordmark are public; all other deployed routes/assets remain fail-closed. This is the only server-side behavior and uses `WINWORK_ACCESS_PASSWORD` plus `WINWORK_SESSION_SECRET` for a signed 30-day cookie.
- There is no account system, product backend, database, analytics, production API, or real user identity.

- `/onboarding` is a protected standalone catalog for onboarding prototypes; `#tariff` starts commission reduction and `#company` starts company information (home → settings → public profile → save). `#marketplace` starts the first task (home → marketplace → single task form → create → new row → details and responses). `#topup` teaches account top-up through separate “Тариф” / “Пополнение” tabs, copied/downloaded requisites, an inline PDF/Excel invoice form and an always-visible demo QR. A shared three-bank selector updates QR, invoice and requisites together. This scenario sits between commission reduction and the first task. All four use the shared home, shell, help list and independent progress/reset. Catalog reset controls live inside their own flow cards. It recreates the authorized dev home, tariff, application drawer and success dialog with semantic React and synthetic data. The bell precedes the training and account cards; training opens “Первые шаги”; first entry starts guidance. Checkpoints persist without storing typed identity data. `pnpm build:onboarding:offline` packages the same components as `dist/offline/Открыть онбординг WinWork.html`. Start changes with `docs/skills/winwork-onboarding/SKILL.md` and `docs/onboarding.md`. Fields, the selfie surface and company logo fill synthetic values on click; no typing or file picker is needed.

## Hard boundaries

- Never connect real WinWork services or introduce network-backed product behavior unless the task explicitly changes this boundary.
- Never expose, hard-code, log, or prefix the access-gateway secrets with `VITE_`; keep real values in Vercel or ignored local environment files.
- Never use real personal, customer, company, worker, payment, or conversation data. Keep visible demo data obviously synthetic and deterministic.
- Do not render product screenshots as interactive demos unless the task explicitly approves a screenshot-only temporary flow. Product flows otherwise remain semantic React controls with local state; screenshots under `public/demo-flows/` are comparison evidence only.
- Do not invent product claims, sales copy, or a design system. Use approved Pencil/design inputs and clearly mark unavailable tracks or scenes as placeholders.
- Keep React, TypeScript, Vite, React Router, Tailwind CSS, Motion, and pnpm unless a concrete requirement justifies a change.
- Do not turn the runtime into a CMS, slide editor, universal presentation framework, or full WinWork clone.
- Do not commit, push, deploy, or mutate external services unless the current task explicitly authorizes it.

## Architecture invariants

- One shared presentation engine serves all tracks. The protected tracks use the main router; the public court track has an isolated entry so protected bundle assets stay private.
- The offline Court entry reuses the same config, presentation engine, slide renderer, and demo components. Its allowed presentation-shell differences are limited to the `file://` router/asset transport, the three-button navigation variant, and contextual action hints; it must not fork scene/demo behavior or package protected-track slide exports and their adjacent assets.
- Deployed requests fail closed in `middleware.ts`: unauthenticated visitors cannot fetch the protected SPA bundle, protected exported slides, or their adjacent assets. Only the explicit court allowlist is public.
- The offline sales entry shares `createSalesRoutes`, sales configs, the engine and demo implementations with the protected SPA. Offline differences are hash routing, embedded assets and omission of gateway logout. Onboarding uses `#/onboarding#<flow>` in the combined artifact and preserves its existing hashes elsewhere.
- Track configs define scene order; renderers and product primitives are shared.
- Scene IDs are unique and stable within a track because they are public deep-link values.
- URL state owns the active scene. Browser Back/Forward and unrelated query parameters must keep working.
- Presentation reset remounts the current scene; modal reset remounts the selected demo flow. No demo state may leak between scenes or openings.
- Global presentation shortcuts must ignore editable controls and open demo dialogs.
- Dialogs retain semantic controls, focus trapping/restoration, `Escape` close, and reduced-motion behavior.
- Desktop product demos keep a stable minimum canvas inside an overflow-safe viewport. The manager demo remains a bounded 430 × 812 mobile surface and adapts on narrow hosts.
- Prefer extending discriminated unions and exhaustive switches over stringly typed dispatch or duplicated engines.

## Change routing

| Change                               | Start with                                                          | Usually changes with                                                                                                             |
| ------------------------------------ | ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Password access gateway              | `middleware.ts`, `api/auth/login.ts`                                | shared session module, root TS config, Vercel verification                                                                       |
| Route or track card                  | `src/app/router.tsx`                                                | track config, middleware/public build when access differs, browser verification                                                  |
| Scene order/copy/ID                  | `src/presentation/config/*.ts`                                      | exported slide asset, direct-link verification                                                                                   |
| Runtime/navigation/reset             | `src/presentation/engine/Presentation.tsx`                          | controls, renderer, types, all-track browser checks                                                                              |
| Exported track slide                 | matching `src/presentation/config/*.ts`                             | matching `public/*-slides/`, Pencil source/reference                                                                             |
| Demo hotspot or flow ID              | `src/demos/flows/enterprise.ts`                                     | engine types, matching track config, `DemoProduct.tsx`                                                                           |
| Desktop demo behavior                | `src/presentation/flows/DesktopDemos.tsx`                           | `ProductUI.tsx`, `demo-product.css`, QA references                                                                               |
| Manager mobile behavior              | `src/presentation/flows/ManagerAppDemo.tsx`                         | `demo-product.css`, QA references                                                                                                |
| Performer registration               | `src/presentation/flows/PerformerRegistrationDemo.tsx`              | Figma assets, quick access, `DemoProduct.tsx`, `demo-product.css`                                                                |
| Performer response                   | `src/presentation/flows/PerformerResponseDemo.tsx`                  | Figma assets, quick access, court binding, `DemoFlowModal.tsx`, demo CSS                                                         |
| Offline sales package                | `vite.sales-offline.config.ts`, `scripts/package-offline-sales.mjs` | shared sales routes/configs, `scripts/offline-assets.mjs`, fonts, onboarding hash prefix, file-origin verification               |
| Offline contracting deck             | `docs/contracting.md`, `src/contracting/scenario.tsx`               | `src/contracting/`, `vite.contracting-offline.config.ts`, `scripts/package-offline-contracting.mjs`, Chrome offline verification |
| Contracting reports                  | `docs/reports.md`, `src/contracting/reports/data.ts`                | `src/contracting/reports/`, shared cabinet shell, standalone package and report tests                                            |
| Product context or new feature brief | `docs/winwork/README.md`, `docs/winwork/features.md`                | Topic document, `docs/winwork/sources.md`, context index; runtime only when requested                                            |
| Offline Court package                | `vite.court-offline.config.ts`, `scripts/package-offline-court.mjs` | offline entry, public asset resolver, Court slides/assets, browser verification                                                  |
| Scene type                           | `src/presentation/engine/types.ts`                                  | renderer, scene component, configs, architecture docs                                                                            |
| Agent documentation                  | `docs/agents/context-index.json`                                    | relevant focused docs, `pnpm docs:check`                                                                                         |

## Working agreements

- Keep the actual `.git` directory inside this project root. Never create external worktrees, Git pointer files, or a separate Git directory.
- Use Google Chrome explicitly for websites, localhost and browser tests. Report an unavailable Chrome installation instead of switching browsers.
- For development setup, Codex actions, editor integration and browser-test ownership, start with `docs/development.md` and the `development-environment` task area.
- Preserve existing uncommitted work. Apply focused changes and format only the files touched by the current task.
- Use `pnpm`; do not create npm or Yarn lockfiles.
- Prefer focused components and direct imports. Keep `App` as composition glue.
- Reuse scene definitions, product primitives, and renderers instead of copying track-specific implementations.
- Keep presentation state separate from scene-local demo state.
- Do not add dependencies, abstractions, directories, environment variables, or test infrastructure speculatively.
- Preserve semantic buttons/fields, focus visibility, keyboard guards, browser history, fullscreen fallback, and reduced motion.
- Keep static export filenames deterministic. When HTML uses relative images, keep those dependencies beside the HTML under its `public/*-slides/` directory.

## Commands

- Install: `pnpm install --frozen-lockfile`
- Develop: `pnpm dev`
- Diagnose local tools: `pnpm doctor`
- Fast gate without build/browser tests: `pnpm check:quick`
- Browser smoke tests in Google Chrome: `pnpm test:e2e`
- Offline smoke tests after build: `pnpm test:offline`
- Develop with auth: `pnpm dlx vercel@latest dev`
- Access-gateway contract: `pnpm auth:check`
- Documentation contract: `pnpm docs:check`
- Build offline onboarding HTML: `pnpm build:onboarding:offline`
- Build offline sales HTML: `pnpm build:sales:offline`
- Build offline Court HTML: `pnpm build:court:offline`
- Build all five offline contracting HTML files: `pnpm build:contracting:offline`
- Build standalone contracting reports: `pnpm build:contracting:reports`
- Test standalone contracting reports after build: `pnpm test:contracting:reports`
- Build standalone performers table: `pnpm build:performers:offline`
- Test offline contracting editions after build: `pnpm test:contracting`
- Full gate: `pnpm check`
- Individual gates: `pnpm auth:check`, `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm build`

## Verification matrix

- Documentation-only: `pnpm docs:check`, `pnpm format:check`, `git diff --check`.
- Code, style, asset, or configuration: `pnpm check`.
- The full gate includes Chrome smoke tests for sales navigation, demo lifecycle, onboarding catalog and all eight built offline HTML files. These checks supplement the task-specific interaction/visual matrix below.
- Standalone reports and performers-table builds are not included in `pnpm check`. Report changes additionally require `pnpm build:contracting:reports`, `pnpm test:contracting:reports` and the matrix in `docs/reports.md`; performers-table changes require its build and the `offline-performers-table` verification from the context index.
- Access-gateway changes: also verify missing configuration, wrong/correct password, preserved deep link, protected direct assets, tampered/expired cookie, 30-day persistence, password rotation, and logout through `vercel dev`.
- Runtime/navigation: also verify `/enterprise`, `/api`, and `/small`; direct valid and invalid `?scene=` values; Back/Forward; `ArrowLeft`/`ArrowRight`; `F`; reset; fullscreen entry/fallback.
- Demo-flow changes: also exercise open, primary interaction path, reset, close/reopen, focus restoration, `Escape`, keyboard isolation, and narrow-host behavior when relevant.
- Performer-response changes: also verify Figma states 2.1–2.3 at the shared 430 × 979 viewport, target-task navigation, back, response submission, submitted-state stability, scroll reset, and public asset access.
- Offline Court changes: open `dist/offline/Открыть презентацию WinWork.html` directly through `file://` with networking disabled; verify the three always-visible controls, contextual action hints, all six scenes, Back/Forward, shortcuts, reset, fullscreen fallback, every Court demo-flow path, embedded images, focus restoration, `Escape`, zero runtime HTTP requests, and no console errors.
- Offline sales changes: open `dist/offline/Открыть продажи WinWork.html` through `file://` with networking disabled; verify the landing, 37 slides/hotspots, all 10 demo paths, four onboarding scenarios/downloads, catalog return, hash history/direct links, keyboard/reset/fullscreen fallback, focus restoration, embedded fonts/images, zero HTTP requests and no console errors.
- Offline contracting changes require opening all five files through `file://` with networking disabled. In the full deck verify the five slides, the CTA and return to the fifth slide, all 15 prototype stages, role highlight, navigation and history, collapsible menu, both table layouts, right overlays, performer confirmation before contractor signature and customer payment, signed documents, mobile payout and zero HTTP requests. Verify that the prototype-only edition starts at the demo and that each interactive audience edition contains the intended cabinet and all performer screens, with matching toolbar options, role indicators and direct links. In the short customer deck verify all ten Pencil slides in order, the embedded images, direct links, scene selection and reset.
- Visual changes: compare the same state and viewport against the approved Pencil/PNG reference and update `design-qa.md` only with evidence from the current implementation.

## Definition of done

- Requested behavior is implemented without crossing repository boundaries.
- The proportional verification above passes.
- Agent documentation is updated when its facts, routes, task map, commands, or paths changed.
- Final diff contains no accidental business claims, real data, backend calls, secrets, generated junk, or unrelated files.

## Code review blockers

- Real product API, account authentication, analytics, hard-coded secret, or personal-data dependency.
- Fail-open access behavior or a protected route/asset that bypasses `middleware.ts`.
- Screenshot-backed fake interaction outside an explicitly approved screenshot-only flow.
- Duplicated track engine or unresettable/leaking demo state.
- Broken deep links, browser history, editable-field keyboard behavior, focus handling, or reduced motion.
- Runtime asset referenced from an untracked, temporary, or source-only path.
