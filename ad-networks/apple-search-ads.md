---
title: "Apple Search Ads"
description: "Attribute iOS installs to your Apple Search Ads campaigns and see their spend, taps and keywords in Linkrunner."
---

# Apple Search Ads

<p class="vp-lead">Attribute iOS installs to your Apple Search Ads campaigns and see their spend, taps and keywords in Linkrunner.</p>

Apple Search Ads attribution works without tracking links and without App Tracking Transparency (ATT) consent. The Linkrunner iOS SDK reads an attribution token from Apple's AdServices framework on first open, and Linkrunner asks Apple which campaign, ad group and keyword the install came from.

**Works for iOS apps only.**

## How it works

1. A user taps your ad on the App Store and installs your app.
2. On first open, the Linkrunner SDK collects the AdServices attribution token and sends it with the install.
3. Linkrunner sends the token to Apple's attribution API. If Apple confirms the install came from Apple Search Ads, Linkrunner credits the install to that campaign, ad group and keyword.
4. Every 3 hours, Linkrunner pulls spend, taps and impressions for those campaigns from your connected Apple Ads account.

Steps 1 to 3 need the SDK and the attribution toggle. Step 4 needs a connected Apple Ads account. Without step 4, installs are still attributed, but campaigns show no spend, so you can't see cost per install or ROAS.

## Before you start

- Your iOS app uses the Linkrunner SDK. Use LinkrunnerKit 4.3.2 or later (or a React Native, Flutter, Expo, Capacitor or Cordova SDK that bundles it). See [iOS SDK](/sdk/ios).
- You are an **Admin** or **Manager** on the Linkrunner project. Other roles can't change the attribution setting.
- You can sign in with an Apple ID that has access to your Apple Ads account.

## 1. Turn on Apple Search Ads attribution

Apple Search Ads attribution is off for new projects. Until you turn it on, Linkrunner ignores the AdServices token and these installs are counted as organic or credited to another channel.

1. Open [Apple Search Ads integration](https://dashboard.linkrunner.io/dashboard/integrations/apple-search-ads) in the Linkrunner dashboard.
2. In the **Apple Search Ads Attribution** card, switch the toggle to **Enabled**.

Installs from that point on are checked with Apple. Installs that happened before you turned it on are not re-attributed.

## 2. Connect your Apple Ads account

1. On the same page, click **Add Apple Search Ads Account**.
2. Apple's sign-in page opens in a new tab. Sign in with the Apple ID that has access to your Apple Ads account and allow access.
3. In **Apple Search Ads Organization Accounts**, select the organizations that run ads for this app. Each row shows the organization's ID, timezone and currency.
4. Click **Connect**.

The account appears in the table with **Auth Status** set to **Connected**. You choose organizations only. Linkrunner matches campaigns to your app through attributed installs, so you don't pick apps or campaigns here.

<Note>

If your browser blocks the hand-off between tabs, the sign-in tab shows "Opening Apple Search Ads to choose your organization..." and opens the organization picker itself. Finish the selection in that tab.

</Note>

## 3. Check that it works

After an install from an Apple Search Ads ad:

- The campaign appears on the **Campaigns** page. A new campaign is first named `Apple Search Ads Campaign <campaign ID>`. After the next sync, Linkrunner renames it to its name in Apple Ads.
- Spend, taps and impressions appear within 3 hours of the campaign being created in Linkrunner.
- The **Campaigns** column in the account table changes from **None** to **Active**.

To test with a real install, install the App Store version of your app from an Apple Search Ads ad on a device that has never had the app. Development builds don't return real Apple Search Ads attribution.

## What you see in the dashboard

| Linkrunner | Apple Ads |
| --- | --- |
| Campaign | Campaign |
| Ad set | Ad group |
| Keyword row | Keyword |

Apple Search Ads ad groups are described by keywords, so they show keyword rows where other networks show creatives. An ad group on automatic targeting (Search Match) has no keyword breakdown, because Apple picks the keywords.

| Metric | Source |
| --- | --- |
| Installs, sign-ups, events, revenue | Linkrunner attribution |
| Clicks | Taps reported by Apple |
| Impressions | Reported by Apple |
| Spend | Reported by Apple, in the currency of the Apple Ads organization |

Linkrunner syncs the last 2 days of Apple data every 3 hours, so late adjustments in Apple Ads are picked up. Apple reports are pulled in UTC.

## How Apple Search Ads installs are credited

- **Downloads and redownloads both count.** A redownload, where the user had your app before, is also marked as a reinstall. See [Campaign metrics](/features/campaign-metrics).
- **Taps and views.** Apple tells Linkrunner whether the user tapped the ad or only saw it. Taps are click-through installs. Views are view-through installs.
- **Competing clicks.** If the same user also clicked a Linkrunner link or another ad, the most recent touch wins.
- **No retry.** If Apple's attribution API doesn't return a result for the token, Linkrunner falls back to its other attribution methods, and the install may be counted as organic.

## Why numbers differ from Apple Ads

| You see | Why |
| --- | --- |
| More installs in Apple Ads | Apple counts installs whose first open never reached Linkrunner, such as users who never opened the app, or app versions without the SDK |
| More installs in Apple Ads | Installs from before you turned on the attribution toggle are not credited to Apple Search Ads in Linkrunner |
| An Apple campaign is missing from Linkrunner | Linkrunner creates a campaign on its first attributed install. A campaign with no attributed installs is not synced, so its spend doesn't appear |
| Daily numbers shift by a day | Apple reports are pulled in UTC, and your project may use another timezone |
| Installs credited to another channel | The user's most recent touch was a Linkrunner link or another ad |

## Remove an account

In the account table, open the row's menu and click **Remove Account**. Linkrunner stops syncing that organization and unlinks its campaigns. To connect it again, click **Add Apple Search Ads Account** and sign in.

## Troubleshooting

<AccordionGroup>

<Accordion title="No Apple Search Ads organizations were found for this Apple ID">

The Apple ID you signed in with has no access to an Apple Ads organization. Sign in with an Apple ID that is a user on your Apple Ads account, or ask an Apple Ads admin to invite you.

</Accordion>

<Accordion title="Missing authentication parameters">

The sign-in was cancelled, or access was denied on Apple's page. Click **Add Apple Search Ads Account** again and allow access.

</Accordion>

<Accordion title="Sign-in worked, but this browser blocked the next step">

The browser blocked the sign-in tab from passing the result back to Linkrunner. Allow pop-ups for dashboard.linkrunner.io and try again, or finish the organization selection in the sign-in tab.

</Accordion>

<Accordion title="Campaigns get installs but show no spend">

Check that the organization running the campaign is connected and its **Auth Status** is **Connected**. Spend appears within 3 hours of the campaign's first attributed install. If the status asks you to reconnect, remove the account and add it again.

</Accordion>

<Accordion title="Apple Search Ads installs show as organic">

Check that the **Apple Search Ads Attribution** toggle is **Enabled** and that the installs came from an app version with the Linkrunner SDK. See [Paid installs show as organic](/help/installs-showing-as-organic).

</Accordion>

</AccordionGroup>

**Need help?** Contact [support@linkrunner.io](mailto:support@linkrunner.io).
