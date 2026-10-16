---
name: docs-implementation-audit
description: Use when reviewing docs quality and implementation parity.
version: 0.1.0
author: Darshil Rathod
---

# Docs vs implementation audit

Compare the reader's path with released behavior, then report evidence-backed gaps.
This is the team-shared adaptation of the existing docs-implementation-audit workflow.

## When to use

- Review setup, SDK, API, integration, or troubleshooting docs for accuracy and usability.
- Check platform differences, changed claims, or a page retirement before a docs PR.
- For drafting or copyediting, use the [writing skill](../linkrunner-docs-writing/SKILL.md).
- Report product defects separately. This workflow does not authorize product changes.

## Before review

Read [AGENTS.md](../../AGENTS.md), the canonical repository policy. Do not duplicate it here.
Confirm the selected pages, reader task, starting state, and authorized edit scope.
Use the assigned checkout without disturbing unrelated work. Never inspect `archive/`.
Start [review notes](templates/review-notes.md) and record unknowns rather than guessing.

## 1. Read as a customer first

Read the selected page and its linked prerequisites before examining implementation source.
Do not use code knowledge to fill gaps in the instructions during this pass.

- Can the reader identify the outcome, supported platform, version, and prerequisites?
- Can they follow the steps in order without guessing filenames, values, or credentials?
- Does each example agree with the surrounding prose and its platform tab?
- Is there an observable success condition and a useful next step when it fails?
- Are required details findable without hunting through unrelated pages?

Record the exact page section and where the reader gets stuck. Keep these notes separate
from later source findings so correct code cannot excuse incomplete instructions.

## 2. Establish behavioral evidence

Use the [source map](../linkrunner-docs-writing/references/sources-of-truth.md) when locating evidence.
Pair each claim under review with an authoritative source, or mark it unresolved.
Record a source path or URL, revision or package version, and relevant symbol or section.

- Published package artifacts establish released SDK methods, types, defaults, and version floors.
- Source code explains control flow. A repository branch alone does not prove released behavior.
- For deployed behavior, establish the deployed revision and trace its path separately.
- Official vendor contracts establish third-party requirements and identifiers, not competitor docs.
- Separate ingestion, storage, attribution, webhook delivery, reporting, and UI presentation.

Cross-check both directions: does the implementation require what the docs prescribe,
and do the docs explain required configuration or automatic behavior found in the implementation?
For claims spanning platforms, record each documented SDK and released version in a matrix.
Use present, absent, wrapper passthrough, or unresolved states. Never generalize from one SDK.

Do not make automatic production calls. Execute examples only in an authorized local or
sandbox environment. Any separate production inspection requires explicit authorization,
read-only bounded aggregates, and no customer identifiers, credentials, or raw payloads.
If access or evidence is missing, state what remains unverified. A count proves only its layer.

## 3. Classify findings and keep scope

Classify by reader impact, not the amount of text needed to fix the issue.

| Class | Use for |
| --- | --- |
| Blocker | Missing or wrong requirements, unsafe steps, broken paths, or claims that prevent reliable task completion. |
| Clarity | Ambiguous, misplaced, or imprecise information that adds guesswork without blocking completion. |
| Style | Wording or formatting that violates policy without changing meaning or execution. |

For every finding, record location, reader impact, evidence, and the smallest justified fix.
Track ownership separately: docs correction, product defect or decision, or unresolved evidence.
Do not change product code to make prose true or promise behavior that is not released.
Report baseline inaccuracies outside the selected scope without opportunistic rewrites.
Only make authorized docs edits. Keep disputed platform behavior explicit in the review.
For page moves or retirement, inspect navigation, incoming links, redirects, and replacement
coverage. Preserve useful guidance and verify that no dead destination remains.

## 4. Verify the artifact and examples separately

Discover the repository's actual checks. Run applicable rendering, route, MDX, and link checks.
Search changed claims and aliases for stale prose. Review changed URLs and the final diff.
Prove suspected checker false positives with the referenced file or authorized URL check.
Compare failures with the baseline before calling them pre-existing.

For procedural examples, follow the documented starting state and commands without hidden
setup. Check each displayed variant's imports, filenames, config, credential handling, and result.
Record the exact command, working directory, environment, platform/version, and observed output.
Keep rendering/link checks, offline fixtures, typechecks, native runtime tests, and live delivery
checks separate. Installation, compilation, or an accepted request does not prove delivery.
List untested variants, unavailable dependencies, access limits, and expected results not observed.
Do not install SDK dependencies or run services unless the task authorizes that scope.

## Completion

- Report findings in blocker, clarity, then style order with linked evidence and scope decisions.
- List exact tests and results, baseline failures, and every remaining untested claim or variant.
- Recheck the reader path after authorized edits. Disclose unresolved product decisions.
- Use concrete findings, not numeric scores, grades, or unsupported quality claims.
- Keep commits, pushes, PRs, and external changes subject to separate authorization.
