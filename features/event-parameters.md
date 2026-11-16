---
title: "Event parameters"
description: "Send details such as plan, product, or level with an event, then filter and break down your reports by them."
---

# Event parameters

<p class="vp-lead">Send details such as plan, product, or level with an event, then filter and break down your reports by them.</p>

Event parameters let you see purchases by plan, sign-ups by referral source, or levels by difficulty without creating a separate event for each one. You send them with the events you already track, as key-value pairs: `eventData` in the SDKs and `event_data` in the server API.

```json
{
    "plan": "gold",
    "billing_period": "yearly",
    "is_trial": false,
    "seats": 3
}
```

Linkrunner stores every parameter you send. In the dashboard you can then filter any event by its parameters ("`purchase` where `plan` is gold") and break a report down by a parameter (one row or column per plan).

<Note>

Already sending `eventData`? You do not need to change your app. Linkrunner already stores the parameters you send.

</Note>

## One event with a parameter, not one event per variant

Send one `purchase` event with a `plan` parameter instead of `purchase_gold`, `purchase_silver`, and `purchase_diamond`.

|                     | One event per variant                                  | One event with a parameter                   |
| ------------------- | ------------------------------------------------------ | -------------------------------------------- |
| What your app sends | `purchase_gold`, `purchase_silver`, `purchase_diamond` | `purchase` with `plan: "gold"`               |
| Total purchases     | Add up three columns by hand                           | One `purchase` column                        |
| Purchases by plan   | One column per event                                   | Filter or break down `purchase` by `plan`    |
| New plan launched   | App release with a new event name                      | No change. The new value shows up on its own |

The same rule applies to any detail that changes from one event to the next: a product category, a payment method, a level number, a screen name. Keep the event name for the action and put the details in parameters.

<Warning>

Ad network event mapping (Meta, Google, and the other networks) and SKAN conversion values still work by event name.
If an ad network must receive only one variant, for example only gold purchases, keep a separate event for that
variant and send the parameter as well.

</Warning>

## Send event parameters

Pass the parameters as the second argument of `trackEvent` (or `track` on the web). Each tab uses the call documented in that SDK's guide.

<Tabs>

<Tab title="Android">

```kotlin
CoroutineScope(Dispatchers.IO).launch {
    LinkRunner.getInstance().trackEvent(
        eventName = "purchase",
        eventData = mapOf(
            "plan" to "gold",
            "billing_period" to "yearly",
            "is_trial" to false,
            "seats" to 3
        )
    )
}
```

