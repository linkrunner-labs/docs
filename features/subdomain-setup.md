---
title: "Set up your link domain"
description: "Claim a Linkrunner sub-domain in one click, or use your own Branded sub-domain, for tracking links and deep links"
---

# Set up your link domain

Your tracking links and deep links need a domain. You have two choices.

- **Linkrunner sub-domain.** Claim `yourname.app-link.co` in one click. No DNS record. HTTPS is included and it is live in seconds. This is the fastest way to get started.
- **Branded sub-domain.** Use your own domain, such as `link.yourdomain.com`. You add one DNS record and it takes about 5 minutes.

You can start with a Linkrunner sub-domain and add a Branded sub-domain any time later.

| | Linkrunner sub-domain | Branded sub-domain |
| --- | --- | --- |
| Link looks like | `yourname.app-link.co/...` | `link.yourdomain.com/...` |
| You need | Nothing | A domain you own and access to its DNS |
| DNS record | None | One CNAME to `api.linkrunner.io` |
| HTTPS | Included | Included, after the CNAME is verified |
| Time to live | Seconds | About 5 minutes, plus DNS propagation |

## Claim a Linkrunner sub-domain

1. In the [Linkrunner dashboard](https://dashboard.linkrunner.io), go to **Settings → Manage Domains**. During project setup, you see the same choice.
2. Pick **Linkrunner sub-domain**. The dashboard suggests a name from your website or project name. Change it if you like.
3. Confirm the name.

Your links work right away. Use `https://yourname.app-link.co` wherever this documentation says "your Linkrunner domain".

### Open the app from a link

To open your app straight from a link, add the sub-domain to your app. Linkrunner hosts the `apple-app-site-association` and `assetlinks.json` files for you.

- **iOS:** add `applinks:yourname.app-link.co` to **Associated Domains**.
- **Android:** add `yourname.app-link.co` as a host in your intent filter with `autoVerify`.

See [Deep Linking Setup](/features/deep-linking-setup) for the full steps. A Linkrunner sub-domain works the same way as a Branded sub-domain.

### Rules and limits

- **Name:** 3 to 30 characters. Use lowercase letters, numbers and hyphens. No hyphen at the start or end, and no double hyphen.
- **One per project.** Each project can claim one Linkrunner sub-domain.
- **No renaming.** Links and QR codes you share already use the name, so it cannot change. Linkrunner never gives a released name to another account.
- **Names that are not allowed.** Names that look like login, payment, verification or support pages (for example names containing `login`, `verify`, `kyc`, `otp`, `wallet` or `refund`) and well-known brand names. If you own a brand, contact [support@linkrunner.io](mailto:support@linkrunner.io).
- **New accounts.** Until your account is 7 days old or has paid an invoice, campaign links on a Linkrunner sub-domain can only send people to App Store or Play Store links, your app (deep links) and your project's own website. After that, links can go to any destination.
- **Safe destinations.** Linkrunner checks every destination against Google's list of unsafe sites.
- **Acceptable use.** Linkrunner can turn off a sub-domain whose links break the acceptable use policy.

## Set up a Branded sub-domain

Use your own domain (for example `link.yourdomain.com`) for Linkrunner links. Your links look like your brand and users trust them more.

**What you need:**

- A domain you own
- Access to your domain's DNS settings

### Step 1: Choose a Branded sub-domain

From the [Linkrunner dashboard](https://dashboard.linkrunner.io), go to **Settings → Manage Domains** and click **Add Branded sub-domain**. Enter a subdomain prefix (e.g. `link`, `app`, `get`, `open`) and your domain name.

Your subdomain will look like: `subdomain.yourdomain.com`

### Step 2: Add a CNAME record

Go to your domain registrar's DNS settings and add a **CNAME** record with these values:

| Name             | Type  | Value               |
| ---------------- | ----- | ------------------- |
| `your-subdomain` | CNAME | `api.linkrunner.io` |

For example, if your subdomain is `link.example.com`, set:

- **Name:** `link`
- **Type:** CNAME
- **Value:** `api.linkrunner.io`

#### Provider-specific guides

<Tabs>

<Tab title="GoDaddy">

1. Log in to your [GoDaddy account](https://account.godaddy.com/) and go to **My Products**
2. Find your domain and click **DNS** (or **Manage DNS**)
3. Click **Add New Record**
4. Select **CNAME** as the record type
5. In the **Name** field, enter your subdomain prefix (e.g. `link`)
6. In the **Value** field, enter `api.linkrunner.io`
7. Leave **TTL** as the default (or set to 1 hour)
8. Click **Save**

</Tab>

<Tab title="AWS Route 53">

1. Open the [Route 53 console](https://console.aws.amazon.com/route53/) and go to **Hosted zones**
2. Click on your domain name
3. Click **Create record**
4. Enter your subdomain prefix in the **Record name** field (e.g. `link`)
5. Set **Record type** to **CNAME**
6. In the **Value** field, enter `api.linkrunner.io`
7. Leave **TTL** as `300` (or your preferred value)
8. Click **Create records**

</Tab>

<Tab title="Namecheap">

1. Log in to your [Namecheap account](https://www.namecheap.com/) and go to **Domain List**
2. Click **Manage** next to your domain
3. Go to the **Advanced DNS** tab
4. Click **Add New Record**
5. Select **CNAME Record** as the type
6. In the **Host** field, enter your subdomain prefix (e.g. `link`)
7. In the **Target** field, enter `api.linkrunner.io`
8. Leave **TTL** as **Automatic**
9. Click the **checkmark** to save

</Tab>

<Tab title="Cloudflare">

<Warning>

You **must** turn off Cloudflare's proxy for this record.

</Warning>

1. Log in to your [Cloudflare dashboard](https://dash.cloudflare.com/) and select your domain
2. Go to **DNS > Records**
3. Click **Add record**
4. Set **Type** to **CNAME**
5. In the **Name** field, enter your subdomain prefix (e.g. `link`)
6. In the **Target** field, enter `api.linkrunner.io`
7. Set the **Proxy status** to **DNS only** (grey cloud icon)
8. Click **Save**

</Tab>

</Tabs>

### Step 3: Verification

After adding the CNAME record, Linkrunner automatically checks your DNS configuration and provisions an SSL certificate.

- **CNAME Not Verified**: DNS record hasn't been detected yet. This can take a few minutes to propagate.
- **CNAME Verified**: Your DNS record is correctly pointing to `api.linkrunner.io`.
- **SSL Active**: Your SSL certificate has been provisioned. Your subdomain is fully ready to use.

You can click the **refresh** button next to your subdomain in the dashboard to manually re-check the status.

### Troubleshooting

**DNS propagation delay**
DNS changes can take up to 24–48 hours to propagate globally, though most providers update within a few minutes. If your CNAME isn't verified after adding it, wait and try refreshing later.

**Wrong CNAME value**
Make sure the CNAME value is exactly `api.linkrunner.io`, not your subdomain URL or an IP address.

**Cloudflare proxy interference**
If you use Cloudflare, ensure the proxy status is set to **DNS only** (grey cloud). The orange cloud (proxied) mode will interfere with SSL certificate provisioning.

**SSL still pending**
SSL provisioning happens automatically after CNAME verification and usually takes a few minutes. If it remains inactive after 30 minutes with a verified CNAME, contact support.

### Manage your sub-domains

From **Settings → Manage Domains** in the dashboard, you can:

- **Claim** a Linkrunner sub-domain or **add** a Branded sub-domain
- **Delete** a Branded sub-domain you no longer need
- **Monitor** the CNAME and SSL status of each Branded sub-domain

Links on your Linkrunner sub-domain keep working after you add a Branded sub-domain.

## FAQ

**Can I switch to my own domain later?**
Yes. Add a Branded sub-domain any time. Both sub-domains work, so links you already shared keep working.

**Can I rename my Linkrunner sub-domain?**
No. Links and QR codes in the wild use the name. Claim the name you want to keep.

**Why was my name refused?**
It may be too short or too long, use characters that are not allowed, look like a login, payment, verification or support page, or match a well-known brand. Try a different name. If you own the brand, contact [support@linkrunner.io](mailto:support@linkrunner.io).

**Why can't my campaign link go to this website?**
Your account is less than 7 days old and has not paid an invoice. Until then, links can only go to App Store or Play Store links, your app and your project's own website.

**Need help?** Contact [support@linkrunner.io](mailto:support@linkrunner.io).
