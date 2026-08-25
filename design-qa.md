# Design QA — component-based Enterprise demo flows

## Comparison target

- Source visual truth: `pencil/flows.pen` and the exact exported references under `public/demo-flows/`.
- Desktop source: `public/demo-flows/object-list.png` (1599 × 1170 px, 1× source export).
- Mobile source: `public/demo-flows/manager-orders.png` (430 × 1546 px); the visible application viewport is the top 430 × 812 px.
- Desktop implementation: `http://127.0.0.1:4173/enterprise?scene=ent-04`, initial object-list state.
- Mobile implementation: `http://127.0.0.1:4173/enterprise?scene=ent-05`, signed-in orders state.
- Final browser screenshot: `/tmp/winwork-final-object-demo.png` (1280 × 720 px browser viewport, device scale factor 1).
- Desktop comparison: `/tmp/winwork-object-comparison.png` (1280 × 720 px side-by-side composite).
- Mobile comparison: `/tmp/winwork-manager-comparison.png` (1280 × 720 px side-by-side composite).
- Density normalization: the desktop source and browser render were fitted into equal comparison columns and aligned to the top application edge. The mobile source was cropped by the comparison viewport to 430 × 812 CSS px; the React mobile app also renders at 430 × 812 CSS px, then both were scaled equally to fit the 720 px comparison canvas.

## Full-view comparison evidence

The source and implementation were opened together in the same browser-rendered comparison input for both desktop and mobile states, then the two combined captures were inspected at original resolution.

- Desktop composition preserves the white header, exact WinWork source logo, 250 px navigation rail, grey content canvas, two-level settings tabs, action placement, table-led layout, blue accent, and restrained control geometry.
- Mobile composition preserves the 430 px app viewport, marketplace heading, plus action, search/calendar row, horizontal status filters, week rail, blue section heading, task-card hierarchy, status outlines, and fixed four-item bottom navigation.
- The outer dark title/reset/close shell is an intentional presentation affordance. It does not contain next/back controls and cannot advance the demo.

## Focused-region comparison evidence

- Object CTA and drawer: the visible `Добавить объект` DOM button opens a real right drawer with editable fields, selects, checkboxes, manager rows, activity rows, save state, and list mutation.
- Activity drawer: the source control density, section order, requirement toggles, operation card, summaries, and fixed save action are recreated as semantic controls.
- Template picker/editor: contract and act fields open real modal pickers; `Создать новый шаблон` opens a document editor with toolbar, variables, editable document content, and save behavior.
- Mobile task cards: typography, amount/status hierarchy, spacing, borders, and click affordance match the Pencil product state closely at 430 px.
- Mobile nested states: task creation, order tabs, payment OTP sheet, settings toggles, chat list/thread, and message composer were visually inspected after interaction.

## Required fidelity surfaces

- Fonts and typography: Inter/system UI is applied explicitly to desktop and mobile chrome. Headings, tabs, labels, inputs, table cells, navigation, cards, and small captions have deliberate sizes, weights, and line heights. Document content intentionally uses a serif face, matching its editor role.
- Spacing and layout rhythm: desktop shell proportions, sticky header, navigation width, page gutters, tabs, table rows, drawer width, mobile 16 px gutters, 12–16 px card radii, and bottom navigation height follow the source rhythm.
- Colors and visual tokens: white surfaces, `#f5f6f7` canvas/control backgrounds, dark navy text, muted grey labels, `#2f73ff` primary accent, semantic green/orange/red states, and low-contrast borders map to the reference.
- Image quality and asset fidelity: no interface screenshot is rendered by the application. The WinWork logo is an exact source vector extracted from the supplied Pencil export. Product icons use the existing Lucide family at a consistent stroke weight. PNG exports are QA references only.
- Copy and content: visible product labels follow the supplied flows. All people, companies, phones, addresses, tasks, balances, and messages are deterministic synthetic demo data.
- Interaction states: hover/focus/active, editable fields, selects, checkboxes, toggles, drawers, dropdowns, modals, tabs, local list creation, success states, OTP confirmation, chat send, close, and reset are functional.
- Accessibility: slide triggers and product controls are semantic; fields have labels; the outer dialog traps and restores focus; `Escape` closes it; presentation arrow keys do not leak through it; reduced motion is respected.
- Responsiveness: desktop application uses a stable minimum working canvas inside a scrollable demo viewport. The manager flow renders as a bounded 430 × 812 mobile app and becomes edge-to-edge on narrow host viewports.

