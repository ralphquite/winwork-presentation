# Design QA — exported presentations and component-based demo flows

## Comparison target

- Source visual truth: `pencil/flows.pen` and the exact exported references under `public/demo-flows/`.
- API source visual truth: `pencil/preesentation_api_business.pen`, retained frames `API-01` … `API-06`, `API-12`, `API-15`, plus final node `TQWD8`, all at 1920 × 1080.
- API implementation: `http://127.0.0.1:4173/api?scene=<id>` for stable IDs `api-01` … `api-06`, `api-12`, `api-15`, and `api-17`; direct runtime exports live under `public/api-slides/`.
- API comparison evidence: `/tmp/winwork-api-qa/reference-grid.png`, `/tmp/winwork-api-qa/rendered-grid.png`, and `/tmp/winwork-api-qa/diff-grid.png`. Every direct browser capture is 1920 × 1080 at device scale factor 1.
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

### Iteration 13 — passed

- The API / Embedded placeholder was replaced with all 16 approved Pencil frames, mapped to stable IDs `api-01` … `api-16`. The track contains slide scenes only and exposes zero demo hotspots.
- Native 1920 × 1080 Pencil exports and native 1920 × 1080 Chromium renders were compared as full 4 × 4 contact sheets and as focused full-resolution pairs for the densest frames `api-02` and `api-10`.
- Copy, frame order, layout geometry, line wrapping, typography scale/weight, palette, borders, radii, shadows, progress markers, WinWork wordmark, icons, diagrams, and the API-01 hero asset were checked. Pixel differences of 1.33–3.36% are edge-antialiasing differences between the Pencil rasterizer and Chromium; no shifted container or clipped content remains.
- [P1 fixed] Prettier removed the trailing space between two separate flex text nodes in the `api-02` headline, so Chromium rendered `Подключитеинфраструктуру`. The export now preserves that designed word gap with a non-breaking space and matches the Pencil frame.
- The first Pencil PNG export isolates the `API-01` frame and omits the overlapping top-level hero-image node. The runtime HTML export includes that original node, references the deterministic adjacent asset `api-01-hero.png`, and the browser screenshot confirms the full hero composition.
- Browser checks passed for 16 selector options, previous/next controls, ArrowLeft/ArrowRight, Back/Forward, direct `api-16`, disabled next at the end, invalid-scene normalization to `api-01` while preserving `qa=kept`, landing readiness copy, Enterprise/Small route smoke checks, and zero application console errors. The only warning is the expected reduced-motion notice.

### Iteration 14 — passed

- A new quick-access `Регистрация юридического лица` flow was recreated from the live WinWork development sign-in and sign-up pages in Chrome. The split layout, WinWork branding, phone/login tabs, benefits, company and position fields, contact fields, password guidance, primary/secondary actions, confirmation copy, and email-sent state were compared at the same desktop viewport.
- The live development registration was completed with synthetic credentials. It confirmed the Russian-mail-domain validation and rendered the source `Последний шаг, чтобы завершить регистрацию` state before the prototype implementation was finalized.
- Every required demo field auto-fills on focus or click. The browser path passed end to end: sign-in → registration → company/position/phone/email/password auto-fill → email sent → demo confirmation → sign-in phone/password auto-fill → signed-in cabinet state.
- Reset, close/reopen, `Escape`, trigger focus restoration, and 900 × 700 scroll-safe desktop-canvas behavior passed. The fresh console contained no application errors; the only warning reports the test device's enabled reduced-motion preference.

### Iteration 15 — passed

- A standalone quick-access `Оплата выполненного задания` flow was recreated from the authorized live WinWork development Marketplace in Chrome. The selected synthetic row uses the presentation-safe title `Грузчик. Разгрузка товара на складе`, appears second in the local table with the green `ВЫПОЛНЕН` status, and opens a right-side task panel.
- The live source was inspected across `Задание`, `Исполнитель`, `Действия`, `Документы`, and `История`, plus the SMS-code state. Live payment attempts with `0000` reached the backend but returned validation/general errors; no successful payment or external side effect was observed.
- The deterministic prototype follows the clarified intended terminal behavior without a network call: `Подтвердить и оплатить` → code `0000` → `Оплатить` → green `Отправлено`, while the panel and Marketplace row change to `ОПЛАЧЕН`.

### Iteration 16 — passed

- The paid action state no longer offers `Отменить задание`; only the disabled green `Отправлено` confirmation remains.
- `court-05` reuses the same `task-payment` implementation through a hotspot aligned to the visible `Показать подтверждение оплаты` CTA.
- The isolated court entry imports the existing product-demo stylesheet so shared React flows retain their signed-in product layout without exposing or loading the protected sales bundle.
- Direct `court-05` browser QA passed at the normal Chrome viewport: the visible CTA opened the styled flow, the renamed task completed the `0000` payment path, both panel and table changed to `ОПЛАЧЕН`, `Отправлено` remained visible, and the post-payment cancel button count was zero.
- `Escape` closed the modal and restored focus to the `court-05` hotspot. At 900 × 700 the modal surface stayed 856 × 585 with the intended scrollable 1180 × 820 desktop canvas. The console had no application errors; the only warning was the expected reduced-motion notice.

### Iteration 17 — passed

- The landing-page quick-access panel now includes `Flow регистрации исполнителя`, an explicitly approved temporary screenshot-based flow with 17 captures loaded in numeric order from `public/performer-registration-flow/`.
- At the 1440 × 1080 browser viewport, the mobile frame measured exactly 375 × 932 px and every image rendered at the same 375 px width. All 17 runtime image requests returned HTTP 200.
- Previous/Next buttons, ArrowLeft/ArrowRight navigation while the viewer is focused, first/last disabled states, reset to screen 1, close/reopen, `Escape`, and trigger focus restoration passed with no runtime exceptions or console entries.
- The 1409 px-tall source for screen 14 produced a 1166 px rendered document inside the 932 px frame and scrolled 234 px to its bottom. Moving to screen 15 reset the frame scroll position to zero.
- At a 390 × 844 host viewport, the frame adapted to 313.83 × 780 px with the requested 375:932 ratio and no document-level horizontal overflow.
- Browser evidence: `/tmp/winwork-performer-flow-desktop.png`, `/tmp/winwork-performer-flow-long-scroll.png`, and `/tmp/winwork-performer-flow-narrow.png`.

### Iteration 18 — passed

- A standalone quick-access `Flow выбора исполнителя` was recreated from the authorized live WinWork Marketplace tab. The source evidence showed the right-side task drawer, `Отклики` tab, response-card hierarchy, viewed badge, rating/statistics, personal details, yearly income, and remaining-task limit.
- The new synthetic target row uses the orange `ЕСТЬ ОТКЛИКИ` status. Opening it lands directly on `Отклики (3)` with three scrollable performer cards; each card has a primary blue `Принять` button and a transparent red-outline `Отказать` button.
- The normal Chrome viewport rendered the table, dimmed Marketplace background, right-side drawer, status chip, active tab, first complete response card, and the start of the second card without clipping the desktop canvas. Accessibility output confirmed all three response cards and all six action buttons.
- Local accept/reject decisions changed only the selected card (`Принято` / `Отказано`). Modal reset removed those decisions and closed the nested task drawer; `Escape` closed the flow and restored focus to its landing-page card.

### Iteration 19 — passed

- The visible `Показать выбор исполнителей` CTA on `court-04` now opens the shared `performer-selection` implementation through a 1920 × 1080 hotspot at `x = 1358`, `y = 723`, `width = 458`, `height = 76`.
- Direct browser QA at `/court?scene=court-04` passed: the CTA opened `Flow выбора исполнителя`, its target Marketplace row opened `Отклики (3)`, and accessibility output confirmed all three performer cards and six decision buttons.
- `Escape` closed the modal and restored focus to the `court-04` hotspot. The court slide remained on the same stable scene URL.

### Iteration 19 — passed

- `court-03` now reuses the `performer-registration` screenshot flow through the visible `Показать путь исполнителя` CTA. The 1920 × 1080 hotspot measured `104 × 584`, `423 × 76`; the rendered CTA measured `104 × 584.16`, `422.39 × 76`, so the clickable geometry stays within one pixel of the source button.
- Direct `court-03` QA passed in both the development route and the built isolated court entry at `/court-app/court.html?scene=court-03`: the CTA opened `Flow регистрации исполнителя` on `/performer-registration-flow/1.png`, Next advanced to screen 2, and all 17 image requests returned HTTP 200.
- `Escape` closed the screenshot flow and restored focus to the `court-03` hotspot. No framework overlay or runtime exception appeared; the only application warning was the expected reduced-motion notice.
- The access-gateway contract now includes GET/HEAD-only public access for `/performer-registration-flow/*`, rejects POST to those assets, and keeps the remaining sales routes/assets behind the existing fail-closed boundary. `pnpm auth:check` passed 30 assertions.
- Browser evidence: `/tmp/winwork-court03-before.png` and `/tmp/winwork-court03-flow-open.png`.

### Iteration 20 — passed

- The Enterprise route now contains 15 scenes. Pencil node `sGz1w` is exported as `ent-10`, updated node `ygsEo` as `ent-11`, former `ent-16` content as `ent-12`, and former `ent-17` content as the final `ent-15`; the obsolete positions and their unreferenced assets were removed.
- Direct browser QA at `/enterprise?scene=ent-10` and Next to `ent-11` matched the approved Pencil exports at the rendered 1920 × 1080 canvas. The mismatch ledger is empty: titles, content hierarchy, images, counter, and scaling agreed with the two selected Pencil nodes.
- Next to `ent-12`, browser Back/Forward, direct `ent-15`, disabled Next at `15 / 15`, and invalid `ent-16` normalization to `ent-01` all passed. A 390 × 844 host retained the full `ent-10` canvas with the intended letterboxing and no document-level overflow.
- No framework overlay or application console error appeared. The only console warning came from the existing Pencil-export Tailwind CDN runtime. `pnpm check` passed the documentation, formatting, lint, type, auth, and production-build gates.

### Iteration 21 — passed

- Enterprise now contains 17 scenes. Updated Pencil node `yGBrt` remains at `ent-12`, restored node `iOKdp` is `ent-16`, and new node `CPLyo` is the final `ent-17`.
- Direct browser QA confirmed the updated `ent-12` title and trust/limitations/experience content. Direct `ent-16` rendered the Finance, HR, compliance, and support summary; Next advanced to the new onboarding timeline at `ent-17`.
- The final scene showed `17 / 17`, disabled Next, and rendered all four onboarding stages plus the final success state. Invalid `ent-18` normalized to `ent-01`.
- The normal Chrome viewport and a 390 × 844 host both retained the complete 1920 × 1080 final canvas with the intended letterboxing. No framework overlay or application error appeared; only the expected reduced-motion and Pencil Tailwind CDN warnings were logged.
- The mismatch ledger is empty: the three runtime HTML exports match the selected Pencil nodes. `pnpm check` passed the documentation, formatting, lint, type, auth, and production-build gates.

