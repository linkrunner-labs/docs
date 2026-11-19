---
title: Linkrunner documentation
titleTemplate: false
description: See which campaigns bring installs, signups and revenue. Guides for marketers and setup guides for developers.
pageClass: lr-overview
outline: [2, 2]
prev: false
next:
  text: Connect your ad channels
  link: /ad-networks/overview
moreLinks:
  - text: Analytics integrations
    link: /analytics-integrations/mixpanel
  - text: Data APIs and webhooks
    link: /api-reference/data-apis
overview:
  eyebrow: Linkrunner documentation
  title: See what drives installs and revenue.
  lead: Linkrunner is a mobile measurement partner (MMP). Connect your campaigns, see where users come from, and measure what they do after installing your app.
  flow:
    label: From campaign to outcome
    steps:
      - text: Campaign click
        detail: Know which channel sent the visit
        link: /ad-networks/overview
      - text: App install
        detail: Connect the install to its source
        link: /quickstart
      - text: User action
        detail: Measure signups and purchases
        link: /features/events-tab
      - text: Revenue
        detail: See the payments your app sends
        link: /features/events-tab#payment-events
    footer:
      text: Find the right guide
      link: "#growth-guides"
paths:
  - text: I run campaigns
    detail: Connect ad channels, set up links and read your results
    link: "#growth-guides"
  - text: I'm adding the SDK
    detail: Install Linkrunner in your app and test your first install
    link: /quickstart
  - text: I'm an ad network or agency
    detail: Send clicks and postbacks, or run campaigns for your clients
    link: /affiliate-partners/getting-started
guides:
  - title: Connect my ad channels
    text: Bring Meta, Google, TikTok and other campaigns into one view, and send results back to each channel.
    tag: Ad channels
    link: /ad-networks/overview
  - title: Send users to the right screen
    text: Make links open the right place in your app, even when the user installs it first.
    tag: Deep links
    link: /features/deep-link-management
  - title: See what users do next
    text: Measure signups, purchases and other actions after the install, and build funnels from them.
    tag: Events and revenue
    link: /features/events-tab
moreGuides:
  - text: Bring users back
    detail: Remarketing audiences and campaigns
    link: /features/remarketing
  - text: Move users from web to app
    detail: Web to app journeys
    link: /features/web-to-app-journeys
  - text: Give each partner its own link
    detail: Trackable links
    link: /features/create-trackable-link
  - text: Reward referrals
    detail: Referral tracking
    link: /features/referral-codes
  - text: Ask Claude about your campaigns
    detail: Linkrunner connector for AI assistants
    link: /features/mcp
  - text: Show your own landing page
    detail: Custom landing pages
    link: /features/custom-landing-page
  - text: Stop fake installs
    detail: Fraud control
    link: /features/fraud-control
  - text: Choose attribution windows
    detail: Click lookback windows
    link: /features/attribution-windows
  - text: Measure iOS campaigns
    detail: SKAdNetwork setup
    link: /features/skadnetwork-integration
platforms:
  - text: React Native
    link: /sdk/react-native
  - text: Flutter
    link: /sdk/flutter
  - text: iOS
    link: /sdk/ios
  - text: Android
    link: /sdk/android
  - text: Expo
    link: /sdk/expo
  - text: Web
    link: /sdk/web
---

<OverviewHero />

Watch the one-minute overview with sound on, or read on.

<video data-lr-download="1" src="https://media.assets.linkrunner.io/linkrunner-intro-overview.mp4" poster="https://media.assets.linkrunner.io/linkrunner-intro-overview-poster.jpg" controls preload="metadata" playsinline style="width: 100%; border-radius: 8px"></video>

## Where do you want to start? {#start}

<LinkGrid :items="$frontmatter.paths" />

<SectionLabel class="lr-section-label">Growth guides</SectionLabel>

## What would you like to do? {#growth-guides}

Start with the result you want to see. Each guide explains what to set up in the dashboard and what to ask your developer for.

<GuideCards :items="$frontmatter.guides" />

<LinkGrid :items="$frontmatter.moreGuides" compact />

<SectionLabel class="lr-section-label">App integration</SectionLabel>

## Adding Linkrunner to your app? {#app-integration}

Share the right platform guide with your developer, or follow the [six-step quickstart](/quickstart) together. Using [Capacitor](/sdk/capacitor), [Cordova](/sdk/cordova), [Unity](/sdk/unity) or [Shopify](/sdk/shopify)? Open its guide.

<Tip>

**Fastest way: let your AI coding agent do it.** In your app's repo, run the command for your platform, then ask Claude Code, Cursor, GitHub Copilot or Windsurf to "integrate Linkrunner". It sets up the SDK and deep links for you.

```bash
npx @linkrunner/skills add react-native   # or flutter, expo, ios, android, capacitor, cordova, unity
```

[See how it works](/ai-agent-skills)

</Tip>

<LinkGrid :items="$frontmatter.platforms" />

<HelpBox
  title="Need help finding the right guide?"
  text="Tell us what you want to measure or connect, and we will point you to the right setup."
  link-text="Contact support"
  link="mailto:support@linkrunner.io"
/>
