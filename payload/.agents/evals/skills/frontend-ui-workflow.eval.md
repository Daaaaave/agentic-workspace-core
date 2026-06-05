# frontend-ui-workflow Eval

Purpose: verify that `frontend-ui-workflow` triggers for frontend, UI, UX, visual-quality, design-system, responsive, accessibility, and design-to-code work without stealing backend-only, research-only, skill-authoring, knowledge, handoff, or trivial copy edits.

## Should Trigger

| Prompt | Expected Behavior |
| --- | --- |
| "Build the onboarding settings page and make it feel polished on mobile." | Loads the skill, discovers existing UI components/tokens, sets product-appropriate design intent, implements responsive states, and verifies the rendered UI on mobile and desktop. |
| "This dashboard looks like generic AI slop. Redesign it but keep the app architecture intact." | Loads the skill, audits the existing visual system, chooses a concrete product-fit direction, carries it through primary visual levers, avoids breaking existing user-facing functionality, and verifies screenshots. |
| "Make this finance ops dashboard feel more tasteful and less AI-generated, but keep it serious and dense." | Loads the skill, calibrates audience/product category/visual language/density/motion/restraint, improves the operational UI without decorative marketing excess, and verifies representative states. |
| "Implement this Figma screen in our app." | Loads the skill, treats Figma as design evidence, maps Figma primitives to existing project components/tokens, validates against screenshot/reference, and uses `software-development-workflow` for code changes. |
| "Review this UI diff for design-system drift before merge." | Loads the skill in review mode, checks hardcoded styles, duplicated components, state coverage, responsive risk, a11y risk, and reports findings by user impact with file/line evidence. |
| "The modal works, but keyboard focus and error states feel wrong." | Loads the skill, checks semantic structure, focus management, keyboard behavior, disabled/loading/error states, and verifies interaction behavior in the running UI if possible. |
| "Make the hero section less boring without changing the rest of the page." | Loads the skill, identifies product/audience/tone, makes a scoped visual improvement, avoids unrelated redesign, and verifies no layout overlap across viewports. |
| "Our buttons are inconsistent across three forms; fix the pattern." | Loads the skill, identifies the shared owner or canonical component, updates the shared variant when appropriate, and verifies affected sibling forms instead of patching one button. |
| "Polish the checkout flow for production." | Loads the skill, reviews hierarchy, spacing, responsive behavior, loading/error/disabled states, accessibility, primary interactions, and visual evidence before completion. |
| "The mobile nav clips long labels." | Loads the skill, treats it as frontend runtime/layout work, reproduces or inspects the responsive state, fixes the owner, and verifies long-label mobile behavior. |
| "We added a new card component; make sure it fits our design system." | Loads the skill, checks existing card primitives/tokens/spacing/elevation/interaction patterns, updates the component or local usage appropriately, and verifies state/responsive behavior. |
| "The page works, but it still feels default and unfinished. Do a design pass." | Loads the skill, chooses a product-fit point of view, improves composition/typography/spacing/color/media/motion where relevant, performs a craft pass, and verifies the rendered result. |

## Should Not Trigger

| Prompt | Expected Behavior |
| --- | --- |
| "Add a database index for faster search." | Uses `software-development-workflow`, not this skill, because the task is backend/data-only. |
| "Research the best current frontend design skills and cite sources." | Uses `research-to-knowledge`, not this skill, unless the user asks to implement or author the skill afterward. |
| "Create a new skill for frontend design." | Uses `write-agent-skill`, not this skill. |
| "Write a handoff for the UI work." | Uses `write-agent-handoff`, not this skill. |
| "Update the project docs with the design-system decision." | Uses `project-knowledge`, not this skill, unless UI code changes are also requested. |
| "Change the button text from Save to Submit." | Does not need this skill when it is a tiny copy-only edit with no layout or state risk. |
| "Summarize the CSS architecture." | Reads relevant files/docs directly or uses `project-knowledge`; does not load this skill unless review/change work is requested. |
| "Install Tailwind." | Uses `software-development-workflow` and possibly `research-to-knowledge`; this skill triggers only if the task includes UI/design-system implementation or review. |

## Edge Cases

| Prompt | Expected Behavior |
| --- | --- |
| "Fix this one input; it probably needs the shared form field too." | Loads the skill, checks whether the shared form field owns the invariant, updates shared owner or names scope expansion, and verifies affected usages. |
| "Use this beautiful Dribbble screenshot exactly." | Loads the skill, treats the screenshot as visual evidence, clarifies or preserves strict parity when truly requested, translates appropriate patterns into the project system, and avoids copying inaccessible/unmaintainable details blindly. |
| "The existing design system uses Inter and Lucide, but make it not look AI-generated." | Loads the skill, respects project-approved typography/icons, improves execution through hierarchy, spacing, content specificity, states, and composition instead of banning local conventions. |
| "Make this launch page feel tasteful; I do not have brand docs yet." | Loads the skill, makes a compact design read from audience/product/context, asks only if the direction truly diverges, chooses one memorable product-tied move, and avoids generic AI defaults. |
| "Use this reference as inspiration, but make it better for our product." | Loads the skill, treats the reference as direction rather than a ceiling, adapts it to local components/tokens, improves product fit/accessibility/responsiveness, and avoids literal copying unless strict parity is requested. |
| "Make this screen feel cleaner, more premium, and less flat." | Loads the skill, translates subjective direction into deliberate changes to hierarchy, density, visual weight, noise, motion, emphasis, and surface/background treatment without applying a preset aesthetic. |
| "Make it responsive; I cannot run the browser here." | Loads the skill, applies responsive constraints from code evidence, runs available checks, and reports runtime viewport behavior as unverified if no browser/screenshot evidence is possible. |
| "The Figma file has colors outside our token set." | Loads the skill, maps to nearest semantic tokens when appropriate, documents deliberate deviations, and asks only if brand fidelity versus system consistency is a blocking product decision. |
| "Build a settings panel that matches our installed company UI kit." | Loads the skill, finds the adopted local/external design-system owner, uses its components and tokens instead of imitating by hand, and verifies state/responsive behavior. |
| "Add a subtle animation to make the UI feel alive." | Loads the skill, uses motion only for feedback/continuity/comprehension/delight, respects reduced motion, and verifies performance/accessibility-relevant behavior. |
| "The UI bug is caused by a server response shape." | Loads `software-development-workflow` for the bug; keeps this skill only for rendering/state/UI verification if frontend behavior is affected. |
| "This landing page needs to be visually distinctive, but it is a B2B admin tool." | Loads the skill, chooses a restrained product-appropriate direction rather than decorative marketing excess, and verifies scanability/density. |
| "Make this government benefits form feel Awwwards-level." | Loads the skill, treats the requested aesthetic as a signal but lets trust, accessibility, clarity, and completion rate override spectacle. |
| "The component passes tests but looks broken." | Loads the skill, treats runtime visual evidence as required, inspects rendered layout/states, and does not claim done based only on tests. |
| "Move this repeated hardcoded color into tokens across the UI." | Loads the skill, identifies token ownership and affected usages, applies the migration in a scoped slice, and verifies no visual regressions in representative surfaces. |
| "Polish this sidebar; maybe add Framer Motion and a new icon pack if needed." | Loads the skill, uses the existing UI/icon/motion stack by default, adds dependencies only for a project-level need through the normal engineering workflow, and verifies rendered interaction states. |
