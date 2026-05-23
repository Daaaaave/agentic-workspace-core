---
name: example-skill
description: Use when an agent must perform this repeatable workflow; include concrete trigger terms and the main exclusion boundary.
---

# Example Skill

## Goal

State the repeatable capability this skill provides in one paragraph.

## Core Principle

Name the operating rule that should change agent behavior. Omit this section if it would only restate the goal.

## Use When

- Trigger:
- Related trigger:
- False-negative prompt that should still trigger:

## Do Not Use When

- Neighboring workflow that belongs elsewhere:
- One-off task that does not need a reusable skill:
- Durable project fact that belongs in `docs/`:

## Inputs

- Required input:
- Optional input:
- Assumption to state if missing:

## Workflow

1. Resolve the mode or task variant.
2. Inspect the smallest relevant local context before writing or acting.
3. Follow the procedure for the selected mode.
4. Validate the output against this skill's quality bar.
5. State any unresolved risk or skipped validation.

## Outputs

- Primary output:
- Evidence or validation result:
- Follow-up only if it is necessary:

## Validation

- Check frontmatter and trigger boundary.
- Check output shape.
- Check that no durable facts were hidden in the skill.
- Run `npm run knowledge:doctor` when skill files or evals changed.

## Failure Modes

| Failure | Recovery |
| --- | --- |
| Skill overlaps a neighboring skill | Tighten `description`, add should-not-trigger evals, or merge the skills. |
| Workflow is deterministic | Move enforcement to a script/schema/test and keep only orchestration in the skill. |
| Optional resource is needed | Add `references/`, `scripts/`, or `assets/` only with explicit routing from this file. |

## Anti-Patterns

- Creating a skill because a folder already exists.
- Writing broad advice instead of a concrete procedure.
- Hiding trigger-critical rules only in the body.
- Adding empty optional directories.
- Adding `allowed-tools` without audit and core opt-in.

## References

- Add relative links to `references/` only when needed, with a "read when" condition.
