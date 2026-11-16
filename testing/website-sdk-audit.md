---
title: "Audit your website's SDK setup"
description: "Run an automated audit that visits your website like a customer and reports what the Linkrunner Web SDK sends."
---

# Audit your website's SDK setup

<p class="vp-lead">Run an automated audit that visits your website like a customer and reports what the Linkrunner Web SDK sends.</p>

Website audits run from [SDK Console → Web](https://dashboard.linkrunner.io/dashboard/sdk-console?kind=website) in the dashboard. A real browser lands on your site from ad links, walks it like a shopper, and checks every request the Web SDK sends. You get a report with each issue and how to fix it. You need to be a project admin or member.

For a quick manual check from your own browser, use [Test the Web SDK](/testing/web-sdk-testing) instead.

## Before you start

- Add the Linkrunner Web SDK to your website with this project's Web SDK token. See the [Web SDK guide](/sdk/web).
- If the site asks for a password, sits behind a protection bypass, or needs a test account to sign in, have those details ready.

## Start an audit

<Steps>

<Step title="Open SDK Console → Web">

Open [SDK Console](https://dashboard.linkrunner.io/dashboard/sdk-console?kind=website) and select **Web** (1). A project with only a website opens on its website audits directly.

![SDK Console with the Web switch, Daily check, and Audit website marked](/images/sdk-health/sdk-console-web-audit.webp)

1. **Web** shows your website audits.
2. **Daily check** audits your site again on its own. See [Audit your site every day](#daily-check).
3. **Audit website** starts an audit.

</Step>

<Step title="Choose where the audit starts">

Click **Audit website**. The form starts on your project's website.

![The Audit your website form with the website address, access option, notes, and Start run marked](/images/sdk-health/website-audit-start-form.webp)

1. **Website URL** holds your project's website. To audit another page, such as a staging or QA site, pick it from **Website** or type its address.
2. Tick **This site needs a password or a test login** when the site needs one. You can add a **Browser password prompt** (username and password), a **Protection bypass** (a header such as Vercel's `x-vercel-protection-bypass`, a query value, or a cookie), and a **Test login** (email or username and password).
3. **Notes for the audit (optional)** tells the audit which pages to start on or which steps to skip, in up to 2,000 characters. Notes are deleted when the audit finishes.
4. Click **Start run**.

</Step>

<Step title="Wait for the address check">

When you type a different address, Linkrunner checks it before you can start. **Checking this site…** shows under the field (1), and **Start run** stays off until the check answers.

![The address check shown under a changed website address](/images/sdk-health/website-audit-address-check.webp)

- If the check refuses the address, the form says why, and you can't start an audit on it. Use your public site or another address.
- If the check can't answer right now, you can still start. The audit checks the address again before it opens the site.

</Step>

</Steps>

<Note>

The audit uses your site like a visitor and may sign up with a test account. Its traffic is marked as bot traffic and kept out of your reports. You can get one website report every 3 hours, counted from when the last one was delivered. Stopping an audit after it starts still uses it.

</Note>

## What the audit does

The audit:

- Lands on your site from Meta, Google, TikTok, and Microsoft ad links, on a phone and on a desktop.
- Reloads the page, returns from an email link and in a new tab, and arrives from a Google search.
- Visits with ad blockers that block Linkrunner.
- Walks the site like a shopper: it looks around, signs up when it can, opens a product, adds it to the cart, and goes through checkout up to the payment step. It never pays or places an order.

It then compares what your site sent to Linkrunner with what each step should send, and checks which of those events Linkrunner received.

## Read the results

Each audit appears in the list with its status.

![The website audits list with a completed audit, an audit that needs action, and Download report marked](/images/sdk-health/website-audit-runs.webp)

1. **Completed**: the audit finished and its report is ready. A red mark next to it means it found issues.
2. **Action needed**: something on your site stopped the audit. The row says what to change. Fix it, then run the audit again. **Failed** means the audit stopped on Linkrunner's side, so run it again later. **Stopped** means you stopped it.
3. **Download report** downloads the report as a PDF.

Open an audit to see its results.

![An audit's results with the summary, Copy fixes for your developer, the check filters, an issue with its fix, Download report, and the run log marked](/images/sdk-health/website-audit-run-page.webp)

1. The summary shows how many issues the audit found and how many checks passed.
2. **Copy fixes for your developer** copies every issue and its fix as Markdown, ready to paste into a ticket for your developer.
3. The filters show all checks, or only issues, checks to review, checks the audit could not verify, or passed checks.
4. Each issue says what the audit saw. Click **Show fix** to see the change to make.
5. **Download report** downloads the PDF report.
6. **Run log** shows each stage of the audit as it ran.

In the report, a step that is **done in the browser, not confirmed** is one the audit completed, such as adding a product to the cart, while your site sent nothing to Linkrunner for it. Add the event for that step, then audit again.

## Audit your site every day {#daily-check}

Click **Daily check**, choose the website, turn on **Automatic checks**, and click **Save**. Linkrunner checks your website's SDK setup once a day and runs a full audit again when the setup changes. The dialog shows when the next check runs and what the last one found.

## If the audit can't run

| The audit says | What to do |
| --- | --- |
| We could not open this website | Check that the site opens in a browser outside your office network or VPN. |
| This website asks for a password before it opens | Run the audit again, tick **This site needs a password or a test login**, and add the password. |
| We could not find the Linkrunner Web SDK on this website | Add the Web SDK to the site with the [Web SDK guide](/sdk/web). |
| This website sends a different Linkrunner project's Web SDK token | Use this project's Web SDK token on the site. |
| Linkrunner rejected the Web SDK token on this website | Check that the site uses this project's current Web SDK token. |
| Bot protection blocked the audit on this website | Allowlist the audit traffic addresses shown in the message in your bot protection settings, or audit a staging address without bot protection. |
| This website blocked the audit because of the region it connects from | Audit an address that is open to visitors from every region. |
| The website looked unsafe to open automatically | Use your public site's address. Contact support if the site is yours and safe. |

**Need help?** Contact [support@linkrunner.io](mailto:support@linkrunner.io).
