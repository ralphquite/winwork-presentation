# Design QA — component-based Enterprise demo flows

## Comparison target

- Source visual truth: `pencil/flows.pen` and the exact exported references under `public/demo-flows/`.
- Desktop source: `public/demo-flows/object-list.png` (1599 × 1170 px, 1× source export).
- Mobile source: `public/demo-flows/manager-orders.png` (430 × 1546 px); the visible application viewport is the top 430 × 812 px.
- Manager-flow source set: `manager-login.png`, `manager-orders.png`, `manager-create-task.png`, `manager-order-details.png`, `manager-payment.png`, `manager-settings.png`, and `manager-chats.png`, exported from the matching mobile groups in `pencil/flows.pen`.
- Desktop implementation: `http://127.0.0.1:4173/enterprise?scene=ent-04`, initial object-list state.
- Mobile implementation: `http://127.0.0.1:4173/enterprise?scene=ent-05`, signed-in orders state.
- Final browser screenshot: `/tmp/winwork-final-object-demo.png` (1280 × 720 px browser viewport, device scale factor 1).
- Manager-card source — invitation: `/var/folders/hw/f66hvg7n1t745b_6hcmn_gtm0000gn/T/codex-clipboard-c5475bf9-da7a-47f1-8717-350cda741e41.png` (1008 × 1148 px, normalized from 2× to a 504 px CSS target).
- Manager-card source — existing manager: `/var/folders/hw/f66hvg7n1t745b_6hcmn_gtm0000gn/T/codex-clipboard-9010f2a8-37f6-4d99-8701-bd15f8b6b62f.png` (1008 × 328 px, normalized from 2× to a 504 px CSS target).
- Manager-card implementation: `/tmp/winwork-manager-existing-final.png`, `/tmp/winwork-manager-invited-header-final.png`, and `/tmp/winwork-manager-poa-final.png` (1710 × 1200 px browser viewport, device scale factor 1).
- Manager-card focused comparisons: `/tmp/winwork-manager-existing-comparison.png`, `/tmp/winwork-manager-invited-comparison.png`, and `/tmp/winwork-manager-poa-comparison.png` (source left, implementation right, both normalized to 504 px width).
- Desktop comparison: `/tmp/winwork-object-comparison.png` (1280 × 720 px side-by-side composite).
- Mobile comparison: `/tmp/winwork-manager-comparison.png` (1280 × 720 px side-by-side composite).
- Corrected manager login comparison: `/tmp/winwork-manager-login-comparison.png` (Pencil left, React right, both 430 × 812 px at 1×).
- Corrected manager orders comparison: `/tmp/winwork-manager-orders-comparison.png` (top 430 × 812 px of the Pencil export left, React viewport right, both at 1×).
- Density normalization: the desktop source and browser render were fitted into equal comparison columns and aligned to the top application edge. The mobile source was cropped by the comparison viewport to 430 × 812 CSS px; the React mobile app also renders at 430 × 812 CSS px, then both were scaled equally to fit the 720 px comparison canvas.

## Full-view comparison evidence

The source and implementation were opened together in the same browser-rendered comparison input for both desktop and mobile states, then the two combined captures were inspected at original resolution.

- Desktop composition preserves the white header, exact WinWork source logo, 250 px navigation rail, grey content canvas, two-level settings tabs, action placement, table-led layout, blue accent, and restrained control geometry.
- Mobile composition preserves the 430 px app viewport, marketplace heading, plus action, search/calendar row, horizontal status filters, week rail, blue section heading, task-card hierarchy, status outlines, and fixed four-item bottom navigation.
- The outer dark title/reset/close shell is an intentional presentation affordance. It does not contain next/back controls and cannot advance the demo.

## Focused-region comparison evidence

- Object CTA and drawer: the visible `Добавить объект` DOM button opens a real right drawer with editable fields, selects, checkboxes, manager rows, activity rows, save state, and list mutation.
- Manager cards: the existing-manager state keeps a compact email/FIO summary; the invitation state stacks email, surname, first name, patronymic, phone, permissions, and power of attorney vertically. The supplied reference and rendered crops were compared together at the same normalized width.
- Activity drawer: the source control density, section order, requirement toggles, operation card, summaries, and fixed save action are recreated as semantic controls.
- Template picker/editor: contract and act fields open real dropdown panels directly below their selectors; the contract action opens a document editor with toolbar, variables, editable document content, and save behavior.
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

### Iteration 4 — passed

