---
title: "JioHotstar Ads for Web"
description: "Record JioHotstar ad clicks on your website and send your website's conversions to JioHotstar Ads through the Linkrunner Web SDK"
---

# JioHotstar Ads for Web

<p class="vp-lead">Record JioHotstar ad clicks on your website and send your website's conversions to JioHotstar Ads through the Linkrunner Web SDK</p>

Use this guide when you run JioHotstar Ads that send people to your website and you already use the [Web SDK](/sdk/web). The Web SDK does two things for JioHotstar traffic:

- It stores the JioHotstar click ID (`hsClkId`) from the landing URL, so visits and later conversions are tied to the JioHotstar ad and read as `jiohotstar` traffic.
- If you give it your JioHotstar pixel ID, it loads JioHotstar's pixel and forwards the events JioHotstar supports, so one `lr.track` call reports to both Linkrunner and JioHotstar.

<Note>

This is a browser-side setup. Linkrunner does not send JioHotstar conversions from its servers, does not sync JioHotstar ad spend, and has no JioHotstar page in the dashboard. JioHotstar counts and attributes conversions in its own Ads Manager.

</Note>

## What you need

- The Web SDK installed with your Web project token. See [Web SDK](/sdk/web).
- A JioHotstar pixel ID from JioHotstar Ads Manager.
- A landing page URL that keeps the `hsClkId` query parameter.

## 1. Get your pixel ID

In JioHotstar Ads Manager:

1. Start campaign setup and open **Ad Creative** (**Step 2: Adset → Creative**).
2. Scroll to **Event Tracking** and make sure **Web** is selected.
3. Copy the value in the **Pixel Id** field.

You only need the ID. Do not paste JioHotstar's pixel code into your site, because the Web SDK loads the pixel for you.

## 2. Add the pixel ID to the Web SDK

Add `data-hotstar-pixel-id` to the Linkrunner script tag you already have.

<Tabs>

<Tab title="CDN script">

```html
<script
  src="https://cdn.linkrunner.io/web/v1/lr.js"
  data-token="YOUR_WEB_SDK_TOKEN"
  data-hotstar-pixel-id="YOUR_HOTSTAR_PIXEL_ID"
  defer
></script>
```

</Tab>

<Tab title="Next.js">

```tsx
// app/layout.tsx
import { LinkrunnerScript } from '@linkrunner/web/next'

<LinkrunnerScript
  token="YOUR_WEB_SDK_TOKEN"
  hotstarPixelId="YOUR_HOTSTAR_PIXEL_ID"
/>
```

</Tab>

<Tab title="LinkrunnerConfig">

```html
<script>
  window.LinkrunnerConfig = {
    token: 'YOUR_WEB_SDK_TOKEN',
    hotstarPixelId: 'YOUR_HOTSTAR_PIXEL_ID',
  }
</script>
<script src="https://cdn.linkrunner.io/web/v1/lr.js" defer></script>
```

</Tab>

</Tabs>

With a pixel ID set, the SDK loads JioHotstar's pixel script, initializes it, and sends one `PageView` per page load. Without a pixel ID, the SDK makes no request to JioHotstar. The SDK also skips the pixel for bot traffic, such as crawlers and automated browsers.

<Warning>

If your page already runs JioHotstar's own pixel snippet, the SDK reuses it and does not initialize it again. Do not also call `hspixel('track', ...)` for events you send with `lr.track`, or JioHotstar receives them twice.

</Warning>

If your site sets a Content Security Policy, allow these JioHotstar hosts:

