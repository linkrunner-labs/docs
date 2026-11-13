---
title: "My custom events aren't showing in Linkrunner"
description: "Find out why a custom event you send from your app or server is missing from Linkrunner, from a campaign, or from the event mapping list, and fix it."
---

# My custom events aren't showing in Linkrunner

<p class="vp-lead">Find out why a custom event you send from your app or server is missing from Linkrunner, from a campaign, or from the event mapping list, and fix it.</p>

<Info>

**At a glance:** first find out whether Linkrunner has received the event at all. If the name is missing from **Your Events**, the event isn't arriving. If it's there, the event is arriving and the gap is in how you're viewing it: a missing column, an organic test user, or an event that hasn't been mapped to an ad network yet.

</Info>

**Applies to:** custom events sent with `trackEvent` from the app SDK or with the [Events Capture API](/api-reference/event-capture) from your server. For website events, see [Where your events show up](/features/web-events-tracking#where-your-events-show-up).

## Check these in order

### 1. Is the event name in Your Events?

**Check:** open [Events](https://dashboard.linkrunner.io/dashboard/events) and look for the name under [Your Events](/features/events-tab#your-events). It lists every event name Linkrunner has received for the project.

**Fix:** if the name is missing, confirm your app actually calls `trackEvent` with that name, and that it's built with this project's token. Then send the event once from a test device in SDK Console under **Custom Events Tracking**.

### 2. Sent from your server? Has that user signed up through the SDK?

Server events are matched to users by `user_id`. If your app hasn't called `signup` for that user yet, Linkrunner holds the event until it does, for up to 30 days.

**Fix:** make sure your app calls `signup` with the same `user_id` your server sends. See the note at the top of [Events Capture API](/api-reference/event-capture).

### 3. Is the event there, but not against your campaign?

Events from users with no matching click are stored without a campaign. A test device that installed without a fresh click shows events, but as organic.

**Fix:** retest with the [click → install → signup flow](/testing/integration-testing#test-flow-click-→-install-→-signup) on a clean device, then send the event.

### 4. Have you added a column for it on Campaigns?

Custom events don't appear on the Campaigns table until you add a column for them.

**Fix:** open **Edit columns** and add the event. See [Event, payment and formula columns](/features/campaign-metrics#event-payment-and-formula-columns).

### 5. Mapping to Meta or Google says there are no events?

The **Your Events** list in event mapping only shows events Linkrunner has received.

**Fix:** send the event at least once (check 1), then add the mapping. You only need a mapping to send the event to an ad network. It shows in Linkrunner without one. See [Meta event mapping](/ad-networks/meta-ads#2-set-up-event-mapping) or [Google event mapping](/ad-networks/google-ads#3-set-up-event-mapping).

### 6. A purchase shows as a custom event, or revenue is missing?

That event was sent without all of its payment fields. See [Test custom events and payments](/testing/event-and-revenue-testing#troubleshooting).

## Confirm it's fixed

Send the event from a registered test device, or from your server for a user who has signed up. Then filter the [Events Log](/features/events-tab#events-log) by the event name or your test user and check the row is there.

## Still stuck?

Email support with:

- Your project name
- The exact event name
- Whether you send it from the app SDK or your server
- One test `user_id` and the time you sent the event
- Your SDK version, or the API response your server got

## Related

- [Events](/features/events-tab)
- [Test custom events and payments](/testing/event-and-revenue-testing)
- [Events Capture API](/api-reference/event-capture)
- [Help center](/help/)

**Need help?** Contact [support@linkrunner.io](mailto:support@linkrunner.io).
