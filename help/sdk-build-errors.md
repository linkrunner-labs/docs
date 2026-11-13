---
title: "My app won't build or crashes after adding the Linkrunner SDK"
description: "Find out why your build fails or your app crashes after you add or update the Linkrunner SDK, and fix the version, setup step or call order behind it."
---

# My app won't build or crashes after adding the Linkrunner SDK

<p class="vp-lead">Find out why your build fails or your app crashes after you add or update the Linkrunner SDK, and fix the version, setup step or call order behind it.</p>

<Info>

**At a glance:** build failures usually come from a project below the SDK's minimum versions, a skipped install step (most often on Expo), or an SDK version with a known bug that a newer release fixes. Crashes and errors at runtime usually come from calling SDK methods before `init` has finished. Note your exact SDK version and error message first.

</Info>

**Applies to:** Android, iOS, React Native, Flutter and Expo apps, after you add the Linkrunner SDK or update it.

## Check these in order

### 1. Does your project meet the SDK requirements?

**Check:** compare your project with the requirements for your platform: [Android](/sdk/android#requirements), [iOS](/sdk/ios#requirements), [Flutter](/sdk/flutter#requirements) or [Expo](/sdk/expo#requirements).

**Fix:** raise the version that's too low, or stay on the SDK version you had until you can.

### 2. Are you on the latest SDK version?

When a build or crash bug is found in a published package, the fix ships in a new SDK version.

**Check:** compare your installed version with the latest one in your platform's SDK guide or package registry.

**Fix:** update to the latest version and rebuild. If the problem started right after an update, include both the old and new version numbers when you email support.

### 3. Expo: did you finish every install step?

Expo needs two packages and a config plugin. A build fails or the SDK does nothing if one is missing.

**Check:** confirm all of these:

- Both `rn-linkrunner` and `expo-linkrunner` are installed. With `expo-linkrunner` 4.0.0 or higher, you need `rn-linkrunner` 4.0.0 or higher.
- `expo-linkrunner` is in the `plugins` array of `app.json`.
- You ran the prebuild step. See [Prebuild your project](/sdk/expo#step-3-prebuild-your-project).

If you're upgrading from `expo-linkrunner` 1.x or 2.x, follow the [Migration guide](/sdk/expo#migration-guide).

### 4. Do other SDK calls wait for `init`?

Calling SDK methods before `init` has finished can throw errors.

**Fix:** await `init` before you call `enablePIIHashing`, `setAdditionalData`, `getAttributionData` or `handleDeeplink`. The only calls that go before `init` are the ones your SDK's Function Placement Guide marks as **Before `init`**, such as `setConsent`. See the guide for [React Native](/sdk/react-native#function-placement-guide) or [Android](/sdk/android#function-placement-guide).

### 5. Is `debug = true` still on in production?

**Fix:** set `debug = true` only while testing, and remove it from your production build.

## Confirm it's fixed

Build the app, install it on a test device and open it. Then register the device in [SDK Console](/testing/integration-testing#test-with-sdk-console-beta) and confirm the **SDK Initialization** step completes.

## Still stuck?

Email support with:

- Your platform, framework version and Linkrunner SDK version
- The version you updated from, if the problem started after an update
- The full build error or crash stack trace
- For ANRs on Android, the ANR traces from Play Console under **Android vitals → Crashes and ANRs**
- The code where you call `init` and the SDK calls that follow it

## Related

- [Is my SDK integration ready to go live?](/help/sdk-ready-to-go-live)
- [SDK integration testing](/testing/integration-testing)
- [Expo SDK](/sdk/expo)
- [Help center](/help/)

**Need help?** Contact [support@linkrunner.io](mailto:support@linkrunner.io).
