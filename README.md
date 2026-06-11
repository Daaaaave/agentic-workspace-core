# Agentic Workspace Core

[![npm version](https://img.shields.io/npm/v/agentic-workspace-core.svg)](https://www.npmjs.com/package/agentic-workspace-core)
[![CI](https://github.com/Daaaaave/agentic-workspace-core/actions/workflows/ci.yml/badge.svg)](https://github.com/Daaaaave/agentic-workspace-core/actions/workflows/ci.yml)

Repository-native memory and workflow infrastructure for coding agents.

Agentic Workspace Core installs a shared `AGENTS.md`, durable project knowledge in `docs/`, reusable agent skills, generated `llms.txt` navigation, handoff conventions, and validation scripts. It keeps agent context inspectable, versioned, and reviewable instead of scattering project memory across hidden chats, stale prompts, and tool-specific rule files.

It is not an agent runtime, framework, vector database, or Obsidian vault. It is a portable core layer you install into a repository so Codex, Claude Code, and other coding agents can work from the same project-native source of truth.

## Why Use It

Use Agentic Workspace Core when you want agents to:

- start from one clear repository instruction entrypoint: `AGENTS.md`
- remember project facts through reviewed Markdown docs, not chat history
- use focused skills for software development, frontend UI, research, handoffs, skill authoring, and project knowledge
- rebuild generated navigation instead of trusting stale generated context
- archive old agent rules and memory files into `legacy/` before replacing them
- keep every install, update, and memory change visible in git

## Quick Start

Run from the root of the repository where agents will work:

```bash
npx agentic-workspace-core@latest init --dry-run
npx agentic-workspace-core@latest init
npm run knowledge:check
```

`init --dry-run` prints the exact files that would be created, replaced, or archived. Use it first on existing repositories.

Do not clone this GitHub repository into the target project. Install through the npm CLI so the package places its managed files at the project root.

If the working directory is uncertain, resolve the repository root explicitly:

```bash
repo_root="$(git rev-parse --show-toplevel)"
npx agentic-workspace-core@latest init --target "$repo_root" --dry-run
npx agentic-workspace-core@latest init --target "$repo_root"
```

## Install Behavior

`init` is a clean core install. It may replace these managed paths:

- `AGENTS.md`
- `CLAUDE.md`
- `.agents/`
- `docs/`
- `llms.txt`

Before replacement, existing agent-facing files are moved into root `legacy/` with their relative paths preserved. This includes old instruction files, `.agents/`, `docs/`, `llms*.txt`, common AI-tool rules/config directories, and MCP config files. `legacy/` is ignored by git and is not treated as active project knowledge.

This replace-first install model is deliberate: the package creates a clean active agent layer, while keeping old material available for manual review and recovery.

## Update

```bash
npx agentic-workspace-core@latest update --dry-run
npx agentic-workspace-core@latest update
npm run knowledge:check
```

Normal `update` requires an existing install. It:

- replaces `AGENTS.md`, `CLAUDE.md`, `.agents/knowledge-core/`, and upstream starter skill/eval files
- preserves project docs under `docs/`
- preserves project-specific skill directories and evals
- preserves safe local `.agents/knowledge.config.json` extensions
- archives obsolete agent-facing paths from older package layouts into `legacy/`
- rebuilds `llms.txt` and `.agents/generated/*`
- runs doctor validation unless `--skip-check` is used

Installed projects also get:

```bash
npm run awc:update:check
```

That command runs `agentic-workspace-core@latest update --if-newer`; it no-ops when the installed core is current and applies the normal update path when a newer package is available.

For controlled projects where you want the package payload reapplied from scratch:

```bash
npx agentic-workspace-core@latest update --full --dry-run
npx agentic-workspace-core@latest update --full
```

`update --full` archives the current core layer into `legacy/` and reinstalls `AGENTS.md`, `CLAUDE.md`, `.agents/`, `docs/`, and `llms.txt` from the package payload.

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
legacy/              # ignored, created only when old agent context is archived
```

`.context/handoffs/` is also reserved and ignored for temporary handoff state. It is created only when a handoff workflow needs it.

## Starter Skills

- `software-development-workflow`: non-trivial coding work from task contract through verified completion.
- `frontend-ui-workflow`: frontend/UI build, redesign, polish, review, product-appropriate design taste, design-system consistency, accessibility, responsive behavior, and visual verification.
- `project-knowledge`: recall, route, write, correct, and validate durable repository knowledge.
- `research-to-knowledge`: source-backed research and research persistence.
- `write-agent-skill`: skill creation, revision, security review, and evals.
- `write-agent-handoff`: temporary transfer state for another agent, workspace, or future session.

## Project Commands

Installed projects get:

```bash
npm run knowledge:build
npm run knowledge:doctor
npm run knowledge:check
npm run awc:update:check
```

- `knowledge:build` regenerates `llms.txt` and `.agents/generated/*`.
- `knowledge:doctor` validates docs, skills, evals, config, and core paths.
- `knowledge:check` verifies generated files are current and runs the doctor.
- `awc:update:check` checks for a newer Agentic Workspace Core package and updates when needed.

## Design Rules

- Authored Markdown is the source of truth.
- Generated files are navigation only.
- Skills are procedural and do not own durable project facts.
- Handoffs are temporary and ignored by git.
- Memory writes require owner, evidence, scope, lifecycle status, freshness, retrieval aliases, and safety checks.
- Optional adapters such as Obsidian, vector search, MCP, graph databases, or SQL databases must not become hidden sources of truth unless a project explicitly chooses that contract.

## Requirements

- Node.js 20 or newer.
- npm/npx.
- Git is strongly recommended so install and update diffs are reviewable.

## Support

Open bugs, install/update problems, and package design proposals in [GitHub Issues](https://github.com/Daaaaave/agentic-workspace-core/issues).

## Package Maintainers

The publishable runtime payload lives under `payload/`. Source validation runs against that payload in the installed-project shape.

```bash
npm run knowledge:check
npm run smoke
npm run release:check
```

`release:check` runs knowledge validation, CLI smoke tests, and a dry-run package inspection before publishing. Releases are published to npm through GitHub Releases and the `Publish` workflow.

## License

MIT.

## Status

`0.2.x` is the current public hardening line. The core is usable today, with a deliberately explicit install/update model and active hardening around agent memory, skills, generated indexes, and update safety.
