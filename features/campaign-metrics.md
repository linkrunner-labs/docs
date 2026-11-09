---
title: "What the Campaigns columns mean"
description: "What each number on the Campaigns page counts, including Installs, Sign-ups, Conversion, Revenue and the cost columns."
---

# What the Campaigns columns mean

<p class="vp-lead">What each number on the Campaigns page counts, including Installs, Sign-ups, Conversion, Revenue and the cost columns.</p>

Every row on the [Campaigns](https://dashboard.linkrunner.io/dashboard/campaigns) page shows activity Linkrunner credited to that campaign, its ad sets or its ads, for the date range you picked. Days follow your project's time zone. A `-` means there is nothing to count.

## Default columns

These columns are on for every project.

| Column | What it counts |
| :-- | :-- |
| **Clicks** | Taps on the campaign's tracking link. For Meta, Google and Apple Search Ads campaigns, it is the click count the network reports. |
| **Installs** | New installs credited to the campaign, counted on the day of the first app open. Each device counts once. Reinstalls are in their own column. |
| **Sign-ups** | Users your app identified after an install credited to the campaign. See [How Sign-ups are counted](#how-sign-ups-are-counted). |
| **Conversion** | Sign-ups as a percentage of installs: Sign-ups ÷ Installs × 100. |
| **Revenue** | Completed payments from users credited to the campaign, counted on the payment date, in your project's currency. Payments come from [`trackEvent`](/sdk/track-payments) or the [revenue API](/api-reference/revenue-tracking). |
| **Spend** | What the ad network reports you spent on the campaign. Shows only when the network's ad account is connected. |
| **ROAS** | Return on ad spend: Revenue ÷ Spend. |

**Cost Per Install** (Spend ÷ Installs) and **Cost Per Signup** (Spend ÷ Sign-ups) are also available. Turn them on with **Edit columns** if they are hidden.

## How Sign-ups are counted

A sign-up is recorded when your app calls the SDK's `signup` method for a user ([React Native](/sdk/react-native#user-identification-required), [Android](/sdk/android#user-identification-required)). The SDK guides ask you to call it as soon as the user is identified, at **signup or login**. So the column counts users who identified themselves after installing, not only brand new accounts. If you want only new accounts, call `signup` only from your account creation flow and track logins with a [custom event](/sdk/react-native#tracking-custom-events).

A sign-up is credited to a campaign when:

- the user's install was credited to that campaign, and
- the install happened on or after the day the campaign was created.

Each user counts once. There is no time limit between install and sign-up, so a user who installs in one week and signs up the next counts on the day they signed up.

<Note>

Sign-ups and Installs are counted on their own dates. A user who installed just before your date range and signed up inside it adds a sign-up but no install, so **Conversion** on a short date range can look higher than expected.

</Note>

## More columns

Open **Edit columns** at the top of the table to add these.

| Column | What it counts |
| :-- | :-- |
| **Impressions** | Ad views reported by the ad network, or sent by a partner through [S2S impressions](/api-reference/s2s-impressions). |
| **Reinstalls** | Installs from devices that had the app installed before. On Android this needs the backup configuration in your SDK setup ([React Native](/sdk/react-native#step-4%3A-android-backup-configuration)). |
| **Uninstalls** | Users who removed the app. Needs [uninstall tracking](/features/uninstall-tracking). |
| **Click through attribution** / **View through attribution** | Installs credited to a click, and installs credited to an ad view. See [attribution windows](/features/attribution-windows). |
| **Suspicious Installs** | Installs that failed Linkrunner's verification checks and may be fraudulent. |
| **Fraud Installs** / **Fraud Rate** | Installs flagged by your [fraud rules](/features/fraud-control), as a count and as a share of the campaign's installs. |
| **Active Users** | Unique users who opened the app in the last N days. With a date range set, the N days end on the last day of the range. |
| **Retention** columns | The share of installs that came back on later days. See [retention](/features/retention) for the four types. |
| **Deterministic Installs** / **Modeled Installs** | Google iOS installs matched to a real signal, or estimated by Google. See [Google ICM](/features/google-icm). |
| **Created at** / **Display ID** | When the campaign was created, and its short ID. |

### Event and payment columns

You can add a column for any custom event or payment event your app sends. By default it counts every event. Click the people icon next to the column in **Edit columns** to count unique users instead. You can also add a **Cost Per** column for an event (Spend ÷ the event's count).

### Actual or Cohort basis

Revenue, ROAS and event columns can count on two bases. Pick one in **Edit columns**.

| Basis | What it counts |
| :-- | :-- |
| **Actual** (default) | Activity that happened inside the date range, whenever the user installed. |
| **Cohort** | Activity from install day through day N, only for users who installed inside the date range. Recent installs may not have reached day N yet, so the numbers can still grow. |

## Retargeting view

Switch **Install Attribution** to **Retargeting** at the top of the page to see returning users instead of new installs. This view adds **Reengagements**: users who came back to the app through a retargeting link. See [web to app journeys](/features/web-to-app-journeys#metrics-and-where-they-live).

## Why your numbers can differ from an ad network

Linkrunner credits each install to one campaign and removes duplicates across networks. Ad networks count conversions with their own rules. For the expected gaps, see [Meta discrepancies](/ad-networks/meta-ads-discrepancies) and [Google discrepancies](/ad-networks/google-ads-discrepancies).

**Need help?** Contact [support@linkrunner.io](mailto:support@linkrunner.io)