### Iteration 22 — passed

- Small Business now contains 12 scenes. Updated Pencil node `gZWhP` remains at `smb-07`, new node `iaGLr` is the final `smb-12`, and the former scenes `smb-12` through `smb-14` were removed from the route and runtime exports.
- Direct browser QA confirmed the updated `smb-07` title, response/profile hierarchy, trust cards, and source imagery. The `smb-11` Next control advanced to the new onboarding slide at `smb-12`; the final scene showed `12 / 12` with Next disabled.
- Browser Back/Forward preserved the `smb-11` → `smb-12` transition, while a direct `smb-13` link normalized to `smb-01`. At a 390 × 844 host viewport the complete 1920 × 1080 final canvas remained visible with the intended letterboxing and no document-level overflow.
- The mismatch ledger is empty across title, copy, hierarchy, spacing, color, imagery, and canvas geometry: both runtime exports match the selected Pencil nodes. No application console error appeared; the only warning was the expected reduced-motion notice.
- Browser evidence: `/tmp/winwork-smb07-desktop.png`, `/tmp/winwork-smb12-final.png`, and `/tmp/winwork-smb12-mobile.png`. `pnpm check` passed the documentation, formatting, lint, type, auth, and production-build gates.

### Iteration 23 — passed

- Small Business now contains 13 scenes. Pencil node `AduNG` is the penultimate `smb-12`, while onboarding node `iaGLr` moved unchanged to the final `smb-13` position.
- The four approved image fills referenced by `AduNG` were copied beside the runtime export as deterministic `smb-12-action-01.png` through `smb-12-action-04.png` assets. Their crop geometry, order, and rounded framing match the Pencil node.
- Browser QA exercised `smb-11` → `smb-12` → `smb-13`, confirmed `12 / 13` on `AduNG`, `13 / 13` with disabled Next on the final scene, and Back/Forward across the last transition. A direct invalid `smb-14` link normalized to `smb-01`.
- The 1920 × 1080 source canvas and a 390 × 844 host viewport rendered without clipping or document-level overflow. The mismatch ledger is empty across title, copy, four-step hierarchy, image order/crops, spacing, color, and canvas geometry; no application console error appeared, only the expected reduced-motion warning.
- Browser evidence: `/tmp/winwork-adung-pencil-reference.png`, `/tmp/winwork-smb12-adung.png`, and `/tmp/winwork-smb12-adung-mobile.png`. The Small Business scope passes formatting and documentation checks; repository lint, typecheck, 30 auth assertions, and both production builds also pass. The aggregate `pnpm check` also passes after the concurrent API slide exports were formatted.

### Iteration 24 — passed

- API / Embedded now contains nine scenes. Updated Pencil nodes `HypJR`, `vg05h`, `Y1se2`, `hLUa8`, and `dI7KV` remain at stable IDs `api-02` through `api-06`; retained scenes keep `api-12` and `api-15`; node `TQWD8` is the new final scene `api-17`.
- Former scenes `api-07` through `api-11`, `api-13`, `api-14`, and `api-16` were removed from the route and runtime exports. The production build contains only `api-01` through `api-06`, `api-12`, `api-15`, and `api-17`, plus the existing `api-01` hero asset.
- Direct browser QA confirmed all five updated slides and the new final slide at their 1920 × 1080 source geometry. The exported `api-02` headline preserves its designed word gap across the two differently colored text layers.
- Next advanced through `api-12` → `api-15` → `api-17`; the final scene showed `9 / 9` with Next disabled. Back/Forward preserved the sparse stable IDs, while a direct deleted `api-16` link normalized to `api-01` and retained `qa=kept`.
- The 1280 × 720 host rendered the complete slide canvas without document overflow. No application error appeared; the only console warning was the expected reduced-motion notice. `pnpm check` passed the documentation, formatting, lint, type, 30 access-gateway assertions, and both production builds.

### Iteration 25 — passed

- The authorized live WinWork development Marketplace was inspected in Chrome at the normal 1710 px-wide viewport in both the top-of-page and pagination states. The source evidence showed the full-height 250 px navigation rail, balances and account controls above the content, stacked heading/actions, six task tabs, four-part filter card, ten-column table, wrapped row details, status pills, row actions, and split pagination footer.
- The `single-task` Marketplace was rebuilt against that evidence without changing the other desktop demos. The rendered content starts at `x = 385`, keeps the source-aligned 1190 px content width, and measures the columns as `43 / 106 / 106 / 106 / 146 / 68 / 326 / 100 / 132 / 57` px. Visible people, identifiers, tasks, dates, and amounts remain deterministic synthetic demo data.
- Clean Chrome QA exercised Marketplace → `Разместить задание` → `Разовое задание` → complete existing form → created-task summary → `Готово`. Reset removed the nested drawer and restored scroll position to zero; `Escape` closed the demo and restored focus to its quick-access card.
- At 900 × 700 the dialog measured 880 × 680 px, the desktop app retained its 1180 × 820 px minimum canvas, and the 864 px-wide product surface exposed the full 1504 px scroll width instead of collapsing the table. A fresh console contained no application errors; the only entry was the expected reduced-motion warning.

### Iteration 26 — partial; overlay placement corrected in iteration 28

- The `single-task` Marketplace now keeps the 250 px navigation rail fixed inside the product viewport while only the content pane owns the table overflow. At 900 × 700 the outer surface stayed at `scrollLeft = 0` with `scrollWidth = 864`, the sidebar stayed at `x = 18`, and the 614 px content pane reached `scrollLeft = 640` across its 1254 px canvas.
- The navigation rail fills the complete 600 px product surface. Opening the task drawer locks both background content and navigation at `scrollTop = 0`; the 560 px drawer body is the only vertical scroller and reached `scrollTop = 979.5` across its 1445 px content without horizontal overflow.
- The task-type radio controls now use deterministic 20 × 20 px checked and unchecked states. Browser QA confirmed both labels remain aligned at the narrow viewport and that selecting `Регулярные задания` and returning to `Разовое задание` updates the native checked state.
- Marketplace rows now use natural-looking synthetic names, task descriptions, identifiers, dates, and reward amounts. The scroll and radio checks passed, but the visual review missed that the drawer and scrim still belonged to the scrolling content pane: the navigation/header remained undimmed and content scroll offsets displaced the drawer. The user-supplied follow-up screenshot confirmed this defect.
- `pnpm check` passed the documentation, formatting, lint, type, 30 access-gateway assertions, and both production builds.

### Iteration 27 — passed

- Enterprise now contains 16 scenes. The removed API-integration slide no longer has a runtime export or route entry; retained final scenes keep stable IDs `ent-16` and `ent-17`.
- At the 1920 × 1080 source canvas, `ent-02` renders its title on two 54 px lines with `и исполнителями` on the second line, while its 32 px-high lead remains on one line. `ent-04` renders its title on two 56 px lines with `и используйте данные во всех заданиях` on the second line. Both runtime exports agree with the updated Pencil source.
- Browser QA exercised `ent-14` → `ent-16` → `ent-17`, Back/Forward across the retained IDs, and the disabled Next control at `16 / 16`. A direct deleted `ent-15` link normalized to `ent-01`.
- The 1280 × 720 host and a 390 × 844 viewport rendered `ent-02` without document overflow. No application or framework error appeared; the only console warnings were the expected reduced-motion notice and the existing Pencil-export Tailwind CDN warning.
- Browser evidence: `/tmp/winwork-ent-02-after.png`, `/tmp/winwork-ent-04-after.png`, `/tmp/winwork-enterprise-final-16-of-16.png`, and `/tmp/winwork-ent-02-mobile.png`. `pnpm check` passed the documentation, formatting, lint, type, 30 access-gateway assertions, and both production builds.

### Iteration 28 — passed

- Both single-task drawer states now render through `DesktopShell.overlay`, outside the scrolling `main` and directly inside the product viewport. The header, navigation, and main content are inert while the overlay is present. The scrim covers the entire product surface; only the right drawer remains undimmed.
- At the normal 1710 × 930 Chrome viewport, the scrim and app both measured `x = 47`, `y = 90`, `1616 × 814` px, and the drawer measured `560 × 814` px with zero top/right/bottom gaps. At 900 × 700, the scrim and app both measured `x = 18`, `y = 82`, `864 × 600` px, and the drawer measured `560 × 600` px with the same zero-gap alignment. Hit testing over the logo, top balance area, lower sidebar, and lower content returned the scrim.
- The narrow content pane reached `scrollLeft = 640`; opening the drawer from the scrolled menu left the content at `scrollLeft = 41` without moving the overlay. Scrolling the drawer to `scrollTop = 915.5` and attempting to scroll the dimmed navigation left the background offsets unchanged. The drawer body had no horizontal overflow.
- Fresh-tab QA passed Marketplace → create form → created summary → `Готово`, reset from an edited form, close/reopen with the original worker count, radio selection by keyboard, and `Escape` with focus restored to the quick-access card. Row `f4c8a2d5` now includes the synthetic performer `Морозов И. А.` and demo identifier.
- `pnpm check` passed documentation, formatting, lint, types, 30 access-gateway assertions, and both production builds. The fresh browser console had no application errors; its only warning was the expected reduced-motion notice.

### Iteration 29 — passed

- Approved Pencil node `L4gz5t` was exported as `ent-18` and inserted after `ent-13`. Existing IDs remain stable, so the route order is now `ent-13` → `ent-18` → `ent-14`; removed `ent-15` remains unavailable and still normalizes to `ent-01`.
- The source and direct runtime render match at 1920 × 1080. The exported root measured exactly `1920 × 1080` with matching scroll dimensions, and the slide rendered at position `14 / 17` without clipped, collapsed, or overflowing content.
- Keyboard navigation, browser Back/Forward, preserved unrelated query parameters, and the final `ent-17` state at `17 / 17` with disabled Next all passed. A 390 × 844 host retained the complete letterboxed slide with document width equal to the 390 px viewport.
- Browser evidence: `/tmp/winwork-pencil-ent-18/L4gz5t.png`, `/tmp/winwork-ent-18-direct.png`, `/tmp/winwork-ent-18-desktop.png`, and `/tmp/winwork-ent-18-mobile.png`. There were no failed resources or console errors; warnings were limited to the expected reduced-motion notice and the existing Pencil-export Tailwind CDN warning.
- `pnpm check` passed documentation, formatting, lint, types, 30 access-gateway assertions, and both production builds.

