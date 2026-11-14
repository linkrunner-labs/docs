---
title: "My app doesn't get the deep link or campaign data after install"
description: "Find out why getAttributionData returns organic, no deep link or the wrong data after a campaign install, and fix how and when your app reads it."
---

# My app doesn't get the deep link or campaign data after install

<p class="vp-lead">Find out why getAttributionData returns organic, no deep link or the wrong data after a campaign install, and fix how and when your app reads it.</p>

<Info>

**At a glance:** first check the dashboard. If the install is credited to the campaign there, Linkrunner did its part, and the cause is in when or how your app reads the data. The most common one is calling `getAttributionData()` right after `init`, before attribution has finished.

</Info>

**Applies to:** apps that read the deferred deep link or campaign details with `getAttributionData()` after a campaign install. For the setup, see [Deferred deep linking](/features/deferred-deep-linking).

## Check these in order

### 1. Is the install credited to the campaign in the dashboard?

**Check:** find the test install under the campaign in [App Campaigns](https://dashboard.linkrunner.io/dashboard/campaigns).

**Fix:** if it shows as organic there too, the app isn't the problem. See [My paid installs show as organic](/help/installs-showing-as-organic). If it's credited there, go on.

### 2. Did you call getAttributionData right after init?

Attribution isn't always finished when `init` returns. A call made immediately can come back with `type` `ORGANIC` and no deep link, even though the dashboard later credits the campaign.

**Fix:** read the data when you need it, for example when onboarding finishes, instead of at app start. If your backend needs the campaign, use the install [webhook](/features/webhooks) instead.

### 3. Is deferred deep linking on for that campaign?

**Check:** `deeplink` is empty when the campaign has no destination.

**Fix:** turn on **Enable Deferred deeplinking?** and enter a **Deeplink Destination**. See [Open a screen in your app](/features/create-trackable-link#3-open-a-screen-in-your-app-optional). Meta and Google campaigns have no Linkrunner link, so their deep links are set differently. See the notes in [Deferred deep linking](/features/deferred-deep-linking).

### 4. Does your app lose the deep link at login?

If the user signs up or logs in first, the screen you meant to open is often gone by the time they finish.

**Fix:** store the `deeplink` locally when you read it, and navigate to it after onboarding or login. Your app controls this step. Linkrunner only returns the value.

### 5. Is it a link that opened the app, not an install?

`getAttributionData()` returns the deep link from the install. A tap on a link when the app is already installed comes through `handleDeeplink` instead. See [My deep link opens the store instead of my app](/help/deep-link-opens-store#5-app-opens-but-on-the-wrong-screen-or-an-older-link).

### 6. Do you need a value per link, such as a product or referrer?

You don't need a campaign for each screen or user. Append your parameters to one campaign link and read them from `deeplink`. See [Track the link as a campaign](/features/deep-link-management#track-the-link-as-a-campaign). For referrals, use the `referrer` parameter, see [Set up referral tracking](/features/referral-codes).

### 7. Does the campaign name break your code?

Campaign names can contain characters outside plain ASCII, such as typographic dashes. Putting the raw name into an HTTP header can fail.

**Fix:** send `campaignData.id` to your backend instead of the name, or encode the name before you use it.

### 8. Testing several links on one device?

Attribution is stored from the first install, so a second link on the same device returns the first link's data.

**Fix:** uninstall the app before each test, and turn on debug mode. See [Why is my test credited to the wrong campaign?](/testing/testing-attribution-troubleshooting)

## Confirm it's fixed

- On a fresh install from the link, `getAttributionData()` returns `type` `INORGANIC`, the campaign `name`, and the `deeplink` you set.
- Your app opens that screen, including after signup or login.
- See [Getting attribution data](/sdk/react-native#getting-attribution-data) for the full response (each SDK guide has the same section).

## Still stuck?

Email support with:

- Your project name and the campaign link you tested
- Your SDK and version
- The `getAttributionData()` response from your debug logs, and when in your app you call it
- The test device and the time of the install

## Related

- [Deferred deep linking](/features/deferred-deep-linking)
- [Create deep links for app destinations](/features/deep-link-management)
- [Webhooks](/features/webhooks)
- [Help center](/help/)

**Need help?** Contact [support@linkrunner.io](mailto:support@linkrunner.io).
