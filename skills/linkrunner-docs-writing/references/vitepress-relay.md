# VitePress and Relay authoring

Use this reference when editing page markup. Shared writing and safety policy lives in [AGENTS.md](../../../AGENTS.md).

## Page shape

Every page, including those in `relay-pages/`, looks like this:

```md
---
title: "Page title"
description: "One-sentence description shown below the title"
---

# Page title

<p class="vp-lead">One-sentence description shown below the title</p>

The first paragraph adds new information.
```

- `title` and `description` are required (`check:pages`). The description also becomes the search snippet, the share card text, and the page's line in `llms.txt`, so make it a complete sentence about the reader's task.
- The `# Title` and the `vp-lead` paragraph repeat the frontmatter, because VitePress does not draw them itself. Keep them identical to it. Do not repeat the description again in the first paragraph.
- Change a page's title in its frontmatter (and its `# Title` and lead). `PAGE_TITLES` in `.vitepress/relay-content.ts` overrides some titles and sidebar labels; check it first, since an entry there wins over the page.

## Components

These are registered globally; use them directly. Leave a blank line between a component's opening tag and its Markdown content, or VitePress renders the content as a code block. These are markup fragments, not complete pages:

```md
<Note>

Neutral supporting context.

</Note>

<Tip>Optional advice.</Tip>
<Warning>A consequence to understand before the next step.</Warning>
<Info>A short clarification.</Info>

<Steps>

<Step title="Connect your account">

Required instructions.

</Step>

</Steps>

<Tabs>

<Tab title="Android">

Android instructions.

</Tab>

<Tab title="iOS">

iOS instructions.

</Tab>

</Tabs>

<AccordionGroup>

<Accordion title="Why are values missing?">

Supplementary guidance.

</Accordion>

</AccordionGroup>

<CardGroup :cols="2">
<Card title="Deep linking" icon="link" href="/features/deep-linking-setup">One-line teaser.</Card>
</CardGroup>
```

- Keep primary answers and mandatory steps outside accordions.
- Platform tabs follow the order in AGENTS.md (`check:pages` checks it).
- `icon` takes a Font Awesome name (`rocket`, `apple`, `webhook`) or an image path (`/images/logos/meta.webp`). The Relay theme draws the same names with Phosphor icons.
- Use `Frame` for a captioned screenshot, an `iframe` for embedded YouTube content, and `video` for hosted MP4s only when needed.
- A heading can set its anchor with `## Title {#short-id}`. Keep existing anchors: old docs.linkrunner.io links point at them, and `build:relay` fails when one stops resolving. Add a renamed anchor to `RELAY_ANCHOR_ALIASES`.
- `<BeforeYouStart />` boxes come from `.vitepress/relay-before-you-start.json`; do not write them in the page.

## Add a page with a custom layout

An ordinary page is just a `.md` file in its topic folder plus a sidebar entry. Use `relay-pages/` only for a page with a custom layout (like the Overview or Quickstart):

1. Write it at `relay-pages/<route>.md` with the page shape above. A file whose route matches a topic-folder page replaces that page.
2. Add `"<route>.md"` to `RELAY_PAGES` in `.vitepress/relay-content.ts`. Without it the page is published at the wrong address, `/relay-pages/<route>` (`check:pages` fails).
3. Add it to the sidebar in `.vitepress/relay-nav.ts` (`check:pages` fails otherwise). If it should be a tab's landing page, change that tab's `link` in `relayNav` too.
4. Check that an existing page does not already cover it (for example `relay-pages/ad-networks/overview.md` already introduces every integration). Merging into it is often better than a new page.

The landing pages in `relay-pages/` also use layout components: `OverviewHero`, `GuideCards`, `LinkGrid` (link lists from frontmatter data), `SectionLabel`, `HelpBox`, and `BeforeYouStart`. Use them only in `relay-pages/`, and copy their usage from the page that already has them. Other pages stick to the components above.

## Navigation, redirects, and links

- The sidebar and top tabs are in `.vitepress/relay-nav.ts`. `check:pages` fails if a page is missing from it. Groups built with `classicGroup(...)` (Analytics tools, Product catalogues, APIs, Partners) list their pages from the `sidebars` in `.vitepress/nav.json`, so add a page to those groups there.
- A page merged into another or hidden goes in `RELAY_REDIRECTS` in `.vitepress/relay-content.ts`, with the destination that now has its content. Other moved or renamed pages get an entry in `.vitepress/redirects.json` (`source`, `destination`).
- Public links use root-relative routes such as `/sdk/react-native` and `/features/deep-linking-setup`, never `./page` or a full docs.linkrunner.io URL. `check:pages` checks these and that every link resolves.
- Dashboard links use full URLs, including required query parameters. Verify the actual destination instead of guessing a route from a UI label.

## Images

Store images under `public/images/<topic>/` with lowercase hyphenated names and reference them as `/images/<topic>/<file>`. Prefer WebP when supported. Use the [screenshot procedure](screenshots.md) for capture, privacy, and padding. `check:pages` fails on an image path that is not in `public/`.

## Generated for every page

Do not write these by hand. The build makes them from the page:

| Output | From |
| --- | --- |
| Share card and Open Graph tags | `title`, `description`, sidebar group (`.vitepress/og.ts`) |
| `<page>.md` copy, `llms.txt`, `llms-full.txt` | the page source (`.vitepress/agent-markdown.ts`, `.vitepress/agent-files.ts`) |
| Sitemap, search index | every built page |

## Preview and check

Run the local checks in AGENTS.md. Use `bun run dev:relay` (http://localhost:3002) for changed pages and inspect tabs, warnings, code blocks, links, and images, in light and dark mode and at a phone width.

References: [VitePress Markdown](https://vitepress.dev/guide/markdown), [Relay design system](https://relay.linkrunner.io), and [Font Awesome icons](https://fontawesome.com/search).
