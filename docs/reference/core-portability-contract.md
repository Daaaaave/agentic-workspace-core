---
id: core.portability-contract
type: policy
status: current
owner: project
summary: Contract for installing, updating, overriding, generating, and versioning Agentic Workspace Core in downstream repositories.
canonical_for:
  - core.portability-contract
  - core-portability
  - install-contract
  - update-contract
  - local-overrides
  - generated-files-contract
  - breaking-change-policy
depends_on:
  - project.index
related:
  - project.knowledge-system
code_refs:
  - AGENTS.md
  - CLAUDE.md
  - README.md
  - CHANGELOG.md
  - package.json
  - .gitignore
  - payload/
  - .agents/README.md
  - .agents/knowledge.config.json
  - .agents/knowledge-core/README.md
  - .agents/knowledge-core/manifest.json
  - .agents/knowledge-core/scripts/build-index.mjs
  - .agents/knowledge-core/scripts/doctor.mjs
  - bin/agentic-workspace-core.mjs
verified_by:
  - npm run knowledge:check
  - npm run smoke
  - npm run release:check
source_refs:
  - https://code.claude.com/docs/en/memory
  - https://developers.openai.com/codex/guides/agents-md
  - https://agents.md/
  - https://semver.org/spec/v2.0.0.html
  - https://keepachangelog.com/en/1.1.0/
  - https://www.rfc-editor.org/info/rfc8174
  - https://kubernetes.io/docs/reference/using-api/deprecation-policy/
  - https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template
  - https://copier.readthedocs.io/en/stable/generating/
  - https://copier.readthedocs.io/en/stable/updating/
  - https://docs.npmjs.com/cli/v11/configuring-npm/package-json
  - https://docs.npmjs.com/trusted-publishers
  - https://docs.npmjs.com/generating-provenance-statements
  - https://docs.github.com/en/actions/tutorials/publish-packages/publish-nodejs-packages
  - https://www.writethedocs.org/guide/docs-as-code/
  - https://diataxis.fr/
  - https://www.12factor.net/config
  - https://docs.github.com/en/get-started/git-basics/ignoring-files
last_reviewed: 2026-05-24
---

# Core Portability Contract

This is the canonical contract for installing, updating, locally adapting, and versioning Agentic Workspace Core in downstream repositories.

The key words `MUST`, `MUST NOT`, `SHOULD`, `SHOULD NOT`, and `MAY` are normative when written in uppercase, following BCP 14 convention.

## Contract

- The upstream core owns portable behavior, schemas, policy, scripts, templates, and starter skills.
- A downstream repository owns its project docs, project-local config, custom skills, public-facing docs, and runtime state.
- Generated files are derived navigation aids. They are useful to commit by default, but they are never canonical.
- Installs and updates MUST leave reviewable repository diffs.
- Updates MUST preserve downstream project knowledge, custom skills, runtime state, and unrelated project files.
- Runtime state and local scratch belong under `.context/**` or another ignored location, never in durable project memory.
- Adapter-specific sync behavior is out of scope. Obsidian, MCP, vector, graph, and database integrations need a separate adapter contract.
- The private `0.1.x` initializer is replace-first for managed core paths. This is a deliberate simplification, not the final public update model.

## Public Surface

The public surface is the set of paths and behaviors downstream projects may rely on:

- entrypoints: `AGENTS.md`, `CLAUDE.md`, `llms.txt`, `docs/index.md`, `.agents/README.md`
- config and inventory: `.agents/knowledge.config.json`, `.agents/knowledge-core/manifest.json`
- validation schemas: `.agents/knowledge-core/schemas/*.json`
- core policy specs: `.agents/knowledge-core/*.md`
- command behavior for `npm run knowledge:build`, `npm run knowledge:doctor`, and `npm run knowledge:check`
- template filenames under `.agents/knowledge-core/templates/`
- starter skill names and broad trigger boundaries
- generated output paths configured by `.agents/knowledge.config.json`
- `.context/handoffs/` as ignored runtime handoff state