- `hspx.hotstar.com` in `script-src` (the pixel script) and `img-src` (the event requests).
- `secure-media.hotstar.com` in `connect-src` (the pixel's configuration request).

## 3. Keep `hsClkId` on the landing URL

JioHotstar's pixel and the SDK both read the `hsClkId` query parameter from the landing page URL. The SDK accepts any capitalization.

```text
https://your-site.com/offer?hsClkId=abc123
```

Do not strip or rewrite query parameters in redirects or your landing page code before the SDK runs. The SDK keeps the click ID for 90 days as the last JioHotstar click, keeps the first one as first touch, and sends them on every event as `hsclkid` and `ft_hsclkid`. The visit's traffic source is `paid_display` with the name `jiohotstar`.

<Note>

The 90 days applies to Linkrunner only. JioHotstar's own pixel keeps the click ID in a cookie for 7 days, so JioHotstar may not attribute a conversion that happens later than that, even though Linkrunner still records it against the JioHotstar click.

</Note>

## 4. Send events

Send events with `lr.track`. The SDK forwards the ones JioHotstar supports.

```js
import { lr } from '@linkrunner/web'

lr.track('purchase', { amount: 400, purchase_id: 'ORDER-1001' })
lr.track('signup', { subscription_id: 'sub-42' })
```

| Event name you send | JioHotstar event |
| --- | --- |
| `purchase` | `Purchase` |
| `add_to_cart` | `AddToCart` |
| `initiate_checkout` | `InitiateCheckout` |
| `lead` or `generate_lead` | `GenerateLead` |
| `signup` or `sign_up` | `SignUp` |
| `view_content` | `ViewContent` |
| `search` | `Search` |

Names match without regard to capitalization, spaces, hyphens, or underscores. Events with any other name go to Linkrunner only. `PageView` is sent for you.

These keys in the event data are forwarded to JioHotstar when present:

- `content_id`, `content_type`, `purchase_id`, `value`, `product_id`, `discount`, `lead_id`, `subscription_id`, `search_text`
- `cdf1` to `cdf5` for custom values. JioHotstar accepts up to five custom parameters, so the SDK forwards only these five.

If `value` is missing, the SDK sends `amount` as `value`. Values are sent as text, and object values are skipped. Every other key goes to Linkrunner only.

<Note>

Linkrunner credits a conversion to the visitor's latest ad click, but JioHotstar's pixel does not know about other networks. JioHotstar can still count a conversion that Linkrunner credits to another network, such as a later Google click. Each network's pixel counts on its own, so the numbers in JioHotstar Ads Manager and in Linkrunner can differ.

</Note>

## 5. Verify

1. Add `data-debug="true"` to the script tag and open your page with `?hsClkId=test123`.
2. In the browser console, look for `[Linkrunner] Click IDs found` with `hsclkid: 'test123'`, and `[Linkrunner] Hotstar pixel started`. If your own JioHotstar snippet is on the page, you see `Hotstar pixel already on the page, reusing it` instead.
3. Call `lr.track('purchase', { amount: 1, purchase_id: 'TEST-1' })`. The console shows `[Linkrunner] Forwarded to Hotstar`.
4. In the browser **Network** tab, find the request to `hspx.hotstar.com/v1/events/track/cp_action`. It carries `evn=Purchase`, `pi` with your pixel ID, and `hclk=test123`.

Use the console for the Linkrunner side. If payload encryption is on for your project, the body sent to Linkrunner is sealed, so you cannot read `hsclkid` in the Network tab.

This shows that your browser sent the events. Whether JioHotstar counts them as conversions is reported in JioHotstar Ads Manager, not in Linkrunner. Remove `data-debug="true"` after testing.

## Troubleshooting

<AccordionGroup>

<Accordion title="No request goes to hspx.hotstar.com">

Check that `data-hotstar-pixel-id` is set and that the event name is in the table above. JioHotstar's pixel also decides for itself whether to send: it can be switched off or exclude domains from JioHotstar's side. If the console shows `Forwarded to Hotstar` but the Network tab shows no request, ask JioHotstar whether the pixel is enabled for your domain. An ad blocker or a Content Security Policy can also block `hspx.hotstar.com`.

</Accordion>

<Accordion title="hsclkid is empty">

The landing URL did not carry `hsClkId`, or a redirect removed it. Open the landing page directly with `?hsClkId=test123` and check again.

</Accordion>

<Accordion title="JioHotstar counts each conversion twice">

Your page runs JioHotstar's own `hspixel('track', ...)` calls for events you also send with `lr.track`. Keep one of them.

</Accordion>

</AccordionGroup>

**Need help?** Contact [support@linkrunner.io](mailto:support@linkrunner.io).
