# WinWork Guided Sales Demo

Детерминированный frontend для управляемых презентаций WinWork. Это автономный демонстрационный сервис без продуктового backend, аккаунтов, production API и пользовательских данных. На Vercel sales-раздел закрыт одним общим паролем отдела продаж, а отдельная презентация `/court` доступна без пароля.

## Текущее состояние

- `/enterprise` — готовый маршрут из 17 экспортированных Pencil-слайдов.
- На сценах `ent-04`, `ent-05`, `ent-07`, `ent-08` и `ent-09` доступны пять интерактивных React demo-flow: создание объекта, работа управляющего, создание вида деятельности, шаблоны документов и одиночное задание.
- `/small` — готовый маршрут из 12 экспортированных Pencil-слайдов; сцена `smb-06` переиспользует demo-flow одиночного задания.
- `/api` — готовый маршрут из 16 экспортированных Pencil-слайдов без интерактивных demo-flow.
- `/court` — открытый маршрут из пяти code-authored слайдов для демонстрации доступности сервиса заказчикам и исполнителям; на `court-02` отдельные CTA открывают React-flow регистрации юридического лица и создания одиночного задания, на `court-03` — screenshot-flow регистрации исполнителя, на `court-04` — выбор исполнителя, а на `court-05` — подтверждение оплаты.
- `/` — экран выбора маршрута и быстрый доступ к standalone flow, включая выбор исполнителя по трём откликам и временный screenshot-flow регистрации исполнителя из 17 экранов.
- `middleware.ts` и `api/auth/login.ts` — Vercel access gateway: парольный экран, проверка credential, подписанная 30-дневная cookie и защита sales-маршрутов/assets. Публичный court-раздел имеет узкий allowlist и отдельный bundle.

Текущая сцена хранится в `?scene=<id>`, например `/enterprise?scene=ent-04`. Прямые ссылки, browser Back/Forward, выбор сцены, стрелки клавиатуры, reset и fullscreen используют один общий движок.

## Быстрый старт

Требуются Node.js 24 и pnpm 11.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Vite выведет локальный URL без парольного шлюза. Для проверки production build без Vercel Middleware используйте:

```bash
pnpm build
pnpm preview
```

## Парольный доступ на Vercel

Шлюз требует две server-only переменные:

- `WINWORK_ACCESS_PASSWORD` — общий пароль отдела продаж, минимум 12 символов;
- `WINWORK_SESSION_SECRET` — случайный секрет подписи, минимум 32 символа. Его не нужно передавать сотрудникам.

Реальные значения нельзя коммитить или называть с префиксом `VITE_`. Укажите их в Vercel Project → Settings → Environment Variables для Production и Preview. Секрет подписи можно сгенерировать командой:

```bash
openssl rand -base64 32
```

Для локальной проверки скопируйте имена из `.env.example` в игнорируемый `.env.local`, заполните оба значения и запустите Vercel runtime:

```bash
pnpm dlx vercel@latest dev
```

Без переменных Vercel deployment намеренно отвечает `503` на защищённые маршруты; `/court` остаётся доступен. Смена пароля или секрета немедленно делает старые cookies недействительными.

## Проверки

```bash
pnpm check
```

Полный gate проверяет agent-документацию, форматирование, ESLint, TypeScript и production build. Доступны отдельные команды:

```bash
pnpm docs:check
pnpm auth:check
pnpm format:check
pnpm lint
pnpm typecheck
pnpm build
```

## Карта проекта

- `src/app/` — app composition, landing и маршруты.
- `src/presentation/engine/` — URL state, навигация, reset, fullscreen и scene dispatch.
- `src/presentation/config/` — порядок и метаданные сцен для четырёх tracks.
- `src/court/` и `court.html` — отдельная публичная React-точка входа для `/court`.
- `src/presentation/slides/` — масштабирование Pencil HTML и demo hotspots.
- `src/presentation/flows/` — компонентные desktop/mobile demo-flow и общие product primitives.
- `src/demos/` — flow bindings и generic synthetic fixtures.
- `middleware.ts` — Vercel password gateway перед SPA и статическими assets.
- `api/auth/login.ts` — Edge Function, принимающая password form и выдающая подписанную cookie.
- `auth/session.ts` — общий server-only контракт cookie, HMAC и env validation.
- `.env.example` — имена обязательных server-only секретов без значений.
- `public/enterprise-slides/` — runtime HTML-экспорты Enterprise и их локальные зависимости.
- `public/api-slides/` — runtime HTML-экспорты API / Embedded и их локальные зависимости.
- `public/small-slides/` — runtime HTML-экспорты Small Business и их локальные зависимости.
- `public/court-slides/` — code-authored HTML/CSS-слайды публичной презентации.
- `public/court-assets/` — официальные логотипы ФНС и сервисов сравнения для публичных слайдов.
- `public/performer-registration-flow/` — 17 публичных runtime-скриншотов временного мобильного flow регистрации исполнителя, используемого на `court-03`.
- `public/demo-flows/` — только референсы для visual QA; приложение не рендерит их как интерактивный продукт.
- `pencil/` — редактируемые дизайн-источники и исходные assets.

## Документация для ИИ-агентов

Начальная точка — [`AGENTS.md`](AGENTS.md). Машиночитаемый task router находится в [`docs/agents/context-index.json`](docs/agents/context-index.json); карта владения файлами и playbook’и — в [`docs/agents/`](docs/agents/README.md). Текущая архитектура описана в [`docs/architecture.md`](docs/architecture.md).

Исходный bootstrap-бриф сохранён в `base_documentation/` как исторический контекст и не переопределяет текущий код.

## Vercel

Проект собирает защищённый Vite SPA и изолированный публичный bundle под `dist/court-app/`. Перед cache и SPA routing Vercel запускает корневой `middleware.ts`: `/court` и его явно перечисленные assets проходят без cookie, остальные запросы требуют подписанную HttpOnly cookie либо получают парольный экран. Парольная форма отправляется в `/api/auth/login`, потому что request body обрабатывает Edge Function, а не Routing Middleware. `vercel.json` направляет `/court` в отдельный HTML-entry, а авторизованные прямые запросы `/enterprise`, `/api` и `/small` — в основной `index.html`.
