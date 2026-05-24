# Task Contract

## Goal

Turn a coding request into a small contract before code: what changes, what does not change, what success looks like, and what evidence will be collected later.

The contract is not a full specification. It is the smallest shared understanding that prevents solving the wrong problem.

Prefer guardrails over ceremony: name what must not drift, what must be observable, and when to stop. Do not prescribe obvious engineering behavior the model already knows.

## Read When

- The request changes behavior, not just text.
- Requirements, constraints, affected files, or success criteria are unclear.
- The user asks for a feature, bug fix, refactor, test addition, or production-ready result.
- Verification is not obvious before implementation starts.
- The prompt is vague but action-oriented, such as "make it work", "make it better", "finish this", or "fix the flow".
- A small-looking change affects user-visible behavior, stored data, public APIs, security posture, or compatibility.

## Do Not Use When

- The edit is tiny, mechanical, and has an obvious done condition.
- The task is research-only, docs-only, skill authoring, or handoff-only.
- The task is review-only and no implementation contract is needed; use `done-gate.md` or code-review discipline instead.

## Contract Steps

1. Name the user-visible goal in one sentence.
   - If the task is internal-only, name the caller-visible or maintainer-visible outcome.
   - For a bug, name expected behavior and actual behavior separately.
   - Use the user's or domain's language for behavior; translate to implementation terms later.
2. Identify the contract type.
   - Feature: new behavior.
   - Bug fix: restore expected behavior.
   - Refactor: preserve behavior while changing structure.
   - Test work: add or repair evidence.
   - Investigation: answer a question before deciding whether code should change.
3. Define non-goals when adjacent work is tempting.
4. Separate requirements from solution choices.
   - Requirement: what behavior, outcome, constraint, or compatibility promise must hold.
   - Solution choice: how you intend to implement it.
   - If the user did not choose the solution, keep it provisional until context confirms it.
   - Do not lock implementation details into acceptance criteria unless the task is explicitly about internals, migration, API shape, or refactoring.
5. Write acceptance criteria that are observable and user/caller oriented:
   - behavior the user or caller should see
   - important edge cases and negative cases
   - compatibility constraints
   - data, API, UI, or operational state that must remain unchanged
   - performance, accessibility, privacy, or reliability constraints when they are part of success
   - explicit out-of-scope behavior
6. Use structured acceptance wording when it reduces ambiguity.
   - For user flows, prefer Given / When / Then shape.
   - For system behavior, prefer condition -> response shape: "When/If/While <condition>, <system> should <observable response>."
   - Keep acceptance solution-neutral unless the user explicitly chose the solution.
   - Do not force every criterion into Gherkin or EARS syntax. Use structure only when it makes the criterion clearer.
   - Keep each scenario short enough to retain expressive power; if one scenario needs many steps, split it.
7. Keep verification separate from acceptance.
   - Acceptance says what must be true.
   - Verification says how you will prove it.
   - Do not treat "tests pass" as the acceptance criterion unless the task is only to fix tests.
8. Map acceptance to evidence.
   - Normal work: a short verification list is enough.
   - High-risk work: use a small acceptance/evidence table so every critical criterion has proof.
   - If evidence is manual, name the exact observation or artifact needed.
9. Pick the risk level:
   - Tiny: local mechanical edit, no behavior change.
   - Standard: behavior change or multi-file change.
   - High risk: auth, authorization, privacy, secrets, migrations, public APIs, data deletion, payments, deployment, or irreversible operations.
10. Pick the solution quality target.
   - Routine/local: existing project patterns and nearby tests are enough; avoid external research and broad refactors.
   - Best-fit/current: the task is durable, architectural, dependency-related, public, security-sensitive, release-sensitive, or based on framework/library/API behavior that may be stale. Compare plausible approaches and route current evidence through `research-to-knowledge` when it can change the implementation.
   - Systemic consistency: the change creates, corrects, or replaces a pattern that should apply across sibling call sites, flows, adapters, schemas, tests, or docs.
   - "Best" means version-compatible, maintainable, project-aligned, evidence-backed, and proportional to risk; it does not mean newest, trendiest, or most complex.
