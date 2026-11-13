---
title: "Installs are attributed, but TikTok, Snapchat or my affiliate gets no postbacks"
description: "Find out why a network or affiliate isn't receiving installs and events that Linkrunner already credited to it, and which setting or link to fix for each one."
---

# Installs are attributed, but TikTok, Snapchat or my affiliate gets no postbacks

<p class="vp-lead">Find out why a network or affiliate isn't receiving installs and events that Linkrunner already credited to it, and which setting or link to fix for each one.</p>

<Info>

**At a glance:** an install credited in Linkrunner is sent on only when three things line up: the user came through your Linkrunner campaign link with the network's click ID, the network's pixel, token or partner connection is saved, and in-app events such as purchases are mapped. Find the network you are checking below.

</Info>

**Applies to:** TikTok, Snapchat and affiliate partners that receive conversions from Linkrunner. For Meta, see [Meta Ads troubleshooting](/ad-networks/meta-ads#troubleshooting). For Google Ads, see [Google Ads FAQ and discrepancies](/ad-networks/google-ads-discrepancies).

## Check these in order

### 1. Did the install come through your Linkrunner campaign link?

TikTok and Snapchat web-to-app campaigns, and affiliate offers, are attributed through the Linkrunner campaign link you put in the ad or offer. An install that reached the store another way has no click to send back.

**Check:** open the campaign on the [Campaigns](https://dashboard.linkrunner.io/dashboard/campaigns) page and confirm the installs are credited to that campaign, not to **Organic**.

**Fix:** use a separate Linkrunner campaign link in every ad, and don't remove URL parameters from it. If the installs show as organic, see [My paid installs show as organic](/help/installs-showing-as-organic).

### 2. TikTok: is the pixel saved, and does the click carry `ttclid`?

Linkrunner sends events to TikTok only for installs that came through a campaign link with a valid TikTok click ID (`ttclid`). The campaign's destination must be **Website**, not **App**, or TikTok bypasses Linkrunner.

**Fix:** work through [Why are my events not showing up in TikTok Events Manager?](/ad-networks/tiktok#frequently-asked-questions), which covers the Pixel ID, an expired Access Token and the wait before events appear.

### 3. Snapchat: are you looking at the Pixel or the Snap App?

Snapchat receives events in two places. Users who clicked a Snapchat ad through your Linkrunner campaign link go to your **Pixel**. Other users go to your **Snap App**. Installs Linkrunner attributes to Snapchat come through the link, so look for them on the Pixel.

**Check:** in Snapchat Ads Manager, open **Events Manager** and check your Pixel, not only your Snap App.

**Fix:** keep the **Pixel ID** saved in Linkrunner even if you add a Snap App ID. Then send a test event from the **Event Mapping** tab. See [Sending a test event](/ad-networks/snapchat#4-sending-a-test-event). For which users go where, see the [Snapchat overview](/ad-networks/snapchat#overview).

### 4. Affiliate: is the partner connected and assigned to the link?

A partner gets postbacks only for campaigns attributed to its network. A link created with no **Ad Channel**, or with another channel, sends the partner nothing.

**Fix:** follow [Installs are credited, but the partner gets no postbacks](/help/affiliate-partner-not-tracking#7-installs-are-credited-but-the-partner-gets-no-postbacks), and [assign the partner to the link](/features/create-trackable-link#assign-a-partner-to-a-link) if your Campaigns page shows a notice about links with partner traffic. Postbacks start with the next install. Earlier installs are not sent.

### 5. Affiliate: does the partner call your link from its own server?

If the partner reports clicks from its server, or sends users straight to the store, its clicks are rejected until you turn on **S2S clicks and impressions** for it.

**Fix:** see [Turn on S2S clicks for a partner](/affiliate-partners/turn-on-s2s-clicks). The change takes effect within 6 minutes. Retest with a fresh click on a device that installs and opens an app build with the Linkrunner SDK.

### 6. Is the event you expect mapped?

Snapchat always receives install and sign-up, and affiliates always receive installs. Purchases and other in-app events are sent only after you map them.

**Fix:**

- **TikTok and Snapchat:** add the event on the integration's **Event Mapping** tab.
- **Affiliates:** go to **Integrations → Affiliate Partners**, click **Configure** on the partner and check its event mapping. See [Change what a partner receives](/affiliate-partners/map-partner-events).

## Confirm it's fixed

- **TikTok:** the event appears in TikTok Events Manager for your pixel.
- **Snapchat:** **Last Event Received** on the Pixel shows your test event.
- **Affiliates:** the partner sees the install with its click ID in [Postback logs](/affiliate-partners/postback-logs), with the status **Delivered**.

## Still stuck?

Email support with:

- Your project name and the network or partner name
- The campaign name and the date of the install that wasn't received
- For affiliates, one click ID from that install
- What the network or partner says it received

Never send access tokens, S2S partner tokens or postback secret keys over email or in screenshots.

## Related

- [TikTok Ads](/ad-networks/tiktok)
- [Snapchat Ads](/ad-networks/snapchat)
- [Postbacks and macros](/affiliate-partners/postbacks)
- [Help center](/help/)

**Need help?** Contact [support@linkrunner.io](mailto:support@linkrunner.io).
