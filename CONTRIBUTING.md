# Contributing

This project is a portable foundation for agent workspaces. Contributions should keep the core small, inspectable, and project-agnostic.

## Contribution Rules

- Keep product-specific facts out of `.agents/knowledge-core/`.
- Keep durable knowledge in `docs/`.
- Keep procedural agent behavior in `.agents/skills/`.
- Keep generated files generated; update authored sources and run `npm run knowledge:build`.
- Do not add hidden memory, network-required checks, or mandatory external services to the portable core.
- Prefer deterministic validation in scripts over prose-only rules when practical.

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
