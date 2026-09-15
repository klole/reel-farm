# Starting prompt — Luna MAX / CH-001R-r10

Execute **CH-001R-r10-r1** as a bounded continuation of CH-001 for Open Slideshow Studio v0.1.0. Use MAX effort. Read the attached architect packet and the repository's current handoff, state, and original acceptance contract before editing.

T9 `6014a247b124a186a1abfcb6d65a7ef024cf8cfc` and E9 `0f222800f1e91a18cc2f16824a87c9513cd29026` reached hosted run `34937329430`. Bootstrap, all 64 CI cases, and host Chromium qualification passed. The actual proof then built the image and reached a healthy database, but the migration service exited 1. The proof result is `LIVE_PROOF_FAILED` / `TEST_FAILURE`, child exit 1; acceptance remains false. The archive does not contain the migration stderr, so its inner cause is not established.

Obtain the real migration exception from the exact final-image entrypoint against an isolated database, then make only the minimal evidence-backed correction. Investigate root-script `@oss/db` resolution as a hypothesis, not a confirmed error. Do not guess at SQL or weaken migration requirements.

Repair the confirmed coordinator gap: failed partial startup must collect sanitized stopped-service state and migration logs before run-owned teardown, even when `compose up` returns nonzero. Keep primary errors, bounded commands, sibling-project safety, and a final manifest that includes diagnostics and cleanup. Preserve r5 directory ownership and the working r6–r9 prerequisites.

Run the actual final-image migration fresh/repeat checks and partial-startup tests in a capable environment, plus the scoped pinned-tool/static/CI checks. When runtime prerequisites are unavailable, deliver diagnostic-only work with executable router reproduction instructions and honest NOT_RUN results; do not claim a migration repair was verified. The router owns publication and at most one conditional fresh T10 request; do not dispatch, rerun any old workflow, or create an automatic retry loop.

Keep application acceptance false, accepted version none, and root awaiting_review. No AI/providers, publishing, scheduling, billing, video, deployment/release, sandbox bypass, worker-isolation redesign, dependency upgrade, or v0.2 feature work. Return actual T10/E10 identities, cause disposition, command/case results, sanitized diagnostics, cleanup evidence, manifest, and completed handoff. Then stop for architect review.
