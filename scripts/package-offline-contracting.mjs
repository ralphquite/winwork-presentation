import {
  mkdir,
  mkdtemp,
  readFile,
  rename,
  rm,
  writeFile,
} from 'node:fs/promises';
import { basename, dirname, join, relative } from 'node:path';
import { build } from 'vite';

import { contractingCustomerBriefSlides } from '../src/contracting/customerBriefSlides.ts';
import { contractingIntroSlides } from '../src/contracting/introSlides.ts';
import {
  assert,
  inlineBuildAsset,
  inlineCssResources,
  readDataUrl,
  replaceAsync,
  resolveInside,
  toDataUrl,
} from './offline-assets.mjs';

const root = dirname(import.meta.dirname);
const dist = join(root, 'dist');
const outputDirectory = join(dist, 'offline');
const contractingAssetDirectory = join(root, 'src/assets/contracting');
const editions = {
  full: {
    filename: 'Открыть подрядную схему WinWork.html',
    title: 'WinWork · Подрядная схема',
    role: null,
    withSlides: true,
  },
  prototype: {
    filename: 'Открыть демо подрядной схемы WinWork.html',
    title: 'WinWork · Демо подрядной схемы',
    role: null,
    withSlides: false,
  },
  customer: {
    filename: 'Открыть подрядную схему WinWork — для заказчика.html',
    title: 'WinWork · Подрядная схема для заказчика',
    role: 'customer',
    withSlides: true,
  },
  'customer-brief': {
    filename:
      'Открыть подрядную схему WinWork — для заказчика (краткая версия).html',
    title: 'WinWork · Подрядная схема для заказчика · Краткая версия',
    role: 'customer',
    withSlides: true,
    customerBrief: true,
  },
  contractor: {
    filename: 'Открыть подрядную схему WinWork — для подрядчика.html',
    title: 'WinWork · Подрядная схема для подрядчика',
    role: 'contractor',
    withSlides: true,
  },
  reports: {
    filename: 'Отчёты — подрядная схема WinWork.html',
    title: 'WinWork · Отчёты по подрядной схеме',
    entry: 'contracting-reports-offline.html',
    role: null,
    withSlides: false,
  },
};

// Keyed by the stable text layer IDs in the Pencil exports.
const slideCopy = {
  customer: {
    'ctr-01': {
      lkP1s: 'ДЕМОНСТРАЦИЯ ДЛЯ ЗАКАЗЧИКА',
      L7zPzn:
        'Вы размещаете задание и принимаете работу. Договор с исполнителем заключает подрядчик.',
    },
    'ctr-05': {
      NKH9t: 'ЗАКАЗЧИК И ИСПОЛНИТЕЛЬ',
      HGtHu:
        'Проследим за заданием от публикации в кабинете заказчика до выплаты в приложении исполнителя.',
      mPa0D: 'В демо',
      T4xtfO: 'Участник схемы',
      gqUKb: 'В демо',
    },
  },
  contractor: {
    'ctr-01': {
      lkP1s: 'ДЕМОНСТРАЦИЯ ДЛЯ ПОДРЯДЧИКА',
      L7zPzn:
        'Клиент размещает задание через вас. Вы заключаете договор с исполнителем и подписываете акты.',
    },
    'ctr-05': {
      NKH9t: 'ПОДРЯДЧИК И ИСПОЛНИТЕЛЬ',
      HGtHu:
        'Увидим задание клиента в кабинете подрядчика и пройдём путь исполнителя от отклика до выплаты.',
      mPa0D: 'Участник схемы',
      T4xtfO: 'В демо',
      gqUKb: 'В демо',
    },
  },
};

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

const licensePaths = [
  'src/assets/sales/Inter-LICENSE.txt',
  'src/assets/onboarding/Roboto-LICENSE.txt',
  'src/assets/onboarding/Montserrat-LICENSE.txt',
];

function escapeHtml(text) {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function adaptSlideCopy(source, copy, path) {
  for (const [layerId, text] of Object.entries(copy)) {
    const layer = new RegExp(
      `(<div\\s+data-pencil-id="${layerId}"[^>]*>)(?:[^<]|<br\\s*/?>)*(</div>)`,
      'g',
    );
    assert(
      [...source.matchAll(layer)].length === 1,
      `${path}: expected one text layer ${layerId}.`,
    );
    source = source.replace(
      layer,
      (_, open, close) => `${open}${escapeHtml(text)}${close}`,
    );
  }
  return source;
}

async function assetManifest({ role, withSlides, customerBrief }) {
  const assets = [
    '/winwork-logo.svg',
    ...['back', 'company-chevron', 'copy', 'star'].map(
      (icon) => `/performer-response-flow/assets/${icon}.svg`,
    ),
  ];
  const manifest = Object.fromEntries(
    await Promise.all(
      assets.map(async (path) => [
        path,
        await readDataUrl(join(root, 'public', path.slice(1))),
      ]),
    ),
  );
  if (!withSlides) return manifest;

  const fontDirectory = join(root, 'src/assets/sales');
  const slideFonts = await inlineCssResources(
    await readFile(join(fontDirectory, 'inter.css'), 'utf8'),
    fontDirectory,
  );
  const slideDirectory = join(
    contractingAssetDirectory,
    customerBrief ? 'customer-brief' : 'slides',
  );
  const slides = customerBrief
    ? contractingCustomerBriefSlides
    : contractingIntroSlides;

  for (const { id, pencil, nextButtonLabel } of slides) {
    const path = join(slideDirectory, basename(pencil.documentPath));
    const copy = customerBrief ? {} : (slideCopy[role]?.[id] ?? {});
    const html = await replaceAsync(
      adaptSlideCopy(await readFile(path, 'utf8'), copy, path),
      /(<img\b[^>]*\bsrc=)(["'])([^"']+)\2/gi,
      async ([tag, prefix, quote, reference]) => {
        if (reference.startsWith('data:')) return tag;
        assert(
          !/^(?:[a-z]+:|\/|#)/i.test(reference),
          `${path}: unsupported image ${reference}.`,
        );
        const imagePath = resolveInside(
          contractingAssetDirectory,
          join(slideDirectory, decodeURIComponent(reference)),
        );
        return `${prefix}${quote}${await readDataUrl(imagePath)}${quote}`;
      },
    );
    const source = customerBrief
      ? await inlineCssResources(
          html,
          slideDirectory,
          contractingAssetDirectory,
        )
      : html;
    assert(
      source.includes(`data-pencil-id="${pencil.frameId}"`),
      `${path}: expected slide frame ${pencil.frameId}.`,
    );
    assert(
      (source.match(/\bdata-presentation-next\b/g)?.length ?? 0) ===
        (nextButtonLabel ? 1 : 0),
      `${path}: unexpected number of next scene hotspots.`,
    );
    assert(source.includes('</head>'), `${path}: missing slide head.`);
    const document = source.replace(
      '</head>',
      () => `<style>${slideFonts}</style></head>`,
    );
    assert(
      !/<(?:script|link|iframe|base)\b|@import\b|\bsrcset\s*=/i.test(document),
      `${path}: unsupported slide dependency.`,
    );
    for (const [, attributeUrl, cssUrl] of document.matchAll(
      /\b(?:src|href)\s*=\s*["']([^"']+)["']|url\(\s*["']?([^"')]+)["']?\s*\)/gi,
    )) {
      const reference = attributeUrl ?? cssUrl;
      assert(
        /^(?:data:|#)/i.test(reference),
        `${path}: unembedded slide resource ${reference}.`,
      );
    }
    manifest[pencil.documentPath] = toDataUrl(Buffer.from(document), path);
  }
  return manifest;
}

async function packageEdition(edition, staging) {
  const [manifest, licenses, entry] = await Promise.all([
    edition.entry ? {} : assetManifest(edition),
    Promise.all(
      licensePaths.map(
        async (path) =>
          `<!-- ${path}\n${(await readFile(join(root, path), 'utf8')).replaceAll('-->', '-- >')}\n-->`,
      ),
    ),
    readFile(
      join(staging, edition.entry ?? 'contracting-offline.html'),
      'utf8',
    ),
  ]);
  let html = await inlineBuildAsset(
    entry,
    /<link\b(?=[^>]*\brel=["']stylesheet["'])(?=[^>]*\bhref=["']([^"']+)["'])[^>]*>/gi,
    'style',
    staging,
  );
  for (const [, css] of html.matchAll(/<style>([\s\S]*?)<\/style>/g)) {
    for (const [, url] of css.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)) {
      assert(
        /^(?:data:|#)/.test(url),
        `Unembedded contracting CSS asset: ${url}`,
      );
    }
  }
  html = await inlineBuildAsset(
    html,
    /<script\b(?=[^>]*\bsrc=["']([^"']+)["'])[^>]*><\/script>/gi,
    'script',
    staging,
  );

  const charset = /<meta\b[^>]*\bcharset=["']utf-8["'][^>]*>/i;
  assert(charset.test(html), 'Missing UTF-8 declaration in contracting HTML.');
  html = html.replace(
    charset,
    (tag) =>
      `${tag}\n<meta http-equiv="Content-Security-Policy" content="${policy}" />\n<script>window.__WINWORK_OFFLINE_ASSETS__=Object.freeze(${JSON.stringify(manifest).replaceAll('<', '\\u003c')});</script>`,
  );
  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${escapeHtml(edition.title)}</title>`,
  );
  html = html.replace('</head>', () => `${licenses.join('\n')}\n</head>`);
  assert(
    !/<script\b[^>]*\bsrc=|<link\b[^>]*\bhref=/i.test(html),
    'Unembedded contracting application dependency.',
  );
  return html;
}

const args = process.argv.slice(2);
const selection =
  args.length > 0
    ? [...new Set(args)]
    : Object.keys(editions).filter((name) => name !== 'reports');
for (const name of selection) {
  assert(
    Object.hasOwn(editions, name),
    `Unknown contracting edition "${name}". Choose from ${Object.keys(editions).join(', ')}.`,
  );
}

await mkdir(dist, { recursive: true });
const staging = await mkdtemp(join(dist, 'contracting-offline-build-'));
try {
  for (const name of selection) {
    const edition = editions[name];
    const bundle = join(staging, name);
    await build({
      root,
      configFile: join(root, 'vite.contracting-offline.config.ts'),
      define: {
        __CONTRACTING_CUSTOMER_BRIEF__: JSON.stringify(
          edition.customerBrief ?? false,
        ),
        __CONTRACTING_ROLE__: JSON.stringify(edition.role),
        __CONTRACTING_WITH_SLIDES__: JSON.stringify(edition.withSlides),
      },
      build: {
        outDir: bundle,
        ...(edition.entry ? { rollupOptions: { input: edition.entry } } : {}),
      },
    });
    await writeFile(
      join(staging, edition.filename),
      await packageEdition(edition, bundle),
    );
  }

  await mkdir(outputDirectory, { recursive: true });
  for (const name of selection) {
    const { filename } = editions[name];
    const output = join(outputDirectory, filename);
    await rename(join(staging, filename), output);
    console.log(`Offline contracting: ${relative(root, output)}`);
  }
} finally {
  await rm(staging, { recursive: true, force: true });
}
