---
title: "Approve changes your AI assistant asks for"
description: "Your AI assistant never changes your Linkrunner project by itself. It proposes a change, a person approves it, and only then does Linkrunner apply it."
---

# Approve changes your AI assistant asks for

<p class="vp-lead">Your AI assistant never changes your Linkrunner project by itself. It proposes a change, a person approves it, and only then does Linkrunner apply it.</p>

This applies to every AI app connected through the [Linkrunner MCP server](/features/mcp): Claude, ChatGPT, Codex, Claude Code, and any other client. You can ask for a new campaign, a paused link, a new postback mapping or an invite, and nothing in your project changes until someone approves it.

## How it works

<Steps>

<Step title="You ask for a change">

For example: "Create a Meta campaign called Diwali Meta 2026 that opens our sale page."

</Step>

<Step title="The assistant proposes it">

Linkrunner reads your project and builds a preview of the change:

- **What changes:** each field, with its value now and after approval.
- **Also affects:** anything else the change touches, such as a link that stops working or a test event sent to an ad network.
- **Undo:** whether the change can be undone later.
- An approve link, and an expiry 24 hours from now.

The assistant shows you this preview. Nothing has changed yet.

</Step>

<Step title="A person approves or rejects it">

Approve it on the review page in the Linkrunner dashboard, or in the chat itself if your AI app supports it. See [Approve or reject a change](#approve-or-reject-a-change).

</Step>

<Step title="Linkrunner checks it again and applies it">

Linkrunner rebuilds the preview from your current data. If anything you were shown has changed since, it stops and nothing runs (see [Out of date](#out-of-date-changes)). Otherwise it applies the change as the person who approved it, with that person's project permissions, and records it in [Change History](#change-history).

If live changes are not on for your project yet, the approval is recorded as a **Dry run** and nothing changes. See [What each status means](#what-each-status-means).

</Step>

</Steps>

![Review page for a proposed campaign, with the change table, Also affects, the undo note, and the Approve and Reject buttons](/images/mcp/ai-change-review-pending.webp)

<Note>

The assistant cannot approve for you. Approving is always done by a person: in Linkrunner, in the approval card, or in your AI app's confirm prompt.

</Note>

## Approve or reject a change

### On the review page

Open the approve link the assistant gives you. It opens the change in the dashboard and switches to its project. Read the preview, then click **Approve** or **Reject**. After you approve, the page shows the result.

![Review page after approval, showing Applied by Riya Mehta](/images/mcp/ai-change-review-applied.webp)

To see every change waiting in a project, open [AI changes](https://dashboard.linkrunner.io/dashboard/changes) in the dashboard, or use the link at the top of the **AI changes** card in **Settings → MCP**. Changes waiting for approval are listed first.

![AI changes list with one change waiting for approval](/images/mcp/ai-changes-list.webp)

### In the chat

Some AI apps can show an approval card right under the assistant's reply, or ask you to confirm in the chat. The card shows the same preview with **Approve** and **Reject** buttons, and after you click it shows the result.

![Approval card in an AI app, with the change table and the Approve, Reject and Open in Linkrunner buttons](/images/mcp/ai-change-approval-card.webp)

Approving in the chat works only for the person who asked, and only on a [sign-in connection](/features/mcp#connect) in an AI app that supports it. Everywhere else, the assistant gives you the approve link instead, and you approve on the review page. The link is always there, even when the card is shown.

### Withdraw a change

To withdraw a change you asked for, ask the assistant to cancel it, or click **Reject** on the review page. Only the person who asked can cancel a change through the assistant. A change that was already applied cannot be withdrawn. To reverse it, [undo it](#undo-a-change).

## Who can approve

A change can be approved by:

- **The person who asked**, if their project role lets them make the same change in the dashboard. They can approve on the review page or in the chat.
- **A project admin**, on the review page.

Only admins and members can approve. Influencers, finance members, affiliate partners and agencies cannot.

Members can approve most changes they could make themselves in the dashboard, such as creating campaigns, deleting funnels or editing postback mappings. These need an admin:

| Area | Changes that only an admin can approve |
| --- | --- |
| Attribution | Click lookback windows and view-through windows |
| Campaigns | Adding or changing a campaign's landing page |
| Landing pages | Renaming, deleting, fixing, publishing and assigning landing pages |
| Team | Inviting an admin or finance member, changing a role to or from admin or finance, removing a member |
| Partners and agencies | Connecting, disconnecting or changing access for affiliate partners and agencies |
| Settings | Turning on web campaigns, and auto-join for company email domains |
| Integrations | Everflow settings and event mappings |

Two changes can only be approved by the person who asked, because they act for that person alone: requesting a data export by email, and hiding the Get Started checklist. A change asked for in the dashboard's own AI chat can also only be approved by the person who asked.

If your role cannot approve a change, the review page says why and hides **Approve**. Click **Copy review link** and send it to a project admin.

![Review page for a member who cannot approve an admin invite, with the reason and a Copy review link button](/images/mcp/ai-change-review-role-blocked.webp)

## What each status means

| Status | What it means | What to do |
| --- | --- | --- |
| **Waiting for approval** | Proposed, not approved yet. Nothing has changed. | Approve or reject it within 24 hours. |
| **Applying** | Approved, and Linkrunner is applying it now. | Wait a moment. The page shows the result. |
| **Applied** | Approved and done. | Nothing. It shows in Change History. |
| **Dry run** | Approved, but live changes are not on for this project yet, so nothing changed. A dry run cannot be undone because nothing ran. | Contact [support@linkrunner.io](mailto:support@linkrunner.io) to turn on live changes. |
| **Rejected** | Someone rejected it. Nothing changed. | Ask again if you still want it. |
| **Cancelled** | The person who asked withdrew it. Nothing changed. | Ask again if you still want it. |
| **Expired** | Nobody approved it within 24 hours. Nothing changed. | Ask again. |
| **Out of date** | Something changed after the preview was made, so the approval was refused. Nothing ran. | Ask the assistant again for a fresh preview. |
| **Failed** | Linkrunner tried to apply it and the change did not go through. The page shows the reason. | Fix the cause and ask again. A failed change is never retried by itself. |
| **Check the result** | Linkrunner cannot tell whether it was applied, for example because applying it was interrupted. | A project admin checks the item and clicks **It applied** or **It did not apply**. Until then, other changes to the same item cannot be approved. |

## Out of date changes

You approve exactly what you were shown. When someone clicks **Approve**, Linkrunner first rebuilds the preview from your current data and compares it with the preview you saw. If anything shown is different, for example a teammate renamed the campaign or changed its deep link in the meantime, Linkrunner refuses the approval and nothing runs. The change ends as **Out of date**, with the fields that changed.

The same happens when the item was replaced by another one, or when another approved change to the same item is being applied at that moment.

Ask the assistant to propose the change again. The new preview uses the current data.

## Turn change types on or off

Changes come in three types. A project admin turns each type on or off for the project in **Settings → MCP → AI changes**.

| Type | What the assistant can ask for | Default |
| --- | --- | --- |
| **Changes** | Create or edit campaigns, links, funnels, cohorts, postback mappings, store listings, fraud rules, landing pages and similar items | On |
| **Deletes** | Delete campaigns, channels, funnels, cohorts, store listings, mappings, fraud rules, landing pages and test devices | Off |
| **Team and settings** | Invite and manage members, partners and agencies, share campaigns, and change webhooks, domains, ad network connections, project settings, SDK keys and Web SDK websites | Off |

![AI changes card in Settings → MCP with the Changes, Deletes and Team and settings switches](/images/mcp/ai-changes-settings.webp)

Members can see the switches. Only project admins can change them. When a type is off, the assistant tells you it is switched off for the project.

The [tool reference](/features/mcp-tools) lists the type of every change.

### What your connection is allowed to ask for

A change also needs your connection to allow its type:

- **Token connections** choose this when you generate the token in **Settings → MCP**. **Make changes in Linkrunner** allows Changes. **Deletes** and **Team and settings** each need it too. A new token can only read until you tick one. To change a token's permissions, generate a new token. See [Generate a token](/features/mcp#_1-generate-a-token).
- **Sign-in connections** can ask for Changes. To ask for deletes, or team and settings changes, connect with a token that has those permissions.

If you use the API directly, the token scopes are `linkrunner:write` (Changes), `linkrunner:delete` (Deletes) and `linkrunner:manage` (Team and settings).

## Undo a change

The preview tells you whether a change can be undone. Many edits and switches can, such as a paused link, a renamed funnel, or a changed attribution window. Deletes, test sends, emails and most creates cannot.

To undo an applied change, ask the assistant, for example "Undo the change to the Diwali Meta link". It proposes the reverse change, which shows **Undoes** on the review page and needs approval like any other change. If the item was deleted or replaced since, the undo is refused.

Undoing a create, such as a new fraud rule or test device, proposes a delete. It needs **Deletes** switched on for the project, and on a token, the **Deletes** permission.

## Change History

Every applied change is recorded in [Settings → Change History](https://dashboard.linkrunner.io/dashboard/settings/change-history). Changes that came from an AI app carry an **AI** badge and say who asked, in which app, and who approved it. Click **View change** to open its review page.

![Change History row with the AI badge and Requested by Riya Mehta in Claude, approved by Riya Mehta](/images/mcp/ai-change-history.webp)

The assistant can also read this history for you ("What changed in my project this week?").

## Troubleshooting

**The assistant says a type of change is switched off for this project.**
A project admin turns it on in **Settings → MCP → AI changes**. See [Turn change types on or off](#turn-change-types-on-or-off).

**The assistant cannot find a tool for a delete or a team change.**
Your connection does not allow that type. Sign-in connections can only ask for Changes. Generate a token with **Deletes** or **Team and settings** ticked. The assistant also lists only the tools in the toolsets your connection uses. See [Choose which tools your assistant sees](/features/mcp-tools#choose-which-tools-your-assistant-sees).

**I don't see an Approve button.**
The page says why. If your role cannot approve the change, send the review link to a project admin. If only the person who asked can approve it (a data export, hiding Get Started, or a change asked for in the dashboard chat), that person must approve it. Nobody else can, an admin included.

**The change is Out of date or Expired.**
Ask the assistant to propose it again. It builds a new preview from your current data.

**My AI app shows a link, not an approval card.**
Approving in the chat is only available on sign-in connections in AI apps that support it. Use the link. If you connected before approval cards were available, disconnect Linkrunner in your AI app and connect again.

**The assistant said it was done, but nothing changed.**
The change runs only after a person approves it. Ask the assistant for the change's status, or open [AI changes](https://dashboard.linkrunner.io/dashboard/changes) in the dashboard. If the status is **Dry run**, live changes are not on for your project yet.

**Need help?** Contact [support@linkrunner.io](mailto:support@linkrunner.io)