### Iteration 30 — passed

- The approved desktop Marketplace is now shared by `single-task`, `performer-selection`, and `task-payment` through `MarketplacePage.tsx`. All three use the same heading/actions, six tabs, filter card, ten-column table, synthetic base rows, and pagination. Selection and payment retain their scenario-specific target tasks, amounts, and interactions; row `f4c8a2d5` includes its synthetic performer in every scenario. The manager's separate mobile Marketplace is unchanged by this update.
- At 1710 × 930, the shared table retained its 1190 px width and column geometry of `43 / 106 / 106 / 106 / 146 / 68 / 326 / 100 / 132 / 57` px. At 900 × 700, the payment content reached `scrollLeft = 640` while the outer surface stayed 864 px wide with `scrollLeft = 0`, and the 250 px navigation rail remained at `x = 18` with its full 600 px height.
- Selection and payment panels now use the shell overlay slot. At the narrow viewport, both measured `606 × 600` px at `x = 276`, `y = 82`, with zero top/right/bottom gaps; the scrim matched the entire `864 × 600` px product surface. In selection, wheel scrolling moved the panel from `494` to `895.5` px while the dimmed main stayed at `143.5` px and the sidebar stayed at zero, including a wheel attempt over the sidebar.
- Browser QA passed selection by row/keyboard, checkbox isolation, three response cards, accept/reject, close/reopen, and reset. Payment passed all five tabs, invalid SMS feedback, local SMS `0000` confirmation, the disabled `Отправлено` state, the table's `ОПЛАЧЕН` status, and reset to `ВЫПОЛНЕН`. The shared single-task page still completed menu → edited form → created summary → `Готово` with the updated reward.
- Court entry points `court-04` and `court-05` opened the updated flows. An arrow key inside the Marketplace search field did not change the scene, and Escape restored focus to each initiating Court CTA and each quick-access card. The browser console contained no application errors; its only warning was the expected reduced-motion notice.
- `pnpm check` passed documentation, formatting, lint, types, 30 access-gateway assertions, and both production builds. The production build retains the non-blocking bundle-size warning.

### Iteration 31 — passed

- Small Business now has 12 scenes. Former slide `AduNG` was removed from the route and runtime exports, while `iaGLr` is the final `smb-12`; a direct obsolete `smb-13` link normalizes to `smb-01` without dropping unrelated query parameters.
- Slides 3, 4, and 5 use the approved title breaks. Slide 5 places `Нужен новый исполнитель` on the left and `Уже есть исполнитель` on the right, and slide 6 no longer includes `одно` in its heading.
- Slide 10 was synchronized with Pencil node `yHEGM`, including the updated lead, added tax step, five 100 px process cards, and final stack position. Its direct 1920 × 1080 runtime capture is byte-identical to a fresh HTML/CSS export from Pencil.
- Browser QA passed `smb-11` → `smb-12`, the final `12 / 12` state with disabled Next, browser Back/Forward, preserved query parameters, deleted-scene normalization, and a 390 × 844 narrow host without document-level horizontal overflow. No application console errors, failed requests, or Vite error overlay were present.
- Evidence: `/tmp/winwork-smb-05-after.png`, `/tmp/winwork-smb-10-pencil-export.png`, `/tmp/winwork-smb-10-direct.png`, `/tmp/winwork-smb-12-final.png`, and `/tmp/winwork-smb-05-mobile.png`. `pnpm check` passed documentation, formatting, lint, types, 30 access-gateway assertions, and both production builds; the production build retains the non-blocking bundle-size warning.

### Iteration 32 — passed

- `court-03` now labels the customer strip as `Заказчики WinWork` and renders the five supplied marks Atomy, Гемотест, Pampadu, Skillbox, and Telega.in. DNS is not referenced. Runtime copies live under the existing public `court-assets` boundary.
- The built isolated entry at `/court-app/court.html?scene=court-03` returned HTTP 200 at 1920 × 1080 and 1280 × 800. All five images completed with non-zero natural dimensions; no placeholder copy, clipping, overlap, failed request, framework overlay, or application console warning/error was present.
- The performer-registration CTA still opened its dialog, `Escape` closed it and restored focus, and keyboard navigation loaded `court-02`, `court-03`, and `court-04` correctly. Browser evidence: `/tmp/court-03-customers-desktop.png` and `/tmp/court-03-customers-compact.png`.
- `pnpm check` passed the documentation, formatting, lint, types, 30 access-gateway assertions, and both production builds. The production build retains the existing non-blocking bundle-size warning.

### Iteration 33 — passed

- The legacy 17-capture performer-registration viewer was replaced with 11 ordered states from the approved Figma file. Ten states are React/CSS product surfaces; the explicitly requested `Мой налог` loading state is the exact 430 × 979 px Figma capture. Every host exposes the same bounded viewport, long marketplace/citizenship/personal-data states scroll vertically, and changing state resets scroll to the top.
- Company marks, citizenship icons, the `Завершите регистрацию` illustration, and the `Вы зарегистрировались` illustration now use exact individually exported Figma raster assets without CSS sprite offsets or improvised icon geometry. Visual QA covered the top and bottom of the marketplace list and the complete scrollable country list.
- Browser QA passed all 11 click-anywhere transitions, last-state stability, reset to state 1, close/reopen, `Escape`, focus restoration, and a 390 × 844 narrow host. The desktop viewport measured 430 × 979 px in every state; long-state scroll heights were 1360 px for Marketplace, 1328 px for citizenship, and 1114 px for personal data. The completed state is clipped to the shared 979 px height so its success sheet remains visible at the bottom. Every rendered image had non-zero natural dimensions, with no failed requests or HTTP error responses.
- Evidence: `/tmp/winwork-registration-qa-01.png`, `/tmp/winwork-registration-qa-04.png`, `/tmp/winwork-registration-qa-04-bottom.png`, `/tmp/winwork-registration-qa-05.png`, `/tmp/winwork-registration-qa-05-bottom.png`, `/tmp/winwork-registration-qa-09.png`, `/tmp/winwork-registration-qa-11.png`, and `/tmp/winwork-registration-qa-narrow.png`.
- `pnpm check` passed the documentation contract, repository-wide Prettier, ESLint, TypeScript, 30 access-gateway assertions, and both production builds. The existing bundle-size warning remains non-blocking.

### Iteration 34 — passed

- Performer-registration login states now show `Войдите в приложение Win Work`, and the legal acceptance copy names the visible `Войти` button without the obsolete `KDV ID` label.
- The shared `Мой налог` panel on states 6 and 8 now uses the exact clipped 150 × 119 px Figma export from node `10:1550`. Its image bounds match the panel bounds on both states, so the seal and lower ribbon remain fully visible and centered.
- Playwright QA passed the login-copy assertions and rendered states 1, 6, and 8 at the shared 430 × 979 px viewport without console errors. Evidence: `/tmp/winwork-registration-fixes/01-login.png`, `/tmp/winwork-registration-fixes/06-work-format.png`, and `/tmp/winwork-registration-fixes/08-tax-connect.png`.

### Iteration 35 — passed

- The `performer-response` placeholder was replaced with the three approved Figma states 2.1–2.3: Marketplace, the selected merchandising task before submission, and the submitted response marked `На рассмотрении`. The surfaces are React/CSS; all visible company marks and icons use exact local Figma exports under `public/performer-response-flow/assets/`.
- Same-viewport Playwright comparison covered all three 430 × 979 source states. The mismatch ledger is empty for content hierarchy, card geometry, date groups, sticky bottom navigation/action, response status, company card, submitted actions, typography scale, colors, and scroll position. The existing rounded modal-host boundary remains outside the product layout.
- QA passed the target `Мерчендайзер` action, task-detail Back, response submission, final-state stability, reset, close/reopen, `Escape`, focus restoration, and a 390 × 844 narrow host. All 18 requested runtime assets returned HTTP 200 with no failed requests, framework overlay, or console warning/error.
- The production court bundle at `/court-app/court.html?scene=court-03` opened the second CTA, completed 2.1 → 2.2 → 2.3, and restored focus to the initiating CTA after `Escape`. Evidence: `/tmp/winwork-response-render-2.1.png`, `/tmp/winwork-response-render-2.2.png`, `/tmp/winwork-response-render-2.3.png`, `/tmp/winwork-response-render-narrow.png`, and `/tmp/winwork-response-court-final.png`.
- `pnpm check` passed the documentation contract, repository-wide Prettier, ESLint, TypeScript, 32 access-gateway assertions, and both production builds. The existing bundle-size warning remains non-blocking.

### Iteration 36 — passed

- Rechecked the submitted performer-response state against Figma node `15:2763`. The `На рассмотрении` status and `Отклик на рассмотрении у заказчика` explanation now remain in normal document flow as the first content block inside the secondary task card; the erroneous negative vertical translation was removed.
- At the source viewport, the rendered task card measured 398 × 362 px, matching the Figma node geometry. The status block stayed fully inside its 16 px card padding, with the specified 8 px internal gap and the divider immediately below it.
- Playwright passed the full Marketplace → target task → submit response path, Back, reset, close/reopen, focus restoration, and the 390 × 844 narrow host. All 18 performer-response assets returned HTTP 200; there were no failed requests, framework overlays, or console warnings/errors. Evidence: `/tmp/winwork-response-render-2.3.png`.

### Iteration 37 — passed

- Figma node `15:2763` confirms that the submitted response state retains the same 44 px navigation bar as the preceding task-detail state. Screen 2.3 now reuses `DetailHeader`, including the exported back icon and centered `Отклик` title, instead of reserving an empty 44 px spacer.
- Playwright completed 2.1 → 2.2 → 2.3, found the header and back control visible on 2.3, then used that control to return to 2.2 with its bottom response action restored. The corrected status block remained fully inside the 398 × 362 px task card. No failed requests, framework overlay, or console warning/error was present. Evidence: `/tmp/winwork-response-render-2.3-header.png`.

### Iteration 38 — passed

- All three performer-response surfaces now support click-anywhere progression: any ordinary click on 2.1 advances to 2.2, and any ordinary click on 2.2 advances to 2.3. Screen 2.3 remains stable on further clicks.
- Existing semantic controls avoid duplicate transitions. The target-task and bottom response buttons advance exactly one state, while each header Back button stops propagation and returns to the preceding state.
- Playwright exercised non-CTA clicks on the `Главный` heading and task title, confirmed the complete 2.1 → 2.2 → 2.3 sequence, clicked ordinary content on the final state, and then verified 2.3 → Back → 2.2. Reset, close/reopen, focus restoration, and the 390 × 844 narrow host also passed without failed requests, framework overlays, or console warnings/errors.

