# Linkrunner Docs

Public documentation for [Linkrunner](https://www.linkrunner.io), built with Mintlify and published at [docs.linkrunner.io](https://docs.linkrunner.io).

This is the shared repository policy for Codex and Claude Code. `CLAUDE.md` imports this file. Keep one rule set here; put task-specific procedures in `skills/`.

## Working agreement

- Read this file before editing. For writing or restructuring a page, load [linkrunner-docs-writing](skills/linkrunner-docs-writing/SKILL.md). For behavioral claims, changed examples, or a docs review, load [docs-implementation-audit](skills/docs-implementation-audit/SKILL.md). Simple copyedits do not require an implementation audit.
- Skills live in `skills/`. The relative directory symlinks in `.agents/skills/` and `.claude/skills/` expose the same files to both agents. Do not maintain separate copies.
- Preserve unrelated work. If the checkout is dirty, use a separate worktree based on current `origin/main`; do not stash, reset, or commit someone else's changes.
- Change documentation, not product behavior, during a docs task. Report product defects separately.
- Do not inspect credentials or include customer data, tokens, or private payloads in examples, screenshots, test fixtures, or review notes. Use synthetic data.
- Production writes, test events sent to real accounts, publishing, merges, deployment tags, and auto-merge require explicit approval. A docs request is not permission to exercise a live integration.

## Writing rules

1. **Keep it easy to read.** Use the shortest explanation that preserves the required action, decision, and consequence. Do not remove prerequisites to reduce word count. Introduce one idea at a time.
2. **Write for a specific reader task.** Choose a quickstart, how-to, explanation, reference, or troubleshooting structure. Do not force every page into a tutorial template.
3. **Use second person and present tense.** Write "you" and "your app". Use "customers", not "clients". Avoid marketing copy and words such as "just", "obviously", "seamless", and "powerful".
4. **Do not use em dashes.** Split the sentence or use a comma. The arrow `→` is useful for UI navigation.
5. **Format meaning, not decoration.** Bold UI labels such as **Save** and **Settings → Integrations**. Use backticks for identifiers such as `init`, `getAttributionData`, and `AndroidManifest.xml`.
6. **Do not repeat the frontmatter description.** Mintlify displays it below the title. Start the body with new information, or omit a redundant opening paragraph.
7. **Explain the decision before the code.** State which case applies and which values are required. Keep mandatory instructions visible, not inside collapsed optional content.
8. **Separate the main path from alternatives.** Put optional configuration and uncommon failures after the primary task or in linked guidance. A necessary warning belongs before the risky step.
9. **Use screenshots where they resolve ambiguity.** Show difficult-to-find controls or important configuration choices. Do not add an image for every obvious click. Include useful alt text, crop with padding, and redact customer data before capture. See [screenshot guidance](skills/linkrunner-docs-writing/references/screenshots.md).
10. **Use root-relative product-doc links.** Write `/features/deep-linking-setup`, not a relative page path. Dashboard links must be full URLs pointing to the intended screen. Contributor and skill Markdown links are relative to their source files.

## Accuracy and example rules

- Verify changed behavioral claims against the appropriate source: released SDK artifact, applicable backend path, current UI, or official vendor contract. Local branch code does not prove a release or deployed behavior. See [sources of truth](skills/linkrunner-docs-writing/references/sources-of-truth.md).
- Do not invent requirements, supported versions, parameter meanings, timing guarantees, or automatic behavior. Resolve unsupported claims before publication; report blockers in review notes rather than padding the guide with investigation caveats.
- Provide the smallest complete example for the selected case. Include needed imports, the file or component where it belongs, and where values come from. Clearly label fragments and what surrounding context they assume.
- Make conditional code match conditional prose. Omit an optional override from the case that does not use it. A comment above an always-present field does not make that field conditional.
- Distinguish placeholder values from runnable commands. Never leave a success-looking message that proves more than the code actually checks.
- Explain responsibility boundaries when they affect the task: what the SDK handles automatically, what the app must call, and which identifier each system expects.
- Procedural pages need an observable result and relevant failure guidance. Distinguish an accepted request, completed processing, attribution, reporting visibility, and external delivery. Concept and reference pages do not need filler troubleshooting sections.
- Verify every changed platform variant against its own released interface. Do not infer Android, iOS, or another SDK's semantics from one wrapper.
- Typechecking, mocked behavior checks, native builds, runtime execution, and external delivery checks are different evidence. Record exactly what ran and what remains untested. A rendered page or successful docs build does not prove its examples work.

## Repository conventions

- `docs.json` defines navigation and redirects. Pages live under `sdk/`, `features/`, `ad-networks/`, `analytics-integrations/`, `api-reference/`, `billing/`, and the other existing topic directories. Shared MDX fragments live in `snippets/`.
- Match nearby MDX and use the existing Mintlify components. Read [Mintlify authoring](skills/linkrunner-docs-writing/references/mintlify.md) for frontmatter, components, images, and link examples.
- Use `##` for top-level sections and `###` for subsections. Number sections only when their order matters.
- Platform tab order is Android → iOS → React Native → Flutter → Expo → Capacitor → Cordova → Web → Unity. Omit platforms that do not apply.
- Add new pages to the correct navigation group. Add redirects when moving or renaming public routes, and update internal references.
- Store images under `images/<topic>/`, use lowercase hyphenated filenames, prefer WebP when supported, and never fabricate a screenshot of an unavailable UI.
- End public pages with the existing support line: **Need help?** Contact [support@linkrunner.io](mailto:support@linkrunner.io).

## Local checks

Run from the repository root:

```bash
npm run check:agents
npm run check:routes -- origin/main
```

These checks need Node.js 18+ and no dependency install. The first checks shared instructions, skill discovery, and contributor links. The route guard checks navigation and redirects, not all inline links, rendered pages, or SDK behavior.

For public-page changes, use the repository's Mintlify development flow and inspect the changed pages:

```bash
npm install -g mintlify
mintlify dev --port 3001
```

The preview is at http://localhost:3001. Check the installed CLI's supported commands before using additional validators. Run applicable example checks with pinned dependencies and document any unavailable runtime or access. Do not change dependency versions as an incidental part of a docs edit.

## Review and publication

- Use the [review notes template](skills/docs-implementation-audit/templates/review-notes.md). Record the reader task, behavioral evidence when applicable, exact checks and results, and untested cases. Pure copyedits can mark behavioral evidence not applicable.
- Block incorrect or unsafe examples and missing required steps. Fix ambiguous decisions and success conditions. Keep style preferences separate from correctness findings; word count is not a quality score.
- Open a non-draft PR against `main`; do not push directly to `main`. Request `RathodDarshil` as reviewer. If GitHub rejects self-review, report that limitation rather than substituting an approver or merging.
- Publishing requires separate approval. Inspect current workflows and deployment instructions before any release action; do not assume a local build deploys the site.
