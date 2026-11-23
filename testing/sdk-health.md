---
title: "Check your Android build with SDK Health"
description: "Upload your Android app and get a report of what the Linkrunner SDK sends, with a fix for each problem it finds."
---

# Check your Android build with SDK Health

<p class="vp-lead">Upload your Android app and get a report of what the Linkrunner SDK sends, with a fix for each problem it finds.</p>

SDK Health is the **Health** tab in [SDK Console](https://dashboard.linkrunner.io/dashboard/sdk-console). A test phone installs your build and uses the app like a real person, while the audit checks every request the Linkrunner SDK sends. You need to be an admin or a member of the project.

SDK Health works with Android apps only. For an iOS app, test with [SDK Console](/testing/integration-testing#test-with-sdk-console-beta).

## Before you start

- Add your app's Play Store link to the project as **Playstore URL** in [Settings → Project Details](https://dashboard.linkrunner.io/dashboard/settings/project-details). An audit can't start without it.
- Add the Linkrunner SDK to your app with this project's token. See the guide for [Android](/sdk/android), [React Native](/sdk/react-native), [Flutter](/sdk/flutter), [Expo](/sdk/expo), [Capacitor](/sdk/capacitor), [Cordova](/sdk/cordova) or [Unity](/sdk/unity). The build must use this token and your app's package name, or the audit stops with **Project mismatch** or **Action needed**.
- Have the build ready as an `.apk`, `.apks` or `.xapk` file, up to 512 MB. An `.aab` file can't be uploaded. If the app is free on Google Play, you can use its Play Store URL instead.
- If the app needs a sign-in, have a test login ready. See [Apps that need a sign-in](#sign-in).

<Warning>

The audit installs and uses your app like a real person, so the installs, sign-ups and events it creates go into the numbers of the project you run it from. Use a test build if you don't want test data in your production numbers: build the app with a separate test project's token, and run the audit from that test project.

</Warning>

## Start an audit

<Steps>

<Step title="Open SDK Console → Health">

Open [SDK Console](https://dashboard.linkrunner.io/dashboard/sdk-console) and select **Health** (1).

![SDK Console with the Health tab, the Start run menu and Version monitoring marked, above a list of audits](/images/sdk-health/sdk-health-start-run.webp)

1. **Health** lists every audit for this project, newest first, with its status and report.
2. **Start run** starts an audit from an uploaded build (**Upload APK**) or from Google Play (**Use Play Store URL**).
3. **Version monitoring** audits each new version on Google Play. See [Audit each new version](#version-monitoring).

</Step>

<Step title="Upload your build">

Click **Start run** → **Upload APK**.

![The Upload your app form with the app file, the notes, the warning and Start run marked](/images/sdk-health/sdk-health-upload-apk.webp)

1. **App File**: choose your `.apk`, `.apks` or `.xapk` file, up to 512 MB.
2. **Notes for the audit (optional)**: tell the audit what it needs, such as a test login or that this is a staging build, in up to 2,000 characters. Notes are deleted when the audit finishes.
3. The warning repeats that the audit sends real data to this project, and the report limit.
4. Click **Start run**.

Keep the tab open until the upload finishes. If you close the form during the upload, you can let it finish in the background or stop the audit. An upload that doesn't finish within an hour stops, and it doesn't count toward your report limit.

</Step>

</Steps>

To audit the version on Google Play instead, click **Start run** → **Use Play Store URL**. The form starts with your project's Play Store link. Add notes the same way and click **Start run**. This works only for free apps that Google Play offers for download. For a paid app, upload the build instead. If you already have a report for that app, the dashboard asks first and offers **View report**, since a new run uses your report for the next 3 hours.

The **Upload APK** button on the **App SDK testing** task in Get Started starts the same audit, without notes.

## While it runs

The audit waits in a queue for a free test phone, then starts. Once it is checking your app, it usually takes 25 to 40 minutes. You can leave the page while it runs.

![A running audit with the time so far, Notify me when it's done and Stop marked](/images/sdk-health/sdk-health-running.webp)

1. The time since the audit started, next to how long audits usually take.
2. **Notify me when it's done** shows a browser notification when the audit finishes, if this page is still open in a tab. When the report is ready, Linkrunner also emails it to the person who started the audit.
3. **Stop** stops the audit. If the audit has already started checking your app, the run still counts toward your report limit.

Each area shows under **What the audit checked** as the audit reaches it, and **Run log** shows each stage.

## Read the report

Open a finished audit from the list.

![A finished audit with the summary, Copy fixes for your developer, the filters, an issue and Download report marked](/images/sdk-health/sdk-health-report.webp)

1. The summary says how many issues the audit found, in which areas, and how many checks passed.
2. **Copy fixes for your developer** copies every issue and its fix as Markdown, ready to paste into a ticket.
3. The filters show all checks, or only **Issues**, **Needs review**, **Not verified** or **Passed**. **Not verified** shows only when the audit couldn't check something.
4. Each issue is marked **Must fix** or **Should fix** and says what the audit saw. Click **Show fix** to see the change to make.
5. **Download report** downloads the full report as a PDF.

Reports are kept for 90 days. After that the run shows **Expired**. Run a new audit to get a fresh one.

Above the list, **SDK health** shows the result of the last full audit: **Healthy**, **Issues found**, **Incomplete** or **No full audit yet**.

## What the audit checks

The audit finds which Linkrunner features your app uses and checks each one. Only those areas appear in the report, so there is no fixed list.

| Area | What the audit does |
| --- | --- |
| **SDK setup** | Opens the app after a fresh install and again from the background, and checks that the install is recorded. If the app has the Meta SDK, it also checks that Meta can match your events to the same device. |
| **Sign-up tracking**, **Login tracking** | Signs up or signs in, with the test login from your notes when the app needs one. |
| **Custom events** | Triggers every event it can reach by using the app. |
| **Purchase tracking**, **Subscription tracking** | Goes up to the payment and stops. It never makes a real charge, so the payment step shows as **Could not verify**. |
| **Deep linking**, **Install attribution** | Opens the links your app handles and checks the attribution data the app reads. |
| **Uninstall tracking** | Checks that the app shares its notification token with Linkrunner. |
| **User consent** | Checks the consent your app passes on. |
| **Device data** | Checks what the SDK sends about the device. |

The audit only checks what it can reach by using your app. A check it can't complete shows as **Could not verify**, with the reason.

### Apps that need a sign-in {#sign-in}

Add a test login to **Notes for the audit**, for example an email and password. The audit can't get past a one-time code sent by SMS or email, a captcha, or a check that blocks emulators or rooted phones. Use a test account that signs in without these, or a staging build that skips them. Checks behind a sign-in the audit can't pass show as **Could not verify**. If it can't get far enough into the app, the audit ends without a report, and the run doesn't count toward your report limit.

## If an audit doesn't finish

Open the run to see what happened.

![An audit that could not finish, with what happened, Where the audit stopped and Run again marked](/images/sdk-health/sdk-health-could-not-finish.webp)

1. What happened, and whether the run counts toward your report limit.
2. **Where the audit stopped** shows the last screen on the test phone, when there is one.
3. **Run again** opens the start form, so you can fix the problem and try again.

The list shows each audit's status:

| Status | What it means |
| --- | --- |
| **Waiting for upload**, **Queued**, **Starting**, **Checking**, **Writing report** | The audit is in progress. |
| **Completed** | The report is ready. An icon next to it means something needs a fix or a look. |
| **Action needed** | Something in your build or listing stopped the audit. The row says what to change. Fix it, then run the audit again. |
| **Project mismatch** | The build sends a different Linkrunner project's token. Upload a build that uses this project's token. |
| **Failed** | The audit couldn't finish. Run it again. If it keeps failing, contact support. |
| **Stopped** | The audit was stopped before it finished. |

When a run needs action, it says what to change. For example:

| The run says | What to do |
| --- | --- |
| This build is for a different app than this project | Upload a build of this project's app. |
| This app bundle is missing some of its parts | Upload the complete `.apks` or `.xapk` file. |
| This build is too large to unpack | Upload a smaller build, or use the Play Store URL. |
| This app is not free on Google Play | Upload the build instead. |
| Google Play does not offer this app for download right now | Upload the build instead. |
| We could not find this app on Google Play | Check the Play Store URL. |

## Limits

- **One report per project every 3 hours**, counted from when your last report was delivered. Stopping an audit after it starts checking your app still uses it. The dashboard shows when you can start the next one.
- **A 5-minute wait** before the next audit when the last one ended without a report because of a problem with your build or listing, or because you stopped it after the test phone started but before it began checking your app.
- **2 hours** at most per audit. A longer one is stopped.
- **24 hours** at most in the queue. An audit that hasn't started by then stops, and it doesn't count toward your report limit.

## Audit each new version {#version-monitoring}

Click **Version monitoring**, check the **Google Play URL** and turn on **Automatic checks**. Linkrunner checks Google Play once a day and audits each new version it finds. The first check only records the version Google Play has today.

Each of these audits uses the project's one report every 3 hours and sends real installs and events into the project, like any other audit. A day's audit is skipped when the report limit or another audit is in the way. These audits aren't emailed. Open them from the list in SDK Console.

**Need help?** Contact [support@linkrunner.io](mailto:support@linkrunner.io).