### Iteration 39 — passed

- Performer-registration Marketplace states 4 and 11 now use the five task records from Figma node `10:963`: `Мерчендайзер`, `Фасовщик`, `Уборка и клининг`, `Оператор`, and `Ассистент`, including the approved companies, addresses, rewards, times, durations, and the final `Не указан` state.
- The four distinct company marks are exact locally stored Figma image exports. Browser measurements matched the designed visual bounds: `25 × 24`, `37 × 9`, `36 × 35`, and `25 × 25` px; the shared HP Group mark is reused for its two cards.
- Playwright opened the quick-access flow, advanced to screen 4, verified all five complete card strings and all image natural dimensions, scrolled through the 430 × 979 viewport, then advanced to screen 11 and confirmed the registration-success sheet over the updated Marketplace. No failed requests, framework overlay, or console warning/error was present.
- Evidence: `/tmp/ww-figma-main-10-963.png`, `/tmp/ww-main-top.png`, `/tmp/ww-main-bottom.png`, and `/tmp/ww-main-final.png`. `pnpm check` passed the documentation contract, repository-wide Prettier, ESLint, TypeScript, 32 access-gateway assertions, and both production builds; the existing bundle-size warning remains non-blocking.

### Iteration 40 — passed

- Rechecked the performer-response flow against the revised Figma states: Marketplace node `29:1047`, task-detail node `15:2719`, and submitted-response node `15:2763`. All five Marketplace cards now use the approved roles, companies, addresses, prices, times, and durations; both detail states consistently show the updated `ООО “Перспектива”` merchandising task and its revised order metadata.
- The four revised company marks are exact local Figma PNG exports under `public/performer-response-flow/assets/`. The Marketplace and detail variants of the `Перспектива` mark were byte-identical, so both states reuse one 25 × 24 px runtime asset; the other source images loaded at 370 × 91, 444 × 434, and 316 × 316 px with their Figma display sizes preserved in CSS.
- Browser QA at the exact internal 430 × 979 px viewport confirmed all three states, loaded every rendered logo with non-zero natural dimensions, completed 2.1 → 2.2 → 2.3 through ordinary screen clicks, kept 2.3 stable on a further click, returned 2.3 → 2.2 → 2.1 through Back, reset to state 1, closed with `Escape`, and restored focus to the opener. The `court-03` CTA opened the same revised state 2.1; no application error was logged.
- `pnpm check` passed the documentation contract, repository-wide Prettier, ESLint, TypeScript, 32 access-gateway assertions, and both production builds. The existing bundle-size warning remains non-blocking.

### Iteration 41 — passed

- Pencil node `rHcx4` was saved in `pencil/court_presentation.pen`, exported as `court-06`, and appended after the existing five public Court scenes. The source and runtime retain the approved 1920 × 1080 frame, title, period, and six metrics: `3 000+`, `250 000+`, `513 000`, `230 846`, `4 млрд ₽`, and `118 млн ₽`.
- Direct `/court?scene=court-06&qa=kept` QA returned HTTP 200 with six scene-picker options, `6 / 6`, disabled Next, a loaded `court-06.html` iframe, and no framework overlay. The 1440 × 1000 host rendered the complete slide at 1440 × 810 px; the 900 × 700 host rendered it at 900 × 506.25 px without clipping or overflow.
- Navigation passed `court-06` → Previous to `court-05` → ArrowRight to `court-06` → browser Back/Forward while preserving `qa=kept`. The direct slide asset returned HTTP 200. The console had no application errors; its only warning was the expected reduced-motion notice.
- Evidence: `/tmp/winwork-court-06-desktop.png` and `/tmp/winwork-court-06-compact.png`. `pnpm check` passed the documentation contract, repository-wide Prettier, ESLint, TypeScript, 32 access-gateway assertions, and both production builds; the existing bundle-size warning remains non-blocking.

### Iteration 42 — passed

- The offline Court entry now renders exactly three always-visible bottom-left controls: Previous, Next, and return to the first slide. The standard scene picker, counter, and fullscreen corner button remain unchanged in the web Court entry and the protected presentation tracks.
- Off-target clicks in the offline file now stop before changing a flow and apply a two-pass shimmer/outline to the current top-layer target actions. Browser checks covered both slide hotspots and the legal-entity registration target; hidden Marketplace rows behind an open task panel are not highlighted. Performer-registration click-anywhere progression remains unchanged.
- The measured `court-03` hotspots now match the rendered CTAs within 0.03 px. On `court-04`, the three upper cards, two lower signal cards, and CTA all measure 548 px wide; the CTA and hotspot both measure `x = 1268`, `y = 722.02`, `548 × 76`. The `court-05` FNS overlay opened a new tab and requested exactly `https://npd.nalog.ru/aggregators/`.
- Completed-task payment now opens its target row on `Действия` while keeping all five tabs enabled. Its performer card uses the same card structure and styling as performer selection; `12 оценок` opens the shared accessible review drawer and returns focus to its trigger after close.
- `court-06` retains its title, date range, and all six approved metrics while its participant, activity, period, and finance blocks now use the same bordered, rounded, softly shadowed card language as the earlier Court slides. The matching Pencil nodes were updated with the same card properties.
- Regular Playwright was used because the Browser plugin was not available. The final 3,129,185-byte HTML opened directly through `file://` with networking disabled and passed all six scenes, all six Court flows, hash Back/Forward, reset, focus restoration, Escape after a flow screen transition, three-button bounds at 900 × 700, embedded assets, zero HTTP requests, and zero console errors. SHA-256: `f126b08746b80cd4761572120482a323f0e8f73108d53f2b5cf1f136083325a4`.
- Evidence: `/tmp/court-03-offline-hints.png`, `/tmp/court-04-final.png`, `/tmp/court-payment-performer-card.png`, `/tmp/offline-court-06-file-final.png`, and `/tmp/offline-court-narrow-final.png`.

### Iteration 43 — passed

- Offline off-target hints now appear only inside demo dialogs and use a static outline: computed animation is `none` and no shimmer pseudo-element is present. Blank clicks on each of the six slide backgrounds produce zero hints. The performer-selection task drawer and nested reviews opt out entirely; the initial Marketplace target still hints normally, and clicking it clears the previous hint.
- Court hover/focus overlays now measure the actual `data-demo-flow` CTA or link bounds and corner radius after document/font readiness. Embedded Court documents use `srcDoc` so the same shared renderer can measure them through `file://`; config bounds remain the fallback for unmarked exported slides. Browser measurements on all five interactive slides differed by less than 0.02 px at 1440 × 900 and at 900 × 700 with Arial substituted for the system font.
- Regular Playwright was used because the Browser plugin was not available. Direct-file QA with networking disabled verified all six scenes and dialogs, legal-entity registration hints and transition, the single-task form, performer registration advance/reset, response submission, selection reviews/accept/reset without drawer hints, payment through SMS `0000`, hash Back/Forward, reset, shortcuts, Escape, focus restoration, embedded images, zero HTTP requests, and zero console errors.
- Web smoke checks at 1440 × 900 verified `/enterprise?scene=ent-04`, `/api`, `/small?scene=smb-06`, and `/court-app/court.html?scene=court-03`: standard controls, rendered slides, and demo open/close/focus restoration where available all passed without console errors. `pnpm check` and `git diff --check` passed; the existing bundle-size warning remains non-blocking.
- Evidence: `/tmp/court-outlines-fixed.png`, `/tmp/court-outline-only-hint.png`, `/tmp/court-selection-no-hints.png`, and `/tmp/court-outlines-narrow.png`. The rebuilt HTML is 3,129,405 bytes; SHA-256: `917175e317ca7f9087c6cd942758b1d0becdfd245a568d16fbbd0a25cdefd0cc`.

### Iteration 44 — passed

- Completed-task payment now uses `1234` for both the SMS placeholder and local validation. Clicking or focusing the empty field fills that code automatically; manual editing remains available, and reset/reopen clears the field.
- Direct-file Playwright QA with networking disabled passed click autofill, keyboard autofill, successful payment, invalid-code feedback and recovery, reset/reopen, Escape/focus restoration, keyboard isolation, and the same payment path at 1440 × 900 and 900 × 700. There were zero HTTP requests and zero console errors. `pnpm check` and `git diff --check` passed.
- Evidence: `/tmp/court-payment-code-autofill.png`. The rebuilt offline HTML is 3,129,448 bytes; SHA-256: `e6f071be70ed3062e016cb27f5cd0d14fc59fe604f41a684d160ee1c95e5c5d3`.

## Interaction and runtime evidence

- Create object: list → `Добавить объект` → editable drawer → add manager/activity → save → new synthetic row; reset removes the new row.
- Manager app: login → marketplace; create task; open order and switch tabs; filter awaiting payment → payment → five-digit OTP; settings → notification toggles; chats → thread → send local message.
- Activity: settings list → `Добавить вид деятельности` → requirements/operations → save.
- Templates: activity drawer → anchored contract/act dropdown → search/select/save; contract create action → editable document editor → save and select.
- Single task: marketplace → `Добавить задание` → `Разовое задание` → form → created-task details.
- Legal-entity registration: sign-in → registration auto-fill → email sent → confirmed sign-in → cabinet.
- Completed-task payment: Marketplace row 2 → all five task tabs → actions → SMS `1234` (empty field fills on click/focus) → green sent state → paid row status.
- Performer selection: Marketplace row 2 → `ЕСТЬ ОТКЛИКИ` → `Отклики (3)` → three performer cards → local accept/reject decisions.
- Court performer registration: `court-03` → `Показать путь исполнителя` → 11 Figma-derived states with click-anywhere progression, shared viewport height, and per-state vertical scrolling.
- Court performer response: `court-03` → `Показать путь отклика исполнителя` → target task → submit response → `На рассмотрении`; Back, reset, `Escape`, focus restoration, and narrow-host adaptation passed.
- Direct scene links, browser Back/Forward, presentation reset, modal keyboard isolation, `/enterprise`, `/api`, and `/small` all passed.
- Fresh-tab console check had no app errors. The only warning reports that reduced motion is enabled in the test environment, which the implementation honors.
- Fullscreen entry was attempted, but the in-app browser does not expose the Fullscreen API; the guarded fallback leaves the presentation rendered without a runtime error.
- `pnpm check` passed: documentation contract, repository-wide Prettier, ESLint, TypeScript, and production build.

## Implementation checklist

