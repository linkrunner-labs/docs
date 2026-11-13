---
title: "My paid installs show as organic"
description: "Find out why installs from Meta, Google, links or your website land in the Organic row instead of a campaign, and fix the integration or link that's missing."
---

# My paid installs show as organic

<p class="vp-lead">Find out why installs from Meta, Google, links or your website land in the Organic row instead of a campaign, and fix the integration or link that's missing.</p>

<Info>

**At a glance:** an install is organic when Linkrunner finds no click, referrer or ad view that matches it. For Meta and Google app campaigns, that usually means the integration is incomplete. For links and websites, it usually means the user didn't go through a Linkrunner link before installing. Start with the channel you expected the installs from.

</Info>

**Applies to:** Android and iOS apps with the Linkrunner SDK live.

## Check these in order

### 1. Meta installs: are the App ID and decryption key saved?

Meta app campaigns don't use tracking links. On Android, Linkrunner reads the campaign from the Meta install referrer, which it can only decrypt with your key.

**Check:** open [Integrations → Meta Ads](https://dashboard.linkrunner.io/dashboard/integrations/meta-ads?tab=integration) and confirm the **App ID** and **Install Referrer Decryption Key** are saved.

**Fix:** copy the key from your Meta app's settings and save it. See [Get your referrer decryption key](/ad-networks/meta-ads#step-2-get-your-referrer-decryption-key). Installs from the next day onward are credited. Don't put Linkrunner links in Meta app install ads. Meta campaigns are attributed through the integration and appear in Linkrunner after their first install.

### 2. Google installs: does each platform have a link ID?

Google Ads app campaigns are attributed through a link ID that you create in Google Ads and save in Linkrunner. Link IDs are per platform.

**Check:** in [Integrations → Google Ads](https://dashboard.linkrunner.io/dashboard/integrations/google-ads), open the account row menu, choose **Setup Link IDs** and confirm there's a link ID for each platform you advertise on.

**Fix:** follow [Create a link ID](/ad-networks/google-ads#2-create-link-id-for-android-ios-app). A new link ID takes about 12 hours to start working, so installs before then can show as organic. If you removed and reconnected the Google Ads account, check the link IDs are still there.

### 3. iOS installs from your website or a social bio?

iOS has no install referrer. Linkrunner can only credit an iOS install when the user tapped a Linkrunner link before going to the App Store. A website button that goes straight to the App Store gives Linkrunner nothing to match.

**Fix:** point your website's download or "Open in app" button to a Linkrunner link, and pass the page's ad parameters through to it. See [Web to app journeys](/features/web-to-app-journeys). For Meta ads that send users to a website first, see [Meta web to app](/ad-networks/meta-web-to-app).

Some iOS installs stay organic by design: users who deny tracking permission often can't be matched. See [Why some iOS campaign data is missing](/features/ios-campaign-data-limitations).

### 4. Did the install come before the campaign, or the click after the download?

Installs from before the campaign was created or the integration was complete stay organic, and so do clicks after an Android download started or outside the [attribution window](/features/attribution-windows). **Check:** compare install dates with the campaign's **Created at** date. See [How it is credited to a campaign](/features/campaign-metrics#how-it-is-credited-to-a-campaign).

### 5. Testing on your own device?

A test device that already has the app, or that tapped several links, is often credited to an older click or to organic.

**Fix:** uninstall the app before each test and follow [Why is my test credited to the wrong campaign?](/testing/testing-attribution-troubleshooting). Then check the result with [getAttributionData](/sdk/react-native#getting-attribution-data) in debug logs.

### 6. Is your app on a current SDK version?

**Check:** compare your app's SDK version with the latest one in your platform's SDK guide, for example [React Native](/sdk/react-native#sdk-package-version). Older versions can miss attribution signals that newer ones read.

## Confirm it's fixed

Run one test install for the channel you fixed, from a fresh install, and check it's credited to the right campaign. Then compare a full day of new installs: the share in the Organic row should drop for that channel.

## Still stuck?

Email support with:

- Your project name
- The channel and campaign you expected the installs from
- The date range, and whether it's Android, iOS or both
- Two or three example user IDs that showed as organic
- Your SDK and app version

## Related

- [What the Campaigns columns mean](/features/campaign-metrics)
- [Attribution windows](/features/attribution-windows)
- [Meta Ads integration guide](/ad-networks/meta-ads)
- [Google Ads integration guide](/ad-networks/google-ads)
- [Help center](/help/)

**Need help?** Contact [support@linkrunner.io](mailto:support@linkrunner.io).
