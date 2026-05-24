# Changelog

## Unreleased

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

## 0.1.0

- Initial private extraction of Agentic Workspace Core.
- Added portable knowledge core, schemas, templates, scripts, starter skills, and lightweight skill evals.
- Added generated `llms.txt`, knowledge map, and knowledge graph.
