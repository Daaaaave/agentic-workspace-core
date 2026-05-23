# Project Memory Taxonomy

This taxonomy defines how portable project memory should be classified before it is stored, retrieved, promoted, updated, or discarded. Use `agent-memory-policy.md` for the permission and safety rules that govern those operations.

It is intentionally storage-light. The core keeps durable memory in version-controlled Markdown and generated indexes. Vector search, temporal graphs, Obsidian, MCP, and database-backed memory can be added later as adapters.

## Design Basis

The taxonomy combines practices from:

- cognitive memory categories used by agent frameworks: semantic, episodic, and procedural memory
- docs-as-code: authored Markdown as inspectable, versioned source of truth
- ADR/MADR-style decision records: context, decision, consequences, lifecycle status
- Diataxis-style documentation separation: task, reference, explanation, and learning needs are different
- modern agent memory systems: explicit scope, temporal validity, retrieval strategy, update policy, and agent permissions
- Agent Skills: procedural memory loaded through progressive disclosure

## Core Rule

Every candidate memory item must answer seven questions before it is stored:

1. What kind of memory is this?
2. Who or what is it about?
3. Who is allowed to rely on it?
4. How long should it remain active?
5. What evidence supports it?
6. Where is its canonical owner?
7. How should agents retrieve and update it?

If these questions cannot be answered, do not make the item durable. Keep it in the current response, a handoff, or a draft.

## Memory Layers

| Layer | Purpose | Canonical Location | Write Policy | Retrieval Policy |
| --- | --- | --- | --- | --- |
| Working state | Current task progress, temporary blockers, next action | Current conversation or `.context/handoffs/` | Write only for transfer or resume. | Load only when resuming that task. |
| Episodic candidate memory | What happened, attempted approaches, failures, outcomes, user corrections | Current conversation or `.context/handoffs/` | Promote only distilled reusable lessons. | Search only when debugging, reviewing history, or crystallizing. |
| Semantic project memory | Current durable facts, architecture, domain concepts, APIs, constraints, invariants | `docs/` | Update the canonical owner; avoid duplicates. | Read before work that depends on project truth. |
| Decision memory | Chosen or proposed direction plus context and consequences | `docs/decisions/` or configured docs path | Append a new decision or supersede an old one when direction changes. | Read before changing affected design, policy, or implementation. |
| Operational procedure memory | Repeatable project operation performed by humans or agents | `docs/runbooks/` or configured docs path | Keep actionable, verified, and current. | Read when the trigger condition matches. |
| Research memory | Source-backed external findings and recommendations | `docs/research/` or configured docs path | Store synthesized conclusions and key sources, not raw link dumps. | Read when the same uncertainty, comparison, or external claim returns. |
| Plan memory | Durable multi-step implementation strategy larger than a todo | `docs/plans/` or configured docs path | Keep active while useful; complete, supersede, or archive later. | Read when continuing or evaluating that initiative. |
| Procedural agent memory | How agents perform repeatable workflows | `.agents/skills/` | Store procedure, not project facts. Require evals. | Load on demand through skill routing. |
| Generated retrieval aids | Maps, graphs, and compact indexes derived from authored knowledge | `llms.txt`, `docs/generated/*` | Rebuild only. Never edit as truth. | Use for navigation, then read authored owners. |
| External/private memory | Personal preferences, secrets, customer data, private notes | Outside the shared repository | Do not store in portable project memory. | Retrieve only from authorized private systems. |

## Memory Kind

Use memory kind to decide what the content means.

