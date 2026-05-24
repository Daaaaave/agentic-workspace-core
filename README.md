# Agentic Workspace Core

[![npm version](https://img.shields.io/npm/v/agentic-workspace-core.svg)](https://www.npmjs.com/package/agentic-workspace-core)
[![CI](https://github.com/Daaaaave/agentic-workspace-core/actions/workflows/ci.yml/badge.svg)](https://github.com/Daaaaave/agentic-workspace-core/actions/workflows/ci.yml)

Agentic Workspace Core is a portable workspace layer for coding agents.

It gives a repository one shared agent entrypoint, a small durable knowledge system, starter skills, generated indexes, handoff conventions, and validation scripts. The goal is simple: agents should work from inspectable files in the repo instead of hidden chat memory, stale prompts, or tool-specific rule sprawl.

It is not an agent runtime, framework, vector database, or required Obsidian vault. It is a repository-native base you install into projects and keep in version control.

## Why This Exists

Agent work gets messy when every tool has its own instructions, project knowledge lives in chat history, generated context becomes trusted as truth, and future agents rediscover the same decisions or mistakes.

This package installs a clean structure for:

- `AGENTS.md` as the authoritative instruction entrypoint.
- `docs/` as durable project knowledge.
- `.agents/skills/` as reusable agent procedures.
- `llms.txt` and `.agents/generated/*` as generated navigation, not policy.
- `.context/handoffs/` as ignored temporary transfer state.
- local scripts that rebuild and validate the knowledge layer.

## Quick Start

Run from the root of the repository where agents will work:

```bash
npx agentic-workspace-core@latest init --dry-run
npx agentic-workspace-core@latest init
npm run knowledge:check
```

`init` does not require a package-level confirmation flag. If npm asks to download the package for `npx`, confirm npm's prompt once.

## Important: `0.1.x` Install Mode

`0.1.x` is intentionally replace-first. It is best for controlled projects where you want a clean Agentic Workspace Core layer.

Managed paths that may be replaced:

- `AGENTS.md`
- `CLAUDE.md`
- `.agents/`
- `docs/`
- `llms.txt`

Before replacement, `init` moves existing agent-facing context into root `legacy/` with original relative paths preserved. That includes old instruction files, existing `.agents/`, existing `docs/`, old `llms*.txt` indexes, common AI-tool rule/config directories, and MCP config files. `update` also moves known obsolete agent-facing paths from earlier package layouts into `legacy/`. `legacy/` is ignored by git and is not treated as active project knowledge.

Use the dry run first on existing repositories.

## Update

```bash
npx agentic-workspace-core@latest update --dry-run
npx agentic-workspace-core@latest update
npm run knowledge:check
```

`update` requires an existing install. It:

- runs a baseline `knowledge:check` unless skipped
- replaces core-managed files and upstream starter skills
- preserves project-specific skill directories and evals
- preserves safe local config extensions
- moves obsolete agent-facing paths from older package layouts into `legacy/`
- always rebuilds generated indexes

`--skip-check` still rebuilds `llms.txt` and `.agents/generated/*`; it only skips validation checks.

For controlled projects where you want the package payload reapplied from scratch, use full update:

```bash
npx agentic-workspace-core@latest update --full --dry-run
npx agentic-workspace-core@latest update --full
```

`update --full` archives the current core layer into `legacy/` and then reinstalls `AGENTS.md`, `CLAUDE.md`, `.agents/`, `docs/`, and `llms.txt` from the package payload. This is the explicit reinstall path for early `0.1.x` projects when you want stale local agent memory, old docs skeletons, or customized core files out of the active context.

## What Gets Installed

```text
AGENTS.md
CLAUDE.md
llms.txt
.agents/
  knowledge.config.json
  generated/
  knowledge-core/
  skills/
  evals/skills/
docs/
  architecture/
  components/
  decisions/
  domain/
  glossary/
  plans/
  reference/
  research/
  runbooks/
  workflows/
.context/handoffs/   # ignored
legacy/              # ignored, created only when old agent context is archived
```

## Starter Skills

- `project-knowledge`: recall, route, write, correct, and validate durable repository knowledge.
- `research-to-knowledge`: source-backed research and research persistence.
- `software-development-workflow`: non-trivial coding work from task contract through verified completion.
- `write-agent-skill`: skill creation, revision, security review, and evals.
- `write-agent-handoff`: temporary transfer state for another agent, workspace, or future session.

## Project Commands

Installed projects get:

```bash
npm run knowledge:build
npm run knowledge:doctor
npm run knowledge:check
```

- `knowledge:build` regenerates `llms.txt` and `.agents/generated/*`.
- `knowledge:doctor` validates docs, skills, evals, config, and core paths.
- `knowledge:check` verifies generated files are current and runs the doctor.

## Design Rules

- Authored Markdown is the source of truth.
- Generated files are navigation only.
- Skills are procedural and do not own durable project facts.
- Handoffs are temporary and ignored by git.
- Memory writes require owner, evidence, scope, lifecycle status, freshness, retrieval aliases, and safety checks.
- Optional adapters such as Obsidian, vector search, MCP, graph databases, or SQL databases must not become hidden sources of truth unless a project explicitly chooses that contract.

## Package Maintainers

The publishable runtime payload lives under `payload/`. Source validation runs against that payload in the installed-project shape.

```bash
npm run knowledge:check
npm run smoke
npm run release:check
```

`release:check` runs knowledge validation, CLI smoke tests, and a dry-run package inspection before publishing. Releases are published to npm through GitHub Releases and the `Publish` workflow.

## Status

`0.1.x` is a hardening line with replace-first `init` and `update` contracts. Safer adoption and provenance-aware merge workflows are planned for `0.2.0`.
