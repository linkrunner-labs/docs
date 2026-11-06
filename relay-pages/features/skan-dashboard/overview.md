---
title: "Read the SKAN dashboard"
description: "See how your iOS ad campaigns perform using Apple's SKAN data, from install counts to the actions users take after installing."
---

# Read the SKAN dashboard

<p class="vp-lead">See how your iOS ad campaigns perform using Apple's SKAN data, from install counts to the actions users take after installing.</p>

The SKAN dashboard shows how your iOS campaigns perform: how many installs each ad network drove, how many came back as reinstalls, and what users did in your app in the days after installing.

All data on this screen comes directly from SKAN postbacks that Apple sends to Linkrunner through user devices. These postbacks report app installs and post-install activity in an aggregated, privacy-preserving way, without exposing any user-level data. That is why you see totals and ranges, not individual users.

<Note>

**What are SKAN postbacks?** When someone installs your app from an ad, Apple waits a bit (to protect privacy), then sends a postback to Linkrunner with limited information about that install and what the user did in your app, without identifying the user. This is Apple's way of helping you measure ad performance while keeping user data private.

</Note>

The dashboard has five parts, shown in this order on the screen:

1. [Stats overview cards](#stats-cards): total installs, reinstalls, conversion value null counts and null rates.
2. [Privacy tier breakdown](#privacy-tiers): how your installs are spread across Apple's four privacy tiers.
3. [Conversion value distribution](#conversion-values): which conversion values you receive, so you can see what users do after installing.
4. [Install trends over time](#trend-graph): daily installs by ad channel, with event filters.
5. [All conversion values table](#conversion-table): installs, reinstalls, click-through and view-through for every event in your SKAN configuration.

You can narrow every part with the [dashboard filters](#dashboard-filters).

## Stats overview cards {#stats-cards}

The stats overview cards show four key metrics that give you a quick snapshot of your SKAN performance. Each card shows data for your selected time period and lifetime totals, along with a trend graph so you can see changes over time.

<Note>

**Important note**: The install date shown is when the postback was received, not when the actual install happened. Apple does not send postbacks immediately after an install. After a user installs and launches an app, Apple delivers attribution postbacks on a delayed schedule (within \~48-72 hours).

</Note>

Every card shows the same three views:

- **Filtered period**: the value within your selected date range
- **Lifetime**: the value since you started using Linkrunner
- **Trend graph**: the daily value over the selected period

| Card | What it counts | Filtered period | Lifetime | Trend graph |
| --- | --- | --- | --- | --- |
| **Installs (SKAN)** | The count of valid SKAN postbacks. | Installs in your date range | Total installs | Daily install volume |
| **Reinstalls (SKAN)** | Reinstalls during the selected period, as reported by SKAN postbacks that include `redownload=true`. | Reinstalls in your date range | Total reinstalls | Daily reinstall volume |
| **Conversion value null count** | SKAN postbacks with a null conversion value, meaning no post-install actions were reported. This may happen when Apple limits reporting because of [privacy tier](#privacy-tiers) requirements. | Null conversion values in your date range | Total null conversion values | Daily null count |
| **Conversion value null rate** | Postbacks received with a null conversion value ÷ number of SKAN installs. | Percentage of null conversion values in your date range | Overall null rate | Daily null rate percentage |

## Privacy tier breakdown {#privacy-tiers}

This part shows how your installs are spread across Apple's four privacy tiers, and so how much detail you get for each install.

### What is crowd anonymity?

To protect user privacy, Apple limits the data in SKAdNetwork postbacks based on **crowd anonymity**. The idea is simple: the more installs a campaign generates, the harder it is to identify any individual user, so Apple shares more data.

Apple assigns each app download a **postback data tier** (0-3). Higher tiers mean more data.

### How Apple decides your privacy tier

Apple calculates your tier based on:

- **Crowd size** of the app or domain displaying the ad
- **Crowd size** of the advertised app
- **Country** where the app was installed
- **Hierarchical source identifier** provided by the ad network

### What data you get at each tier

| Field                                 | Tier 0   | Tier 1   | Tier 2   | Tier 3                      |
| ------------------------------------- | -------- | -------- | -------- | --------------------------- |
| **source-identifier**                 | 2 digits | 2 digits | 3 digits | 4 digits                    |
| **conversion-value** (fine)           | ❌        | ❌        | ✅        | ✅                           |
| **coarse-conversion-value**           | ❌        | ✅        | ✅        | ✅                           |
| **source-app-id** / **source-domain** | ❌        | ❌        | ❌        | ✅                           |
| **country-code**                      | ❌        | ❌        | ❌        | ✅ (if crowd size qualifies) |

#### Tier 3 (best data)

- Full 4-digit source identifier
- Fine-grained conversion value (0-63) in the first postback
- Coarse conversion value in all postbacks
- Source app ID or source domain
- Country code (if crowd size qualifies)

#### Tier 2

- 3-digit source identifier
- Fine-grained conversion value (0-63) in the first postback
- Coarse conversion value in all postbacks

#### Tier 1

- 2-digit source identifier
- Coarse conversion value only (Low, Medium or High)
- No fine-grained conversion value

#### Tier 0 (minimal data)

- 2-digit source identifier
- No conversion value data
- Only confirms an install happened

## Conversion value distribution {#conversion-values}

This part shows which conversion values you receive from SKAN postbacks. It helps you understand what actions users take in your app after installing.

<Note>

Multiple postbacks are only available in **SKAdNetwork 4.0+**. Earlier versions only support a single postback.

</Note>

### Postback sequences {#postback-sequences}

SKAN 4.0 can send up to three postbacks per install. Each one covers a different time window.

| Postback | Conversion window ends | Postback sent | Data available |
| --- | --- | --- | --- |
| **Postback 1 (P1)**: days 0-2 | 2 days after the user first launches the app | After the conversion window ends, plus a random 24-48 hour delay | Fine conversion values (0-63) or coarse values (Low, Medium, High) |
| **Postback 2 (P2)**: days 3-7 | 7 days after the user first launches the app | After the conversion window ends, plus a random 24-144 hour delay | Coarse values only (Low, Medium, High) |
| **Postback 3 (P3)**: days 8-35 | 35 days after the user first launches the app | After the conversion window ends, plus a random 24-144 hour delay | Coarse values only (Low, Medium, High) |

### Conversion value types

#### Fine conversion values (0-63)

- **Available in**: Postback 1 only
- **Number of values**: 64 (0 through 63)
- **Shown as**: an 8x8 grid of numbered squares

**How to read the grid:**

- Each square represents one conversion value
- Color intensity shows install volume (darker means more installs)
- Hover over any square to see exact counts and mapped events

#### Coarse conversion values (Low, Medium, High)

- **Available in**: All three postbacks (P1, P2, P3)
- **Number of values**: 3
- **Shown as**: a pie chart

### Switch between views

**Postback toggle (P1, P2, P3)**: Switch between time windows to see user behavior at different stages.

**Fine/coarse toggle**: For P1 only, switch between the detailed 64-value grid and the simpler 3-value pie chart. P2 and P3 only support coarse values.

**Channel filter**: Use the [channel filter](#dashboard-filters) at the top of the dashboard to see the distribution of conversion values across different ad networks (Meta Ads, Google Ads, TikTok, Snapchat).

### Set up conversion values

The values shown here are based on your SKAN configuration. To change your mapping:

1. Go to [SKAN settings in the Linkrunner dashboard](https://dashboard.linkrunner.io/dashboard/settings/skan-setup).
2. Set the priority of your events. Linkrunner will configure the matching fine and coarse conversion values.

[Learn more about configuring conversion values →](/features/skadnetwork-conversion-values)

### Common questions

<AccordionGroup>

<Accordion title="Why are there no fine conversion values in P2 and P3?">

Apple only provides fine-grained conversion values (0-63) in the first postback. This is by design in SKAdNetwork 4.0.

For P2 and P3, Apple only sends coarse conversion values (Low, Medium, High) to protect user privacy over longer time windows. The longer the measurement period, the more Apple limits the data, so users can't be identified.

</Accordion>

<Accordion title="What do the numbers (0-63) in the grid mean?">

These numbers represent the SKAN conversion value configuration you've set up with your ad network or Linkrunner.

Each number maps to specific in-app events. For example:

- 0 might mean "app opened"
- 15 might mean "completed registration"
- 63 might mean "made a purchase"

The exact mapping depends on how you configured conversion values in your SKAN setup.

</Accordion>

<Accordion title="What do High, Medium, and Low mean?">

These are coarse conversion values that represent user engagement levels:

- **High**: Users who performed your most valuable actions (for example, purchases or subscriptions)
- **Medium**: Users with moderate engagement (for example, completed onboarding or added to cart)
- **Low**: Users with minimal engagement (for example, only opened the app)

You decide which events map to each level in your SKAN configuration. These levels help you understand user quality even when fine-grained data isn't available.

</Accordion>

<Accordion title="Why do I not have data in the 2nd and 3rd postback filters?">

Second and third postbacks are only available in **SKAdNetwork 4.0**. If the ad network uses a SKAN version below 4.0, only a single postback is sent.

Even in SKAN 4.0, additional postbacks are sent only if Apple's privacy tier thresholds are met. If an install does not meet the required privacy thresholds, Apple may limit reporting and only send the first postback.

[Learn more about privacy tiers →](#privacy-tiers)

</Accordion>

</AccordionGroup>

## Install trends over time {#trend-graph}

This graph shows your daily install volume broken down by ad channel. Each channel has its own colored line, so you can compare networks and spot trends over time.

### Filter by events

One of the most useful features of this graph is filtering by specific events. This shows you which channels drive installs where users performed particular actions.

#### How to filter by events

1. Click the **"Add Event"** button in the top right.
2. A dropdown shows all events from your SKAN configuration.
3. Select one or more events to filter by.
4. The graph updates to show only installs where those events happened within 0-2 days.

#### What an event filter shows

When you filter by an event, the graph shows:

- **Only installs** where the user performed that event within the first 0-2 days
- **Conversion value data** from Postback 1 (P1)
- **Channel breakdown** of which networks drive that specific behavior

**Example: filter by "completed_purchase"**

- See which channels drive buyers, not just installers
- Find your highest-quality traffic sources
- Move budget toward channels with the best conversion rates

#### Select more than one event

You can select multiple events to see installs where users performed all of those events:

1. Click "Add Event" and select your first event.
2. Click "Add Event" again and select more events.
3. The graph shows installs where users performed all of the selected events.

**Example: filter by "signup" and "completed_purchase"**

- See which channels drive users who both signed up and made a purchase
- Compare this to filtering only "completed_purchase" to see how many buyers also created accounts
- Find channels that drive more complete user journeys versus quick purchases

#### Special filter: the "INSTALL" event

If you filter by the "INSTALL" event, you'll see something different:

- Installs where the user did NOT perform any of your other configured events
- Users who installed but didn't engage within 0-2 days
- This helps you find campaigns that bring in low-quality or unengaged users

#### Remove event filters

To remove an event filter:

1. Find the event chip (colored pill) next to the "Add Event" button.
2. Click the X icon on the chip.
3. The graph updates to remove that filter.

To see all installs again, remove all event filters.

## All conversion values table {#conversion-table}

This table gives an event-by-event breakdown of your SKAN performance. The other parts of the dashboard show aggregated data. This table shows exactly how many installs performed each specific event in your SKAN configuration.

### Columns

| Column | What it shows |
| --- | --- |
| **Events** | Every event you've configured in your SKAN setup, with event names and ranges. Events are ordered by your SKAN configuration priority. |
| **Channel icon** | Which ad network the data represents. Specific icons mean individual channel data (Meta, Google, TikTok, Snapchat). |
| **Installs** | Total installs that performed this event. Includes both new installs and reinstalls. |
| **Re-Installs** | Reinstalls (users who previously had your app) that performed this event. |
| **Click Through** | Installs from users who clicked an ad before installing. This shows direct response to your advertising. |
| **View Through** | Installs from users who saw an ad but didn't click before installing. This shows the value of impression-based advertising. |

### Postback sequence toggle

At the top right of the table there are three toggle options. Each one shows events from a different postback. See [postback sequences](#postback-sequences) for when each postback is sent.

| Toggle | Conversion window ends | Events tracked |
| --- | --- | --- |
| **Postback 1** (0-2 days) | 2 days after the user first launches the app | Actions performed within the first 0-2 days after install |
| **Postback 2** (3-7 days) | 7 days after the user first launches the app | Actions performed within days 3-7 after install |
| **Postback 3** (8-35 days) | 35 days after the user first launches the app | Actions performed within days 8-35 after install |

If the Postback 2 and Postback 3 views are empty, see [why there may be no data in the 2nd and 3rd postback filters](#conversion-values) under conversion value distribution.

### How to read the table

The table shows installs that performed your SKAN configured events.

#### Simple event names

**Example**: "completed_tutorial"

- A plain event name
- Installs that completed the tutorial

#### Events with ranges

**Example**: "purchase \[10-50]"

**For revenue events:**

- Installs that made that payment event within the given range
- Example: users who made purchases between $10-$50

**For custom events:**

- Installs that performed that event that many times
- Example: users who completed a level 10-50 times

#### Special case: the INSTALL event

If a row shows the "INSTALL" event, it counts:

- Users who installed but didn't engage
- Users who did not perform any other configured event within the time window

### Compare across postbacks

Use the postback toggle to compare the same event across different time windows:

1. **Select P1**: shows installs that performed the event within 0-2 days
2. **Switch to P2**: shows installs that performed the event within 3-7 days
3. **Switch to P3**: shows installs that performed the event within 8-35 days

**What this tells you:**

- Which channels bring users who complete events quickly (high quality within a few days)
- How many users convert right away versus over time

## Dashboard filters {#dashboard-filters}

The filters at the top of the dashboard apply to every part above.

### Date range filter

Choose how far back to look at your data:

- Last 7 days
- Last 30 days (default)
- Last 60 days
- Last 90 days

### Channel filter

Filter data by ad network:

- **All Channels** (default): Shows combined data from all sources
- **Meta Ads**
- **Google Ads**
- **TikTok**
- **Snapchat**

You can select multiple channels to compare performance across networks.

## FAQs

<AccordionGroup>

<Accordion title="Why are my conversion values null?">

Null conversion values happen because of Apple's **crowd anonymity** requirements.

To protect user privacy, Apple only shares conversion value data when enough installs occur to make individual users unidentifiable. Apple assigns each install to a privacy tier (0-3) based on crowd size:

- **Tier 0-1**: Low install volume, so no fine-grained conversion value, only coarse or nothing
- **Tier 2-3**: Higher install volume, so full conversion value data

If you're seeing many null values, your campaigns likely aren't reaching the volume thresholds needed for higher tiers.

**How to reduce null rates:**

- Combine smaller campaigns into fewer, larger ones
- Increase budget on well-performing campaigns
- Focus spend on channels where you can reach higher volume

[Learn more about privacy tiers →](#privacy-tiers)

</Accordion>

<Accordion title="Can I see the SKAN dashboard even if SKAN configuration is not done on Linkrunner?">

Yes, you can see the SKAN dashboard without completing SKAN configuration on Linkrunner.

Linkrunner analyzes the postbacks received from Apple for the SKAN dashboard. If you've [configured your app to send postbacks to Linkrunner](/features/skadnetwork-integration#configure-postback-copies-to-linkrunner), data will be shown on the SKAN dashboard.

However, without SKAN configuration on Linkrunner, conversion values can't be analyzed. You'll see raw conversion value numbers, but not the event mapping that explains what those numbers mean.

To get full insights, complete your [SKAN configuration](https://dashboard.linkrunner.io/dashboard/settings/skan-setup) to map events to conversion values.

</Accordion>

<Accordion title="I have set up conversion values but there is still no data on the SKAN dashboard">

The SKAN dashboard shows data from the postbacks received from Apple. Setting up conversion values alone is not enough.

Make sure you've completed the [postback configuration to send data to Linkrunner](/features/skadnetwork-integration#configure-postback-copies-to-linkrunner). Without this setup, Apple won't send postbacks to Linkrunner, and the dashboard will stay empty.

Once postback copies are configured correctly, data will start appearing in the dashboard as Apple sends postbacks (typically 1-3 days after installs occur).

</Accordion>

</AccordionGroup>

## Related resources

- [SKAdNetwork integration guide](/features/skadnetwork-integration): set up SKAN tracking in your app
- [SKAN conversion values configuration](/features/skadnetwork-conversion-values): map events to conversion values
- [Apple's SKAdNetwork documentation](https://developer.apple.com/documentation/storekit/skadnetwork): technical details from Apple

## Need help?

If you have questions about your SKAN data, see unexpected patterns in your conversion table, or need help with your setup or event data, reach out to our support team at <support@linkrunner.io>.
