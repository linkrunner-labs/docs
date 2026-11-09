---
title: "AI change tool reference"
description: "Every change your AI assistant can ask for through the Linkrunner MCP server, with its type, who can approve it, and how to choose which tools your assistant sees."
---

# AI change tool reference

<p class="vp-lead">Every change your AI assistant can ask for through the Linkrunner MCP server, with its type, who can approve it, and how to choose which tools your assistant sees.</p>

Every change tool on this page only proposes a change. Nothing happens until a person approves or confirms it, as described in [Approve changes your AI assistant asks for](/features/mcp-changes). You don't call tools yourself: ask in plain words and your assistant picks the tool.

How to read the tables:

- **Type** is the change type a project admin turns on in **Settings → MCP → AI changes**: **Change**, **Delete**, or **Team and settings**. Your connection must also allow it (see [What your connection is allowed to ask for](/features/mcp-changes#what-your-connection-is-allowed-to-ask-for)).
- **In the chat** is how the person who asked can [confirm it in their AI app's chat](/features/mcp-changes#confirm-in-the-chat): **Yes** (they say yes), **Code** (they type the code shown with the change, like `confirm 7Q4K`), or **No** (approve in Linkrunner or the approval card only).
- **Who can approve** is who may approve when they asked for the change themselves. A project admin can also approve any change on the review page, except those marked **Person who asked**. **Admin or member** means a member who asked can approve it. **Admin** means only an admin can. **Depends** is explained under the table. **Person who asked** means nobody else can approve it.

The tools for read-only questions (reports, campaigns, attribution lookups) are listed in the [MCP tool reference](/features/mcp#tool-reference).

## Choose which tools your assistant sees

Tools are grouped into toolsets. An assistant works better with fewer tools, so by default an AI app sees the reads and the **campaigns**, **audiences** and **attribution** change tools. Add other toolsets when you need them.

| Toolset | What it covers | On by default |
| --- | --- | --- |
| `reads` | Every read-only tool | Yes |
| `campaigns` | App campaigns, links, web campaigns and sharing | Yes |
| `audiences` | Funnels and cohorts | Yes |
| `attribution` | Postback mappings and settings, attribution windows, re-engagement, SKAN | Yes |
| `settings` | Store listings, domains, project details, auto-join, SDK keys, Web SDK websites | No |
| `fraud` | Fraud rules | No |
| `signals` | Signals cards and detector mutes | No |
| `team` | Members, affiliate partners and agencies | No |
| `integrations` | Webhook, ad network connections, Google Ads conversions, Everflow, analytics re-syncs | No |
| `landing_pages` | Custom landing pages | No |
| `setup` | Get Started answers, SDK test devices and the test link | No |
| `exports` | Data exports by email | No |

The [change management tools](#change-management-tools) are listed whatever toolsets you pick. A toolset also lists the read tools its changes need to find ids, so `toolsets=fraud` works without `reads`.

Pick toolsets by adding `toolsets` to the connector address, separated by commas, or `all` for everything:

```text
https://mcp.linkrunner.io/mcp?toolsets=campaigns,team,settings
https://mcp.linkrunner.io/mcp?toolsets=all
```

On a token connection, add it to your Server URL with `&`, for example `<YOUR_SERVER_URL>&toolsets=all`. A client that sends custom headers can use the `X-Linkrunner-Toolsets` header instead.

A tool is listed only when your connection allows its type. A token without **Deletes**, for example, never lists the delete tools.

### Read-only connection

To give an assistant no way to ask for any change, use the read-only address:

```text
https://mcp.linkrunner.io/mcp/readonly
```

You can also add `?readonly=true` to the address, or send the header `X-Linkrunner-Readonly: true`. A read-only connection lists no tool that proposes a change, and no tool to cancel or undo one.

## Change management tools

These tools let the assistant follow up on changes. Toolsets never hide them.

| Tool | What it does |
| --- | --- |
| `get_linkrunner_capabilities` | Shows what this connection can do: the project, your role, which change types are on, and which toolsets are listed. |
| `get_change` | Reads one change: its status, preview, who asked, who approved it, and the result. |
| `list_pending_changes` | Lists the project's changes waiting for approval, each with its approve link. |
| `confirm_change` | Applies a change you asked for once you confirm it in the chat: after you say yes to a new item, or with the code you typed for any other change. Never for team and settings changes. Not on read-only connections or tokens that can only read. |
| `cancel_change` | Withdraws a change you asked for that is still waiting. Not on read-only connections or tokens that can only read. |
| `undo_change` | Proposes the reverse of an applied change, when it can be undone. It needs approval like any other change. Not on read-only connections or tokens that can only read. |
| `list_change_history` | Reads the project's Change History, including who asked for and approved each AI change. |
| `open_dashboard_screen` | Gives a link to the dashboard screen for things that are never done in chat, such as billing, connecting an ad network, file uploads, and secret keys. |

## Campaigns

| Tool | What it asks for | Type | Who can approve | In the chat |
| --- | --- | --- | --- | --- |
| `create_campaign` | A new campaign (tracking link) | Change | Depends | Yes, or Code with a custom link id or a Meta or Google campaign id |
| `edit_campaign` | Edit a campaign's name, status, deep link, store listings or other settings | Change | Depends | Code |
| `create_deeplink` | The deep link for one Meta or Google ad set or ad | Change | Admin or member | Code |
| `set_campaign_link_active` | Pause or turn back on a Linkrunner link | Change | Admin or member | Code |
| `assign_partner_link` | Credit a link to a connected affiliate partner | Change | Admin or member | Code |
| `update_custom_channel` | Rename a custom channel | Change | Admin or member | Code |
| `delete_custom_channel` | Delete a custom channel label (the campaign stays) | Delete | Admin or member | Code |
| `delete_campaign` | Delete an app campaign. Its link stops working | Delete | Admin or member | Code |
| `create_web_campaign` | A new web campaign (a UTM-tagged web link) | Change | Admin or member | Code |
| `edit_web_campaign` | Rename, pause or turn on a web campaign | Change | Admin or member | Code |
| `delete_web_campaign` | Delete a web campaign | Delete | Admin or member | Code |
| `share_campaign` | Give one person view access to an app campaign. Linkrunner emails them | Team and settings | Admin or member | No |
| `unshare_campaign` | Remove one person's access to an app campaign | Team and settings | Admin or member | No |
| `share_web_campaign` | Give one person view access to a web campaign. Linkrunner emails them | Team and settings | Admin or member | No |
| `unshare_web_campaign` | Remove one person's access to a web campaign | Team and settings | Admin or member | No |

`create_campaign` and `edit_campaign` need an admin when the change includes the campaign's landing page (setting, changing or removing it). Otherwise a member can approve them.

A new campaign is confirmed in the chat with a yes only when Linkrunner picks its link id and it names no Meta or Google campaign id. With a custom link id, a Meta campaign id or a Google campaign id it needs the code, because a deleted campaign may have held that id.

## Audiences

| Tool | What it asks for | Type | Who can approve | In the chat |
| --- | --- | --- | --- | --- |
| `create_funnel` | Save a new funnel | Change | Admin or member | Yes |
| `update_funnel` | Rename a funnel or change its steps | Change | Admin or member | Code |
| `delete_funnel` | Delete a saved funnel | Delete | Admin or member | Code |
| `create_cohort` | Save a new cohort (audience segment) | Change | Admin or member | Yes |
| `edit_cohort` | Change a cohort's name, description or rules | Change | Admin or member | Code |
| `delete_cohort` | Delete a saved cohort. Ad network audiences synced from it stop updating | Delete | Admin or member | Code |

## Attribution and postbacks

| Tool | What it asks for | Type | Who can approve | In the chat |
| --- | --- | --- | --- | --- |
| `create_postback_event_map` | Map one of your events to the name an ad network expects | Change | Admin or member | Code |
| `update_postback_event_map` | Change a postback mapping | Change | Admin or member | Code |
| `delete_postback_event_map` | Delete a postback mapping you added | Delete | Admin or member | Code |
| `send_test_postback` | Send one live test event to an ad network's connected accounts | Change | Admin or member | Code |
| `update_postback_settings` | Who an ad network's install postbacks are sent for | Change | Admin or member | Code |
| `set_postback_users_from` | **For users from** on all of one ad network's event postbacks | Change | Admin or member | Code |
| `set_click_attribution_window` | The click lookback window for one ad network, 1 to 30 days | Change | Admin | Code |
| `reset_attribution_window` | Set one ad network's click lookback window back to the default | Change | Admin | Code |
| `set_view_through_window` | Turn view-through attribution on or off for one affiliate partner | Change | Admin | Code |
| `update_remarketing_settings` | The re-engagement inactivity window | Change | Admin or member | Code |
| `set_remarketing_enabled` | Turn re-engagement attribution on or off | Change | Admin or member | Code |
| `generate_skan_mapping` | Save a new SKAN conversion value schema | Change | Admin or member | Code |
| `set_skan_enabled` | Turn SKAN conversion values on or off | Change | Admin or member | Code |

Creating or updating a mapping for Meta, Google, TikTok, Snapchat, LinkedIn or Reddit sends a test postback to every connected account on that network when it is applied. `send_test_postback` does the same on purpose. Both put a test conversion in your real ad account.

## Integrations

| Tool | What it asks for | Type | Who can approve | In the chat |
| --- | --- | --- | --- | --- |
| `update_webhook` | Set the webhook URL or its organic setting | Team and settings | Admin or member | No |
| `test_webhook` | Send a sample payload to your webhook | Change | Admin or member | Code |
| `disconnect_ad_account` | Disconnect one ad account | Team and settings | Admin or member | No |
| `set_apple_search_ads_enabled` | Turn Apple Search Ads attribution on or off | Team and settings | Admin or member | No |
| `create_google_conversion_action` | Create a conversion action in a connected Google Ads account | Change | Admin or member | Code |
| `map_google_conversion_action` | Choose which Google Ads conversion action receives an event | Change | Admin or member | Code |
| `set_google_conversion_category` | Move a Google Ads conversion action to another goal category | Change | Admin or member | Code |
| `update_google_app_conversion_goals` | The goal settings of a Linkrunner app conversion action in Google Ads | Team and settings | Admin or member | No |
| `update_google_link_ids` | A Google Ads account's Android or iOS link ID | Team and settings | Admin or member | No |
| `set_sharechat_connection` | Connect ShareChat or change its App ID | Team and settings | Admin or member | No |
| `update_everflow_settings` | The Everflow postback settings | Team and settings | Admin | No |
| `update_everflow_event_mappings` | Which events are sent to Everflow | Change | Admin | Code |
| `refresh_linkedin_conversions` | Read a LinkedIn account's conversion list again | Change | Admin or member | Code |
| `refresh_ad_creatives` | Sync ads, images and videos from a Meta or Google Ads account | Change | Admin or member | Code |
| `sync_analytics_integration` | Send attribution data to a connected analytics tool again | Change | Admin or member | Code |

Saving a webhook sends a real payload to the new URL, because Linkrunner only saves an endpoint that answers `200` or `201`. `create_google_conversion_action`, `set_google_conversion_category` and `update_google_app_conversion_goals` change your Google Ads account when applied.

## Settings

| Tool | What it asks for | Type | Who can approve | In the chat |
| --- | --- | --- | --- | --- |
| `create_store_listing` | A new custom App Store or Play Store listing | Change | Admin or member | Yes |
| `update_store_listing` | Change a store listing | Change | Admin or member | Code |
| `delete_store_listing` | Delete a store listing no campaign uses | Delete | Admin or member | Code |
| `create_domain` | Add a link domain or sub-domain | Team and settings | Admin or member | No |
| `migrate_and_delete_domain` | Move every link off one domain to another, then delete the first | Team and settings | Admin or member | No |
| `update_domain_association_files` | Replace the iOS and Android app association files on your link domains | Team and settings | Admin or member | No |
| `update_project_details` | The project's name, company, store links, website or URI scheme | Change | Admin or member | Code |
| `change_display_currency` | The currency money is shown in | Team and settings | Admin or member | No |
| `turn_on_web_campaigns` | Turn on web campaigns. This cannot be turned off again | Team and settings | Admin | No |
| `set_auto_join_enabled` | Turn auto-join for company email domains on or off | Team and settings | Admin | No |
| `add_auto_join_domain` | Add a company email domain to auto-join | Team and settings | Admin | No |
| `remove_auto_join_domain` | Remove a company email domain from auto-join | Team and settings | Admin | No |
| `set_sdk_key_active` | Turn an SDK signing key on or off. Secrets are never shown | Team and settings | Admin or member | No |
| `allow_web_sdk_host` | Allow a website to send Web SDK events | Team and settings | Admin or member | No |
| `remove_web_sdk_host` | Stop a website sending Web SDK events | Team and settings | Admin or member | No |

## Fraud

| Tool | What it asks for | Type | Who can approve | In the chat |
| --- | --- | --- | --- | --- |
| `create_fraud_rule` | A new fraud rule. It is saved switched off | Change | Admin or member | Yes |
| `edit_fraud_rule` | Change a fraud rule's conditions, scope or action | Change | Admin or member | Code |
| `set_fraud_rule_active` | Turn a fraud rule on or off | Change | Admin or member | Code |
| `delete_fraud_rule` | Delete a fraud rule | Delete | Admin or member | Code |

## Signals

| Tool | What it asks for | Type | Who can approve | In the chat |
| --- | --- | --- | --- | --- |
| `dismiss_signal` | Dismiss a Signals card for the whole project | Change | Admin or member | Code |
| `snooze_signal` | Hide a Signals card for 6, 12 or 24 hours, or show it again | Change | Admin or member | Code |
| `mute_signal_detector` | Hide every card from one detector, for 30 days by default | Change | Admin or member | Code |
| `unmute_signal_detector` | End a detector mute | Change | Admin or member | Code |

## Team and partners

| Tool | What it asks for | Type | Who can approve | In the chat |
| --- | --- | --- | --- | --- |
| `invite_member` | Invite one person with an access role. Linkrunner emails them | Team and settings | Depends | No |
| `change_member_role` | Change one member's access role | Team and settings | Depends | No |
| `remove_member` | Remove a member or withdraw an invitation | Team and settings | Admin | No |
| `set_member_job_title` | A member's role-in-company label | Team and settings | Admin or member | No |
| `connect_affiliate_partner` | Connect an affiliate partner | Team and settings | Admin | No |
| `disconnect_affiliate_partner` | Disconnect an affiliate partner | Team and settings | Admin | No |
| `set_affiliate_event_visibility` | Which events a partner sees | Team and settings | Admin | No |
| `set_affiliate_s2s_clicks` | Turn a partner's server-to-server clicks on or off | Team and settings | Admin | No |
| `set_affiliate_ctv` | Turn a partner's connected-TV impressions on or off | Team and settings | Admin | No |
| `request_partner_intro` | Ask Linkrunner to introduce you to a partner or agency | Team and settings | Admin or member | No |
| `connect_agency` | Engage an agency on the project | Team and settings | Admin | No |
| `invite_agency` | Invite an agency that is not on Linkrunner yet | Team and settings | Admin | No |
| `update_agency_access` | Change what an agency can see | Team and settings | Admin | No |
| `disconnect_agency` | End an agency engagement | Team and settings | Admin | No |

A member can approve `invite_member` when the new person is a member or influencer, and `change_member_role` when it moves someone between member and influencer. Anything involving the admin or finance role needs an admin.

## Landing pages

| Tool | What it asks for | Type | Who can approve | In the chat |
| --- | --- | --- | --- | --- |
| `rename_landing_page` | Rename a landing page | Change | Admin | Code |
| `publish_landing_page_version` | Make one version the live version of its page | Change | Admin | Code |
| `assign_landing_page` | Choose the landing page for the project default, a campaign, or a Meta ad set or ad | Change | Admin | Code |
| `run_landing_page_fix` | Ask Linkrunner to fix a version's problems. The fix becomes a new, unpublished version | Change | Admin | Code |
| `delete_landing_page` | Delete a landing page that is not shown anywhere | Delete | Admin | Code |

## Setup

| Tool | What it asks for | Type | Who can approve | In the chat |
| --- | --- | --- | --- | --- |
| `save_setup_answers` | Your answers in Get Started | Change | Admin or member | Code |
| `save_sdk_stack` | Which install guide Get Started shows | Change | Admin or member | Code |
| `dismiss_setup_checklist` | Hide Get Started for the person asking | Change | Person who asked | Code |
| `remind_teammate` | Email a teammate a Get Started reminder | Change | Admin or member | Code |
| `register_test_device` | Register a phone as the SDK console's test device | Change | Admin or member | Code |
| `select_test_device` | Choose which registered device is the test device | Change | Admin or member | Code |
| `remove_test_device` | Remove a registered test device | Delete | Admin or member | Code |
| `change_test_link_domain` | Move the SDK console's test link to another of your domains | Change | Admin or member | Code |

## Exports

| Tool | What it asks for | Type | Who can approve | In the chat |
| --- | --- | --- | --- | --- |
| `request_data_export` | Email a CSV export to the person asking | Change | Person who asked | Code |

## Read tools used by these changes

These read tools help the assistant find the right ids before it proposes a change. They are listed with the `reads` toolset, and with the change toolset that needs them.

| Tool | What it reads |
| --- | --- |
| `list_custom_channels` | Custom channels and how many campaigns use each |
| `list_web_campaigns` | Web campaigns with their links and UTM tags |
| `list_cohorts`, `get_cohort`, `preview_cohort` | Saved cohorts, one cohort's size, or how many users a set of rules matches |
| `get_attribution_settings` | Lookback windows, re-engagement, SKAN and uninstall tracking |
| `get_postback_settings` | One ad network's postback settings |
| `get_project_settings` | Project details, currency, auto-join, SDK key ids, Web SDK websites and link domains |
| `list_fraud_rules`, `simulate_fraud_rule` | Fraud rules, and how much recent traffic a rule would match |
| `list_signals` | Signals cards and detector mutes |
| `list_members`, `list_affiliate_partners`, `list_agencies` | The team, partners and agencies |
| `list_google_conversion_actions` | A Google Ads account's conversion actions |
| `list_landing_pages` | Landing pages, their versions and where each shows |
| `list_test_devices` | Registered SDK console test devices |

**Need help?** Contact [support@linkrunner.io](mailto:support@linkrunner.io)
