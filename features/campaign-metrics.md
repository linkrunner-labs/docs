---
title: "What the Campaigns columns mean"
description: "What each number on the Campaigns page counts, including Installs, Sign-ups, Conversion, Revenue and the cost columns."
---

# What the Campaigns columns mean

<p class="vp-lead">What each number on the Campaigns page counts, including Installs, Sign-ups, Conversion, Revenue and the cost columns.</p>

Every row on the [Campaigns](https://dashboard.linkrunner.io/dashboard/campaigns) page shows activity Linkrunner credited to that campaign, its ad sets or its ads, for the date range you picked. Days follow your project's time zone. A `-` means there is nothing to count.

To add, hide or reorder columns, click the sliders icon (**Edit columns**) at the top right of the table. Your choices are saved for you, per project.

## Columns you see first

These columns are on when you first open the page.

| Column | What it counts |
| :-- | :-- |
| **Clicks** | Taps on the campaign's tracking link. For Meta (including Web to App), Google and Apple Search Ads campaigns, it is the click count the network reports. |
| **Impressions** | Ad views reported by the ad network, or sent by a partner through [S2S impressions](/api-reference/s2s-impressions). |
| **Installs** | Installs credited to the campaign. Reinstalls are included, and the **Reinstalls** column shows how many. For Meta campaigns this also includes the installs Meta reports. For Google campaigns that run only on iOS, it is Google's own SKAdNetwork count. See [How an install is counted](#how-an-install-is-counted). |
| **Sign-ups** | Users your app identified after an install credited to the campaign. See [How Sign-ups are counted](#how-sign-ups-are-counted). |
| **Conversion** | Sign-ups as a percentage of installs: Sign-ups ÷ Installs × 100. |
| **Revenue** | Completed payments from users credited to the campaign, counted on the payment date, in your project's currency. Payments come from [`trackEvent`](/sdk/track-payments) or the [revenue API](/api-reference/revenue-tracking). |
| **Spend** | What the ad network reports you spent on the campaign. Shows only when the network's ad account is connected. |
| **ROAS** | Return on ad spend: Revenue ÷ Spend. |
| **Cost Per Install** | Spend ÷ Installs. |
| **Cost Per Signup** | Spend ÷ Sign-ups. |
| **Active Users** | Unique users who opened the app in the last 7 days (you can change the number of days). With a date range set, the days end on the last day of the range. |
| **Click Through Attribution** / **View Through Attribution** | Installs credited to a click, and installs credited to an ad view. See [attribution windows](/features/attribution-windows). |
| **Created at** / **Display ID** | When the campaign was created, and its short ID. |

## How an install is counted

### When the install is recorded

Your app calls the SDK's `init` method every time it opens ([React Native](/sdk/react-native#initialization-required), [Android](/sdk/android#initialization-required)). The first `init` from a new install records the install. Later opens count as app opens, not installs.

On Android, the install is dated when the Play Store download started. On iOS, and on Android when the Play Store gives no install time (for example a build installed from a computer), the install is dated at the first app open.

This has three effects:

- **Downloads that are never opened are not counted.** The SDK only runs once the app opens, so the store's download count is usually higher than Installs.
- **Past days can still go up.** An Android user who downloads on Monday and opens the app on Wednesday is counted on Monday, but only appears once they open the app on Wednesday.
- **Existing users who update into the SDK are dated at their first open.** On Android, if the Play Store install time is more than 30 days before the first `init` and no campaign matches, the install is dated at the first app open instead. This stops old users from filling past dates when you first add the SDK.

### How it is credited to a campaign

Linkrunner credits each install to one campaign. It checks the signals below, most certain first, and the strongest match wins.

| Strength | Signal |
| :-- | :-- |
| 1 | Google Ads click data in the Google Play Install Referrer, the [Meta Install Referrer](/features/meta-install-referrer), or a [Google ICM](/features/google-icm) match that Google reports as exact |
| 2 | An exact ID: the device's advertising ID (GAID or IDFA) matching a click, the Linkrunner click ID from a link, or the Google and Apple Search Ads attribution APIs |
| 3 | A click from the same IP address |
| 4 | An ad view matched on advertising ID, only if [view-through attribution](/features/attribution-windows#view-through-attribution) is turned on for that partner |
| 5 | A TV ad view from the same home network ([CTV](/features/ctv-attribution)), only if view-through is on |
| 6 | A network's modeled claim, such as a Google ICM match that Google does not report as exact |

A click can only be used when:

- it happened before the install. On Android, that means before the download started, so a link tapped after downloading but before the first open is not matched.
- it falls inside the network's [attribution window](/features/attribution-windows): 30 days for Google and Meta, and 7 days for other networks, unless you changed it.
- it is not already credited to another install.

If nothing matches, the install is **organic** and counts in the Organic row, not in a campaign. An install dated before the day the campaign was created also counts in the Organic row.

Most installs are credited within seconds of the first app open. When Google has not yet returned the campaign for an install from Google Ads, Linkrunner waits and asks again, so that install can take up to about 5 hours to appear. If Google still has not answered, the install is credited to Google Ads without a campaign.

### Reinstalls

A reinstall is an install on a device that already installed your app in the last 90 days, matched by its advertising ID (GAID or IDFA). Apple Search Ads redownloads also count as reinstalls.

- A reinstall is credited again from scratch. It goes to the campaign that matches now, or to organic. It does not keep the campaign from the first install.
- It counts in **Installs** and in **Reinstalls**.
- When there is no advertising ID (iOS without tracking permission, or Android with the ad ID deleted), a reinstall cannot be detected, so it counts as a new install.
- On Android, this needs the SDK's [backup rules](/sdk/android#step-3-backup-configuration). Without them, a reinstall that restores app data counts as an app open, not an install.

<Note>

Installs flagged as suspicious or by your [fraud rules](/features/fraud-control) still count in **Installs**. Fraud Control labels them and can hold back their postbacks, but it does not remove the credit.

</Note>

## How Sign-ups are counted

A sign-up is recorded when your app calls the SDK's `signup` method for a user ([React Native](/sdk/react-native#user-identification-required), [Android](/sdk/android#user-identification-required)). The SDK guides ask you to call it as soon as the user is identified, at **signup or login**. So the column counts users who identified themselves after installing, not only brand new accounts. If you want only new accounts, call `signup` only from your account creation flow and track logins with a [custom event](/sdk/react-native#tracking-custom-events).

A sign-up is credited to a campaign when:

- the user's install was credited to that campaign, and
- the install happened after the campaign was created.

Each user counts once. There is no time limit between install and sign-up, so a user who installs in one week and signs up the next counts on the day they signed up.

<Note>

Sign-ups and Installs are counted on their own dates. A user who installed just before your date range and signed up inside it adds a sign-up but no install. On a short date range, **Conversion** can look higher than expected and can go above 100%.

</Note>

## More columns

Turn these on in **Edit columns**.

| Column | What it counts |
| :-- | :-- |
| **Reinstalls** | Installs from devices that had the app installed before. On Android this needs the backup configuration in your SDK setup ([React Native](/sdk/react-native#step-4-android-backup-configuration), [Android](/sdk/android#step-3-backup-configuration)). |
| **Uninstalls** | Users who removed the app. Needs [uninstall tracking](/features/uninstall-tracking). |
| **Suspicious Installs** | Installs that failed Linkrunner's verification checks and may be fraudulent. |
| **Fraud Installs** / **Fraud Rate** | Installs flagged by your [fraud rules](/features/fraud-control), as a count and as a share of the campaign's installs. |
| **Retention** columns | The share of installs that came back on later days. See [retention](/features/retention) for the four types. |
| **Deterministic Installs** / **Modeled Installs** | Google iOS installs matched to a real signal, or estimated by Google. See [Google ICM](/features/google-icm). |

### Event, payment and formula columns

You can add a column for any custom event or payment event your app sends. By default it counts every event. Click the people icon next to the column in **Edit columns** to count unique users instead. You can also add a **Cost Per** column for an event (Spend ÷ the event's count), or a formula column that combines other columns.

### Actual or Cohort basis

Revenue, ROAS and event columns can count on two bases. Pick one in **Edit columns**.

| Basis | What it counts |
| :-- | :-- |
| **Actual** (default) | Activity that happened inside the date range, whenever the user installed. |
| **Cohort** | Activity from install day through day N, only for users who installed inside the date range. Recent installs may not have reached day N yet, so the numbers can still grow. |

## Retargeting view

Switch **Install Attribution** to **Retargeting** at the top of the page to see returning users instead of new installs. In this view, **Installs** shows reinstalls only, **Conversion** is blank, and **Reengagements** shows users who came back to the app through a retargeting link. See [web to app journeys](/features/web-to-app-journeys#metrics-and-where-they-live).

## Why your numbers can differ from an ad network

Linkrunner credits each install to one campaign and removes duplicates across networks. Ad networks count conversions with their own rules. For the expected gaps, see [Meta discrepancies](/ad-networks/meta-ads-discrepancies) and [Google discrepancies](/ad-networks/google-ads-discrepancies).

**Need help?** Contact [support@linkrunner.io](mailto:support@linkrunner.io)
