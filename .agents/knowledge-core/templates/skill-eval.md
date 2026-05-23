# example-skill Eval

Purpose: verify that `example-skill` triggers only for its intended workflow and routes neighboring prompts elsewhere.

## Should Trigger

| Prompt | Expected Behavior |
| --- | --- |
| "Concrete user request that needs this workflow." | Loads the skill, follows the workflow, and validates the output. |
| "Different wording that should still trigger." | Loads the skill because the intent matches the documented boundary. |

## Should Not Trigger

| Prompt | Expected Behavior |
| --- | --- |
| "Neighboring workflow that belongs in another skill." | Does not load this skill; routes to the correct skill or normal handling. |
| "Tiny one-off task that needs no reusable procedure." | Does not load this skill. |

## Edge Cases

| Prompt | Expected Behavior |
| --- | --- |
| "Ambiguous prompt near the boundary." | Loads or skips for the documented reason and avoids duplicate skill activation. |
| "Request that asks for a deterministic rule." | Prefers a script, schema, or test when that is more reliable than skill prose. |
