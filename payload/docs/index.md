---
id: project.index
type: overview
status: current
owner: project
summary: Human-readable home and routing map for repository knowledge.
canonical_for:
  - project.index
related:
  - project.knowledge-system
verified_by:
  - npm run knowledge:check
last_reviewed: 2026-05-24
---

# Project Knowledge

This is the human-readable home for durable knowledge about this repository.

## Start Here

- Use `llms.txt` for a compact generated map.
- Use `docs/generated/knowledge-map.md` for generated navigation.
- Use `.agents/knowledge-core/README.md` for the portable core specification.
- Use `docs/knowledge-system.md` for repository-local usage rules.

## What Belongs Here

- Architecture, domain, workflow, API, database, component, and reference knowledge.
- Decisions that future agents or developers must apply.
- Runbooks for repeated operational procedures.
- Research conclusions that should remain available after the session.
- Durable implementation plans that are larger than a tiny todo list.

## What Does Not Belong Here

- Temporary task state; use `.context/handoffs/`.
- Archived pre-install material; keep it in `legacy/` until explicitly migrated.
- Procedural agent behavior; use `.agents/skills/`.
- Generated indexes; rebuild them from authored docs.
- Personal/private notes, credentials, raw chat logs, screenshots, and local dumps.

## Maintenance

- Update the canonical owner instead of creating duplicate docs.
- Use explicit `status`, `canonical_for`, `last_reviewed`, evidence, and related links.
- Run `npm run knowledge:build` after authored docs change.
- Run `npm run knowledge:check` before finishing knowledge-core work.
