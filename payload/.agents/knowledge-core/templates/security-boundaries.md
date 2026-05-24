<!--
Starter template: security boundaries.

Use as project-specific scaffolding only. Do not treat this template as policy,
evidence, or text to copy verbatim.

Before committing an instantiated doc:
- replace all placeholders
- remove this comment
- remove sections and rows that do not apply
- use real project evidence; leave unknowns in Open Questions
- keep status: draft until boundaries, controls, owners, and verification are known
- do not include secrets, private data, bearer tokens, session cookies, private keys, reusable exploit payloads, or raw production logs
-->
---
id: REPLACE.WITH.STABLE.ID
type: architecture
status: draft
owner: project
summary: REPLACE with one sentence describing the security boundary, trust model, or threat surface this document owns.
canonical_for:
  - REPLACE.WITH.SECURITY.BOUNDARY.TOPIC
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

# Security Boundaries

## Purpose

- Security boundary owned:
- Assets protected:
- Readers:
- Detail owned elsewhere:

## Use When

- A task touches auth, sessions, roles, tenancy, PII, credentials, files, logs, exports, APIs, webhooks, uploads, outbound fetches, database access, CI/CD, publishing, cloud roles, agents/tools/memory, rate limits, destructive actions, or sensitive business flows.
- A new trust boundary, principal, sensitive store, external integration, privileged action, public API, or automation path is introduced.

## Do Not Use When

- The change has no security, privacy, trust, data, external-boundary, or automation impact.
- The task needs an actual secret or private record.
- The system is actively compromised or leaking data and needs incident handling first.
- Another canonical security doc owns the exact boundary.

## Authority And Scope

| Field | Value |
| --- | --- |
| Security owner | REPLACE |
| Architecture owner | REPLACE OR REMOVE |
| Data/privacy owner | REPLACE OR REMOVE |
| Runtime/infrastructure owner | REPLACE OR REMOVE |
| Source of truth | REPLACE |
| Threat model status | draft/current/deprecated/superseded |
| Required reviewer | REPLACE OR REMOVE |
| Escalation path | REPLACE OR REMOVE |

## Assets And Trust Boundaries

| Asset Or Data Class | Why It Matters | Classification | Owner | Primary Risk |
| --- | --- | --- | --- | --- |
| REPLACE | REPLACE | public/internal/sensitive/regulated/credential | REPLACE | REPLACE |

| Boundary | Trusted Side | Untrusted Or Less-Trusted Side | Crossing Data/Action | Required Control | Verification |
| --- | --- | --- | --- | --- | --- |
| REPLACE | REPLACE | REPLACE | REPLACE | REPLACE | REPLACE |

## Principals And Authorization

| Principal | Credential Source | Allowed Scope | Notes |
| --- | --- | --- | --- |
| REPLACE | REPLACE | REPLACE | REPLACE |

| Principal | Resource/Object | Action | Allowed When | Denied When | Enforcement Point | Negative Test |
| --- | --- | --- | --- | --- | --- | --- |
| REPLACE | REPLACE | REPLACE | REPLACE | REPLACE | REPLACE | REPLACE |

## Data Flow And Isolation

| Flow | Source | Sink | Data Class | Boundary Crossed | Control | Verification |
| --- | --- | --- | --- | --- | --- | --- |
| REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE |

## Untrusted Input And Safe Sinks

| Input Or Sink | Risk | Required Control | Verification |
| --- | --- | --- | --- |
| REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE |

## Secrets, Sensitive Data, And Observability

| Data/Secret Class | Storage Or Owner | Allowed Consumers | Forbidden Locations | Rotation/Deletion |
| --- | --- | --- | --- | --- |
| REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE |

| Event Or Log Surface | Why It Matters | Sensitive Fields | Alert/Review |
| --- | --- | --- | --- |
| REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE |

## External, Runtime, CI/CD, And Agent Boundaries

| Surface | Trust Assumption | Permission Or Capability | Control | Verification |
| --- | --- | --- | --- | --- |
| REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE |

## Abuse Cases And Risk Decisions

| Abuse Case Or Risk | Asset At Risk | Boundary Crossed | Existing Control | Missing Control | Owner/Review |
| --- | --- | --- | --- | --- | --- |
| REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE |

## Verification

| Check | Command/Location | What It Proves | When It Runs |
| --- | --- | --- | --- |
| REPLACE | REPLACE | REPLACE | REPLACE |

## Change Notes

- Assets, principals, resources, actions, tenants, or data classes affected:
- Controls changed:
- Negative tests or manual evidence:
- Docs/runbooks/contracts to update:
- Accepted risk or escalation needed:

## Related Knowledge

- Architecture:
- Components:
- API contracts:
- Data model:
- Environment and secrets:
- Deployment:
- Incident response:
- Compliance/privacy:
- Security tests:
- Decisions:

## Open Questions

| Question | Impact | Owner | Resolution Path |
| --- | --- | --- | --- |
| REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE |
