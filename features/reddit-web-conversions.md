---
title: "Send Website Conversions to Reddit Ads"
description: "Send sign-ups and purchases from your website to the Reddit Conversions API, so Reddit can attribute and optimize for the visitors who convert."
---

# Send Website Conversions to Reddit Ads

<p class="vp-lead">Send sign-ups and purchases from your website to the Reddit Conversions API, so Reddit can attribute and optimize for the visitors who convert.</p>

When someone who clicked your Reddit ad converts on your website, Linkrunner sends that conversion to the Reddit Conversions API with `action_source` set to `WEBSITE`. Reddit matches it to the ad click using the `rdt_cid` click ID the Web SDK captured when the visitor landed.

<Note>

Capturing `rdt_cid` needs **Web SDK 0.1.24 or later**. Sites on the hosted `v1` script already have it; a pinned or self-hosted copy needs updating, or Reddit has no click ID to match and nothing is sent.

</Note>

## 1. Add your Reddit CAPI credentials

Mapping is only available once the account has credentials. On the **Web Event Mapping** tab, click **Add Reddit Pixel** and add your Reddit Pixel ID and Conversions API access token.

![The Web Event Mapping tab asking for Reddit CAPI credentials before events can be mapped](/images/reddit-web-conversions/web-event-mapping.webp)

## 2. Add a mapping for each event

1. Go to [Integrations](https://dashboard.linkrunner.io/dashboard/integrations) and open **Reddit Ads**, switch to **Web**, and open the **Web Event Mapping** tab.
2. Click **Add Mapping**.
3. Under **Your Web Events**, pick your website event, such as `purchase`.
4. Under **Reddit Ads Event**, pick the closest match, such as **Purchase**, **Sign Up**, **Add to Cart** or **Lead**.
5. For purchases, turn on **Send Revenue** and pick the **Currency** your website sends.
6. Save the row.

Don't see your event in the list? Your website hasn't sent it yet. See [Track sign-ups and purchases on your website](/features/web-events-tracking).

## What Reddit receives

For each mapped event, Linkrunner sends:

- The Reddit event name and the time of the conversion.
- The click ID as `click_id`, which is what Reddit matches the conversion on.
- The page the conversion happened on, when it is available.
- The value and currency, when **Send Revenue** is on.

## Things to know

- **Only visits from a Reddit ad click are sent.** A conversion without `rdt_cid` is recorded in Postback Logs and not sent.
- **Website mappings have no test send.** These rows carry no paper plane icon, unlike Meta and Google Ads, because a Reddit test builds an app-shaped postback. Confirm delivery from a real conversion in Postback Logs instead.

## Troubleshooting

**Add Mapping is missing.** The account has no Reddit Pixel ID and Conversions API token yet. Add them with **Add Reddit Pixel** first.

**Conversions are not reaching Reddit.** Open the conversion in Postback Logs. A row recorded as skipped with no click identifier means the visit carried no `rdt_cid`, so there was nothing for Reddit to match. Only visits that arrived from a Reddit ad carry one.

**The Web switch is missing.** Your project has no Web SDK token yet. Turn on Web Campaigns, see [Track your website in an app project](/features/website-projects#track-your-website-in-an-app-project).

**Need help?** Contact <support@linkrunner.io>
