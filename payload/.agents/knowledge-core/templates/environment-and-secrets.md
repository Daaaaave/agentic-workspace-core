<!--
Starter template: environment and secrets.

Use as project-specific scaffolding only. Do not treat this template as policy,
evidence, or text to copy verbatim.

Before committing an instantiated doc:
- replace all placeholders
- remove this comment
- remove sections and rows that do not apply
- use real project evidence; leave unknowns in Open Questions
- document names, stores, owners, and checks only
- keep status: draft until owners, stores, consumers, and checks are verified
- never include secret values, tokens, private keys, session cookies, recovery codes, raw logs, screenshots, or customer data
-->
---
id: REPLACE.WITH.STABLE.ID
type: reference
status: draft
owner: project
summary: REPLACE with one sentence describing the environment, configuration, and secret-handling surface this document owns.
canonical_for:
  - REPLACE.WITH.ENVIRONMENT.OR.SECRETS.TOPIC
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

# Environment And Secrets

## Purpose

- Environment/config/secret surface owned:
- Readers:
- Actual secret store or access path:
- Detail owned elsewhere:

## Use When

- A task touches environment variables, deploy config, feature flags, `.env.example`, local setup, config validation, CI/CD credentials, publish/deploy identities, API keys, tokens, certificates, webhooks, signing keys, OAuth credentials, rotation, revocation, or suspected exposure.

## Do Not Use When

- The task needs the actual secret value.
- The value is a non-sensitive code constant with no environment difference.
- An active compromise needs incident handling first.
- The owner, store, or access path is unknown and cannot be verified.

## Authority And Environment Model

| Area | Owner | Source Of Truth | Approval Required For Change |
| --- | --- | --- | --- |
| Runtime config | REPLACE | REPLACE | REPLACE |
| Secret store | REPLACE | REPLACE | REPLACE |
| Deployment identities | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE |
| CI/CD credentials | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE |
| Local development setup | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE |

| Environment | Purpose | Config Source | Secret Source | Data Boundary |
| --- | --- | --- | --- | --- |
| REPLACE | REPLACE | REPLACE | REPLACE | REPLACE |

## Configuration Contract

| Config Key | Class | Purpose | Required | Default | Environments | Owner | Validation |
| --- | --- | --- | --- | --- | --- | --- | --- |
| REPLACE | secret/non-secret/public-client/internal-code | REPLACE | yes/no | REPLACE | REPLACE | REPLACE | REPLACE |

## Secret Inventory

| Secret Name Or Alias | Purpose | Store/Location | Consumers | Environments | Scope | Rotation | Owner |
| --- | --- | --- | --- | --- | --- | --- | --- |
| REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE |

## Storage, Injection, And Local Development

| Surface | Project Rule |
| --- | --- |
| Runtime injection | REPLACE |
| CI/CD injection | REPLACE OR REMOVE |
| Local development source | REPLACE OR REMOVE |
| `.env.example` or equivalent | REPLACE OR REMOVE |
| Gitignored local files | REPLACE OR REMOVE |
| Validation command | REPLACE OR REMOVE |
| Redaction policy | REPLACE OR REMOVE |
| Break-glass path | REPLACE OR REMOVE |

## CI/CD, Release, And Publishing Credentials

| Credential Or Role | Used By | Purpose | Scope | Lifetime | Storage | Verification |
| --- | --- | --- | --- | --- | --- | --- |
| REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE |

## Validation And Failure Behavior

| Check | Command/Location | What It Proves | When It Runs |
| --- | --- | --- | --- |
| REPLACE | REPLACE | REPLACE | REPLACE |

## Rotation, Revocation, And Exposure Response

| Secret Or Credential Class | Normal Rotation | Emergency Rotation | Revocation Path | Validation After Change |
| --- | --- | --- | --- | --- |
| REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE |

## Observability And Redaction

| Surface | Redaction Rule | Verification |
| --- | --- | --- |
| REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE |

## Change Notes

- Config class:
- Owner and consumers:
- Storage and injection path:
- Validation added or updated:
- Rotation or revocation needed:
- Docs, logs, artifacts, or client bundles to inspect:

## Related Knowledge

- Architecture:
- Components:
- Deployment runbooks:
- Security boundaries:
- Incident response:
- Local development:
- CI/CD:
- Decisions:

## Open Questions

| Question | Impact | Owner | Resolution Path |
| --- | --- | --- | --- |
| REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE |
