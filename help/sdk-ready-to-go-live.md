---
title: "Is my SDK integration ready to go live?"
description: "Check the SDK calls that are most often missing before release, then run one test install to prove clicks, installs and sign-ups reach Linkrunner."
---

# Is my SDK integration ready to go live?

<p class="vp-lead">Check the SDK calls that are most often missing before release, then run one test install to prove clicks, installs and sign-ups reach Linkrunner.</p>

<Info>

**At a glance:** SDK logs that say "initialized" don't prove the integration is complete. Most builds that aren't ready are missing one of three calls: `signup` after login, `handleDeeplink` on every app open, or `getAttributionData` after `init`. Work through the checks below, then run the test flow once on a clean device before you release.

</Info>

**Applies to:** Android, iOS, React Native, Flutter, Expo, Capacitor and Cordova apps. Each SDK guide has a **Function Placement Guide** that lists every call, where it goes and when to call it, for example [React Native](/sdk/react-native#function-placement-guide). This page covers the gaps we find most often.

## Check these in order

### 1. Is `init` using the right project's token?

**Check:** the token in `init` matches the **Project token** in [Settings → Project Details](https://dashboard.linkrunner.io/dashboard/settings/project-details) of the project you'll report in. If you use SDK signing, the secret key and key ID come from the same project's [SDK signing settings](https://dashboard.linkrunner.io/settings?s=sdk-signing).

**Fix:** if you test in a separate project, switch the token to your live project before you build the release.

### 2. Is `signup` called on login as well as on new accounts?

Linkrunner ties the install, and every event after it, to your user ID when your app calls `signup`. A returning user who logs in on a new device needs the same call.

**Fix:** call `signup` as soon as the user is identified, whether through sign-up or login. See [User identification](/sdk/react-native#user-identification-required).

### 3. Does `handleDeeplink` run on cold start and warm start?

Without it, a user who opens the app from a link isn't recorded as a re-engagement.

**Fix:** pass the URL the app was launched with, and every URL that opens it while it's running, to `handleDeeplink`. See [Handle Deeplink](/sdk/react-native#handle-deeplink).

### 4. Do you read `getAttributionData` after `init`?

The deferred deep link for a new install is returned by `getAttributionData`. The SDK doesn't navigate for you.

**Fix:** call it after `init` completes, read the `deeplink` field and route the user. If the data comes back empty, see [My app doesn't get the deep link or campaign data after install](/help/no-campaign-data-in-app).

### 5. Have you added the optional calls you need?

- **Uninstall tracking** needs your app to send its push token. See [Uninstall tracking](/features/uninstall-tracking).
- **Google Ads consent** has to be set with `setConsent` before `init`. See [Send consent](/features/send-consent).

Skip these if you don't use the feature.

### 6. Is `debug = true` removed?

You only need `debug = true` when SDK Console can't read the device's advertising ID. Remove it before your production build.

### 7. Did the test flow pass on a clean device?

**Check:** follow [Test with SDK Console](/testing/integration-testing#test-with-sdk-console-beta). Open the generated test link on the device first, then install and open the app. If you open the app before the link, SDK Console keeps waiting.

If your device never appears, see [Test device not showing in SDK Console](/testing/integration-testing#test-device-not-showing-in-sdk-console).

### 8. Is the build you're releasing the one you tested?

**Check:** confirm the store build includes the Linkrunner SDK at the same version you tested. A release cut from a branch without the SDK reports nothing.

## Confirm it's fixed

Run the [click → install → signup test](/testing/integration-testing#test-flow-click-→-install-→-signup) with the release build. The test campaign's click, install and sign-up counts each go up by one.

## Still stuck?

Email support with:

- Your project name
- Your platform and SDK version
- Which SDK Console step is waiting, or which count didn't go up
- The SDK debug log from app launch to sign-up

## Related

- [SDK integration testing](/testing/integration-testing)
- [Test custom events and payments](/testing/event-and-revenue-testing)
- [Set up deep links](/features/deep-linking-setup)
- [AI agent skills](/ai-agent-skills)
- [Help center](/help/)

**Need help?** Contact [support@linkrunner.io](mailto:support@linkrunner.io).
