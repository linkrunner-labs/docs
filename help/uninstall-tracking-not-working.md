---
title: "Uninstalls show 0 or I can't test uninstall tracking"
description: "Find out why the Uninstalls column stays at 0 after you set up uninstall tracking, and how to test it on your own device."
---

# Uninstalls show 0 or I can't test uninstall tracking

<p class="vp-lead">Find out why the Uninstalls column stays at 0 after you set up uninstall tracking, and how to test it on your own device.</p>

<Info>

**At a glance:** Linkrunner checks each device once a day with a silent push through FCM (Android) or APNs (iOS), and records an uninstall after 3 failed days in a row. Uninstalls stay at 0 when Linkrunner can't send that push, or when your app never gave it a push token. Most cases are a missing Firebase permission or a missing `setPushToken` call.

</Info>

**Applies to:** Android and iOS apps that set up [uninstall tracking](/features/uninstall-tracking). The setup steps themselves are in your SDK guide, for example [Android](/sdk/android#uninstall-tracking) or [React Native](/sdk/react-native#uninstall-tracking).

## Check these in order

### 1. Is the Uninstalls column turned on?

**Uninstalls** is not one of the columns you see first on the Campaigns page.

**Fix:** click the sliders icon (**Edit columns**) and turn on **Uninstalls**. See [More columns](/features/campaign-metrics#more-columns).

### 2. Is the platform set up in Settings → Uninstall Tracking?

Each platform has its own tab.

**Check:** in Linkrunner, go to **Settings → Uninstall Tracking**.

- **Android** tab: the Firebase Project ID is saved, and it is the ID of the same Firebase project your app's `google-services.json` uses.
- **iOS** tab: the APNs Authentication Key (p8), Key ID, Bundle ID and Team ID are saved, and the Bundle ID is your live app's.

### 3. Android: can Linkrunner send pushes through your Firebase project?

This is the most common reason Android uninstalls stay at 0. The Firebase Project ID can be saved while Linkrunner still has no permission to send the silent push.

**Check:** in the Firebase console, **Cloud Messaging** shows Firebase Cloud Messaging API (V1) as **Enabled**. In Google Cloud **IAM**, the Linkrunner service account has a role that includes `cloudmessaging.messages.create`.

**Fix:** follow the **FCM HTTP v1 API** steps in your SDK guide ([Android](/sdk/android#uninstall-tracking), [React Native](/sdk/react-native#uninstall-tracking), [Flutter](/sdk/flutter#uninstall-tracking)). Grant the role in the same Google Cloud project as the Firebase Project ID you saved.

### 4. Does your live app send the push token?

Linkrunner can only check devices that sent it a push token. A device on an app version without `setPushToken` is never checked.

**Check:**

- The live app version calls `setPushToken` when the app starts and again when the token refreshes, as in the SDK guide's example.
- On Android it sends the FCM token. On iOS it sends the APNs device token.
- The token is sent from one place in your code, not from several code paths with different values.
- The SDK meets the minimum version in the guide, for example Android SDK 3.2.1, iOS SDK 3.4.0 or React Native SDK 2.8.0.

Only users who opened a version with `setPushToken` are covered. Uninstalls grow as users update.

### 5. Have 3 days passed?

An uninstall is recorded only after the daily check fails 3 days in a row. A user who removed your app today doesn't appear in **Uninstalls** for at least 3 days.

## Confirm it's fixed

Test it on one device:

1. Uninstall the app, then tap a Linkrunner link for a test campaign and install your build that calls `setPushToken`. Uninstalls of organic installs don't show on campaign rows.
2. Open the app once so it sends the push token.
3. Uninstall the app.
4. After at least 3 days, check **Uninstalls** for the test campaign.

## Still stuck?

Email support with:

- Your project name
- The platform (Android, iOS or both) and the date you finished setup
- Your Firebase Project ID (Android) or Bundle ID (iOS)
- The app version and SDK version that call `setPushToken`

Never send your p8 key file, service account keys or any other credential over email or in screenshots.

## Related

- [Uninstall tracking](/features/uninstall-tracking)
- [What the Campaigns columns mean](/features/campaign-metrics)
- [Help center](/help/)

**Need help?** Contact [support@linkrunner.io](mailto:support@linkrunner.io).
