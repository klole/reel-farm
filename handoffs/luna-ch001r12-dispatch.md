You are Luna executing CH-001R-r12 — bounded pre-dispatch migration-proof repair for Open Slideshow Studio v0.1.0. NOT v0.2. NOT full acceptance. NOT a T11 hosted dispatch.

Repo: /workspace/projects/reel-farm (https://github.com/klole/reel-farm)
Prior T11/E11: 7d2a128432dd6922bee50fde94c9bd2b1bf5e49f / 323947cba4197689f40c9084f38629244d58792f
T11 tree: 9b948f6247c1f7804e34bd22cf3c9ae623bde593
E11 tree: 441bf4d74319d4a7da1313d0e7675747f0f3432c
P11: 10db55ff1f942f3b1894699fea3180b69f4afe27
Observed main after r11 router update: a7c239c0164ff456448e11684c593153e6fa8240
Workflow blob (unchanged): 35fa339aac2fcb024cd476ff38d87d27eb6482af / SHA-256 733643038bc7bc162265abf895e5348b1a0ca9039675740a77e0f5798b3efd2d
T11 lock SHA-256 (verify independently): 77861bac2106333c55ea960422cd0b34bca86dc50db2b7806ad7581c3d975576
Historical D1 run (do not rerun): 34946892709

Read first:
- architect/ch001r12-pack/CH001R_r12_Architect_Pack/00_READ_ME_FIRST.md
- architect/ch001r12-pack/CH001R_r12_Architect_Pack/01_REVIEW_VERDICT.md
- architect/ch001r12-pack/CH001R_r12_Architect_Pack/02_LUNA_ASSIGNMENT.md
- architect/ch001r12-pack/CH001R_r12_Architect_Pack/03_VERIFICATION_MATRIX.md
- architect/ch001r12-pack/CH001R_r12_Architect_Pack/04_ROUTER_HANDOFF.md
- architect/ch001r12-pack/CH001R_r12_Architect_Pack/05_HANDOFF_TEMPLATE.md
- architect/ch001r12-pack/CH001R_r12_Architect_Pack/06_REFERENCES.md
- architect/ch001r12-pack/CH001R_r12_Architect_Pack/LUNA_START_PROMPT.md
- architect/ch001r12-pack/CH001R_r12_Architect_Pack/scope-authorization.json
- architect/starter-ch001r12-luna.md
- architect/assignment-ch001r12-luna.md
- handoffs/CH-001R-r11.md
- handoffs/luna-ch001r11-router-pro-update.md (if present)
- docs/evidence/CH-001R-r11/ (if present)

Orchestrator notes:
- MAX effort; standard speed.
- Commit as you go; leave READY_FOR_ROUTER_PUBLISH for router (Luna may NOT push or dispatch).
- Write handoff to handoffs/CH-001R-r12.md and evidence under docs/evidence/CH-001R-r12/.
- Do NOT dispatch hosted workflows from Luna.
- Do NOT push to origin from Luna.
- Keep application_acceptance=false; awaiting_review.
- No providers/publishing/v0.2.
- HOLD unchanged T11 dispatch; this packet supersedes unspent T11 allowance — router owns at most one fresh T12 request later, not Luna.
- Do not rerun 34946892709 or any historical hosted job.
- Preserve T11 root @oss/db workspace:* fix and T11 lockfile bytes; frozen: migrate.ts, migrations/, Docker/Compose, workflow, pins, sandbox/worker security, app features, original 72 gates.

# Starting prompt — Luna MAX / CH-001R-r12

Execute **CH-001R-r12-r1** with MAX effort for Open Slideshow Studio v0.1.0. Inspect the repository and read the attached packet plus the original North Star/CH-001 contract before editing.

Preserve T11 `7d2a128432dd6922bee50fde94c9bd2b1bf5e49f`, E11 `323947cba4197689f40c9084f38629244d58792f`, and later router documentation in history.

Keep the existing root `@oss/db: workspace:*` fix and T11 lockfile bytes. Do not change application code, migration SQL/entrypoint, Docker/Compose, workflow, dependency/tool pins, or sandbox/worker security.

Repair BOTH absent-table SQL probes using a shared read-only presence-then-count routine. PostgreSQL resolves static relation references before CASE execution; do not pre-create metadata to hide that failure. Project container facts before any public logging and obtain process identity from the correct fields. Compute and persist one effective final-image import verdict requiring valid CLI and inspected-container evidence; keep CLI-only build checks separate from strict migration terminal checks.

Test the production boundaries, preserve existing regressions, and add a real PostgreSQL observer regression to the installed/capable path. Keep pre-install CI dependency-free. Run all available pinned source checks and the real post-build workspace import. Publish retrievable sanitized evidence, not dead links to ignored logs. Missing local Docker may leave runtime tests NOT_RUN; it does not permit skipping source tests or claiming migration success.

Return actual T12/E12 identities, the complete r12 checklist, scope diff, source results, runtime limitations, and a handoff. Keep application_acceptance=false, accepted version none, root awaiting_review. Do not push, spawn agents, dispatch, rerun T11 or historical jobs, or start features. Stop for router/architect review.
