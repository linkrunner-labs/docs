---
title: "Create a Web Link for a Partner"
description: "Give an affiliate partner one link to your website, and see visits, sign-ups and revenue for each of their publishers."
---

# Create a Web Link for a Partner

<p class="vp-lead">Give an affiliate partner one link to your website, and see visits, sign-ups and revenue for each of their publishers.</p>

Your partner fills in their own values on every click, such as a publisher ID. Linkrunner then splits that partner's visitors, sign-ups and revenue by each value, so you don't need a separate link for every publisher.

For a link you share yourself, such as in an email or a social post, see [Create a web link for your own channels](/features/web-campaign-link).

## 1. Open Create Campaign

In the dashboard, go to [Web Campaigns](https://dashboard.linkrunner.io/dashboard/web-events) and click **Create Campaign**.

![The All Campaigns header on Web Campaigns, with the Create Campaign button on the right](/images/web-partner-link/create-campaign.webp)

## 2. Name the link and tag the partner

| Field            | What to enter                                                    | Example        |
| ---------------- | ---------------------------------------------------------------- | -------------- |
| **Name**         | A name your team will recognize. Required.                       | `Partner X`    |
| **UTM Source**   | The partner's name. Required. Pick it from the list or type it.  | `partnerx`     |
| **UTM Medium**   | The type of traffic.                                             | `affiliate`    |
| **UTM Campaign** | The offer or campaign the partner is running.                    | `diwali_offer` |

Leave **UTM ID** empty. Linkrunner creates a unique ID for the link. You can leave the other fields empty too.

**Referral code** adds `referrer=<code>` to the link for your own referral tracking. It does not credit a partner. To credit one, see [Credit the link to an affiliate partner](#credit-the-link-to-an-affiliate-partner).

Use the same **UTM Source** on every link you give this partner, so their links group together.

![Create Web Campaign form with Name, UTM Source, UTM Medium and UTM Campaign filled in](/images/web-partner-link/name-and-source.webp)

## 3. Add the values your partner fills in

Turn on **Let partners fill values in the link**. Linkrunner adds **Publisher ID** as the first value. Click **Add value** for each extra value, up to 5. The second one starts as **Source**.

For each value:

- **Label** is the name you see in reports, such as `Publisher ID`.
- **Placeholder** is the name that goes in the link, such as `publisher_id`. Start with a letter, then use lowercase letters, numbers and `_`, up to 32 characters.

![Let partners fill values in the link turned on, with Publisher ID and Source rows](/images/web-partner-link/partner-values.webp)

<Warning>

Agree on the values with your partner before you click **Create**. You can rename a label later, but you can't change or add placeholders once the link exists.

</Warning>

## 4. Check the link and create it

**Domain** is the website the link opens. It starts on your project's website. To send people to another domain, first add it in [Settings → Whitelist SDKs](https://dashboard.linkrunner.io/dashboard/settings/whitelist-sdks).

Check **URL Preview**. Each partner value shows as `lr_sub1={publisher_id}`, `lr_sub2={source}` and so on. Then click **Create**.

![The complete form with the Domain and the URL Preview showing lr_sub1={publisher_id} and lr_sub2={source}](/images/web-partner-link/domain-and-preview.webp)

Click **Copy** to copy the **Campaign link**. The **Campaign ID** below it is the link's `utm_id`. You use it to find the link later.

![Web campaign created, with the Campaign link and its Campaign ID](/images/web-partner-link/campaign-created.webp)

## 5. Send the link to your partner

Send the link to your partner and ask them to:

1. Replace each `{...}` placeholder with their own platform's macro, so a real value goes in on every click. For example, `lr_sub1={publisher_id}` becomes `lr_sub1={their_publisher_macro}`.
2. Keep everything else exactly as it is, especially `utm_id` and the `lr_sub` names.

This is what you send:

```text
https://www.example.com/?utm_source=partnerx&utm_medium=affiliate&utm_campaign=diwali_offer&utm_id=web_3f9a1c2e7b4d8a60&lr_sub1={publisher_id}&lr_sub2={source}
```

This is what a click should look like when it reaches your website, with real values and no braces:

```text
https://www.example.com/?utm_source=partnerx&utm_medium=affiliate&utm_campaign=diwali_offer&utm_id=web_3f9a1c2e7b4d8a60&lr_sub1=PUB_1042&lr_sub2=instagram
```

<Tip>

Does your partner's platform already send AppsFlyer-style values? The Web SDK also reads `af_siteid` or `af_sub1` as the first value, `af_sub_siteid` as the second, and `af_sub2`, `af_sub3` and `af_sub4` as the third to fifth. It reads them only when the link has no `lr_sub` parameter with that number. So ask your partner to swap `lr_sub1={publisher_id}` for their `af_siteid` parameter, not to add it next to it.

A `source` parameter is also read as the second value when the link has a `utm_id` and no `lr_sub2` or `af_sub_siteid`.

</Tip>

## 6. Test the link

1. Copy the link and replace the placeholders with test values, such as `lr_sub1=test_pub`.
2. Open it in a private browser window and sign up on your website.
3. On [Web Campaigns](https://dashboard.linkrunner.io/dashboard/web-events), open the **Campaigns** tab and search for the link's **Campaign ID**.

![Campaigns tab searched by Campaign ID, showing the Partner X row](/images/web-partner-link/find-the-link.webp)

4. Click the row. Under **Partner breakdown**, `test_pub` shows your visit and sign-up.

## See results by publisher

Click the link's row on the **Campaigns** tab. **Partner breakdown** shows **Visitors**, **Sign-ups** and **Conversion** for each value your partner sent, and **Revenue** if your role can see revenue.

![Partner breakdown on the Publisher ID tab, with a row for each publisher and Not passed](/images/web-partner-link/partner-breakdown.webp)

- **Not passed** counts visits where the partner sent no value, or left the placeholder unfilled.
- **Other** groups the values outside the top 50. It only shows when your partner sends more than 50 different values.

Switch tabs to split by another value, such as **Source**.

![Partner breakdown on the Source tab](/images/web-partner-link/partner-breakdown-source.webp)

Click **Download CSV** to share the numbers with your partner. The numbers follow the attribution you pick on the page, last touch or first touch.

<Note>

A partner gets automatic postbacks for website sign-ups and purchases only when the link is credited to them. See [Credit the link to an affiliate partner](#credit-the-link-to-an-affiliate-partner). Otherwise, share results with the CSV from **Partner breakdown**.

</Note>

## Credit the link to an affiliate partner

If your partner has a Linkrunner affiliate account, credit the link to them. They then see the link and its visitors in their own dashboard, and get a postback for each mapped sign-up or purchase it brings. Spend and revenue stay hidden from them.

<Steps>

<Step title="Connect the partner for Web campaigns">

Go to **Integrations → Affiliate Partners** and click **Connect** on the partner's card. Under **Connect for**, tick **Web campaigns**, and **App campaigns** too if they also run your app campaigns. Then click **Connect**.

![The Connect dialog with Web campaigns marked under Connect for](/images/web-partner-link/connect-for-web.webp)

For a partner you already connected, click **Configure** on their card and tick **Web campaigns** under **Campaigns**. Only admins and managers can change it. On a website-only project, partners are connected for web campaigns without the choice.

![The partner's Configure page with Web campaigns marked under Campaigns](/images/web-partner-link/partner-campaigns-web.webp)

</Step>

<Step title="Share and map your website events">

The partner gets a postback only for website events that are mapped to them. On the partner's **Configure** page, click **Share events** and pick the website events they can see. Then map the ones they should receive: under **Event mapping**, switch to **Web** and click **Add Mapping**. The partner can also map the events you shared, from their own dashboard.

</Step>

<Step title="Create the link for the partner">

In [Web Campaigns](https://dashboard.linkrunner.io/dashboard/web-events), click **Create Campaign** and pick the partner under **Affiliate partner**. Only partners connected for web campaigns are listed.

![Create Web Campaign with Pia Deals Hub picked under Affiliate partner](/images/web-partner-link/affiliate-partner-picker.webp)

**UTM ID** is generated for you. The **URL Preview** ends with `lr_click_id=` and the partner's click ID macro. The partner's platform fills in a real click ID on every click, and Linkrunner sends it back on the postback. Fill in the rest as in [step 2](#2-name-the-link-and-tag-the-partner), click **Create** and send the link to the partner.

</Step>

</Steps>

Links credited to a partner show the partner's mark next to their name on the **Campaigns** tab, and you can filter the table by **Affiliate partner**. The partner can also create web links from their own dashboard, which are always credited to them. For the partner's side, see [Web Campaigns for affiliate partners](/affiliate-partners/web-campaigns).

## Rename a label

Open the link's row and click the pencil icon at the top of the panel. Under **Values partners fill in the link**, change a label and click **Save changes**. The placeholders and the rest of the link stay the same, so the partner doesn't need a new link.

![Edit Web Campaign with editable labels and fixed lr_sub placeholders](/images/web-partner-link/edit-labels.webp)

## Troubleshooting

**The partner's value shows as Not passed.** The click reached your website with the placeholder still in it, such as `lr_sub1={publisher_id}`. Ask your partner to check that their platform replaces the macro before it sends the click.

**Visits don't show up on the link.** The `utm_id` in the link was changed or removed, so the visits count somewhere else. Ask your partner to use the link exactly as you sent it.

**Your domain is missing under Domain.** Add it in [Settings → Whitelist SDKs](https://dashboard.linkrunner.io/dashboard/settings/whitelist-sdks), then open **Create Campaign** again.

**Web Campaigns is not in the sidebar.** Turn on **Web Campaigns** for your project. See [Track your website in an app project](/features/website-projects#track-your-website-in-an-app-project).

**Need help?** Contact <support@linkrunner.io>
