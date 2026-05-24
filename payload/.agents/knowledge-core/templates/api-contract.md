<!--
Starter template: API contract.

Use as project-specific scaffolding only. Do not treat this template as policy,
evidence, or text to copy verbatim.

Before committing an instantiated doc:
- replace all placeholders
- remove this comment
- remove sections and rows that do not apply
- use real project evidence; leave unknowns in Open Questions
- link to the machine-readable contract when one exists
- keep status: draft until source of truth, consumers, compatibility, and verification are known
- do not include secrets, private data, raw production payloads, tokens, or signing secrets
-->
---
id: REPLACE.WITH.STABLE.ID
type: api
status: draft
owner: project
summary: REPLACE with one sentence describing the API surface or integration contract this document owns.
canonical_for:
  - REPLACE.WITH.API.OR.INTEGRATION.TOPIC
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

# API Contract

## Purpose

- API or integration owned:
- Audience:
- Contract source of truth:
- Consumers:
- Compatibility promise:

## Use When

- Caller-visible behavior, schema, auth, errors, events, webhooks, SDK/CLI behavior, or generated clients need durable documentation.
- Implementation, contract files, generated clients, examples, docs, or tests need one reconciled owner.

## Do Not Use When

- The change is purely internal.
- Another API doc owns the exact surface.
- The behavior is unknown and has no code, spec, test, log, or owner evidence.

## Authority And Shape

| Field | Value |
| --- | --- |
| Provider owner | REPLACE |
| Consumer owner(s) | REPLACE |
| Protocol or interface kind | REPLACE |
| Contract source of truth | REPLACE |
| Generated artifacts | REPLACE OR REMOVE |
| Review or approval owner | REPLACE |

## Operation Inventory

| Operation Or Event | Route/Method/Topic/Entrypoint | Purpose | Consumers | Auth | Compatibility Risk |
| --- | --- | --- | --- | --- | --- |
| REPLACE | REPLACE | REPLACE | REPLACE | REPLACE | REPLACE |

## Request, Response, And Errors

| Surface | Shape Or Rule | Source | Notes |
| --- | --- | --- | --- |
| Inputs | REPLACE | REPLACE | REPLACE |
| Outputs | REPLACE | REPLACE | REPLACE |
| Errors | REPLACE | REPLACE | REPLACE |
| Headers or metadata | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE |

## Auth And Access

| Operation/Resource | Authentication | Authorization Rule | Tenant/Object/Field Check | Negative Test |
| --- | --- | --- | --- | --- |
| REPLACE | REPLACE | REPLACE | REPLACE | REPLACE |

## Runtime Semantics

| Topic | Contract |
| --- | --- |
| Pagination/filtering/sorting | REPLACE OR REMOVE |
| Idempotency/retries/timeouts | REPLACE OR REMOVE |
| Rate limits/quotas | REPLACE OR REMOVE |
| Caching/freshness/consistency | REPLACE OR REMOVE |
| Size/cost limits | REPLACE OR REMOVE |

## Versioning And Compatibility

| Change Type | Compatible? | Required Action |
| --- | --- | --- |
| REPLACE | yes/no/depends | REPLACE |

## Examples And Fixtures

- Safe synthetic request:
- Safe synthetic response:
- Error example:
- Fixture or generated example source:

## Verification

| Check | Command/Location | What It Proves | When It Runs |
| --- | --- | --- | --- |
| REPLACE | REPLACE | REPLACE | REPLACE |

## Change Notes

- Consumers to notify:
- Generated artifacts to rebuild:
- Docs/examples/tests to update:
- Release or deprecation impact:

## Related Knowledge

- Architecture:
- Component:
- Data model:
- Security boundaries:
- Environment and secrets:
- Deployment:
- Decisions:

## Open Questions

| Question | Impact | Owner | Resolution Path |
| --- | --- | --- | --- |
| REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE |
