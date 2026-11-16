import { readFile, readdir } from 'node:fs/promises';
import { extname, join, relative, resolve, sep } from 'node:path';

const mimeTypes = new Map([
  ['.css', 'text/css'],
  ['.gif', 'image/gif'],
  ['.html', 'text/html'],
  ['.jpeg', 'image/jpeg'],
  ['.jpg', 'image/jpeg'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.webp', 'image/webp'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
]);

export function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

export function toDataUrl(contents, filePath) {
  const mimeType = mimeTypes.get(extname(filePath).toLowerCase());

  assert(mimeType, `Unsupported offline asset type: ${filePath}`);

  return `data:${mimeType};base64,${contents.toString('base64')}`;
}

export function resolveInside(root, candidate) {
  const resolved = resolve(root, candidate);
  const relativePath = relative(root, resolved);

  assert(
    relativePath !== '..' && !relativePath.startsWith(`..${sep}`),
    `Offline asset escaped its source directory: ${candidate}`,
  );

  return resolved;
}

export function isExternalReference(value) {
  return /^(?:[a-z]+:|#|\/\/)/i.test(value);
}

export async function replaceAsync(input, pattern, replacer) {
  const matches = [...input.matchAll(pattern)];

  if (matches.length === 0) {
    return input;
  }

  const replacements = await Promise.all(
    matches.map((match) => replacer(match)),
  );
  let cursor = 0;
  let result = '';

  matches.forEach((match, index) => {
    const matchIndex = match.index;
    assert(matchIndex !== undefined, 'Offline replacement lost match index.');
    result += input.slice(cursor, matchIndex);
    result += replacements[index];
    cursor = matchIndex + match[0].length;
  });

  return result + input.slice(cursor);
}

export async function readDataUrl(filePath) {
  return toDataUrl(await readFile(filePath), filePath);
}

export async function inlineCssResources(
  css,
  cssDirectory,
  assetRoot = cssDirectory,
) {
  return replaceAsync(
    css,
    /url\(\s*(["']?)([^"')]+)\1\s*\)/gi,
    async (match) => {
      const reference = match[2]?.trim();

      if (!reference || isExternalReference(reference)) {
        return match[0];
      }

      const cleanReference = reference.split(/[?#]/, 1)[0] ?? reference;
      const assetPath = resolveInside(
        assetRoot,
        resolve(cssDirectory, decodeURIComponent(cleanReference)),
      );

      return `url(${await readDataUrl(assetPath)})`;
    },
  );
}

export async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = join(directory, entry.name);

      return entry.isDirectory() ? listFiles(entryPath) : [entryPath];
    }),
  );

  return files.flat();
}

export async function addDirectoryAssets(
  assetManifest,
  publicDirectory,
  publicRoot,
) {
  const directoryPath = join(publicRoot, publicDirectory);

  for (const filePath of await listFiles(directoryPath)) {
    const publicPath = `/${relative(publicRoot, filePath).split(sep).join('/')}`;
    assetManifest[publicPath] = await readDataUrl(filePath);
  }
}

export async function inlineBuildAsset(html, tagPattern, tagName, stagingRoot) {
  return replaceAsync(html, tagPattern, async (match) => {
    const reference = match[1];
    assert(reference, `Missing ${tagName} path in offline Vite output.`);
    const cleanReference = reference.replace(/^\.\//, '').split(/[?#]/, 1)[0];
    const filePath = resolveInside(
      stagingRoot,
      decodeURIComponent(cleanReference),
    );
    const contents = await readFile(filePath, 'utf8');

    if (tagName === 'style') {
      return `<style>${contents.replaceAll('</style', '<\\/style')}</style>`;
    }

    return `<script type="module">${contents.replaceAll('</script', '<\\/script')}</script>`;
  });
}
