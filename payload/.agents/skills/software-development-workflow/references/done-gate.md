# Done Gate

## Goal

Prevent false completion claims. A coding task is done only when the diff matches the task contract and fresh evidence supports the claim.

## Read When

- You are about to say work is complete, fixed, ready, passing, reviewed, or safe.
- You are preparing a final response, commit, PR, release note, or handoff for a coding task.
- A verification command has passed and you need to decide whether more evidence is required.
- A verification command failed, skipped work, or ran before later edits.
- You are asked whether a branch, diff, package, or generated output is ready.

## Gate Steps

1. Re-read the task contract or user request.
   - Check every acceptance criterion.
   - Confirm non-goals stayed out of scope.
   - Reconcile any scope changes, user corrections, or newly discovered constraints.
2. Inspect the actual change.
   - Use the current diff/status, not memory or previous summaries.
   - Include staged, unstaged, untracked, deleted, generated, and package/artifact files.
   - Confirm generated files were rebuilt, not hand-edited.
   - Confirm no unrelated files were changed accidentally.
   - Confirm no edits happened after the last verification command that would invalidate it.
3. Map claims to evidence.
   - For each important acceptance criterion, name the command, test, artifact, or manual observation that proves it.
   - Prefer the narrowest evidence that proves the behavior, then add broader checks when the touched surface warrants them.
   - If evidence is impossible in this environment, mark the claim as unverified before the final response.
4. Run fresh verification.
   - Targeted tests for the changed behavior.
   - Build/type/lint checks when the touched surface warrants them.
   - Runtime/browser/manual checks when tests cannot prove the user-visible behavior.
   - Original reproduction for bug fixes.
   - Package, migration, generated-file, or release-artifact checks when the claim depends on what will ship.
   - Verification is valid only when the command completed, the exit code/result is known, and it ran after the last relevant edit.
5. Read the output.
   - Check exit code, failures, warnings, skipped tests, and partial runs.
   - Check for focused tests, skipped tests, snapshot churn, quarantined tests, flaky retries, or silently narrowed command scope.
   - Do not turn partial success into full success.
   - Distinguish baseline failures from failures introduced by this change.
   - If the output is too large, preserve the first meaningful failure and summarize the rest.
6. Self-review the diff.
   - Correctness: requirements, edge cases, error paths.
   - Tests: meaningful assertions, regression coverage, no brittle noise, no tautological checks, no weakened expectations.
   - Maintainability: simple code, local patterns, names, no speculative abstraction.
   - Solution quality: the chosen approach matches the task's risk, lifetime, installed versions, current evidence needs, and project architecture.
   - Compatibility: API/schema/config/generated/release impact.
   - Architecture fit: no parallel subsystem, duplicated owner, local symptom patch for a shared invariant, or unexplained drift from accepted project patterns.
   - Impact radius: shared invariants, repeated patterns, sibling flows, generated-source inputs, and docs were updated, intentionally left alone, or split into an explicit follow-up.
   - Fallback discipline: no silent defaults, broad catches, compatibility shims, or alternate paths that hide a broken primary path.
   - Security/privacy: run `security-gate.md` if a trust boundary exists.
   - User experience: accessibility, visual, copy, and runtime behavior when the diff affects UI or user-visible output.
7. Resolve or disclose gaps.
   - If a relevant check fails and the failure is introduced by this change, fix it or say the work is not done.
   - If a relevant check has a known baseline failure, say so and do not claim the whole suite passes.
   - If a check cannot run, say why and name the exact risk left unverified.
   - Do not rely on "CI will catch it" as local evidence unless CI output is actually available and current.
8. Run memory closure.
   - Ask whether the task produced a durable project fact, decision, workflow, runbook, API/domain invariant, reusable gotcha, user correction, or external research conclusion.
   - If yes, route it through `project-knowledge`; this gate does not own memory classification, writing, correction, or deletion.
   - If the task changed authored docs or durable knowledge, rebuild generated indexes and run knowledge validation before claiming done.
   - If only temporary transfer state is needed, use `write-agent-handoff`.
   - If the candidate is routine, transient, private, unsafe, unsupported, generated-only, or already captured, do not promote it.
9. Decide whether a handoff is needed.
   - Use `write-agent-handoff` only for temporary transfer state.
10. Report with evidence.

## Evidence Matrix

Use this for high-risk, multi-file, release, or review tasks:

```markdown
Claim or acceptance criterion:
Touched files:
Evidence command/artifact/manual check:
Result:
Still unverified:
```

## Memory Closure

Done gate owns the final check that memory might need updating. It does not own the memory write policy.

