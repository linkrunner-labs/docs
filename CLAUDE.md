# Linkrunner Docs — Writing Guide

This file defines the writing conventions for the Linkrunner documentation site. Follow these rules when creating or editing any page to keep the docs consistent.

## Branding

- Always write **Linkrunner** (capital L, lowercase r). Never "LinkRunner", "linkRunner", or "LINKRUNNER".
- Exception: SDK class names in code examples use the actual class name (`LinkRunner` in Kotlin/Dart/Swift, `linkrunner` in npm packages). Do not change these.
- The product is a **Mobile Measurement Partner (MMP)**.
- Dashboard URL: `https://dashboard.linkrunner.io`
- API base URL: `https://api.linkrunner.io/api/v1`
- Support email: `darshil@linkrunner.io`

## File format

- All pages are **MDX** files with YAML front matter.
- The site is built with [Mintlify](https://mintlify.com). Site config lives in `docs.json`.
- Every page must have front matter with `title`, `description`, and `icon`:

```yaml
---
title: "Page Title"
description: "One-sentence summary for SEO and navigation"
icon: "icon-name"
---
```

- Icons come from the [Font Awesome](https://fontawesome.com/icons) set (Mintlify subset).

## Tone and voice

- **Professional but approachable.** Write like you're explaining something to a smart colleague, not writing a legal document.
- **Second person.** Address the reader as "you" / "your".
- **Active voice.** "Linkrunner sends a POST request" not "A POST request is sent by Linkrunner".
- **Imperative for instructions.** "Install the SDK", "Enter your App ID", "Click Save".
- **Short paragraphs.** Keep paragraphs to 1-3 sentences. Docs are scanned, not read cover-to-cover.
- **No filler words.** Cut "simply", "just", "easily", "please note that" unless they genuinely add meaning.
- **No emojis** in documentation content.

## Structure

Every page should follow this general flow (skip sections that don't apply):

1. **Intro paragraph** — 1-2 sentences explaining what this page covers and why it matters.
2. **Core content** — The main explanation, setup steps, or reference material.
3. **Examples** — Real, runnable code examples with realistic data.
4. **Best practices** — Actionable recommendations (if applicable).
5. **Troubleshooting** — Common issues and solutions (if applicable).
6. **Related / Next steps** — Links to connected pages using `<CardGroup>`.
7. **Support footer** — `For any help please reach out to [darshil@linkrunner.io](mailto:darshil@linkrunner.io)`

### Headings

- Use `##` (H2) for top-level sections.
- Use `###` (H3) for subsections.
- Avoid H4+ — if you need that much nesting, restructure the content.
- Use sentence case for headings: "Ad network parameter mapping" not "Ad Network Parameter Mapping".

## Mintlify components

Use these components where appropriate:

### Notes, warnings, and tips

```mdx
<Note>
  Informational callout — useful context that isn't critical.
</Note>

<Warning>
  Critical information the reader must not miss. Use sparingly.
</Warning>

<Tip>
  Helpful suggestion that improves the reader's workflow.
</Tip>
```

### Cards

Use `<CardGroup>` with `<Card>` for navigation links and feature overviews:

```mdx
<CardGroup cols={2}>
    <Card title="Card Title" icon="icon-name" href="/path">
        Short description
    </Card>
</CardGroup>
```

### Tabs

Use `<Tabs>` when showing platform-specific content (React Native, Flutter, iOS, Android):

```mdx
<Tabs>
  <Tab title="React Native">
    Content for React Native
  </Tab>
  <Tab title="Flutter">
    Content for Flutter
  </Tab>
</Tabs>
```

### Steps

Use `<Steps>` for sequential processes:

```mdx
<Steps>
  <Step title="Step name">
    Description of what to do.
  </Step>
</Steps>
```

## Code examples

- Use fenced code blocks with a language identifier: ` ```json `, ` ```javascript `, ` ```bash `, ` ```dart `, ` ```kotlin `, ` ```xml `, ` ```tsx `.
- Use realistic but fake data in examples (e.g. `user_12345`, `sku_12345`, `order_98765`).
- Keep examples minimal — show exactly what's needed, nothing more.
- Add a short sentence before each code block explaining what it demonstrates.
- When showing API payloads, use 4-space indentation in JSON.
- For inline code, use backticks: `event_data`, `capture-event`, `linkrunner-key`.

## Tables

- Use Markdown pipe tables for parameter references and field descriptions.
- Standard columns for API parameters: `Parameter`, `Type`, `Description`.
- Mark required fields with **Required** in bold inside the description.
- Use `string \| null` for nullable types in TypeScript type tables.

```markdown
| Parameter | Type   | Description                          |
|-----------|--------|--------------------------------------|
| user_id   | string | **Required**. User identifier        |
| event_id  | string | Optional. Unique event ID            |
```

## Links

- Use relative paths for internal links: `[Event Capture API](/api-reference/event-capture)`.
- Use full URLs for external links: `[Meta for Developers](https://developers.facebook.com/)`.
- Use `mailto:` for email links: `[darshil@linkrunner.io](mailto:darshil@linkrunner.io)`.
- Dashboard settings links should include query params for direct navigation: `https://dashboard.linkrunner.io/settings?s=meta-integration`.

## Naming conventions

- Use **snake_case** for API parameter names, event names, and field names: `event_name`, `capture-event`, `product_id`.
- Use **kebab-case** for URL paths and file names: `custom-event-parameters.mdx`, `/api-reference/event-capture`.
- Ad network names: **Meta**, **Google Ads**, **TikTok**, **Snapchat**, **Apple Search Ads** (proper case).
- SDK names: **React Native**, **Flutter**, **iOS**, **Android**, **Expo**, **Web**.

## Common patterns

### API reference pages

```
- Base URL section
- Authentication section (with linkrunner-key header)
- Endpoint(s) with method and path
- Request body with JSON example
- Parameter table
- Response codes
- Sample response JSON
- TypeScript types (if applicable)
- Error handling table
- Support footer
```

### Feature/setup pages

```
- Overview paragraph with use cases
- Prerequisites or requirements (if any)
- Step-by-step setup (use <Steps> or numbered headings)
- Platform-specific content in <Tabs>
- Configuration options (tables)
- Testing/verification
- Troubleshooting
- Support footer
```

### SDK guide pages

```
- Installation instructions per platform
- Initialization code
- Core methods (signup, attribution, events, payments)
- Platform-specific tabs
- Method reference table (Method | Where to call | When to call)
- Full working example
- Support footer
```
