# Agent file map

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

DemoFlowModal
  -> DemoProduct(flowId)
  -> DesktopDemos | ManagerAppDemo
  -> ProductUI primitives + demo-product.css
```

## Ownership map

| Path                                               | Owns                                                                                   | Couple changes with                                       |
| -------------------------------------------------- | -------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `middleware.ts`                                    | Shared-password login/logout, signed session cookie, fail-closed request gate          | `.env.example`, Vercel runtime checks, access docs        |
| `api/auth/login.ts`                                | Password form parsing, credential check, session issue, invalid-password redirect      | Middleware allow-path and shared session module           |
| `auth/session.ts`                                  | Server-only env validation, return path, cookie, HMAC, expiry, password comparison     | Middleware, login Function, auth contract check           |
| `.env.example`                                     | Names and minimum requirements of server-only access secrets                           | Middleware and Vercel environment setup                   |
| `tsconfig.json`                                    | Root TypeScript options consumed directly by Vercel Function and Middleware compilers  | Server entrypoint imports and runtime globals             |
| `src/app/router.tsx`                               | Public route-to-config mapping                                                         | Track selector and target config                          |
| `src/app/TrackSelector.tsx`                        | Landing cards, QA flow shortcuts, fullscreen entry attempt, and access logout          | Routes, demo flows, auth contract, and track readiness    |
| `src/presentation/engine/types.ts`                 | Scene/config/demo-flow contracts                                                       | All exhaustive render/dispatch switches                   |
| `src/presentation/engine/Presentation.tsx`         | `?scene`, history writes, shortcuts, fullscreen, presentation reset                    | Controls and all-route browser verification               |
| `src/presentation/engine/PresentationControls.tsx` | Home, counter, picker, previous/next, reset, fullscreen controls                       | Presentation callbacks and accessibility labels           |
| `src/presentation/engine/SceneRenderer.tsx`        | Scene-type dispatch, transition, scene remount boundary                                | Scene contracts/components                                |
| `src/presentation/config/enterprise.ts`            | Ordered 19-scene Enterprise route and slide metadata                                   | Matching HTML exports and demo-flow bindings              |
| `src/presentation/config/api.ts`                   | Ordered 16-scene API / Embedded route and slide metadata                               | Matching HTML exports                                     |
| `src/presentation/config/small.ts`                 | Ordered 14-scene Small Business route and reused single-task binding                   | Matching HTML exports and demo-flow binding               |
| `src/presentation/config/shared.ts`                | Shared placeholder definitions                                                         | Placeholder track contracts only                          |
| `src/presentation/scenes/SlideScene.tsx`           | Pencil-backed versus placeholder slide selection                                       | `PencilSlide` and slide definition                        |
| `src/presentation/slides/PencilSlide.tsx`          | 1920 × 1080 scaling, iframe, optional hotspot, dialog open state                       | Static slide path, hotspot bounds, modal behavior         |
| `src/demos/flows/enterprise.ts`                    | Five base hotspot definitions, including the single-task flow reused by Small Business | Track slide mappings, `DemoFlowId`, dispatcher            |
| `src/presentation/flows/DemoFlowModal.tsx`         | Portal, modal reset, focus trap/restore, close semantics                               | Presentation keyboard guard and modal CSS                 |
| `src/presentation/flows/DemoProduct.tsx`           | Exhaustive flow-ID-to-component dispatch                                               | `DemoFlowId` and flow component exports                   |
| `src/presentation/flows/DesktopDemos.tsx`          | Four desktop product flows and their local state                                       | Product primitives, demo CSS, reference images            |
| `src/presentation/flows/ManagerAppDemo.tsx`        | Stateful manager mobile app flow                                                       | Demo CSS and mobile references                            |
| `src/presentation/flows/ProductUI.tsx`             | Shared desktop shells, fields, drawer, modal, toast                                    | Desktop/mobile consumers and demo CSS                     |
| `src/presentation/flows/useTransientMessage.ts`    | Self-clearing local status messages                                                    | Consumers that navigate/reset while a toast is visible    |
| `src/styles/globals.css`                           | App shell, track selector, presentation controls, slide/modal layout                   | Runtime and responsive behavior                           |
| `src/styles/demo-product.css`                      | Product recreation styling                                                             | Demo components and approved visual references            |
| `public/enterprise-slides/`                        | Runtime Enterprise slide HTML and relative dependencies                                | Enterprise config and Pencil export source                |
| `public/api-slides/`                               | Runtime API / Embedded slide HTML and relative dependencies                            | API config and Pencil export source                       |
| `public/small-slides/`                             | Runtime Small Business slide HTML and relative dependencies                            | Small config and Pencil export source                     |
| `public/demo-flows/`                               | QA-only flow screenshots                                                               | `design-qa.md`; never interactive runtime rendering       |
| `public/winwork-logo.svg`                          | Runtime wordmark used by demo shells                                                   | Product UI and manager login                              |
| `pencil/*.pen`                                     | Approved editable design sources                                                       | Exported runtime/reference assets when explicitly updated |
| `design-qa.md`                                     | Latest recorded Enterprise visual/interaction evidence                                 | Current implementation evidence only                      |
| `vercel.json`                                      | SPA rewrite after the access gateway                                                   | Middleware, router paths, and deployment verification     |

## Demo bindings

| Scene    | Flow ID              | Entry definition                        | React implementation    |
| -------- | -------------------- | --------------------------------------- | ----------------------- |
| `ent-04` | `create-object`      | `enterpriseDemoFlows.createObject`      | `CreateObjectDemo`      |
| `ent-05` | `manager-app`        | `enterpriseDemoFlows.managerApp`        | `ManagerAppDemo`        |
| `ent-07` | `create-activity`    | `enterpriseDemoFlows.createActivity`    | `CreateActivityDemo`    |
| `ent-08` | `document-templates` | `enterpriseDemoFlows.documentTemplates` | `DocumentTemplatesDemo` |
| `ent-09` | `single-task`        | `enterpriseDemoFlows.singleTask`        | `SingleTaskDemo`        |
| `smb-06` | `single-task`        | reused as `smallSingleTaskDemo`         | `SingleTaskDemo`        |

## Asset roles

| Asset class                                | Runtime?                                 | Rule                                                                     |
| ------------------------------------------ | ---------------------------------------- | ------------------------------------------------------------------------ |
| `public/enterprise-slides/*.html`          | Yes                                      | Loaded by iframe; preserve 1920 × 1080 output and relative dependencies. |
| `public/enterprise-slides/*.{png,jpg,svg}` | Yes when referenced by HTML              | Keep beside exports; verify missing-resource errors.                     |
| `public/api-slides/*`                      | Yes when referenced by API config/HTML   | Follow the same export and dependency rules as Enterprise.               |
| `public/small-slides/*`                    | Yes when referenced by Small config/HTML | Follow the same export and relative-dependency rules as Enterprise.      |
| `public/demo-flows/*.png`                  | No                                       | Visual comparison only; do not use for interaction.                      |
| `public/winwork-logo.svg`                  | Yes                                      | Shared product wordmark.                                                 |
| `pencil/*.pen` and adjacent source assets  | No                                       | Editable design source/reference, not a browser path.                    |
| `/tmp/*` paths in `design-qa.md`           | No                                       | Ephemeral evidence from the recorded QA run; do not depend on them.      |