The authoritative path inventory is `.agents/knowledge-core/manifest.json`. Do not duplicate that inventory in prose unless the contract itself changes.

## Release Artifact

The npm package is an installer payload, not a copy of the source repository. Publishable runtime files and structured-update fragments live under `payload/`; source-repository research, generated root indexes, and active development context stay outside that tree.

The npm package MUST include the CLI, `payload/`, public package docs, and any source validation scripts referenced by published `package.json` scripts.

`payload/` owns the exact downstream install source tree:

- `payload/AGENTS.md`
- `payload/CLAUDE.md`
- `payload/gitignore` as the ignore-rule fragment appended or created as target `.gitignore`
- `payload/llms.txt`
- `payload/docs/index.md`
- `payload/docs/knowledge-system.md`
- `payload/docs/generated/**`
- `payload/docs/<default-section>/.gitkeep`
- `payload/.agents/knowledge.config.json`
- `payload/.agents/README.md`
- `payload/.agents/knowledge-core/**`
- `payload/.agents/skills/**`
- `payload/.agents/evals/**`

`payload/AGENTS.md`, `payload/CLAUDE.md`, `payload/docs/index.md`, and `payload/docs/knowledge-system.md` are the files `init` copies into the user's repository root.

The source repository may expose `payload/.agents` through a local ignored root `.agents` symlink or compatibility mirror for dogfooding. The canonical publishable copy is `payload/`. Runtime scripts inside `payload/.agents/knowledge-core/scripts/` MUST keep downstream installed-repository semantics; source-repository validation MUST use a source-side harness when payload layout differs from installed paths.

The public source repository SHOULD track only files required to build, inspect, test, and publish the package:

