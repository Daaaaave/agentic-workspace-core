# Contributing

This project is a portable foundation for agent workspaces. Contributions should keep the core small, inspectable, and project-agnostic.

## Contribution Rules

- Keep product-specific facts out of `.agents/knowledge-core/`.
- Keep durable knowledge in `docs/`.
- Keep procedural agent behavior in `.agents/skills/`.
- Keep generated files generated; update authored sources and run `npm run knowledge:build`.
- Do not add hidden memory, network-required checks, or mandatory external services to the portable core.
- Prefer deterministic validation in scripts over prose-only rules when practical.

## Package Surface

Keep the npm package focused on files needed to install, inspect, test, and publish the core:

- `bin/` for the CLI.
- `payload/` for the exact installed workspace layer.
- `scripts/` for release validation referenced by `package.json`.
- public package docs such as `README.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, `SECURITY.md`, and `LICENSE`.

Do not publish source-repository working context such as root dogfooding files, research notes, generated root indexes, `.context/`, logs, screenshots, or long internal planning docs. If a file teaches downstream runtime behavior, put it in `payload/`. If it only explains why this source repository changed, keep it out of the npm package.

The `0.1.x` installer is replace-first for managed paths. Changes to `AGENTS.md`, `CLAUDE.md`, `.agents/**`, `docs/index.md`, `docs/knowledge-system.md`, `llms.txt`, `docs/generated/**`, package scripts, or `.gitignore` install/update behavior must keep diffs reviewable and must be covered by smoke or release checks.

## Before Opening A Change

Run:

```bash
npm run knowledge:check
```

For skill changes, update the matching eval under `.agents/evals/skills/`.

For durable knowledge changes, update the canonical owner instead of creating duplicates, preserve provenance, and include `last_reviewed`.

## Adding Skills

Add a new skill only when it is reusable, procedural, has a clear trigger boundary, and cannot be replaced by a deterministic script or schema. Every concrete skill needs:

- `.agents/skills/<skill-name>/SKILL.md`
- `.agents/evals/skills/<skill-name>.eval.md`

## Adding Adapters

Adapters must preserve the core trust boundary: authored repository files remain inspectable and reviewable, and derived stores must not become hidden sources of truth without an explicit adapter contract.
