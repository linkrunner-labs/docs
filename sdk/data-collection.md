---
title: "Data the SDK collects"
description: "What each Linkrunner SDK sends to Linkrunner, how to turn parts of it off, and how to answer the Google Play Data safety form and Apple's App Privacy questions."
---

# Data the SDK collects

<p class="vp-lead">What each Linkrunner SDK sends to Linkrunner, how to turn parts of it off, and how to answer the Google Play Data safety form and Apple's App Privacy questions.</p>

Every app that ships the Linkrunner SDK has to declare its data collection on Google Play and the App Store. Use this page to fill in Linkrunner's part of those forms. Add what your app and your other SDKs collect before you submit.

This page describes Android SDK 5.0.0 and iOS SDK 5.0.0, and the Web SDK as of November 2026.

## How the SDKs fit together

- The **Android** and **iOS** SDKs collect the device data.
- The **React Native, Flutter, Expo, Capacitor, Cordova and Unity** SDKs run the native Android and iOS SDKs underneath (Unity on iOS through the bridge in the [Unity guide](/sdk/unity)). They do not collect any device data of their own, so the Android and iOS tables below apply to them. The only extra values they send are the wrapper's name and version (Android only).
- The **Web SDK** is separate. See [Web](#web).

All SDKs send data to `api.linkrunner.io` over HTTPS. The Web SDK can instead use your own subdomain if you set up [first-party collection](/sdk/web#first-party-collection). Linkrunner's servers also see the public IP address of every request, as any server does.

## Android

The SDK sends this device data with the `init` call, and again with `signup`, deep link handling and `getAttributionData`. Other calls (events, payments, push token) send no device data, only the install ID and the data of that call.

| Field | What it is | Why Linkrunner needs it | Can you turn it off? |
| --- | --- | --- | --- |
| `install_instance_id` | A random ID the SDK creates on first launch and stores in your app | Ties all requests from one install together | No |
| `device_id` | The Android ID (`Settings.Secure.ANDROID_ID`) | Recognises the device when no advertising ID is available | No |
| `gaid` | Google Advertising ID. Empty when the user deleted it or opted out of ads personalisation | Matches installs to ad clicks on Google, Meta and other networks | Yes, see [Turn off collection](#turn-off-collection) |
| `limit_ad_tracking` | Whether the user opted out of ads personalisation | Tells Google how it may use the conversion | Yes, together with `gaid` |
| `app_set_id`, `app_set_id_scope` | Google's App Set ID and its scope | Fallback ID for Google Ads when there is no advertising ID | Yes, together with `gaid` |
| `install_ref` and the other install referrer fields | Google Play Install Referrer: the referrer string, the click and install timestamps (device and server time), and the installer version | Attributes the install to the link or ad that led to it | No |
| `meta_install_ref` | Meta's install referrer from the Facebook, Instagram or Facebook Lite app, when one exists | Attributes installs from Meta ads | No |
| `brand`, `manufacturer`, `device_model`, `device_name` | Device make and model. `device_name` is make plus model, not the name the user gave the phone | Attribution matching and reporting | No |
| `system_version` | Android version | Reporting | No |
| `user_agent` | The device's default WebView user agent | Matches web clicks to installs | No |
| `application_name`, `bundle_id`, `app_version`, `version`, `build_number` | Your app's name, package name and version | Reporting by app version | No |
| `package_version`, `platform` | The SDK version and which SDK sent the request (for example `FLUTTER`) | Support and debugging | No |
| `device_ip` | The IP address of the device's network connection. On Wi-Fi this is usually a private local address | Attribution matching | No |
| `carrier` | Mobile network operator name | Reporting | No |
| `connectivity` | Wi-Fi, mobile network or Ethernet | Reporting | No |
| `country`, `language`, `locale` | From the device's language and region settings, not from GPS | Reporting, and required by Google's App Conversion API | No |
| `consent` | The consent values you pass with `setConsent` | Sent to Google Ads with each conversion | Only sent when you set it |

The SDK declares the `INTERNET`, `ACCESS_NETWORK_STATE` and `com.google.android.gms.permission.AD_ID` permissions. It also declares `<queries>` entries for the Facebook, Instagram and Facebook Lite apps, only to read Meta's install referrer from them. It does not read location, contacts, files, or the list of installed apps.

## iOS

The SDK sends this device data with most requests, including `initialize`, `signup`, events and payments. `setCustomerUserId`, `setPushToken` and `setAdditionalData` send no device data.

| Field | What it is | Why Linkrunner needs it | Can you turn it off? |
| --- | --- | --- | --- |
| `install_instance_id` | A random ID the SDK creates on first launch and stores in your app | Ties all requests from one install together | No |
| `idfv` | Identifier for Vendor | Recognises the device across your apps | No |
| `idfa` | Identifier for Advertisers. Only sent when the user allowed tracking in the App Tracking Transparency (ATT) prompt | Matches installs to ad clicks | Yes, pass `disableIdfa: true` to `initialize` |
| `att_status` | The user's ATT answer | Tells ad networks whether IDFA-based matching is allowed | No |
| `adservices_attribution_token` | Apple's AdServices token | Attributes installs from Apple Search Ads | No |
| `odm_info` | A value from Google's on-device conversion SDK. Only sent if your app includes that SDK | Attributes iOS installs from Google Ads | Remove Google's SDK |
| `device`, `device_model`, `device_name`, `brand`, `manufacturer` | Device type and hardware model. On iOS 15, `device_name` is the name the user gave the phone (for example "Mia's iPhone"). On iOS 16 and later Apple returns a generic name such as "iPhone" | Attribution matching and reporting | No |
| `system_version` | iOS version | Reporting | No |
| `device_display` | Screen width, height and scale | Attribution matching | No |
| `bundle_id`, `version`, `build_number`, `package_version` | Your app's bundle ID and version, and the SDK version | Reporting by app version | No |
| `user_agent` | A string the SDK builds from your app version, the device model and the iOS version | Attribution matching | No |
| `connectivity` | Wi-Fi, cellular or wired | Reporting | No |
| `locale`, `language`, `country`, `timezone`, `timezone_offset` | From the device's language, region and time zone settings, not from GPS | Reporting | No |
| `first_open_timestamp`, `time_since_app_install` | When the SDK first ran in your app, and the time since then | Attribution windows | No |
| `consent` | The consent values you pass with `setConsent`, or that the SDK reads from your IAB TCF consent tool when you call `enableTCFConsentCollection` (iOS and React Native) | Sent to Google Ads with each conversion | Only sent when you set it |

<Warning>

If you don't pass `disableIdfa: true`, the SDK asks for tracking permission (Apple's ATT prompt) during `initialize`, or a later call, while the user hasn't answered it yet. To choose when the prompt appears, show it yourself before you call `initialize`. You still need `NSUserTrackingUsageDescription` in `Info.plist`.

</Warning>

## Data your app passes in

The SDK only sends user details that your code gives it.

| Call | What it sends |
| --- | --- |
| `signup`, `setUserData` | Your user ID, plus name, email and phone if you include them. Also optional IDs from analytics tools (Mixpanel, Amplitude, PostHog, Braze, Google Analytics, Netcore, MoEngage), the user's sign-up date and whether they are a new user |
| `setCustomerUserId` | Your user ID |
| `trackEvent` | The event name and the event data you pass. For payments: amount, currency, payment ID and status |
| `setPushToken` | The push notification token, used for uninstall tracking |
| `setAdditionalData` | Your CleverTap ID |
| `handleDeeplink` | The deep link URL that opened your app |

Don't put names, emails, phone numbers or other personal details in event data. Use the user fields in `signup` instead.

### PII hashing

Call `enablePIIHashing(true)` to hash **name, email and phone** with SHA-256 on the device, so Linkrunner never receives them in plain text. Your user ID is not hashed. Hashed values still count as collected data on both Google Play and the App Store.

## Where the data goes

Linkrunner uses this data to attribute installs and events to your campaigns and to show them in your dashboard.

When you connect an ad network (Meta, Google Ads, TikTok and others) or set up postbacks for an affiliate partner, Linkrunner sends it the conversions you mapped. Depending on the network, a conversion can include:

- Device IDs: GAID, IDFA, IDFV or App Set ID
- IP address, user agent, device model, OS version and screen size
- Coarse location (country, region, city and postcode, worked out from the IP address)
- Ad click IDs such as `gclid`, `fbclid` and `ttclid`
- Your user ID, and hashed email, phone and name

Linkrunner also sends attribution data to the analytics tools you connect, such as Mixpanel or Amplitude. Google Play and Apple both count all of this as sharing data with a third party.

When an iOS user denies tracking, Linkrunner has no IDFA and tells Meta that tracking is off. The other values in the list are still sent.

## Turn off collection

| Platform | What you can turn off | How |
| --- | --- | --- |
| Android | Google Advertising ID, limit ad tracking and App Set ID | [`setDisableAaidCollection(true)`](/sdk/android#disabling-aaid-collection) before `init`. Available on Android, Flutter and Unity |
| Android, any SDK | Google Advertising ID | [Remove the `AD_ID` permission](/sdk/android#removing-ad-id-permission) from your manifest. Use this from React Native, Expo, Capacitor and Cordova, which don't have `setDisableAaidCollection` yet. It blanks the ID on Android 13 and later when your app targets API 33 or higher. App Set ID is still collected |
| iOS | IDFA and the SDK's ATT prompt | `disableIdfa: true` in `initialize` |
| All mobile SDKs | Plain-text name, email and phone | `enablePIIHashing(true)` |
| Android and iOS | Google Ads consent signals | `setConsent` sends your user's choices. Not available in Capacitor and Cordova yet |

Turning off the advertising ID lowers attribution accuracy. Only do it when you must, for example for apps in Google Play's Families program.

## Google Play Data safety answers

These are Linkrunner's answers, assuming you send conversions to at least one ad network. If you don't connect any ad network, answer **No** under **Shared**.

General questions:

| Question | Answer for Linkrunner |
| --- | --- |
| Does your app collect or share any of the required user data types? | Yes |
| Is all of the user data collected by your app encrypted in transit? | Yes, the SDK uses HTTPS |
| Do you provide a way for users to request that their data is deleted? | Depends on your app |

Data types:

| Category → data type | Collected | Shared | Optional or required | Purposes |
| --- | --- | --- | --- | --- |
| Device or other IDs | Yes | Yes | Required | Analytics, Advertising or marketing, Fraud prevention, security, and compliance |
| Location → Approximate location | Yes, worked out from the IP address | Yes | Required | Analytics, Advertising or marketing |
| App activity → App interactions | Yes, the events you track | Yes, the events you map to ad networks | Required | Analytics, Advertising or marketing |
| Personal info → User IDs | Only if you pass a user ID | Yes | Depends on your app | Analytics, Advertising or marketing |
| Personal info → Name, Email address, Phone number | Only if you pass them in `signup` or `setUserData` | Yes, hashed | Depends on your app | Analytics, Advertising or marketing |
| Financial info → Purchase history | Only if you track payments or revenue | Yes, for payments you map to ad networks | Depends on your app | Analytics, Advertising or marketing |

The SDK collects nothing in the other categories (precise location, messages, photos, files, contacts, calendar, health, web browsing, crash logs or diagnostics).

## Apple App Privacy answers

On App Store Connect, declare each data type below. For every one, choose the purposes **Analytics**, **Developer's Advertising or Marketing** and **Third-Party Advertising**. As above, this assumes you send conversions to ad networks.

| Category → data type | Linked to the user | Used for tracking |
| --- | --- | --- |
| Identifiers → Device ID | Yes | Yes |
| Identifiers → User ID | Yes | Yes |
| Location → Coarse Location | Yes | Yes |
| Usage Data → Product Interaction | Yes | Yes |
| Usage Data → Advertising Data | Yes | Yes |
| Contact Info → Name, Email Address, Phone Number | Yes | Yes |
| Purchases → Purchase History | Yes | Yes |

Only declare **User ID**, **Contact Info** and **Purchase History** if your app sends them through the SDK. Apple counts sending this data to ad networks for ad measurement as tracking. Answer **Yes** even if you pass `disableIdfa: true` or the user denies ATT, because the IP address, IDFV and hashed contact details still reach ad networks.

## Web

The Web SDK collects data from the browser, not the device. Google Play and Apple forms don't apply, but your cookie or consent banner might. Load the SDK only after the visitor agrees if your consent rules require it.

| Group | What it sends |
| --- | --- |
| IDs | A random visitor ID (kept in `localStorage`), a session ID (kept in `sessionStorage`), and your user ID if you call `identify` |
| Page | URL, path, query string, title, referrer and canonical URL |
| Browser | User agent, platform, screen and window size, colour depth, pixel ratio, languages, time zone, connection type, CPU cores, device memory, touch support, whether cookies are on, the Do Not Track setting, page load timings and a bot flag |
| Campaign | UTM parameters, `lr_sub1` to `lr_sub5`, and ad click IDs such as `gclid`, `fbclid` and `ttclid`, for both the first and the latest visit |
| Events | The event name and the event data you pass to `track` |

The Web SDK stores campaign values in `localStorage` for up to 90 days, reads Meta's `_fbp` and `_fbc` cookies, and writes `_fbc` when a visitor arrives from a Meta ad. It does not hash data and has no consent switch. If you turn on the Hotstar pixel (`data-hotstar-pixel-id`), the SDK also loads Hotstar's pixel script and sends it your mapped events from the browser. See [Attribution storage](/sdk/web#attribution-storage) for the full list of keys.

**Need help?** Contact [support@linkrunner.io](mailto:support@linkrunner.io)