| Kind | Answers | Examples | Default Destination |
| --- | --- | --- | --- |
| Fact | What is true now? | "The deploy command is X." | Semantic doc |
| Invariant | What must remain true? | "All writes must pass through Y." | Architecture, policy, or domain doc |
| Interface contract | How do systems interact? | API shape, event schema, module boundary | API, integration, component, or reference doc |
| Decision | What did we choose and why? | Database choice, deployment strategy | Decision doc |
| Rationale | Why does current state exist? | Tradeoff, history, constraint | Decision or explanation section in owner doc |
| Procedure | How do we do it? | Deploy, rollback, rotate key, migrate DB | Runbook or skill, depending on actor |
| Workflow | How does repeated work move through stages? | Release flow, review flow, research flow | Workflow doc or skill |
| Research finding | What did sources support? | Tool comparison, best-practice review | Research doc |
| Glossary term | What does this word mean here? | Domain language, acronym, concept | Glossary or domain doc |
| Gotcha | What should future agents avoid rediscovering? | Non-obvious failure mode and fix | Owner doc, runbook, or decision |
| Rejected approach | What should not be retried without new evidence? | Failed implementation path | Decision, plan, or owner doc |
| Task state | What is happening right now? | In-progress edits, current blocker | Handoff, not durable docs |

## Scope

Use scope to decide who can rely on a memory and where it belongs.

| Scope | Meaning | Rule |
| --- | --- | --- |
| Project | Shared truth for this repository. | Store in `docs/` with canonical ownership. |
| Agent | Reusable way agents should work. | Store in `.agents/skills/` or `AGENTS.md`. |
| Team or organization | Shared beyond one repository. | Store only if the repository is the intended distribution point; otherwise link to external owner. |
| User or personal | Specific to one person. | Do not store in shared project memory. |
| Runtime | Specific to the current session, branch, workspace, or machine. | Keep in `.context/` or current response. |
| External source | Claimed by upstream docs, papers, repos, vendors, or forums. | Store as `source_refs` and synthesis, not as unsourced truth. |

Scope by concern first, not by storage technology. A "database decision for project X" is about the project's database concern, not about a generic decisions bucket alone.

## Time Model

Every durable memory has a time posture:

| Time Posture | Meaning | Handling |
| --- | --- | --- |
| Current | Valid now and expected to guide future work. | Use `status: current`, `accepted`, or equivalent type-specific status. |
| Proposed | Under review, not yet binding. | Use `status: proposed` for decisions/policies or `draft` for other docs. |
| Active | Being executed. | Use `status: active` for plans. |
| Completed | Research or plan has finished but remains useful. | Use `status: completed`. |
| Deprecated | Retained but discouraged. | Keep history and explain replacement or risk. |
| Superseded | Replaced by a specific owner. | Set `superseded_by`. |
| Archived | Historical only. | Keep out of active retrieval unless history is requested. |
| Volatile | Likely to change soon. | Add review triggers, source dates, and avoid strong claims. |

Do not make time-sensitive claims without absolute dates or `last_reviewed`.

## Evidence Model

Memory quality depends on evidence. Prefer directly inspectable evidence over confidence-sounding prose.

| Evidence | Strength | Use |
| --- | --- | --- |
| Code reference | Strong for current behavior. | Add `code_refs`; verify paths exist. |
| Test or command | Strong for reproducible behavior. | Add `verified_by`. |
| User decision | Strong for intent and priority. | Record as decision or policy with date. |
| External primary source | Strong for upstream/tool/vendor facts. | Add `source_refs`; include date checked when volatile. |
| External secondary source | Medium. | Use for context, not final authority. |
| Forum or anecdote | Weak. | Use as signal only; mark uncertainty. |
| Agent observation | Weak until verified. | Promote only after checking code, tests, user decision, or sources. |

When evidence conflicts, store the conflict rather than silently choosing the claim that sounds best.

## Canonical Ownership

Every durable topic should have one canonical owner.

Rules:

- Use `canonical_for` for stable concepts and search aliases.
- Update the existing owner when a topic changes.
- Create a new doc only when the topic boundary is distinct.
- Link related docs instead of copying the same fact.
- Use `depends_on` when reading one topic requires another.
- Use `related` for useful neighboring context.
- Use `supersedes` and `superseded_by` for lifecycle changes.

