---
title: "I can't connect my ad account to Linkrunner"
description: "Find out why connecting a Meta, Google Ads, TikTok or Snapchat ad account fails or shows no campaigns, and fix the login, browser or setup step that's blocking it."
---

# I can't connect my ad account to Linkrunner

<p class="vp-lead">Find out why connecting a Meta, Google Ads, TikTok or Snapchat ad account fails or shows no campaigns, and fix the login, browser or setup step that's blocking it.</p>

<Info>

**At a glance:** most connection failures come from the login you use, not from Linkrunner. The profile needs admin access to the ad account, and the browser has to let the network's login window open. When the account connects but nothing shows up, the setup is usually unfinished or no campaign has had an install yet. Start with the login, then work down the list.

</Info>

**Applies to:** connecting ad accounts under **Integrations** in Linkrunner. For the full setup of each network, see [Meta Ads](/ad-networks/meta-ads), [Google Ads](/ad-networks/google-ads), [TikTok Ads](/ad-networks/tiktok) and [Snapchat Ads](/ad-networks/snapchat).

## Check these in order

### 1. Does your login have admin access to the ad account?

The account you log in with decides which ad accounts Linkrunner can see. A login without enough access can fail, or connect without listing the ad account you need.

**Check:** for Meta, use a profile with full control and admin access of the business portfolio that owns the ad account. For Google, sign in with a Google account that has access to the Google Ads account running your campaigns.

**Fix:** ask an admin of that business portfolio or Google Ads account to connect it, or to give your profile admin access first.

### 2. Is the browser blocking the login window?

Each network opens its own login and permission window. Pop-up blockers, ad blockers and blocked cookies can stop it from opening or from returning to Linkrunner.

**Fix:** open Linkrunner in an incognito window with ad blockers off, allow pop-ups and cookies, and connect again.

### 3. Did Google show an unverified app warning?

**Fix:** click **Advanced**, continue to Linkrunner and approve the requested permissions. The account then appears in the **Google Ad Accounts** table with **Auth Status** showing **Connected**.

You can connect the same Google account to more than one Linkrunner project.

### 4. Did you start from the right place for the network?

Each network has its own button:

| Network | Where to connect |
| :-- | :-- |
| Meta | **Add Meta Account** on [Meta Ads → Ad Account Integration](https://dashboard.linkrunner.io/dashboard/integrations/meta-ads?tab=ad_account) |
| Google Ads | **Add Google Account** on the **Account Integration** tab of [Integrations → Google Ads](https://dashboard.linkrunner.io/dashboard/integrations/google-ads) |
| TikTok | **Add TikTok Account** on the [TikTok integration](https://dashboard.linkrunner.io/dashboard/integrations/tiktok-ads) |
| Snapchat | **Add Snapchat Account** on the [Snapchat integration](https://dashboard.linkrunner.io/dashboard/integrations/snapchat-ads) |

### 5. Is the account connected, but setup unfinished?

Connecting the ad account is one step. Each network needs more before attribution and events work.

**Check:**

- **Meta:** the **App ID** and **Install Referrer Decryption Key** are saved, and CAPI is configured. See [Configure Meta App Integration](/ad-networks/meta-ads#1-configure-meta-app-integration).
- **Google Ads:** a link ID is saved for each platform. See [Create Link ID](/ad-networks/google-ads#2-create-link-id-for-android-ios-app).
- **TikTok:** the **Pixel ID** and **Access Token** are pasted on the TikTok account. See [Configure Pixel on Linkrunner](/ad-networks/tiktok#step-13-configure-pixel-on-linkrunner).
- **Snapchat:** the Pixel or Snap App IDs and the Access Token are saved. See [Configuring Snapchat on Linkrunner](/ad-networks/snapchat#3-configuring-snapchat-on-linkrunner).

### 6. Is the account connected, but no campaigns show up?

Campaigns don't appear when you connect. Meta and Google campaigns appear after their first attributed install from an app build with the Linkrunner SDK. For Meta, only App Promotion campaigns are tracked this way. TikTok and Snapchat campaigns appear only through the Linkrunner campaign links you use in the ads.

See [Campaigns not appearing in dashboard](/ad-networks/meta-ads#campaigns-not-appearing-in-dashboard) for Meta and the [TikTok FAQ](/ad-networks/tiktok#frequently-asked-questions) for link-based networks.

### 7. Was a Meta account connected before, and now it isn't?

If Meta rejects the saved login, the ad account stops syncing until you reconnect it.

**Fix:** click **Add Meta Account** and log in again with a profile from check 1. Reconnecting does not fix a paused Conversions API dataset. For that, see [CAPI delivery paused](/ad-networks/meta-ads#capi-delivery-paused).

## Confirm it's fixed

- The ad account is listed on the network's integration page in Linkrunner. For Google Ads, **Auth Status** shows **Connected**.
- After the first install from a live campaign, the campaign appears on the [Campaigns](https://dashboard.linkrunner.io/dashboard/campaigns) page under that network.

## Still stuck?

Email support with:

- Your project name
- The network and the ad account ID you are trying to connect
- The exact error message and a screenshot of it
- The browser you used

To let support look at the account directly, give read-only access with [Give Linkrunner access to Meta](/ad-networks/meta-support-access) or [Give Linkrunner access to Google Ads](/ad-networks/google-support-access). For an Apple Search Ads account, email support. Never send passwords, access tokens or decryption keys over email or in screenshots.

## Related

- [Meta Ads integration guide](/ad-networks/meta-ads)
- [Google Ads integration guide](/ad-networks/google-ads)
- [My paid installs show as organic](/help/installs-showing-as-organic)
- [Help center](/help/)

**Need help?** Contact [support@linkrunner.io](mailto:support@linkrunner.io).