- [x] Removed the legacy 17-screen screenshot renderer and hotspot navigation; retained only the explicitly approved `Мой налог` loading capture.
- [x] Recreated the desktop and mobile product shells as React components.
- [x] Implemented resettable deterministic component flows with synthetic data only; performer registration and performer response use exact Figma assets where explicitly approved.
- [x] Implemented real forms, tables, drawers, pickers, editor, tabs, toggles, payment sheet, and chat.
- [x] Preserved slide entry CTAs, deep links, browser history, keyboard guards, focus restoration, and reduced motion.
- [x] Compared source and implementation together and verified the complete primary interaction paths in the browser.
- [x] Passed the full repository gate.

final result: passed

## 2026-09-21 — commission-reduction onboarding

- Added the protected `/onboarding` catalog and self-contained `dist/offline/Открыть онбординг WinWork.html`; the same React components serve both entries. The first flow opens automatically with an introduction, four anchored action steps and a completion guide. Help before the bell exposes progress, resume/repeat and explicitly upcoming scenarios.
- Reference: the authorized dev start page, tariff and empty 600px application drawer. Inspected at 2560 × 1267; copied original SVG/QR assets and Roboto/Montserrat fonts. Compared local screens at the same viewport, adjusting grid, banner, table rows and form positions. Data is synthetic. This is visual inspection, not a numerical zero-difference pixel-diff certification.
- The precise success copy and 408px dialog layout were recovered from the loaded dev frontend's commission-reduction success handler and shared dialog styles. No real application was submitted. After confirmation closes, the banner remains and 7% is still displayed; only the onboarding task is marked complete.
- Browser checks passed for guided and unguided demo submission, invalid passport feedback, missing attachment validation, demo attachment/remove/reattach, help, completion, first-open/reset, preserved dismissal and fixture progress after reload, Escape, focus restoration and success-dialog Tab wrapping. Inspected the drawer and guide at 900 × 700 and the completed flow at 1440 × 900. Browser console reported no errors or warnings.
- State assertions passed for validation, safe fixture reconstruction, excluding typed passport values and filenames from storage, recovering incomplete readiness, corrupt storage and reset. `pnpm check` passed, including 32 gateway assertions and all builds; packaging asserts that CSS assets and scripts are embedded and includes a network-blocking CSP.
- Verification limit: Browser Use blocked `file://` navigation by its URL policy. Its file chooser also lacked file-URL access, so physical JPG/PNG selection could not be completed through automation. The single-file artifact was built and statically checked, but an actual double-click launch with networking disabled remains a manual check. The synthetic attachment path was fully exercised in the browser.

## 2026-09-21 — click-only onboarding form

- Fields now fill deterministic synthetic values on click or Enter/Space, including citizenship; focus via Tab alone leaves the field empty. The original selfie surface attaches the demo marker immediately. There is no file input or native picker; drag/drop also only attaches the synthetic marker.
- Browser verification passed: all individual field clicks, keyboard citizenship activation, selfie before the final field, automatic advance to Send, repeated passport/photo clicks without duplicates, removal/re-attachment, reload restoring the filled form, successful submission and reset. DOM check confirmed one attachment and zero file inputs; console errors were empty.
- Added the canonical `docs/skills/winwork-onboarding/SKILL.md`, routed from `AGENTS.md` and `context-index.json`, and linked it into `~/.codex/skills/winwork-onboarding`. It records the click-only interaction contract and concrete extension points for later scenarios.
- `pnpm check` passed and rebuilt the standalone onboarding HTML. The earlier `file://` automation restriction still applies; physical file selection is no longer part of the requested demo behavior.

## 2026-09-21 — top-up invoice and filled-field correction

- Corrected a split selector in `onboarding.css`: the input selector had accidentally joined the read-only cursor rule, leaving sizing and padding on selects only. All eleven application fields now share the 56px height and 26px top padding. Browser geometry confirmed labels end above values; screenshots confirmed passport, company, email and telephone content, including a 390px-wide drawer.
- As explicitly requested, invoice and QR actions now occupy a separate pale-blue card above bank requisites. Checked at 2560px and 1280px viewport widths; controls stay within the card.
- Inspected the authorized live invoice screen and QR popover. Recreated Back, the 550px form, PDF/XLSX choice, amount and generation action. The source handler downloads a file, without an email or success modal. No real invoice or payment was created.
- Verified amount activation with Space, browser download events for both PDF and XLSX, fresh reopening, Back/Escape focus restoration, QR dismissal, and hiding/restoring the commission guide when visiting the invoice. The PDF was rendered and inspected; PDF text and XLSX numeric amount were checked. The QR encodes only a non-payment demo marker.
- Passed `pnpm check`. The regenerated 570,135-byte offline HTML contains byte-identical PDF/XLSX fixtures and the corrected shared input rule; no external script tags remain. Actual `file://` execution remains unverified because of the previously observed browser-tool restriction. Web UI verification and static artifact checks do not substitute for that test.

## 2026-09-21 — native-looking field activation

- Removed the blue focus outline from onboarding product fields, following the user's explicit WinWork reference correction. Button/radio focus indicators and guide target highlights remain scoped separately.
- Browser checks confirmed `outline-style: none` on activated passport, email and invoice-amount inputs. The filled passport screenshot retained its spacing without a surrounding blue frame. `pnpm check` passed and rebuilt the offline HTML (570,221 bytes); direct `file://` verification remains subject to the earlier tool restriction.

## Company-information onboarding · 2026-09-21

- Inspected the authorized Chrome `/aggregator/settings/company` source and compared its filled public-profile layout with the semantic local form at the same 2560px desktop width. Source viewport height was 1267px; local desktop captures used 1323px, so this was a geometry/content comparison, not a pixel-diff claim. The local public card measures 900 × 822px, matching the source; logo is 112px, inputs 56px, description 113px, with separate labels and paired phone/email. Legal/review data and the attached logo are explicitly synthetic. Empty and filled local forms were visually inspected, including email/tel values and no blue input-focus outline.
- Completed the company scenario through home, Settings, company tab, all fixtures and Save. Confirmed the source-derived “Публичный профиль обновлён” toast, completion in both catalogs and restored fields after reload. Also exercised dismissed guidance, empty-name validation, partial save without completion, Tab without filling, Enter/Space filling, repeated activation, logo removal/re-attachment after other fields, pause/resume, Escape, help focus trapping/restoration, hash Back/Forward and focus restoration to the correct catalog card. Company reset preserved tariff progress. Tested 800/820 × 900 and 390 × 844 browser surfaces: the desktop canvas scrolls; the completion card and action remain operable. Temporary viewport overrides were reset.
- Rechecked the existing tariff flow from its saved form checkpoint through final-field entry and the original success dialog; both flows report completion in the shared help. Early development HMR errors were observed while extracting the shell and extending the effect dependency list; they are distinct from the successful final type/lint/build verification.
- `pnpm check` passes, including documentation, formatting, lint, types, 32 auth assertions and both offline packages. Additional ephemeral state checks cover incomplete/corrupt checkpoints, storage denial, safe fixture-only serialization and independent resets. `git diff --check` passes.
- `dist/offline/Открыть онбординг WinWork.html` was rebuilt with both scenarios and embedded dependencies; packaging assertions reject external CSS assets/scripts and its CSP forbids connections. Direct `file://` QA was blocked by the browser tool's URL security policy in this session. No offline browser execution or zero-runtime-request claim is made.

### Softer onboarding target outlines · 2026-09-21

The shared `[data-tour-active='true']` outline now uses the same RGB color (71, 115, 237) at 70% opacity with a 6px base corner radius. Existing rounded logo surfaces keep their own radius. Verified in Chrome at 2560 × 1323 on the tariff passport group and company brand-name field: both compute a 2px `rgba(71, 115, 237, 0.7)` outline and 6px radius; screenshots confirm rounded corners. The change applies to both onboarding flows and their shared offline build.

## First marketplace task onboarding · 2026-09-21

- Inspected the authorized Chrome Dev session for ООО «Ф»: empty list, single-task creation drawer, filled fields/work items, created row, read-only detail and empty responses. The user explicitly authorized creating a synthetic Dev task. The street input stayed invalid even after entry, so the live reference task used remote work. The future task became visible after clearing the date filter; its status was “Создан”. Runtime demo data and the task number are synthetic.
- Compared source and local screenshots at the same 1710 × 930 viewport. Recreated the company-only navigation, underline tabs, filters/table, 552px creation panel, 630px detail panel and shared form controls. Filled fields retain floating labels above values. The existing onboarding help control and prototype tools remain deliberate additions.
- Chrome QA passed the guided address path and unguided remote path, click/Enter/Space fixtures, Tab without filling, repeat clicks, additional-work removal/replacement, required-field gating, creation, single table row, detail, empty responses, reload of a ready form, pause/resume, Escape and focus restoration. Help focus wraps, the three-flow catalog works, and marketplace reset preserves visible tariff/company progress. Checked older tariff CTA and company profile navigation. No console errors were recorded in the local demo.
- Inspected the detail and completion guide at 800 × 900: the panel stays within the viewport and the guide leaves its response-tab target available. The wide table intentionally uses the existing overflow-safe desktop canvas.
- State assertions passed for incomplete forms, extra work, audience selection, remote/address readiness, fixture-only persistence, invalid checkpoint recovery, storage denial and independent reset. `pnpm check` passed, including all builds and 32 access-gateway assertions. The standalone HTML is rebuilt with all three flows.
- Direct `file://` opening was blocked by the browser tool URL policy. Packaging assertions confirm embedded CSS assets/scripts and CSP `connect-src 'none'`; offline browser execution and runtime network inspection are not claimed.

## 2026-09-21 — account top-up onboarding and in-card reset

- Added the second catalog/help entry, `#topup`, with four guided steps on the existing shared tariff and invoice screens. Commission completion links into top-up; its prepared-invoice result links into the first marketplace task. The catalog/help report invoice preparation, never a credited balance.
- Verified optional copying (clipboard digits match the synthetic account) and a PDF requisites download, disabled generation before amount entry, Space activation, reload at the generation step, XLSX download and the final guide. Both inter-flow transitions were exercised. The source service was not mutated. The new requisites PDF was rendered and visually inspected.
- Checked pause/resume after leaving for Home, help focus trap and Escape restoration, four help entries from the company flow, catalog completion, and resetting only top-up while tariff completion and marketplace progress remained intact. State checks covered malformed/denied storage, valid checkpoints, resume pages and completion validation.
- At 1280 × 800 the invoice guide stayed within the viewport without intersecting the form. At 390 × 844 every catalog reset remained inside its own card, all cards fit the viewport and there were no nested buttons. Field activation retains the user's no-blue-outline correction.
- The complete `pnpm check` gate passed. Offline PDF/XLSX assets are bundled with the same components; direct `file://` execution remains unverified because of the earlier browser-tool restriction.

