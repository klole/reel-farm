# CH-001R-r13 source/provenance inspection

Implementation commit: 6e04b5a5eefe2ef464572da35c88338fa342f525
Run ID: r13-local-20260915c
Evidence type: E1; source-only inspection, not a replacement for runtime/manual proof.

- PASS — deferred provider and publishing dependencies absent
- PASS — Compose publishes only the loopback web port
- PASS — worker uses node user, no-new-privileges, and dropped capabilities
- PASS — final image installs browser dependencies, ships tests, and runs as existing node user
- PASS — worker launch explicitly enables Chromium sandbox with no permissive fallback
- PASS — both absent-table probes use the shared catalog presence-then-count observer and never pre-create metadata
- PASS — real PostgreSQL observer regression includes the historical unsafe-query negative control
- PASS — container inspection privately captures raw JSON and publicly projects actual Path/Args plus configured process fields
- PASS — public container/image facts exclude unrestricted environment values, host configuration, labels, and mount sources
- PASS — final-image import evidence persists and returns one effective verdict after CLI, child-report, and inspection checks
- PASS — CLI-only build/database-start validation is separate from container-required migration terminal validation
- PASS — root state remains awaiting review and unaccepted

Pending repository license decision remains recorded; this inspection makes no legal/distribution determination.
