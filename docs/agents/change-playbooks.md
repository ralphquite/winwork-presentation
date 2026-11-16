# Change playbooks

Use the smallest playbook that covers the request. Paths and invariants are also available in `context-index.json`.

## Start a WinWork feature or update product context

1. Read `docs/winwork/README.md` once, then the relevant area in `docs/winwork/features.md` and its focused document. Establish role, entity, user goal and scope before implementation.
2. Consult `docs/winwork/sources.md` for accepted user clarifications and source freshness. Read a historical catalogue section or original chat only when its extra detail affects the task.
3. Distinguish a product capability, behavior implemented locally and a proposal. Do not promote old assistant suggestions, normative numbers or portfolio placeholders to requirements.
4. Record the feature brief and decisions in the focused document; add the source and superseded rule when applicable. Keep the short product overview compact and route detail through the index.
5. If implementation is requested, choose the matching runtime playbook and shared UI; keep fixtures and state local. Reports reuse the contracting shell but are not presentation slides.
6. Documentation-only changes require `pnpm docs:check`, `pnpm format:check`, `git diff --check`. Runtime changes require the relevant full and targeted checks.

## Change contracting reports

1. Read `docs/reports.md`, `docs/contracting.md` and the `offline-contracting-reports` task area.
2. Keep customer reports scoped to contractors and contractor reports scoped to clients. A report register is not a payment instruction.
3. When changing period/status/sum semantics, change `src/contracting/reports/data.ts`, the UI labels, XLSX output and focused documentation together. Preserve the explicit distinction between report filters and in-view search.
4. Preserve role navigation, same-window preview, return/history, ready-state notification, local persistence, form focus/Escape and existing WinWork table typography.
5. Run `pnpm check`, then separately build and test reports: `pnpm build:contracting:reports`, `pnpm test:contracting:reports`. The latter pair is not included in the general gate.

## Change the development environment

1. Read `docs/development.md`, `package.json`, `scripts/doctor.mjs`, `playwright.config.ts` and `.github/workflows/ci.yml` together.
2. Keep Node/pnpm versions consistent with `.node-version` and the lockfile. Keep `.git` inside this root and use Google Chrome explicitly; do not create worktrees.
3. Keep tests deterministic and synthetic. Web smoke tests use a private Vite on port 5174; offline smoke tests consume the three outputs of `pnpm build` with networking disabled.
4. Include new TypeScript test/config files in `tsconfig.node.json`; ignore generated reports in Git, Prettier and documentation scanning. Do not weaken existing gates to bypass a failure.
5. Update Codex actions, focused docs and the context index when commands change. Run `pnpm doctor`, `pnpm check` and `git diff --check`.

## Change the password access gateway

1. Read root `middleware.ts`, `api/auth/login.ts`, `auth/session.ts`, and root `tsconfig.json` together. Middleware guards every request; only the Function reads the login body; shared crypto/cookie rules must not diverge. Vercel compiles these entrypoints from the root TypeScript options and does not follow the project's TS references. Keep relative server TypeScript imports on runtime `.js` specifiers so NodeNext compilation and Edge bundling agree.
2. Keep real values only in Vercel or ignored local environment files. `.env.example` contains names, never credentials.
3. Preserve fail-closed behavior, constant-time password comparison, signed expiry, HttpOnly/SameSite/Secure cookie attributes, same-origin `returnTo`, and password-rotation invalidation.
4. Keep login/logout as form posts and preserve the selector's semantic logout button.
5. Run `pnpm auth:check` and `pnpm check`, then use `vercel dev` for the final browser check of the login page, deep links, 30-day persistence, and logout.

## Change an existing track's scene order, title, or copy

1. Open the relevant file under `src/presentation/config/`.
2. Preserve stable scene IDs unless the task explicitly accepts broken old deep links.
3. Keep the config data-only and reuse existing scene definitions/renderers.
4. If an Enterprise title or slide changed, verify the corresponding approved export/source agrees.
5. Run `pnpm check`; verify the affected route, direct scene URL, and Back/Forward.

## Replace or add a track slide export

