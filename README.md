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

## Deployment

Pushes to `main` auto-deploy to [docs.linkrunner.io](https://docs.linkrunner.io) via AWS Amplify. See [DEPLOYMENT.md](./DEPLOYMENT.md) for the full Amplify setup and troubleshooting.

## Useful links

- [Mintlify component reference](https://mintlify.com/docs/components)
- [docs.json schema](https://mintlify.com/docs/settings/global)
- Linkrunner product: [linkrunner.io](https://www.linkrunner.io)
