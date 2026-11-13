---
title: "Revenue in Linkrunner doesn't match my backend"
description: "Find out why revenue or purchases in Linkrunner are lower, doubled, missing or in the wrong currency compared with your own payment records, and which part of the setup to fix."
---

# Revenue in Linkrunner doesn't match my backend

<p class="vp-lead">Find out why revenue or purchases in Linkrunner are lower, doubled, missing or in the wrong currency compared with your own payment records, and which part of the setup to fix.</p>

<Info>

**At a glance:** first decide which kind of gap you have. Lower than your backend usually means you are reading campaign revenue, which leaves out organic users, or that some payments are not arriving as completed payments. Double usually means the same purchase is sent from two places. A wrong amount usually means a wrong `currency` code or unit. Start with check 1 and stop at the first one that explains the gap.

</Info>

**Applies to:** app payments sent with [`trackEvent`](/sdk/track-payments), the [Revenue Tracking API](/api-reference/revenue-tracking) or [RevenueCat](/analytics-integrations/revenuecat), and website payments. For how each payment field works, see [Track payments with trackEvent](/sdk/track-payments).

## Check these in order

### 1. Are you comparing campaign revenue with all your revenue?

The **Revenue** column on the Campaigns page only counts completed payments from users credited to a campaign. Payments from organic users, and from users who installed before you added the SDK, are stored but are not in campaign rows. See [Actual or Cohort basis](/features/campaign-metrics#actual-or-cohort-basis) for how the date range and the **Actual** or **Cohort** basis change the number.

**Check:** compare against your backend at user level. Export the **Paying Users** list from [Data Export](/features/data-export) and match it to your own records by user ID.

### 2. Is your payment count higher than your paying users?

Payment columns count every payment by default. A user who pays three times counts three times.

**Fix:** in **Edit columns** (the sliders icon), click the people icon next to the payment column to count unique users instead. Compare that with paying users in your backend.

### 3. Do the missing payments show in the Events Log?

**Check:** open [Events → Events Log](https://dashboard.linkrunner.io/dashboard/events), filter by your payment event and look for a few payments your backend has. Expand a row and read **Payment Status**.

- **Not in the log at all:** the SDK rejected the payment or it was never called. See [Common problems](/sdk/track-payments#common-problems).
- **In the log, but not as a payment:** it was sent without all three payment fields. See [My custom events aren't showing in Linkrunner](/help/custom-events-not-showing).
- **Status is not `PAYMENT_COMPLETED`:** only completed payments count as revenue. See [Payment status](/sdk/track-payments#payment-status).

### 4. Is the payment fired only after a successful charge?

If your app sends the payment from a screen the user may never reach, such as an in-app thank-you page, payments made when the user leaves early are lost.

**Fix:** send the payment from the point where your app or server learns the charge succeeded. If your app can't see every charge, send payments from your backend with the [Revenue Tracking API](/api-reference/revenue-tracking).

### 5. Missing on Android or iOS only?

Payment keys in `trackEvent` need a minimum SDK version on each platform. On an older version, the call stays a custom event.

**Check:** compare each app's SDK version with the [minimum versions](/sdk/track-payments) table. If you still call `capturePayment`, follow [Migrate payments to in-app events](/sdk/migrate-to-track-event).

### 6. Does the user ID on the payment match the one from signup?

Linkrunner links a payment to its campaign through the user. The `userId` on the payment must be the same ID your app passes to `signup`.

**Fix:** use one user ID everywhere: in `signup`, in `trackEvent` and in server-side payments. Call `signup` at login as well as at account creation, so existing users who log in on a new install are linked too ([React Native](/sdk/react-native#user-identification-required), [Android](/sdk/android#user-identification-required)).

### 7. Is revenue about double your backend?

The same purchase sent from both your app and your backend with different payment IDs is counted twice.

**Fix:** send each payment from one place, or use the same `paymentId` and event name from both. See [Deduplication and retries](/sdk/track-payments#deduplication-and-retries).

### 8. Is the amount wrong, or in the wrong currency?

**Check:** open a payment in the Events Log and compare **Amount** and **Currency** with your backend. A wrong `currency` code, or an amount in the wrong unit such as cents instead of dollars, makes revenue wrong everywhere.

Revenue on the Campaigns page is shown in your project's currency, and Overall Data exports convert revenue to your project's display currency. Convert your backend figures the same way before you compare.

### 9. Do your users pay on your website?

Payments made on your website are website payments. They need the [Web SDK](/sdk/web), and they show on the [Web Events](https://dashboard.linkrunner.io/dashboard/web-events) page, not in the app dashboards. See [Website payments](/api-reference/revenue-tracking#website-payments).

### 10. Is the campaign iOS only?

Revenue and ROAS can't be credited to iOS-only campaigns and show as `-` with an Apple icon. See [iOS Campaign Data Limitations](/features/ios-campaign-data-limitations).

## Confirm it's fixed

Send a test payment with a new `paymentId` from an attributed test user, and check it in the Events Log with the right **Amount**, **Currency** and **Payment Status**. Then pick a full day after your change and compare the **Paying Users** export with your backend for the same users.

## Still stuck?

Email support with:

- Your project name
- The date range and the revenue figure you expected, and where it came from
- Three to five payment IDs that are missing or wrong, with their user IDs
- How you send payments: app SDK, your backend, RevenueCat or the Web SDK
- Your SDK and app version on each platform

## Related

- [Track payments with trackEvent](/sdk/track-payments)
- [Test Custom Events and Payments](/testing/event-and-revenue-testing)
- [What the Campaigns columns mean](/features/campaign-metrics)
- [A number on my dashboard looks wrong](/help/dashboard-numbers-look-wrong)
- [Help center](/help/)

**Need help?** Contact [support@linkrunner.io](mailto:support@linkrunner.io).