## Onboarding training entry — 2026-09-21

- User-requested header change: pale-blue “Обучение” button with “Пройдено N из 4”, shared by tariff, top-up, company and marketplace. Existing question icon retained; unrelated screens follow their prior reference.
- Chromium opened the rebuilt single HTML through `file://` with networking disabled. Completing the company profile changed the header from 0/4 to 1/4 immediately; reload and all four flow entries retained 1/4. Reset returned it to 0/4. The help-panel count matched.
- Mouse/Enter opened the help list; Escape restored focus to the training button in all four flows. No console errors or HTTP requests. Header checked at 1920, 1440, 1280, 1120, 1080, 700 and 390px; narrow hosts retain the existing scrollable desktop canvas. Balance descriptions collapse below 1200px to leave room for the wider training entry.

## 2026-09-25 — tariff and top-up tab redesign

- Replaced the combined tab with “Тариф” and “Пополнение”. The tariff occupies one full-width card with the requested two-column grouping. Top-up has an inline amount/PDF/Excel form and permanently visible QR on the left, copyable requisites on the right. The three notices use the same existing pale-blue treatment and Roboto body type; the page title retains bundled Montserrat. No new font files or palette colors were introduced.
- Inspected both tabs in Chrome from the rebuilt `file://` HTML and in the local Vite app. Verified PDF and XLSX downloads, the requisites PDF, copy feedback, unchanged zero balance, persisted amount/format/prepared state after reload, keyboard tab switching and invoice retention across tabs. Native Chrome's downloads list showed all three generated files as complete.
- Passed all four guided top-up steps, empty-amount disabling, Tab without filling, Space to fill, preparation result, pause after switching away, resume to the correct tab, and Escape/focus restoration. Completed the synthetic commission application and confirmed success; switching between tabs preserves its invoice values. Catalog reset cleared only top-up and retained the completed commission scenario.
- Visually inspected at the default 1710px viewport and at 1100px. At 1100px both top-up cards had matching 389px client/scroll widths. At 700px the existing 1080px desktop canvas remains horizontally scrollable; neither tariff column has internal overflow. Viewport override was reset afterward. Filled amount stays below its floating label.
- Local browser computed styles confirmed Montserrat 32px for the page heading and Roboto 22px / 16px for the card heading / action. Browser console reported no warnings or errors during the checked flows. Migration/resume checks covered old v1 tariff/invoice checkpoints, format retention, v2 reload and rejection of an invalid prepared-without-amount state.
- Fresh comparison to live dev fonts was blocked: `my-smz-partner-front-dev.apibank.tech` failed DNS resolution and Chrome showed a network error. Existing source font provenance is from 2026-09-21; a fresh live match is not claimed. The browser extension later blocked `file://` inspection; networking-disabled runtime inspection was therefore not completed. The offline packager's embedded-asset assertions passed and CSP still blocks network connections.
- `pnpm check` passed (documentation, formatting, lint, TypeScript, 32 auth assertions and all builds). The offline HTML was rebuilt from the same components. No commit, push or deployment was performed.

## 2026-09-25 — tariff balance, ruble glyph and top-up guidance refinement

- Fresh read-only inspection of the authorized dev Chrome tab succeeded after the earlier connection failure: the page title uses Montserrat 32px/700, the card title Roboto 22px/700, tabs Roboto 16px/400, the ruble balance symbol Roboto 15px/400, and the application button Montserrat 15px/500. No source application, invoice or payment was submitted.
- Font cmap inspection identified missing U+20BD in the original four Latin/Cyrillic files. Official ruble-only variable subsets of the same Roboto/Montserrat families now provide the glyph through scoped font-face rules. Binary checks confirm U+20BD exists in both new files; screenshots show consistent rubles in balances, rates and the filled amount. No new family or palette color was added.
- All payment groups are now on the right of the tariff card. The enlarged commission block and document/check prices occupy the left. At 1710px, both columns measured 512px tall, with no internal horizontal overflow. At 1100px, both remained 512px tall and overflow-free.
- Top-up uses a shared company-account warning above equal-height cards, compact paired BIC/bank and INN/KPP rows, and an always-open 132px QR. The persistent amount-demo caption was removed. At 1710px the completed cards measured 645px tall; at 1100px their client/scroll widths both measured 389px. At 700px, the existing 1080px desktop canvas remains scrollable, with no internal card overflow.
- Exercised the updated four-step guide: navigate to the top-up tab (two prompts within step 1), review methods, fill amount, choose format/generate. Confirmed empty generation is disabled, Tab does not fill, Space and click do fill, PDF/XLSX preparation works, Back returns to amount/methods, and switching away pauses/resuming restores the tab. The generation guide highlights both the format choices and button; measured no intersection with its target at 1100px. Reload retained the selected XLSX and prepared state; Escape returned focus to training. Reset retained the independently completed commission flow.
- Current screenshots: `/tmp/winwork-tariff-refined.png` and `/tmp/winwork-topup-refined.png` (local QA evidence, not runtime assets). Direct `file://` execution was not repeated because of the browser tool's URL restriction; current browser checks use the same components through local Vite.
- `pnpm check` passed: documentation, formatting, lint, TypeScript, all 32 auth assertions and all builds. Browser console had no warnings/errors. The rebuilt 670,102-byte onboarding HTML contains both exact ruble-font payloads, omits the old demo caption and retains `connect-src 'none'`. No commit, push or deployment was performed.

## 2026-09-27 — shared top-up bank selection

- Moved all three bank choices above the top-up cards and matched the PDF/Excel radio-choice styling. Bank selection now updates the QR, visible/copyable requisites, requisites PDF and generated PDF/XLSX together. QR is a separate card above the invoice on the left; requisites remain on the right. Renamed both action headings, removed the visible QR demo caption and repeat-download action, retained the prepared-file status.
- Chrome inspection confirmed all three card headings are 22px; QR instructions and the format legend are 16px. At 1100 × 850 both columns measured 389px with equal 687px heights and no internal horizontal overflow. The generation tip did not intersect its highlighted controls. The viewport override was reset. Default-view evidence: `/tmp/winwork-global-bank-final.png`.
- Verified all three bank options, distinct QR sources and account values, native radio arrow-key selection, four-step guidance, empty-amount guard, Space entry, PDF/XLSX preparation, Back, tab pause/resume, bank/format/amount retention after reload and reset back to Т-банк. Switching bank clears preparation while retaining amount and format. Copying the ТКБ account returned the matching synthetic value to the clipboard. A clean reload and subsequent interaction produced no new console warnings/errors; intermediate HMR errors during the schema change were resolved by reload.
- Regenerated the three synthetic invoice/QR/requisites bundles from `bankRequisites.ts`. All six PDFs are one page and their extracted values match the UI fixtures; all three spreadsheets match and store 25000 as a number. Visually inspected the longest-bank-name invoice and requisites PDF with Poppler: no clipping or overlapping text. QR payloads remain bank-specific non-payment markers.
- State assertions passed for v1/v2 migration, each bank's schema-v3 persistence, completed resume and malformed storage. `pnpm check` passed, including documentation, format, lint, TypeScript, 32 auth assertions and every build. The rebuilt 944,132-byte offline HTML embeds all nine downloadable files, omits the removed labels and keeps `connect-src 'none'`. Direct `file://` execution was not repeated because of the browser tool restriction. No commit, push or deployment.

### Shared bank card and notice placement — 2026-09-27

- Wrapped the shared bank choices in the same white card primitive as the other top-up cards (24px padding, 8px radius), expanded the choices across the available width, and placed the company-account notice directly under the requisites heading. Removed the instructional invoice notice.
- Chrome measured the bank card and two-column area at the same 1190px width. At 1100px viewport they both measured 802px, without internal overflow; the relocated notice's client/scroll widths both measured 341px. Changing the bank still updated the visible account and QR. The viewport was restored. Evidence: `/tmp/winwork-bank-card-final.png`.

## 2026-09-28 — единый офлайн-файл для продаж

- `pnpm build:sales:offline` создаёт `dist/offline/Открыть продажи WinWork.html` (54 641 898 байт). Используются общая главная, три sales-конфига, существующие React flow и стандартные controls; парольный шлюз в файле отсутствует.
- Chromium / Playwright, `file://`, viewport 1440 × 1000, сеть отключена: открыты все 37 слайдов (17 Enterprise, 12 Small, 8 API); проверены slide images, CSS backgrounds, fonts, hotspots, scene picker, прямые valid/invalid ссылки, сохранение постороннего query, Back/Forward, reload, стрелки, reset и возврат на главную.
- Все 10 quick-access flow открыты, сброшены и повторно открыты. Пройдены регистрация юрлица, 11 экранов регистрации исполнителя, отклик и Back, создание объекта с руководителем/доверенностью/SMS, оплата в приложении управляющего, сохранение вида деятельности, редактор шаблона, создание задания, принятие/отказ исполнителю и SMS-оплата выполненного задания. Escape, восстановление фокуса и изоляция клавиатурной навигации презентации проверены.
- Пройдены четыре onboarding-сценария в `#/onboarding#<flow>`, возврат в каталог и на главную. В пополнении скачаны встроенные PDF и XLSX для каждого из трёх банков. Навигация web `/onboarding#tariff` и отдельного onboarding HTML сохранена.
- Сравнение с исходными web exports при одинаковом viewport и одинаковом Inter: `ent-01`, `ent-05`, `ent-10`, `ent-12`, `ent-16`, `ent-17`, `smb-10`, `api-01` — 373 Pencil-узла, ноль различий по геометрии и проверенным стилям (типографика, цвета, отступы, gap, скругления). Включены все четыре экспорта с бывшим Tailwind CDN; utility CSS теперь собирается локально. Изображения не пересоздавались.
- Дополнительно проверены узкое окно 430 × 800 и отсутствие Fullscreen API. Общие embedding helpers проверены на Court: шесть слайдов, hotspots, изображения, reset, восстановление фокуса и manifest без sales exports.
- Во всех офлайн-проверках: ноль HTTP-запросов и ошибок приложения/консоли. `pnpm check` прошёл, включая 32 auth-assertions и все сборки. Скрипты, screenshots и результаты текущего прогона: `/tmp/winwork-sales-offline-qa/` (временное QA-доказательство, не runtime-зависимость).

## 2026-10-07 — компактная плашка обучения

