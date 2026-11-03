---
title: "Connect your ad channels"
description: "Every ad channel and tool Linkrunner connects to, with a link to each setup guide."
next:
  text: Meta Ads
  link: /ad-networks/meta-ads
channels:
  - text: Meta Ads
    detail: App campaigns, event mapping and Conversions API
    link: /ad-networks/meta-ads
  - text: Meta web to app
    detail: Web-to-app ads with conversion tracking
    link: /ad-networks/meta-web-to-app
  - text: Google Ads
    detail: App campaigns, event mapping and conversion actions
    link: /ad-networks/google-ads
  - text: Google ICM
    detail: Recover Google App Campaign attribution on iOS
    link: /features/google-icm
  - text: TikTok Ads
    detail: In-app event optimisation and deferred deep links
    link: /ad-networks/tiktok
  - text: Snapchat Ads
    detail: In-app event optimisation and deferred deep links
    link: /ad-networks/snapchat
  - text: Reddit Ads
    detail: Click IDs, Conversions API postbacks and deferred deep links
    link: /ad-networks/reddit-ads
  - text: LinkedIn Ads
    detail: In-app event optimisation and deferred deep links
    link: /ad-networks/linkedin-ads
  - text: ChatGPT Ads
    detail: OpenAI click IDs and Conversions API postbacks
    link: /ad-networks/chatgpt-ads
  - text: ShareChat Ads
    detail: ShareChat and Moj installs with Conversions API postbacks
    link: /ad-networks/sharechat-ads
tools:
  - text: Amplitude
    link: /analytics-integrations/amplitude
  - text: Braze
    link: /analytics-integrations/braze
  - text: CleverTap
    link: /analytics-integrations/clevertap
  - text: Google Analytics (GA4)
    link: /analytics-integrations/ga4
  - text: Mixpanel
    link: /analytics-integrations/mixpanel
  - text: MoEngage
    link: /analytics-integrations/moengage
  - text: Netcore
    link: /analytics-integrations/netcore
  - text: PostHog
    link: /analytics-integrations/posthog
  - text: RevenueCat
    link: /analytics-integrations/revenuecat
  - text: WebEngage
    link: /analytics-integrations/webengage
catalogues:
  - text: Meta Commerce Manager
    detail: Ecommerce events for Meta
    link: /ecommerce-manager/meta-commerce-manager
  - text: Google Commerce Manager
    detail: Ecommerce tracking with Google Ads
    link: /ecommerce-manager/google-commerce-manager
---

# Connect your ad channels

<p class="vp-lead">Every ad channel and tool Linkrunner connects to, with a link to each setup guide.</p>

Connect each channel you spend on. Linkrunner then credits installs and in-app events to the right campaign, and sends the results back to the channel so it can optimise your ads. Your app needs the Linkrunner SDK first; see the [quickstart](/quickstart).

## Ad channels

<LinkGrid :items="$frontmatter.channels" />

## Analytics and engagement tools

Send attribution data to the tools your team already uses, so every user profile shows which campaign brought them in.

<LinkGrid :items="$frontmatter.tools" compact />

## Product catalogues

<LinkGrid :items="$frontmatter.catalogues" />

**Need help?** Contact [support@linkrunner.io](mailto:support@linkrunner.io).
