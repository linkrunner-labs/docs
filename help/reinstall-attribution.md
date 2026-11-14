---
title: "Does the campaign change when a user reinstalls or taps a new link?"
description: "Find out which campaign gets credit when an existing user reinstalls your app or opens it from a new link, push or retargeting ad, and why those returns may not show up."
---

# Does the campaign change when a user reinstalls or taps a new link?

<p class="vp-lead">Find out which campaign gets credit when an existing user reinstalls your app or opens it from a new link, push or retargeting ad, and why those returns may not show up.</p>

<Info>

**At a glance:** it depends on whether the user reinstalled. A **reinstall** is credited again from scratch, to whichever campaign matches now. A user who still has the app and **opens it from a new link** keeps their original install campaign, and the open is recorded as a **reengagement** for the new campaign. Both show in the **Retargeting** view, not in the default install view.

</Info>

**Applies to:** retargeting and remarketing campaigns, links sent to existing users by email, SMS or push, and users who delete and reinstall your app. For the full model, see [Remarketing & Reattribution](/features/remarketing).

## Check these in order

### 1. Did the user reinstall, or open the app they already had?

| What the user did | What Linkrunner records |
| :-- | :-- |
| Deleted the app, then installed it again | A reinstall, credited to the campaign that matches now, or to organic. See [Reinstalls](/features/campaign-metrics#reinstalls). |
| Opened the installed app through a Linkrunner link | A reengagement for that link's campaign. The install keeps its original campaign. |

### 2. Are you looking at the Retargeting view?

Reengagements and reinstalls are counted for returning users, so the default view doesn't show them.

**Fix:** on the [Campaigns](https://dashboard.linkrunner.io/dashboard/campaigns) page, switch **Install Attribution** to **Retargeting**. See [Viewing Returning Users](/features/remarketing#viewing-returning-users). Exports and the reporting API have the same split. See [Install Attribution or Retargeting](/features/data-export#install-attribution-or-retargeting).

### 3. No reengagements at all?

A link open by an existing user is only recorded when your app passes the link to the SDK's `handleDeeplink`, on both cold start and warm start.

**Fix:** set up [deep linking](/features/deep-linking-setup) and ask your developers to add `handleDeeplink` ([React Native](/sdk/react-native#handle-deeplink), [Android](/sdk/android#handle-deeplink), [iOS](/sdk/ios#handle-deeplink), [Flutter](/sdk/flutter#handle-deeplink)). Check that the retargeting ad or message uses a Linkrunner link.

### 4. Push campaigns not reporting?

Push opens use the same `handleDeeplink` call, with the campaign link carried in the notification. See [Push Notification Tracking troubleshooting](/features/push-notification-tracking#troubleshooting).

### 5. Reinstalls counted as new installs, or not at all?

Reinstalls are detected by the device's advertising ID.

- On iOS without tracking permission, there is no IDFA, so a reinstall can't be detected and counts as a new install.
- On Android, reinstall detection needs the SDK's [backup configuration](/sdk/android#step-3-backup-configuration). Without it, a reinstall that restores app data counts as an app open.

### 6. Users who were active recently aren't reattributed?

A returning user must have been inactive for at least the **inactivity window** before they can be reattributed. The default is 0 days. See [Inactivity Window](/features/remarketing#inactivity-window).

### 7. Linkrunner shows more installs than Meta for a retargeting campaign?

Linkrunner's **Installs** column includes reinstalls, and the **Reinstalls** column shows how many. Meta counts reinstalls with its own rules. See [Meta Ads FAQ and discrepancies](/ad-networks/meta-ads-discrepancies#what-causes-discrepancies).

## Confirm it's fixed

On a test device that already has the app, tap a Linkrunner link for a test campaign so the app opens. Then switch the Campaigns page to **Retargeting** and check the **Reengagements** column for that campaign.

## Still stuck?

Email support with:

- Your project name
- The campaign name and the date range
- Two or three example user IDs that returned, and how they came back (reinstall, link, push)
- Whether it's Android, iOS or both
- Your SDK and app version

## Related

- [Remarketing & Reattribution](/features/remarketing)
- [Running Remarketing Campaigns](/features/remarketing-campaigns)
- [Web to App Journeys](/features/web-to-app-journeys)
- [What the Campaigns columns mean](/features/campaign-metrics)
- [Help center](/help/)

**Need help?** Contact [support@linkrunner.io](mailto:support@linkrunner.io).
