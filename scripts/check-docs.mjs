import { access, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const ignoredDirectories = new Set([
  '.git',
  '.vercel',
  'coverage',
  'dist',
  'node_modules',
]);
const errors = [];

async function exists(targetPath) {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function collectMarkdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) {
      continue;
    }

    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectMarkdownFiles(entryPath)));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(entryPath);
    }
  }

  return files;
}

function repositoryRelative(targetPath) {
  return path.relative(repositoryRoot, targetPath) || '.';
}

function validateRepositoryPath(repositoryPath, source) {
  if (
    typeof repositoryPath !== 'string' ||
    repositoryPath.length === 0 ||
    path.isAbsolute(repositoryPath) ||
    repositoryPath.includes('://')
  ) {
    errors.push(`${source}: invalid repository path "${repositoryPath}"`);
    return false;
  }

  const resolvedPath = path.resolve(repositoryRoot, repositoryPath);
  const relativePath = path.relative(repositoryRoot, resolvedPath);

  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    errors.push(`${source}: path escapes repository: ${repositoryPath}`);
    return false;
  }

  return resolvedPath;
}

async function validateMarkdownLinks(markdownFiles) {
  let linkCount = 0;
  const markdownLinkPattern = /!?\[[^\]]*\]\(([^)]+)\)/g;

  for (const markdownPath of markdownFiles) {
    const source = repositoryRelative(markdownPath);
    const content = await readFile(markdownPath, 'utf8');

    for (const match of content.matchAll(markdownLinkPattern)) {
      let target = match[1]?.trim();

      if (!target) continue;

      if (target.startsWith('<') && target.endsWith('>')) {
        target = target.slice(1, -1);
      } else {
        target = target.split(/\s+["']/u, 1)[0];
      }

      if (
        target.startsWith('#') ||
        target.startsWith('/') ||
        /^(?:https?:|mailto:|data:)/u.test(target)
      ) {
        continue;
      }

      linkCount += 1;
      const pathWithoutFragment = target.split('#', 1)[0]?.split('?', 1)[0];

      if (!pathWithoutFragment) continue;

      let decodedPath;

      try {
        decodedPath = decodeURIComponent(pathWithoutFragment);
      } catch {
        errors.push(`${source}: invalid URL encoding in link ${target}`);
        continue;
      }

      const resolvedTarget = path.resolve(
        path.dirname(markdownPath),
        decodedPath,
      );

      if (!(await exists(resolvedTarget))) {
        errors.push(`${source}: missing Markdown target ${target}`);
      }
    }
  }

  return linkCount;
}

function assertNonEmptyString(value, source) {
  if (typeof value !== 'string' || value.length === 0) {
    errors.push(`${source}: expected a non-empty string`);
    return false;
  }

  return true;
}

function assertNonEmptyArray(value, source) {
  if (!Array.isArray(value) || value.length === 0) {
    errors.push(`${source}: expected a non-empty array`);
    return false;
  }

  return true;
}

function collectIndexPaths(index) {
  const entries = [];
  const addPaths = (paths, source) => {
    if (!assertNonEmptyArray(paths, source)) return;

    paths.forEach((repositoryPath, itemIndex) => {
      entries.push({ repositoryPath, source: `${source}[${itemIndex}]` });
    });
  };

  addPaths(index.project?.entrypoints, 'project.entrypoints');

  if (assertNonEmptyArray(index.sourcePriority, 'sourcePriority')) {
    index.sourcePriority.forEach((entry, entryIndex) =>
      addPaths(entry?.paths, `sourcePriority[${entryIndex}].paths`),
    );
  }

  if (assertNonEmptyArray(index.routes, 'routes')) {
    index.routes.forEach((route, routeIndex) => {
      entries.push({
        repositoryPath: route?.configPath,
        source: `routes[${routeIndex}].configPath`,
      });
    });
  }

  for (const key of ['runtimePaths', 'referencePaths', 'historicalPaths']) {
    addPaths(index.assets?.[key], `assets.${key}`);
  }

  if (assertNonEmptyArray(index.taskAreas, 'taskAreas')) {
    index.taskAreas.forEach((taskArea, taskIndex) => {
      addPaths(taskArea?.readFirst, `taskAreas[${taskIndex}].readFirst`);
      addPaths(taskArea?.changeWith, `taskAreas[${taskIndex}].changeWith`);
    });
  }

  return entries;
}

async function validateContextIndex() {
  const indexPath = path.join(repositoryRoot, 'docs/agents/context-index.json');
  const schemaPath = path.join(
    repositoryRoot,
    'docs/agents/context-index.schema.json',
  );
  const index = JSON.parse(await readFile(indexPath, 'utf8'));

  JSON.parse(await readFile(schemaPath, 'utf8'));

  if (index.schemaVersion !== 1) {
    errors.push('context-index.json: schemaVersion must equal 1');
  }

  assertNonEmptyString(index.project?.name, 'project.name');
  assertNonEmptyString(index.project?.kind, 'project.kind');

  const invariantIds = new Set();

  if (assertNonEmptyArray(index.invariants, 'invariants')) {
    index.invariants.forEach((invariant, invariantIndex) => {
      const source = `invariants[${invariantIndex}]`;

      if (assertNonEmptyString(invariant?.id, `${source}.id`)) {
        if (invariantIds.has(invariant.id)) {
          errors.push(`${source}.id: duplicate value ${invariant.id}`);
        }

        invariantIds.add(invariant.id);
      }

      assertNonEmptyString(invariant?.rule, `${source}.rule`);
    });
  }

  const taskAreaIds = new Set();

  if (Array.isArray(index.taskAreas)) {
    index.taskAreas.forEach((taskArea, taskIndex) => {
      const source = `taskAreas[${taskIndex}]`;

      if (assertNonEmptyString(taskArea?.id, `${source}.id`)) {
        if (taskAreaIds.has(taskArea.id)) {
          errors.push(`${source}.id: duplicate value ${taskArea.id}`);
        }

        taskAreaIds.add(taskArea.id);
      }

      assertNonEmptyString(taskArea?.intent, `${source}.intent`);
      assertNonEmptyArray(taskArea?.triggers, `${source}.triggers`);
      assertNonEmptyArray(taskArea?.verification, `${source}.verification`);

      if (
        assertNonEmptyArray(taskArea?.invariantIds, `${source}.invariantIds`)
      ) {
        taskArea.invariantIds.forEach((invariantId) => {
          if (!invariantIds.has(invariantId)) {
            errors.push(
              `${source}.invariantIds: unknown invariant ${invariantId}`,
            );
          }
        });
      }
    });
  }

  const routePaths = new Set();

  if (Array.isArray(index.routes)) {
    index.routes.forEach((route, routeIndex) => {
      const source = `routes[${routeIndex}]`;

      if (
        assertNonEmptyString(route?.path, `${source}.path`) &&
        routePaths.has(route.path)
      ) {
        errors.push(`${source}.path: duplicate value ${route.path}`);
      }

      routePaths.add(route?.path);
      assertNonEmptyString(route?.trackId, `${source}.trackId`);
      assertNonEmptyString(route?.firstSceneId, `${source}.firstSceneId`);
    });
  }

  const pathEntries = collectIndexPaths(index);

  for (const { repositoryPath, source } of pathEntries) {
    const resolvedPath = validateRepositoryPath(repositoryPath, source);

    if (resolvedPath && !(await exists(resolvedPath))) {
      errors.push(`${source}: missing repository path ${repositoryPath}`);
    }
  }

  return {
    indexedPathCount: pathEntries.length,
    taskAreaCount: Array.isArray(index.taskAreas) ? index.taskAreas.length : 0,
  };
}

const markdownFiles = await collectMarkdownFiles(repositoryRoot);
const markdownLinkCount = await validateMarkdownLinks(markdownFiles);
const { indexedPathCount, taskAreaCount } = await validateContextIndex();

if (errors.length > 0) {
  console.error(
    `Documentation contract failed with ${errors.length} error(s):`,
  );
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log(
    `Documentation contract valid: ${markdownFiles.length} Markdown files, ${markdownLinkCount} internal links, ${indexedPathCount} indexed paths, ${taskAreaCount} task areas.`,
  );
}
