---
name: software-development-workflow
description: Use this skill when the user asks you to implement, fix, refactor, test, review, or finish software changes that are more than a tiny mechanical edit. Use for vague coding requests like "make it work" when scope, evidence, debugging, security, or completion discipline is needed. Do not use for research-only, project-knowledge-only, skill-authoring, handoff-only, or trivial one-line edits.
---

# Software Development Workflow

## Goal

Make coding agents behave like careful software engineers: define what is being changed, understand the existing system, make focused edits, debug from evidence, handle security risk explicitly, and only claim completion after verification.

## Core Principle

Use the smallest workflow that can safely finish the task, but do not confuse the smallest workflow with the cheapest patch. For non-trivial or durable work, choose the best-fit solution for the task's risk, lifetime, and project architecture.

Do not load every reference by default. Load only the `references/` files whose routing conditions match the current task.

This skill coordinates one software change from intent to evidence. It does not replace project knowledge, external research, skill authoring, or handoff skills; it calls or yields to them when their trigger is stronger.

## Use When

- The user asks to build, fix, refactor, test, review, or prepare code changes.
- The task changes behavior, touches multiple files, or depends on project conventions.
- A bug, failing test, broken build, runtime error, or unexpected behavior appears.
- The work has security, privacy, compatibility, migration, public API, or release risk.
- The agent is about to say a coding task is done.

## Do Not Use When

- The task is external/current research only; use `research-to-knowledge`.
- The task is durable repository knowledge work only; use `project-knowledge`.
- The task is creating, splitting, securing, or evaluating skills; use `write-agent-skill`.
- The task is only a temporary handoff; use `write-agent-handoff`.
- The task is a tiny local edit with obvious scope, no behavior change, and no need for workflow judgment.

## Existing Skill Order

This skill does not replace the core starter skills.

1. If the request changes skills, use `write-agent-skill` instead of this skill.
2. If project conventions, architecture, workflows, decisions, domain terms, or known gotchas may matter, use `project-knowledge` before coding.
3. If current external documentation, technology choice, dependency choice, or source-backed comparison may materially affect the implementation, use `research-to-knowledge` before coding.
4. If the request needs transfer state, use `write-agent-handoff` after or instead of this skill.

## Reference Router

Load references from `references/` only under these conditions:

| Reference | Read When | Skip When |
| --- | --- | --- |
| `references/task-contract.md` | Requirements are unclear, behavior changes, acceptance criteria are missing, or verification needs to be decided before code. | The task is a tiny mechanical edit and "done" is obvious. |
| `references/context-plan.md` | The change is multi-file, unfamiliar, architectural, API/DB/schema-related, dependency-related, likely to affect compatibility, or may need a local-vs-systemic decision. | The touched file and local pattern are already obvious. |
| `references/implementation-loop.md` | You are about to edit code, tests, config, or generated-source inputs. | You are only reviewing or diagnosing with no edits. |
| `references/debugging-loop.md` | A test/build/runtime failure, bug report, flaky behavior, or unexpected output appears. | You are implementing a planned change and nothing is failing. |
| `references/security-gate.md` | The task touches auth, authorization, PII, secrets, permissions, untrusted input, file uploads, payments, external integrations, destructive operations, or supply-chain risk. | There is no security or privacy boundary in the change. |
| `references/done-gate.md` | Before claiming work is complete, fixed, reviewed, ready, passing, or safe to ship. | Never skip for non-trivial coding tasks. |

If several references apply, read them in workflow order: task contract, context plan, implementation loop or debugging loop, security gate when relevant, then done gate.

## Workflow

1. Classify the request.
   - Tiny: obvious one-file mechanical edit, no behavior/risk. Make the edit and run the narrowest sensible check.
   - Standard: behavior or multi-file change. Use the task contract, context plan, implementation loop, and done gate.
   - Debug: failure or bug. Use the debugging loop first; return to implementation only after the root cause is understood.
   - High risk: auth, privacy, migrations, public APIs, release, destructive actions, or irreversible data. Use the security gate and ask only when a decision is genuinely blocking.
   - Current-sensitive or systemic: framework/library/API/dependency/security/build/release choices, shared invariants, or project-wide patterns. Use `research-to-knowledge` or `context-plan.md` before committing to a local implementation.
2. Pick the initial route. For non-trivial work, choose at least one of task contract, context plan, debugging loop, or security gate before editing; always use done gate before completion claims.
3. State the active route briefly when it helps the user understand why you are reading or verifying something.
4. Keep context tight. Prefer `rg`, targeted file reads, existing docs, and exact commands over broad repository scans.
5. Keep changes scoped to the contract, not artificially local. If the correct owner is shared or the new pattern must stay consistent across sibling flows, update the in-scope affected places or name the scope expansion before widening.
6. Verify after meaningful changes and before completion claims.
7. If durable knowledge changed, route the update through `project-knowledge`.

## Outputs

For normal coding tasks, finish with:

- What changed.
- What verification ran and what it proved.
- Anything not verified, with the reason.
- Follow-up risks only when they are real and related to the task.

## Failure Modes

| Failure | Recovery |
| --- | --- |
| The task route is unclear | Start with `references/task-contract.md` and define the smallest safe contract. |
| The change grows beyond the original scope | Stop, name the scope expansion, and ask or split the work. |
| Verification fails | Use `references/debugging-loop.md`; do not continue feature work on top of failure. |
| Security risk appears mid-task | Load `references/security-gate.md` before editing further. |
| Completion evidence is stale or partial | Load `references/done-gate.md`, rerun the relevant checks, and report only what the evidence supports. |
