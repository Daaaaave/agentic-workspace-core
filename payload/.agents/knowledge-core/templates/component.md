<!--
Starter template: component.

Use as project-specific scaffolding only. Do not treat this template as policy,
evidence, or text to copy verbatim.

Before committing an instantiated doc:
- replace all placeholders
- remove this comment
- remove sections and rows that do not apply
- use real project evidence; leave unknowns in Open Questions
- list durable source anchors, not every file
- keep status: draft until owner, boundary, evidence, and verification are known
- do not include secrets, private data, raw logs, or temporary task state
-->
---
id: REPLACE.WITH.STABLE.ID
type: component
status: draft
owner: project
summary: REPLACE with one sentence describing the component boundary this document owns.
canonical_for:
  - REPLACE.WITH.COMPONENT.NAME.OR.ALIAS
depends_on:
  - REPLACE.OR.REMOVE
related:
  - REPLACE.OR.REMOVE
code_refs:
  - REPLACE/OR/REMOVE
verified_by:
  - REPLACE OR REMOVE
source_refs:
  - REPLACE OR REMOVE
last_reviewed: YYYY-MM-DD
---

# Component Name

## Purpose

- Component owned:
- Why it exists:
- Main users or callers:
- Detail owned elsewhere:

## Use When

- A change touches this component's behavior, public surface, data, config, dependencies, or operations.
- A bug appears locally but the likely owner is this shared component.
- Future agents need source anchors, interfaces, invariants, and checks for this component.

## Do Not Use When

- The topic is whole-system architecture, only an API contract, only a data model, only deployment, only security, or temporary task state.
- The boundary is not evidenced by code, config, tests, accepted decisions, or owner review.

## Identity And Ownership

| Field | Value |
| --- | --- |
| Component kind | REPLACE |
| Architecture parent | REPLACE |
| Runtime/deployment unit | REPLACE |
| Primary source root | REPLACE |
| Public entrypoint(s) | REPLACE |
| Main consumers | REPLACE |
| Main dependencies | REPLACE |
| Owner | REPLACE |
| Lifecycle status | draft/current/deprecated/superseded/archived |

## Boundary

- In scope:
- Out of scope:
- Upstream callers:
- Downstream dependencies:
- Sibling components:
- Things this component must never own:

## Source Anchors

| Path Or Symbol | Role | Why It Matters | Verification Or Test |
| --- | --- | --- | --- |
| REPLACE | REPLACE | REPLACE | REPLACE |

## Responsibilities And Invariants

| Responsibility Or Invariant | Owned Here? | Evidence | Notes |
| --- | --- | --- | --- |
| REPLACE | yes/no/partial | REPLACE | REPLACE |

## Interfaces

| Interface | Provided Or Consumed | Owner | Compatibility Notes | Evidence |
| --- | --- | --- | --- | --- |
| REPLACE | provided/consumed | REPLACE | REPLACE | REPLACE |

## Data, Config, And Security

| Area | Current Rule Or Link | Owner |
| --- | --- | --- |
| Data and state | REPLACE OR REMOVE | REPLACE OR REMOVE |
| Configuration | REPLACE OR REMOVE | REPLACE OR REMOVE |
| Secrets | REPLACE OR REMOVE | REPLACE OR REMOVE |
| Trust boundary | REPLACE OR REMOVE | REPLACE OR REMOVE |

## Runtime Behavior

| Flow | Trigger | Main Path | Failure Or Recovery Behavior | Evidence |
| --- | --- | --- | --- | --- |
| REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE |

## Verification

| Behavior Or Invariant | Verification | Command Or Path | Freshness Risk |
| --- | --- | --- | --- |
| REPLACE | REPLACE | REPLACE | low/medium/high |

## Operations

- Local development:
- Deploy or release impact:
- Observability:
- Rollback or recovery:
- Known incident triggers:

## Change Notes

- Local change is enough when:
- Widen scope when:
- Consistency sweep needed for:
- Review required for:

## Related Knowledge

- Architecture:
- APIs:
- Data model:
- Deployment:
- Environment and secrets:
- Security boundaries:
- Decisions:
- Runbooks:
- Plans:

## Open Questions

| Question | Impact | Owner | Resolution Path |
| --- | --- | --- | --- |
| REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE |
