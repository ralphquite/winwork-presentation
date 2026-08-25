# Pencil.dev Prompt — WinWork Presentation Design System

## 1. Task

Create a **reusable presentation design system for WinWork Guided Sales Demo**.

Do **not** create the final sales presentation yet. Build the visual foundations, reusable components, infographic patterns, slide templates, and interactive-presentation UI patterns that will later be used to assemble multiple WinWork sales presentations.

The system must feel like a modern enterprise SaaS / fintech presentation: **clean, precise, trustworthy, informative, spacious, premium, and corporate**.

The final presentations will combine:

- business slides;
- diagrams and infographics;
- metrics and charts;
- screenshots / UI fragments;
- interactive WinWork demo scenes;
- occasional photography;
- occasional minimal 3D illustrations.

The presentation is intended for B2B sales meetings, so clarity and business credibility are more important than decorative effects.

---

# 2. Critical constraints

## Canvas

Every presentation frame must be:

- **1920 × 1080 px**;
- 16:9;
- designed for desktop screens and conference displays;
- legible during a live sales call or screen sharing.

## Background

The default background must be **very light but not pure white**.

Recommended working base:

- `Background / Primary`: `#F7F9FC`
- `Background / Secondary`: `#F1F5F9`
- `Surface / Primary`: `#FFFFFF`

White can be used for cards and panels, but the entire slide should not feel like a blank white PowerPoint page.

## Brand colors

Use the **blue and green from the WinWork logo** as the main brand accents.

If the actual WinWork logo asset is available in the Pencil file, sample the exact colors from the logo and use those sampled values as the final brand tokens.

If exact logo colors are not available, use these only as temporary working values:

- `Brand / Blue`: approximately `#2F7DF6`
- `Brand / Green`: approximately `#55D83A`

Build light and dark tonal variants from these colors for backgrounds, borders, charts, states, and infographic fills.

The design must remain primarily neutral and light. Blue and green are accents, not large areas of uncontrolled saturation.

## Logo

The **WinWork logo must be present on every slide**, including cover slides, section slides, demo-transition slides, and final CTA slides.

Default placement:

- top-right corner;
- fixed position across slide templates;
- full WinWork wordmark on light backgrounds;
- visually present but not dominant;
- maintain generous clear space around it.

Create a reusable `Brand / WinWork Logo` component and place it in all slide masters.

---

# 3. Visual direction

The design language should combine:

- enterprise SaaS clarity;
- fintech precision;
- contemporary product-design aesthetics;
- strong information hierarchy;
- restrained premium feel;
- clean editorial presentation layout;
- modular infographic construction.

The system should feel closer to a high-quality product presentation from a modern technology company than to a traditional corporate PowerPoint template.

## Desired qualities

- clean;
- calm;
- confident;
- structured;
- technology-forward;
- business-oriented;
- trustworthy;
- minimal but not sterile;
- visually rich through information design, not decoration.

## Avoid

Do not reproduce the visual style of the existing WinWork sales decks.

Specifically avoid:

- paint strokes / brush splashes;
- aggressive black + neon-green compositions;
- excessive dark backgrounds;
- cyberpunk aesthetics;
- oversized decorative 3D objects on every slide;
- random glossy 3D icons from unrelated styles;
- heavy gradients;
- glowing neon edges;
- explosion particles;
- excessive shadows;
- dense text blocks;
- old-fashioned corporate infographics;
- decorative arrows with inconsistent geometry;
- stock-style presentation templates;
- arbitrary color diversity.

The old decks are **content references only**. The new system must be visually redesigned from scratch.

---

# 4. Typography

Use a modern sans-serif typeface with excellent Cyrillic support.

Preferred:

- **Inter** as the primary typeface.

If Inter is unavailable, use a visually similar neutral grotesk with full Cyrillic support.

Do not mix multiple display fonts. The hierarchy should be created through size, weight, spacing, and color.

## Suggested type scale for 1920×1080

Create named text styles approximately around these values:

### Display

- `Display / XL`: 88–96 px, 700, tight line height
- `Display / L`: 72–80 px, 700

### Headings

- `Heading / 1`: 60–64 px, 650–700
- `Heading / 2`: 48–52 px, 650
- `Heading / 3`: 36–40 px, 600

### Body

