# WinWork Guided Sales Demo

## Read first

1. Read this file completely.
2. Open `docs/agents/context-index.json`, select the task area that matches the request, and read only its `readFirst` files before broader exploration.
3. Use `docs/agents/file-map.md` when ownership or change coupling is unclear.
4. Use `docs/agents/change-playbooks.md` for repeatable change sequences.

## Source of truth

Use this precedence when sources disagree:

1. Executable code, `package.json`, toolchain config, and runtime assets referenced from `public/`.
2. `AGENTS.md` and focused current documentation under `docs/`.
3. Approved Pencil source and visual references under `pencil/`, plus `design-qa.md`.
4. `base_documentation/`, which is historical bootstrap intent rather than current implementation state.

Never preserve a stale documentation claim over working code. Update the focused document in the same change when behavior, ownership, commands, routes, or file locations change.

## Current implementation state

- This repository is a deterministic sales-presentation frontend, not the production WinWork product.
- `/enterprise` is implemented as 17 exported Pencil slides. Slides `ent-04`, `ent-05`, `ent-07`, `ent-08`, and `ent-09` open component-based React demo flows.
- `/small` is implemented as 12 exported Pencil slides. Slide `smb-06` reuses the component-based `single-task` demo flow.
- `/api` is implemented as 16 exported Pencil slides with no interactive demo flows.
- `/court` is a public five-slide code-authored presentation for court demonstrations. It uses an isolated public Vite bundle; `court-02` opens the legal-entity registration and single-task React demo flows, `court-03` opens performer registration, `court-04` opens performer selection, and `court-05` opens the completed-task payment flow.
- The landing-page quick-access panel also exposes a component-based `performer-selection` flow and a temporary screenshot-based `performer-registration` mobile flow built from 17 approved source captures. The screenshot flow is deliberately non-interactive except for step navigation and per-screen vertical scrolling.
- The active scene is URL state in `?scene=<stable-id>`; presentation and demo state are local and resettable.
- Exported slide HTML under `public/enterprise-slides/`, `public/api-slides/`, and `public/small-slides/`, code-authored HTML/CSS under `public/court-slides/`, and the explicitly approved captures under `public/performer-registration-flow/` are runtime content. PNG files under `public/demo-flows/` remain QA references and must not be used as interactive product UI.
- The Vercel access gateway uses Routing Middleware to protect the sales routes/assets and an Edge Function to process the password form. The narrowly allowlisted `/court`, `/court-app/*`, `/court-slides/*`, `/court-assets/*`, `/performer-registration-flow/*`, and shared WinWork wordmark are public; all other deployed routes/assets remain fail-closed. This is the only server-side behavior and uses `WINWORK_ACCESS_PASSWORD` plus `WINWORK_SESSION_SECRET` for a signed 30-day cookie.
- There is no account system, product backend, database, analytics, production API, or real user identity.

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
- Deployed requests fail closed in `middleware.ts`: unauthenticated visitors cannot fetch the protected SPA bundle, protected exported slides, or their adjacent assets. Only the explicit court allowlist is public.
- Track configs define scene order; renderers and product primitives are shared.
- Scene IDs are unique and stable within a track because they are public deep-link values.
- URL state owns the active scene. Browser Back/Forward and unrelated query parameters must keep working.
- Presentation reset remounts the current scene; modal reset remounts the selected demo flow. No demo state may leak between scenes or openings.
- Global presentation shortcuts must ignore editable controls and open demo dialogs.
- Dialogs retain semantic controls, focus trapping/restoration, `Escape` close, and reduced-motion behavior.
- Desktop product demos keep a stable minimum canvas inside an overflow-safe viewport. The manager demo remains a bounded 430 × 812 mobile surface and adapts on narrow hosts.
- Prefer extending discriminated unions and exhaustive switches over stringly typed dispatch or duplicated engines.

## Change routing

| Change                   | Start with                                             | Usually changes with                                                            |
| ------------------------ | ------------------------------------------------------ | ------------------------------------------------------------------------------- |
| Password access gateway  | `middleware.ts`, `api/auth/login.ts`                   | shared session module, root TS config, Vercel verification                      |
| Route or track card      | `src/app/router.tsx`                                   | track config, middleware/public build when access differs, browser verification |
| Scene order/copy/ID      | `src/presentation/config/*.ts`                         | exported slide asset, direct-link verification                                  |
| Runtime/navigation/reset | `src/presentation/engine/Presentation.tsx`             | controls, renderer, types, all-track browser checks                             |
| Exported track slide     | matching `src/presentation/config/*.ts`                | matching `public/*-slides/`, Pencil source/reference                            |
| Demo hotspot or flow ID  | `src/demos/flows/enterprise.ts`                        | engine types, matching track config, `DemoProduct.tsx`                          |
| Desktop demo behavior    | `src/presentation/flows/DesktopDemos.tsx`              | `ProductUI.tsx`, `demo-product.css`, QA references                              |
| Manager mobile behavior  | `src/presentation/flows/ManagerAppDemo.tsx`            | `demo-product.css`, QA references                                               |
| Screenshot mobile flow   | `src/presentation/flows/PerformerRegistrationDemo.tsx` | runtime captures, quick access, `DemoProduct.tsx`, `demo-product.css`           |
| Scene type               | `src/presentation/engine/types.ts`                     | renderer, scene component, configs, architecture docs                           |
| Agent documentation      | `docs/agents/context-index.json`                       | relevant focused docs, `pnpm docs:check`                                        |

## Working agreements

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
- Develop with auth: `pnpm dlx vercel@latest dev`
- Access-gateway contract: `pnpm auth:check`
- Documentation contract: `pnpm docs:check`
- Full gate: `pnpm check`
- Individual gates: `pnpm auth:check`, `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm build`

## Verification matrix

- Documentation-only: `pnpm docs:check`, `pnpm format:check`, `git diff --check`.
- Code, style, asset, or configuration: `pnpm check`.
- Access-gateway changes: also verify missing configuration, wrong/correct password, preserved deep link, protected direct assets, tampered/expired cookie, 30-day persistence, password rotation, and logout through `vercel dev`.
- Runtime/navigation: also verify `/enterprise`, `/api`, and `/small`; direct valid and invalid `?scene=` values; Back/Forward; `ArrowLeft`/`ArrowRight`; `F`; reset; fullscreen entry/fallback.
- Demo-flow changes: also exercise open, primary interaction path, reset, close/reopen, focus restoration, `Escape`, keyboard isolation, and narrow-host behavior when relevant.
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
