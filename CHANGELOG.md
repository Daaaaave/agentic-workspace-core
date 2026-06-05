# Changelog

## Unreleased

No unreleased changes.

## 0.2.0 - 2026-06-05

- Added `frontend-ui-workflow` as a starter skill for frontend/UI build, redesign, polish, review, design-system consistency, accessibility, responsive behavior, and visual verification.
- Added eval coverage for frontend/UI routing, design-system drift, reference handling, product-appropriate visual direction, runtime verification, and neighboring-skill boundaries.
- Added the frontend/UI skill to the portable skill manifest, README starter-skill list, and smoke payload completeness checks.

## 0.1.10 - 2026-05-25

- Added a CLI guard that refuses `init` or `update` targets inside `.context`, preventing accidental installation into runtime scratch space.
- Clarified README install guidance so agents use the npm CLI instead of cloning the GitHub repository into target projects.
- Added smoke coverage for the `.context` target guard.

## 0.1.9 - 2026-05-25

- Tightened `project-knowledge` recall, stale generated navigation, and knowledge-gap handling so agents avoid noisy recall announcements, distrust stale generated indexes, and stop on risky missing-owner cases.
- Clarified memory policy authority, draft retention, stale generated navigation, and adapter write rules.
- Updated `AGENTS.md` completion guidance to require `knowledge:check` after authored-doc work.

## 0.1.8 - 2026-05-25

- Clarified the project knowledge skill's read and retrieval flow so agents use generated navigation as a locator, rank authored owners by evidence, and report knowledge gaps instead of bulk-reading or inventing missing process.
- Clarified memory policy boundaries between policy, operating workflow, external research, handoffs, and procedural skills.
- Added compact `docs/` directory routing and overlap rules to the memory policy.
- Added eval coverage for finding a canonical deployment process without reading every document.

## 0.1.7 - 2026-05-24

- Added `update --full` as an explicit full reinstall path that archives the current core layer and reapplies the package payload.
- Added smoke coverage proving full update replaces `AGENTS.md`, `CLAUDE.md`, `.agents/`, `docs/`, `llms.txt`, and local config with clean payload state while preserving archived copies in `legacy/`.

## 0.1.6 - 2026-05-24

- Changed `update` to archive known obsolete agent-facing paths into `legacy/` instead of leaving stale package docs active or deleting old managed paths.
- Added guarded cleanup for obsolete package-owned `docs/index.md` and `docs/knowledge-system.md` documents so they no longer remain in `llms.txt` after update.
- Added smoke coverage proving update cleanup archives obsolete paths and rebuilds indexes without stale package docs.

## 0.1.5 - 2026-05-24

- Changed `--skip-check` so install/update still rebuild generated indexes and only skips validation checks.
- Added smoke coverage proving `update --skip-check` refreshes stale `llms.txt` and `.agents/generated/*` for local authored docs.

## 0.1.4 - 2026-05-24

- Consolidated the portable knowledge core around `memory-policy.md`, `document-schema.md`, and `skill-contract.md`.
- Moved generated knowledge artifacts from `docs/generated/` to `.agents/generated/` and removed redundant public agent/doc indexes.
- Simplified `AGENTS.md`, knowledge-core documentation, project-knowledge routing, and generated navigation for agent-first usage.
- Added compact knowledge-gap handling so agents stop or ask instead of inventing missing runbooks, architecture owners, dependency behavior, or operational process.
- Updated install/update cleanup and smoke coverage for obsolete managed paths from earlier package layouts.

## 0.1.3 - 2026-05-24

- Simplified install/update commands so `agentic-workspace-core init` and `update` no longer require a package-level `--yes` flag.
- Added root `legacy/` archiving during `init` for existing docs, managed core paths, generated LLM indexes, and common agent/tool instruction or rules files before installing the clean core layer, preserving original relative paths without timestamp/package wrapper directories.
- Added `legacy/` to installed ignore rules and knowledge ignore paths so archived material is preserved but not treated as active project knowledge.
- Expanded CLI smoke coverage for legacy archiving and active-surface cleanup.

## 0.1.2 - 2026-05-24

- Reworked the README around public project onboarding, install/update safety, and package maintainer workflow.
- Removed the source-only core portability contract from the public repository and npm package surface.
- Reduced the npm package surface to the CLI, install payload, README, changelog, license, and package metadata.

## 0.1.1 - 2026-05-24

- Updated security policy and release notes to reflect the public npm/GitHub release state.
- Removed personal author metadata from `package.json`.
- Replaced personal copyright holder text with a contributors copyright holder.

## 0.1.0 - 2026-05-24

- Added a concise core portability contract covering install, update, local override, generated-file, and breaking-change rules.
- Added an `agentic-workspace-core init` CLI for private replace-first installation of managed core paths.
- Added an `agentic-workspace-core update` CLI for private updates of managed core paths while preserving project-specific skill directories/evals and safe local knowledge config extensions.
- Added a source-repository CLI smoke test for `init`, `update`, and local override preservation in a temporary repository.
- Added a managed `CLAUDE.md` proxy for Claude Code compatibility without duplicating `AGENTS.md`.
- Added a `software-development-workflow` starter skill with six routed references and overlap eval coverage for non-trivial coding tasks.
- Added source-backed research documenting why the default coding workflow is one top-level skill instead of several overlapping lifecycle skills.
- Added an explicit npm package file whitelist for release-surface review.
- Restricted the public source surface to package code, installer payload, public docs, and smoke tests; root dogfooding state is now local-only.
- Added source-only payload doctor harness so packaged runtime doctor behavior stays downstream-specific.
- Added public npm package metadata, release checks, and packed-package script coverage.
- Added GitHub Actions CI for knowledge validation, CLI smoke tests, package dry-run inspection, and packed install verification.
- Added GitHub Actions npm publish workflow using provenance-capable publishing.

- Initial private extraction of Agentic Workspace Core.
- Added portable knowledge core, schemas, templates, scripts, starter skills, and lightweight skill evals.
- Added generated `llms.txt`, knowledge map, and knowledge graph.
