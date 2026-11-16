import { createHash } from 'node:crypto';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { compile } from 'tailwindcss';

import {
  addDirectoryAssets,
  assert,
  inlineBuildAsset,
  inlineCssResources,
  readDataUrl,
  replaceAsync,
  resolveInside,
  toDataUrl,
} from './offline-assets.mjs';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const publicRoot = join(projectRoot, 'public');
const stagingRoot = join(projectRoot, 'dist/sales-offline-build');
const outputPath = join(
  projectRoot,
  'dist/offline/Открыть продажи WinWork.html',
);
const fontRoot = join(projectRoot, 'src/assets/sales');
const fontCss = await inlineCssResources(
  await readFile(join(fontRoot, 'inter.css'), 'utf8'),
  fontRoot,
);
const require = createRequire(import.meta.url);
const themeCss = await readFile(
  require.resolve('tailwindcss/theme.css'),
  'utf8',
);

// Check resource attributes and CSS without confusing SVG namespace URLs or
// user-facing external links with passive network dependencies.
function assertEmbeddedResources(document, label) {
  for (const [, reference] of document.matchAll(
    /\b(?:src|href)=["']([^"']+)["']/gi,
  )) {
    assert(
      /^(?:data:|#)/i.test(reference),
      `${label}: unembedded resource ${reference}`,
    );
  }
  for (const [, reference] of document.matchAll(
    /url\(\s*["']?([^"')]+)["']?\s*\)/gi,
  )) {
    assert(
      /^(?:data:|#)/i.test(reference),
      `${label}: unembedded CSS resource ${reference}`,
    );
  }
  assert(
    !/<script\b|@import\b|\bsrcset=/i.test(document),
    `${label}: unsupported active resource`,
  );
}

async function inlineSlide(path) {
  const sourcePath = resolveInside(publicRoot, path.slice(1));
  let document = await readFile(sourcePath, 'utf8');
  let utilityCss = '';

  if (document.includes('https://cdn.tailwindcss.com')) {
    const candidates = [
      ...document.matchAll(/\bclass=["']([^"']*)["']/g),
    ].flatMap(([, classes]) => classes.split(/\s+/));
    const compiler = await compile(`${themeCss}\n@tailwind utilities;`);
    utilityCss = compiler.build(candidates);
    // Match the original CDN's inherited font/line-height and v3 rounded-full
    // value while compiling the unchanged export classes with local Tailwind.
    utilityCss += `\nhtml { font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; line-height: 1.5; }\n.rounded-full { border-radius: 9999px; }`;
    document = document.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  }

  document = document.replace(
    /<link\b[^>]*href=["']https:\/\/fonts\.(?:googleapis|gstatic)\.com[^>]*>/gi,
    '',
  );
  document = await replaceAsync(
    document,
    /\b(src|href)=(['"])([^'"]+)\2/gi,
    async (match) => {
      const [, attribute, quote, reference] = match;
      if (/^(?:data:|#)/i.test(reference)) return match[0];
      assert(
        !/^(?:[a-z]+:|\/\/)/i.test(reference),
        `${path}: unexpected external resource ${reference}`,
      );
      const clean = decodeURIComponent(reference.split(/[?#]/, 1)[0]);
      const assetPath = resolveInside(
        publicRoot,
        reference.startsWith('/')
          ? clean.slice(1)
          : resolve(dirname(sourcePath), clean),
      );
      return `${attribute}=${quote}${await readDataUrl(assetPath)}${quote}`;
    },
  );
  document = await inlineCssResources(
    document,
    dirname(sourcePath),
    publicRoot,
  );
  document = document.replace(
    '</head>',
    () => `<style>${fontCss}\n${utilityCss}</style></head>`,
  );
  assertEmbeddedResources(document, path);
  return toDataUrl(Buffer.from(document), sourcePath);
}

// Vite emits this list from the same configs that drive the routes. Removed
// scenes and unrelated public files never enter the distributable.
const slidePaths = JSON.parse(
  await readFile(join(stagingRoot, 'slides.json'), 'utf8'),
);
assert(
  slidePaths.length > 0 && new Set(slidePaths).size === slidePaths.length,
  'Invalid sales slide manifest.',
);
const manifest = {};
for (const path of slidePaths) {
  assert(
    /^\/(enterprise|small|api)-slides\/[^/]+\.html$/.test(path),
    `Unexpected sales slide: ${path}`,
  );
  manifest[path] = await inlineSlide(path);
}
for (const path of ['/winwork-logo.svg', '/demo-assets/IYshz.png']) {
  manifest[path] = await readDataUrl(join(publicRoot, path.slice(1)));
}
for (const directory of [
  'performer-registration-flow/assets',
  'performer-response-flow/assets',
]) {
  await addDirectoryAssets(manifest, directory, publicRoot);
}

let html = await readFile(join(stagingRoot, 'sales-offline.html'), 'utf8');
html = await inlineBuildAsset(
  html,
  /<link\b(?=[^>]*\brel=["']stylesheet["'])(?=[^>]*\bhref=["']([^"']+)["'])[^>]*>/gi,
  'style',
  stagingRoot,
);
// Validate actual CSS before JavaScript/string literals are added to the document.
for (const [, css] of html.matchAll(/<style>([\s\S]*?)<\/style>/g)) {
  assertEmbeddedResources(css, 'Application styles');
}
html = await inlineBuildAsset(
  html,
  /<script\b(?=[^>]*\bsrc=["']([^"']+)["'])[^>]*><\/script>/gi,
  'script',
  stagingRoot,
);
const policy = [
  "default-src 'none'",
  "script-src 'unsafe-inline'",
  "style-src 'unsafe-inline'",
  'img-src data: blob:',
  'font-src data:',
  'frame-src data:',
  "connect-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
].join('; ');
// Place the policy before all executable content. JSON escaping also makes
// future manifest values safe inside an HTML script element.
const manifestJson = JSON.stringify(manifest).replaceAll('<', '\\u003c');
html = html.replace(
  '<head>',
  () =>
    `<head>\n<meta http-equiv="Content-Security-Policy" content="${policy}" />\n<script>window.__WINWORK_OFFLINE_ASSETS__=Object.freeze(${manifestJson});</script>`,
);
const licenses = await Promise.all(
  [
    'src/assets/sales/Inter-LICENSE.txt',
    'src/assets/onboarding/Roboto-LICENSE.txt',
    'src/assets/onboarding/Montserrat-LICENSE.txt',
  ].map(
    async (path) =>
      `<!-- ${path}\n${(await readFile(join(projectRoot, path), 'utf8')).replaceAll('-->', '-- >')}\n-->`,
  ),
);
html = html.replace('</head>', () => `${licenses.join('\n')}\n</head>`);
assert(
  !/<script\b[^>]*\bsrc=|<link\b[^>]*\bhref=/i.test(html),
  'Unembedded application dependency.',
);
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, html);
await rm(stagingRoot, { recursive: true, force: true });
console.log(
  `Offline sales: ${relative(projectRoot, outputPath)} (${slidePaths.length} slides, ${Buffer.byteLength(html)} bytes, sha256 ${createHash('sha256').update(html).digest('hex')})`,
);