| Candidate | Route |
| --- | --- |
| Durable project fact, convention, decision, architecture, runbook, workflow, API/domain invariant, or reusable gotcha | Use `project-knowledge` and its memory policy. |
| Source-backed external finding that changes project knowledge or implementation rules | Use `research-to-knowledge` for evidence, then `project-knowledge` if it should persist. |
| Temporary branch/workspace state, next action, blocker, or delegation context | Use `write-agent-handoff` only. |
| Raw transcript, routine command output, generated output, private data, unsafe content, unsupported speculation, or duplicate fact | Do not promote to durable memory. |
| Authored docs or durable knowledge changed | Rebuild generated indexes and run the knowledge validation command before final completion claims. |

Do not hide durable facts in a final response, `.context/`, a handoff, or this skill. Do not duplicate the same memory policy here; route to the skill that owns it.

## Final Response Shape

For coding tasks:

```markdown
Changed:
Verified:
Not verified:
Notes:
```

Keep it concise. Include paths and commands when useful. If verification could not run, say exactly why and avoid completion claims that depend on it. Do not say "all checks pass" when any relevant check failed, was skipped, was narrowed unexpectedly, or did not run.

## Completion Claim Rules

| Claim | Required Evidence |
| --- | --- |
| "Tests pass" | Fresh test command output with success, no unexpected focused/skipped/quarantined tests, and command scope stated. |
| "Build passes" | Fresh build/type command output with success after the latest relevant edit. |
| "Bug fixed" | Original reproduction now passes, the causal chain/root boundary is identified, and a regression guard exists when feasible. If the original reproduction cannot run, say what substitute evidence was used and avoid overstating root-cause certainty. |
| "Feature works" | Acceptance criteria matched to behavior tests or runtime/manual evidence, not only lint/type checks. |
| "Ready for review" | Current diff/status reviewed, relevant checks run, open risks named, and unrelated dirty files separated. |
| "Ready to merge/ship/release" | Fresh local or CI evidence for the release path, package/artifact contents checked when relevant, migrations/generated docs handled, and unresolved risks named. |
| "Architecture-compatible" | Existing owner/pattern checked, shared boundaries respected, and any new abstraction or wider fix is justified by the task contract or user/project decision. |
| "Best-fit solution" | The task's quality target is met, current/version-matched evidence was used when needed, and rejected shortcuts or new dependencies/patterns are justified by project constraints. |
| "Systemically applied" | Related in-scope usages of the same invariant or pattern were searched, updated or intentionally left unchanged, and verified with relevant tests or checks. |
| "Fallback is safe" | Fallback trigger, degraded behavior, observability, tests/manual verification, and review/removal condition are explicit. |
| "No security impact" | Security gate skipped for a stated reason or relevant boundary checked. |
| "Only generated files changed as expected" | Generated output matches a just-run build from authored sources. |
| "Refactor only/no behavior change" | Diff reviewed for behavior deltas and existing/characterization checks support unchanged behavior. |
| "Manual check passed" | Exact manual steps or artifact observed, environment named when it matters. |

## Anti-Patterns

| Anti-Pattern | Correction |
| --- | --- |
| "Should work" | Run verification or say it is unverified. |
| Trusting previous command output after more edits | Re-run the affected command. |
| Reporting only happy-path checks | Mention skipped, manual, or missing evidence. |
| Treating lint as proof of behavior | Run behavior tests or manual checks. |
| Saying "tests pass" after running only a narrowed or focused subset | State the subset, or run the intended broader command. |
| Weakening, skipping, or snapshot-updating tests to get green | Treat the test change as part of the diff and justify it with requirements evidence. |
| Hiding baseline failures | Report them separately and avoid claiming the change caused or fixed them. |
| Assuming CI will catch anything missed | Use available CI output as evidence or state that CI remains unverified. |
| Claiming a package/release is ready without inspecting the artifact | Run the package/release dry-run or artifact inspection command. |
| Ignoring untracked or deleted files in the final summary | Inspect status and separate related changes from unrelated dirty worktree state. |
| Calling a mitigation a fix | Say it is mitigation, preserve evidence, and name the remaining root-cause work. |
| Accepting a sidecar implementation that bypasses project architecture | Route through `context-plan.md` and justify the owner or ask for architecture alignment. |
| Calling the quickest passing patch "best" | Check the quality target and evidence for the approach before making a completion claim. |
| Leaving a new local convention inconsistent with sibling code | Run a consistency sweep or name the transition/follow-up explicitly. |
| Hiding a broad refactor inside a local task | Split or align on the wider change and report only what this slice actually completed. |
| Treating fallback-heavy code as robust by default | Require explicit fallback contract, observability when relevant, and tests. |
| Final answer without changed/verified summary | Summarize the actual diff and evidence. |
