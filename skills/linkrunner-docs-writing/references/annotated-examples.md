# Annotated writing examples

These examples came from a bounded documentation experiment. They explain editing decisions, not permanent product contracts. Recheck the relevant release and implementation before using the observed behavior in a public guide. No reader study established that the longer drafts were better.

## Make the identity branch executable

**Before:** prose says to supply a Mixpanel override only without `identify`, but the shared sample always sends `mixpanel_distinct_id: "MIXPANEL_DISTINCT_ID"`.

**Why it fails:** the inspected real-time selectors preferred a nonempty override to the app user ID. Copying the placeholder would therefore select that literal string. A comment cannot remove an object property.

**Better instruction:** "If your app already identifies this user in Mixpanel, pass the same ID in `user_data.id` and omit `mixpanel_distinct_id`."

Show an identified-user example that actually omits the field. Give the other identity case its own explanation. Do not invent a Mixpanel getter or assume any device ID is interchangeable with the intended distinct ID. Do not present omission as a repair for a previously stored override without checking update semantics.

**Acceptance check:** the documented payload for the selected case contains the intended ID and no unconditional optional placeholder. Where feasible, exercise the actual selector offline with delivery replaced by a recording fixture.

## Do not make a log stronger than its evidence

**Before:** a JavaScript initialization call is followed by a success message that implies native initialization has completed.

**Why it fails:** in the inspected `rn-linkrunner@3.1.0` iOS bridge, a void method launched an asynchronous native task. The JavaScript call did not await that task or return attribution data. Strict typechecking alone could not reveal the completion mismatch.

**Better instruction:** explain what the call actually establishes, then provide the appropriate separate check for the reader's goal. Do not promise immediate attribution readiness or claim that JavaScript error handling receives asynchronous native failures without evidence.

**Acceptance check:** each statement about completion is supported by the released wrapper and native bridge, or by a runtime test of that platform. Mocked JavaScript checks remain labelled as mocks.

## Keep the task-focused rewrite small

**Before:** "Initialize the SDK." The snippet omits its import and component context.

**Overcorrection:** replace it with a long framework containing retries, placeholder guards, lifecycle guards, and every possible native failure.

**Better instruction:** name the file and placement, supply the imports needed for the declared example, explain required values, and keep the reader's success check visible. Add a guard only when the documented flow needs it. Move uncommon setup failures into troubleshooting.

**Acceptance check:** a reader can place and adapt the example without guessing. Additional code must serve the selected task, not merely make the example look defensive.

## External reading patterns

Study a specific communication pattern, not a company's entire style:

- [Stripe webhooks](https://docs.stripe.com/webhooks): connect setup with result inspection and failure behavior.
- [DigitalOcean writing guidelines](https://www.digitalocean.com/community/tutorials/digitalocean-s-technical-writing-guidelines): make prerequisites and procedural steps explicit.
- [Cloudflare writing guidelines](https://developers.cloudflare.com/style-guide/documentation-content-strategy/writing-guidelines/): introduce concepts and choices in a useful order.
- [Diataxis](https://diataxis.fr/): distinguish teaching, task completion, reference, and explanation.

These are reading resources, not a current popularity ranking or evidence for Linkrunner semantics.