See [Tracking Custom Events](/sdk/android#tracking-custom-events) for the full method.

</Tab>

<Tab title="iOS">

```swift
Task {
    await LinkrunnerSDK.shared.trackEvent(
        eventName: "purchase",
        eventData: [
            "plan": "gold",
            "billing_period": "yearly",
            "is_trial": false,
            "seats": 3
        ]
    )
}
```

See [Tracking Custom Events](/sdk/ios#tracking-custom-events) for the full method.

</Tab>

<Tab title="React Native">

```javascript
import linkrunner from "rn-linkrunner";

await linkrunner.trackEvent("purchase", {
    plan: "gold",
    billing_period: "yearly",
    is_trial: false,
    seats: 3,
});
```

See [Tracking Custom Events](/sdk/react-native#tracking-custom-events) for the full method.

</Tab>

<Tab title="Flutter">

```dart
await LinkRunner().trackEvent(
  eventName: 'purchase',
  eventData: {
    'plan': 'gold',
    'billing_period': 'yearly',
    'is_trial': false,
    'seats': 3,
  },
);
```

See [Tracking Custom Events](/sdk/flutter#tracking-custom-events) for the full method.

</Tab>

<Tab title="Expo">

Expo apps use the React Native package, so the call is the same:

```javascript
import linkrunner from "rn-linkrunner";

await linkrunner.trackEvent("purchase", {
    plan: "gold",
    billing_period: "yearly",
    is_trial: false,
    seats: 3,
});
```

See [Tracking Custom Events](/sdk/react-native#tracking-custom-events) for the full method.

</Tab>

<Tab title="Capacitor">

```typescript
import linkrunner from "capacitor-linkrunner";

await linkrunner.trackEvent("purchase", {
    plan: "gold",
    billing_period: "yearly",
    is_trial: false,
    seats: 3,
});
```

See [Tracking Custom Events](/sdk/capacitor#tracking-custom-events) for the full method.

</Tab>

<Tab title="Cordova">

```javascript
linkrunner.trackEvent("purchase", {
    plan: "gold",
    billing_period: "yearly",
    is_trial: false,
    seats: 3,
});
```

See [Tracking Custom Events](/sdk/cordova#tracking-custom-events) for the full method.

</Tab>

<Tab title="Web">

```js
import { lr } from "@linkrunner/web";

lr.track("purchase", {
    plan: "gold",
    billing_period: "yearly",
    is_trial: false,
    seats: 3,
});
```

The second argument of `lr.track`, `eventData`, holds the event parameters. `lr.track` takes no third argument. See [Identify users and track events](/sdk/web#2-identify-users-and-track-events).

</Tab>

<Tab title="Unity">

`TrackEvent` takes the parameters as a JSON string. `JsonUtility.ToJson` only serializes classes marked `[System.Serializable]` with public fields. An anonymous object such as `new { plan = "gold" }` becomes `{}`, so the parameters are lost.

```csharp
[System.Serializable]
public class PurchaseParams
{
    public string plan;
    public string billing_period;
    public bool is_trial;
    public int seats;
}

var parameters = new PurchaseParams { plan = "gold", billing_period = "yearly", is_trial = false, seats = 3 };
LinkrunnerSDK.TrackEvent("purchase", JsonUtility.ToJson(parameters));
```

Keep the values flat: text, numbers, and true or false. The Android bridge in the Unity guide converts only the top level of the JSON. See [Track Events](/sdk/unity#track-events) for the full method.

</Tab>

<Tab title="API">

Send the parameters in `event_data` on [`POST /api/v1/capture-event`](/api-reference/event-capture):

```bash
curl -X POST 'https://api.linkrunner.io/api/v1/capture-event' \
  -H 'Content-Type: application/json' \
  -H 'linkrunner-key: YOUR-SERVER-KEY' \
  -d '{
    "event_name": "purchase",
    "user_id": "user_12345",
    "event_data": {
      "plan": "gold",
      "billing_period": "yearly",
      "is_trial": false,
      "seats": 3
    }
  }'
```

</Tab>

</Tabs>

### Parameters on payments

A payment is an in-app event with revenue, so it takes parameters the same way. In the SDKs, put your own keys in `eventData` next to the payment keys (`amount`, `paymentId`, `currency`, `userId`). From your server, send `event_data` next to the payment fields on [`POST /api/v1/capture-event`](/api-reference/event-capture#payment-fields). The amount still goes in `amount`, so revenue is counted as usual. See [Track payments with trackEvent](/sdk/track-payments) for the payment keys and the SDK versions that support them.

```javascript
await linkrunner.trackEvent("purchase", {
    amount: 999,
    paymentId: "payment456",
    currency: "INR",
    userId: "user123",
    plan: "gold",
    billing_period: "yearly",
});
```

This example uses React Native. Each SDK guide shows the same call for its platform under **Tracking Payments**.

### Shopify and Appbrew

- **Shopify**: the checkout pixel sends `value`, `currency`, `order_id`, `email`, and `phone` with each `purchase`. Add parameters to your own storefront events with the second argument of `lr.track`. See [Track custom events](/sdk/shopify#track-custom-events).
- **Appbrew**: the tracker sends Appbrew's events for you, with each event's Appbrew data as its parameters and the Meta catalog fields added from its items. See [What the tracker does on its own](/sdk/appbrew#what-the-tracker-does-on-its-own).

## Value types and limits

Send `eventData` as an object of key-value pairs. Linkrunner reads the type of each value from what you send:

| You send                                  | Shows in the dashboard as | Filters you can use                                                                                                                     |
| ----------------------------------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Text, such as `"gold"`                    | **Text**                  | is, is not, contains, does not contain, is set, is not set                                                                              |
| A number, such as `3` or `49.99`          | **Number**                | is equal to, is not equal to, is greater than (or equal to), is less than (or equal to), is between, is not between, is set, is not set |
| `true` or `false`                         | **True or false**         | is true, is false, is set, is not set                                                                                                   |
| A list or an object, such as `["a", "b"]` | **List or object**        | contains, does not contain, is set, is not set                                                                                          |

A few rules decide how values match:

- **Send numbers as numbers and true or false as booleans.** The dashboard gives a key the type most of its values have, and offers the filters for that type. `"5"` and `5` still count as the same value.
- **Only top-level keys can be filtered or broken down.** For a nested list or object, use **contains** to search its text.
- **Keys and exact matches are case sensitive.** `Plan` and `plan` are two different parameters, and **is** `gold` does not match `Gold`. **contains** ignores case.
- **The "not" filters also match events without the key.** **is not** and **does not contain** include events that do not carry the parameter at all. Add **is set** to leave them out.
- **Put changing values in the value, not in the key name.** Send `{ "level": 5 }`, not `{ "level_5": true }`. Keys built from IDs or dates fill the parameter list with one-off names.

These limits apply:

| What                                         | Limit                                        | What happens past it                                                                                            |
| -------------------------------------------- | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Request size, apps and server API            | 1 MB per request                             | The request is rejected with `413`                                                                              |
| Request size, websites (Web SDK and Shopify) | 64 KB per request                            | The request is rejected with `413`                                                                              |
| All parameters of one Web SDK event          | 2,048 characters as JSON text                | The Web SDK sends parameters as one piece of text. Longer text is cut, and the parameters can no longer be read |
| Parameters listed per event                  | 200, most sent first                         | The rest are stored but not offered in the parameter list                                                       |
| Key name length                              | 128 characters                               | Longer keys are stored but cannot be filtered on                                                                |
| Value length                                 | 256 characters                               | Longer values are stored but are not listed as values or matched by an exact filter                             |
| Different values for one key                 | 1,000 in 30 days                             | The key is marked **Filter only**: you can filter by an exact value, but not break down by it                   |
| Filters on one event                         | 10                                           |                                                                                                                 |
| Values in one filter                         | 50                                           |                                                                                                                 |
| Filters in one request, all events together  | 60 filters and 1,000 values                  | The request is rejected                                                                                         |
| Break downs                                  | Top 10 values, the rest grouped as **Other** | In App Campaigns, up to 10 columns from one break down                                                          |
| Filtered event columns in App Campaigns      | 25 per view                                  |                                                                                                                 |

The parameter list for each event covers the last 30 days. For payments, the list is built from completed payments.

Do not send passwords, card details, or other sensitive data as parameters.

## Reserved keys

Some keys have a meaning to Linkrunner or to an ad network. You can still filter and break down by them like any other parameter, but use them only for what they mean.

| Key                                                                | Used on                    | What it does                                                                                                                                                                                                                                                                                                                              |
| ------------------------------------------------------------------ | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `amount`, `paymentId`, `currency`, `userId`, `status`              | SDK `trackEvent`           | With `amount`, `paymentId`, and `currency` together in `eventData`, the SDK sends the event as a payment. On their own, `amount` and `currency` are ordinary parameters. See [Track payments with trackEvent](/sdk/track-payments)                                                                                                       |
| `value`, `currency`                                                | Custom events              | Meta reads `value` (a number) and `currency` (text) from a custom event's parameters. See [Meta Ads](/ad-networks/meta-ads) for when revenue is sent                                                                                                                                                                                      |
| `value`, `currency`                                                | Payments                   | On a payment sent without a top-level `amount`, such as one from an older SDK, `value` becomes the payment amount. A missing currency is read from `currency`                                                                                                                                                                             |
| `content_ids`, `contents`, `content_type`, `num_items`, `order_id` | Ecommerce events           | Sent to Meta as catalog fields when the event is mapped to a Meta commerce event. Google receives `content_ids` as item IDs. See [Meta Commerce Manager](/ecommerce-manager/meta-commerce-manager#understanding-event_data) and [Google Commerce Manager](/ecommerce-manager/google-commerce-manager#understanding-event_data-for-google) |

Your own keys sit next to these in the same object, for example `{ "content_ids": ["sku_1"], "value": 799, "currency": "INR", "plan": "gold" }`.

## Where parameters show up

| Where                                                                                    | What you can do                                                                                                                                                                                                                                                                              |
| ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Events → Your Events](/features/events-tab#your-events)                                 | The **Parameters** column counts each event's parameters. Click it to see each parameter's type, the share of events that sent it, how many different values it has, and its most common values                                                                                                       |
| [Events → Events Log](/features/events-tab#filtering-by-event-parameters)                | Pick an event, click **Filter**, and add rows such as "where `plan` is gold". Expand a row to see its parameters under **Additional Data**, and click **Filter by this value** next to one to filter by it                                                                                   |
| [Events → Events Funnel](/features/events-tab#filtering-and-breaking-down-by-parameters) | Filter any step by its parameters, for example step 2 is "`purchase` where `plan` is gold". Break the funnel down by a parameter of the step 1 event                                                                                                                                         |
| [Users and cohorts](/features/users-tab#filtering-by-event-parameters)                   | Filter users by events with parameters, for example "did `purchase` where `plan` is diamond", and save the filter as a cohort. A user's **Journey** shows each event's **Parameters**                                                                                                        |
| App Campaigns                                                                            | In **Edit Columns**, use **Filter by a parameter** on an event column to count only matching events, for example "`purchase` (plan is gold)". **Break down by a parameter** adds one column for each value you tick, up to 10. The CSV export and a campaign's **Flow** use the same columns |
| [Reporting API](/api-reference/reporting-campaigns#event-columns-with-parameter-filters) | Request the same filtered columns with `event_columns`                                                                                                                                                                                                                                       |

Filters and break downs work on app events and are available to project **Admin** and **Member** roles. Parameters you send from a website (the Web SDK or Shopify) are stored, but website reports cannot filter by them yet.

**Need help?** Contact <support@linkrunner.io>
