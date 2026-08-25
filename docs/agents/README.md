# Agent documentation

This directory is the low-context navigation layer for coding agents. It describes where to look and what must remain true; executable code remains authoritative.

## Loading protocol

1. Read root `AGENTS.md`.
2. Parse `context-index.json` and choose the smallest matching `taskAreas` entry from its `triggers` and `intent`.
3. Read the selected entry's `readFirst` paths in order.
4. Inspect `changeWith` only when the task requires a mutation.
5. Run the listed `verification` commands/checks before completion.
6. Fall back to `file-map.md` only when ownership is still unclear.

Do not load every Pencil file, exported HTML file, screenshot, or large demo component for routine work. Start from the config or dispatcher named by the matching task area, then open only the concrete implementation involved.

## Files

- [`context-index.json`](context-index.json): machine-readable task router, invariants, paths, routes, and validation requirements.
- [`context-index.schema.json`](context-index.schema.json): structural contract for the index.
- [`file-map.md`](file-map.md): human-scannable ownership and coupling map.
- [`change-playbooks.md`](change-playbooks.md): exact sequences for common modifications.
- [`../architecture.md`](../architecture.md): current runtime and state model.
- [`../../design-qa.md`](../../design-qa.md): current visual and interaction evidence for Enterprise demo flows.

## Status vocabulary

- `authoritative`: executable source or configuration that defines current behavior.
- `current`: maintained explanation of the current implementation.
- `reference`: approved design source or comparison artifact; not automatically runtime content.
- `historical`: original scope or dated evidence that may explain intent but cannot override current code.

## Maintenance contract

Update the index and affected focused docs in the same change when any of these change:

- route, track, scene ID, or scene ordering;
- file ownership or a path listed in the index;
- presentation/demo state or reset behavior;
- supported demo flow or asset role;
- quality command or browser verification requirement;
- repository boundary or source-priority rule.

Run `pnpm docs:check` after every documentation edit. The check validates internal Markdown links, parses the JSON schema, checks the index's core structure and references, and verifies every repository path declared by the index.
