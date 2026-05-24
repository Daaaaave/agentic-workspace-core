# Knowledge Lifecycle

Knowledge should move through explicit states before it becomes durable project memory. Use `memory-taxonomy.md` to classify the memory kind, scope, evidence, and owner before choosing a lifecycle status. Use `agent-memory-policy.md` to decide whether an agent is allowed to write, correct, consolidate, delete, or trust the memory.

1. Session observation
2. Handoff, research note, or plan
3. Canonical document, decision, or runbook
4. Review
5. Deprecation, supersession, or archival

Unreviewed session state is not project memory.

## Status Model

Use statuses from `schema.md`:

- `draft`: incomplete or unreviewed authored knowledge.
- `proposed`: a decision or policy is being proposed.
- `active`: a plan is currently being executed.
- `current`: durable project knowledge is valid now.
- `accepted`: a decision or policy has been accepted.
- `completed`: a plan or research note is finished.
- `deprecated`: the document is retained but discouraged.
- `superseded`: the document has a replacement and must set `superseded_by`.
- `archived`: the document is retained only for history.

## Typical Transitions

General knowledge:

```txt
draft -> current -> deprecated -> archived
draft -> current -> superseded
```

Decisions:

```txt
proposed -> accepted -> superseded
proposed -> archived
accepted -> deprecated
```

Plans:

```txt
draft -> active -> completed
draft -> archived
active -> superseded
```

Research:

```txt
draft -> completed
completed -> archived
completed -> superseded
```

Policies:

```txt
draft -> proposed -> accepted
draft -> current
accepted -> deprecated
accepted -> superseded
```

Runbooks and canonical knowledge:

```txt
draft -> current
current -> deprecated
current -> superseded
current -> archived
```

## Promotion Rule

Only promote findings into durable docs after they have a clear owner, summary, canonical topic, and review date.

If the finding is temporary coordination state, use `.context/handoffs/` instead.

If a finding changes an existing canonical topic, update the current owner document instead of creating a parallel one.
