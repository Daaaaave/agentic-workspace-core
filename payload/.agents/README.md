# Agent Layer

This directory contains portable agent-facing project infrastructure.

## Layout

- `knowledge.config.json` configures repository-local knowledge paths and policy.
- `knowledge-core/` contains the portable core specification, schemas, templates, and scripts.
- `skills/` contains portable procedural agent skills.
- `evals/` contains lightweight skill trigger checks.

## Entrypoints

- `AGENTS.md` is the behavior and workflow entrypoint for coding agents.
- `CLAUDE.md` is a Claude Code proxy that imports `AGENTS.md` instead of duplicating instructions.
- `llms.txt` is a generated knowledge index for scoped reading.
- `docs/index.md` is the human-readable knowledge home.
- `.agents/knowledge-core/README.md` is the portable core specification.
- `.agents/knowledge-core/manifest.json` is the machine-readable core manifest.
- `.agents/knowledge.config.json` adapts the core to this repository.

## Rules

- Keep project facts in `docs/`, not in skills.
- Keep skills procedural and scoped.
- Keep generated artifacts out of authored source-of-truth content.
- Treat `.context/` as runtime scratch space, not project knowledge.
- Keep config changes small and root-relative.

## Starter Skills

- `project-knowledge`: durable repository knowledge work.
- `research-to-knowledge`: source-backed research and research persistence.
- `software-development-workflow`: non-trivial coding work from task contract through verified completion.
- `write-agent-skill`: skill creation, revision, security review, and evals.
- `write-agent-handoff`: temporary cross-agent transfer state.

## Commands

- `npm run knowledge:build`: rebuild generated indexes.
- `npm run knowledge:doctor`: validate authored docs, skills, evals, config, and core paths.
- `npm run knowledge:check`: verify generated files are fresh and run doctor.
