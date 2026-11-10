---
title: "Send Website Conversions to Snapchat Ads"
description: "Send sign-ups and purchases from your website to the Snapchat Conversions API, so Snapchat can attribute and optimize for the visitors who convert."
---

# Send Website Conversions to Snapchat Ads

<p class="vp-lead">Send sign-ups and purchases from your website to the Snapchat Conversions API, so Snapchat can attribute and optimize for the visitors who convert.</p>

When someone who clicked your Snapchat ad converts on your website, Linkrunner sends that conversion to the Snapchat Conversions API with `action_source` set to `WEB`. Snapchat matches it to the ad click using the click ID the Web SDK captured when the visitor landed.

The same Pixel and Conversions API token you configured for app events are used for web conversions.

<Note>

Snapchat spells its click ID `ScCid` on the landing URL, and the Web SDK stores it as `sccid`. Capturing it needs **Web SDK 0.1.24 or later**. Sites on the hosted `v1` script already have it; a pinned or self-hosted copy needs updating, or Snapchat has no click ID to match and nothing is sent.

</Note>

## 1. Open the web event mapping

1. Go to [Integrations](https://dashboard.linkrunner.io/dashboard/integrations) and open **Snapchat Ads**.
2. Switch to **Web** at the top.
3. Open the **Web Event Mapping** tab.

![Web Event Mapping for Snapchat with purchase mapped to Purchase](/images/snapchat-web-conversions/web-event-mapping.webp)

## 2. Add a mapping for each event

1. Click **Add Mapping**.
2. Under **Your Web Events**, pick your website event, such as `purchase`.
3. Under **Snapchat Ads Event**, pick the closest match, such as **Purchase**, **Sign Up**, **Add Cart** or **Start Checkout**.
4. For purchases, turn on **Send Revenue** and pick the **Currency** your website sends.
5. Save the row.

Don't see your event in the list? Your website hasn't sent it yet. See [Track sign-ups and purchases on your website](/features/web-events-tracking).

## What Snapchat receives

For each mapped event, Linkrunner sends:

- The Snapchat event name and the time of the conversion.
- The click ID as `sc_click_id`, which is what Snapchat matches the conversion on.
- The page the conversion happened on, as `event_source_url`.
- The value and currency, when **Send Revenue** is on.

## Things to know

- **Only visits from a Snapchat ad click are sent.** A conversion without `sccid` is recorded in Postback Logs and not sent.
- **The page URL is required.** Snapchat needs `event_source_url`, so a conversion Linkrunner cannot tie to a page is skipped rather than sent incomplete.
- **A website test send is not available for Snapchat.** Confirm delivery from a real conversion in Postback Logs instead.

## Troubleshooting

**Add Mapping is missing.** Your Snapchat ad account is not connected yet, or has no Pixel and Conversions API token. Add them on the **Pixel Management** tab first.

**Conversions are not reaching Snapchat.** Open the conversion in Postback Logs. A row recorded as skipped with no click identifier means the visit carried no `sccid`, so there was nothing for Snapchat to match. Only visits that arrived from a Snapchat ad carry one.

**The Web switch is missing.** Your project has no Web SDK token yet. Turn on Web Campaigns, see [Track your website in an app project](/features/website-projects#track-your-website-in-an-app-project).

**Need help?** Contact <support@linkrunner.io>
