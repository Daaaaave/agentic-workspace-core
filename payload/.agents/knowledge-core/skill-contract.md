# Skill Contract

Skills are procedural capability bundles for agents. They teach repeatable behavior; they do not own durable project facts.

The core follows the Agent Skills directory model:

```txt
.agents/skills/
  skill-name/
    SKILL.md
    references/
    scripts/
    assets/
    agents/

.agents/evals/skills/
  skill-name.eval.md
```

Concrete skills are part of the v0 surface area, but each skill should earn its place through a clear trigger boundary and eval coverage.

## Contract

Every concrete skill must live in its own lowercase kebab-case directory:

```txt
.agents/skills/example-skill/SKILL.md
```

`SKILL.md` must contain YAML frontmatter followed by Markdown instructions.

Required frontmatter:

- `name`: must match the directory name.
- `description`: primary router text. It must say what the skill does and when an agent should use it.

Optional frontmatter:

- `license`
- `compatibility`
- `metadata`
- `allowed-tools`

Use optional frontmatter only when it changes runtime behavior, legal clarity, or compatibility. Keep universal skills free of provider-specific fields unless an adapter layer explicitly owns those fields.

Use `allowed-tools` only after auditing the skill and any bundled scripts. The default portable core disables pre-approved tools.

## Fit Test

Create or keep a skill only when all are true:

- The behavior is reusable across sessions or projects.
- The behavior is procedural, not durable project knowledge.
- The trigger boundary can fit in one clear `description`.
- The workflow needs judgment that cannot be replaced by a deterministic script or schema.
- The skill has should-trigger, should-not-trigger, and edge-case eval prompts.
- The skill reduces repeated mistakes without becoming broad advice.

If deterministic validation can enforce the rule, prefer a script, schema, or test. If the behavior should apply to every task, put it in `AGENTS.md`, not a skill.

## Body Shape

Keep `SKILL.md` focused. Prefer this shape:

- Goal
- Core Principle, only when it materially changes behavior
- Use When
- Do Not Use When
- Inputs, if needed
- Workflow
- Outputs
- Validation for the skill's runtime output
- Failure Modes or Anti-Patterns
- References, only when needed

Write executable instructions, not essays. A future agent should know what to do, what to skip, how to validate, and how to recover from common failure modes.
Do not leave authoring notes, private reasoning, benchmark logs, or process history in the published skill body.

## Bundled Resources

Optional directories are allowed only when they reduce context load or make execution more reliable:

- `references/`: detailed variants, examples, schemas, or long guidance that should be loaded only under explicit conditions.
- `scripts/`: deterministic helpers with clear inputs, outputs, and errors.
- `assets/`: static resources or templates used by the skill.
- `agents/`: adapter metadata only when the active core/plugin contract requires it.

Rules:

- Do not create empty optional directories.
- Route every optional directory from `SKILL.md` with an explicit "read/run/use when" condition.
- Keep `references/` shallow and directly named.
- Test script-backed behavior or mark it untested with a reason.
- Do not add README, changelog, installation guide, screenshots, dumps, or copied source bundles inside a skill directory.
- Do not use symlinks inside skill directories.

## Evals

Every concrete skill should have a lightweight eval:

```txt
.agents/evals/skills/example-skill.eval.md
```

Required sections:

- `## Should Trigger`
- `## Should Not Trigger`
- `## Edge Cases`

Each section must include a `Prompt | Expected Behavior` table with at least one concrete prompt.
`Expected Behavior` must cover both routing and output behavior: whether the skill should load, what route should handle the prompt if it should not load, and what evidence or output shape proves success.

Good eval prompts pressure the boundary that may fail in real use:

- false positives that should route elsewhere
- false negatives that should still trigger
- overlap with neighboring skills
- security or permission prompts for script-backed skills
- "belongs in docs/schema/script" cases
- too-small one-off prompts that should not create a skill
- stale-eval cases after material changes to `description`, output contract, resources, tools, or security posture

Evals are not benchmark reports. They are compact regression tests for trigger precision and behavioral intent. Update them whenever a skill's routing or behavior boundary changes, or when a real failure exposes an uncovered prompt shape.

## Starter Set

The portable v0 starter set is intentionally small:

- `project-knowledge`: read, route, write, crystallize, maintain, and validate durable repository knowledge.
- `research-to-knowledge`: turn source-backed external research into recommendations or durable research docs.
- `software-development-workflow`: route non-trivial coding tasks through scope, context, implementation, debugging, security, and done gates.
- `write-agent-skill`: create, revise, secure, and evaluate procedural skills.
- `write-agent-handoff`: write temporary transfer state for another agent, workspace, or future session.

The authoritative machine-readable starter list lives in `.agents/knowledge-core/manifest.json` under `starterSkills`. Update tooling may replace those starter skill directories and matching eval files, but it must preserve project-specific skill directories that are not in that list.

Do not split `project-knowledge` into smaller read/update/crystallize/lint skills unless evals show real trigger conflicts. Do not split `software-development-workflow` into top-level scope/plan/implement/verify/review/ship skills unless evals show the single-router design cannot handle real prompts. Create additional skills only when the behavior is repeated, non-obvious, has a distinct trigger boundary, and is not better enforced by `doctor.mjs` or another deterministic script.
