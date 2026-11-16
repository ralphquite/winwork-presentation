# Разработка с Codex

## Окружение

Используйте основной checkout с настоящим каталогом `.git` в корне проекта. Внешние Git worktree и `.git` pointer-файлы запрещены. Новые чаты этого проекта запускайте в режиме Local в той же папке; параллельные задачи не должны одновременно менять одни файлы.

Версии определяются `.node-version` и `package.json`: Node.js 24 и pnpm 11.3.0. Установка сохраняет lockfile:

```bash
pnpm install --frozen-lockfile
pnpm doctor
pnpm dev
```

`doctor` проверяет версии, расположение `.git`, доступность Vite/TypeScript/Playwright и Google Chrome. Приложение открывается по адресу `http://127.0.0.1:5173`. Если порт занят, Vite сообщает об ошибке; скрытого переключения на другой порт нет. Для другого порта передайте `pnpm dev --port 5175`.

Сайты и локальные страницы открывайте только в Google Chrome. На macOS:

```bash
open -a "Google Chrome" http://127.0.0.1:5173
```

Для обычной разработки `.env.local` не нужен. Vite запускает frontend без парольного шлюза. Проверка шлюза выполняется отдельно через Vercel runtime по инструкции в [README](../README.md#парольный-доступ-на-vercel); реальные secrets не входят в команды, Git и клиентский bundle.

## Действия Codex

`.codex/environments/environment.toml` содержит действия установки, запуска, быстрой/полной проверки, Chrome-тестов и упаковки sales HTML. В настройках Local environments выберите конфигурацию WinWork, если приложение не подхватило её автоматически. Действия запускаются в терминале проекта; действие открытия Chrome доступно на macOS. Формат сверён с установленным приложением и [официальной документацией OpenAI](https://developers.openai.com/codex/app/local-environments/).

Автоматический setup оставлен пустым: он предназначен для создания worktree, которые в этом проекте запрещены. В Local установка выполняется отдельным действием. `.codex/config.toml` сохраняет `workspace-write` и `on-request`; личные настройки модели и глобальные разрешения не задаются в репозитории.

## Повседневная работа

1. Прочитать [AGENTS.md](../AGENTS.md), выбрать минимальный task area в [context-index.json](agents/context-index.json) и открыть его `readFirst`.
2. Проверить `git status --short`. Сохранить существующие изменения и ограничить правки текущей задачей.
3. Внести изменение с учётом общих React-компонентов, утверждённых дизайн-источников и синтетических данных.
4. Отформатировать только изменённые файлы: `pnpm exec prettier --write <файлы>`.
5. Во время работы выполнить `pnpm check:quick`; перед завершением кода/настроек — `pnpm check` и проверки соответствующего flow из AGENTS.md.
6. В результате указать изменённое поведение, выполненные проверки и оставшиеся ограничения. Commit, push и deploy требуют отдельного поручения.

VS Code использует локальный TypeScript, Prettier при сохранении и явное исправление ESLint. Рекомендуемые расширения перечислены в `.vscode/extensions.json`; автоматически они не устанавливаются.

## Проверки

| Команда                          | Назначение                                                       |
| -------------------------------- | ---------------------------------------------------------------- |
| `pnpm doctor`                    | Диагностика локальных инструментов без изменения проекта         |
| `pnpm check:quick`               | Документация, форматирование, ESLint, TypeScript и auth contract |
| `pnpm test` / `pnpm test:e2e`    | Браузерные smoke-тесты в Google Chrome                           |
| `pnpm test:e2e:headed`           | Те же тесты с видимым Chrome                                     |
| `pnpm build`                     | Online bundle, public Court и три offline HTML                   |
| `pnpm test:offline`              | Smoke-тесты уже собранных HTML через `file://` без сети          |
| `pnpm build:contracting:offline` | Сборка пяти автономных вариантов подрядной схемы                 |
| `pnpm test:contracting`          | Проверка пяти вариантов через `file://` без сети                 |
| `pnpm check`                     | Быстрый gate → обе сборки → web smoke и восемь offline HTML      |

Отчёты и таблица исполнителей не включены в `pnpm build` или `pnpm check`. Для отчётов дополнительно выполните `pnpm build:contracting:reports` и `pnpm test:contracting:reports`; для таблицы — `pnpm build:performers:offline` и тематическую проверку из agent-index. Текущие команды определяет `package.json`.

Для изменений только документации достаточно `pnpm docs:check`, `pnpm format:check` и `git diff --check`. Форматировать нужно только затронутые файлы; полная сборка и браузер ради правки текста не нужны.

На macOS автономный запуск Google Chrome из shell/Playwright выполняется с самого начала через разрешённый outside-sandbox запуск (`sandbox_permissions: "require_escalated"`) и отдельный временный профиль. Предпочитайте подключённое управление Chrome для интерактивного осмотра. Ошибки запуска `SIGABRT` / LaunchServices / WindowServer не исправляются флагом `--no-sandbox`; не повторяйте такой запуск в той же песочнице. Если разрешённый запуск и подключённый Chrome недоступны, явно оставьте браузерную проверку незавершённой.

Playwright сам запускает отдельный Vite на `127.0.0.1:5174` и останавливает его после проверки. Этот порт должен быть свободен; существующий сервер не переиспользуется, чтобы случайно не проверить другой checkout. Сервер разработки на `5173` может продолжать работать. Конфигурация явно задаёт `channel: 'chrome'`; подмена на Chromium или Safari не допускается. В Linux CI Chrome устанавливается командой `pnpm exec playwright install --with-deps chrome`.

`tests/smoke.spec.ts` проверяет три sales-маршрута, нормализацию deep links, количество сцен, Back/Forward, refresh, стрелки, modal reset/Escape/возврат фокуса, открытие десяти демо, каталог из четырёх onboarding-сценариев и совмещение Court hotspots с CTA после смены desktop/mobile viewport. `tests/offline.spec.ts` открывает три offline HTML при отключённой сети, проходит шесть Court-слайдов, проверяет sales landing/первый слайд, onboarding catalog, изображения текущего документа и его iframe и отсутствие попыток HTTP-запросов. Общая fixture также отслеживает необработанные ошибки JavaScript.

Это быстрые регрессионные проверки общих границ. Полные продуктовые пути, изображения остальных состояний, скриншотное сравнение, Vercel gateway, fullscreen fallback и узкие viewport проверяются по матрице конкретного изменения в AGENTS.md. Изменение тестовой инфраструктуры проходит `pnpm check`, как и другой код.

У автономной подрядной схемы свой [сценарий проверки](contracting.md). Её тест использует тот же установленный Google Chrome и отдельный профиль Playwright.

При сбое Playwright сохраняет screenshot и trace в игнорируемый `test-results/`, HTML-отчёт — в `playwright-report/`. Их можно открыть командами `pnpm exec playwright show-report` и `pnpm exec playwright show-trace <путь-к-trace.zip>`. Если команда открывает браузер, явно укажите Google Chrome. CI сохраняет эти каталоги при падении; secrets для сборки и smoke-тестов не нужны.
