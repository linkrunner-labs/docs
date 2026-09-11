# Sources of truth

Choose evidence for the claim being made. A source for one layer does not establish another.

| Claim | Inspect | Does not establish |
| --- | --- | --- |
| SDK method, argument, return type, default | Exact published package version, declarations, wrapper implementation, and native bridge where relevant | That a local app builds or native work has finished |
| Required platform configuration | Released SDK/package configuration and the platform vendor's applicable contract | That another SDK has identical requirements |
| Backend selection or processing | The actual handler, worker, mapper, and tests for the relevant path | That this checkout is deployed or that external delivery succeeded |
| Current production behavior | Deployed version/configuration and approved, bounded read-only evidence where needed | Unobserved platforms, dates, or delivery layers |
| Dashboard location or label | Applicable UI implementation and rendered interface | That an unreleased control is available to customers |
| Third-party field, permission, or identity rule | Official vendor documentation for the relevant API/SDK and identity mode | Linkrunner's implementation of that contract |
| Tone or explanation pattern | Annotated external docs and observed reader difficulties | Any Linkrunner product guarantee |

## Locate the implementation

Use the available checkout, GitHub source, or a versioned package artifact. Repository directories may be absent; do not invent local paths or silently fall back to memory.

- Linkrunner SDK packages define the released interface. Inspect their manifests, types, and native wrappers together when completion behavior matters.
- `ts-backend` and `hazelnut` contain backend handlers and integration consumers. Follow field usages into selectors and delivery providers; an HTTP controller alone may not describe processing.
- The dashboard repository defines current controls, labels, and navigation. Check whether the inspected change has shipped before writing public instructions.
- This docs repository defines navigation and existing page conventions, but existing prose is not proof of behavior.

Record the repository commit or exact published version for each load-bearing claim in review notes. For package downloads, verify the registry's integrity metadata before treating the archive as the release inspected. Keep credentials and customer data out of evidence.

## Resolve disagreements

1. Identify whether the sources describe different versions, platforms, identity modes, or processing layers.
2. Check required versus optional in both directions. Types can allow omission while a particular project configuration requires the value.
3. Keep separate paths separate, including real-time and batch synchronization. Do not infer matching fallback or update semantics.
4. Distinguish a new mapping from repairing stored state. Omitting a value is not automatically a deletion operation.
5. Record unresolved required steps or guarantees as blockers. Do not quietly choose the most convenient source.

## Verification boundaries

Use local checks and synthetic fixtures first. Live test events, changes to accounts, and production writes require explicit approval. If production corroboration is needed, use only approved, bounded read-only evidence without unrelated customer identifiers.

Write review notes such as "strict typecheck against package version X passed; native runtime not exercised", rather than "integration verified". Public docs need real product limitations that affect the reader, not an audit log of unavailable test environments.
