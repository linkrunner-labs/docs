---
title: "My analytics tool isn't receiving Linkrunner data"
description: "Find out why Mixpanel, Amplitude, CleverTap, RevenueCat or another tool shows no Linkrunner attribution or revenue, and when to use webhooks instead."
---

# My analytics tool isn't receiving Linkrunner data

<p class="vp-lead">Find out why Mixpanel, Amplitude, CleverTap, RevenueCat or another tool shows no Linkrunner attribution or revenue, and when to use webhooks instead.</p>

<Info>

**At a glance:** analytics integrations put an install's attribution, such as the campaign and ad network, on the matching user profile in your tool. Linkrunner finds that profile by the tool's ID, which your app passes to the SDK. When profiles have nothing on them, the ID is usually missing, different, or sent too late. If you need data the integration doesn't send, use webhooks.

</Info>

**Applies to:** the integrations under **Integrations → Analytics** in your dashboard, such as [Mixpanel](/analytics-integrations/mixpanel), [Amplitude](/analytics-integrations/amplitude), [CleverTap](/analytics-integrations/clevertap) and [RevenueCat](/analytics-integrations/revenuecat).

## Check these in order

### 1. Are you looking for data the integration sends?

Each integration sends a fixed set of attribution fields to the user profile, not your Linkrunner events. For example, Mixpanel gets `lr_campaign` and `lr_ad_network`, and CleverTap gets an install event with `utm_source` and `utm_campaign`. Each integration page lists its fields under **How it works**.

**Fix:** if you need more, such as Meta ad set or creative names, or you use a tool without an integration page (for example Segment), turn on [webhooks](/features/webhooks). Install webhooks carry the campaign details. Signup webhooks add your `user_id`. Forward them to your tool from your server.

### 2. Does your app pass the tool's ID to the SDK?

Linkrunner matches the profile by an ID your app sends. Without it, the attribution has nowhere to go.

**Check:** your app sends the right ID for your tool:

- Mixpanel, Amplitude, PostHog, MoEngage, Braze, GA4 and Netcore: the field for your tool in `setUserData`, or the ID passed in `signup`. See [Setting User Data](/sdk/react-native#setting-user-data) for the field names.
- CleverTap: `clevertapId` in `setAdditionalData`. See [Setting CleverTap ID](/sdk/react-native#setting-clevertap-id).

Use the same ID your tool uses for that profile. For Mixpanel, if you call Mixpanel's `identify`, pass that same user ID.

### 3. Is the ID sent early enough?

If your app sends the ID only in `signup`, users who never sign up never get attribution, and events tracked before signup have none.

**Fix:** call `setUserData` with the tool's ID right after `init`, before the user logs in. `id` is optional there. On React Native this needs SDK 3.3.0 or later. Attribution is then sent once the install is attributed to a campaign. For Amplitude event properties, see [Send attribution before login](/analytics-integrations/amplitude#send-attribution-before-login).

### 4. RevenueCat: do the user IDs match?

RevenueCat works the other way round. RevenueCat sends events to Linkrunner by webhook, and Linkrunner matches each event to an attributed user.

**Check:**

- In RevenueCat, the Linkrunner webhook uses the **Webhook URL** and authorization token from the RevenueCat panel in Linkrunner, with **All events** selected. See [RevenueCat setup](/analytics-integrations/revenuecat#steps-to-setup).
- Your RevenueCat `app_user_id` is the same ID your app passes to Linkrunner's `signup`, and `signup` runs right after login, before the user can buy.

### 5. Did older users or a gap in data get missed?

Profiles for users attributed before you configured the integration, or while it wasn't working, aren't updated on their own.

**Fix:** click the **Sync** button in that integration's settings, for example **Sync with Mixpanel**. Sync updates user profiles. In Amplitude it does not rewrite properties on past events.

## Confirm it's fixed

Install the app from a test campaign link on a fresh device, with your updated build. Open the user's profile in your tool and check the fields from that integration's **Viewing Attribution Data** section. For RevenueCat, make a sandbox purchase and check the user's revenue in Linkrunner.

## Still stuck?

Email support with:

- Your project name and the tool's name
- Two or three example user IDs, with their ID in the tool
- Which SDK method sends the tool's ID, and when it's called
- Your SDK and app version

Never send API keys, project tokens or authorization tokens over email or in screenshots.

## Related

- [Webhooks](/features/webhooks)
- [Amplitude troubleshooting](/analytics-integrations/amplitude#troubleshooting)
- [My export, webhook or API numbers don't match the dashboard](/help/exports-dont-match-dashboard)
- [Help center](/help/)

**Need help?** Contact [support@linkrunner.io](mailto:support@linkrunner.io).
