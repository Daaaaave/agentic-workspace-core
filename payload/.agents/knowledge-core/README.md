# Agentic Knowledge Core

Portable scaffold for repository-native agent knowledge.

This directory is agent infrastructure, not project documentation. The runtime entrypoint is `AGENTS.md`; compact navigation is generated into `llms.txt`; policy lives in `memory-policy.md`.

## Core Files

| File | Purpose |
| --- | --- |
| `memory-policy.md` | Single policy for memory reads, writes, routing, lifecycle, trust, correction, deletion, templates, and adapters. |
| `document-schema.md` | Frontmatter contract for authored knowledge in `docs/`. |
| `skill-contract.md` | Contract for procedural agent skills and evals. |
| `manifest.json` | Machine-readable package manifest used by tooling. |
| `schemas/` | JSON schemas for config, docs, and skills. |
| `templates/` | Optional scaffolds for project-specific docs and handoffs. |
| `scripts/` | Local build and doctor scripts. |

## Runtime Surface

| Role | Path | Canonical? | Rule |
| --- | --- | --- | --- |
| Agent instructions | `AGENTS.md` | Yes | Always-on behavior and routing rules. Keep concise. |
| Claude proxy | `CLAUDE.md` | Yes | Imports `AGENTS.md`; do not duplicate instructions. |
| Knowledge index | `llms.txt` | No | Generated navigation only. Rebuild, do not edit. |
| Authored knowledge | `docs/` | Yes | Durable project facts when a project creates them. |
| Generated knowledge | `.agents/generated/` | No | Derived maps and graph artifacts. |
| Skills | `.agents/skills/` | Yes | Procedural agent workflows, not project facts. |
| Skill evals | `.agents/evals/skills/` | Yes | Trigger and non-trigger checks. |
| Runtime handoffs | `.context/handoffs/` | No | Temporary transfer state only. |
| Legacy archive | `legacy/` | No | Inactive pre-install material. |

## Stable Paths

```txt
AGENTS.md
CLAUDE.md
llms.txt

.agents/knowledge.config.json
.agents/knowledge-core/README.md
.agents/knowledge-core/manifest.json
.agents/knowledge-core/memory-policy.md
.agents/knowledge-core/document-schema.md
.agents/knowledge-core/skill-contract.md
.agents/knowledge-core/schemas/document.schema.json
.agents/knowledge-core/schemas/config.schema.json
.agents/knowledge-core/schemas/skill.schema.json
.agents/knowledge-core/templates/
.agents/knowledge-core/scripts/lib/core.mjs
.agents/knowledge-core/scripts/build-index.mjs
.agents/knowledge-core/scripts/doctor.mjs
.agents/skills/
.agents/evals/skills/
.agents/generated/knowledge-map.md
.agents/generated/knowledge-graph.json
.context/handoffs/
legacy/
```

Default authored doc directories are configured in `.agents/knowledge.config.json`:

```txt
docs/architecture/
docs/components/
docs/domain/
docs/workflows/
docs/runbooks/
docs/decisions/
docs/research/
docs/plans/
docs/reference/
docs/glossary/
```

## Authored vs Generated

Authored files are the source of truth. Generated files are derived from authored files and config.

Generated files:

- `llms.txt`
- `.agents/generated/knowledge-map.md`
- `.agents/generated/knowledge-graph.json`

Fix authored owners first, then rebuild generated outputs.

## Template Rules

Templates in `templates/` are optional scaffolds. They are not project facts and should not be copied verbatim into `docs/`.

Use a template only after `memory-policy.md` identifies a real owner, scope, evidence, authority, status, retrieval path, and validation path. Remove placeholders, fake examples, sample commands, sample paths, and unused headings before a document becomes durable.

## Skills

Starter skills managed by upstream are listed in `manifest.json` under `starterSkills`. Project-local skills may be added under `.agents/skills/` and should have evals under `.agents/evals/skills/`.

Skill rules:

- One skill directory per skill.
- Each skill must have `SKILL.md`.
- Skills are procedural. They may point to docs, but they must not own durable project facts.
- Skill evals cover trigger and non-trigger boundaries.

## Commands

- `npm run knowledge:build`: rebuild generated indexes.
- `npm run knowledge:doctor`: validate config, core paths, docs, skills, and evals.
- `npm run knowledge:check`: verify generated files are fresh and run doctor.

## Portability Rules

- No product-specific facts in `.agents/knowledge-core/`.
- No project-specific facts in generic skills.
- No hidden memory writes.
- No hardcoded local machine paths.
- Project-specific paths and extensions belong in `.agents/knowledge.config.json`.
- `.context/` is runtime scratch space, not project knowledge.
- `legacy/` is inactive archive material, not active project knowledge.
- Obsidian, MCP, vector search, graph databases, and database-backed memory are optional adapters, not core requirements.
