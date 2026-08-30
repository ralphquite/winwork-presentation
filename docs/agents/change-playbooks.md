# Change playbooks

Use the smallest playbook that covers the request. Paths and invariants are also available in `context-index.json`.

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

## Change presentation navigation or reset behavior

1. Read `Presentation.tsx`, `PresentationControls.tsx`, `SceneRenderer.tsx`, and `engine/types.ts` together.
2. Preserve `?scene` as the active-scene source of truth and keep unrelated query parameters.
3. Invalid/missing scene IDs must normalize to the first scene with history replacement.
4. Normal scene changes must remain browser-history entries.
5. Preserve editable/modal shortcut guards, fullscreen failure handling, and the revision-based remount boundary.
6. Verify all tracks, valid/invalid direct links, Back/Forward, keyboard controls, reset, and modal isolation.

## Add a new track

1. Extend `PresentationConfig['id']` in `engine/types.ts`.
2. Create a data-only config under `src/presentation/config/` using existing scene types.
3. Register one shallow route in `src/app/router.tsx` and one landing card in `TrackSelector.tsx`.
4. Do not create another engine or app root.
5. Verify direct route refresh against the generic Vercel SPA rewrite and include the route in agent docs/browser checks.

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