- По запросу пользователя общая плашка перед колокольчиком приведена к соседним селекторам: белый фон, высота 32px, скругление 8px и та же тень. Значок вопроса уменьшен до 18px; «Обучение» (600) и «N из 4» (400) размещены в одну строку шрифтом 15px. Видимое «Пройдено» убрано.
- Chromium / Playwright, 1710 × 930 и 390 × 844: проверены web `/onboarding`, отдельный onboarding HTML и onboarding внутри sales HTML. Во всех четырёх сценариях на главной и целевой странице размеры и стили плашки совпали с соседними селекторами; название и счётчик имеют одинаковую вертикальную позицию. На узком окне сохранён прокручиваемый desktop canvas.
- Проверены открытие списка четырёх сценариев, фокус на закрытии, Tab/Shift+Tab внутри списка, Escape, восстановление фокуса, повторное открытие через Enter и закрытие кнопкой. Реальное локальное заполнение и сохранение публичного профиля изменило счётчик 0 → 1; сброс вернул 0. Сценарии и их прогресс не изменялись в коде.
- Оба пересобранных HTML открыты через `file://` с отключённой сетью: ноль HTTP-запросов, ошибок приложения и предупреждений/ошибок консоли. Скриншоты: `/tmp/winwork-training-header.png`, `/tmp/winwork-training-offline-desktop.png`, `/tmp/winwork-training-offline-narrow.png`; временный проверочный скрипт — `/tmp/winwork-training-qa.mjs`.
- Форматирование, lint, TypeScript, все 32 auth-assertions и `pnpm build` прошли. Общий `pnpm check` остановился на шести ранее отсутствующих PNG-целях в `For Printing/without_logos/README.md`; эта папка не затрагивалась. Коммит, пуш и деплой не выполнялись.

## 2026-10-08 — колокольчик перед карточками шапки

- Кнопка «Уведомления» перенесена в начало общей `.wo-account`: перед «Обучением», проектом и компанией. Порядок DOM и Tab совпадает с визуальным; стили карточек сохранены. Текущая документация обновлена.
- Chromium / Playwright, `file://`, сеть отключена, 1710 × 930 и 390 × 844: в отдельных onboarding и sales HTML проверены все четыре сценария на главной и целевой странице. Колокольчик первый, его правая граница находится левее всех карточек; клик показывает «Новых уведомлений нет», следующий Tab фокусирует «Обучение». Открытие/повторное открытие помощи, её focus trap, Escape и восстановление фокуса работают; счётчик проходит 0 → 1 → 0 после локального сохранения профиля и сброса.
- Ноль HTTP-запросов, ошибок приложения и предупреждений/ошибок консоли. Скриншоты: `/tmp/winwork-header-bell-first.png`, `/tmp/winwork-header-bell-desktop.png`, `/tmp/winwork-header-bell-narrow.png`; временный скрипт — `/tmp/winwork-bell-position-qa.mjs`.
- Форматирование, lint, 32 auth-assertions и полная сборка с TypeScript прошли; оба офлайн-файла пересобраны. `pnpm check` по-прежнему останавливается на шести отсутствующих PNG-целях в `For Printing/without_logos/README.md`. Коммит, пуш и деплой не выполнялись.

## 2026-11-09 — автономная «Подрядная схема»

