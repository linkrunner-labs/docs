# Documentation review notes

## Scope

- Pages and selected changes:
- Reader task and starting state:
- Platforms and released versions:
- Authorized edits and test environments:

## Reader-only pass

Complete before examining implementation source.

- Missing prerequisites or choices the reader must guess:
- Steps or examples that disagree with their platform or prose:
- Observable success and recovery gaps:

## Findings

Order by blocker, clarity, then style. Scope is separate from severity.

| Class | Page/section | Reader impact | Evidence | Scope and proposed fix |
| --- | --- | --- | --- | --- |

Use docs correction, product defect/decision, or unresolved evidence for scope.
List baseline issues outside the selected scope separately. Do not rewrite them here.

## Release and platform evidence

| Claim and behavioral layer | SDK/platform | Released version or deployed revision | Source URL/path and symbol | Present/absent/passthrough/unresolved |
| --- | --- | --- | --- | --- |

Keep published SDK evidence separate from deployed-code parity. State missing evidence.

## Verification

| Check type | Exact command and directory | Environment and platform/version | Expected result | Observed result or untested reason |
| --- | --- | --- | --- | --- |

Separate rendering/link checks, offline fixtures, typechecks, native runtime, and live delivery.
Record baseline failures and their evidence. Never infer delivery from compilation or acceptance.

## Closeout checklist

- [ ] Reader path rechecked after edits, or no edits made
- [ ] Navigation, redirects, changed URLs, and stale claims checked where applicable
- [ ] Untested examples, platforms, and claims listed with reasons
- [ ] Product decisions, out-of-scope findings, and policy contradictions disclosed
- [ ] Final diff contains only authorized changes

Use concrete findings and test results. Do not assign scores or grades.