A memory item without an owner is not ready to become durable.

## Write Decision Matrix

| Candidate Memory | Store? | Destination | Notes |
| --- | --- | --- | --- |
| Current project fact with evidence | Yes | Existing semantic owner or new canonical doc | Prefer update over new doc. |
| Architectural/design choice | Yes | Decision doc | Include context, alternatives, consequences, status. |
| Repeatable project operation | Yes | Runbook | Include trigger, preconditions, verification, rollback. |
| Repeatable agent workflow | Yes | Skill plus eval | Keep procedural; no durable project facts. |
| External research conclusion | Yes, if reusable | Research doc or decision | Include sources and confidence. |
| Debugging lesson | Maybe | Owner doc/runbook/decision | Store only distilled reusable lesson. |
| Raw transcript or command output | Usually no | Handoff only if needed | Do not pollute durable docs. |
| Temporary branch/task progress | No durable store | `.context/handoffs/` | Expire when task is done. |
| Personal preference or secret | No | Outside repository | Never commit. |
| Generated index correction | No manual edit | Rebuild generated outputs | Fix authored source instead. |

## Promotion Path

Use this path for turning experience into memory:

```txt
observation
  -> handoff, research note, or plan when still unresolved
  -> canonical doc, decision, runbook, or skill when reusable and owned
  -> generated indexes after build
  -> review, deprecation, supersession, or archival over time
```

Promotion requires:

- durable value
- clear owner
- evidence
- retrieval aliases
- status
- `last_reviewed`
- no private or credential-like content

## Retrieval Rules

Agents should retrieve memory by need, not by bulk-loading everything.

1. Start with `llms.txt` for the compact map.
2. Use generated indexes only for navigation.
3. Read the smallest authored owner likely to change the task.
4. Follow only relevant `depends_on`, `related`, `source_refs`, `code_refs`, and lifecycle links.
5. Stop when more reading is unlikely to change the next action.

Procedural memory should load through skills. Semantic memory should load through canonical docs. Temporary state should load only when resuming or coordinating.

## Anti-Patterns

- Storing chat transcripts as project memory.
- Treating generated indexes as canonical truth.
- Creating a new doc for every lesson instead of updating owners.
- Splitting one topic across many small overlapping docs.
- Hiding durable facts inside skills.
- Hiding agent procedure inside project docs.
- Treating vector similarity, graph edges, or popularity as evidence.
- Saving personal/private preferences into shared repository docs.
- Keeping outdated docs active because deletion feels risky.
- Recording what happened without the reusable conclusion.

## Adapter Guidance

Adapters may add richer retrieval without changing the taxonomy:

- Obsidian can improve human navigation, backlinks, canvases, and local note workflows.
- Vector search can improve fuzzy recall over large authored corpora.
- Temporal knowledge graphs can model facts that become true and false over time.
- MCP servers can expose memory to external agents and tools.
- Databases can add permissions, sync, and query performance for teams.

Adapters must not become hidden source-of-truth layers. The portable core remains inspectable, versioned, and rebuildable from authored files unless a project explicitly chooses a stronger storage contract.

## Source References

- https://docs.langchain.com/oss/python/deepagents/memory
- https://developers.llamaindex.ai/python/framework/module_guides/deploying/agents/memory/
- https://docs.crewai.com/en/concepts/memory
- https://github.com/mem0ai/mem0
- https://github.com/getzep/graphiti
- https://github.com/letta-ai/letta
- https://github.com/campfirein/byterover-cli
- https://github.com/neo4j-labs/agent-memory
- https://agentskills.io/
- https://github.com/anthropics/skills
- https://github.com/obra/superpowers
- https://github.com/kepano/obsidian-skills
- https://diataxis.fr/
- https://github.com/adr/madr
- https://github.com/architecture-decision-record/architecture-decision-record
- https://txt-llms.com/documentation
