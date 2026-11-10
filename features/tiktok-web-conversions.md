---
title: "Send Website Conversions to TikTok Ads"
description: "Send sign-ups and purchases from your website to the TikTok Events API, so TikTok can attribute and optimize for the visitors who convert."
---

# Send Website Conversions to TikTok Ads

<p class="vp-lead">Send sign-ups and purchases from your website to the TikTok Events API, so TikTok can attribute and optimize for the visitors who convert.</p>

When someone who clicked your TikTok ad converts on your website, Linkrunner sends that conversion to the TikTok Events API 2.0 as a web event. TikTok matches it to the ad click using the `ttclid` click ID the Web SDK captured when the visitor landed.

The same Pixel ID and access token you configured for app events are used for web conversions. There is nothing extra to connect.

## 1. Open the web event mapping

1. Go to [Integrations](https://dashboard.linkrunner.io/dashboard/integrations) and open **TikTok Ads**.
2. Switch to **Web** at the top.
3. Open the **Web Event Mapping** tab.

![Web Event Mapping for TikTok with purchase mapped to Complete Payment](/images/tiktok-web-conversions/web-event-mapping.webp)

## 2. Add a mapping for each event

1. Click **Add Mapping**.
2. Under **Your Web Events**, pick your website event, such as `purchase`. The list shows the events Linkrunner has received from your website.
3. Under **TikTok Ads Event**, pick the closest match, such as **Complete Payment**, **Registration**, **Add to Cart** or **Initiate Checkout**.
4. For purchases, turn on **Send Revenue** and pick the **Currency** your website sends.
5. Save the row.

Don't see your event in the list? Your website hasn't sent it yet. See [Track sign-ups and purchases on your website](/features/web-events-tracking).

## What TikTok receives

For each mapped event, Linkrunner sends:

- The TikTok event name and the time of the conversion.
- The `ttclid` click ID from the visit, which is what TikTok matches the conversion on.
- The page the conversion happened on.
- The value and currency, when **Send Revenue** is on.

The event is sent with `event_source` set to `web`, against the same pixel as your app events.

## Things to know

- **Only visits from a TikTok ad click are sent.** `ttclid` is the only identifier TikTok can match a website conversion on, so a conversion without one is recorded in Postback Logs and not sent.
- **A website test send is not available for TikTok.** Confirm delivery from a real conversion in Postback Logs instead.

## Troubleshooting

**Add Mapping is missing.** Your TikTok advertiser account is not connected yet, or has no pixel configured. Connect it on the **Pixel Management** tab first.

**Conversions are not reaching TikTok.** Open the conversion in Postback Logs. A row recorded as skipped with no click identifier means the visit carried no `ttclid`, so there was nothing for TikTok to match. Only visits that arrived from a TikTok ad carry one.

**The Web switch is missing.** Your project has no Web SDK token yet. Turn on Web Campaigns, see [Track your website in an app project](/features/website-projects#track-your-website-in-an-app-project).

**Need help?** Contact <support@linkrunner.io>
