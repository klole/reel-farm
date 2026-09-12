# CH-001R-r3 source/provenance inspection

Implementation commit: `0b79ed07a25a618ab4da2bf56a2fed6047398cb5`

Evidence type: E1; source-only inspection, not runtime or visual proof.

- PASS — deferred provider and publishing dependencies absent.
- PASS — Compose publishes only the loopback web port.
- PASS — worker uses the `node` user, `no-new-privileges`, and dropped capabilities.
- PASS — final image installs browser dependencies, ships the required tests, and runs as the existing `node` user.
- PASS — worker launch explicitly enables the Chromium sandbox with no permissive fallback.
- PASS — root state remains `awaiting_review` with accepted application version `none`.

Pending repository license decision remains recorded; this inspection makes no legal/distribution determination.
