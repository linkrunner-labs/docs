# Linkrunner Docs (docs.v2)

Public documentation for [Linkrunner](https://www.linkrunner.io), built with VitePress and the Relay design system, published at [docs.linkrunner.io](https://docs.linkrunner.io). It replaced the Mintlify site on 3rd November 2026 (LIN-4601); the pages were converted from Mintlify MDX, so they keep Mintlify-style components and anchors.

This is the shared repository policy for Codex and Claude Code. `CLAUDE.md` imports this file. Keep one rule set here; put task-specific procedures in `skills/`.

## Where to edit (read first)

Edit pages here, in this repository. Each page is a `.md` file in its topic folder (`sdk/`, `features/`, `ad-networks/`, and the rest), and its URL is its path.

| Change | Where |
| --- | --- |
| Page text, code, a new page | The page's `.md` file. New pages also go in the sidebar |
| Images and downloadable files | `public/images/<topic>/`, `public/samples/`, `public/api-reference/` |
| Sidebar and top tabs | `.vitepress/relay-nav.ts` |
| Page titles that differ from the page, merged or hidden pages and their redirects, renamed anchors | `.vitepress/relay-content.ts` |
| Pages with custom layouts (Overview, Quickstart, merged pages) | `relay-pages/` |
| "Before you start" boxes | `.vitepress/relay-before-you-start.json` |
| Theme and components | `.vitepress/theme-relay/` (Relay tokens, see below) |
| Share cards and files for AI agents (`llms.txt`, `skill.md`) | `.vitepress/og.ts`, `.vitepress/agent-files.ts`. The agent instructions at the top of `llms.txt` are `agentInstructions` in `.vitepress/nav.json` |

`scripts/convert.ts` and `scripts/gen-nav.ts` converted the Mintlify repository once; do not run them. `.vitepress/nav.json` and `.vitepress/redirects.json` are now edited by hand.

## Working agreement

- Read this file before editing. For writing or restructuring a page, load [linkrunner-docs-writing](skills/linkrunner-docs-writing/SKILL.md). For behavioral claims, changed examples, or a docs review, load [docs-implementation-audit](skills/docs-implementation-audit/SKILL.md). Simple copyedits do not require an implementation audit.
- Skills live in `skills/`. The relative directory symlinks in `.agents/skills/` and `.claude/skills/` expose the same files to both agents. Do not maintain separate copies.
- Preserve unrelated work. If the checkout is dirty, use a separate worktree based on current `origin/main`; do not stash, reset, or commit someone else's changes.
- Change documentation, not product behavior, during a docs task. Report product defects separately.
- Do not inspect credentials or include customer data, tokens, or private payloads in examples, screenshots, test fixtures, or review notes. Use synthetic data.
- Production writes, test events sent to real accounts, publishing, merges, and auto-merge require explicit approval. A docs request is not permission to exercise a live integration.

## Writing rules

1. **Keep it easy to read.** Use the shortest explanation that preserves the required action, decision, and consequence. Do not remove prerequisites to reduce word count. Introduce one idea at a time.
2. **Write for a specific reader task.** Choose a quickstart, how-to, explanation, reference, or troubleshooting structure. Do not force every page into a tutorial template.
3. **Use second person and present tense.** Write "you" and "your app". Use "customers", not "clients". Avoid marketing copy and words such as "just", "obviously", "seamless", and "powerful".
4. **Do not use em dashes.** Split the sentence or use a comma. The arrow `→` is useful for UI navigation.
5. **Format meaning, not decoration.** Bold UI labels such as **Save** and **Settings → Integrations**. Use backticks for identifiers such as `init`, `getAttributionData`, and `AndroidManifest.xml`.
6. **Do not repeat the frontmatter description.** The site shows it below the title. Start the body with new information, or omit a redundant opening paragraph.
7. **Explain the decision before the code.** State which case applies and which values are required. Keep mandatory instructions visible, not inside collapsed optional content.
8. **Separate the main path from alternatives.** Put optional configuration and uncommon failures after the primary task or in linked guidance. A necessary warning belongs before the risky step.
9. **Use screenshots where they resolve ambiguity.** Show difficult-to-find controls or important configuration choices. Do not add an image for every obvious click. Include useful alt text, crop with padding, and redact customer data before capture. See [screenshot guidance](skills/linkrunner-docs-writing/references/screenshots.md).
10. **Use root-relative product-doc links.** Write `/features/deep-linking-setup`, not a relative page path or a full docs.linkrunner.io URL. A downloadable file, such as a Postman collection, keeps its full URL. Dashboard links must be full URLs pointing to the intended screen. Contributor and skill Markdown links are relative to their source files.

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

- Pages are Markdown with the Mintlify-style components this site registers globally. Read [VitePress and Relay authoring](skills/linkrunner-docs-writing/references/vitepress-relay.md) for frontmatter, components, images, links, and the docs.v2-only files.
- Every page has a `title` and a `description` in its frontmatter. Use `##` for top-level sections and `###` for subsections. Number sections only when their order matters.
- Platform tab order is Android → iOS → React Native → Flutter → Expo → Capacitor → Cordova → Web → Unity. Omit platforms that do not apply.
- Add new pages to the sidebar, and add a redirect when moving or renaming a public route. Old docs.linkrunner.io URLs and their `#section` anchors must keep working (`scripts/check-legacy-urls.ts`).
- Store images under `public/images/<topic>/` and reference them as `/images/<topic>/<file>`. Use lowercase hyphenated filenames, prefer WebP when supported, and never fabricate a screenshot of an unavailable UI.
- End public pages with the support line: **Need help?** Contact [support@linkrunner.io](mailto:support@linkrunner.io).
- Theme work uses the Relay design system (relay.linkrunner.io): semantic tokens from `theme-relay/tokens.css` (synced with `bun run relay:sync`), Phosphor icons, Inter and DM Mono. Do not add local palette overrides.

`bun run check:pages` enforces the frontmatter, em dash, link, image, tab order, and support line rules on every page docs.v2 serves, and that each page is in the sidebar (and, for `relay-pages/`, in `RELAY_PAGES`). Problems that already existed are counted per page in `scripts/check-pages-baseline.json`. The counts may only go down: one more problem on any page fails, and so does a fixed problem still counted in the file (lower it with `bun run check:pages -- --update-baseline`).

## Local checks

Run from the repository root with Bun 1.3:

```bash
bun install
bun run check          # typecheck, lint, agent files and page rules (fast, no build)
bun run build:relay    # docs.v2 build with every built-site check
bun run dev:relay      # preview at http://localhost:3002
```

`bun run check` runs `tsc --noEmit`, Oxlint (`.oxlintrc.json`, the same rules as the other Linkrunner repos; `bun run lint:fix` fixes what it can), `check:agents` (this file, `CLAUDE.md`, skill discovery and links) and `check:pages` on the sources. The Mintlify migration scripts (`convert.ts`, `gen-nav.ts`, `gen-relay-icons.ts`) may use `any` for the untyped MDX syntax tree. `build:relay` builds docs.v2 and fails on a classic sidebar page missing from the docs.v2 sidebar, a broken Ask AI link, an old docs.linkrunner.io URL or anchor that stops resolving, a gap in the files for AI agents, or a page link that goes nowhere (`check:pages --built`). CI runs both on every PR.

For public-page changes, open the changed pages in the `dev:relay` preview and inspect tabs, warnings, code blocks, links, and images, in light and dark mode and at a phone width. A successful build does not prove an example works.

## Review and publication

- Use the [review notes template](skills/docs-implementation-audit/templates/review-notes.md). Record the reader task, behavioral evidence when applicable, exact checks and results, and untested cases. Pure copyedits can mark behavioral evidence not applicable.
- Block incorrect or unsafe examples and missing required steps. Fix ambiguous decisions and success conditions. Keep style preferences separate from correctness findings; word count is not a quality score.
- Open a non-draft PR against `main`; do not push directly to `main`. Request `RathodDarshil` as reviewer. If GitHub rejects self-review, report that limitation rather than substituting an approver or merging.
- Merging to `main` publishes: `deploy-docs-v2.yml` deploys docs.linkrunner.io (Firebase Hosting site `lr-docs-v2`). Merging requires separate approval.

The writing rules, accuracy rules, and the writing and audit skills came from the Mintlify version of this repository (commit `78ca9ec`).
