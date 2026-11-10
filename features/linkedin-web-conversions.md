---
title: "Send Website Conversions to LinkedIn Ads"
description: "Send sign-ups and purchases from your website to LinkedIn conversion rules through the LinkedIn Conversions API."
---

# Send Website Conversions to LinkedIn Ads

<p class="vp-lead">Send sign-ups and purchases from your website to LinkedIn conversion rules through the LinkedIn Conversions API.</p>

When someone who clicked your LinkedIn ad converts on your website, Linkrunner sends that conversion to the LinkedIn Conversions API against one of your conversion rules. LinkedIn matches it using `li_fat_id`, the first-party cookie LinkedIn sets on the click, which the Web SDK captures when the visitor lands.

The same advertiser account and Conversions API token you configured for app events are used for web conversions.

## 1. Open the web event mapping

1. Go to [Integrations](https://dashboard.linkrunner.io/dashboard/integrations) and open **LinkedIn Ads**.
2. Switch to **Web** at the top.
3. Open the **Web Event Mapping** tab.

![Web Event Mapping for LinkedIn with purchase mapped to a Website purchase conversion rule](/images/linkedin-web-conversions/web-event-mapping.webp)

## 2. Add a mapping for each event

1. Click **Add Mapping**.
2. Under **Your Web Events**, pick your website event, such as `purchase`.
3. Under **LinkedIn Conversion**, pick the conversion rule in your LinkedIn account that should receive it. Unlike the other networks, LinkedIn maps to a rule you have created, not to a fixed event name.
4. For purchases, turn on **Send Revenue** and pick the **Currency** your website sends.
5. Save the row.

Don't see your event in the list? Your website hasn't sent it yet. See [Track sign-ups and purchases on your website](/features/web-events-tracking).

## What LinkedIn receives

For each mapped event, Linkrunner sends:

- The conversion rule the mapping points at, and the time of the conversion.
- `li_fat_id`, which is what LinkedIn matches the conversion on.
- The value and currency, when **Send Revenue** is on.

## Things to know

- **`li_fat_id` is the only identifier.** LinkedIn matches a website conversion on it alone, so a conversion without one is recorded in Postback Logs and not sent.
- **Website mappings have no test send.** These rows carry no paper plane icon, unlike Meta and Google Ads, because a LinkedIn test builds an app-shaped postback. Confirm delivery from a real conversion in Postback Logs instead.

## Troubleshooting

**Add Mapping is missing.** Your LinkedIn advertiser account is not connected yet, or has no Conversions API token. Connect it on the **Account Integration** tab first.

**Conversions are not reaching LinkedIn.** Open the conversion in Postback Logs. A row recorded as skipped with no click identifier means the visit carried no `li_fat_id`, so there was nothing for LinkedIn to match. Only visits that arrived from a LinkedIn ad carry one.

**The Web switch is missing.** Your project has no Web SDK token yet. Turn on Web Campaigns, see [Track your website in an app project](/features/website-projects#track-your-website-in-an-app-project).

**Need help?** Contact <support@linkrunner.io>