- `Body / L`: 30–32 px, 400–500
- `Body / M`: 25–28 px, 400–500
- `Body / S`: 21–23 px, 400–500

### Supporting

- `Label / L`: 20–22 px, 600
- `Label / M`: 18–20 px, 600
- `Caption`: 16–18 px, 450–500

Use large, short headlines. Avoid paragraphs longer than approximately 4–5 lines on a normal sales slide.

Test all components with **Russian Cyrillic text**, not only Latin placeholders.

Example neutral test headlines:

- «Контролируйте риски на каждом этапе»
- «Три сценария работы»
- «Единый процесс без ручных разрывов»
- «WinWork встраивается в вашу операционную модель»

---

# 5. Color system

Create reusable color variables / styles.

## Neutral foundation

Suggested starting values:

- `Neutral / 950`: `#172033`
- `Neutral / 800`: `#263248`
- `Neutral / 600`: `#5E6A7D`
- `Neutral / 400`: `#94A0B2`
- `Neutral / 250`: `#CCD4DF`
- `Neutral / 150`: `#E2E7EE`
- `Neutral / 100`: `#EDF1F5`
- `Neutral / 050`: `#F7F9FC`
- `White`: `#FFFFFF`

## Brand blue

Build:

- strong blue;
- default blue;
- medium tint;
- light tint;
- very light blue surface.

Use blue for:

- primary visual emphasis;
- main process line;
- selected states;
- API / infrastructure diagrams;
- headings or highlighted fragments;
- key metrics.

## Brand green

Build:

- strong green;
- default green;
- medium tint;
- light tint;
- very light green surface.

Use green for:

- successful outcome;
- validation;
- verified / compliant states;
- positive business result;
- secondary brand emphasis.

## Semantic colors

Create restrained semantic colors only when information meaning requires them:

- warning amber;
- risk red;
- informational cyan if necessary.

These must remain secondary to the WinWork blue/green system and should never turn the presentation into a multicolor dashboard.

---

# 6. Layout system

Build a consistent grid for all slide templates.

Recommended:

- outer horizontal margins: **120 px**;
- outer vertical safe area: **80–96 px**;
- 12-column content grid;
- 24 px gutters;
- base spacing unit: 8 px;
- most spacing values should use multiples of 8.

Create layout guides / styles for:

- full-width content;
- 7/5 split;
- 6/6 split;
- 5/7 split;
- 4-column card row;
- 3-column card row;
- centered hero layout;
- large diagram layout;
- screenshot / UI demo layout.

The slide should always retain visible whitespace. Do not fill all available space simply because it exists.

---

# 7. Shape language

Use consistent geometry.

## Radius

Suggested system:

- small controls: 12 px;
- standard cards: 20–24 px;
- large panels: 28–32 px;
- media / screenshot frames: 24–28 px.

## Borders

Use subtle 1–2 px neutral borders.

Typical card treatment:

- white or very light tinted surface;
- low-contrast border;
- almost no shadow or an extremely soft shadow;
- clear internal padding.

Avoid thick outlines and floating-card overload.

## Shadows

Shadows should be used only to establish depth hierarchy.

Use:

- soft;
- wide;
- low opacity;
- neutral or slightly cool.

Do not create strong black drop shadows.

---

# 8. Core presentation components

Create actual reusable components with variants, not only examples.

## 8.1 Slide shell

Create `Slide / Base` containing:

- 1920×1080 frame;
- standard background;
- grid / safe area;
- WinWork logo;
- optional page / section indicator;
- optional presentation navigation area;
- consistent spacing system.

Variants:

- `Default`
- `Section`
- `Metrics`
- `Diagram`
- `Media`
- `Demo Bridge`
- `CTA`

---

## 8.2 Headline block

Create a reusable headline component with variants:

- eyebrow + headline;
- headline only;
- headline + short supporting text;
- centered;
- left aligned;
- with highlighted word or phrase.

Highlighting may use:

- blue text;
- green text;
- subtle tinted highlight surface.

Do not highlight more than 20–30% of a headline.

---

## 8.3 Content cards

Create:

- standard information card;
- accent card;
- KPI card;
- risk / compliance card;
- quote / proof card;
- integration card;
- feature card;
- compact step card.

Each card should have variants for:

- icon / no icon;
- title only;
- title + description;
- metric;
- selected / highlighted;
- blue tint;
- green tint;
- neutral.

---