- Persistent slide chrome now shows the current slide count at bottom-left and a compact grey fullscreen toggle at bottom-right on Enterprise, Small Business, and API tracks. Browser evidence: `/tmp/winwork-slide-controls-hover.png`.
- Demo CTA hover geometry now stays inside the approved 16 px button bounds instead of extending beyond the button with a negative inset and outer ring. The activity-flow hotspot also matches the exported CTA at `x = 1202`, `y = 835`, `width = 614`.
- The manager bottom navigation is a sibling of the scrolling page and remains pinned to the mobile screen. Its measured bounds stayed at `y = 622`, `bottom = 694` before and after the page scrolled from `0` to `314.5`. Browser evidence: `/tmp/winwork-manager-fixed-nav.png`.
- The document-template flow opens on the settings list with no drawer; `Добавить вид деятельности` opens the drawer explicitly. Browser evidence: `/tmp/winwork-templates-initial.png`.
- Enterprise `19/19`, Small Business `11/14`, and API `1/5` counters were verified directly. The final Enterprise slide no longer renders the invitation-demo CTA, and the updated synthetic surnames render in the Small Business slide and manager chat/details.
- The in-app browser does not expose the Fullscreen API; clicking the new control follows the guarded fallback without a runtime error. Supported browsers continue to use the native Fullscreen API.

### Iteration 5 — passed

- Enterprise `ent-01` now renders the approved WinWork brand asset inside the central operational-hub card instead of the text-only `WINWORK` label. The card uses the light brand-blue surface, blue outline, and dark secondary caption required for logo contrast. The Pencil source and runtime HTML export agree. Browser evidence at 1920 × 1080: `/tmp/winwork-ent-01-real-logo.png`.

### Iteration 6 — passed

- Enterprise `ent-04` now keeps the `Показать в WinWork: создание объекта` hover outline exactly aligned with the exported 507 × 68 px CTA. Browser evidence at 1920 × 1080: `/tmp/winwork-ent04-hover-after.png`.
- The three object cards fit inside their intended 779 px row without horizontal overflow. `Пункт погрузки` ends at `x = 899`, leaving a 35 px gap before the image at `x = 934`.
- The CTA still opens the create-object dialog, and `Escape` closes it after the geometry fix.

### Iteration 7 — passed

- The single-task creation drawer now follows the user-supplied reference and the live WinWork Chrome flow instead of the earlier generic task form: object card, activity/rate row, worker count, task type, two-ended period, limits, operations, computed reward, derived task name, additional conditions, preferred-worker search, and primary action.
- Enterprise `ent-09` and Small Business `smb-06` both open the shared corrected form. Changing the object, activity, worker count, and operations updates the visible reward and task name; local creation opens the matching created-task summary.
- Reset restores the deterministic `Грузчик` / one worker / `13 000 ₽` state. Drawer close, modal `Escape`, trigger focus restoration, and console health passed in Chrome; the only console warning is the expected reduced-motion notice.
- At the default viewport the top and lower form states were visually compared with the supplied reference. At 900 × 700 the stable desktop canvas remains horizontally scrollable and the complete drawer stays reachable without collapsing its controls.
- Follow-up spacing verification measured 12 px between the `Дополнительно` legend and the `Только граждане РФ` checkbox, removing the fieldset-specific visual collision without changing adjacent section spacing.

### Iteration 8 — passed

- [P1 fixed] The desktop object-manager card reused the generic `.ww-manager-card` selector from the mobile flow. A later flex rule forced the form into a horizontal layout. The object flow now uses the isolated `.ww-object-manager-card` namespace and a single-column form.
- [P2 fixed] The first manager implementation did not distinguish an existing manager from a new invitation. The deterministic existing account now renders the compact email/FIO card from the supplied reference; an invited manager renders the full vertical form with the blue invitation status.
- [P2 fixed] Permissions were not grouped and the power-of-attorney state was missing. The invitation card now includes the referenced `Разрешения` section, a working `Добавить доверенность` action, document metadata, and a working refresh action.
- Typography, spacing, grey/white surface hierarchy, blue status/link treatment, destructive icon color, Lucide document/refresh icons, and visible Russian copy were checked in the focused comparison images. Synthetic demo data intentionally replaces the potentially real data in the reference.
- Browser interaction evidence: existing lookup → add second manager → invitation → vertical details → mobile-only permission → add power of attorney → refresh from `DEMO-0001` to `DEMO-0002`; `Escape` closed the demo and restored the presentation.
- Responsive evidence: `/tmp/winwork-manager-narrow-final.png` at 760 × 900 px. The stable desktop canvas remains inside `.demo-product-app-surface` with `overflow-x: auto`; the drawer and manager controls remain reachable.
- No actionable P0, P1, or P2 difference remains in the manager-card scope.

### Iteration 9 — passed

- The contract and act template pickers now render as selector-width dropdown panels 7 px below their respective fields, matching the approved search, top action, radio list, selected state, and `Сохранить` layout from `pencil/flows.pen`. Browser evidence: `/tmp/winwork-template-contract-dropdown.png` and `/tmp/winwork-template-act-dropdown.png`.
- At the 1280 × 720 browser viewport, the contract picker measured 421.44 × 432 px and the act picker measured 421.44 × 346 px. Each left and right edge matched its trigger, and each panel remained fully inside the scroll-safe product viewport.
- Search, radio selection, save, `Escape`, focus restoration, flow reset, close, and reopen passed for the changed interaction. The fresh console contained no application errors; the only warning reports the test device's enabled reduced-motion preference.

### Iteration 10 — passed

