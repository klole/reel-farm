You are Luna executing CH-001R-r10 — bounded migration-failure diagnosis + partial-startup diagnostics/cleanup repair for Open Slideshow Studio v0.1.0. NOT v0.2. NOT full acceptance.

Repo: /workspace/projects/reel-farm (https://github.com/klole/reel-farm)
Prior T9/E9: 6014a247b124a186a1abfcb6d65a7ef024cf8cfc / 0f222800f1e91a18cc2f16824a87c9513cd29026
Failed hosted run to repair against: 34937329430 (LIVE_PROOF_FAILED / TEST_FAILURE; migrate service exit 1 after healthy db; bootstrap + 64 CI cases + host Chromium qualification passed); artifact 10383922146 digest sha256:4b64eb28f946bd74fd67fe14b10200b85886ed28eb42ea2847e71443ac1a96f0

Read first:
- architect/ch001r10-pack/CH001R_r10_Architect_Pack/README.md
- architect/ch001r10-pack/CH001R_r10_Architect_Pack/01_REVIEW_VERDICT.md
- architect/ch001r10-pack/CH001R_r10_Architect_Pack/02_LUNA_ASSIGNMENT.md
- architect/ch001r10-pack/CH001R_r10_Architect_Pack/03_TEST_EVIDENCE_CONTRACT.md
- architect/ch001r10-pack/CH001R_r10_Architect_Pack/04_ROUTER_HANDOFF.md
- architect/ch001r10-pack/CH001R_r10_Architect_Pack/05_HANDOFF_TEMPLATE.md
- architect/ch001r10-pack/CH001R_r10_Architect_Pack/06_SOURCES.md
- architect/ch001r10-pack/CH001R_r10_Architect_Pack/LUNA_START_PROMPT.md
- architect/starter-ch001r10-luna.md
- architect/assignment-ch001r10-luna.md
- handoffs/CH-001R-r9.md

Orchestrator notes:
- MAX effort; standard speed.
- Commit as you go; push to origin/main before stopping if authorized, else leave READY_FOR_ROUTER_PUBLISH for router.
- Write handoff to handoffs/CH-001R-r10.md.
- Do NOT dispatch hosted workflows from Luna.
- Keep application_acceptance=false; awaiting_review.
- No providers/publishing/v0.2.

# Starting prompt — Luna MAX / CH-001R-r10

Execute **CH-001R-r10-r1** as a bounded continuation of CH-001 for Open Slideshow Studio v0.1.0. Use MAX effort. Read the attached architect packet and the repository's current handoff, state, and original acceptance contract before editing.

T9 `6014a247b124a186a1abfcb6d65a7ef024cf8cfc` and E9 `0f222800f1e91a18cc2f16824a87c9513cd29026` reached hosted run `34937329430`. Bootstrap, all 64 CI cases, and host Chromium qualification passed. The actual proof then built the image and reached a healthy database, but the migration service exited 1. The proof result is `LIVE_PROOF_FAILED` / `TEST_FAILURE`, child exit 1; acceptance remains false. The archive does not contain the migration stderr, so its inner cause is not established.

Obtain the real migration exception from the exact final-image entrypoint against an isolated database, then make only the minimal evidence-backed correction. Investigate root-script `@oss/db` resolution as a hypothesis, not a confirmed error. Do not guess at SQL or weaken migration requirements.

Repair the confirmed coordinator gap: failed partial startup must collect sanitized stopped-service state and migration logs before run-owned teardown, even when `compose up` returns nonzero. Keep primary errors, bounded commands, sibling-project safety, and a final manifest that includes diagnostics and cleanup. Preserve r5 directory ownership and the working r6–r9 prerequisites.

Run the actual final-image migration fresh/repeat checks and partial-startup tests in a capable environment, plus the scoped pinned-tool/static/CI checks. When runtime prerequisites are unavailable, deliver diagnostic-only work with executable router reproduction instructions and honest NOT_RUN results; do not claim a migration repair was verified. The router owns publication and at most one conditional fresh T10 request; do not dispatch, rerun any old workflow, or create an automatic retry loop.

Keep application acceptance false, accepted version none, and root awaiting_review. No AI/providers, publishing, scheduling, billing, video, deployment/release, sandbox bypass, worker-isolation redesign, dependency upgrade, or v0.2 feature work. Return actual T10/E10 identities, cause disposition, command/case results, sanitized diagnostics, cleanup evidence, manifest, and completed handoff. Then stop for architect review.