11. Decide the impact radius.
   - Search for sibling flows when the issue may come from a shared invariant, repeated pattern, helper, schema, adapter, API contract, generated input, or test fixture.
   - If all affected places are part of the same invariant and safe to update, include them in the contract.
   - If the right fix is broader than the current task can safely own, name the expansion, make the smallest safe slice, and leave a concrete follow-up or ask for alignment.
   - Do not leave a new local convention beside an old project convention unless this is an explicit transition plan.
12. Check size and split if needed.
   - A good contract should usually fit one focused change.
   - If there are multiple independent outcomes, split into slices or name the first slice.
   - If the contract needs many acceptance criteria, that may be a signal the task is too large.
   - If writing the contract takes more judgment than the edit itself, simplify it or skip it.
13. Define the verification plan before editing:
   - targeted test or reproduction command
   - full build/type/lint command when relevant
   - manual or browser check for UI/runtime behavior
   - red-green regression check for bug fixes when feasible
14. Decide whether a question is blocking.
   - Ask if the answer changes architecture, data model, security posture, or user-visible behavior.
   - Ask if there are two plausible interpretations with materially different outcomes.
   - Otherwise state the assumption and proceed.
15. Note stop conditions: when to pause instead of guessing.
16. Update the contract if new evidence changes scope, risk, acceptance, quality target, impact radius, or verification.
   - Do not silently continue under an obsolete contract.
   - If the change is small and the user intent is unchanged, state the updated assumption and continue.

## Output Shape

Use the lightest shape that prevents wrong work.

Tiny:

```markdown
Goal:
Check:
```

Standard:

```markdown
Goal:
Type:
Non-goals:
Acceptance:
Quality target:
Impact radius:
Verification:
Risk:
Assumptions / Questions:
```

High risk:

```markdown
Goal:
Type:
Non-goals:
Acceptance -> Evidence:
Risk:
Quality target:
Impact radius:
Blocking Questions:
Stop Conditions:
```

For larger work, save a durable plan only when the project expects plans. Otherwise keep the contract in the conversation and execute.

## Quality Bar

- Every acceptance criterion must be checkable.
- The verification plan must be runnable or explicitly marked manual.
- Each important acceptance criterion must have a corresponding evidence path.
- Acceptance criteria must describe observable outcomes, not merely implementation activity.
- Requirements must stay solution-neutral unless the user or existing public contract chooses the solution.
- Vague quality words such as "fast", "easy", "robust", "clean", or "better" need a concrete observable meaning or a stated assumption.
- The quality target must reject the fastest patch when the task needs a durable, current, architectural, security-sensitive, or project-wide solution.
- For current-sensitive work, the contract must identify the installed version, source of truth, or research route that can validate the approach.
- For shared invariants or repeated patterns, the contract must decide whether the fix is local, propagated now, or split into an explicit follow-up.
- The contract must prevent scope drift, not create a heavyweight spec unless the task needs one.
- If a criterion cannot be verified, say what evidence is missing.
- If the user already supplied a clear contract, keep it and only fill genuine gaps.
- If the contract is still vague after one pass, ask the smallest blocking question instead of inventing product intent.

## Anti-Patterns

| Anti-Pattern | Correction |
| --- | --- |
| "Make it better" without defining better | Convert to observable behavior, metric, or review criterion. |
| Treating a proposed solution as the requirement | Restate the user-visible outcome and keep the solution provisional. |
| Treating the quickest passing patch as the best solution | Set a quality target and choose a best-fit approach for the task's risk, lifetime, and architecture. |
| Locking a local implementation that should become project-wide | Add an impact-radius check and decide propagation, split, or alignment before editing. |
| Doing deep external research for a mechanical edit | Use the tiny path; research only when external/current evidence can change the implementation. |
| Vague quality words with no observable meaning | Add a metric, example, acceptance observation, or explicit assumption. |
| "Tests later" | Decide the verification plan before implementation. |
| "Tests pass" as the whole definition of success | Define user/caller behavior, then name tests as evidence. |
| Acceptance criteria that inspect internals only | Prefer observable output; use internals only for refactors, migrations, or explicitly internal tasks. |
| A giant acceptance list | Split the task or name the first safe slice. |
| Silent assumptions | State assumptions that affect behavior or risk. |
| Asking non-blocking questions to avoid progress | State a reasonable assumption and proceed. |
| Accepting hidden extra work | Put adjacent cleanup in non-goals or a follow-up note. |
| Turning every task into a full spec | Use the smallest contract that prevents guessing. |
