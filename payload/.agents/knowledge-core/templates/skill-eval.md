<!--
Required template: skill eval.

Use as skill-regression scaffolding only. Do not treat this template as a
benchmark, policy, or text to copy verbatim.

Before saving an instantiated eval:
- replace all placeholders
- remove this comment
- make the filename match the skill name: <skill-name>.eval.md
- use realistic prompts
- include should-trigger, should-not-trigger, and edge cases
- update this eval when SKILL.md trigger boundaries, resources, tools, outputs, or safety behavior change
-->
# REPLACE-SKILL-NAME Eval

Purpose: verify that `REPLACE-SKILL-NAME` triggers for REPLACE-INTENDED-WORKFLOW without stealing REPLACE-NEIGHBORING-WORKFLOW.

## Eval Contract

- Skill under test:
- Trigger boundary:
- Primary output behavior:
- Neighboring skills or routes:
- Security, tool, or resource boundary:
- Regression protected by this eval:

## Should Trigger

| Prompt | Expected Behavior | Protects |
| --- | --- | --- |
| "REPLACE realistic prompt for the main workflow." | REPLACE expected activation and output. | REPLACE |

## Should Not Trigger

| Prompt | Expected Behavior | Correct Route | Protects |
| --- | --- | --- | --- |
| "REPLACE neighboring workflow prompt." | REPLACE expected non-activation behavior. | REPLACE | REPLACE |

## Edge Cases

| Prompt | Expected Behavior | Risk Covered |
| --- | --- | --- |
| "REPLACE ambiguous or risky boundary prompt." | REPLACE expected behavior. | REPLACE |

## Coverage Checklist

- Positive prompts cover the main trigger and at least one realistic paraphrase.
- Negative prompts cover the closest neighboring routes.
- Edge prompts cover ambiguity, resource/tool/security boundaries, or stale context when relevant.
- Expected behavior states the route, output, and evidence of success.