## Comparison history

### Iteration 1 — blocked

- [P0] The previous implementation rendered Pencil screenshots as the product and placed transparent hotspots over them.
  - Impact: the flow looked interactive but remained a sequence of raster frames, directly contradicting the requirement for a recreated frontend.
  - Fix: removed the image/action/field/overlay runtime model. Five flow IDs now mount real React interfaces with local state.
- [P1] Mobile behavior was represented by cropped storyboard frames rather than an application.
  - Impact: nested navigation, tabs, forms, payment, settings, and chat did not behave like one persistent mobile product.
  - Fix: built a single mobile application shell with screen state, bottom navigation, real forms, order details, OTP sheet, notification toggles, and local chat messages.

### Iteration 2 — blocked

- [P2] The first component pass used the repository favicon inside a dark square instead of the supplied WinWork wordmark.
  - Fix: extracted the exact supplied vector wordmark into `public/winwork-logo.svg` and used it in both shells.
- [P2] The desktop application stopped at its 820 px minimum height in taller demo viewports.
  - Fix: made the desktop shell fill the available product surface while preserving its minimum working size.
- [P2] success toasts could remain visible across later mobile navigation, and the created-task drawer could inherit the create form's scroll position.
  - Fix: added deterministic transient-message cleanup and keyed the two drawer states so the created view opens at the top.

### Iteration 3 — passed

- Post-fix visual evidence: `/tmp/winwork-object-comparison.png`, `/tmp/winwork-manager-comparison.png`, `/tmp/winwork-final-object-demo.png`.
- Post-fix functional evidence: all five entry CTAs and their primary nested interactions were exercised in the in-app browser after the final changes.
- No actionable P0, P1, or P2 difference remains. The presentation shell and smaller synthetic row set are intentional demo constraints, not product-interface substitutions.

## Interaction and runtime evidence

- Create object: list → `Добавить объект` → editable drawer → add manager/activity → save → new synthetic row; reset removes the new row.
- Manager app: login → marketplace; create task; open order and switch tabs; filter awaiting payment → payment → four-digit OTP; settings → notification toggles; chats → thread → send local message.
- Activity: settings list → `Добавить вид деятельности` → requirements/operations → save.
- Templates: activity drawer → contract/act picker → create template → editable document editor → save and select.
- Single task: marketplace → `Добавить задание` → `Разовое задание` → form → created-task details.
- Direct scene links, browser Back/Forward, presentation reset, modal keyboard isolation, `/enterprise`, `/api`, and `/small` all passed.
- Fresh-tab console check had no app errors. The only warning reports that reduced motion is enabled in the test environment, which the implementation honors.
- Fullscreen entry was attempted, but the in-app browser does not expose the Fullscreen API; the existing runtime path is unchanged.
- `pnpm check` passed: formatting, lint, TypeScript, and production build.

## Implementation checklist

- [x] Removed all screenshot-backed product rendering and hotspot navigation.
- [x] Recreated the desktop and mobile product shells as React components.
- [x] Implemented five resettable deterministic flows with synthetic data only.
- [x] Implemented real forms, tables, drawers, pickers, editor, tabs, toggles, payment sheet, and chat.
- [x] Preserved slide entry CTAs, deep links, browser history, keyboard guards, focus restoration, and reduced motion.
- [x] Compared source and implementation together and verified the complete primary interaction paths in the browser.
- [x] Passed the full repository gate.

final result: passed
