# Linkrunner Docs (VitePress)

Linkrunner's documentation at [docs.linkrunner.io](https://docs.linkrunner.io), built with [VitePress](https://vitepress.dev) and run with [Bun](https://bun.sh). Converted from Mintlify on 3rd November 2026.

Before changing anything, read [AGENTS.md](AGENTS.md): where each kind of change goes, the writing rules, and the checks (`bun run check`, `bun run build:relay`). Agents load the skills in [skills/](skills/).

## Local development

```bash
bun install
bun run dev:relay      # http://localhost:3002 with live reload
bun run check          # typecheck, lint, agent files, page rules
bun run build:relay    # the build that ships, with every built-site check
bun run preview:relay  # serve that build locally
```

`bun run dev` and `bun run build` are the older classic theme, kept only for reference.

## Project layout

```
.
├── .vitepress/
│   ├── config.ts            # site config, nav + sidebar (from nav.json), search
│   ├── nav.json             # sidebar data and llms.txt agent instructions (edit by hand)
│   └── theme/
│       ├── index.ts         # registers the Mintlify-style components globally
│       ├── custom.css       # brand colors + component styles
│       └── components/       # Note, Tip, Warning, Info, Card, CardGroup,
│                            #   Steps, Step, Tabs, Tab, Accordion, Frame, Icon
├── public/                  # images, samples, API files, logo, favicon (served at site root)
├── scripts/                 # Bun migration + build tooling (see below)
├── introduction.md, quickstart.md, sdk/, features/, ...   # content (.md)
└── index.md                 # redirects / -> /introduction
```

## Authoring

Content is plain Markdown with the same components Mintlify used. They are
registered globally, so use them directly in any `.md` file:

```md
<Note>Neutral context.</Note>
<Tip>Best-practice nudge.</Tip>
<Warning>Something that can break the integration.</Warning>

<Steps>
<Step title="Connect your account">...</Step>
</Steps>

<Tabs>
<Tab title="Android">...</Tab>
</Tabs>

<CardGroup :cols="2">
<Card title="Deep Linking" icon="link" href="/features/deep-linking-setup">One-line teaser.</Card>
</CardGroup>

<AccordionGroup>
<Accordion title="Why are my values null?">...</Accordion>
</AccordionGroup>
```

Notes:
- Leave a blank line between a component's opening tag and its Markdown content
  (VitePress treats indented content as a code block).
- `icon` accepts a Font Awesome name (`rocket`, `apple`, `webhook`) or an image
  path (`/images/logos/meta.webp`).
- Internal links are absolute (`/features/deep-linking-setup`). Images live in
  `public/images/` and are referenced as `/images/...`.
- After adding a page, add it to the sidebar in `.vitepress/relay-nav.ts`.

## Converted from Mintlify

These pages were converted once from the Mintlify repository (MDX) by `scripts/convert.ts` and `scripts/gen-nav.ts`. Do not run them again: pages, `.vitepress/nav.json` and `.vitepress/redirects.json` are edited here now.

## Old docs.linkrunner.io links

Every link shared from the Mintlify site must keep working here, down to the
`#section`. `scripts/legacy-urls.json` lists what docs.linkrunner.io serves:
each page from its sitemap with the anchors on it (headings, accordions,
tabs), its redirects, and the files pages link to.

- Heading, tab and accordion ids are made the way Mintlify makes them
  (`.vitepress/mintlify-slug.ts`, wired in by `.vitepress/legacy-anchors.ts`
  for both builds), so `#1-open-create-link` is the same anchor on both sites.
- Pages the Relay build rewrote or merged map old anchors in
  `RELAY_ANCHOR_ALIASES` (`.vitepress/relay-content.ts`). Redirect stubs and
  the theme (`theme-relay/legacy-hash.ts`) apply them; the theme also opens
  the accordion or tab a link points into.
- `bun run build:relay` ends with `scripts/check-legacy-urls.ts`, which fails
  if any listed page, `/x/` or `/x.md` form, redirect, file or anchor stops
  resolving in `.vitepress/dist-relay`, or if a section link in our own pages
  points at a missing anchor. It runs offline. When it fails after a sync,
  add the renamed anchor to `RELAY_ANCHOR_ALIASES`.

`scripts/legacy-urls.json` is a frozen snapshot of what Mintlify served. Do
not refresh it with `bun run legacy-urls`: docs.linkrunner.io is this site now,
so a refresh would stop guarding the old URLs.

### Files for AI agents

The Relay build writes the same agent files Mintlify serves
(`.vitepress/agent-files.ts`, LIN-4579):

| URL | What |
|---|---|
| `/<page>.md` | Each page as Markdown, starting with a pointer to `llms.txt`. Pages link it with `<link rel="alternate" type="text/markdown">` |
| `/llms.txt`, `/.well-known/llms.txt` | Every page with its description, by sidebar section, after the agent instructions from docs.json `markdown.instructions` (synced into `nav.json` by `gen-nav.ts`) |
| `/llms-full.txt` | Every page in one file. The Linkrunner MCP `search_documentation` tool reads it: keep the `# Title` + `Source: <url>` header and stay under 2 MB |
| `/skill.md`, `/.well-known/skills/` | A short skill: how to read these docs, the MCP server, `@linkrunner/skills` |
| `/sitemap.xml`, `/robots.txt` | VitePress sitemap; robots allows crawling and AI use |

`bun run build:relay` ends with `scripts/check-agent-files.ts`, which fails if
a page is missing from any of them or the MCP parser can't read `llms-full.txt`.

Still not served (Firebase Hosting is static): Mintlify's `/mcp` docs search
server (agents use `https://mcp.linkrunner.io/mcp`, whose
`search_documentation` works before sign-in) and Markdown for an
`Accept: text/markdown` request to a page URL.

## Scripts (Bun)

```bash
bun run check                    # typecheck, lint, agent files, page rules
bun run build:relay              # build with every built-site check
bun run scripts/gen-redirects.ts # write redirect stubs into dist (runs in build)
bun run scripts/check-legacy-urls.ts # check old Mintlify URLs still resolve (runs in build:relay)
# One-time Mintlify conversion, kept for reference only: convert.ts, gen-nav.ts, legacy-urls.ts
```

Each Mintlify tab (Guides, Integrations, API Reference, Partners) becomes a
top-nav item with its own sidebar. `nav.json` stores each sidebar once plus a
path -> tab map; `.vitepress/theme/sidebar.ts` expands it at startup so the
sidebars are not copied into every page's inlined site data.

## Deployment

Every push to `main` builds the site and deploys it to Firebase Hosting site
`lr-docs-v2` (`.github/workflows/deploy-docs-v2.yml`), served at
https://docs.linkrunner.io.
