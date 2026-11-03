---
title: "Quickstart"
description: "Add Linkrunner to your app in six steps and check your first attributed install."
pageClass: lr-quickstart
prev:
  text: Overview
  link: /
---

<SectionLabel>App setup</SectionLabel>

# Quickstart

<p class="vp-lead">Use these six steps to add Linkrunner to your app and check your first install. Marketers can follow along. Your developer can copy the platform examples below.</p>

<p class="lr-meta">6 steps · iOS · Android · Cross-platform · Web</p>

<Note>

**Prefer to set up in a chat?** Add the Linkrunner connector to Claude and ask it to "set up Linkrunner attribution for my app". It creates your project and gives you the SDK token, with no dashboard steps. See [Use Linkrunner from Claude](/features/mcp).

</Note>

## Create a project and get your token {#create-a-project .lr-step-heading}

Sign in to the dashboard and create a project. You will use its project token when you start the SDK.

1. Sign in to the [Linkrunner Dashboard](https://dashboard.linkrunner.io).
2. Create a new project, or open an existing one.
3. Copy your **Project Token** from the [SDK Console](https://dashboard.linkrunner.io/dashboard/sdk-console/register-test-device). For a website, copy the **Web project token** from [Settings → Project Details](https://dashboard.linkrunner.io/dashboard/settings/project-details) instead. See [Set up a website project](/features/website-projects).
4. Optional, recommended for production: copy your **Secret Key** and **Key ID** from [Dashboard → Settings → SDK Signing](https://dashboard.linkrunner.io/settings?s=sdk-signing) to turn on request signing.

## Install the SDK {#install-the-sdk .lr-step-heading}

Choose your app platform. The full SDK guide covers native setup, permissions and release checks.

Building a website rather than an app? The web uses its own token, the **Web project token** in **Settings → Project Details**, and a script tag instead of a package. Follow the [Web SDK guide](/sdk/web).

<Accordion title="Prefer an AI coding agent? Let it add the SDK for you" icon="sparkles">

Install the Linkrunner skill for your platform and let Claude Code, Cursor, Copilot or Windsurf add the SDK and deep links for you:

```bash
npx @linkrunner/skills list           # see all platforms
npx @linkrunner/skills add flutter    # e.g. Flutter
```

Then ask your agent to "integrate Linkrunner". See [Linkrunner Agent Skills](https://github.com/linkrunner-labs/skills).

</Accordion>

<Tabs>

<Tab title="Android">

```kotlin
// build.gradle.kts
implementation("io.linkrunner:sdk:<latest>")
```

[Full Android guide](/sdk/android)

</Tab>

<Tab title="iOS">

```ruby
# Podfile
pod 'LinkrunnerKit'
```

[Full iOS guide](/sdk/ios)

</Tab>

<Tab title="React Native">

```bash
npm install rn-linkrunner
# or
yarn add rn-linkrunner
```

[Full React Native guide](/sdk/react-native)

</Tab>

<Tab title="Flutter">

```bash
flutter pub add linkrunner
```

[Full Flutter guide](/sdk/flutter)

</Tab>

<Tab title="Expo">

```bash
npx expo install expo-linkrunner rn-linkrunner
```

[Full Expo guide](/sdk/expo)

</Tab>

<Tab title="Capacitor">

```bash
npm install capacitor-linkrunner
npx cap sync
```

[Full Capacitor guide](/sdk/capacitor)

</Tab>

<Tab title="Cordova">

```bash
cordova plugin add cordova-plugin-linkrunner
```

[Full Cordova guide](/sdk/cordova)

</Tab>

<Tab title="Unity">

Add the Android and iOS bridges, then drop in `LinkrunnerSDK.cs`. [Full Unity guide](/sdk/unity)

</Tab>

</Tabs>

## Initialize the SDK {#initialize-the-sdk .lr-step-heading}

Start Linkrunner as soon as your app opens, so every install is counted. This is required.

Call `init` as early as possible in your app's startup, usually in your root component, `Application` class or `AppDelegate`. Pass the optional `secretKey` and `keyId` if you set them up in step 1.

Using Expo, Capacitor, Cordova or Unity? This step is in your platform guide: [Expo](/sdk/expo), [Capacitor](/sdk/capacitor), [Cordova](/sdk/cordova) or [Unity](/sdk/unity). The Web tab uses your Web SDK token, not the project token.

<Tabs>

<Tab title="Android">

```kotlin
LinkRunner.getInstance().init(
    context = applicationContext,
    token = "YOUR_PROJECT_TOKEN",
    secretKey = "YOUR_SECRET_KEY", // Optional
    keyId = "YOUR_KEY_ID"          // Optional
)
```

</Tab>

<Tab title="iOS">

```swift
import LinkrunnerKit

try await LinkrunnerSDK.shared.initialize(
    token: "YOUR_PROJECT_TOKEN",
    secretKey: "YOUR_SECRET_KEY", // Optional
    keyId: "YOUR_KEY_ID"          // Optional
)
```

</Tab>

<Tab title="React Native">

```javascript
import linkrunner from "rn-linkrunner";

await linkrunner.init(
    "YOUR_PROJECT_TOKEN",
    "YOUR_SECRET_KEY", // Optional
    "YOUR_KEY_ID",     // Optional
);
```

</Tab>

<Tab title="Flutter">

```dart
import 'package:linkrunner/linkrunner.dart';

await LinkRunner().init(
  'YOUR_PROJECT_TOKEN',
  'YOUR_SECRET_KEY', // Optional
  'YOUR_KEY_ID',     // Optional
);
```

</Tab>

<Tab title="Web">

```javascript
linkrunner.init({ token: "YOUR_WEB_SDK_TOKEN" });
```

</Tab>

</Tabs>

## Identify the user {#identify-the-user .lr-step-heading}

Link the install to your app's user ID after they sign up or log in. This connects later events and revenue to the same person, and it is required.

Call `signup` **once**, as soon as the user is identified, whether through signup or login.

Using Expo, Capacitor, Cordova or Unity? This step is in your platform guide: [Expo](/sdk/expo), [Capacitor](/sdk/capacitor), [Cordova](/sdk/cordova) or [Unity](/sdk/unity).

<Tabs>

<Tab title="Android">

```kotlin
LinkRunner.getInstance().signup(
    userData = UserDataRequest(
        id = "user_123",
        name = "Jane Doe",
        email = "jane@example.com"
    )
)
```

</Tab>

<Tab title="iOS">

```swift
try await LinkrunnerSDK.shared.signup(
    userData: LinkrunnerUserData(
        id: "user_123",
        name: "Jane Doe",
        email: "jane@example.com"
    )
)
```

</Tab>

<Tab title="React Native">

```javascript
await linkrunner.signup({
    user_data: {
        id: "user_123",        // Required
        name: "Jane Doe",      // Optional
        email: "jane@example.com",
        phone: "9876543210",
        is_first_time_user: true,
    },
});
```

</Tab>

<Tab title="Flutter">

```dart
await LinkRunner().signup(
  userData: LRUserData(
    id: 'user_123',
    name: 'Jane Doe',
    email: 'jane@example.com',
  ),
);
```

</Tab>

</Tabs>

<Note>

**`signup` is required.** `setUserData` is optional and does **not** replace `signup`. Use it to send your product analytics IDs (you can call it right after `init`, without `id`) or user details that become available later, such as a phone number.

</Note>

## Handle deep links {#handle-deep-links .lr-step-heading}

Send users to the right screen when they open your app from a link. This also unlocks [remarketing](/features/remarketing) and deferred deep linking.

Forward incoming deep link URLs to Linkrunner. Each SDK has a `handleDeeplink` (or equivalent) method. See your SDK guide for the cold-start and warm-start hooks on your platform.

<CardGroup :cols="2">

<Card title="Deep Linking Setup" icon="link" href="/features/deep-linking-setup">

Configure universal links and app links for your domain.

</Card>

<Card title="Deferred Deep Linking" icon="link-slash" href="/features/deferred-deep-linking">

Route brand-new installs to the right in-app screen.

</Card>

</CardGroup>

## Verify your setup {#verify-your-setup .lr-step-heading}

Use a test device to check the click, install, app open, events and postbacks before you launch.

For mobile SDKs, register a test device in [SDK Console](https://dashboard.linkrunner.io/dashboard/sdk-console/register-test-device), then check that the SDK starts, check attribution data, and test signup, custom events and revenue events.

<Note>

For normal testing, registering the device in SDK Console is enough. Set `debug = true` in SDK init only if GAID collection is turned off on Android, or the ATT prompt is turned off on iOS so IDFA is not available. Remove `debug = true` before production.

</Note>

<CardGroup :cols="2">

<Card title="Run the integration test suite" icon="flask" href="/testing/integration-testing">

End-to-end checks for clicks, installs, events and postbacks.

</Card>

<Card title="Troubleshoot attribution" icon="bug" href="/testing/testing-attribution-troubleshooting">

Common issues and how to debug them.

</Card>

</CardGroup>

## What to set up next

<CardGroup :cols="2">

<Card title="Connect ad channels" icon="bullhorn" href="/ad-networks/meta-ads">

Connect Meta, Google, TikTok, Snapchat or LinkedIn.

</Card>

<Card title="Track revenue" icon="circle-dollar" href="/api-reference/revenue-tracking">

Send purchases and connect them to the campaign that brought the user.

</Card>

<Card title="Send data to analytics tools" icon="chart-line" href="/analytics-integrations/mixpanel">

Send attribution to Mixpanel, Amplitude, PostHog, GA4 and more.

</Card>

<Card title="Build remarketing audiences" icon="users" href="/features/remarketing-audiences">

Bring users back with audiences built from in-app events.

</Card>

<Card title="Create a trackable link" icon="link" href="/features/create-trackable-link">

Give each creator, partner, QR code or email its own link.

</Card>

</CardGroup>

## Need help?

Email <support@linkrunner.io>. We usually reply within a few hours during business hours.
