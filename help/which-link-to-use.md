---
title: "Which link do I use for Meta, Google or influencers?"
description: "Pick the right Linkrunner link for each channel, set where desktop and mobile users go, and find out why a link's clicks aren't tracked."
---

# Which link do I use for Meta, Google or influencers?

<p class="vp-lead">Pick the right Linkrunner link for each channel, set where desktop and mobile users go, and find out why a link's clicks aren't tracked.</p>

<Info>

**At a glance:** Meta and Google app campaigns don't use a Linkrunner link at all. Every other place you share your app gets its own link from **App Campaigns → Create Link**. By default, a link sends Android users to the Play Store, iOS users to the App Store and desktop users to your website. Most link problems come from a value typed into the wrong field.

</Info>

**Applies to:** app campaigns and links in Linkrunner. For the full link form, see [Create a trackable link](/features/create-trackable-link).

## Check these in order

### 1. Running Meta or Google app campaigns?

Don't create a link. These campaigns are attributed through the ad network integration, and they appear in Linkrunner after their first install.

**Fix:** finish the integration in [Meta Ads](/ad-networks/meta-ads) or [Google Ads](/ad-networks/google-ads). To open a screen after install, see the Meta and Google notes in [Deferred deep linking](/features/deferred-deep-linking). If the ads send people to your website first, see [Meta web to app](/ad-networks/meta-web-to-app).

### 2. Influencers, QR codes, email or other organic content?

Create one link for each place you share it, so each one has its own clicks, installs and revenue.

**Fix:** in [App Campaigns](https://dashboard.linkrunner.io/dashboard/campaigns), click **Create Link**. To group links, such as all your creators, type a new name like `Influencers` under **Ad Channel**. See [Where to use a link](/features/create-trackable-link#where-to-use-a-link).

### 3. Giving the link to an affiliate partner?

**Fix:** pick the partner under **Ad Channel**, or the partner gets no postbacks. See [Pick the ad channel](/features/create-trackable-link#4-pick-the-ad-channel). If the partner can't see the campaign, see [My affiliate partner can't see campaigns or clicks](/help/affiliate-partner-not-tracking).

### 4. Sending people to your website, not the app?

**Fix:** use a web link instead of an app link. See [Create a web link for your own channels](/features/web-campaign-link), or [Create a web link for a partner](/features/web-partner-link).

### 5. Is the destination in the right field?

| Where you want people to go | Field |
| :-- | :-- |
| A screen in your app after install | **Deeplink Destination**, a link on your Linkrunner domain |
| A web page for desktop visitors | **Desktop URL** under **Custom Redirection** |
| A web page instead of the store | **Android URL** or **iOS URL** under **Custom Redirection** |

**Check:** a website address in **Deeplink Destination** doesn't send desktop users to that page. Use **Desktop URL**. Enter redirect URLs in full, starting with `https://`. Empty fields keep the default route. See [Link redirection](/features/link-redirection) for the full order.

If the link refuses a website, your account may be under 7 days old with no paid invoice. See the [link domain FAQ](/features/subdomain-setup#faq).

### 6. Adding your own parameters?

**Fix:** you can append your own parameters to the generated link. Keep the campaign identifier unchanged, and add the first parameter with `&` if the link already has a `?`. After install, your app reads them in the `deeplink` from `getAttributionData()`. See [Track the link as a campaign](/features/deep-link-management#track-the-link-as-a-campaign).

You don't need a separate campaign for each screen or product. Append the value to one link instead.

### 7. Clicks aren't showing on the link?

**Check:**

- The link uses a domain set up for this project, and a Branded sub-domain shows its CNAME verified. See [Set up your link domain](/features/subdomain-setup).
- Nobody changed the campaign ID in the link when they shared it.
- The link is opened on the user's phone. A partner's server that calls the link records the server, not the user. See [Calling the link from your server](/affiliate-partners/tracking-links#calling-the-link-from-your-server).

**Fix:** if you can't create a link because you reached the campaign limit, email support to raise it.

## Confirm it's fixed

- Tap the link on a phone and on a computer. Each lands where you set.
- The click shows on the link's row in [App Campaigns](https://dashboard.linkrunner.io/dashboard/campaigns).
- To test an install end to end, follow [SDK integration testing](/testing/integration-testing).

## Still stuck?

Email support with:

- Your project name
- The full link you shared and where you shared it
- What you expected to happen and what happened, with the device and browser
- A screenshot of the link's settings

## Related

- [Create a trackable link](/features/create-trackable-link)
- [Link redirection](/features/link-redirection)
- [Set up your link domain](/features/subdomain-setup)
- [Help center](/help/)

**Need help?** Contact [support@linkrunner.io](mailto:support@linkrunner.io).
