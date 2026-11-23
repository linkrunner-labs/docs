---
title: "Check your Android build with SDK Health"
description: "Upload your Android app and get a report of what the Linkrunner SDK sends, with a fix for each problem it finds."
---

# Check your Android build with SDK Health

<p class="vp-lead">Upload your Android app and get a report of what the Linkrunner SDK sends, with a fix for each problem it finds.</p>

SDK Health is the **Health** tab in [SDK Console](https://dashboard.linkrunner.io/dashboard/sdk-console). A test phone installs your build and uses it like a real person while the audit checks what the SDK sends. You need to be a project admin or member. It works with Android apps only. For iOS, test with [SDK Console](/testing/integration-testing#test-with-sdk-console-beta).

## Before you start

- Set your app's Play Store link as **Playstore URL** in [Settings → Project Details](https://dashboard.linkrunner.io/dashboard/settings/project-details). An audit can't start without it.
- The build must have the Linkrunner SDK with this project's token and your app's package name, or the audit stops with **Project mismatch** or **Action needed**.
- Upload an `.apk`, `.apks` or `.xapk` file up to 512 MB. `.aab` files can't be uploaded. A free app on Google Play can use its Play Store URL instead.
- If the app needs a sign-in, have a test login ready. See [Apps that need a sign-in](#sign-in).

<Warning>

The audit uses your app like a real person, so its installs, sign-ups and events go into the numbers of the project you run it from. Use a test build if you don't want test data in your production numbers: build the app with a separate test project's token, and run the audit from that test project.

</Warning>

## Start an audit

<Steps>

<Step title="Open SDK Console → Health">

![SDK Console Health tab with Start run and Version monitoring marked](/images/sdk-health/sdk-health-start-run.webp)

1. **Health** lists this project's audits, newest first.
2. **Start run** → **Upload APK** or **Use Play Store URL**.
3. **Version monitoring**: see [Audit each new version](#version-monitoring).

</Step>

<Step title="Upload your build">

Click **Start run** → **Upload APK**.

![The Upload your app form with its fields marked](/images/sdk-health/sdk-health-upload-apk.webp)

1. **App File**: your `.apk`, `.apks` or `.xapk` file.
2. **Notes for the audit (optional)**: a test login or anything else the audit needs, up to 2,000 characters. Notes are deleted when the audit finishes.
3. The warning about real data and the report limit.
4. Click **Start run**, and keep the tab open until the upload finishes. An upload that doesn't finish within an hour stops and doesn't count toward your limit.

</Step>

</Steps>

For **Use Play Store URL**, the form starts with your project's Play Store link. Add notes and click **Start run**. It works only for free apps that Google Play offers for download. The **Upload APK** button on Get Started's **App SDK testing** task starts the same audit, without notes.

## While it runs

The audit waits in a queue for a test phone. Once it is checking your app, it usually takes 25 to 40 minutes. You can leave the page.

![A running audit with its time, Notify me and Stop marked](/images/sdk-health/sdk-health-running.webp)

1. Time so far, next to the usual length.
2. **Notify me when it's done** shows a browser notification if this page is still open in a tab. Linkrunner also emails the report to whoever started the audit.
3. **Stop**: once the audit is checking your app, a stopped run still counts toward your report limit.

## Read the report

![A finished audit with the summary, Copy fixes, filters, an issue and Download report marked](/images/sdk-health/sdk-health-report.webp)

1. How many issues were found, where, and how many checks passed.
2. **Copy fixes for your developer** copies every issue and its fix as Markdown for a ticket.
3. Filters: **All**, **Issues**, **Needs review**, **Not verified** (only when something couldn't be checked) and **Passed**.
4. Each issue is **Must fix** or **Should fix**. Click **Show fix** for the change to make.
5. **Download report** gets the PDF. Reports are kept for 90 days, then show **Expired**.

## What the audit checks

The audit finds the Linkrunner features your app uses and checks each one. Only those areas appear.

| Area | What the audit does |
| --- | --- |
| **SDK setup** | Opens the app after install and from the background, and checks the install is recorded. With the Meta SDK, checks Meta can match your events to the same device. |
| **Sign-up tracking**, **Login tracking** | Signs up or in, with the test login from your notes if needed. |
| **Custom events** | Triggers every event it can reach. |
| **Purchase tracking**, **Subscription tracking** | Goes up to the payment, never a real charge, so the payment shows **Could not verify**. |
| **Deep linking**, **Install attribution** | Opens the links your app handles and checks the attribution data it reads. |
| **Uninstall tracking** | Checks the app shares its notification token. |
| **User consent**, **Device data** | Checks the consent and device data the SDK sends. |

It only checks what it can reach. A check it can't complete shows **Could not verify**, with the reason.

### Apps that need a sign-in {#sign-in}

Add a test login, such as an email and password, to the notes. The audit can't get past a one-time code sent by SMS or email, a captcha, or a check that blocks emulators or rooted phones, so use an account or staging build without these. Checks behind a sign-in it can't pass show **Could not verify**. If it can't get far enough, the audit ends without a report and doesn't count.

## If an audit doesn't finish

![An audit that could not finish, with Where the audit stopped and Run again marked](/images/sdk-health/sdk-health-could-not-finish.webp)

1. What happened, and whether the run counts.
2. **Where the audit stopped**: the last screen on the test phone, when there is one.
3. **Run again** opens the start form.

| Status | Meaning |
| --- | --- |
| **Waiting for upload**, **Queued**, **Starting**, **Checking**, **Writing report** | In progress. |
| **Completed** | Report ready. An icon next to it means something needs a fix or a look. |
| **Action needed** | Your build or listing stopped the audit. The row says what to change. |
| **Project mismatch** | The build has another project's token. |
| **Failed** | Run it again. If it keeps failing, contact support. |
| **Stopped** | Stopped before it finished. |

## Limits

- **One report per project every 3 hours**, from when the last one was delivered. A stop after checking starts still uses it.
- **5 minutes** before the next audit after one ended without a report because of your build or listing, or a stop after the test phone started but before checking.
- **2 hours** at most per audit, and **24 hours** at most in the queue. An audit that never starts doesn't count.

## Audit each new version {#version-monitoring}

Click **Version monitoring**, check the **Google Play URL** and turn on **Automatic checks**. Linkrunner checks Google Play daily and audits each new version. The first check only records today's version. These audits use the report limit, send real data and aren't emailed. A day is skipped if the limit or another audit is in the way.

**Need help?** Contact [support@linkrunner.io](mailto:support@linkrunner.io).
