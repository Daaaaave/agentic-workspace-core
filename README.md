# Agentic Workspace Core

A portable workspace layer for coding agents.

Agentic Workspace Core gives a software repository a shared agent instruction file, a small durable knowledge system, starter skills, handoff conventions, generated indexes, and validation scripts. It is meant for projects where humans and agents need to work from the same reviewable source of truth.

It is not an agent runtime, framework, vector database, or mandatory Obsidian vault. It is a repository-native base you install into a project and keep in version control.

## Why Use It

- Give coding agents one authoritative entrypoint: `AGENTS.md`.
- Keep durable project knowledge in `docs/` instead of chat history.
- Separate project facts from reusable agent procedures in `.agents/skills/`.
- Give agents a default development workflow for scope, context, implementation, debugging, security, and done checks.
- Keep temporary handoffs in ignored `.context/handoffs/`.
- Validate the knowledge layer with local scripts before trusting it.

## Install In Your Project

Run from the root of the project where agents will work:

```bash
npx agentic-workspace-core@latest init --dry-run
npx agentic-workspace-core@latest init
npm run knowledge:check
```

`init` itself does not require a confirmation flag. If npm asks to download the temporary package, confirm the npm prompt once.

`init` is intentionally replace-first in `0.1.x`. Review the dry run before applying it when installing into an existing repository.

Managed paths that may be replaced:

- `AGENTS.md`
- `CLAUDE.md`
- `.agents/`
- `docs/`
- `llms.txt`

Before replacement, `init` moves existing agent-facing files, old project docs, generated LLM indexes, and agent tool rules/config into root `legacy/`. The installer also updates `package.json` scripts and ensures `.context/`, `CLAUDE.local.md`, and `legacy/` are ignored. It does not replace unrelated source code or product files.

## Update An Installed Project

```bash
npx agentic-workspace-core@latest update --dry-run
npx agentic-workspace-core@latest update
npm run knowledge:check
```

`update` requires an existing Agentic Workspace Core install. It runs a baseline `knowledge:check`, replaces core-managed files and starter skills, preserves project-specific skill directories/evals, preserves safe local config extensions, and rebuilds generated indexes.

## What Gets Installed

- `AGENTS.md`: authoritative instruction entrypoint for coding agents.
- `CLAUDE.md`: Claude Code proxy that imports `AGENTS.md`.
- `llms.txt`: generated compact navigation map, not an instruction file.
- `.agents/knowledge-core/`: schemas, policy, taxonomy, templates, lifecycle, routing, and scripts.
- `.agents/skills/`: starter procedural skills for agents.
- `.agents/evals/skills/`: lightweight skill trigger and boundary checks.
- `docs/`: durable project knowledge home and starter directories.
- `docs/generated/`: generated knowledge map and graph.
- `.context/handoffs/`: ignored runtime handoff location.

## Legacy Archive

On `init`, existing agent-facing context is moved into root `legacy/` before the clean core is installed. Paths keep their original relative location under `legacy/` with no package or timestamp wrapper.

This includes old `AGENTS.md`/`CLAUDE.md`/`GEMINI.md`/`CODEX.md` style files, existing `.agents/`, existing `docs/`, old `llms*.txt` indexes, generic `AI.md`/`MEMORY.md` style files, and common tool-specific rule/config surfaces such as `.claude/`, `.codex/`, `.cursor/`, `.cursorignore`, `.windsurf/`, `.codeiumignore`, `.github/instructions/`, `.github/copilot-instructions.md`, `.vscode/instructions/`, `.vscode/mcp.json`, `.continue/`, `.clinerules*`, `.roo/`, `.roomodes`, `.roorules*`, `.aider*`, `.augment/`, `.devin/`, `.opencode/`, `.goose/`, `.openhands/`, `.jules/`, `.kiro/`, `.kilocode/`, `.factory/`, `.amp/`, `.warp/`, `.qwen/`, `.junie/`, `.aiassistant/`, and MCP config files.

`legacy/` is preserved for manual review, but ignored by git and not treated as active project knowledge. Promote only verified, current material back into `docs/` or project-specific `.agents/skills/`.

## Starter Skills

- `project-knowledge`: recall, route, write, maintain, and validate durable repository knowledge.
- `research-to-knowledge`: source-backed research and research persistence.
- `software-development-workflow`: non-trivial coding work from task contract through verified completion.
- `write-agent-skill`: skill creation, revision, security review, and evals.
- `write-agent-handoff`: temporary transfer state for another agent, workspace, or future session.

## Project Commands

Installed projects get these npm scripts:

```bash
npm run knowledge:build
npm run knowledge:doctor
npm run knowledge:check
```

- `knowledge:build` regenerates `llms.txt` and `docs/generated/*`.
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

This source repository keeps the publishable runtime payload under `payload/`. Source validation runs against that payload in the installed-project shape.

```bash
npm run knowledge:check
npm run smoke
npm run release:check
```

`release:check` runs knowledge validation, CLI smoke tests, and a dry-run package inspection before publishing.

## Status

`0.1.x` is a hardening line with replace-first `init` and `update` contracts for controlled installs. Safer adoption and provenance-aware merge workflows are planned for `0.2.0`.
