# Implementation Loop

## Goal

Make focused, reversible, system-consistent changes in small slices, with verification close to each slice.

## Read When

- You are about to edit source, tests, configuration, schemas, migrations, or generated-source inputs.
- A plan exists and now needs execution.
- The task is small enough to execute without a durable plan but still changes code.

## Implementation Rules

1. Preserve unrelated work.
   - Check the relevant diff/status when needed.
   - Do not revert user or unrelated agent changes.
   - If the worktree is already dirty, distinguish pre-existing changes from your slice.
2. Check baseline when verification may already be failing.
   - For bug fixes, run or inspect the failing reproduction before edits when feasible.
   - If the baseline is broken outside the task, record it and avoid mixing it with new failures.
3. Start with the smallest useful slice.
   - One behavior, one bug, one interface, or one setup step.
   - Each slice should leave the system buildable, testable, or explicitly gated off.
   - The smallest useful slice may include all sibling call sites required by the same invariant or repeated project pattern.
   - Avoid broad cleanup unless it is required for the task.
4. Use tests as an oracle when behavior changes.
   - For bug fixes, write or identify a failing reproduction before the fix when feasible.
   - For new behavior, add or update the narrowest meaningful test.
   - Prefer behavior and contract assertions over implementation-detail assertions.
   - Do not add `.only`, skip, weaken, or delete tests unless the task explicitly requires it and the old expectation is proven obsolete.
   - If tests are impossible or disproportionate, state the reason and use another verification method.
   - Do not weaken tests to fit the implementation; fix the code or correct the test only when the prior expectation is proven obsolete.
5. Follow existing code style and local helpers.
   - Prefer established patterns over new abstractions.
   - Add abstractions only when they remove real complexity or match a local pattern.
   - Use the project's existing architecture boundary instead of creating a parallel path beside it.
   - If the right owner appears to be a shared layer rather than the file you first opened, stop and update the plan before editing broadly.
   - If the change introduces or corrects a reusable pattern, update related in-scope usages or record why propagation is out of scope.
6. Keep generated files derived.
   - Edit source inputs.
   - Rebuild generated files with the documented command.
   - Update lockfiles only through the package manager and inspect the resulting diff.
7. Keep external API usage grounded.
   - If a framework/library/CLI pattern matters and was not already verified in `context-plan.md`, check the installed version and current or version-matched official docs before coding from memory.
8. Keep the solution best-fit.
   - Do not default to the first passing patch when the task contract calls for a durable, current, architectural, or project-wide solution.
   - Simple code is preferred only when it satisfies the quality target and project architecture.
   - New dependencies, new patterns, or new technology choices must be justified by project constraints and current evidence when they can affect maintenance, security, release, or compatibility.
   - If the existing pattern is stale, unsafe, or insufficient, fix the canonical owner or pause for alignment; do not drift locally.
9. Keep the solution direct.
   - Implement the intended behavior in the canonical path, not by layering compatibility shims, catch-all fallbacks, or duplicated alternate flows around it.
   - Use fallbacks only for explicit product, resilience, migration, or compatibility contracts.
   - A fallback must have a trigger, owner, observable signal when operationally relevant, verification, and a removal or review condition if temporary.
   - Required config, auth, payment, writes, migrations, and internal invariants should usually fail closed or fail fast rather than silently default.
10. Verify after the slice.
   - Run targeted checks first.
   - Run broader checks when the touched surface justifies it.
   - If a check fails unexpectedly, stop feature work and switch to `debugging-loop.md`.
11. Update the task plan or status as work completes.

## Slice Selection

Choose the slice shape that reduces risk fastest:

| Slice Type | Use When | Rule |
| --- | --- | --- |
| Vertical | A user/caller-visible behavior can be delivered end to end. | Prefer this for product features; keep the path narrow but real. |
| Risk-first | One unknown could invalidate the whole plan. | Prove the risky assumption before building dependent work. |
| Contract-first | API, schema, type, event, or config shape blocks parallel work. | Define the contract, then implement producers and consumers against it. |
| Characterization | Refactoring code with weak or missing coverage. | Add tests or probes that preserve current behavior before refactoring. |
| Mechanical | Codemod, rename, generated update, or format-only change. | Keep behavior out of the slice and use broad verification after. |