## 8.4 Icon container

Create a consistent icon system for business slides.

Preferred visual treatment:

- simple line icons;
- geometric;
- 2 px stroke;
- rounded line caps;
- small tinted rounded-square container when needed.

Do not use emoji or inconsistent icon families.

---

# 9. Infographic system

Infographics will be a major part of the WinWork presentation system.

Create a dedicated reusable infographic kit.

The infographic style must be:

- modular;
- minimal;
- clearly directional;
- easy to read from distance;
- based on the same card, typography, icon, and color system.

## Required infographic patterns

### A. Horizontal process flow

For 3–7 steps.

Examples of future use:

`Исполнитель → Проверка → Документы → Выполнение → Выплата → Чек`

Create variants:

- compact;
- card-based;
- connected nodes;
- numbered steps.

### B. Circular lifecycle

For end-to-end operational cycles.

Use 4–6 nodes around a center object or center message.

Keep connectors precise and minimal.

### C. Three-path scenario selector

Create a strong visual pattern for three alternative scenarios:

1. work through WinWork assignments;
2. API / Embedded;
3. marketplace / search for performers.

This should work as both an explanatory infographic and an interactive navigation pattern later.

### D. Risk-control diagram

Create a modular pattern showing:

- process stage;
- automated check;
- decision / status;
- protected outcome.

Use blue for process and green for verified / safe outcome.

### E. Before / after comparison

For contrasting:

- manual process vs WinWork;
- fragmented tools vs one controlled flow;
- current workflow vs integrated workflow.

Avoid simplistic red-vs-green clichés. Use neutral gray for the old state and blue/green for the target state.

### F. Architecture / API diagram

Create a clean enterprise architecture language for:

- client system;
- API layer;
- WinWork infrastructure;
- external services;
- data / document / payment flows.

Use straight or softly curved connectors with clear labels.

No pseudo-code aesthetics and no decorative network spaghetti.

### G. Role / responsibility map

Pattern for:

- business roles;
- permissions;
- responsibilities;
- operational hierarchy.

### H. Timeline / maturity flow

Pattern for 3–6 sequential stages.

### I. KPI / evidence block

Pattern for 2–5 metrics with one primary metric emphasized.

---

# 10. Charts and data visualization

Create reusable chart styles suitable for sales presentations.

Required:

- bar chart;
- horizontal bar chart;
- line chart;
- area chart;
- donut / ring chart;
- progress / completion chart;
- simple comparison chart.

## Chart rules

- use blue as the default primary series;
- green may highlight success / target / positive outcome;
- all secondary data should be neutral gray unless meaning requires otherwise;
- use direct labels whenever possible instead of legends;
- use subtle grid lines;
- avoid chart borders;
- avoid 3D charts;
- avoid gradients inside data series unless very subtle;
- do not use more than 3–4 active colors in a chart;
- headline insight should be visually more prominent than chart mechanics.

Create compact chart cards and full-slide chart layouts.

---

# 11. Photography direction

Photography is allowed but should be used selectively.

Preferred photography:

- real modern workplaces;
- logistics / retail / operations environments when relevant;
- business people in authentic working situations;
- natural light;
- clean contemporary color grading;
- neutral clothing and environments;
- believable Russian / CIS enterprise context where appropriate.

Avoid:

- generic smiling stock-photo business people;
- exaggerated poses;
- artificial AI faces as hero elements;
- heavily saturated photography;
- photos with embedded text.

Create reusable media-frame components with:

- rounded corners;
- optional subtle border;
- optional caption;
- optional blue / green contextual tag.

---

# 12. 3D illustration art direction

3D is allowed as a **secondary visual language**, not the main structure of every slide.

The existing WinWork decks use 3D objects, but the new system must make them significantly more minimal, refined, and premium.

## Desired 3D language

Use simple semantic objects or small object groups.

Possible materials:

- polished chrome;
- brushed or satin metal;
- matte aluminum;
- frosted glass;
- translucent pale-blue glass;
- slightly blue-tinted clear glass;
- matte white polymer / ceramic;
- subtle blue and green brand inserts.

## Lighting

- soft studio lighting;
- diffused reflections;
- clean shadows;
- bright neutral environment;
- no hard neon glow;
- no dramatic dark cinematic lighting.

## Composition

