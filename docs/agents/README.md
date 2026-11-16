# Agent documentation

This directory is the low-context navigation layer for coding agents. It describes where to look and what must remain true; executable code remains authoritative.

The project covers WinWork presentations **and feature prototypes**. Product knowledge is separate from runtime instructions: read [WinWork context](../winwork/README.md) once if unfamiliar, then select a topic. The [human index](../README.md) and [source register](../winwork/sources.md) explain purpose and provenance without requiring access to prior chats or the neighbouring portfolio repository.

## Loading protocol

1. Read root `AGENTS.md`.
2. Parse `context-index.json` and choose the smallest matching `taskAreas` entry from its `triggers` and `intent`.
3. Read the selected entry's `readFirst` paths in order.
4. Inspect `changeWith` only when the task requires a mutation.
5. Run the listed `verification` commands/checks before completion.
6. Fall back to `file-map.md` only when ownership is still unclear.

For a feature brief, first establish the role, entities and goal from product context, then inspect the implementation. Distinguish product description, local implemented behavior and future proposals. Reports start with `../reports.md`; the contracting relationship starts with `../contracting.md`. Do not treat a report register as a payment register or a portfolio diagram as a production API contract.

Do not load every Pencil file, exported HTML file, screenshot, or large demo component for routine work. Start from the config or dispatcher named by the matching task area, then open only the concrete implementation involved.

## Files

- [`../winwork/README.md`](../winwork/README.md): compact product context and vocabulary.
- [`../winwork/features.md`](../winwork/features.md): all feature areas plus current user clarifications; routes to the detailed historical catalogue.
- [`../winwork/sources.md`](../winwork/sources.md): ChatGPT/Codex/portfolio provenance, freshness, superseded decisions and remaining uncertainty.
- [`../project-context.md`](../project-context.md): why the presentations and feature prototypes exist.
- [`../contracting.md`](../contracting.md), [`../reports.md`](../reports.md), [`../court.md`](../court.md): focused domain and artifact guides.
- [`../development.md`](../development.md): local environment, Codex actions, editor setup and Chrome smoke-test commands.
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
- access-gateway route, cookie, or environment contract;
- repository boundary or source-priority rule.
- product requirement, role meaning or accepted clarification; record its source and what older interpretation it supersedes.

Run `pnpm docs:check` after every documentation edit. The check validates internal Markdown links, parses the JSON schema, checks the index's core structure and references, and verifies every repository path declared by the index.