- Сопоставлены таблицы заказчика и подрядчика и панель подписания с [актуальными фреймами Figma](https://www.figma.com/design/WwZNRrCGSRZK1OwtXHI7WQ?node-id=1-7753) при размере продуктового экрана 1610 × 1136. Сверены колонки, вложенное меню, правая панель и фон. Шаг 13 использует обновлённый фрейм `1:7771`: подрядчик видит две подписи других сторон и подписывает акты. Кнопки оплаты появляются только на стороне заказчика на шаге 14.
- В Google Chrome, `file://`, с отключённой сетью пройдены 37 состояний и 17 этапов. Проверены встроенные изображения, история, прямые ссылки, сброс, полноэкранный режим и одновременная смена роли и экрана. HTTP-запросов и ошибок консоли не было.
- При 390 × 820 проверены прокрутка формы создания, видимость кнопки оплаты, правое выравнивание панели, отдельное положение мобильной кнопки и индикатора, доступность навигации. Снимки: `/private/tmp/winwork-contracting-qa-01a1bc82/`.
- Быстрые проверки, сборки и все 12 тестов Playwright прошли. Отдельно пройдены существующие демо оплаты (автозаполнение, неверный и верный коды) и отклика (открытие, отправка, возврат) в автономном sales-файле.

### Карточки ролей и подсказки действий — 2026-11-09

- В Google Chrome на 1440 × 900 и 390 × 820 проверены встроенный логотип WinWork, соседние кнопки «Назад» и «Далее», цветные карточки без рамок и увеличенное описание. Снимки с экранами отклика, создания, подписания и таблицы: `/private/tmp/winwork-contracting-cues-01a1bc82/`.
- В автономном файле с отключённой сетью пройдены все 37 состояний. На 21 экране подсвечивается одна нужная кнопка, вкладка или строка; в остальных состояниях подсказки нет. При уменьшенном движении обводка остаётся видимой без анимации. В узком окне форма создания прокручивается отдельно от закреплённой кнопки. Ноль HTTP-запросов и ошибок консоли.

### Обновлённое завершение задания — 2026-11-09

- Сверены [новые шаги 10–15 в Figma](https://www.figma.com/design/WwZNRrCGSRZK1OwtXHI7WQ?node-id=13-5631). Исполнитель подтверждает выполнение первым; заказчик ждёт подпись подрядчика, затем принимает работу и подтверждает оплату по СМС. После оплаты заказчику показан один подписанный документ, подрядчику — три.
- В Google Chrome через `file://` пройдены все 35 состояний и 15 этапов: ноль HTTP-запросов и ошибок консоли. На 1440 × 900 обе карточки документов подрядчика видны над кнопкой подписания. На 390 × 820 кнопки подтверждения и оплаты остаются видимыми. При смене роли цвет сохраняется только на активной карточке. Снимки: `/private/tmp/winwork-contracting-flow-v2-01a1bc82/`.
- Прошли 13 браузерных тестов; после поправки отступов повторно прошли три теста подрядной схемы. Отдельно пройдена стандартная оплата с СМС в автономном sales-файле.

### Тексты и данные таблиц — 2026-11-09

- В Chrome с отключённой сетью проверены видимый текст и подписи элементов на всех 35 экранах. Убраны пометки «демо», согласованы имена и компании между таблицами, карточками и приложением исполнителя. Вымышленные реквизиты не проходят проверку контрольной цифры, телефоны скрыты частично.
- На 1440 × 900 проверены таблицы и карточки с новыми именами, на 390 × 820 — экран отклика, подтверждение выполнения и панель откликов. HTTP-запросов и ошибок не было. Сборка и все 13 браузерных тестов прошли.

### Вводные слайды — 2026-11-09

- Фреймы `aSI4z`, `PYie0`, `U2e3V`, `Y9Q12` и `lc1hA` из `pencil/outsource_shchema.pen` экспортированы как HTML/CSS. В Google Chrome при 1920 × 1080 сверены композиция, заголовки и подписи пяти слайдов с PNG из Pencil. Inter загрузился из файла, холст каждого слайда поместился целиком. Сравнение сохранено в `/private/tmp/winwork-contracting-slides.V8wajZ/pencil-vs-chrome.png`.
- При 430 × 800 и 1440 × 1000 границы области клика «Показать в WinWork» совпали с видимой кнопкой с точностью до 0,5 px. Проверены переход кнопкой и стрелкой, возврат на пятый слайд, сохранение параметров хеша, сброс на обложку и полноэкранный режим, включая отсутствие Fullscreen API.
- Отдельная копия HTML открылась через `file://` с отключённой сетью. Пройдены пять слайдов и все 35 состояний прототипа, сверены подсветка трёх ролей и оба варианта таблицы. Зафиксировано ноль HTTP-запросов и ошибок консоли. Все 14 браузерных тестов прошли.

### Постоянная панель навигации — 2026-11-09

- В Google Chrome при 1920 × 1080, 1440 × 1000, 390 × 820 и 320 × 568 одна панель видна без наведения. Положение, размеры и фон совпали на пятом слайде и первом экране прототипа. Кнопки и список поместились в панели, которая расположена ниже области слайда или прототипа.
- При переходе через Enter фокус остался на кнопке «Следующая сцена». В автономном HTML с отключённой сетью проверены переход в обе стороны, выбор этапов, все 35 состояний, полноэкранный режим и сброс. HTTP-запросов и ошибок браузера не было. Все 14 браузерных тестов прошли.

### Карточка текущего шага — 2026-11-09

- В Google Chrome при 1440 × 1000, 390 × 820 и 320 × 568 сверены первый этап и экран «Предложение отправлено». Шапка начинается с плашек ролей. Серые плашки темнее фона. Белая карточка вмещает заголовок и описание, номер этапа виден справа, экран прототипа и панель управления расположены ниже.
- В автономном HTML с отключённой сетью проверены карточки всех 35 состояний и номера 15 этапов. HTTP-запросов и ошибок браузера не было. Все 14 браузерных тестов прошли.

### Версии для отдельных ролей и прототип без слайдов — 2026-11-10

- В Google Chrome через `file://` с отключённой сетью пройдены 35 экранов прототипа без слайдов, 16 экранов заказчика и 10 экранов подрядчика. У прототипа совпадают порядок, роли и подписи всех экранов с полной версией. Прямые ссылки на исключённые сцены возвращают к началу соответствующего файла.
- В обеих ролевых версиях проверены пять слайдов. На 1920 × 1080 и 390 × 820 область клика «Показать в WinWork» совпала с кнопкой на слайде, а переход, выбор этапа, история и сброс сработали. Экраны оплаты заказчика, подписания подрядчика и выплаты исполнителю при 1920 × 1080 совпали с исходными областями продукта по пикселям.
- Подписанные документы доступны в соответствующих кабинетах. При проверке не было HTTP-запросов и ошибок браузера. Снимки и проверочный скрипт сохранены в `/private/tmp/winwork-contracting-editions.pj4o0n/`.

### Приложение исполнителя в ролевых версиях — 2026-11-10

- В Google Chrome без сети пройдены 25 экранов версии для заказчика и 19 экранов версии для подрядчика. В каждой версии проверены все девять экранов приложения исполнителя, этапы в панели и переключение подсветки ролей. Графика приложения загрузилась, прямые ссылки на кабинет другой стороны вернули к обложке.
- При 1920 × 1080 экран отклика исполнителя совпал с исходным по пикселям. При 390 × 820 сверены плашки двух ролей, мобильный экран и кнопка отклика. На пятом слайде обе роли помечены «В демо». Проверена подпись о публикации задания заказчиком и появлении строки в разделе подрядчика «Задания клиентов». Снимки сохранены в `/private/tmp/winwork-contracting-performer-editions.dUt07i/`.

### Краткая версия подрядной схемы для заказчика

- В Google Chrome через `file://` при 1600 × 950 проверены девять оригинальных PNG из [упрощённой страницы Figma](https://www.figma.com/design/WwZNRrCGSRZK1OwtXHI7WQ?node-id=33-2185). Байты каждого встроенного изображения совпали с экспортом: выбор подрядчика, подписанный договор, лимиты, создание задания в веб-кабинете и приложении, оплата в двух интерфейсах и акт от подрядчика. Длинные экраны показаны крупными фрагментами без изменения изображений; у мобильной оплаты отдельно видны данные задания и кнопка из нижней части того же экрана.
- Первые четыре слайда совпали с исходной версией. Пятый заменён на статический обзор «Подрядная схема в трёх шагах» без кнопки запуска прототипа. Проверены все шесть обновлённых слайдов, отсутствие обрезанного содержимого, встроенный Inter и все изображения. На 390 × 820 слайд создания задания помещается целиком.
- Сеть была отключена; HTTP-запросов и ошибок браузера не было. Снимки и проверочный скрипт сохранены в `/private/tmp/winwork-figma-originals-review.z0kqfq/`. Исходный HTML для заказчика сохранён без изменений.

### Краткая версия из обновлённого Pencil — 2026-11-12

- Сопоставлены десять указанных фреймов из `pencil/outsource_shchema.pen` и кадры HTML в Google Chrome при 1920 × 1080. Сверены композиция, текст, кадрирование скриншотов и иллюстрация на итоговом слайде. На 390 × 820 проверены масштаб слайда создания задания и панель навигации. Снимки: `/private/tmp/winwork-brief-pencil.gQGe76/`.
- В режиме `file://` без сети пройдены все десять слайдов. Проверены стрелки и кнопки панели, список сцен, история, прямые ссылки, сброс и полноэкранный режим. Ссылка `ctr-brief-limits` открывает девятый слайд. Inter и десять изображений встроены; HTTP-запросов и ошибок браузера не было. Прошли все 18 браузерных тестов.

### Таблица «Мои исполнители» — 2026-11-16

- В [кадре Figma](https://www.figma.com/design/WwZNRrCGSRZK1OwtXHI7WQ?node-id=81-8108) показана таблица заданий «Маркетплейса». Размеры перенесены в таблицу исполнителей: Roboto 12 px, заголовок 44 px, строка 56 px. Заголовок страницы сохранил Montserrat 32 px. Названия столбцов сверены с разделом «Мои исполнители» в dev-версии WinWork.
- В Google Chrome при 1710 × 950 проверены перетаскивание заголовков и строк меню «Столбцы», изменение ширины указателем и клавиатурой, возврат исходной ширины двойным щелчком, фильтры по значению и диапазону дат, сортировка по нескольким полям, показ и скрытие столбцов, поиск, пагинация, карточка исполнителя и возврат фокуса по Escape. На 390 × 820 проверены горизонтальная прокрутка, закреплённые шапка и ФИО и размещение меню.
- Автономный HTML проверен в изолированном Google Chrome с отключённой сетью. Тест подставлял HTML как тело документа и блокировал все остальные HTTP-запросы. Шрифты и изображения загрузились из файла сборки, ошибок и дополнительных запросов не было. Сохранение настроек проверено перезагрузкой документа.
- Повторный UX-аудит в Chrome: сопоставлены меню столбца и видимости свойств в открытой таблице Notion. В WinWork выровнены панель и меню (Roboto 14/20 px), ИНН (12/16 px), кнопки и поиск (36 px). Сохранены шапка 44 px, строки 56 px и заголовок Montserrat 32/36 px. Уменьшены отступы над таблицей: при 1710 × 930 все десять строк страницы видны целиком. Ширина столбцов по умолчанию растёт вместе с текстом; проверены все 30 строк при девяти сочетаниях 12/13/14 px и 44/56/64 px без обрезанных подписей.
- Повторно пройдены фильтры с возвратом и пустым поиском столбцов, сортировка дат и её сброс, перемещение столбцов стрелками, Tab/Shift+Tab и Escape. При 1366 × 768, 1024 × 768 и 390 × 820 меню остаются внутри экрана, заголовок длинного меню закреплён. Готовый HTML открыт через локальный preview в пользовательском Chrome; отдельно проверен без сети с подстановкой документа, без дополнительных HTTP-запросов и ошибок. `pnpm check` прошёл, включая 18 браузерных тестов проекта. Снимки: `/Users/ralphquite/.codex/visualizations/2026/11/16/01a1e444-9c91-7581-ad95-87bed1f96e42/winwork-performers-polished.png` и `winwork-performers-polished-columns.png` в той же папке.

### Отчёты по подрядной схеме

- Сверены кабинет подрядчика из [Figma](https://www.figma.com/design/WwZNRrCGSRZK1OwtXHI7WQ?node-id=81-8658), [пример таблицы из Figma](https://www.figma.com/design/WwZNRrCGSRZK1OwtXHI7WQ?node-id=77-6236) и открытый в Chrome раздел отчётов dev-кабинета. В прототипе сохранены меню, шрифты, вкладки, серые поля фильтров и белые таблицы. Название готового отчёта открывает отдельный экран просмотра в том же окне; загрузка XLSX доступна и из списка, и из просмотра.
- В Google Chrome через `file://` без сети проверены список, форма и просмотр при 1610 × 1139 и доступность формы при 390 × 820. Проверены обе роли, период и статусы, пустой результат, возврат, сохранение отчёта после перезагрузки и выгрузка XLSX. В браузере не было HTTP-запросов и необработанных ошибок.

### Повторный UX-проход по отчётам — 2026-11-16

- Повторно сверены таблицы и кабинет из Figma, уведомление о формировании отчёта в узле `77:7346` и раздел отчётов открытого dev-кабинета. Уплотнён экран просмотра; в форме появились изменяемое название, три режима выбора статусов и предварительное количество заданий. Добавлены уведомление с переходом к готовому отчёту, создание похожего отчёта, вход из строки компании, фильтр компании, сброс и сортировка списка.
- В подключённом Google Chrome при 1710 × 930 и 390 × 820 пройдены обе роли, создание из списка компаний, ошибки периода и пустого выбора статусов, предупреждение о пустой выборке, формирование и открытие, поиск и сброс, возврат и история, сохранение после перезагрузки и независимые фильтры ролей. Сортировка сохранилась после возврата из просмотра. По Escape панель закрылась с возвратом фокуса. На узком экране кнопки закреплены, ошибка прокручивается в видимую область, горизонтального переполнения страницы нет.
- XLSX скачан из просмотра: проверены ZIP CRC, XML и соответствие двум выбранным заданиям. Ошибок и предупреждений консоли не было. Снимки до и после: `/private/tmp/winwork-reports-ux-review/`. Этот повторный проход выполнен через разрешённый пользователем локальный сервер `127.0.0.1:5188`; прямой `file://` в этой сессии не перепроверялся из-за ограничения браузерного инструмента.

### Типографика таблиц отчётов — 2026-11-16

- По замечанию пользователя убраны полужирные названия и оформление названий как синих подчёркнутых ссылок. Размеры сверены с таблицей «Маркетплейса» в [Figma, `81:8108`](https://www.figma.com/design/WwZNRrCGSRZK1OwtXHI7WQ?node-id=81-8108), а обычное начертание шапки и нейтральные цвета — с таблицей документов `77:6307`. В таблицах этого прототипа установлен Roboto Regular 12/14 px, основной текст `#252E42`, вторичный `#808080`, белая шапка 44 px, базовая строка 56 px и разделитель `#E9E9E9`. Длинные названия могут увеличивать высоту строки. Изменения применены к обеим ролям, списку компаний и просмотру отчётов.
- В подключённом Chrome при 1710 × 930 проверены фактические computed styles: название, ячейки и шапка имеют вес 400; название без подчёркивания и синего цвета. Проверены обе роли, просмотр, возврат, открытие строки мышью и названия через Enter. Консоль без ошибок и предупреждений. Сборка отчётов и `pnpm check:quick` прошли. Снимок: `/private/tmp/winwork-reports-ux-review/08-table-typography.jpg`. Dev-кабинет в этом проходе был недоступен (`ERR_CONNECTION_CLOSED`), сверка выполнена по Figma.

### Типы и значки «Мои исполнители» — 2026-11-16

- В открытом dev-кабинете WinWork сверены все 11 столбцов, исходный аватар, шесть флагов, оба значка «Мой налог», состояния документов и четыре варианта оплаты. В `src/assets/performers/` сохранены 18 оригинальных SVG из отображаемой страницы; они встроены в автономный HTML. ФИО, ИНН и сочетания значений остаются вымышленными. НПД хранит права на уплату налога, оплата — тип реквизитов, документы — собственные состояния; пустая ячейка отличается от отказа/отсутствия.
- В подключённом Google Chrome при 1710 × 930 проверены вид ячеек, выбор карты и СБП одним фильтром, пересечение с разрешением на уплату НПД, два уровня сортировки, изменение их приоритета, скрытие столбца, перемещение клавиатурой, изменение ширины и сохранение настроек после перезагрузки. Ошибок и предупреждений консоли нет.
- В отдельном тестовом Google Chrome проверены перетаскивание заголовка и строки в меню «Столбцы», изменение ширины мышью, скрытие и сохранение порядка, сброс, фильтры, хронологическая сортировка, пустой поиск и Escape с возвратом фокуса из карточки. Проверка выполнялась на локальном HTTP-адресе собранного HTML; после загрузки сеть отключалась. Прямой `file://` заблокирован политикой браузерного инструмента и в этой задаче не проверен.
- Снимки: `/Users/ralphquite/.codex/visualizations/2026/11/16/01a1e509-4fe4-7c01-9799-744b42a9b692/performers-restored.jpg` и `performers-payment-filter.jpg` в той же папке. При 390 × 820 проверены границы меню НПД, отсутствие горизонтального переполнения страницы и возврат фокуса по Escape; при прокрутке шапка закреплена. Все изображения загрузились из `data:`; после отключения сети не было дополнительных HTTP-запросов и ошибок. Сборки и семь web smoke-тестов проекта прошли. Полный `pnpm check` не заявляется: проверки с `file://` недоступны, а финальная проверка документации попала на параллельное обновление README и новых документов (отсутствовавшие на момент проверки ссылки и форматирование).