- one main object or a small coherent group;
- plenty of negative space;
- object should normally occupy no more than ~35–40% of the slide;
- use 3D to explain a concept, not merely decorate empty space.

## Suitable semantic objects

Examples:

- shield / protection;
- document / contract;
- connected nodes / API;
- modular blocks / platform flexibility;
- verification mark;
- pipeline / process;
- controlled gate / filter;
- wallet / payout abstraction;
- clock / speed;
- layered glass panels / integrated services.

These should be abstracted and elegant, not literal clip-art.

## Avoid in 3D

- huge shield occupying half a slide;
- gaming aesthetics;
- black carbon surfaces;
- fluorescent neon green;
- exploding particles;
- dramatic paint splashes;
- fake UI on 3D smartphones unless explicitly required;
- multiple unrelated 3D objects on one slide;
- excessively glossy plastic.

Create an `Art Direction / 3D` reference board inside the design system with 6–8 example material / object treatments.

---

# 13. UI screenshot and product-demo patterns

The future presentation will contain real or recreated WinWork interface screens.

Create a presentation treatment for product UI that does **not** distort the original interface.

Required patterns:

## A. Product frame

- clean browser / app frame;
- subtle border;
- soft shadow;
- optional 3D perspective only in purely illustrative slides;
- default demo / walkthrough view must remain flat and readable.

## B. UI callout

- number / label;
- thin connector;
- short explanation;
- blue or green accent;
- no oversized speech bubbles.

## C. Spotlight state

For guided demo scenes:

- dim non-relevant area slightly;
- keep active target fully visible;
- compact hint / tooltip;
- clear next action.

## D. Demo bridge

Create a slide pattern that transitions from business story into the interactive WinWork demo.

Example structure:

- short business headline;
- one-sentence setup;
- cropped WinWork UI preview;
- clear action such as «Показать в продукте»;
- arrow / visual continuation into the next demo scene.

This pattern should visually connect business slides and product UI into one presentation system.

---

# 14. Interactive presentation controls

The final deliverable is a web-based guided sales demo, not a static PDF only.

Create a small presentation-runtime UI kit that feels native to the same design system.

Required components:

- previous / next navigation;
- compact progress indicator;
- section indicator;
- optional slide overview / chapter navigation;
- “back to presentation” control from demo scene;
- “reset demo” control;
- optional contextual branch button;
- optional demo hint tooltip.

These controls should be subtle and not compete with slide content.

Avoid large PowerPoint-style arrow buttons.

---

# 15. Slide templates to create

Create reusable slide templates / masters for at least the following categories.

## 1. Cover

- large concise headline;
- short descriptor;
- optional 3D object or product visual;
- WinWork logo;
- clean light background.

## 2. Section divider

- section number / eyebrow;
- strong headline;
- minimal visual;
- large whitespace.

## 3. Headline + two-column content

For explanation + diagram / image / UI.

## 4. Headline + large infographic

For process, lifecycle, risk system, scenario map.

## 5. Three-option / scenario slide

Three equal but clearly differentiated paths.

## 6. Process flow

3–7 steps.

## 7. Comparison

Before / after or option A / B.

## 8. KPI / metrics

2–5 metric cards with one hero metric.

## 9. Chart slide

Headline insight + one main chart + short explanatory note.

## 10. Architecture / API

Client system → WinWork layer → services / results.

## 11. Trust / proof

Logos, certification / partnership references, proof points, but visually restrained.

## 12. UI showcase

Large WinWork screenshot + 2–4 callouts.

## 13. Demo bridge

Business explanation → interactive demo.

## 14. Full demo shell

Presentation chrome around a recreated WinWork interface.

## 15. Photo / media slide

One strong image + business statement.

## 16. CTA / final slide

Clear next action, contact / demo request area, minimal closing message.

---

# 16. Component naming

Use a systematic naming structure.

Examples:

- `Foundation / Color / Brand / Blue`
- `Foundation / Type / Heading / H1`
- `Presentation / Slide / Base`
- `Presentation / Header / Logo`
- `Presentation / Card / Info`
- `Presentation / Card / Metric`
- `Presentation / Infographic / Process Node`
- `Presentation / Infographic / Connector`
- `Presentation / Diagram / API Node`
- `Presentation / Chart / Bar`
- `Presentation / Demo / Spotlight`
- `Presentation / Demo / Tooltip`
- `Presentation / Navigation / Next`

