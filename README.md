# Linkrunner Docs

Public documentation for [Linkrunner](https://www.linkrunner.io), built with [Mintlify](https://mintlify.com) and published at [docs.linkrunner.io](https://docs.linkrunner.io).

## Develop locally

Requires Node.js 18+.

```bash
npm install -g mintlify
mintlify dev
```

The dev server runs on [http://localhost:3001](http://localhost:3001) and live-reloads as you edit `.mdx` files.

## Project layout

```
.
├── docs.json              # Site config + navigation (sidebar order lives here)
├── introduction.mdx       # Landing page
├── quickstart.mdx         # Getting started guide
├── sdk/                   # Per-platform SDK guides (web, iOS, Android, RN, Flutter, ...)
├── features/              # Core feature docs (deep linking, SKAN, referrals, ...)
├── ad-networks/           # Meta, Google, TikTok, Snapchat, LinkedIn integration guides
├── analytics-integrations/
├── api-reference/
├── billing/
├── testing/
├── snippets/              # Reusable MDX snippets
└── images/, logo/         # Static assets
```

## Adding a page

1. Create the `.mdx` file in the appropriate folder.
2. Add its path to the right group in `docs.json` — pages only appear in the sidebar once they're listed there.
3. Run `mintlify dev` to preview.

## Writing with Claude or Codex

Start with [AGENTS.md](./AGENTS.md), the shared repository policy. Claude loads it through `CLAUDE.md`; Codex reads it directly. The [writing skill](./skills/linkrunner-docs-writing/SKILL.md) covers drafting, and the [audit skill](./skills/docs-implementation-audit/SKILL.md) covers reader-task and implementation review.

The checked-in `.claude/skills/` and `.agents/skills/` directory symlinks point to the same canonical files under `skills/`. No separate skill install is needed in a symlink-capable checkout. On Windows, use a checkout with Git symlinks enabled and the required OS permissions. If your tool cannot load a symlink, read the canonical `SKILL.md` explicitly rather than maintaining another copy. Start a fresh agent session after pulling changes and confirm these repository skills appear in its skill list.

Run the lightweight checks from the repository root, without installing dependencies:

```bash
npm run check:agents
npm run check:routes -- origin/main
```

These validate the instruction import, skill discovery paths, contributor reference files, and navigation/redirects. They do not render the docs, typecheck SDK snippets, run native apps, or verify live integrations. Record those checks separately using the [review notes template](./skills/docs-implementation-audit/templates/review-notes.md). No readability score is used.

## Deployment

Pushes to `main` auto-deploy to [docs.linkrunner.io](https://docs.linkrunner.io) via AWS Amplify. See [DEPLOYMENT.md](./DEPLOYMENT.md) for the full Amplify setup and troubleshooting.

## Useful links

- [Mintlify component reference](https://mintlify.com/docs/components)
- [docs.json schema](https://mintlify.com/docs/settings/global)
- Linkrunner product: [linkrunner.io](https://www.linkrunner.io)