- The manager application was rebuilt against every mobile group in `pencil/flows.pen`. Missing source structures now render as React controls: complete marketplace filters/week rail/order cards, task operations and totals, performer/contact/limit details, full order metadata, response cards, rating/review/payment OTP, seven push settings, chat filters/list/thread/file/receipt/composer.
- [P1 fixed] The chat-list content and metadata spans inherited the avatar's fixed 52 × 52 px rule, which compressed text and pushed task titles outside the 430 px canvas. The content and metadata columns now have isolated dimensions; all six rows stay inside the viewport.
- [P1 fixed] Mobile scroll position leaked between screens, so opening payment after scrolling the marketplace could start below the payment header. The keyed mobile shell now remounts on screen changes and consistently opens each source state at the top.
- [P2 fixed] Long receipt URLs could overflow the outgoing chat bubble. Messages now wrap anywhere without widening the thread.
- The login and marketplace were compared against their Pencil exports together in the same 430 × 812 px comparison inputs. Logo, fields, CTA geometry, filters, week rail, card rhythm, statuses, and bottom navigation align with the references; only source-versus-Lucide status-bar glyph details remain intentionally library-native.
- Functional browser evidence passed for login, task creation, performer selection/refusal, order tabs, five-digit OTP payment, all notification toggles, chat send, reset, close/reopen, `Escape`, focus restoration, and the 390 × 844 px narrow host. Narrow-host evidence: `/tmp/winwork-manager-narrow-final.png`; focused final screens: `/tmp/winwork-manager-login-final.jpg`, `/tmp/winwork-manager-orders-final.jpg`, and `/tmp/winwork-manager-chat-final.jpg`.

### Iteration 11 — passed

- Enterprise `ent-08` now aligns the document-template demo hotspot with the exported CTA at `x = 120`, `y = 896`, `height = 68`; the 567 px hotspot width differs from the rendered 566.37 px CTA by less than one pixel. Browser hover evidence: `/tmp/winwork-ent08-hover-fixed.png`.
- The `Section Progress` oval group was removed from all 19 Enterprise HTML exports and from the matching Pencil source. Direct browser checks passed on `ent-01`, `ent-02`, `ent-08`, and `ent-19`, including a 390 × 844 narrow viewport.
- Enterprise `ent-02` no longer renders the `Три связи — ручная координация ещё возможна` caption or the `Масштаб требует правил…` callout. Browser evidence: `/tmp/winwork-ent02-copy-removed.png`.
- The corrected `ent-08` CTA still opens the document-template dialog; `Escape` closes it and restores focus to the trigger.

### Iteration 12 — passed

- The published Vercel build exposed native selects with `appearance: auto`, so dropdown arrows, inner padding, light/dark widget treatment, and text-field chrome remained browser-dependent even though Chromium rendered them acceptably.
- Desktop and manager demo shells now declare a light control scheme. Text, search, and number inputs have scoped native-appearance normalization; selects use one deterministic chevron, reserved text space, and light option colors. The preferred-worker input no longer inherits the surrounding bold label weight.
- All five quick-access flows were exercised after the fix. Object, activity, manager-task, and single-task native selects changed real values; the contract template search/radio/save dropdown still worked; desktop and mobile controls reported `appearance: none` with no horizontal overflow.
- Browser evidence: `/tmp/winwork-form-controls-desktop-after.png` at 1280 × 720 and `/tmp/winwork-form-controls-mobile-after.png` at 390 × 844. Route smoke checks passed for Enterprise, Small Business, API, and invalid-scene normalization with no console errors.

## Interaction and runtime evidence

- Create object: list → `Добавить объект` → editable drawer → add manager/activity → save → new synthetic row; reset removes the new row.
- Manager app: login → marketplace; create task; open order and switch tabs; filter awaiting payment → payment → five-digit OTP; settings → notification toggles; chats → thread → send local message.
- Activity: settings list → `Добавить вид деятельности` → requirements/operations → save.
- Templates: activity drawer → anchored contract/act dropdown → search/select/save; contract create action → editable document editor → save and select.
- Single task: marketplace → `Добавить задание` → `Разовое задание` → form → created-task details.
- Direct scene links, browser Back/Forward, presentation reset, modal keyboard isolation, `/enterprise`, `/api`, and `/small` all passed.
- Fresh-tab console check had no app errors. The only warning reports that reduced motion is enabled in the test environment, which the implementation honors.
- Fullscreen entry was attempted, but the in-app browser does not expose the Fullscreen API; the guarded fallback leaves the presentation rendered without a runtime error.
- `pnpm check` passed: documentation contract, repository-wide Prettier, ESLint, TypeScript, and production build.

## Implementation checklist

- [x] Removed all screenshot-backed product rendering and hotspot navigation.
- [x] Recreated the desktop and mobile product shells as React components.
- [x] Implemented five resettable deterministic flows with synthetic data only.
- [x] Implemented real forms, tables, drawers, pickers, editor, tabs, toggles, payment sheet, and chat.
- [x] Preserved slide entry CTAs, deep links, browser history, keyboard guards, focus restoration, and reduced motion.
- [x] Compared source and implementation together and verified the complete primary interaction paths in the browser.
- [x] Passed the full repository gate.

final result: passed
