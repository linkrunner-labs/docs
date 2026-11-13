---
title: "My affiliate partner can't see campaigns or clicks"
description: "Find out why an affiliate or agency partner is stuck in review, can't see the advertiser's campaigns, or sends clicks that don't show up, and fix the connection or link."
---

# My affiliate partner can't see campaigns or clicks

<p class="vp-lead">Find out why an affiliate or agency partner is stuck in review, can't see the advertiser's campaigns, or sends clicks that don't show up, and fix the connection or link.</p>

<Info>

**At a glance:** a partner sees an advertiser's campaigns only after three things are true: Linkrunner approved the partner's account, the advertiser connected the partner, and the link was created under the partner's network. Clicks then count only if the final URL keeps the campaign code and a real click ID. Work through the checks in order. Most cases stop at check 2 or 4.

</Info>

**Applies to:** affiliate partners, agencies, and the advertisers who work with them. For first-time setup, see [Getting started as an affiliate partner](/affiliate-partners/getting-started).

## Check these in order

### 1. Is the partner account still in review?

**Check:** an affiliate account in review shows **Pending verification**. In the project picker, it shows **In review**. A new agency workspace shows **We are reviewing your workspace**.

**Fix:** Linkrunner emails the partner when the review is done. Until then the partner can't start campaigns. If the review is taking longer than you expect, email support with the partner's sign-up email.

### 2. Has the advertiser connected the partner?

Approval alone doesn't give a partner access to any app. The advertiser has to connect them.

**Check:** the advertiser opens **Integrations → Affiliate Partners** and looks for the partner's card. A partner that isn't connected shows **Connect**. Agencies are listed under **Integrations → Agencies** and in **Settings → Members**.

**Fix:** click **Connect** on the affiliate's card. For an agency, follow [Invite an agency](/agency-partners/invite-an-agency), then turn on **App campaigns → Edit** so it can create links. If the affiliate has no card at all, it isn't approved yet (check 1). See [Connect your affiliate partners](/agency-partners/campaigns-for-affiliates#1-connect-your-affiliate-partners).

### 3. Is the partner signed in to the right workspace?

A company that is both an agency and an affiliate has two separate workspaces under one login. The agency workspace has no click ID parameters, no S2S credentials and no affiliate postbacks.

**Fix:** open the project picker, and under **Partner accounts** choose **Affiliate account**. A project connected both ways is listed twice, tagged **Agency** and **Affiliate**. See [Switch between your accounts](/agency-partners/add-affiliate-account#4-switch-between-your-accounts).

### 4. Was the link created under the partner's network?

A partner only sees campaigns attributed to it, and only gets postbacks for them.

**Check:** a link the advertiser created with no **Ad Channel**, or with another channel, is invisible to the partner.

**Fix:** the affiliate creates its own link from **All Campaigns → Create Link**. See [Create an affiliate campaign link](/affiliate-partners/create-campaign-link). If the advertiser already shared a link, they can [assign the partner to it](/features/create-trackable-link#assign-a-partner-to-a-link). Postbacks start with the next install.

### 5. Does the clicked URL keep the campaign code and a real click ID?

Clicks are lost when the `c` value is changed (for example a campaign name instead of the code) or a macro such as `{click_id}` reaches Linkrunner unreplaced.

**Fix:** copy the generated template exactly and have the platform replace every macro before the click. Each symptom and its fix is in [Tracking links troubleshooting](/affiliate-partners/tracking-links#troubleshooting).

### 6. Do clicks come from the partner's server instead of the user's device?

If the partner's server calls the link, or the placement sends users straight to the store, Linkrunner sees the server, not the phone, and can't match the install.

**Fix:** the advertiser turns on **S2S clicks and impressions** for the partner. See [Turn on S2S clicks for a partner](/affiliate-partners/turn-on-s2s-clicks). The partner then passes the user's device IP and user agent, see [Calling the link from your server](/affiliate-partners/tracking-links#calling-the-link-from-your-server), or uses [S2S clicks](/affiliate-partners/s2s-clicks). Installs from impressions need view-through as well, which support turns on.

### 7. Installs are credited, but the partner gets no postbacks?

Installs are sent automatically. In-app events are sent only after they are mapped.

**Fix:** map the events in [Event mapping](/affiliate-partners/event-mapping). If the partner's endpoint filters traffic, [allowlist Linkrunner's postback IPs](/affiliate-partners/postbacks#allowlist-linkrunner-postback-ips). Then read what the endpoint answered in [Postback logs](/affiliate-partners/postback-logs).

## Confirm it's fixed

- The advertiser's project appears in the partner's project picker, and the campaign appears under **All Campaigns**.
- A test click from a device, followed by an install and first open on that same device, shows on the campaign.
- [Postback logs](https://dashboard.linkrunner.io/affiliate/postback-logs) shows the install postback with the partner's click ID.

## Still stuck?

Email support with:

- The advertiser's project name and the partner's name
- The campaign link exactly as the partner uses it, with macros replaced
- One test click ID and the time of the test
- A screenshot of the partner's card under **Integrations → Affiliate Partners**

Never send S2S partner tokens, passwords or postback secret keys over email or in screenshots.

## Related

- [Getting started as an affiliate partner](/affiliate-partners/getting-started)
- [Agency campaigns for affiliates](/agency-partners/campaigns-for-affiliates)
- [Postbacks and macros](/affiliate-partners/postbacks)
- [Help center](/help/)

**Need help?** Contact [support@linkrunner.io](mailto:support@linkrunner.io).
