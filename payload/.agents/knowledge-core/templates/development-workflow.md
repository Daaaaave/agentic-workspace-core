<!--
Starter template: development workflow.

Use as project-specific scaffolding only. Do not treat this template as policy,
evidence, or text to copy verbatim.

Before committing an instantiated doc:
- replace all placeholders
- remove this comment
- remove sections and rows that do not apply
- use real project evidence; leave unknowns in Open Questions
- keep status: draft until commands, owners, and checks are verified
- do not include secrets, private data, local credentials, raw logs, or temporary task state
-->
---
id: REPLACE.WITH.STABLE.ID
type: workflow
status: draft
owner: project
summary: REPLACE with one sentence describing the project-specific development workflow this document owns.
canonical_for:
  - REPLACE.WITH.DEVELOPMENT.WORKFLOW.TOPIC
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

# Development Workflow

## Purpose

- Workflow owned:
- Readers:
- Repository areas covered:
- Agent instruction owner:
- Detail owned elsewhere:

## Use When

- Humans or agents need project-specific setup, commands, CI, branch/review rules, generated-file rules, migration workflow, dependency rules, or done evidence.
- A workflow change must be durable for future contributors.

## Do Not Use When

- The topic is general agent behavior, temporary task state, or a durable architecture/API/data/security/deployment fact owned by another doc.
- The workflow is unknown and lacks scripts, CI config, maintainer decision, or repository-practice evidence.

## Authority And Scope

| Field | Value |
| --- | --- |
| Workflow owner | REPLACE |
| Default branch | REPLACE |
| Branch/release policy | REPLACE |
| CI source of truth | REPLACE |
| Package/build source of truth | REPLACE |
| Required reviewer(s) | REPLACE OR REMOVE |
| Merge authority | REPLACE OR REMOVE |
| Emergency/hotfix authority | REPLACE OR REMOVE |

## Branch, Batch, And Review Model

| Surface | Project Rule | Evidence |
| --- | --- | --- |
| Branch model | REPLACE | REPLACE |
| PR/MR requirement | REPLACE OR REMOVE | REPLACE OR REMOVE |
| Required reviews/checks | REPLACE OR REMOVE | REPLACE OR REMOVE |
| Merge method | REPLACE OR REMOVE | REPLACE OR REMOVE |
| Hotfix path | REPLACE OR REMOVE | REPLACE OR REMOVE |

## Local Setup And Commands

| Task | Command/Location | What It Proves Or Provides | Required? |
| --- | --- | --- | --- |
| Install dependencies | REPLACE | REPLACE | yes/no |
| Start local services/dev server | REPLACE OR REMOVE | REPLACE OR REMOVE | yes/no |
| Build | REPLACE OR REMOVE | REPLACE OR REMOVE | yes/no |
| Test | REPLACE OR REMOVE | REPLACE OR REMOVE | yes/no |
| Lint/typecheck/format | REPLACE OR REMOVE | REPLACE OR REMOVE | yes/no |
| Generate artifacts | REPLACE OR REMOVE | REPLACE OR REMOVE | yes/no |
| Package or release dry-run | REPLACE OR REMOVE | REPLACE OR REMOVE | yes/no |

## Work Intake And Scope

| Change Type | Preparation | Verification | Widen Scope When |
| --- | --- | --- | --- |
| REPLACE | REPLACE | REPLACE | REPLACE |

## Concurrent Work And Dirty Worktree

| Situation | Project Rule |
| --- | --- |
| Existing unrelated changes | REPLACE |
| Same-file changes by others | REPLACE |
| Multiple agents/workspaces | REPLACE |
| Generated files changed elsewhere | REPLACE |
| User edits arrive during task | REPLACE |

## Generated Files, Dependencies, And Tooling

| Surface | Canonical Source Or Owner | Change Command | Required Checks |
| --- | --- | --- | --- |
| Generated files/types/clients/docs | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE |
| Lockfiles/package manager | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE |
| Runtime dependencies | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE |
| CI actions/plugins/images | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE |

## Data, Schema, And Migration Workflow

| Change | Command/Path | Owner | Verification |
| --- | --- | --- | --- |
| REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE |

## Testing, CI, And Quality Gates

| Gate | Purpose | Command/Location | Required For |
| --- | --- | --- | --- |
| REPLACE | REPLACE | REPLACE | REPLACE |

## Security, Privacy, And Supply Chain

| Trigger | Project Gate Or Owner |
| --- | --- |
| REPLACE OR REMOVE | REPLACE OR REMOVE |

## Release Handoff And Knowledge Updates

| Change Surface | Required Handoff Or Docs Update |
| --- | --- |
| REPLACE OR REMOVE | REPLACE OR REMOVE |

## Change Notes

- Update scripts/config first when they are authoritative:
- Update `AGENTS.md` or skills when agent behavior changes:
- Rebuild generated knowledge indexes when authored docs change:
- Checks proving the updated workflow:

## Related Knowledge

- Agent instructions:
- Architecture:
- Components:
- API contracts:
- Data model:
- Security boundaries:
- Environment and secrets:
- Deployment runbooks:
- CI/CD config:
- Package/build config:
- Decisions:

## Open Questions

| Question | Impact | Owner | Resolution Path |
| --- | --- | --- | --- |
| REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE | REPLACE OR REMOVE |
