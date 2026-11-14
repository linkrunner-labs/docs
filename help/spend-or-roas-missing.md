---
title: "Spend, cost per install or ROAS is missing or wrong"
description: "Find out why the Spend, ROAS and cost columns on Linkrunner are empty, show a dash or don't match your ad manager, and fix the ad account, column or link behind it."
---

# Spend, cost per install or ROAS is missing or wrong

<p class="vp-lead">Find out why the Spend, ROAS and cost columns on Linkrunner are empty, show a dash or don't match your ad manager, and fix the ad account, column or link behind it.</p>

<Info>

**At a glance:** Linkrunner doesn't calculate spend. It fetches what each ad network reports for the ad accounts you connected, then divides it by Linkrunner's installs, sign-ups or revenue. So missing spend almost always means the ad account running the campaign isn't connected, or the campaign hasn't appeared in Linkrunner yet. Cost and ROAS follow from spend, so fix spend first.

</Info>

**Applies to:** the Spend, ROAS, Cost Per Install, Cost Per Signup and Cost Per columns on the [Campaigns](https://dashboard.linkrunner.io/dashboard/campaigns) page. For what each column counts, see [What the Campaigns columns mean](/features/campaign-metrics).

## Check these in order

### 1. Is the ad account running the campaign connected?

**Spend** shows only when the network's ad account is connected. If you added a new Meta or Google Ads account, or a teammate runs campaigns from another one, its spend is missing until you connect it.

**Check:** open the network under **Integrations** and compare the connected ad accounts with the account IDs in your ad manager.

**Fix:** connect the missing account. Spend fills in after the next sync. If connecting fails, see [I can't connect my ad account to Linkrunner](/help/cant-connect-ad-account). If an account you don't use is connected by mistake, email support to remove it.

### 2. Has the campaign had its first install?

Meta and Google campaigns appear in Linkrunner after their first attributed install from an app build with the Linkrunner SDK. Until then, there is no row to show spend on.

**Fix:** confirm your live app build includes the SDK, then wait for the first install. See [Campaigns not appearing in dashboard](/ad-networks/meta-ads#campaigns-not-appearing-in-dashboard).

### 3. Meta Web to App: does the ad's URL include `campaign_id`?

Meta spend for web-to-app ads is matched through the `campaign_id` macro in the ad's **Website URL**. Without it, spend doesn't sync.

**Fix:** see [Spend not syncing](/ad-networks/meta-web-to-app#spend-not-syncing).

### 4. Are you looking at today, or the last few hours?

Spend comes from each network's own reporting, which Linkrunner fetches on a schedule. The latest hours can be missing until the next refresh.

**Fix:** check your date range and campaign filters, then compare full days. For the refresh schedule of each network, see [When ad network numbers update](/features/campaign-metrics#when-ad-network-numbers-update).

### 5. Is it an iOS-only campaign?

For iOS-only campaigns, spend may still sync but can't be matched to Linkrunner's installs, so CPI, cost per sign-up and ROAS show a **-** with an Apple icon tooltip.

See [Affected metrics](/features/ios-campaign-data-limitations#affected-metrics).

### 6. Spend shows, but ROAS or a cost column is empty?

- **ROAS** is Revenue ÷ Spend. Revenue counts only completed payments from users credited to the campaign, sent with [`trackEvent`](/sdk/track-payments) or the [revenue API](/api-reference/revenue-tracking). With no payments, there is no ROAS. If revenue itself looks wrong, see [Revenue in Linkrunner doesn't match my backend](/help/revenue-doesnt-match).
- **Cost per trial, cost per purchase and other events** are not on by default. In **Edit columns** (the sliders icon), add a **Cost Per** column for the event. See [Event, payment and formula columns](/features/campaign-metrics#event-payment-and-formula-columns).
- **ROAS changed with the date range:** check whether the column uses the **Actual** or **Cohort** basis. See [Actual or Cohort basis](/features/campaign-metrics#actual-or-cohort-basis).

### 7. Is the spend lower at ad set or ad level?

Google Performance Max and Meta Advantage+ campaigns report spend at campaign level only. That spend has no ad set to sit under, so ad set and ad totals come out lower than the campaign.

### 8. Does spend differ from your ad manager?

Linkrunner shows spend in your project's display currency, converted per campaign, and Meta spend stays on Meta's calendar day.

**Check:** compare full days in the same currency. See [Currency](/features/data-export#currency) and the [Meta discrepancies table](/ad-networks/meta-ads-discrepancies).

## Confirm it's fixed

- The ad account that runs the campaign is listed under **Integrations** for that network.
- For a full day that ended at least 4 hours ago, the campaign's **Spend** in Linkrunner is close to the spend in your ad manager.
- **Cost Per Install** and **ROAS** fill in for campaigns that have installs and revenue.

## Still stuck?

Email support with:

- Your project name
- The network, the ad account ID and the campaign name
- The date range, the spend you expected and where that number came from
- A screenshot of the Campaigns page with the date range and filters visible

To let support compare with your ad account, give read-only access with [Give Linkrunner access to Meta](/ad-networks/meta-support-access) or [Give Linkrunner access to Google Ads](/ad-networks/google-support-access). Never send passwords or access tokens over email or in screenshots.

## Related

- [What the Campaigns columns mean](/features/campaign-metrics)
- [A number on my dashboard looks wrong](/help/dashboard-numbers-look-wrong)
- [iOS campaign data limitations](/features/ios-campaign-data-limitations)
- [Help center](/help/)

**Need help?** Contact [support@linkrunner.io](mailto:support@linkrunner.io).
