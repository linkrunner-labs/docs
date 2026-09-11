# Mintlify authoring

Use this reference when editing page markup. Shared writing and safety policy lives in [AGENTS.md](../../../AGENTS.md).

## Frontmatter

Public pages use this shape:

```mdx
---
title: "Page title"
description: "One-sentence description shown below the title"
icon: "rocket"
---
```

Use an applicable Font Awesome icon or an existing logo path. Add `sidebarTitle` when navigation needs a shorter label. Do not repeat the description in the opening paragraph.

## Components

Match neighboring pages and use Mintlify components rather than custom styling. These are markup fragments, not complete pages:

```mdx
<Note>Neutral supporting context.</Note>
<Tip>Optional advice.</Tip>
<Warning>A consequence to understand before the next step.</Warning>
<Info>A short clarification.</Info>

<Steps>
  <Step title="Connect your account">Required instructions.</Step>
  <Step title="Map events">Required instructions.</Step>
</Steps>

<Tabs>
  <Tab title="Android">Android instructions.</Tab>
  <Tab title="iOS">iOS instructions.</Tab>
</Tabs>

<AccordionGroup>
  <Accordion title="Why are values missing?">Supplementary guidance.</Accordion>
</AccordionGroup>
```

Keep primary answers and mandatory steps outside accordions. Use `CardGroup` and `Card` for related-page links, an `iframe` for embedded YouTube content, and `video` for hosted MP4s only when needed. Follow the platform tab order in AGENTS.md.

## Navigation and links

- `docs.json` owns sidebar groups. Add a new page's extensionless route to the appropriate group.
- Nested groups use `group`, `icon`, and `pages`. Follow the surrounding structure instead of guessing a fixed array index.
- A moved public route needs an entry in `redirects` with `source` and `destination`, plus updated internal references.
- Public links use root-relative routes such as `/sdk/react-native`, `/features/deep-linking-setup`, and `/analytics-integrations/mixpanel`.
- Dashboard links use full URLs, including required query parameters. Verify the actual destination instead of guessing a route from a UI label.

## Images

Store images under `images/<topic>/` with lowercase hyphenated names. Use Markdown images or `img` with meaningful alt text. Prefer WebP when supported. Use the [screenshot procedure](screenshots.md) for capture, privacy, and padding.

## Preview and check

Run the local checks in AGENTS.md. Use the Mintlify preview for changed public pages and inspect tabs, warnings, code blocks, links, and images. The route guard checks navigation and redirects, not full Markdown rendering or every inline URL.

References: [Mintlify components](https://mintlify.com/docs/components), [site configuration](https://mintlify.com/docs/settings/global), and [Font Awesome icons](https://fontawesome.com/search).
