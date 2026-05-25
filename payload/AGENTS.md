# Agent Instructions

This repository uses Agentic Workspace Core.

## Operating Model

- Treat `AGENTS.md` as the always-on orientation for coding agents in this repository.
- `CLAUDE.md` is a Claude Code compatibility proxy that imports this file.
- Use `llms.txt` as generated navigation for finding knowledge, rather than as instructions or canonical truth.
- Use the matching skill when available; skill descriptions own detailed triggers for project knowledge, coding workflow, source-backed research, skill authoring, and handoffs.
- Read deeper core files only when they can affect the current task.

## Knowledge Model

- Durable project knowledge belongs in `docs/`.
- Generated navigation lives in `llms.txt` and `.agents/generated/*`; update authored sources and rebuild generated outputs.
- Runtime transfer state belongs in `.context/handoffs/`.
- Pre-install archived material belongs in `legacy/`.
- Agent procedures belong in `.agents/skills/`; trigger checks belong in `.agents/evals/skills/`.
- Candidate durable memories pass through `.agents/knowledge-core/memory-policy.md` before becoming project knowledge.

## Core Routing

- Use `.agents/knowledge-core/memory-policy.md` for memory reads and writes, routing, trust, correction, consolidation, deletion, lifecycle, templates, generated outputs, handoffs, legacy archive, and adapters.
- Use `.agents/knowledge-core/document-schema.md` when creating or updating authored docs in `docs/`.
- Use `.agents/knowledge-core/skill-contract.md` when creating or updating skills or skill evals.

## Work Rhythm

- Before non-trivial work, check whether repository knowledge could change the answer.
- For implementation, repair, refactor, review, or testing work, follow the matching development workflow when available.
- For current external claims or best-practice comparisons, gather source-backed evidence before relying on memory.
- If no relevant durable knowledge exists, state that and proceed from code, tests, current sources, and user-provided facts.
- When a reusable project fact changes, route it through the memory policy before making it durable.

## Completion

- Before finishing non-trivial work, check whether a durable project fact, decision, workflow, runbook, invariant, reusable gotcha, or user correction changed; if so, route it through the memory policy, and if not, do not write memory.
- Rebuild generated indexes after authored knowledge changes: `npm run knowledge:build`.
- Run `npm run knowledge:check` before finishing authored-doc, knowledge-core, schema, skill, or generated-index work.
