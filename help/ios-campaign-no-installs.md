---
title: "My iOS campaign shows clicks and spend but no installs"
description: "Find out why an iOS campaign on Meta or Google shows clicks and spend but few or no installs in Linkrunner, and fix the SKAN, event or campaign setup behind it."
---

# My iOS campaign shows clicks and spend but no installs

<p class="vp-lead">Find out why an iOS campaign on Meta or Google shows clicks and spend but few or no installs in Linkrunner, and fix the SKAN, event or campaign setup behind it.</p>

<Info>

**At a glance:** most iOS users deny App Tracking Transparency (ATT), so most iOS installs from paid campaigns can't be matched to a user. Their data comes from Apple's SKAdNetwork (SKAN) instead: aggregated, delayed by 24 to 48 hours, and shown in the SKAN dashboard. Zero installs usually means SKAN isn't fully set up, the campaign doesn't use SKAN, or the postbacks haven't arrived yet.

</Info>

**Applies to:** iOS app campaigns on Meta and Google Ads. For why some iOS columns show `-` with an Apple icon, see [iOS Campaign Data Limitations](/features/ios-campaign-data-limitations).

## Check these in order

### 1. Are you looking in the SKAN dashboard?

Installs from users who deny tracking don't appear as user-level installs on the campaign. They arrive as SKAN postbacks.

**Check:** open the [SKAN dashboard](/features/skan-dashboard/overview) and filter by the network and dates of the campaign. If installs are there, attribution is working and the gap is Apple's privacy limit, not missing data.

### 2. Has it been 24 to 48 hours?

Apple delays SKAN postbacks by design. A campaign that started today will show no SKAN installs yet.

**Fix:** wait 48 hours after the first installs, then check again.

### 3. Is your app ready for SKAN?

Apple only sends postbacks to Linkrunner when the live app build has the right `Info.plist` keys and a SKAN-ready SDK.

**Check:** follow [Prepare Your App](/features/skadnetwork-integration#1-prepare-your-app). Confirm the ad network identifiers and the postback copy endpoints are in the build users install, and that the SDK version is at or above the [minimum versions](/features/skadnetwork-integration#minimum-sdk-versions) and rolled out to all users. Then confirm the switch at the top of **Settings → SKAN Setup** shows **Enabled**.

### 4. Meta: is the campaign an App Promotion campaign?

Only Meta campaigns with the **App Promotion** objective support SKAN. A Sales campaign that sends users to the App Store gets no SKAN postbacks.

**Fix:** run iOS app installs as App Promotion and follow [Create an iOS Campaign in Meta Ads Manager](/features/meta-skan-setup#5-create-an-ios-campaign-in-meta-ads-manager). If you want to use a Sales (Website) campaign, set it up as [Meta Web to App](/ad-networks/meta-web-to-app) instead, which works on iOS.

### 5. Meta: can't select an app event for the ad set?

Meta only lists events it has received from your app in the past 90 days, and marks events without a conversion value as inactive.

**Fix:** follow [An event is missing from the Meta event list](/features/meta-skan-setup#an-event-is-missing-from-the-meta-event-list). Every event in your SKAN schema except `signup` must be mapped in Linkrunner before Meta's SKAN configuration shows your conversion values.

### 6. Meta: is Meta still using the Facebook SDK for SKAN?

If the **SKAdNetwork for the Facebook SDK** toggle is on for your dataset, Meta reads conversion values from its own SDK, not from Linkrunner.

**Fix:** see [Meta still attributes via the Facebook SDK](/features/meta-skan-setup#meta-still-attributes-via-the-facebook-sdk).

### 7. Installs arrive, but conversion values are empty or wrong?

**Check:** your app ships LinkrunnerKit 4.3.2 or later, the priorities in Meta match **Settings → SKAN Setup → Meta SKAN Configuration**, and your schema fits Apple's limit of 64 conversion values. See [Conversion values look wrong in Meta](/features/meta-skan-setup#conversion-values-look-wrong-in-meta) and [Configure the SKAN Schema](/features/skadnetwork-integration#2-configure-the-skan-schema).

### 8. Google: is there an iOS link ID?

Google iOS campaigns need their own iOS link ID in Linkrunner. For campaigns that run only on iOS, the **Installs** column shows Google's own SKAN count.

**Fix:** follow [Create an iOS Link ID](/features/google-skan-setup#2-create-an-ios-link-id). To recover more Google iOS installs from users who deny tracking, set up [Google ICM](/features/google-icm).

## Want user-level iOS data or no ATT prompt?

- For user-level attribution of iOS installs from Meta, use [Meta Web to App](/ad-networks/meta-web-to-app). The click goes through your Linkrunner link, so Linkrunner can match the install.
- Your app needs the ATT prompt only if you plan to use the IDFA. To stop the iOS SDK from collecting the IDFA, set `disableIdfa` to `true` at initialization. See [SDK Signing Parameters](/sdk/ios#sdk-signing-parameters-optional).

## Confirm it's fixed

Two days after your change, open the [SKAN dashboard](/features/skan-dashboard/overview) for the campaign's network and dates. Installs and conversion values should appear. For Meta, the app event you chose in the ad set should no longer be inactive.

## Still stuck?

Email support with:

- Your project name
- The network, campaign name and dates
- A screenshot of the campaign's objective and ad set settings
- Your app version and Linkrunner SDK version on iOS
- Whether the SKAN switch in **Settings → SKAN Setup** shows **Enabled**

## Related

- [SKAN Setup](/features/skadnetwork-integration)
- [Meta SKAN Setup](/features/meta-skan-setup)
- [Google Ads SKAN Setup](/features/google-skan-setup)
- [Conversion Values in SKAdNetwork](/features/skadnetwork-conversion-values)
- [Help center](/help/)

**Need help?** Contact [support@linkrunner.io](mailto:support@linkrunner.io).