1. Confirm the approved Pencil frame/export supplied for the change; do not invent missing sales content.
2. Place runtime HTML in the track's directory: `public/enterprise-slides/ent-NN.html`, `public/api-slides/api-NN.html`, or `public/small-slides/smb-NN.html`. Keep every relative asset it references beside the export.
3. Update the matching config for ordering, title, `frameId`, and optional flow binding.
4. Keep the scene ID and filename aligned (`ent-NN`, `api-NN`, or `smb-NN`) unless a deliberate migration is requested.
5. Open the direct scene URL and check 1920 × 1080 fit, missing assets, console errors, neighbouring navigation, and fullscreen behavior.

## Add an interactive demo flow to a track slide

1. Add the literal ID to `DemoFlowId` in `src/presentation/engine/types.ts`.
2. Add or reuse its title, accessible trigger label, and 1920 × 1080 hotspot bounds in `src/demos/flows/enterprise.ts` or a track-local definition when only the binding differs.
3. Bind that definition to the intended slide in the matching track config.
4. Implement the flow as local, deterministic React UI under `src/presentation/flows/`; reuse `ProductUI.tsx` primitives.
5. Add the exhaustive dispatch case in `DemoProduct.tsx`.
6. Style the component in `src/styles/demo-product.css`; never use a screenshot as the interactive surface.
7. Exercise open, complete primary path, reset, close/reopen, `Escape`, focus restoration, presentation-key isolation, and reduced motion.

## Change a desktop product demo

1. Start at the exported flow in `DesktopDemos.tsx`; inspect only the relevant helper sections.
2. Reuse `ProductUI.tsx` before adding another shell, field, drawer, modal, or toast pattern.
3. Keep all mutations local and resettable through component remount.
4. Use synthetic copy/data and preserve semantic controls.
5. Compare the same state and viewport against the matching `public/demo-flows/` reference.
6. Run the full gate and the demo-flow browser checks.

## Change the manager mobile demo

1. Start at `ManagerAppDemo` and the specific screen component in `ManagerAppDemo.tsx`.
2. Keep one explicit screen-state machine inside the mounted demo; do not add application routing or global state.
3. Preserve the 430 × 812 product viewport, narrow-host adaptation, bottom navigation, local mutations, and reset-on-remount behavior.
4. Check nested Back actions, main navigation, inputs, payment/chat paths, transient messages, and reference fidelity.

## Change the performer registration flow

1. Use the approved Figma frame as the visual source and keep all 11 screens in `PerformerRegistrationDemo` in their source order.
2. Build product surfaces with React and CSS. Store only required exported logos, flags, icons, or illustrations under `public/performer-registration-flow/assets/`; the only approved full-screen capture is the Figma-sourced `Мой налог` loading state.
3. Preserve the shared 979 px source height, adaptive 430 px maximum width, vertical overflow for long content, and scroll reset on every step change.
4. Keep the screen surface as the only step interaction: a click anywhere advances once, while the visual controls inside each screen remain inert.
5. Keep `/performer-registration-flow/*` in the GET/HEAD-only public court allowlist while the flow is bound to the public `court-03` scene, and prove unrelated sales assets remain protected.
6. Verify all 11 screens in order, click-through navigation, last-screen stability, reset, close/reopen, `Escape`, focus restoration, scrolling on long screens, equal viewport height, public assets, and a narrow host viewport.

## Change the performer response flow

1. Use approved Figma states 2.1–2.3 as the visual and copy source; keep the Marketplace, task detail, and submitted-response states in that order.
2. Build the surfaces with semantic React controls and CSS. Store the exact exported images and icons under `public/performer-response-flow/assets/`; do not render the reference screens as screenshots.
3. Preserve the adaptive 430 × 979 viewport, local screen state, Back behavior, target-task transition, submit transition, scroll reset, and submitted-state stability.
4. Keep `/performer-response-flow/*` in the GET/HEAD-only public court allowlist while the flow is bound to public `court-03`, and prove unrelated sales assets remain protected.
5. Verify quick access and the `court-03` CTA, states 2.1–2.3 against their Figma references, reset, close/reopen, `Escape`, focus restoration, keyboard isolation, public assets, and a narrow host viewport.

## Change presentation navigation or reset behavior

