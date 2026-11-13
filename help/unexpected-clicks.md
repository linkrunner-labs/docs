---
title: "My link shows clicks I didn't expect"
description: "Find out where unexpected or suspicious clicks on a Linkrunner link come from, and use Fraud Control to flag them and keep them away from your ad networks."
---

# My link shows clicks I didn't expect

<p class="vp-lead">Find out where unexpected or suspicious clicks on a Linkrunner link come from, and use Fraud Control to flag them and keep them away from your ad networks.</p>

<Info>

**At a glance:** the **Clicks** column counts every tap on a campaign's link, from people and from automated traffic. A new link can collect clicks from bots or crawlers before you share it widely, and an affiliate can send far more clicks than real users. Fraud Control flags this traffic for reporting. It never removes clicks from your totals or changes attribution.

</Info>

**Applies to:** campaign links you created in Linkrunner and affiliate tracking links. For Meta, Google and Apple Search Ads campaigns, **Clicks** is the network's own count. See [What the Campaigns columns mean](/features/campaign-metrics).

## Check these in order

### 1. Where has the link been shared?

Every tap on the link counts, including taps from pages, chats and partners you didn't plan for. Automated traffic, such as bots, crawlers and server-generated clicks, also opens links, including new ones.

**Check:** list every place the link appears: ads, partner placements, posts, emails and QR codes.

**Fix:** if the link is somewhere it shouldn't be, [deactivate the campaign link](/features/deactivate-campaign-link). Its past data stays in your reports.

### 2. Do the clicks turn into installs?

A click only affects attribution when it is matched to an install. Clicks with no install only lower the install rate you read for the link.

**Check:** on the [Campaigns](https://dashboard.linkrunner.io/dashboard/campaigns) page, compare the link's **Clicks** with its **Installs**. If installs look normal, the extra clicks are most likely not real users.

### 3. Is an affiliate sending clicks without a device ID?

Affiliate clicks without `gaid` or `idfa` can fall back to matching installs by IP address. Many clicks with no device ID can take credit for installs that came from somewhere else.

**Fix:** ask the partner to pass `gaid` or `idfa` on every click. See the parameters in [Tracking links](/affiliate-partners/tracking-links#device-and-request). Until they do, shorten that partner's click window in [Attribution windows](/features/attribution-windows#change-a-window).

### 4. Does Fraud Control flag the traffic?

Open [Fraud Control](https://dashboard.linkrunner.io/dashboard/fraud-control) and look at **Clicks flagged** and **By channel**. Linkrunner-managed rules already run on every project.

**Fix:** add the **Click flooding from one IP** or **Click flooding from one device** template, then the **Install from a fraudulent click** template. Click rules only tag clicks. The install rule is what flags the installs those clicks lead to. Start each rule on **Tag only**, and switch the install rule to **Tag and suppress postbacks** once the flagged volume looks right. See [Fraud Control](/features/fraud-control#start-from-a-template).

## Confirm it's fixed

After a few days, open Fraud Control. **By channel** should show flagged volume where you expected it. **Clicks** on the Campaigns page stays the same, because flagging never removes clicks or changes attribution.

## Still stuck?

Email support with:

- Your project name
- The campaign name or link and the date range
- Where the link is shared, and which partner sends its traffic
- The countries you target, if the clicks come from elsewhere

## Related

- [Fraud Control](/features/fraud-control)
- [Deactivate a campaign link](/features/deactivate-campaign-link)
- [Tracking links for affiliate partners](/affiliate-partners/tracking-links)
- [Help center](/help/)

**Need help?** Contact [support@linkrunner.io](mailto:support@linkrunner.io).