## TDD Guidance

Use strict red-green-refactor when:

- the codebase has a suitable test harness
- the change is logic-heavy or bug-related
- the failure can be reproduced deterministically

Use pragmatic test-after when:

- the project has no test harness yet
- the change is UI styling or static content
- the cost of forcing red-first is greater than the risk

Even when not using strict TDD, do not claim behavior works without evidence.

For regression tests, prove the test can fail when practical: observe red before green, temporarily remove the fix, or otherwise confirm the assertion is not a tautology.

Do not rely on TDD instructions alone. Tests need the right target and context. Identify the code paths or impacted tests most likely to exercise the change, then run the smallest meaningful set before broader checks.

## Refactor And Migration Discipline

- Separate behavior changes from refactors unless the refactor is required for the behavior slice.
- For pure refactors, preserve public behavior and verify with existing or characterization tests.
- For codemods or bulk mechanical changes, inspect a sample diff before and after running the tool.
- For migrations, feature gates, or config changes, keep intermediate states deployable or explicitly non-user-visible.
- Prefer additive or backwards-compatible steps before removal steps.

## Consistency Sweep

Use this before finishing a change that touches a shared invariant, repeated pattern, architecture boundary, public contract, generated-source input, or reusable helper.

```markdown
Pattern or invariant:
Searches run:
In-scope usages updated:
Intentionally unchanged because:
Separate follow-up needed:
Verification covering the sweep:
```

Do not start an unbounded repo rewrite. Search exact symbols, aliases, routes, schema names, tests, and docs that are likely to share the same invariant. Update related usages when they are part of the same safe slice. If the sweep reveals a larger migration, stop and turn it into a named refactor, migration, or architecture decision.

## Directness And Fallback Discipline

Before adding a fallback, default, broad guard, legacy shim, or alternate path, answer:

```markdown
Primary path:
Failure or migration case:
Why direct fix is insufficient:
Fallback behavior:
How users/operators can tell fallback is active:
Test or manual verification:
Review/removal condition:
```

Do not add a fallback merely because the direct implementation failed during development. Switch to `debugging-loop.md`, find the cause, and fix the canonical path.

## Dependency Discipline

Before adding a dependency:

- check if an existing dependency or standard library can do the job
- verify license and maintenance risk for installable/public packages
- consider package size, transitive dependencies, and security posture
- update lockfiles intentionally
- avoid dependency upgrades bundled into unrelated feature work

## Stop Conditions

Stop and switch to `debugging-loop.md` when:

- a test, build, lint, type check, or runtime check fails unexpectedly
- the implementation depends on an assumption that may be wrong
- the change is expanding into unrelated architecture
- you cannot explain why the current slice is safe

## Anti-Patterns

| Anti-Pattern | Correction |
| --- | --- |
| "While I am here" cleanup | Save it as follow-up unless required. |
| Big rewrite before a failing test | Reproduce or isolate first. |
| New abstraction for one use case | Implement plainly, then refactor when duplication proves itself. |
| Parallel implementation beside the project's existing architecture | Use the canonical owner or pause for an architecture decision. |
| Local call-site patch for a shared contract problem | Fix the shared boundary or explicitly justify why only this call site is affected. |
| One-off "better" pattern in one module | Propagate it to related in-scope usages or keep the existing project pattern until an explicit migration is planned. |
| Fastest passing patch for durable behavior | Re-check the quality target and choose the best-fit, project-aligned implementation. |
| Broad repo refactor hidden inside a local fix | Split the refactor or get alignment before widening beyond the contract. |
| Silent fallback, default, or broad catch to make behavior appear fixed | Fix the primary path, or make the fallback explicit, tested, observable, and scoped. |
| Editing tests until green without proving the requirement changed | Keep the behavior contract stable; change tests only with evidence. |
| Skipping or narrowing tests to make the suite green | Treat the failure as evidence; switch to debugging if it is unexpected. |
| Editing generated output | Rebuild from canonical source. |
| Updating lockfiles by hand | Use the package manager and inspect the dependency-tree diff. |
| Mixing dependency upgrades with feature code | Split upgrades unless required for the task. |
| Continuing after a broken check | Diagnose before stacking more changes. |
