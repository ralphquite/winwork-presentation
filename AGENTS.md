# WinWork Guided Sales Demo

## Purpose and boundaries

- This repository is a deterministic sales-presentation frontend, not the production WinWork product.
- Never connect a real WinWork backend, authentication system, database, analytics service, or production API unless the current task explicitly requires it.
- Never use real personal, customer, company, or worker data. Demo data must be obviously synthetic.
- This bootstrap intentionally has a neutral visual layer. Do not invent a WinWork design system or sales narrative; implement approved Pencil designs when they are supplied.
- Keep the current React, TypeScript, Vite, React Router, Tailwind CSS, and Motion stack unless a concrete task requires a change.

## Start here

- Product bootstrap scope: `base_documentation/01_codex_winwork_sales_demo_bootstrap.md`
- Runtime architecture: `docs/architecture.md`
- App routes and contributor commands: `README.md`

## Repository map

- `src/app/`: application composition and routing.
- `src/presentation/engine/`: reusable presentation runtime and controls.
- `src/presentation/scenes/`: the three supported scene renderers.
- `src/presentation/config/`: data-defined Enterprise, API, and Small Business tracks.
- `src/demos/fixtures/`: local, synthetic, resettable demo data.
- `src/components/shared/`: small shared UI and error boundaries.

## Working agreements

- Use `pnpm`; do not create npm or Yarn lockfiles.
- Prefer focused components and direct imports. Keep `App` as composition glue.
- Reuse scene definitions and components across tracks instead of copying implementations.
- Keep presentation state separate from scene-local demo state. Every demo flow must be deterministic and resettable.
- Keep routing shallow. A track config controls scene order; the `scene` query parameter provides deep links and browser history.
- Do not turn this runtime into a CMS, slide editor, universal presentation framework, or full WinWork clone.
- Do not add dependencies, abstractions, empty directories, or environment variables speculatively.
- Preserve keyboard navigation, editable-control guards, focus visibility, reduced-motion behavior, and semantic buttons.
- Treat Git as the source of truth. Do not commit, push, deploy, or mutate external services unless the current task explicitly asks for it.

## Commands

- Install: `pnpm install --frozen-lockfile`
- Develop: `pnpm dev`
- Full gate: `pnpm check`
- Individual gates: `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm build`

## Definition of done

- Run `pnpm check` after material code or configuration changes.
- For runtime or navigation changes, also verify `/enterprise`, `/api`, and `/small` in a browser, including Back/Forward, direct `?scene=...` links, keyboard controls, fullscreen entry, and demo reset.
- Review the final diff for accidental business claims, real data, backend calls, new secrets, or unrelated files.

## Code review rules

- Flag any real API or personal-data dependency as a release blocker.
- Flag duplicated track-specific engines when the behavior belongs in the shared runtime.
- Flag demo state that cannot be reset or leaks between scenes.
- Flag navigation changes that break direct routes, query-parameter deep links, browser history, or editable-field keyboard behavior.
