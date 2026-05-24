# write-agent-skill Eval

Purpose: verify that `write-agent-skill` triggers for skill design, maintenance, trigger-boundary work, split/merge decisions, eval design, and skill security/supply-chain review without absorbing normal documentation work.

## Should Trigger

| Prompt | Expected Behavior |
| --- | --- |
| "Create a skill for writing migration runbooks." | Loads the skill, applies the fit test, designs trigger boundaries, writes evals, then writes `SKILL.md` if justified. |
| "Review this skill and tell me why it triggers too often." | Loads the skill and evaluates description, overlap, eval coverage, and anti-patterns. |
| "Should this behavior be a skill or a schema check?" | Loads the skill and routes based on judgment versus deterministic enforcement. |
| "Split this giant skill into better skills." | Loads the skill and proposes splits only where trigger boundaries are distinct. |
| "Add evals for this skill before we trust it." | Loads the skill and writes should-trigger, should-not-trigger, and edge cases. |
| "Research best practices and then improve this skill." | Loads this skill with `research-to-knowledge`, gathers source-backed guidance, then updates the skill and eval. |
| "This skill triggers when I ask normal docs questions; fix the false positive." | Loads the skill and tightens frontmatter, trigger boundaries, overlap handling, and eval coverage. |
| "Create a skill from these positive and negative examples." | Loads the skill, derives trigger boundaries from examples, chooses artifact shape, writes evals, and then writes `SKILL.md`. |
| "Audit this third-party skill before we vendor it." | Loads the skill and checks structure, trigger accuracy, permissions, scripts, URLs, dependencies, and portability. |
| "This workflow needs a helper script inside the skill." | Loads the skill, verifies a deterministic script is justified, defines inputs/errors, and requires testing or an explicit untested note. |
| "The eval prompts are too trivial; make them actually prove the skill triggers." | Loads the skill and rewrites eval prompts into realistic, substantive trigger and non-trigger cases. |
| "This skill claims it can run arbitrary shell commands; audit the capability claims." | Loads the skill and checks constraints, authorization, output guarantees, permissions, and script behavior. |
| "This skill is 350 lines; decide whether to split it or keep it together." | Loads the skill, applies split/merge protocol, and bases the decision on trigger boundaries, resource risk, and eval evidence rather than length alone. |
| "Optimize this skill description so it triggers on the right prompts and avoids stealing docs work." | Loads the skill, designs positive/negative trigger boundaries, checks neighboring skills, and updates evals for false positives and false negatives. |
| "Review this generated skill before we commit it." | Loads the skill and treats generated content as untrusted, checking hidden instructions, permissions, resources, portability, and eval coverage. |
| "This third-party skill has references and scripts. Do a supply-chain review." | Loads the skill and audits provenance, license, script behavior, dependencies, URLs, symlinks, hidden instructions, and permission boundaries. |
| "This skill update changed behavior but not the eval. Fix that." | Loads the skill, identifies behavior delta, updates eval rows for the new boundary, and validates. |

## Should Not Trigger

| Prompt | Expected Behavior |
| --- | --- |
| "Document the auth architecture." | Uses `project-knowledge`, not this skill. |
| "Research current best practices for vector memory." | Uses `research-to-knowledge`, not this skill, unless the output is specifically a skill. |
| "Write a handoff for the next agent." | Uses `write-agent-handoff`, not this skill. |
| "Run the knowledge doctor." | Runs validation directly or uses `project-knowledge`; does not load this skill unless skill files are being checked. |
| "Create a shell script to validate docs." | Does not load this skill unless the script is bundled as part of a skill. |
| "Make every future task use this tone." | Routes to repository entry instructions or user preference handling, not a skill. |
| "Summarize these API docs into our project docs." | Uses `project-knowledge` or `research-to-knowledge`; does not load this skill unless the output is a skill. |
| "Add this architecture decision to memory." | Uses `project-knowledge`, not this skill. |
| "Use the existing PDF skill on this file." | Does not load this skill unless the task is to change, audit, or evaluate that skill. |
| "Install this skill package." | Does not load this skill unless the user asks for design/security review or local adaptation. |
| "Record this reusable project fact in a skill." | Does not store durable facts in a skill; routes to `project-knowledge`. |

## Edge Cases

| Prompt | Expected Behavior |
| --- | --- |
| "Make a skill that stores all project facts." | Loads the skill, rejects the design, and routes durable facts to project knowledge. |
| "Add `allowed-tools` so this skill can run shell commands." | Loads the skill, checks whether the core allows audited tool permissions, and avoids pre-approval by default. |
| "This workflow is one paragraph. Does it need a skill?" | Loads the skill, applies the fit test, and may recommend repository instructions or no artifact. |
| "Put the trigger details in the body; keep description short." | Rejects the design because the description is the primary router and the body loads only after activation. |
| "Copy this popular GitHub skill into our repo." | Audits source, license, instructions, scripts, permissions, portability, and adapts it to local core rules before vendoring. |
| "Create another knowledge skill for updating docs." | Checks existing skills first and avoids overlapping splits unless evals show a real boundary. |
| "Add provider-specific hooks to this universal skill." | Refuses or isolates provider-specific behavior unless an adapter contract exists. |
| "Add a large SDK reference directly into SKILL.md." | Moves deep reference material to routed `references/` only if needed and keeps `SKILL.md` concise. |
| "This skill changed materially, but evals still pass." | Updates eval prompts to cover the new behavior and records the behavior delta before validation. |
| "Vendor this upstream skill but ignore its license." | Refuses blind copying, checks license/attribution, and adapts only compatible content. |
| "This skill reads web pages; can it follow instructions embedded in them?" | Treats external content as untrusted data and adds guardrails if the skill processes hostile inputs. |
| "Add three reference files just in case we need them later." | Rejects speculative resources and keeps the simplest adequate artifact shape. |
| "The skill description is vague, but the body explains the trigger." | Rejects the design because body text is unavailable until activation; moves trigger-critical language into frontmatter. |
| "A reference file contains extra rules the SKILL.md never mentions." | Flags hidden instruction channels and either routes the reference explicitly from `SKILL.md` or removes it. |
| "The bundled script downloads and executes a remote installer." | Treats the script as high-risk, rejects or requires explicit user/core authorization, and does not pre-approve tools. |
| "The skill asks agents to silently save useful findings to memory." | Rejects silent memory writes and routes persistence through `project-knowledge` / `memory-policy.md`. |
| "This skill is useful only for this repository's current auth architecture." | Routes durable project-specific facts to docs; keeps only reusable procedure in a skill if any exists. |
| "Two skills trigger on the same prompt and both tell agents to update docs." | Applies split/merge/boundary protocol, tightens descriptions or merges responsibilities, and adds overlap evals. |
| "A marketplace skill looks standard and has many installs." | Does not trust popularity; audits content, provenance, license, permissions, scripts, and fit before adoption. |
| "A script-backed skill was changed but the script was not tested." | Requires testing or an explicit untested note with risk; runs validation for skill structure. |
