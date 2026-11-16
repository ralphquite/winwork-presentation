import { createHash } from 'node:crypto';
import {
  mkdir,
  readFile,
  readdir,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  addDirectoryAssets,
  assert,
  inlineBuildAsset,
  inlineCssResources,
  isExternalReference,
  readDataUrl,
  replaceAsync,
  resolveInside,
  toDataUrl,
} from './offline-assets.mjs';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const publicRoot = join(projectRoot, 'public');
const stagingRoot = join(projectRoot, 'dist', 'court-offline-build');
const stagingHtmlPath = join(stagingRoot, 'court-offline.html');
const outputRoot = join(projectRoot, 'dist', 'offline');
const outputPath = join(outputRoot, 'Открыть презентацию WinWork.html');

async function inlineSlideDocument(slidePath, sharedCourtCss) {
  let document = await readFile(slidePath, 'utf8');
  const slideDirectory = dirname(slidePath);

  document = document.replace(
    /<link\b[^>]*href=["']court\.css["'][^>]*>/gi,
    `<style>${sharedCourtCss.replaceAll('</style', '<\\/style')}</style>`,
  );
  document = document.replace(
    /\s*<link\b[^>]*href=["']https:\/\/fonts\.(?:googleapis|gstatic)\.com[^>]*>\s*/gi,
    '\n',
  );

  document = await replaceAsync(
    document,
    /\b(src|href)=(['"])([^'"]+)\2/gi,
    async (match) => {
      const attribute = match[1];
      const quote = match[2];
      const reference = match[3];

      if (
        !attribute ||
        !quote ||
        !reference ||
        isExternalReference(reference)
      ) {
        return match[0];
      }

      const cleanReference = reference.split(/[?#]/, 1)[0] ?? reference;
      const decodedReference = decodeURIComponent(cleanReference);
      const assetPath = reference.startsWith('/')
        ? resolveInside(publicRoot, decodedReference.slice(1))
        : resolveInside(slideDirectory, decodedReference);
      const assetDataUrl = await readDataUrl(assetPath);

      return `${attribute}=${quote}${assetDataUrl}${quote}`;
    },
  );

  assert(
    !/<link\b[^>]*rel=["']stylesheet["']/i.test(document),
    `Slide still has an external stylesheet: ${slidePath}`,
  );
  assert(
    !/https:\/\/fonts\.(?:googleapis|gstatic)\.com/i.test(document),
    `Slide still requests a web font: ${slidePath}`,
  );

  return toDataUrl(Buffer.from(document), slidePath);
}

async function main() {
  await stat(stagingHtmlPath);

  const assetManifest = {};
  assetManifest['/winwork-logo.svg'] = await readDataUrl(
    join(publicRoot, 'winwork-logo.svg'),
  );
  await addDirectoryAssets(
    assetManifest,
    'performer-registration-flow/assets',
    publicRoot,
  );
  await addDirectoryAssets(
    assetManifest,
    'performer-response-flow/assets',
    publicRoot,
  );

  const sharedCourtCssPath = join(publicRoot, 'court-slides', 'court.css');
  const sharedCourtCss = await inlineCssResources(
    await readFile(sharedCourtCssPath, 'utf8'),
    dirname(sharedCourtCssPath),
  );
  const courtSlideDirectory = join(publicRoot, 'court-slides');
  const courtSlideNames = (await readdir(courtSlideDirectory))
    .filter((name) => /^court-\d{2}\.html$/.test(name))
    .sort();

  assert(courtSlideNames.length === 6, 'Expected exactly six court slides.');

  for (const slideName of courtSlideNames) {
    assetManifest[`/court-slides/${slideName}`] = await inlineSlideDocument(
      join(courtSlideDirectory, slideName),
      sharedCourtCss,
    );
  }

  let html = await readFile(stagingHtmlPath, 'utf8');
  html = await inlineBuildAsset(
    html,
    /<link\b(?=[^>]*\brel=["']stylesheet["'])(?=[^>]*\bhref=["']([^"']+)["'])[^>]*>/gi,
    'style',
    stagingRoot,
  );
  html = await inlineBuildAsset(
    html,
    /<script\b(?=[^>]*\bsrc=["']([^"']+)["'])[^>]*><\/script>/gi,
    'script',
    stagingRoot,
  );

  const manifestScript = `<script>window.__WINWORK_OFFLINE_ASSETS__=Object.freeze(${JSON.stringify(assetManifest)});</script>`;
  const securityPolicy = [
    "default-src 'none'",
    "script-src 'unsafe-inline'",
    "style-src 'unsafe-inline'",
    'img-src data:',
    'font-src data:',
    'frame-src data:',
    "connect-src 'none'",
    "base-uri 'none'",
    "form-action 'none'",
  ].join('; ');

  html = html.replace(
    '</head>',
    `    <meta http-equiv="Content-Security-Policy" content="${securityPolicy}" />\n    ${manifestScript}\n  </head>`,
  );
  html = html.replace(
    '<!doctype html>',
    '<!doctype html>\n<!-- Автономная сборка WinWork: откройте этот файл двойным кликом. -->',
  );

  assert(
    !/<(?:script|link)\b[^>]*(?:src|href)=["']\.\/assets\//i.test(html),
    'Offline HTML still references Vite build assets.',
  );
  assert(
    !/<script\b[^>]*\bsrc=/i.test(html),
    'Offline HTML still contains an external script.',
  );

  await mkdir(outputRoot, { recursive: true });
  await writeFile(outputPath, html);
  await rm(stagingRoot, { force: true, recursive: true });

  const digest = createHash('sha256').update(html).digest('hex');
  console.log(
    `Offline court presentation: ${relative(projectRoot, outputPath)} (${Buffer.byteLength(html)} bytes, sha256 ${digest})`,
  );
}

await main();
