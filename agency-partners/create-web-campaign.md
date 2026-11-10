---
title: "Create an Agency Web Campaign"
description: "Create a tracked link to a customer's website from your agency workspace"
---

# Create an Agency Web Campaign

<p class="vp-lead">Create a tracked link to a customer's website from your agency workspace</p>

A web campaign is a link to the customer's website. Visits, sign-ups and revenue from it show on the customer's **Web Campaigns** page. For links that open the customer's app, see [Create an Agency Campaign Link](/agency-partners/create-campaign-link).

<Warning>

Create web campaigns from your agency workspace. A link the customer creates for you is not credited to your agency.

</Warning>

## Before you start

You need:

- An approved agency workspace. See [Set up your workspace](/agency-partners/accept-invitation).
- A customer who has engaged your agency on their project, with Web Campaigns turned on for that project.
- Permission from that customer to create web campaigns. App and Web are set separately, so access to App campaigns does not include Web (step 1).

## 1. Ask the customer to turn on Web campaigns

The customer does this once, from their own dashboard. Send them these steps.

<Steps>

<Step title="Open your agency's access">

In their project, they go to **Settings → Members** and click the sliders icon on your agency's row.

</Step>

<Step title="Turn on Web campaigns → Edit">

On the **Web campaigns** tab, they turn on **Edit** next to **Web campaigns**. This also turns on **Read**. Then they click **Save**.

![The agency access window on the Web campaigns tab, with Read and Edit turned on](/images/agency-partners/agency-access-web-tab.webp)

</Step>

</Steps>

<Note>

If the customer turns on **Only certain networks** on the Web campaigns tab, they must include your agency's own network. Otherwise you can see web campaigns but cannot create one.

</Note>

[Control agency access](/agency-partners/control-agency-access) is the customer's own reference for that window. Send it with the steps above.

## 2. Open Web Campaigns

<Steps>

<Step title="Select the customer">

Open [Linkrunner Dashboard](https://dashboard.linkrunner.io), sign in with your agency account, and pick the customer's project from the project picker at the top of the sidebar.

</Step>

<Step title="Open Web Campaigns">

Select **Web Campaigns** in the sidebar, then click **Create Campaign**.

</Step>

</Steps>

![Create Campaign on the Web Campaigns page of a customer's project, seen from an agency](/images/agency-partners/web-campaigns-agency-create-button.webp)

## 3. Fill in the campaign

1. Enter a **Name** that you and the customer will recognise.
2. Pick or type the **UTM Source**, for example `facebook`. It is required.
3. Add **UTM Medium**, **UTM Campaign**, **UTM Content** and **UTM Term** if you use them.
4. Leave **UTM ID** empty. Linkrunner generates it for agency campaigns.
5. Check the **URL Preview** at the bottom, then click **Create**.

![Create Web Campaign form with a name, UTM source and UTM campaign filled in](/images/agency-partners/web-campaign-agency-form.webp)

## 4. Copy your link

Copy the **Campaign link** and use it in your ads.

![Web campaign created, with the campaign link and campaign ID](/images/agency-partners/web-campaign-agency-created.webp)

The link ends with `lr_prt=` and your agency's code, which marks it as built by your agency. Use the link exactly as shown. The campaign is credited to your agency, and the customer sees your agency on it in their Web Campaigns list.

## 5. Check the results

A new campaign has no row in the table until the link gets its first visit. Open the link in a browser, then check **Web Campaigns** after a few minutes. Visits, sign-ups and revenue follow what the customer has given you: revenue and spend show only with **Revenue & spend** on the Web campaigns tab.

## Troubleshooting

<AccordionGroup>

<Accordion title="Web Campaigns is missing from the sidebar" description="You have no access to the customer's web campaigns.">

Ask the customer to turn on **Web campaigns → Read** for your agency (step 1). If they cannot see a **Web campaigns** tab in the access window, Web Campaigns is not turned on for their project yet.

</Accordion>

<Accordion title="The Create Campaign button is missing" description="You can see web campaigns but not create them.">

Ask the customer to turn on **Web campaigns → Edit** for your agency. You may need to refresh the page after they save.

</Accordion>

<Accordion title="&quot;The customer has turned off your access to this&quot;" description="Creating was refused when you clicked Create.">

Either **Web campaigns → Edit** was turned off, or **Only certain networks** on the Web campaigns tab leaves out your agency's network. Ask the customer to check your agency's access in **Settings → Members**.

</Accordion>

<Accordion title="&quot;Configure a Web SDK token before creating a web campaign&quot;" description="The customer's website is not set up yet.">

The customer has not set up the Web SDK on their project. Ask them to finish their website setup first.

</Accordion>

</AccordionGroup>

**Need help?** Contact <support@linkrunner.io>
