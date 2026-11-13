---
title: "My deep link opens the store instead of my app"
description: "Find out why a Linkrunner link opens the App Store, Play Store or the wrong screen when your app is installed, and fix the domain, app setup or SDK call."
---

# My deep link opens the store instead of my app

<p class="vp-lead">Find out why a Linkrunner link opens the App Store, Play Store or the wrong screen when your app is installed, and fix the domain, app setup or SDK call.</p>

<Info>

**At a glance:** when your app is installed, the phone opens it from a link only if the link's domain is verified for your app. If verification fails, the link behaves like any web link and goes to the store. Start with where the link was tapped, then check the domain. If the app opens but on the wrong screen, go to check 5.

</Info>

**Applies to:** Android App Links and iOS Universal Links on your Linkrunner or Branded sub-domain. For setup from scratch, see [Deep linking setup](/features/deep-linking-setup).

## Check these in order

### 1. Was the link tapped inside Instagram, Facebook or another app?

In-app browsers block the redirect into your app. Typing a link into Safari's address bar never opens the app either.

**Fix:** edit the campaign and, under **Advanced Options**, turn on **Open in app**. The page it shows opens your app through your custom URI scheme, so set one up in [Custom URI schemes](/features/deep-linking-setup#custom-uri-schemes). See [Social media intermediary page](/features/social-media-intermediary-page). To test on iOS, paste the link into Notes and long-press it.

### 2. Does the Android app's fingerprint match the build you installed?

Most Android failures are a SHA-256 fingerprint that doesn't match the build on the phone. With Google Play App Signing, the store build is signed with the fingerprint in **Play Console → Setup → App integrity**, not your upload keystore.

**Fix:** add that fingerprint to the Android verification object in [Settings → Deeplinks](https://dashboard.linkrunner.io/dashboard/settings/deeplinks), then re-verify on the device. The commands are in [Debugging domain verification](/features/deep-linking-setup#debugging-domain-verification).

### 3. Is the iOS association file live, and is the domain in your app?

**Check:** the `appID` in your iOS verification object is `TEAM_ID.BUNDLE_ID`, and **Associated Domains** in Xcode lists `applinks:` plus the exact link domain. Apple's CDN can serve an old file for up to a day.

**Fix:** follow the iOS steps in [Debugging domain verification](/features/deep-linking-setup#debugging-domain-verification), which cover the CDN check and developer mode.

### 4. Did you add a new link domain?

Each domain is verified on its own. Links on a new domain go to the store until the app knows about it. Links on an old domain stop opening the app if you removed it from the app.

**Fix:** add every domain you share links on, old and new, to the iOS **Associated Domains**, the Android intent filter, and your app's navigation prefixes. See [Update native configuration](/features/deep-linking-setup#step-3-update-native-configuration) and [Configure navigation](/features/deep-linking-setup#step-4-configure-navigation). Then ship a new app build.

### 5. App opens, but on the wrong screen or an older link?

`getAttributionData()` returns the deep link from the install. It stays the same for later link taps. A link that opens the installed app has to go through `handleDeeplink`, which returns the resolved `deeplink` for that tap.

**Fix:** pass every incoming link to `handleDeeplink` and navigate to the `deeplink` it returns, not the tracking URL. See [Handle deeplink](/sdk/react-native#handle-deeplink) (the same section exists in each SDK guide). If the route still doesn't match, check that your navigation config maps that path. Linkrunner forwards the values, and your app controls navigation.

### 6. Should people without the app land on a web page?

A link sends people without your app to the store by default.

**Fix:** set **Android URL** or **iOS URL** under **Custom Redirection** on the campaign. See [Link redirection](/features/link-redirection).

## Confirm it's fixed

- On Android, `adb shell pm get-app-links your.package.name` shows `verified` for the link domain.
- On iOS, long-pressing the link in Notes shows **Open in "YourApp"**.
- Tapping the link from a messaging app opens your app on the right screen, on the store build.

## Still stuck?

Email support with:

- Your project name and the link domain
- The exact link that fails, and the screen it should open
- The device, OS version and the app or browser you tapped it in
- Whether the build is from the store, TestFlight or a debug build

## Related

- [Deep linking setup](/features/deep-linking-setup)
- [Deferred deep linking](/features/deferred-deep-linking)
- [My app doesn't get the deep link or campaign data after install](/help/no-campaign-data-in-app)
- [Help center](/help/)

**Need help?** Contact [support@linkrunner.io](mailto:support@linkrunner.io).
