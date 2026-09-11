---
name: linkrunner-docs-writing
description: Use when writing or restructuring Linkrunner docs.
version: 0.1.0
author: Darshil Rathod
---

# Write Linkrunner documentation

Help a reader complete a task or understand a specific concept without guessing. Follow [AGENTS.md](../../AGENTS.md) for repository policy. This skill does not authorize product changes, publication, or live integration calls.

## When to use

- Write or substantially revise SDK setup, integration, feature, API, billing, or troubleshooting documentation.
- Turn verified implementation behavior into instructions a customer can follow.
- Simplify a page without losing a prerequisite, decision, or meaningful warning.

For punctuation-only edits, use the shared style rules without running this entire workflow. For disputed behavior or a review, use [docs-implementation-audit](../docs-implementation-audit/SKILL.md).

## Before drafting

1. **State the reader task.** Identify the reader, starting state, and desired outcome. For an explanation, name the question the page answers instead of inventing a setup task.

   Done when you can describe the page's purpose in one sentence and distinguish it from nearby pages.

2. **Choose the structure.** Read the applicable [page-type outline](templates/page-types.md). Use a quickstart for a first working result, a how-to for an existing user's task, reference for exact contracts, explanation for concepts, or troubleshooting for a known symptom. Do not add every template heading to every page.

   Done when the main path and material alternatives are clear before prose is written.

3. **Establish the facts.** Use the [source guide](references/sources-of-truth.md) to verify changed claims. Resolve required accounts, permissions, SDK versions, filenames, call order, values, defaults, automatic behavior, and result semantics only where relevant. Inspect the applicable released platform rather than copying another SDK's example.

   Done when each new requirement or guarantee has a source, or the unresolved claim is recorded as a blocker. Do not fill a gap with plausible prose.

## Draft the page

4. **Put decisions before actions.** Name prerequisites before the step that needs them. State who should use each branch before its code. Keep required actions visible without expanding an accordion. Introduce one concept at a time.

   Done when a reader can choose a path before copying an example.

5. **Write the smallest complete example.** Include imports, placement, prerequisites, and real API names. Label fragments and their assumed context. Explain where replacement values come from. Omit optional fields from branches that do not use them, rather than leaving them in the payload with a conditional comment.

   Done when the code implements the prose for that exact case. Use the [annotated examples](references/annotated-examples.md) to review conditional fields and success claims, not as a permanent SDK contract.

6. **Explain the result.** Say what the reader should inspect and what it proves. Distinguish SDK initialization, request acceptance, processing, attribution, reporting visibility, and external delivery. Document timing only when supported by the relevant behavior. Pair material failures with a diagnostic check and a next action.

   Done when the reader can recognize the task's result without interpreting an ambiguous success log. Reference and explanation pages need an understandable answer, not a manufactured runtime check.

7. **Edit for reading effort.** Remove repetition and marketing language. Preserve required context even when it adds words. Move optional configuration, uncommon errors, and background explanations out of the main path. Use a screenshot only when it clarifies a UI choice or location.

   Done when every main-path paragraph affects the reader's action or understanding. Do not turn all investigation limitations into customer-facing warnings.

For MDX mechanics, use [Mintlify authoring](references/mintlify.md). For actual image capture, read [screenshot guidance](references/screenshots.md). Do not load these references merely to copyedit prose.

## Verify and hand off

8. **Exercise what changed.** Run `npm run check:agents` and `npm run check:routes -- origin/main` from the repo root. For public-page edits, inspect the rendered page and changed links. Follow procedural examples from their stated starting point in an authorized local or sandbox environment where feasible.

   Test code extracted from the actual documented block, not a hand-maintained replacement. Pin the package versions used by the test. A fragment needs a labelled minimal fixture for its stated context; the fixture must not silently repair missing imports or required inputs. Typechecking and mocked tests do not prove native execution or delivery. These repo checks currently do not run SDK examples or test the docs renderer.

   Done when the exact checks and outcomes are recorded, with untested platforms and unavailable runtimes listed separately. A docs build is not a substitute for a behavioral test.

9. **Review against the task.** Use the audit skill and its [review notes](../docs-implementation-audit/templates/review-notes.md). A reviewer should first attempt the reader task from the page alone, then compare their interpretation with implementation evidence. Address correctness blockers before style preferences.

   Done when the page has no unresolved required step or unsupported guarantee, and remaining verification limits are visible to the reviewer. Do not claim measured readability gains without reader results.

## Pitfalls

- Shortening a page by deleting the prerequisite that made it usable.
- Treating a comment as a conditional branch in executable code.
- Copying another company's product semantics along with its communication pattern.
- Adding retries, guards, or lifecycle changes that the product does not require just to make a sample look defensive.
- Treating a returned promise or an accepted API request as the final business outcome.
- Showing raw research uncertainty in public prose instead of resolving the claim or blocking publication.
- Expanding a focused docs change into an unrelated SDK repair or site redesign.

## Completion checklist

- Reader task and page type are explicit.
- Required decisions precede their actions and code.
- Changed claims and each changed platform agree with applicable sources.
- Examples are complete for their declared context; placeholders and optional fields are unambiguous.
- The page explains its result without overstating what was verified.
- Relevant checks ran, and the review notes distinguish evidence from untested behavior.
