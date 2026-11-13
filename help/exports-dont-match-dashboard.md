---
title: "My export, webhook or API numbers don't match the dashboard"
description: "Line up dates, time zones and organic users so CSV exports, webhooks and the reporting API match the Linkrunner dashboard, and find your server key."
---

# My export, webhook or API numbers don't match the dashboard

<p class="vp-lead">Line up dates, time zones and organic users so CSV exports, webhooks and the reporting API match the Linkrunner dashboard, and find your server key.</p>

<Info>

**At a glance:** most gaps come from comparing different days, leaving organic users out on one side, or adding up columns that aren't meant to be added. Work down the list, then compare one campaign on one day.

</Info>

**Applies to:** [Data Export](/features/data-export), [webhooks](/features/webhooks) and the [reporting API](/api-reference/reporting-campaigns).

## Check these in order

### 1. Do you have the right server key?

A `401` means the key is missing or belongs to another project. Each project has its own key. See [Obtaining your API key](/api-reference/data-apis#obtaining-your-api-key).

### 2. Are you comparing the same days?

The dashboard, exports and the reporting API use your project's time zone. Webhook timestamps are in UTC. **Fix:** convert webhook timestamps before grouping by day. See [Payload structure](/features/webhooks#payload-structure).

### 3. Are organic users on both sides?

Install and sign-up webhooks skip organic users unless you turn on **Send webhooks for organic users**. See [Install webhook](/features/webhooks#install-webhook).

### 4. Fewer webhooks than dashboard sign-ups?

**Check:** your endpoint returns a direct `2xx` (redirects aren't followed) and accepts [Linkrunner's IP addresses](/features/webhooks#allowlisting-linkrunner-ips). Use **Test Webhook** in the webhook settings to confirm.

### 5. Are you adding up per-day columns or reading one Sign Ups row?

Some CSV columns can't be summed, and the Sign Ups range total sits on the first row. See [Reading the numbers correctly](/features/data-export#reading-the-numbers-correctly).

### 6. Ad set or creative totals lower than the campaign?

Some networks report part of the activity at campaign level only. See [Reading the numbers correctly](/features/data-export#reading-the-numbers-correctly).

## Confirm it's fixed

Pick one campaign and one day. Compare installs and sign-ups in the dashboard, the CSV and the API for that day in your project's time zone. They should match. Then widen the range.

## Still stuck?

Email support with:

- Your project name
- Which source you compared (CSV, webhook or API) and against which dashboard page
- The date range and time zone you used
- Two or three user IDs or campaign names that differ

Don't send your server key.

## Related

- [Data Export](/features/data-export)
- [Webhooks](/features/webhooks)
- [Data APIs](/api-reference/data-apis)
- [A number on my dashboard looks wrong](/help/dashboard-numbers-look-wrong)
- [Help center](/help/)

**Need help?** Contact [support@linkrunner.io](mailto:support@linkrunner.io).
