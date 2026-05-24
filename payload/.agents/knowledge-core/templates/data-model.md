<!--
Starter template: data model.

Use as project-specific scaffolding only. Do not treat this template as policy,
evidence, or text to copy verbatim.

Before committing an instantiated doc:
- replace all placeholders
- remove this comment
- remove sections and rows that do not apply
- use real project evidence; leave unknowns in Open Questions
- list durable source anchors, not every table, file, or query
- keep status: draft until owner, source of truth, evidence, and verification are known
- do not include secrets, private records, raw production rows, private identifiers, or raw logs
-->
---
id: REPLACE.WITH.STABLE.ID
type: database
status: draft
owner: project
summary: REPLACE with one sentence describing the data model, store, schema, or domain data boundary this document owns.
canonical_for:
  - REPLACE.WITH.DATA.MODEL.TOPIC
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

# Data Model

## Purpose

- Data boundary owned:
- Model level:
- Data owner:
- Consumers:
- Detail owned elsewhere:

## Use When

- A task touches schema, models, migrations, generated types, stores, caches, indexes, events, files, imports, exports, backfills, deletion, retention, recovery, or privacy.
- A local fix may need to update all places that depend on one data invariant.

## Do Not Use When

- The topic is only API shape, one component boundary, deployment procedure, environment/secrets, security architecture, or temporary task state.
- The topic requires copying production data, customer data, secrets, or private identifiers into docs.

## Authority And Source Of Truth

| Field | Value |
| --- | --- |
| Source of truth | REPLACE |
| Migration source | REPLACE |
| Runtime store(s) | REPLACE |
| Generated artifacts | REPLACE OR REMOVE |
| Producer(s) | REPLACE |
| Consumer(s) | REPLACE |
| Review or approval owner | REPLACE |
| Contract status | draft/current/deprecated/superseded |

## Data Assets

| Asset | Store/Object | Purpose | Canonical Or Derived | Owner | Privacy Class |
| --- | --- | --- | --- | --- | --- |
| REPLACE | REPLACE | REPLACE | canonical/derived/cache/index/log/generated | REPLACE | public/internal/sensitive/regulated |

## Relationships And Lifecycle

| Entity Or Asset | Relationship Or State | Rule | Enforcement | Delete/Archive Behavior |
| --- | --- | --- | --- | --- |
| REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE |

## Fields And Invariants

| Entity | Field Or Invariant | Type/Shape | Required | Enforcement | Sensitive? |
| --- | --- | --- | --- | --- | --- |
| REPLACE | REPLACE | REPLACE | yes/no | REPLACE | yes/no |

## Lineage And Derived Data

| Data Asset | Upstream Source(s) | Downstream Consumer(s) | Refresh Or Sync Path | Rebuild Or Reconcile Path |
| --- | --- | --- | --- | --- |
| REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE |

## Access, Consistency, And Performance

| Topic | Current Rule Or Evidence |
| --- | --- |
| Access paths | REPLACE |
| Authorization or privacy boundary | REPLACE |
| Consistency/transactions/concurrency | REPLACE OR REMOVE |
| Access patterns and indexes | REPLACE OR REMOVE |
| Backup/recovery/retention | REPLACE OR REMOVE |

## Migration And Evolution

| Change Class | Strategy | Backfill Needed | Compatibility Window | Rollback/Forward Plan |
| --- | --- | --- | --- | --- |
| REPLACE | REPLACE | yes/no | REPLACE | REPLACE |

## Test Data And Observability

| Rule, Dataset, Or Signal | Type | What It Proves Or Detects | Location | Owner |
| --- | --- | --- | --- | --- |
| REPLACE OR REMOVE | fixture/seed/import/test/profile/monitor/manual review | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE |

## Verification

| Check | Command/Location | What It Proves | When It Runs |
| --- | --- | --- | --- |
| REPLACE | REPLACE | REPLACE | REPLACE |

## Change Notes

- Generated artifacts to rebuild:
- APIs/components/imports/exports affected:
- Data preservation or deletion requirement:
- Privacy/logging/recovery impact:
- Consistency sweep needed for:

## Related Knowledge

- Architecture:
- Components:
- API contracts:
- Security boundaries:
- Environment and secrets:
- Deployment and migration runbooks:
- Generated artifacts:
- Decisions:

## Open Questions

| Question | Impact | Owner | Resolution Path |
| --- | --- | --- | --- |
| REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE |
