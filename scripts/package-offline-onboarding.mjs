import assert from 'node:assert/strict';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const build = resolve('dist/onboarding-offline-build');
let html = await readFile(resolve(build, 'onboarding-offline.html'), 'utf8');
const script = await readFile(resolve(build, 'assets/onboarding.js'), 'utf8');
const css = await readFile(resolve(build, 'assets/onboarding.css'), 'utf8');
assert(
  [...css.matchAll(/url\(([^)]+)\)/gi)].every(([, value]) =>
    value
      .trim()
      .replace(/^["']|["']$/g, '')
      .startsWith('data:'),
  ),
  'Offline CSS contains an external asset.',
);
html = html.replace(
  /<script\b[^>]*src=["'][^"']+["'][^>]*><\/script>/,
  () =>
    `<script type="module">${script.replaceAll('</script', '<\\/script')}</script>`,
);
html = html.replace(
  /<link\b[^>]*rel="stylesheet"[^>]*>/,
  () => `<style>${css.replaceAll('</style', '<\\/style')}</style>`,
);
const policy =
  "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: blob:; font-src data:; connect-src 'none'; base-uri 'none'; form-action 'none'";
html = html.replace(
  '<head>',
  `<head>\n<meta http-equiv="Content-Security-Policy" content="${policy}" />`,
);
assert(
  !/<(?:script|link)\b[^>]*(?:src|href)=["']\.\/assets\//i.test(html),
  'Unembedded build dependency.',
);
assert(
  !/<script\b[^>]*\bsrc=/i.test(html),
  'External script in offline artifact.',
);
await mkdir('dist/offline', { recursive: true });
const licenses = await Promise.all(
  ['Roboto', 'Montserrat'].map(
    async (name) =>
      `<!-- ${name} font license\n${(await readFile(`src/assets/onboarding/${name}-LICENSE.txt`, 'utf8')).replaceAll('-->', '-- >')}\n-->`,
  ),
);
html = html.replace('</head>', `${licenses.join('\n')}\n</head>`);
const output = 'dist/offline/Открыть онбординг WinWork.html';
await writeFile(output, html);
await rm(build, { recursive: true, force: true });
console.log(`Offline onboarding: ${output} (${Buffer.byteLength(html)} bytes)`);
