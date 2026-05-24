<!--
Required template: agent skill.

Use as skill scaffolding only. Do not treat this template as policy, evidence,
or text to copy verbatim.

Before saving an instantiated skill:
- replace all placeholders
- remove this comment
- make `name` match the skill directory exactly
- make `description` the routing contract
- remove unused sections
- create or update `.agents/evals/skills/<skill-name>.eval.md`
- keep durable project facts in docs, not inside the skill
- keep temporary task state in `.context/handoffs/`, not inside the skill
-->
---
name: REPLACE-LOWERCASE-KEBAB-NAME
description: REPLACE with one clear router paragraph: what this skill does, when to use it, and the closest neighboring task that should not use it.
---

# Skill Display Name

## Goal

State the reusable capability this skill provides.

## Use When

- REPLACE

## Do Not Use When

- REPLACE

## Inputs

- Required:
- Optional:
- Stop or ask when:

## Resource Router

| Resource | Use When | Purpose |
| --- | --- | --- |
| `references/REPLACE.md` | REPLACE OR REMOVE | REPLACE OR REMOVE |
| `scripts/REPLACE` | REPLACE OR REMOVE | REPLACE OR REMOVE |
| `assets/REPLACE` | REPLACE OR REMOVE | REPLACE OR REMOVE |

## Workflow

1. Classify the request against `Use When` and `Do Not Use When`.
2. Load only resources needed for this request.
3. Follow the procedure below.
4. Validate the output.
5. Report the result and any important caveat.

## Procedure

- REPLACE

## Outputs

- Primary output:
- Required evidence:
- Caveat when incomplete:

## Validation

- Output is valid when:
- Command or deterministic check:
- Manual review point:
- Must not claim:

## Failure Modes

| Failure | Recovery |
| --- | --- |
| REPLACE OR REMOVE | REPLACE OR REMOVE |

## Security And Trust

- Untrusted content:
- Secret or private data boundary:
- Tool, network, or destructive-action boundary:
- Higher-priority instruction boundary:

## References

| Reference | Read When |
| --- | --- |
| REPLACE OR REMOVE | REPLACE OR REMOVE |
