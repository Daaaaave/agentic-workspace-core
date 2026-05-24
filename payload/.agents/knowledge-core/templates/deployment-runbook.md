<!--
Starter template: deployment runbook.

Use as project-specific scaffolding only. Do not treat this template as policy,
evidence, or text to copy verbatim.

Before committing an instantiated doc:
- replace all placeholders
- remove this comment
- remove sections and rows that do not apply
- replace generic rows with exact project commands, owners, checks, and stop conditions
- keep status: draft until the procedure has project-specific evidence and verification
- do not include secret values, private keys, tokens, customer data, raw production payloads, or raw logs
-->
---
id: REPLACE.WITH.STABLE.ID
type: runbook
status: draft
owner: project
summary: REPLACE with one sentence describing what deploy/release/publish procedure this runbook owns.
canonical_for:
  - REPLACE.WITH.DEPLOYMENT.OR.RELEASE.TOPIC
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

# Deployment Runbook

## Purpose

- Procedure owned:
- Deployment target or package/artifact destination:
- Environments covered:
- Artifacts covered:
- Rollback or roll-forward path:
- Procedures explicitly not covered:

## Use When

- Deploying, publishing, promoting, activating, rolling back, or verifying a release artifact.
- Release work includes migrations, backfills, generated artifacts, config, flags, package publishing, or infrastructure changes.

## Do Not Use When

- The change has no release, deployment, publish, promotion, or activation step.
- Required approvals, access, artifact identity, owner, or verification evidence are missing.
- An emergency with unknown blast radius should use the incident or rollback path first.

## Ownership And Authority

| Field | Value |
| --- | --- |
| Procedure kind | REPLACE |
| Target environment(s) | REPLACE |
| Artifact source and destination | REPLACE |
| Automation entrypoint | REPLACE OR REMOVE |
| Human approval gate | REPLACE OR REMOVE |
| Release owner | REPLACE |
| Component or service owner | REPLACE |
| Decision owner for abort/continue | REPLACE |

## Preconditions

- Target environment and artifact/version/tag/commit:
- Source branch and merge/release state:
- Required approvals, permissions, tools, and versions:
- CI or pre-release check state:
- Generated files, migrations, config, or flags prepared:
- Observability or support coverage:
- Change window or freeze constraint:

## Risk And Gates

| Area Or Gate | Expected Impact Or Requirement | Stop Or Roll Back When | Owner |
| --- | --- | --- | --- |
| Users/customers | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE |
| Data/schema | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE |
| APIs/contracts | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE |
| Security/privacy | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE |
| CI/test/observability | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE |

## Artifact And Supply Chain

| Artifact | Source | Destination | Version Or Digest | Integrity Evidence |
| --- | --- | --- | --- | --- |
| REPLACE | REPLACE | REPLACE | REPLACE | REPLACE |

## Rollout Plan

| Phase | Scope Or Traffic | Entry Criteria | Promote When | Abort When |
| --- | --- | --- | --- | --- |
| REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE |

## Procedure

| Step | Action | Evidence To Capture | Stop Or Escalate If |
| --- | --- | --- | --- |
| 1 | REPLACE | REPLACE | REPLACE |

## Data, Config, Secrets, And Flags

| Surface | Required Detail | Verification | Rollback/Disable Path |
| --- | --- | --- | --- |
| Migration/schema | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE |
| Backfill/background job | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE |
| Generated artifacts | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE |
| Config/secrets/flags | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE |

## Verification And Monitoring

| Claim | Evidence Command/Link/Observation | Expected Result | Actual Result |
| --- | --- | --- | --- |
| REPLACE | REPLACE | REPLACE | REPLACE |

## Rollback, Roll-Forward, Or Abort

- Abort before deploy when:
- Abort during rollout when:
- Rollback command/procedure:
- Roll-forward alternative:
- Previous artifact/version/source:
- Config or flag disable path:
- Migration reversal or compensation:
- Verification after rollback:
- Communication after rollback:

## Failure Modes And Communication

| Symptom | Immediate Action | Follow-Up | Owner |
| --- | --- | --- | --- |
| REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE |

## Post-Deployment Closure

- Active environment/package/registry points to intended version:
- Relevant alerts, logs, metrics, user reports, or support tickets reviewed:
- Release notes, generated indexes, and durable knowledge updated:
- Cleanup owners for temporary flags/config/compatibility code:

## Related Knowledge

- Architecture:
- Components:
- Environment and secrets:
- Data model or migrations:
- API contracts:
- Security boundaries:
- Incident or rollback runbooks:
- Decisions:

## Open Questions

| Question | Impact | Owner | Resolution Path |
| --- | --- | --- | --- |
| REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE |
