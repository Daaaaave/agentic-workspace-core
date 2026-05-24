# Agentic Workspace Core

Portable, repository-native foundation for agent memory, project knowledge, skills, handoffs, evals, and validation.

This project is intentionally not an agent framework, runtime, vector database, or mandatory Obsidian vault. It is a small shared base that can be copied into repositories so humans and agents can work from the same inspectable source of truth.

## What It Provides

Publishable runtime files live under `payload/`. The public repository intentionally tracks only the package source, installer payload, smoke test, and public package docs; local dogfooding files such as root `.agents`, `AGENTS.md`, `llms.txt`, generated root docs, and working research are ignored.

- `AGENTS.md`: authoritative instruction entrypoint for coding agents.
- `CLAUDE.md`: Claude Code compatibility proxy that imports `AGENTS.md`.
- `llms.txt`: generated compact navigation map, not an instruction file.
- `.agents/knowledge-core/`: portable schema, taxonomy, lifecycle, routing, policies, templates, and scripts.
- `.agents/skills/`: reusable procedural skills for agents.
- `.agents/evals/skills/`: lightweight trigger and boundary checks for skills.
- `docs/`: durable authored knowledge.
- `docs/generated/`: generated maps and graph artifacts.
- `.context/handoffs/`: ignored runtime transfer state.

## Current Starter Skills

- `project-knowledge`: recall, route, write, maintain, and validate durable repository knowledge.
- `research-to-knowledge`: turn source-backed research into recommendations or durable research docs.
- `software-development-workflow`: route non-trivial coding work through scope, context, implementation, debugging, security, and done gates.
- `write-agent-skill`: create, revise, secure, and evaluate procedural agent skills.
- `write-agent-handoff`: write temporary transfer state for another agent, workspace, or future session.

## Commands

Source-repository validation uses `payload/`, but validates it in the installed repository shape. Runtime scripts in `payload/.agents/knowledge-core/scripts/` keep downstream semantics.

```bash
npm run knowledge:build
npm run knowledge:doctor
npm run knowledge:check
```

`knowledge:build` regenerates `payload/llms.txt`, `payload/docs/generated/knowledge-map.md`, and `payload/docs/generated/knowledge-graph.json`.

`knowledge:check` verifies generated files are current and runs the doctor against a temporary install-shaped copy of `payload/`.

## Install Into Another Repository

Run the initializer from the target repository:

```bash
npm exec -- agentic-workspace-core@latest init
```

Current private `init` mode is intentionally simple: it replaces Agentic Workspace Core managed paths such as `AGENTS.md`, `CLAUDE.md`, `.agents/`, `docs/index.md`, `docs/knowledge-system.md`, and generated indexes. It updates `package.json` scripts and ensures `.context/` and `CLAUDE.local.md` are ignored instead of replacing unrelated project files.

Preview the write plan first:

```bash
npm exec -- agentic-workspace-core@latest init --dry-run
```

Update an installed repository with the private update contract:

```bash
npm exec -- agentic-workspace-core@latest update --dry-run
npm exec -- agentic-workspace-core@latest update
```

`update` requires an existing Agentic Workspace Core install, runs `npm run knowledge:check` before replacement, then replaces managed core paths and starter skills, structured-updates `.agents/knowledge.config.json`, preserves project-specific skill directories/evals and safe local config extensions, and rebuilds generated indexes.

## Design Rules

- Authored Markdown is the source of truth.
- Generated files are navigation only.
- Skills are procedural and do not own durable project facts.
- Handoffs are temporary and ignored by git.
- Memory writes require owner, evidence, scope, lifecycle status, freshness, retrieval aliases, and safety checks.
- Optional adapters such as Obsidian, vector search, MCP, graph databases, or SQL databases must not become hidden source-of-truth layers unless a project explicitly chooses that contract.
- The core portability contract lives in `docs/reference/core-portability-contract.md`.
- Source-repository dogfooding notes, research logs, generated root indexes, handoffs, and runtime state are local-only unless deliberately promoted into `payload/` or public package docs.

## Repository Status

This repository is currently pre-public and private while the core contract, adapter contract, and validation layer are being hardened.
