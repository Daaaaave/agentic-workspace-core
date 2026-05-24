# Knowledge Routing

Use this file when deciding where information belongs. Use `memory-taxonomy.md` first when the memory kind, scope, evidence, or lifetime is unclear. Use `agent-memory-policy.md` before writing, correcting, consolidating, deleting, or trusting memory. If information fits multiple rows, choose the most durable applicable destination.

| Information | Destination | Rule |
| --- | --- | --- |
| Durable project fact | `docs/` | Must have one canonical owner document. |
| Architecture, domain, workflow, API, database, or component knowledge | `docs/` | Use document type/frontmatter from `schema.md`. |
| Accepted or proposed decision | `docs/decisions/` or another configured docs path | Use `type: decision`. |
| Operational procedure | `docs/runbooks/` or another configured docs path | Use `type: runbook`. |
| Research that should be retained | `docs/research/` or another configured docs path | Use `type: research`; cite `source_refs` when applicable. |
| Multi-step durable implementation plan | `docs/plans/` or another configured docs path | Use `type: plan`; do not use for tiny todos. |
| Agent procedure | `.agents/skills/` | Skills are procedural and should not own durable project facts. |
| Skill trigger examples | `.agents/evals/skills/` | Add only for concrete skills. |
| Cross-agent temporary handoff | `.context/handoffs/` | Temporary state only; promote durable conclusions to `docs/`. |
| Generated knowledge index | Configured generated paths | Rebuild from authored docs; do not edit as canonical knowledge. |
| Runtime artifact, screenshot, dump, browser state, local scratch | `.context/` or another ignored runtime path | Do not treat as project memory. |
| Personal/private note | Outside the repository | Promote only reviewed durable conclusions. |
| Project-local extension setting | `.agents/knowledge.config.json` under `project` | Do not add arbitrary top-level config keys. |
| Stack-specific preset | Future preset layer | Keep out of portable core by default. |

Do not duplicate canonical facts across multiple authored documents.

Do not scan `.context/` as project knowledge unless the task explicitly involves handoffs or runtime artifacts.

When in doubt, write less and link to the canonical owner.
