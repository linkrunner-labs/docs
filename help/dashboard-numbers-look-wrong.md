---
title: "A number on my dashboard looks wrong"
description: "Find which setting or counting rule explains installs, sign-ups, conversion, events, revenue or retention on the Linkrunner dashboard looking too high, too low or not adding up."
---

# A number on my dashboard looks wrong

<p class="vp-lead">Find which setting or counting rule explains installs, sign-ups, conversion, events, revenue or retention on the Linkrunner dashboard looking too high, too low or not adding up.</p>

<Info>

**At a glance:** most surprising numbers come from how a column counts, not from missing data. Find the symptom below. Each one points to the section of [What the Campaigns columns mean](/features/campaign-metrics) that explains it.

</Info>

**Applies to:** the [Campaigns](https://dashboard.linkrunner.io/dashboard/campaigns) page. For gaps against an ad network, see [Meta Ads FAQ and discrepancies](/ad-networks/meta-ads-discrepancies) or [Google Ads FAQ and discrepancies](/ad-networks/google-ads-discrepancies).

## Check these in order

### 1. Are you looking at the right view?

**Check:** the **App** or **Web** toggle, the date range (days follow your project's time zone), and that **Install Attribution** is selected rather than **Retargeting**. In the Retargeting view, Installs shows reinstalls only. See [Retargeting view](/features/campaign-metrics#retargeting-view).

### 2. Sign-ups or conversion look too high?

Sign-ups and installs are counted on their own dates, and sign-ups include users identified at login. **Fix:** widen the range to 7 days or more. See [How Sign-ups are counted](/features/campaign-metrics#how-sign-ups-are-counted).

### 3. An event column is higher than the number of users?

Event columns count every event by default. **Fix:** switch the column to unique users. See [Event, payment and formula columns](/features/campaign-metrics#event-payment-and-formula-columns).

### 4. Installs are lower than store downloads?

Downloads that are never opened aren't counted, and recent Android days can still go up. See [When the install is recorded](/features/campaign-metrics#when-the-install-is-recorded).

### 5. Revenue or ROAS changed when you changed the dates?

You may be on the **Cohort** basis, which keeps growing for recent installs. See [Actual or Cohort basis](/features/campaign-metrics#actual-or-cohort-basis).

### 6. Retention looks empty, very high or very low?

Recent cohorts haven't had time to come back, and small cohorts swing a lot. See [Which retention metric should you use?](/features/retention#which-retention-metric-should-you-use).

### 7. Today's clicks, spend or Google installs look low?

Ad network data arrives on a schedule, and Google installs can take up to about 5 hours to be credited. **Fix:** compare full days that ended at least 4 hours ago. See [When ad network numbers update](/features/campaign-metrics#when-ad-network-numbers-update).

### 8. The total row doesn't match all your installs?

The total row leaves out organic installs. See [The total row and the Organic row](/features/campaign-metrics#the-total-row-and-the-organic-row).

## Confirm it's fixed

Set a range of 7 days or more that ended yesterday and read the column again with the setting from the check that applied. If it still doesn't match your own data, compare at user level with a [CSV export](/features/data-export).

## Still stuck?

Email support with:

- Your project name
- A screenshot showing the date range, toggles and column
- The campaign name, the number you expected and where that number came from

## Related

- [What the Campaigns columns mean](/features/campaign-metrics)
- [My export, webhook or API numbers don't match the dashboard](/help/exports-dont-match-dashboard)
- [Help center](/help/)

**Need help?** Contact [support@linkrunner.io](mailto:support@linkrunner.io).
