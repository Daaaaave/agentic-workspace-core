# Agent Instructions

This repository is the Agentic Workspace Core source project.

## Entrypoints

- `AGENTS.md` is the authoritative instruction file for coding agents.
- `llms.txt` is a generated knowledge index, not an instruction file.
- `docs/index.md` is the human-readable knowledge home.
- `.agents/README.md` explains the agent layer.
- `.agents/knowledge-core/README.md` explains the portable knowledge core.
- `.agents/knowledge-core/agent-memory-policy.md` governs memory reads, writes, corrections, consolidation, deletion, and trust.

## Knowledge Rules

- Durable project knowledge belongs in `docs/`.
- Agent skills belong in `.agents/skills/` and must stay procedural.
- Skill evals belong in `.agents/evals/skills/`.
- Runtime handoffs belong in `.context/handoffs/`.
- Generated files must be rebuilt, not edited as canonical sources.
- Do not scan `.context/` as project knowledge unless the task explicitly involves handoffs or runtime artifacts.
- Candidate memories must pass `.agents/knowledge-core/agent-memory-policy.md` before becoming durable.

## Working Protocol

- Before non-trivial work that may depend on project conventions, architecture, workflows, decisions, domain terms, or known gotchas, use the `project-knowledge` skill if available.
- For external/current/source-backed research, use `research-to-knowledge`.
- For creating or changing skills, use `write-agent-skill`.
- For temporary transfer state, use `write-agent-handoff`.
- If no relevant durable knowledge exists, say so and fall back to code, tests, and user-provided facts.

## Maintenance

- After authored docs change, run `npm run knowledge:build`.
- Before finishing knowledge-core work, run `npm run knowledge:check`.
- Keep `llms.txt` and `docs/generated/*` generated.
