# Starting prompt — CH-001R-r2 / Luna MAX

Set Luna to MAX or the highest available effort setting, attach this packet, and run it in the existing `klole/reel-farm` workspace.

---

Execute **CH-001R-r2** as a bounded repair and verification continuation of CH-001, targeting **v0.1.0**. This is not a v0.2 assignment.

Read `01_REVIEW_VERDICT.md`, `02_LUNA_CH001R2_BRIEF.md`, the supporting evidence/environment/handoff rules, root agent instructions, and the original CH-001 packet before modifying code.

The reviewed implementation is `bdd6540b90f2d59b7ef11215cd0ceb631fc6336a`; the original evidence/handoff is `ad0dd5fdd6764e4f3a40a6028720bff272130d42`. These are the same original submission, with **0 PASS, 0 FAIL, 72 NOT_RUN gates**. Preserve that history. Inspect any newer repository work; do not reset or overwrite it.

Implement the missing real test harnesses and a fail-closed aggregate verifier. Establish a disposable environment that can actually run PostgreSQL, the shipped Compose image, and the sandboxed worker/browser. Reproduce and repair the scoped findings R01–R11, especially container launch, sandboxing, save/upload preservation, truthful readiness, bounded recovery, and upload limits.

Run the real seven-slide UI journey and original 72-gate contract. Use the original evidence types: E1 for source-only gates, actual executed tests/lifecycle evidence where required, and real visual/keyboard inspection for those gates. Do not turn source scans into runtime passes. A recorded pending license decision is permitted where the original contract permits it.

Produce actual screenshots, the application-exported seven-slide JPEG ZIP, manifest/post/image hashes, preview-versus-ZIP byte equality, command reports, and fresh gate evidence. Do not merely return another plan or another set of guard scripts.

No fal.ai, ScrapeCreators, Pinterest, TikTok, publishing bridges, direct official TikTok API, scheduling, analytics, billing, MP4, public deployment, release/tagging, or v0.2 work. No provider spend or new paid infrastructure.

Return READY_FOR_ARCHITECT_REVIEW only when the mandatory original gates and required commands genuinely pass with retrievable evidence. Otherwise return BLOCKED with implemented harness progress and the exact remaining environment/implementation limitation. Keep root state `awaiting_review` and the accepted version unset.

Return the full implementation commit T and evidence/handoff commit E, actual command/gate counts, finding dispositions, artifact references, and scope declaration. Do not invent a file's containing commit SHA before committing it. Stop for architect review.
