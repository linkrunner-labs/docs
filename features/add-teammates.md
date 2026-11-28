---
title: "Sign In and Add Teammates"
description: "Give every teammate their own Linkrunner login, so each person signs in with their own email"
---

# Sign In and Add Teammates

<p class="vp-lead">Give every teammate their own Linkrunner login, so each person signs in with their own email</p>

Linkrunner has no passwords and no shared logins. Each person signs in with their own work email. A teammate gets access when someone on your team invites them, or through auto-join for your company's email domain.

## How sign-in works

Go to [dashboard.linkrunner.io](https://dashboard.linkrunner.io) and choose one:

- **Continue with Google**, with your work Google account
- **Send sign-in link**, which emails a one-time link to the address you enter

<img src="/images/team/sign-in.webp" alt="The Linkrunner sign-in page with Continue with Google and an email field with a Send sign-in link button" width="460" />

The sign-in link goes only to the address you typed. If a colleague enters your email, the link lands in your inbox, not theirs. Invite them instead, so they sign in with their own address.

## Add a teammate to your project

<Steps>

<Step title="Open Members">

Go to [Settings → Members](https://dashboard.linkrunner.io/dashboard/settings/members) and click **Invite Teammate**.

<img src="/images/team/customer-members.webp" alt="The Members page in project settings, with the Invite Teammate button and a pending teammate marked Invited" />

</Step>

<Step title="Enter their email and permission">

Enter their work email. To invite several people, separate the emails with commas. Pick a **Permission**, then click **Invite Member**.

| Permission | What they can do |
| --- | --- |
| **Admin** | Full access, including billing |
| **Member** | Full access, except billing |
| **Limited member** | Same as Member, without user-level data, exports, API keys, MCP, Ask AI or integration changes. See [Limited members](#limited-members) |
| **Finance** | Only usage, invoices and payments. See [Add your finance team](/billing/finance-role) |
| **Influencer** | Only the campaigns shared with them |

**Role** (Marketing, Engineering, Finance, Other) only labels what the person does. Access comes from **Permission**.

<img src="/images/team/customer-invite-teammate.webp" alt="The Invite Members dialog with an email entered and the Member permission selected" />

</Step>

<Step title="They sign in with that email">

If they already have a Linkrunner account, they are added right away. Otherwise they get an email invitation, and their row shows **Invited** until they sign in with the invited address, using Google or a sign-in link. They then see your project.

</Step>

</Steps>

Admins can invite any permission. Members can invite Members, Limited members and Influencers.

### Limited members

Choose **Limited member** for someone who runs campaigns and reads reports but should not see data about individual users, such as a contractor or an agency teammate.

<img src="/images/team/customer-invite-limited-member.webp" alt="The Invite Members dialog with the Limited member permission selected and a note on what the permission leaves out" />

A limited member works like a Member: they can create and edit app and web campaigns, and see Home, Signals, funnels, event counts and every campaign report. Funnels work without filtering by event parameter values. They cannot:

- **See user-level data.** The **Users** and **Audience Builder** pages, the **Events Log** tab, and user lists in campaign and web reports are hidden.
- **Export data.** Every export and CSV download is hidden, along with **Data Export** in settings.
- **See keys.** Project tokens, the server key and third-party API keys are hidden.
- **Use MCP or Ask AI.** They cannot connect an AI app, chat with Ask AI or approve AI changes.
- **Change integrations or setup.** **Integrations**, **SDK Console**, **SDK Health** and **Fraud Control** are hidden, and so are the **Deeplinks**, **Remarketing**, **SDK Signing** and **Uninstall Tracking** settings. On **Project Details** they can change the name, company, logo, timezone and currency, but not the store links or website, and they cannot add an app.
- **Manage the team.** They see **Members** but cannot invite people, change roles or share campaigns.
- **Delete the project or a domain.**

If a limited member opens a link to a hidden page, the dashboard takes them back to their campaigns, or to **Project Details** for a hidden setting.

### Let your whole team join

Admins can turn on auto-join on the same **Members** page. Anyone who then signs up with your company's email domain can find and join the project as a **Member**, without an invite. Auto-join only offers domains that a current admin or member already uses.

## Add a teammate to your agency or affiliate workspace

Partners invite their own team from their workspace settings.

- **Agency:** go to [Agency Settings → Members](https://dashboard.linkrunner.io/agency/settings?tab=members), click **Invite**, enter their **Work Email**, then click **Send Invite**. Everyone in your agency sees every customer project you are engaged on. See [Agency settings and team](/agency-partners/manage-workspace#your-team).
- **Affiliate:** go to [Affiliate Settings → Members](https://dashboard.linkrunner.io/affiliate/settings?tab=members) and follow the same steps. The **Members** tab appears once Linkrunner approves your affiliate account.

<img src="/images/team/affiliate-members.webp" alt="The Members tab in affiliate settings, with the Invite button" />

Your teammate must accept the invitation while signed in with the invited email. A pending invitation has a **Resend** action if the email went missing.

## Troubleshooting

**The sign-in link goes to someone else's inbox.**
The colleague typed another person's email. Invite them with their own address using the steps above, then they sign in with that address.

**A colleague signed in and was asked to create a new project.**
They signed in before being invited, or with a different address than the invited one, and auto-join is off for their domain. Invite the exact address they sign in with, then ask them to sign in again.

**Accepting the invitation fails.**
The teammate is signed in with a different address than the one invited, or the invitation expired. Sign in with the invited address, or click **Resend** to send a fresh invitation.

**Can we use a password instead?**
No. Linkrunner uses Google sign-in or a one-time email link, so there is no password to share or reset.

**Need help?** Contact [support@linkrunner.io](mailto:support@linkrunner.io)
