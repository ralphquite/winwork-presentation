# WinWork Guided Sales Demo

Детерминированный frontend для управляемых sales-презентаций WinWork. Это автономный демонстрационный сервис без backend, реальной авторизации, production API и пользовательских данных.

## Текущее состояние

- `/enterprise` — готовый маршрут из 19 экспортированных Pencil-слайдов.
- На сценах `ent-04`, `ent-05`, `ent-07`, `ent-08` и `ent-09` доступны пять интерактивных React demo-flow: создание объекта, работа управляющего, создание вида деятельности, шаблоны документов и одиночное задание.
- `/small` — готовый маршрут из 14 экспортированных Pencil-слайдов; сцена `smb-06` переиспользует demo-flow одиночного задания.
- `/api` — технический placeholder-маршрут на общем presentation runtime; утверждённый контент для него ещё не перенесён.
- `/` — экран выбора маршрута.

Текущая сцена хранится в `?scene=<id>`, например `/enterprise?scene=ent-04`. Прямые ссылки, browser Back/Forward, выбор сцены, стрелки клавиатуры, reset и fullscreen используют один общий движок.

## Быстрый старт

Требуются Node.js 24 и pnpm 11.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Vite выведет локальный URL. Для production-like проверки используйте:

```bash
pnpm build
pnpm preview
```

## Проверки

```bash
pnpm check
```

Полный gate проверяет agent-документацию, форматирование, ESLint, TypeScript и production build. Доступны отдельные команды:

```bash
pnpm docs:check
pnpm format:check
pnpm lint
pnpm typecheck
pnpm build
```

## Карта проекта

- `src/app/` — app composition, landing и маршруты.
- `src/presentation/engine/` — URL state, навигация, reset, fullscreen и scene dispatch.
- `src/presentation/config/` — порядок и метаданные сцен для трёх tracks.
- `src/presentation/slides/` — масштабирование Pencil HTML и demo hotspots.
- `src/presentation/flows/` — компонентные desktop/mobile demo-flow и общие product primitives.
- `src/demos/` — flow bindings и generic synthetic fixtures.
- `public/enterprise-slides/` — runtime HTML-экспорты Enterprise и их локальные зависимости.
- `public/small-slides/` — runtime HTML-экспорты Small Business и их локальные зависимости.
- `public/demo-flows/` — только референсы для visual QA; приложение не рендерит их как интерактивный продукт.
- `pencil/` — редактируемые дизайн-источники и исходные assets.

## Документация для ИИ-агентов

Начальная точка — [`AGENTS.md`](AGENTS.md). Машиночитаемый task router находится в [`docs/agents/context-index.json`](docs/agents/context-index.json); карта владения файлами и playbook’и — в [`docs/agents/`](docs/agents/README.md). Текущая архитектура описана в [`docs/architecture.md`](docs/architecture.md).

Исходный bootstrap-бриф сохранён в `base_documentation/` как исторический контекст и не переопределяет текущий код.

## Vercel

Проект собирается в статический Vite SPA. `vercel.json` перенаправляет прямые запросы на `index.html`, поэтому refresh на `/enterprise`, `/api`, `/small` и deep links через query-параметр не должен возвращать 404.
