---
id: project.knowledge-system
type: policy
status: current
owner: project
summary: Repository-local policy for using Agentic Workspace Core's portable knowledge system.
canonical_for:
  - project.knowledge-system
depends_on:
  - project.index
code_refs:
  - AGENTS.md
  - CLAUDE.md
  - .agents/knowledge.config.json
  - .agents/knowledge-core/README.md
  - .agents/knowledge-core/memory-taxonomy.md
  - .agents/knowledge-core/agent-memory-policy.md
  - .agents/knowledge-core/scripts/lib/core.mjs
  - .agents/knowledge-core/scripts/build-index.mjs
  - .agents/knowledge-core/scripts/doctor.mjs
verified_by:
  - npm run knowledge:check
last_reviewed: 2026-05-24
---

# Knowledge System

This repository uses Agentic Workspace Core as a repository-native knowledge and agent workflow layer.

## Contract

- `AGENTS.md` owns agent behavior and workflow instructions.
- `CLAUDE.md` is a Claude Code proxy that imports `AGENTS.md`; it must not duplicate shared rules.
- `docs/` owns durable project knowledge.
- `.agents/skills/` owns reusable agent procedures.
- `.agents/evals/skills/` owns lightweight skill trigger checks.
- `.context/handoffs/` owns temporary transfer state only.
- `llms.txt` and `docs/generated/*` are generated retrieval aids.

## Authoring Rules

- Every authored knowledge doc needs valid frontmatter from `.agents/knowledge-core/schema.md`.
- Candidate memories should be classified with `.agents/knowledge-core/memory-taxonomy.md` before they become durable.
- Candidate memories must pass `.agents/knowledge-core/agent-memory-policy.md` before agents write, correct, consolidate, delete, or trust them.
- Every durable topic should have one canonical owner through `canonical_for`.
- Prefer updating an existing owner over creating a parallel doc.
- Mark uncertain or incomplete knowledge as `draft`.
- Preserve useful history through `deprecated`, `superseded`, or `archived` instead of deleting context.
- Use `project` frontmatter only for repository-local metadata outside the portable core.

## Skill Rules

- Skills teach procedure, not project facts.
- Every concrete skill needs `SKILL.md` and an eval under `.agents/evals/skills/`.
- Optional skill directories must not be empty and must be explicitly routed from `SKILL.md`.
- Tool permissions stay disabled by default unless audited and enabled in config.

## Generated Files

Generated files are not canonical:

- `llms.txt`
- `docs/generated/knowledge-map.md`
- `docs/generated/knowledge-graph.json`

Regenerate them with:

```bash
npm run knowledge:build
```

Validate the whole knowledge core with:

```bash
npm run knowledge:check
```

## Portability

The portable core should stay free of product-specific facts. Project-specific knowledge belongs in `docs/`; project-specific configuration belongs in `.agents/knowledge.config.json` under `project` when the portable schema has no dedicated field.
