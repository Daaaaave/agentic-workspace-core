# Agentic Knowledge Core

Portable scaffold for repository-native agent knowledge.

Read first:
- `schema.md` defines durable document frontmatter.
- `lifecycle.md` defines how knowledge becomes durable.
- `routing.md` defines where each kind of information belongs.
- `memory-taxonomy.md` defines how candidate memory is classified before storage.
- `agent-memory-policy.md` defines what agents may read, write, trust, correct, consolidate, and delete.
- `skills.md` defines the skills layer contract.

Core primitives:
- Authored project knowledge lives in `docs/`.
- Procedural agent skills live in `.agents/skills/` when added.
- Runtime transfer state lives in `.context/handoffs/`.
- Machine-readable indexes are generated from authored documents.
- `AGENTS.md` owns agent instructions; `llms.txt` owns the compact generated knowledge map.

This core is intentionally project-agnostic.

## Design Basis

The core follows these conventions:
- `AGENTS.md` is the predictable instruction file for coding agents.
- `llms.txt` is a compact generated map of useful knowledge, not an instruction file.
- Agent Skills use one directory per skill with a required `SKILL.md`.
- Decisions use a lightweight ADR/MADR-inspired shape.
- Authored knowledge stays in version-controlled Markdown; derived indexes are regenerated.

## Roles

| Role | Path | Authored | Purpose |
| --- | --- | --- | --- |
| Agent instructions | `AGENTS.md` | Yes | Behavior rules, workflow guidance, and pointers to the knowledge system. |
| Knowledge index | `llms.txt` | No | Generated compact map for scoped reading. |
| Core config | `.agents/knowledge.config.json` | Yes | Project adapter for paths, document policy, and generated outputs. |
| Core package | `.agents/knowledge-core/` | Yes | Portable specification, schemas, templates, and scripts. |
| Skills | `.agents/skills/` | Yes | Procedural knowledge for agents. |
| Skill evals | `.agents/evals/skills/` | Yes | Lightweight trigger checks for skills. |
| Authored docs | `docs/` | Yes | Durable project knowledge. |
| Generated docs | `docs/generated/` | No | Machine-built maps and graph artifacts. |
| Runtime handoffs | `.context/handoffs/` | No | Temporary cross-agent transfer state. |

## Stable Paths

```txt
AGENTS.md
llms.txt
.agents/README.md
.agents/knowledge.config.json
.agents/knowledge-core/README.md
.agents/knowledge-core/manifest.json
.agents/knowledge-core/schema.md
.agents/knowledge-core/lifecycle.md
.agents/knowledge-core/routing.md
.agents/knowledge-core/memory-taxonomy.md
.agents/knowledge-core/agent-memory-policy.md
.agents/knowledge-core/skills.md
.agents/knowledge-core/schemas/document.schema.json
.agents/knowledge-core/schemas/config.schema.json
.agents/knowledge-core/schemas/skill.schema.json
.agents/knowledge-core/templates/
.agents/knowledge-core/scripts/lib/core.mjs
.agents/knowledge-core/scripts/build-index.mjs
.agents/knowledge-core/scripts/doctor.mjs
.agents/skills/
.agents/evals/skills/
docs/index.md
docs/knowledge-system.md
docs/generated/knowledge-map.md
docs/generated/knowledge-graph.json
.context/handoffs/
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
- `docs/generated/knowledge-map.md`
- `docs/generated/knowledge-graph.json`

Agents should rebuild generated files instead of treating them as canonical sources.

## Config

`.agents/knowledge.config.json` adapts the core to a repository. It should stay small, root-relative, and project-agnostic by default.

Do not add arbitrary top-level config keys. Put local extensions under `project`.

Keep stack-specific ignores, such as build folders or dependency caches, out of the portable core unless they are added by a project-local preset.

## Skills

Skills are part of the v0 surface area, but every concrete skill needs a clear trigger boundary and eval coverage.

Skill rules:
- One skill directory per skill.
- Each concrete skill must have `SKILL.md`.
- Skills are procedural. They may point to docs, but they should not own durable project facts.
- Skill evals live under `.agents/evals/skills/`.
- Optional skill directories must not be empty and must be routed from `SKILL.md`.

## Required Templates

- `canonical-doc.md`
- `decision.md`
- `runbook.md`
- `research.md`
- `plan.md`
- `handoff.md`
- `skill.md`
- `skill-eval.md`

Templates are examples of shape, not mandatory filenames for project docs.

## Required Scripts

- `build-index.mjs`: regenerate `llms.txt`, `knowledge-map.md`, and `knowledge-graph.json`.
- `doctor.mjs`: validate the knowledge structure.
- `lib/core.mjs`: shared parser, path, ignore, and document collection helpers used by the scripts.

Scripts must be safe to run locally and must not require network access.

## Portability Rules

- No product-specific facts in `.agents/knowledge-core/`.
- No project-specific facts in generic skills.
- No hardcoded app/package paths in core scripts.
- Project-specific paths and extensions belong in `.agents/knowledge.config.json`.
- `.context/` is runtime scratch space and should not be treated as project knowledge.
- Obsidian, MCP, vector search, and graph databases are optional adapters, not core requirements.

## Non-Goals

The core does not provide:
- A vector database.
- A mandatory Obsidian vault.
- Automatic hidden memory writes.
- A custom agent runtime.
- A replacement for code search, tests, or review.
