# Linkrunner Docs

Public docs for [Linkrunner](https://www.linkrunner.io), built with [Mintlify](https://mintlify.com) and deployed to [docs.linkrunner.io](https://docs.linkrunner.io) via AWS Amplify on every push to `main`.

## Local dev

```bash
npm install -g mintlify
mintlify dev
```

Runs at [http://localhost:3001](http://localhost:3001) with live reload on `.mdx` saves.

## Project layout

```
.
├── docs.json              # Site config + sidebar order
├── introduction.mdx       # Landing page
├── quickstart.mdx         # 4-step onboarding
├── sdk/                   # Per-platform SDK guides
├── features/              # Core feature docs
│   └── skan-dashboard/    # Nested feature group
├── ad-networks/           # Meta, Google, TikTok, Snapchat, LinkedIn
├── analytics-integrations/# Mixpanel, Amplitude, GA4, PostHog, etc.
├── api-reference/         # REST API docs
├── billing/
├── ecommerce-manager/
├── testing/
├── snippets/              # Reusable MDX fragments
└── images/                # Screenshots and logos, organised by topic
```

## Writing rules

These are the rules to follow for every new page or edit. Some existing docs violate them; new work should not.

1. **Be concise.** One sentence beats three. If a step is "click Save", that is the whole step. Do not pad with restated context, "as mentioned above", or marketing-style flourishes.
2. **No em-dashes (`—`).** Use a period, a comma, parentheses, or rephrase. The arrow `→` for UI navigation paths is fine and encouraged.
3. **Add a screenshot wherever the user touches a UI.** If a step says "go to Settings > Integrations > Meta Ads", show what that looks like. Place images under `images/<topic>/` and reference them inline. Images compress walls of text into something users can skim.
4. **Second person, present tense.** "You" and "your app", not "the user" or "the developer".
5. **Bold for UI labels** (`**Save**`, `**Settings → Integrations**`), **backticks for code identifiers** (`init`, `getAttributionData`, `AndroidManifest.xml`).
6. **Use absolute internal links.** `/features/deep-linking-setup`, not relative paths. Dashboard links use `https://dashboard.linkrunner.io/...`.

### Em-dash replacements

| Avoid                                       | Use instead                              |
| ------------------------------------------- | ---------------------------------------- |
| `Linkrunner is an MMP — it tracks installs` | `Linkrunner is an MMP. It tracks installs` |
| `event — for example, Purchase`             | `event (for example, Purchase)`          |
| `delay — Apple sends postbacks late`        | `delay, because Apple sends postbacks late` |
| `not for these events — App Open and Sign Up are default` | `not for App Open and Sign Up, which are default` |

## Frontmatter

Every page starts with this block:

```mdx
---
title: "Page Title"
description: "One-sentence description, shown in search and social cards"
icon: "icon-name"
---
```

- `icon` is either a [Font Awesome name](https://fontawesome.com/icons) (`"rocket"`, `"webhook"`, `"apple"`) or a logo path (`"/images/logos/meta.webp"`).
- Add `sidebarTitle: "Short"` when the sidebar needs a shorter label than the page title.

## Page structure

- `##` for top-level sections, `###` for sub-sections.
- Number top-level sections when order matters (`## 1. Connect your account`, `## 2. Add event mapping`).
- End with a **Troubleshooting** section listing common failures and fixes.
- Close with a support line:

  ```mdx
  **Need help?** Contact [support@linkrunner.io](mailto:support@linkrunner.io)
  ```

## Mintlify components

Use these. They render consistently and Mintlify handles the styling.

```mdx
<Note>Neutral context, side info.</Note>
<Tip>Best-practice nudge.</Tip>
<Warning>Something that can break the integration.</Warning>
<Info>Brief clarification, often inside Steps/Tabs.</Info>

<Steps>
  <Step title="Connect your account">...</Step>
  <Step title="Map events">...</Step>
</Steps>

<Tabs>
  <Tab title="Android">...</Tab>
  <Tab title="iOS">...</Tab>
</Tabs>

<CardGroup cols={2}>
  <Card title="Deep Linking" icon="link" href="/features/deep-linking-setup">
    One-line teaser.
  </Card>
</CardGroup>

<AccordionGroup>
  <Accordion title="Why are my values null?">...</Accordion>
</AccordionGroup>
```

For embedded media: `<iframe>` for YouTube, `<video>` for hosted MP4s (see `ad-networks/meta-web-to-app.mdx`).

## Tab order for platform variants

When showing platform-specific code or steps, use this order so it stays consistent across the docs:

```
Android → iOS → React Native → Flutter → Expo → Capacitor → Cordova → Web → Unity
```

Drop platforms that do not apply. Do not invent new orderings.

## Images

- Store at `images/<topic>/<name>.png` (or `.webp` when the original is webp). Logos live under `images/logos/`.
- Reference as either:

  ```mdx
  ![Meta App ID screen](/images/meta-app-id.png)
  <img src="/images/meta-app-id.png" alt="Meta App ID screen" />
  ```

- Always set `alt` text. Crop screenshots to the relevant area; do not include the whole browser chrome.
- Prefer `.webp` for new screenshots when the source allows. Keep filenames lowercase with hyphens.

## Adding a new page

1. Create the `.mdx` file in the matching folder.
2. Add its path to the correct group in `docs.json`. **A page does not appear in the sidebar until it is listed there.**
3. If you are renaming or moving an existing page, add an entry under `redirects` in `docs.json` so old URLs do not 404.
4. Run `mintlify dev` and click through the new page.

## docs.json quick reference

- `navigation.tabs[0].groups` controls the sidebar groupings.
- Nested groups use `{ "group": "Name", "icon": "...", "pages": [...] }`.
- Redirects use `{ "source": "/old/path", "destination": "/new/path" }`.

## Internal link conventions

- SDK guides: `/sdk/<platform>` (e.g. `/sdk/react-native`).
- Features: `/features/<slug>`.
- Ad networks: `/ad-networks/<slug>`.
- Analytics integrations: `/analytics-integrations/<slug>`.
- API reference: `/api-reference/<slug>`.

When linking to a dashboard screen, paste the full URL with the right query params so the user lands exactly where the step expects:

```
https://dashboard.linkrunner.io/settings?s=meta-integration
https://dashboard.linkrunner.io/dashboard/integrations/meta-ads?tab=web_to_app
```

## What not to write

- **Marketing copy.** No "powerful", "seamless", "robust", "industry-leading". Just say what the thing does.
- **Restating the previous paragraph.** If a sentence does not add new information, delete it.
- **Speculative content.** Do not document features that are not shipped. If a flow is rolling out, hold the doc until it is live.
- **Tone shifts.** Pick one voice and keep it. Most pages are second-person, instructional, neutral.

## Contributing changes

Every change ships through a pull request. Do not push directly to `main`.

1. Branch off `main` (`git checkout -b <name>/<short-description>`).
2. Open a PR with a clear title and a one-paragraph summary of what changed and why.
3. **Assign `RathodDarshil` (Darshil) as the reviewer.** Merging is blocked until review.
4. After merge, Amplify auto-deploys the new content to [docs.linkrunner.io](https://docs.linkrunner.io).

```bash
gh pr create --reviewer RathodDarshil --title "..." --body "..."
```

## Deployment

Pushes to `main` deploy to [docs.linkrunner.io](https://docs.linkrunner.io) via AWS Amplify. See `DEPLOYMENT.md` for Amplify setup and rollback steps.

## Useful links

- [Mintlify components](https://mintlify.com/docs/components)
- [docs.json schema](https://mintlify.com/docs/settings/global)
- [Font Awesome icon search](https://fontawesome.com/search)
