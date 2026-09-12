# CH-001R-r3 source/provenance inspection

Implementation commit: 6849b39f4e3c7a03b5f132418b1d33cc84c98d51
Run ID: r4-34671716094-1
Evidence type: E1; source-only inspection, not a replacement for runtime/manual proof.

- PASS — deferred provider and publishing dependencies absent
- PASS — Compose publishes only the loopback web port
- PASS — worker uses node user, no-new-privileges, and dropped capabilities
- PASS — final image installs browser dependencies, ships tests, and runs as existing node user
- PASS — worker launch explicitly enables Chromium sandbox with no permissive fallback
- PASS — root state remains awaiting review and unaccepted

Pending repository license decision remains recorded; this inspection makes no legal/distribution determination.