1. Read `Presentation.tsx`, `PresentationControls.tsx`, `SceneRenderer.tsx`, and `engine/types.ts` together.
2. Preserve `?scene` as the active-scene source of truth and keep unrelated query parameters.
3. Invalid/missing scene IDs must normalize to the first scene with history replacement.
4. Normal scene changes must remain browser-history entries.
5. Preserve editable/modal shortcut guards, fullscreen failure handling, and the revision-based remount boundary.
6. Verify all tracks, valid/invalid direct links, Back/Forward, keyboard controls, reset, and modal isolation.

## Change the offline Court package

1. Keep `src/presentation/config/court.ts`, the shared presentation engine, renderer, and demo-flow implementations as the behavioral source. Offline-only differences stay in the entry/shell boundary: browser routing, local asset transport, the three-button controls variant, and contextual action hints.
2. Add every required public image through `publicAssetUrl`; normal web builds must continue to receive the original root-relative path.
3. Keep `scripts/package-offline-court.mjs` limited to the six Court slide documents, the shared WinWork logo, and the performer registration/response asset directories. Never package protected Enterprise, API, or Small slide exports.
4. Inline local slide CSS/images, remove passive web-font requests, inline the Vite JavaScript/CSS output, and retain the restrictive offline CSP.
5. Keep Court CTAs marked with their `data-demo-flow` ID so `PencilSlide` measures hover/focus overlays from the rendered document. Offline documents use `srcDoc`; all images and styles remain embedded.
6. Run `pnpm check`, then open `dist/offline/Открыть презентацию WinWork.html` through `file://` with network access blocked. Verify the three always-visible bottom-left controls, outline-only off-target hints inside flows, no hints on slide backgrounds or in the performer-selection drawer, aligned hover/focus overlays, six scenes, hash history, keyboard/reset/fullscreen fallback, every Court hotspot and primary demo path, modal reset/close/reopen, focus restoration, `Escape`, embedded images, zero HTTP requests, and console health.

## Change the offline sales package

1. Start with `src/app/salesRoutes.tsx`, `src/presentation/config/sales.ts`, `vite.sales-offline.config.ts` and `scripts/package-offline-sales.mjs`. Reuse runtime components; the slide manifest comes from active configs rather than directory enumeration.
2. Embed runtime resources, including CSS backgrounds, adjacent logos, manager graphics, performer assets, licensed Inter and onboarding imports/downloads. Compile CDN-based slide utility classes at build time. Keep the offline CSP and assertions against external resources.
3. Preserve online gateway logout and BrowserRouter behavior. The offline entry uses hash routing and omits logout; onboarding uses the `/onboarding` hash prefix and home link. Standalone onboarding and web hashes remain unchanged.
4. Run `pnpm check`. Open `dist/offline/Открыть продажи WinWork.html` directly with networking disabled: all 37 slides, all 10 demos and four onboarding scenarios, history/direct links, home return, reset/focus/Escape, keyboard/fullscreen fallback, images/fonts/downloads and zero HTTP requests/errors. If embedding helpers change, check Court too.

## Add a new track

1. Extend `PresentationConfig['id']` in `engine/types.ts`.
2. Create a data-only config under `src/presentation/config/` using existing scene types.
3. Register one shallow route in `src/app/router.tsx` and one landing card in `TrackSelector.tsx`.
4. Do not create another engine or app root.
5. Verify direct route refresh against the generic Vercel SPA rewrite and include the route in agent docs/browser checks.

If the track must be public while existing tracks remain protected, use a separately emitted Vite entry under its own asset prefix. Add only that route, bundle prefix, slide prefix, required asset prefix, and exact shared assets to the middleware allowlist; keep `GET`/`HEAD` as the only accepted methods. Add auth-contract assertions proving both public access and continued protection of the main SPA/assets.

## Add a new scene type

1. First prove that `slide`, `demo`, or `media` cannot express the requirement.
2. Add a discriminated definition in `engine/types.ts`.
3. Add one focused scene component and an exhaustive `SceneRenderer` case.
4. Keep config data serializable in intent; do not embed track-specific engine logic.
5. Update `docs/architecture.md`, `context-index.json`, and all affected verification instructions.

## Update agent documentation

1. Change current facts in the narrowest focused document.
2. Update `context-index.json` when a path, task area, invariant, route, command, or coupling changes.
3. Do not copy large source specifications into current docs; link and classify them.
4. Run `pnpm docs:check`, `pnpm format:check`, and `git diff --check`.