Use components, variants, styles, and auto-layout wherever Pencil supports them.

Do not build the system as a collection of unrelated manually drawn slides.

---

# 17. Recommended file organization

Organize the Pencil file into clear sections / pages:

## `00 — Foundations`

- colors;
- typography;
- spacing;
- radii;
- shadows;
- grid;
- logo rules;
- icon rules.

## `01 — Core Components`

- headline blocks;
- cards;
- labels;
- buttons;
- media frames;
- UI callouts;
- navigation.

## `02 — Infographics`

- process;
- lifecycle;
- scenario selector;
- risk-control pattern;
- API architecture;
- role map;
- comparison;
- timeline.

## `03 — Data Visualization`

- chart components;
- KPI layouts;
- metric cards.

## `04 — Slide Templates`

All slide masters listed above.

## `05 — Demo Patterns`

- UI presentation frame;
- spotlight;
- tooltip;
- demo bridge;
- reset / return controls.

## `06 — 3D & Media Art Direction`

- 3D material references;
- example compositions;
- photography direction;
- media-frame examples.

## `07 — System Validation Examples`

Create 6–8 example slides using placeholder business content to validate the system.

These examples are **not the final WinWork presentation**.

---

# 18. Validation examples

Create several example slides to prove that the system works in real layouts.

Use short, generic Russian placeholder content only.

Suggested examples:

1. **Cover:** «Безопасная работа с внештатными исполнителями»
2. **Three scenarios:** «Выберите подходящий сценарий работы»
3. **Process:** «От задания до закрывающих документов — в одном процессе»
4. **Risk infographic:** «Контроль рисков на каждом этапе»
5. **API architecture:** «WinWork встраивается в существующий контур»
6. **Metrics:** generic placeholder values, clearly marked as demo data
7. **UI showcase:** use a neutral placeholder product frame if real WinWork UI is not available
8. **Demo bridge:** «Покажем, как этот сценарий выглядит в продукте»

Do not invent factual WinWork claims, metrics, regulations, client names, legal statements, or product behavior.

---

# 19. Visual hierarchy rules

Each slide should have one obvious primary message.

Preferred hierarchy:

1. headline / business takeaway;
2. main visual or infographic;
3. supporting explanation;
4. proof / annotation / secondary detail.

Avoid giving equal visual weight to everything.

Use bold type and brand color only to direct attention to the most important part of the message.

---

# 20. Density rules

This is a live sales presentation, not a document.

Default limits:

- one major idea per slide;
- one main infographic or visual per slide;
- 3–5 cards maximum in a normal content row;
- 6–7 process steps maximum;
- 2–5 metrics maximum;
- 2–4 callouts around a UI screenshot;
- body copy should normally be short enough to scan in a few seconds.

When content is complex, split it across slides rather than shrinking type or filling every corner.

---

# 21. Motion direction for future web implementation

The design system should visually support subtle motion.

Use future motion assumptions such as:

- fade + small vertical movement;
- progressive infographic reveal;
- connector draw-in;
- card emphasis;
- subtle scale-in for 3D / media;
- smooth transition from slide to demo scene.

Motion should feel professional and deterministic.

Avoid:

- bouncing;
- elastic overshoot;
- flashy parallax;
- constant looping animation;
- unnecessary object motion.

Design static states so they can later be animated cleanly in the web implementation.

---

# 22. Accessibility and readability

Ensure:

- strong contrast for all important text;
- minimum body sizes appropriate for 1920×1080 screen sharing;
- brand green is not used for small low-contrast text on light backgrounds;
- charts remain understandable without relying on color alone;
- interactive controls have clear active / hover / disabled states;
- text remains readable when a slide is viewed at reduced scale.

---

# 23. Final quality bar

The design system should look like it was created for a modern B2B fintech / enterprise SaaS company in 2026.

It should be:

- significantly cleaner than the existing WinWork presentations;
- visually coherent across business slides and product demos;
- strong enough for executive meetings;
- modular enough to generate many different slides without visual drift;
- infographic-first rather than text-first;
- capable of showing complex operational and compliance concepts simply;
- recognizably WinWork through the logo, blue/green brand accents, and consistent visual language;
- restrained enough that real WinWork UI remains visually credible when embedded into the presentation.

The result should be a **real reusable presentation design system**, not a moodboard and not one finished presentation.
