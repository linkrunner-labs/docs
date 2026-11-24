---
title: "Uninstall Tracking"
description: "Measure when users remove your app, with a daily silent push check through FCM and APNs."
---

# Uninstall Tracking

<p class="vp-lead">Measure when users remove your app, with a daily silent push check through FCM and APNs.</p>

## How does it work

- Linkrunner sends a daily API request to Firebase Cloud Messaging (FCM) and Apple Push Notification Services (APNS).
- FCM and APNS then send a silent push notification to verify if an app is still installed on a given device.
- An uninstall is recorded after FCM or APNS reports that the push token is no longer valid on three daily checks in a row. A successful check, or a new push token from the app, starts the count again. Temporary errors, such as rate limits or server errors, are not counted.
- Uninstalls show about three days after the user removes the app, dated on the day of the third failed check.

## Setup

Refer to the following guides to enable uninstall tracking for your application:

- [Flutter](/sdk/flutter#uninstall-tracking)
- [React Native](/sdk/react-native#uninstall-tracking)
- [Capacitor](/sdk/capacitor#uninstall-tracking)
- [iOS](/sdk/ios#uninstall-tracking)
- [Android](/sdk/android#uninstall-tracking)

**Need help?** Contact <support@linkrunner.io>.
