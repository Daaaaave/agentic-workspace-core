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
- `AGENTS.md` owns agent instructions; `CLAUDE.md` is only a Claude Code proxy; `llms.txt` owns the compact generated knowledge map.

This core is intentionally project-agnostic.

## Design Basis

The core follows these conventions:
- `AGENTS.md` is the predictable instruction file for coding agents.
- Tool-specific instruction proxies should import `AGENTS.md` instead of duplicating it.
- `llms.txt` is a compact generated map of useful knowledge, not an instruction file.
- Agent Skills use one directory per skill with a required `SKILL.md`.
- Decisions use a lightweight ADR/MADR-inspired shape.
- Authored knowledge stays in version-controlled Markdown; derived indexes are regenerated.

## Roles

| Role | Path | Authored | Purpose |
| --- | --- | --- | --- |
| Agent instructions | `AGENTS.md` | Yes | Behavior rules, workflow guidance, and pointers to the knowledge system. |
| Claude Code proxy | `CLAUDE.md` | Yes | Imports `AGENTS.md` so Claude Code reads the same shared instructions. |
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
CLAUDE.md
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

Skills are part of the v0 surface area, but every concrete skill needs a clear trigger boundary and eval coverage. Starter skills managed by upstream are listed in `manifest.json` under `starterSkills`; update tooling uses that list to avoid replacing project-specific skills.

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

## Template Use Rules

Templates are scaffolds, not project knowledge.

- Use a template only after the memory write gate identifies a real owner, scope, evidence, authority, status, retrieval path, and validation path.
- Adapt the template to the project. Keep, remove, rename, or reorder sections based on the actual knowledge being captured.
- Do not copy a template verbatim into `docs/`.
- Do not preserve placeholder text, fake paths, fake commands, fake owners, sample diagrams, or example IDs in an authored doc.
- Do not treat a template section as mandatory just because it exists. Omit sections that would invite speculation or unsupported claims.
- Do not treat template text as evidence. Project docs need evidence from code, tests, user decisions, accepted decisions, runbooks, external sources, or verification commands.
- If only part of a template applies, use only that part.
- If no template fits, write a smaller document that satisfies the schema and memory policy.
- Keep new docs `draft` until the project-specific facts are filled in and evidence is sufficient for `current`, `accepted`, `active`, or `completed` status.
- A generated index, search hit, or copied template is never a canonical owner by itself.

Template placeholders should be obvious and should fail normal document validation if copied without replacement.

## Starter Templates

Starter templates provide optional scaffolding for common project knowledge topics. They should remain in `.agents/knowledge-core/templates/` until explicitly instantiated as project-specific authored docs.

- `api-contract.md`
- `architecture-overview.md`
- `component.md`
- `data-model.md`
- `deployment-runbook.md`
- `development-workflow.md`
- `environment-and-secrets.md`
- `security-boundaries.md`

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
