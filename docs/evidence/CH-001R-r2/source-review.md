# CH-001R-r2 source/provenance inspection

Implementation commit: b516dab843be1b8870d3516185b52905982aec1f
Run ID: r2-20260911-blocked
Evidence type: E1; source-only inspection, not runtime proof.

- PASS — deferred provider and publishing dependencies absent
- PASS — Compose publishes only the loopback web port
- PASS — worker uses node user, no-new-privileges, and dropped capabilities
- PASS — final image installs browser dependencies and runs as existing node user
- PASS — worker launch explicitly enables Chromium sandbox with no permissive fallback
- PASS — root state remains awaiting review and unaccepted

Pending repository license decision remains recorded; this inspection makes no legal/distribution determination.
