---
title: "Website Attribution Windows: Click to Conversion"
description: "How far back Linkrunner looks for a website visit when crediting a conversion your backend sends, the 90 day default, and how to shorten it per channel."
---

# Website Attribution Windows: Click to Conversion

<p class="vp-lead">How far back Linkrunner looks for a website visit when crediting a conversion your backend sends, the 90 day default, and how to shorten it per channel.</p>

**A website click window is how far back Linkrunner looks for a visit when crediting a conversion.** If the most recent matching visit is older than the window, it is not used, and the conversion is credited to **Direct** instead.

Like the [app windows](/features/attribution-windows), this is applied per channel, so a visit from Google Ads and a visit from Meta can be judged against different windows.

## Which conversions this applies to

This window applies to **conversions your backend sends**, through `capture-event` and `capture-payment` with a web source. A server has no browser state, so such an event arrives with only your user ID: no visit, no UTMs and no click IDs. Linkrunner looks back for that user's most recent website visit and credits the conversion to the channel of that visit, and the window is how far back it is allowed to look.

Events the Web SDK sends from the browser are **not** affected. They already carry the visit's own channel, UTMs and click IDs, so there is nothing to look back for.

## The default

Every channel starts at **90 days**.

There are no per-channel defaults on the website side, so unlike the app, Google and Meta start where every other channel does.

The default is the same as the maximum on purpose. It is the behaviour every website project already had before this setting existed, so nothing about your reporting changes until you choose to shorten a window.

## Limits

Windows can be set from **1 to 90 days**.

Website attribution reaches back 90 days, so a longer window would not change anything. This means you can shorten a window, which is the usual reason to touch this page, and cannot lengthen it past what you already get.

<Note>

The app ceiling is 30 days, and for a different reason: Linkrunner retains app clicks for 30 days, so a longer app window cannot be honoured. The website side has no such limit in storage, so its ceiling is a product choice rather than an imposed one.

</Note>

## Change a window

Go to **Settings → Attribution Windows** in the [dashboard](https://dashboard.linkrunner.io/dashboard/settings/attribution-windows) and switch to **Web**.

The timeline shows each channel and its current click-to-conversion window. Italic values use the Linkrunner default.

<Steps>

<Step title="Choose a channel">

Click the current day value for a channel. To configure another available channel, click **Add channel** and choose it.

</Step>

<Step title="Choose the new window">

Select a value from **1 day** to **90 days**. Linkrunner saves the change automatically for this project.

</Step>

</Steps>

To return a channel to its default, select the italic default value.

A change takes up to **5 minutes** to apply, longer than the app side, because the website attribution path caches each project's windows for that long.

Changes apply going forward. Conversions already attributed keep the channel they were credited to.

## What this does not cover

**View-through attribution is app only.** Crediting a conversion to an ad impression with no click is available for app installs from affiliate partners, and not for website conversions. See [view-through attribution](/features/attribution-windows#view-through-attribution).

**App installs use their own window.** The two are set and stored separately, so shortening a website window does not touch how an app install is credited, and the reverse is also true. Switch to **App** on the same page for those.

It is also separate from the **Lookback Window** on the Remarketing page, which controls reattribution for users who already have your app.

**Need help?** Contact <support@linkrunner.io>.
