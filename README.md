# WinWork Guided Sales Demo

Технический bootstrap интерактивного sales-инструмента WinWork. Сейчас в проекте есть только нейтральный presentation runtime и очевидные placeholders — без реального интерфейса WinWork, backend, авторизации и production-данных.

## Маршруты

- `/enterprise` — Enterprise / Operations.
- `/api` — API / Embedded.
- `/small` — Small Business.

Текущая сцена хранится в query-параметре, например `/enterprise?scene=intro`. Поэтому ссылку на сцену можно открыть напрямую, а переходы поддерживают browser Back/Forward.

## Быстрый старт

Требуются Node.js 24 и pnpm 11.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Vite покажет локальный URL. Откройте один из трёх маршрутов выше.

## Проверки

```bash
pnpm check
```

Команда последовательно проверяет форматирование, ESLint, TypeScript и production build. Отдельные команды: `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm build`, `pnpm preview`.

## Где продолжать разработку

- Presentation configs: `src/presentation/config/`.
- Общий runtime: `src/presentation/engine/`.
- Renderers для `slide`, `demo`, `media`: `src/presentation/scenes/`.
- Локальные demo fixtures: `src/demos/fixtures/`.
- Изображения, видео и шрифты: `src/assets/`.

Архитектурные границы и порядок добавления сцен описаны в [`docs/architecture.md`](docs/architecture.md). Production source of truth — Git.

## Vercel

Проект собирается в статический Vite SPA. `vercel.json` перенаправляет прямые запросы к presentation routes на `index.html`, поэтому refresh на `/enterprise`, `/api` и `/small` не должен возвращать 404.
