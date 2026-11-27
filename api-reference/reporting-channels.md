---
title: "Channels Reporting API"
description: "Installs, sign-ups, revenue and spend for every acquisition channel, including Organic and Referrals, for a date range or day by day."
---

# Channels Reporting API

<p class="vp-lead">Installs, sign-ups, revenue and spend for every acquisition channel, including Organic and Referrals, for a date range or day by day.</p>

This API returns the numbers shown on the **Channel** tab of the App Campaigns page of the Linkrunner dashboard: one row per channel. Use it for traffic that is not a campaign, such as [organic installs](#organic) and [referrals](#referrals). For campaign, ad set and ad numbers, use the [Reporting API](/api-reference/reporting-campaigns). For website traffic, use the [Web Campaigns Reporting API](/api-reference/reporting-web-campaigns).

## Base URL

```
https://api.linkrunner.io/api/v1
```

## Authentication

Pass your project's server key in the `linkrunner-key` header. This is the same key the [Reporting API](/api-reference/reporting-campaigns) and other `/api/v1` endpoints use. Find it under [Settings → Data APIs](https://dashboard.linkrunner.io/settings?s=data-apis):

```
linkrunner-key: YOUR_API_KEY
```

## Postman collection

[Download the Postman collection](https://docs.linkrunner.io/api-reference/reporting-channels.postman_collection.json). Import it into Postman, set the `linkrunner_key` collection variable to your key, and run any request.

## Rate limit and freshness

- **1 request per minute per API key** (`429` with `Retry-After: 60` when exceeded). This limit is separate from `/reporting/campaigns` and `/reporting/web-campaigns`, so you can pull campaigns, channels and web numbers in the same minute.
- 30 req/sec per source IP (shared across all `/api/v1` endpoints).
- Cache responses for at least 60 seconds. Polling faster returns the same data.

## Endpoint

```
GET https://api.linkrunner.io/api/v1/reporting/channels
```

<Warning>

Do not call the docs page URL (`/api-reference/reporting-channels`) as the API endpoint. The API path is `/api/v1/reporting/channels`.

</Warning>

### Example request

<Tabs>

<Tab title="cURL">

```bash
curl 'https://api.linkrunner.io/api/v1/reporting/channels?from=2026-11-19&to=2026-11-25' \
  -H 'linkrunner-key: YOUR_API_KEY'
```

</Tab>

<Tab title="Google Apps Script">

```js
const response = UrlFetchApp.fetch("https://api.linkrunner.io/api/v1/reporting/channels?from=2026-11-19&to=2026-11-25", {
    method: "get",
    headers: {
        "linkrunner-key": "YOUR_API_KEY",
    },
});

const data = JSON.parse(response.getContentText());
```

</Tab>

</Tabs>

### Response

```json
{
    "msg": "Channels fetched successfully",
    "status": 200,
    "data": {
        "channels": [
            {
                "channel_code": "META",
                "channel_label": "Meta Ads",
                "custom_channel_code": null,
                "custom_channel_name": null,
                "campaign_count": 12,
                "clicks": 18420,
                "impressions": 0,
                "installs": 1234,
                "sign_ups": 410,
                "conversion": 33.23,
                "revenue": 52300,
                "revenue_event_count": 0,
                "spend": 41800,
                "roas": 1.25,
                "cost_per_install": 33.87,
                "cost_per_signup": 101.95,
                "reinstalls": 0,
                "uninstalls": 0,
                "suspicious_installs": 0,
                "active_users": 980,
                "click_through_attribution": 0,
                "view_through_attribution": 0,
                "retention_7d": 12,
                "retention_30d": 2,
                "rolling_retention_d1": 36,
                "rolling_retention_d7": 4,
                "display_currency": "INR",
                "custom_events": {},
                "payment_events": {}
            },
            {
                "channel_code": "REFERRALS",
                "channel_label": "Referrals",
                "installs": 3,
                "...": "same fields as every channel"
            },
            {
                "channel_code": "ORGANIC",
                "channel_label": "Organic",
                "installs": 9370,
                "sign_ups": 5776,
                "clicks": 0,
                "spend": 0,
                "...": "same fields as every channel"
            }
        ],
        "display_currency": "INR"
    }
}
```

Numbers are plain JSON numbers, not formatted strings. Money is in `display_currency`, your project's display currency. Channels with no traffic in the range can be missing from the list, so look rows up by `channel_code`, not by position.

### Query parameters

| Parameter                                                | Type    | Default  | Notes                                                                                                                                                                                                                                                     |
| -------------------------------------------------------- | ------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `from`, `to`                                             | string  | all time | `YYYY-MM-DD`, inclusive, in your project's timezone. `start_date` / `end_date` are accepted aliases. A date that is not `YYYY-MM-DD`, or a `to` before `from`, returns `422`.                                                                              |
| `platform`                                               | string  | all      | `ios` or `android`. Narrows every channel, Organic included. Any other value returns `422`.                                                                                                                                                               |
| `events`, `payment_events`, `unique_user_events`         | string  | none     | Comma separated event names to return in `custom_events` and `payment_events`. Works as it does on the [Reporting API](/api-reference/reporting-campaigns#event-columns). Name no events and both maps come back empty.                                    |
| `event_columns`                                          | string  | none     | Event counts filtered by [event parameters](/features/event-parameters), as a URL-encoded JSON array. Same format as on the [Reporting API](/api-reference/reporting-campaigns#event-columns-with-parameter-filters).                                        |
| `active_users`                                           | integer | 7        | Active-users window in days, from 1 to 31.                                                                                                                                                                                                                |
| `granularity`                                            | string  | (none)   | `day` adds a `daily` array to every channel. See [Day-level breakdown](#day-level-breakdown).                                                                                                                                                             |

These parameters from the Reporting API do nothing here, and are ignored: `network`, `meta_account_id`, `search`, `active`, `view`, `page`, `limit`, `sort_field`, `sort_order`, `cost_per_event` and `timezone`.

- Organic belongs to no ad network, ad account, campaign name or campaign status, so a filter on any of those has no meaning for it. The list is one row per channel, so there is nothing to page or sort.
- Channels have no per-event cost, because Organic has no spend.
- Days follow your project's timezone for every channel and for Organic, so `timezone` is not read.

## Organic

The `ORGANIC` row is every install the other channels do not count: installs with no campaign, installs with an ad network but no campaign, installs that happened before their campaign existed, installs outside the attribution window, and payments that never matched an install. Together, the channel rows and Organic cover every install in the range.

It is the same Organic row the dashboard shows above the campaign list, with these differences from the other rows:

- `clicks`, `impressions` and `spend` are `0`, and so are the values derived from them (`roas`, `cost_per_install`, `cost_per_signup`).
- `campaign_count` is `0`.

If the organic numbers cannot be read, the request returns `503` instead of a list without Organic. Retry after a short backoff.

## Referrals

The `REFERRALS` row holds installs from [referral links](/features/referral-codes): links on your own domain that carry `?referrer=<code>`. Other links on that domain stay in `LINKRUNNER_LINKS`.

## Channel codes

| `channel_code`                             | What it covers                                                                  |
| ------------------------------------------ | ------------------------------------------------------------------------------- |
| `META`, `META_WEB_TO_APP`                  | Meta Ads app campaigns, and Meta web-to-app campaigns                           |
| `GOOGLE`, `GOOGLE_WEB_TO_APP`              | Google Ads app campaigns, and Google web-to-app campaigns                       |
| `APPLE_SEARCH_ADS`                         | Apple Search Ads                                                                |
| `TIKTOK`, `SNAPCHAT`, `LINKEDIN`, `REDDIT` | Those ad networks                                                               |
| `CHATGPT`, `SHARECHAT`, `X`                | Those ad networks                                                               |
| `SANDBOX_ADS`, `JIO_COUPONS`               | Those ad networks                                                               |
| `LINKRUNNER_LINKS`                         | Your own Linkrunner links with no ad network                                    |
| `REFERRALS`                                | [Referral links](#referrals)                                                    |
| `ORGANIC`                                  | [Everything the rows above do not count](#organic)                              |

A custom channel you created in the dashboard comes back as its own row, with `custom_channel_code` and `custom_channel_name` set. A code that is not in this table is returned as it is.

## Day-level breakdown

Add `granularity=day` to get each channel's numbers per day in the same call. `from` and `to` are required and can cover at most 31 days. For a longer period, make one call per month.

```bash
curl 'https://api.linkrunner.io/api/v1/reporting/channels?granularity=day&from=2026-11-01&to=2026-11-30' \
  -H 'linkrunner-key: YOUR_API_KEY'
```

Each channel keeps its totals for the whole range and gets a `daily` array, oldest day first. `data.granularity` is `"day"`.

```json
{
    "channel_code": "ORGANIC",
    "channel_label": "Organic",
    "installs": 9370,
    "sign_ups": 5776,
    "daily": [
        { "date": "2026-11-01", "installs": 1320, "sign_ups": 801 },
        { "date": "2026-11-02", "installs": 1296, "sign_ups": 790 }
    ]
}
```

- Every channel has one entry for every day. A channel with no traffic that day gets zeros.
- A day row has these fields: `clicks`, `impressions`, `installs`, `sign_ups`, `conversion`, `revenue`, `revenue_event_count`, `spend`, `roas`, `cost_per_install`, `cost_per_signup`, `reinstalls`, `uninstalls`, `suspicious_installs`, `click_through_attribution`, `view_through_attribution`, `custom_events` and `payment_events`. Retention, `active_users` and `campaign_count` need a longer window, so they are only on the channel.
- Days are in your project's timezone, like `from` and `to`.
- Installs, clicks, revenue and spend add up across days to the channel total. `sign_ups` and distinct-user event counts are estimates over the whole range, so the days can add up to slightly more or less than the total. Ratios such as `roas` and `conversion` are per day, so do not add them.
- A day-level request is still one request for the rate limit. It runs one read per day, so a long range with many event columns can answer `503`. Use a shorter range or fewer event columns.

## Errors

| Status | Meaning                                                                                                                       |
| ------ | ----------------------------------------------------------------------------------------------------------------------------- |
| `401`  | The `linkrunner-key` header is missing, wrong, or the key is inactive.                                                        |
| `402`  | Your billing account is suspended. The body has a `payment_link`.                                                             |
| `422`  | A parameter is invalid. The `msg` names it.                                                                                   |
| `429`  | More than one request in a minute for this key.                                                                               |
| `503`  | The Organic numbers or the day-level breakdown could not be read in time. Retry after a short backoff, or use a shorter range. |
| `500`  | The request failed. Retry after a short backoff.                                                                              |

## TypeScript types

```ts
export interface ReportingChannelsResponse {
    msg: string;
    status: number;
    data: {
        channels: Channel[];
        display_currency: string | null;
        granularity?: "day"; // present when you sent granularity=day
    };
}

export interface Channel {
    channel_code: string;
    channel_label: string;
    custom_channel_code: string | null;
    custom_channel_name: string | null;
    campaign_count: number;
    clicks: number;
    impressions: number;
    installs: number;
    sign_ups: number;
    conversion: number;
    revenue: number;
    revenue_event_count: number;
    spend: number;
    roas: number;
    cost_per_install: number;
    cost_per_signup: number;
    reinstalls: number;
    uninstalls: number;
    suspicious_installs: number;
    active_users: number;
    click_through_attribution: number;
    view_through_attribution: number;
    retention_7d: number;
    retention_30d: number;
    rolling_retention_d1: number;
    rolling_retention_d7: number;
    display_currency: string;
    custom_events: { [name: string]: { count: number; amount: number } };
    payment_events: { [type: string]: { count: number; amount: number } };
    daily?: DailyRow[]; // present when you sent granularity=day, oldest day first
}

// One day of a channel. Same field names as Channel.
export interface DailyRow {
    date: string; // YYYY-MM-DD, project timezone
    clicks: number;
    impressions: number;
    installs: number;
    sign_ups: number;
    conversion: number;
    revenue: number;
    revenue_event_count: number;
    spend: number;
    roas: number;
    cost_per_install: number;
    cost_per_signup: number;
    reinstalls: number;
    uninstalls: number;
    suspicious_installs: number;
    click_through_attribution: number;
    view_through_attribution: number;
    custom_events: Channel["custom_events"];
    payment_events: Channel["payment_events"];
}
```

**Need help?** Contact <support@linkrunner.io>
