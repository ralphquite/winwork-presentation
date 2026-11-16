import { spawnSync } from 'node:child_process';
import { existsSync, lstatSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
let failures = 0;

function check(ok, label, remedy) {
  console.log(`${ok ? 'OK' : 'FAIL'} ${label}${ok ? '' : ` — ${remedy}`}`);
  if (!ok) failures += 1;
}

check(
  Number(process.versions.node.split('.')[0]) === 24,
  `Node.js ${process.versions.node}`,
  'Используйте Node.js 24 из .node-version.',
);

const pnpm = spawnSync('pnpm', ['--version'], {
  cwd: root,
  encoding: 'utf8',
  shell: process.platform === 'win32',
});
const pnpmVersion = pnpm.stdout?.trim();
check(
  pnpm.status === 0 && pnpmVersion === manifest.packageManager.split('@')[1],
  `pnpm ${pnpmVersion || 'не найден'}`,
  `Установите ${manifest.packageManager}.`,
);

const gitPath = join(root, '.git');
check(
  existsSync(gitPath) &&
    lstatSync(gitPath).isDirectory() &&
    !lstatSync(gitPath).isSymbolicLink(),
  '.git — каталог внутри проекта',
  'Откройте основной checkout проекта; внешние worktree запрещены.',
);

for (const dependency of ['vite', 'typescript', '@playwright/test']) {
  let installed = false;
  try {
    import.meta.resolve(dependency);
    installed = true;
  } catch {
    // Report all missing dependencies in one run.
  }
  check(installed, dependency, 'Выполните pnpm install --frozen-lockfile.');
}

const chromePaths = {
  darwin: ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'],
  linux: ['/opt/google/chrome/chrome', '/usr/bin/google-chrome'],
  win32: [
    join(
      process.env.PROGRAMFILES || '',
      'Google/Chrome/Application/chrome.exe',
    ),
    join(
      process.env.LOCALAPPDATA || '',
      'Google/Chrome/Application/chrome.exe',
    ),
    join(
      process.env['PROGRAMFILES(X86)'] || '',
      'Google/Chrome/Application/chrome.exe',
    ),
  ],
};
check(
  (chromePaths[process.platform] || []).some((path) => existsSync(path)),
  'Google Chrome',
  'Установите Google Chrome; в Linux CI: pnpm exec playwright install --with-deps chrome.',
);

console.log(
  failures
    ? `Окружение требует исправлений: ${failures}.`
    : 'Окружение готово. Запуск: pnpm dev. Быстрая проверка: pnpm check:quick.',
);
process.exitCode = failures ? 1 : 0;