- package metadata such as `package.json`
- CLI and test code such as `bin/**` and `scripts/**`
- release automation such as `.github/workflows/**`
- `payload/**`
- public package docs such as `README.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, `SECURITY.md`, `LICENSE`, and selected `docs/reference/**`

Root dogfooding state SHOULD stay ignored and untracked:

- root `.agents`
- root `AGENTS.md` and `CLAUDE.md`
- root `llms.txt`
- root `docs/generated/**`
- root `docs/research/**`
- `.context/**`

The npm package SHOULD NOT include source-repository working context as root package files:

- the source repo root `AGENTS.md` or root `CLAUDE.md`
- the source repo root `llms.txt` or generated knowledge maps
- internal research notes under `docs/research/**`
- development-only helpers that are not referenced by published package scripts
- `.context/**`, local handoffs, logs, dumps, screenshots, or scratch files

If an artifact teaches downstream runtime behavior, put it in `payload/`. If it only explains why this source repository changed, keep it in the source repository and outside `package.json` `files`.

## Install

There are three supported install shapes:

- **Template bootstrap:** one-shot copy into a new repository. It does not create an automatic update relationship.
- **Existing repository install:** merge the core into an existing repository on a reviewable branch.
- **Package or scripted install:** copy or merge the core through a package/tool while preserving review and ownership rules.

Current private initializer:

```bash
npm exec -- agentic-workspace-core@latest init
```

`init` replaces managed core paths:

- `AGENTS.md`
- `CLAUDE.md`
- `.agents/README.md`
- `.agents/knowledge.config.json`
- `.agents/knowledge-core/**`
- `.agents/skills/**`
- `.agents/evals/**`
- `docs/index.md`
- `docs/knowledge-system.md`
- `llms.txt`
- `docs/generated/**`

`init` does not replace unrelated project files. It updates `package.json` scripts as structured JSON and ensures `.context/` and `CLAUDE.local.md` are ignored instead of replacing the entire `package.json` or `.gitignore`.

Install rules for this private phase:

- `AGENTS.md`, `CLAUDE.md`, and managed core paths MAY be replaced by `init`.
- Project files outside the managed path set MUST NOT be overwritten.
- Project docs outside `docs/index.md`, `docs/knowledge-system.md`, and `docs/generated/**` MUST NOT be overwritten by install tooling.
- In private `0.1.x`, `init` replaces the whole `.agents/skills/**` and `.agents/evals/**` starter layer. Existing project skills should be moved aside before init if they must be retained.
- Installers MUST create or preserve ignore rules for `.context/**` and Claude Code local memory (`CLAUDE.local.md`) when `CLAUDE.md` is installed.
- Installers MUST NOT read secrets, create hidden memory, or mutate unrelated project files.
- After install, run `npm run knowledge:build` and `npm run knowledge:check`.

## Ownership

Use ownership classes instead of exhaustive file lists:

| Class | Owner | Rule |
| --- | --- | --- |
| Upstream core | Source repository | `.agents/knowledge-core/**` and starter skill/eval behavior update from upstream unless explicitly forked. |
| Replace-managed surface | Upstream core | Private `init` replaces `AGENTS.md`, `CLAUDE.md`, `.agents/README.md`, `.agents/knowledge.config.json`, `.agents/knowledge-core/**`, `.agents/skills/**`, `.agents/evals/**`, `docs/index.md`, and `docs/knowledge-system.md`. |
| Starter skill surface | Upstream core | `update` replaces only starter skill directories and matching eval files named in `.agents/knowledge-core/manifest.json`. |
| Structured update surface | Upstream plus downstream | `.agents/knowledge.config.json`, `package.json` scripts, and `.gitignore` ignore rules are updated narrowly instead of whole-file replacement during `update`. |
| Downstream project knowledge | Downstream repository | `docs/**` content is project-owned after install. Upstream updates must not replace it. |
| Custom procedural layer | Downstream repository | Project-specific skills and evals are project-owned and must be preserved by `update`. |
| Generated navigation | Build output | `llms.txt` and `docs/generated/**` are rebuilt, not hand-edited. |
| Runtime-local state | Current workspace/session | `.context/**`, logs, dumps, browser state, and scratch files are ignored and non-canonical. |

When ownership is unclear, preserve the downstream file and require explicit review.

## Update

Core updates are allowed only as reviewable repository changes.

Current private updater:

```bash
npm exec -- agentic-workspace-core@latest update
```

Private `update` replaces core-managed entrypoints, `.agents/knowledge-core/**`, and starter skill/eval files. Local edits inside those managed paths are not preserved in `0.1.x`, but project-specific skill directories and eval files that are not named starter skills are preserved.

`.agents/knowledge.config.json` is structured-updated instead of replaced during `update`. The package snapshot remains authoritative for schema version, core identity, entrypoints, canonical paths, generated output paths, validation defaults, skills defaults, and core policy defaults. The downstream project keeps safe local config extensions:

- `project`
- additional `documents.defaultDirectories`
- additional `ignore.paths`
- additional `ignore.authoredDocs`

1. Require an existing Agentic Workspace Core install.
2. Read current and target `.agents/knowledge-core/manifest.json` versions.
3. Show a reviewable update plan.
4. Run `npm run knowledge:check` before replacement unless `--skip-check` or `--allow-broken` is set.
5. Replace managed core paths from the package snapshot.
6. Structured-update `.agents/knowledge.config.json` and create any configured default doc directories.
7. Update `package.json` scripts and `.gitignore` narrowly.
8. Preserve project files outside the managed path set, including custom skill directories and evals not listed as starter skills.
9. Reset and rebuild `docs/generated/**` and `llms.txt`.
10. Run doctor validation unless `--skip-check` is set.
11. Review the final diff, especially `AGENTS.md`, `CLAUDE.md`, schema, policy, config, generated outputs, and starter skill trigger boundaries.

An update is not complete until generated files are fresh and doctor passes.

## Generated Files

- Authored docs and config are the source of truth.
- `llms.txt` and `docs/generated/**` MUST be rebuilt instead of hand-edited.
- Generated files MUST identify themselves as generated.
- Generated files MUST NOT introduce agent behavior rules that are absent from authoritative sources.
- If generated output conflicts with authored docs or policy, fix the authored source and rebuild.
- Installers and updaters SHOULD regenerate generated files after downstream docs/config are present.

Projects MAY choose not to commit generated files only if they preserve equivalent navigation and freshness checks in config, docs, and validation. The default core contract commits them.

## Local Overrides

Allowed extension points:

- project facts and decisions under `docs/**`
- custom skills under `.agents/skills/<project-skill>/` with matching evals
- project-local config under `.agents/knowledge.config.json` `project`
- additional `.agents/knowledge.config.json` `documents.defaultDirectories` and ignore lists
- personal Claude Code preferences in ignored `CLAUDE.local.md`
- stack-specific docs directories when config and validation are updated together
- local-only ignore patterns in `.git/info/exclude`
- temporary state under `.context/**`

Local overrides MUST NOT:

- add arbitrary top-level config keys
- store project facts in `.agents/knowledge-core/**` or generic starter skills
- store secrets, tokens, private data, or runtime state as durable memory
- treat generated indexes, adapter output, vector hits, graph neighborhoods, logs, issues, or transcripts as canonical truth
- weaken trust, safety, validation, or generated-file rules without an explicit accepted policy change

## Versioning

Agentic Workspace Core follows Semantic Versioning for its public surface once it reaches `1.0.0`.

Before `1.0.0`, breaking changes may occur, but every breaking or migration-relevant change SHOULD be documented in `CHANGELOG.md` and SHOULD include migration notes when downstream installs could exist.

A change is breaking when a downstream repository that followed the previous contract can no longer install, update, validate, or rely on the public surface without manual migration.

Breaking changes include:

- removing or renaming stable entrypoints, configured generated outputs, schemas, templates, or required scripts
- changing `CLAUDE.md` so it no longer imports `AGENTS.md` as the shared instruction source
- changing `.agents/knowledge.config.json` required top-level shape
- adding required schema fields without default or migration
- changing `doctor.mjs` so an existing valid project fails
- changing generated output shape in a way downstream tools cannot read
- removing starter skills or materially changing their trigger boundaries
- requiring network access, external services, hidden state, credentials, or non-local tools for default validation
- weakening or invalidating memory trust, write, correction, deletion, or generated-file policy

Not breaking by default:

- adding optional fields, templates, warnings, docs directories, or generated metadata
- improving wording without changing behavior
- fixing implementation to match this contract
- regenerating indexes from authored source changes

## Deprecation And Migration

Public-surface deprecations SHOULD name the replacement in `CHANGELOG.md` and docs. Doctor SHOULD warn when deprecated surfaces are detected and detection is practical.

Breaking changes MUST include migration notes with affected versions, affected paths, replacement behavior, manual or automated steps, validation command, and rollback or abort guidance when practical.

## Validation

Before declaring an install or update successful:

- `npm run knowledge:build` has run when authored docs, config, or core files changed.
- `npm run knowledge:check` passes.
- `npm run smoke` passes in the source repository when installer/updater/package behavior changed.
- `npm run release:check` passes before publish.
- `npm pack --dry-run` shows only install payload, starter skills/evals, public package docs, and required npm metadata.
- Generated changes follow authored source changes.
- No `.context/**`, `.env*`, logs, secrets, or local dumps are committed.
- `CLAUDE.local.md` is ignored and not committed.
- Project files outside the managed path set were preserved.
- Any replaced managed paths are visible in the final diff.
- Any public-surface behavior change is reflected in `CHANGELOG.md`.
- Any breaking change has migration notes.

## Open Questions

- Whether `0.2.0` should keep replace-first `init`, add a non-destructive `adopt` workflow, or move to a provenance-aware merge updater.
- Whether `0.2.0` should add provenance-aware merge support for downstream edits to starter skills.
- Whether `doctor.mjs` should enforce release artifact checks before `0.2.0`.
