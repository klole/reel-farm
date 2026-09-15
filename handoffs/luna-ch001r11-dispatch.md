You are Luna executing CH-001R-r11 — root workspace dependency repair (@oss/db) and migration-first qualification for Open Slideshow Studio v0.1.0. NOT v0.2. NOT full acceptance.

Repo: /workspace/projects/reel-farm (https://github.com/klole/reel-farm)
Prior T10/E10: ec7cc08d6ed229af9780318858d8051202851746 / f512c9c02620ea600404cd304782a37e6689a109
T10 tree: 9e43ac5c00801f7d523405dbe5874d64264fa7cc
D1 receipt: ad2aab759391c070808024ff98977f72c8cb8ec5
Main seal observed: 3d1bb3c8b544b295236aa92aaee1e406e26f68aa
Failed hosted run to repair against: 34946892709 (LIVE_PROOF_FAILED / TEST_FAILURE; migrate ERR_MODULE_NOT_FOUND Cannot find package '@oss/db' from /app/scripts/migrate.ts; bootstrap PASS); artifact 10387768055 digest sha256:4c6dae545e0f778ff90bebf9216bd90258ceb41fde228a9fdff50f460a34e685
Workflow blob (unchanged): 35fa339aac2fcb024cd476ff38d87d27eb6482af / SHA-256 733643038bc7bc162265abf895e5348b1a0ca9039675740a77e0f5798b3efd2d

Read first:
- architect/ch001r11-pack/CH001R_r11_Architect_Pack/00_READ_ME_FIRST.md
- architect/ch001r11-pack/CH001R_r11_Architect_Pack/01_REVIEW_VERDICT.md
- architect/ch001r11-pack/CH001R_r11_Architect_Pack/02_LUNA_ASSIGNMENT.md
- architect/ch001r11-pack/CH001R_r11_Architect_Pack/03_VERIFICATION_MATRIX.md
- architect/ch001r11-pack/CH001R_r11_Architect_Pack/04_ROUTER_HANDOFF.md
- architect/ch001r11-pack/CH001R_r11_Architect_Pack/05_HANDOFF_TEMPLATE.md
- architect/ch001r11-pack/CH001R_r11_Architect_Pack/06_REFERENCES.md
- architect/ch001r11-pack/CH001R_r11_Architect_Pack/LUNA_START_PROMPT.md
- architect/ch001r11-pack/CH001R_r11_Architect_Pack/scope-authorization.json
- architect/starter-ch001r11-luna.md
- architect/assignment-ch001r11-luna.md
- handoffs/CH-001R-r10.md
- docs/evidence/CH-001R-r10-D1/ (if present)

Orchestrator notes:
- MAX effort; standard speed.
- Commit as you go; push to origin/main before stopping if authorized, else leave READY_FOR_ROUTER_PUBLISH for router.
- Write handoff to handoffs/CH-001R-r11.md.
- Do NOT dispatch hosted workflows from Luna.
- Keep application_acceptance=false; awaiting_review.
- No providers/publishing/v0.2.
- T10 hosted allowance consumed; do not rerun 34946892709. Router owns at most one conditional fresh T11 request after source-ready checks.

# Starting prompt — Luna MAX / CH-001R-r11

Execute **CH-001R-r11-r1** with MAX effort for Open Slideshow Studio v0.1.0. Inspect the repository and read the attached packet plus the original North Star/CH-001 contract before editing.

D1 now captured the actual T10 final-image exception: `ERR_MODULE_NOT_FOUND` for `@oss/db` from `/app/scripts/migrate.ts`. The historical run is 34946892709, artifact 10387768055. Do not repeat the old diagnostic-only loop or rerun that hosted job. Use it as the negative baseline.

Implement the explicit narrow fix: add root runtime `@oss/db: workspace:*`, generate only its application-root importer local link with pinned pnpm 12.3.4, and preserve the migration script/SQL, external versions, Docker/Compose, sandbox, workflow and original 72 gates. Update `R7-T11`'s pin guard only for this exact authorized dependency/lock delta; keep and test all other protections.

Add actual post-build module-import verification and a runnable migration-first prefix to the existing proof coordinator. It must execute the shipped candidate migration in the final image, inspect real fresh/schema/repeat/failure-control outcomes before worker readiness, and retain those results plus r10 diagnostics/cleanup on later failure. Do not substitute fake modules, host SQL, broad aliases, manual symlinks, or placeholder artifacts.

Run the required source-ready checks and both clean/hosted-like no-node_modules CI rehearsals. If Docker is unavailable, still implement the confirmed fix and executable runtime verification; report runtime cases NOT_RUN and return IMPLEMENTED_READY_FOR_HOSTED_MIGRATION_VERIFICATION. Do not require an unavailable local Docker pass before returning that specifically authorized fallback. A real image/database run, when available, must be recorded separately.

Return actual P11/T11/E11 identities, evidence-backed checklist, scope/pin comparison, commands/results, and remaining blockers. Do not publish, dispatch, auto-retry, accept v0.1, or start provider/publishing/v0.2 work. Keep application_acceptance=false, accepted version none, root awaiting_review, and stop for router/architect review.
