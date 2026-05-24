<!--
Starter template: architecture overview.

Use as project-specific scaffolding only. Do not treat this template as policy,
evidence, or text to copy verbatim.

Before committing an instantiated doc:
- replace all placeholders
- remove this comment
- remove sections and rows that do not apply
- use real project evidence; leave unknowns in Open Questions
- link to dedicated component, API, data, deployment, security, decision, plan, or runbook docs when they own detail
- keep status: draft until owner, scope, evidence, and verification are known
- do not include secrets, private data, raw logs, or temporary task state
-->
---
id: REPLACE.WITH.STABLE.ID
type: architecture
status: draft
owner: project
summary: REPLACE with one sentence describing the architecture boundary this document owns.
canonical_for:
  - REPLACE.WITH.SEARCHABLE.TOPIC
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

# Architecture Overview

## Purpose

- System or subsystem owned:
- Readers:
- Architecture questions this answers:
- Detail owned elsewhere:

## Use When

- A change crosses component, API, data, deployment, security, or integration boundaries.
- A new contributor or agent needs the shortest reliable map of the current system.
- Code, docs, generated artifacts, or decisions disagree about architecture.

## Do Not Use When

- The topic is one component, API contract, data model, deployment procedure, security boundary, decision, or temporary task state.
- The architecture is not evidenced by code, config, tests, accepted decisions, or owner review.

## Authority And Freshness

| Claim Type | Owner Or Source | Verification | Freshness Risk |
| --- | --- | --- | --- |
| System boundary | REPLACE | REPLACE | low/medium/high |
| Runtime units | REPLACE | REPLACE | low/medium/high |
| Data ownership | REPLACE | REPLACE | low/medium/high |
| External integrations | REPLACE | REPLACE | low/medium/high |
| Deployment shape | REPLACE | REPLACE | low/medium/high |
| Security boundaries | REPLACE | REPLACE | low/medium/high |

## Scope And Context

- In scope:
- Out of scope:
- Primary users, callers, or actors:
- Neighboring systems:
- External services:
- Owned data or resources:
- Non-owned dependencies:

## Architecture Map

| Element | Kind | Responsibility | Owner | Source Or Evidence |
| --- | --- | --- | --- | --- |
| REPLACE | app/service/package/database/queue/external/other | REPLACE | REPLACE | REPLACE |

## Diagram Sources

| Diagram Or View | Authored Source | Generated Output | Review Rule |
| --- | --- | --- | --- |
| REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE |

## Invariants

| Invariant | Applies To | Why It Matters | Verification |
| --- | --- | --- | --- |
| REPLACE | REPLACE | REPLACE | REPLACE |

## Runtime Flows

| Flow | Trigger | Main Path | Failure Or Recovery Behavior | Evidence |
| --- | --- | --- | --- | --- |
| REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE |

## Data, Interfaces, And Deployment

| Area | Current Shape | Owner Or Link |
| --- | --- | --- |
| Data and state | REPLACE | REPLACE |
| APIs and integrations | REPLACE | REPLACE |
| Deployment/runtime | REPLACE | REPLACE |
| Cross-cutting constraints | REPLACE | REPLACE |

## Decisions, Risks, And Tradeoffs

| Item | Type | Owner Or Link | Review Trigger |
| --- | --- | --- | --- |
| REPLACE OR REMOVE | decision/risk/debt/tradeoff | REPLACE OR REMOVE | REPLACE OR REMOVE |

## Change Notes

- Local change is enough when:
- Widen scope when:
- Consistency sweep needed for:
- Review required for:

## Verification

- Commands or checks:
- Source files reviewed:
- Last architecture review:
- Review triggers:

## Related Knowledge

- Components:
- APIs:
- Data model:
- Deployment runbook:
- Environment and secrets:
- Security boundaries:
- Decisions:
- Plans:
- Runbooks:

## Open Questions

| Question | Impact | Owner | Resolution Path |
| --- | --- | --- | --- |
| REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE |
