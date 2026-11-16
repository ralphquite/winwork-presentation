import react from '@vitejs/plugin-react';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { build } from 'vite';

import { assert, inlineBuildAsset } from './offline-assets.mjs';

const staging = resolve('dist/performers-offline-build');

try {
  await build({
    base: './',
    configFile: false,
    publicDir: false,
    plugins: [react()],
    build: {
      assetsInlineLimit: Number.MAX_SAFE_INTEGER,
      cssCodeSplit: false,
      outDir: staging,
      rollupOptions: {
        input: 'performers-offline.html',
        output: { codeSplitting: false },
      },
    },
  });

  let html = await readFile(
    resolve(staging, 'performers-offline.html'),
    'utf8',
  );
  html = await inlineBuildAsset(
    html,
    /<script\b[^>]*src="([^"]+)"[^>]*><\/script>/g,
    'script',
    staging,
  );
  html = await inlineBuildAsset(
    html,
    /<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g,
    'style',
    staging,
  );
  assert(
    html.includes('<script type="module">') && html.includes('<style>'),
    'Offline script or styles are missing.',
  );
  assert(
    !/<(?:script|link)\b[^>]*(?:src|href)=["']/i.test(html),
    'Offline build contains external dependencies.',
  );

  const policy =
    "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; font-src data:; connect-src 'none'; base-uri 'none'; form-action 'none'";
  const licenses = await Promise.all(
    ['Roboto', 'Montserrat'].map(async (font) => {
      const license = await readFile(
        `src/assets/onboarding/${font}-LICENSE.txt`,
        'utf8',
      );
      return `<!-- ${font}\n${license.replaceAll('-->', '-- >')}\n-->`;
    }),
  );
  html = html
    .replace(
      '</title>',
      `</title>\n<meta http-equiv="Content-Security-Policy" content="${policy}" />`,
    )
    .replace('</head>', `${licenses.join('\n')}\n</head>`);
  await mkdir('dist/offline', { recursive: true });
  const output = 'dist/offline/Мои исполнители — WinWork.html';
  await writeFile(output, html);
  console.log(
    `Offline performers: ${output} (${Buffer.byteLength(html)} bytes)`,
  );
} finally {
  await rm(staging, { recursive: true, force: true });
}
