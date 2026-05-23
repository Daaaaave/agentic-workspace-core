# Agentic Workspace Core

Portable, repository-native foundation for agent memory, project knowledge, skills, handoffs, evals, and validation.

This project is intentionally not an agent framework, runtime, vector database, or mandatory Obsidian vault. It is a small shared base that can be copied into repositories so humans and agents can work from the same inspectable source of truth.

## What It Provides

- `AGENTS.md`: authoritative instruction entrypoint for coding agents.
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
- `write-agent-skill`: create, revise, secure, and evaluate procedural agent skills.
- `write-agent-handoff`: write temporary transfer state for another agent, workspace, or future session.

## Commands

```bash
npm run knowledge:build
npm run knowledge:doctor
npm run knowledge:check
```

`knowledge:build` regenerates `llms.txt`, `docs/generated/knowledge-map.md`, and `docs/generated/knowledge-graph.json`.

`knowledge:check` verifies generated files are current and runs the doctor.

## Design Rules

- Authored Markdown is the source of truth.
- Generated files are navigation only.
- Skills are procedural and do not own durable project facts.
- Handoffs are temporary and ignored by git.
- Memory writes require owner, evidence, scope, lifecycle status, freshness, retrieval aliases, and safety checks.
- Optional adapters such as Obsidian, vector search, MCP, graph databases, or SQL databases must not become hidden source-of-truth layers unless a project explicitly chooses that contract.

## Repository Status

This repository is currently pre-public and private while the core contract, adapter contract, and validation layer are being hardened.
