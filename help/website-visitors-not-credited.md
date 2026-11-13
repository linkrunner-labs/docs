---
title: "Installs from my website aren't credited to my ads"
description: "Find out why app installs from visitors who came through your website don't show against the Meta or Google ad they clicked, and fix the link, page or token involved."
---

# Installs from my website aren't credited to my ads

<p class="vp-lead">Find out why app installs from visitors who came through your website don't show against the Meta or Google ad they clicked, and fix the link, page or token involved.</p>

<Info>

**At a glance:** an install is credited to the ad only when the ad click travels the whole way: from the ad to your landing page URL, through the Web SDK on each page, into the Linkrunner link behind your download button, and into the store. A break at any step makes the install organic. Start with the download button.

</Info>

**Applies to:** Meta and Google ads that send visitors to your website before they install your app. If your ads send visitors straight to the store, see [Meta web to app](/ad-networks/meta-web-to-app) instead.

## Check these in order

### 1. Does your download button open a Linkrunner link?

A button that goes straight to the Play Store or App Store gives Linkrunner nothing to match.

**Fix:** have the button open your Linkrunner link through `getAppDownloadURL`, which adds the visitor's ad click to it. See [Send ad visitors from your website to your app](/sdk/web#send-ad-visitors-from-your-website-to-your-app).

### 2. Does your landing page URL carry the ad click?

The Web SDK reads the ad click from the landing page URL. If the ad doesn't add the click ID and campaign parameters, there's nothing to pass on.

**Fix:** add the URL parameters for Meta, or keep Google auto-tagging on. See [Add the ad click to your landing page URL](/sdk/web#1-add-the-ad-click-to-your-landing-page-url). Then run the console check in [Check the link](/sdk/web#3-check-the-link).

### 3. Is the Web SDK loaded on every page up to the button?

**Check:** the SDK has to load on each page from the landing page to the download button. If an ad blocker stops the SDK, `getAppDownloadURL` returns your link without the ad click after 3 seconds, and that install isn't credited to the ad.

**Fix:** add the SDK to the pages that are missing it. To get past ad blockers, use [first-party collection](/sdk/web#first-party-collection).

### 4. Is your website using the Web project token?

The app's **Project token** doesn't work in the Web SDK.

**Check:** use the token from [Find your Web project token](/features/website-projects#find-your-web-project-token). If it isn't there, turn on **Web Campaigns** first, as described in [Track your website in an app project](/features/website-projects#track-your-website-in-an-app-project).

### 5. Was the install from a fresh click, with the app SDK live?

The install is recorded by the Linkrunner SDK in your app, so the app build has to include it. For the other reasons an install lands in Organic, such as a click after the download, see [My paid installs show as organic](/help/installs-showing-as-organic).

### 6. Looking for website events on the Events page?

Website sign-ups, purchases and custom events show on Web Campaigns, not on the app Events page. See [Where your events show up](/features/web-events-tracking#where-your-events-show-up).

## Confirm it's fixed

Open your landing page with test ad parameters on a phone without your app, tap the download button, install the app and open it. The install should appear against the matching campaign on the Campaigns page. For website events, use [Test the Web SDK](/testing/web-sdk-testing).

## Still stuck?

Email support with:

- Your project name
- Your landing page URL and the page with the download button
- The ad network and campaign you expected the installs from
- The link returned by the console check in [Check the link](/sdk/web#3-check-the-link)
- The date range and whether it's Android, iOS or both

## Related

- [Web SDK](/sdk/web)
- [Web to app journeys](/features/web-to-app-journeys)
- [Meta web to app](/ad-networks/meta-web-to-app)
- [Help center](/help/)

**Need help?** Contact [support@linkrunner.io](mailto:support@linkrunner.io).
