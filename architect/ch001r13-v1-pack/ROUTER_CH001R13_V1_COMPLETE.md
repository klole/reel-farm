# CH-001R-r13-V1 — Complete router review and execution packet


---

<a id="doc-1"></a>

<!-- README.md -->

# CH-001R-r13-V1 — Router authorization for one hosted verification

Revision: **r1**. Issued: **2026-09-15T15:06:31Z**.

## Decision

**AUTHORIZE ONE FRESH T13 HOSTED VERIFICATION, subject to the immediate pre-submission checks below.**

Next executor: **the existing router**. Do not spawn Luna for another implementation chapter. This is the execution follow-through of CH-001R-r13, not r14, v0.2, a release, or application acceptance.

The scoped source review found both F13 repair mechanisms present and correctly connected. No additional dispatch-blocking source defect was identified in that review. The relevant live PostgreSQL, image, migration, cleanup, and downstream application obligations remain unverified. [S1–S8]

```text
application_acceptance=false
accepted_application_version=none
root_state=awaiting_review
next_actor=router
approved_implementation=6e04b5a5eefe2ef464572da35c88338fa342f525
authorization_scope=one_fresh_T13_workflow_dispatch
```

**This uses the original unspent T13 allowance; it does not create a second allowance.** T11/T12 permissions remain superseded. The T10/D1 request was already consumed and cannot be reused.

## Exact identities

| Item | Canonical value |
|---|---|
| P13 | `34be09f3a211aae01582270708b565b4a7cce539` |
| P13 tree | `634a57f4d33b83e8884abd71fe797a126dedb14b` |
| T13 implementation | `6e04b5a5eefe2ef464572da35c88338fa342f525` |
| T13 tree | `405a6ddc15d54ed7f9b31ce08c53af98afcd8cf8` |
| E13 / main returned during review | `d1ab7226b71e93235a9761f1432b6fb7be198609` |
| E13 tree | `77250fc98f4f3c35c91dec6e418690ddb3451360` |
| Workflow file | `.github/workflows/ch001-live-proof.yml` |
| Workflow blob at T13 and E13 | `35fa339aac2fcb024cd476ff38d87d27eb6482af` |
| Workflow SHA-256, recorded in pinned source evidence | `733643038bc7bc162265abf895e5348b1a0ca9039675740a77e0f5798b3efd2d` |
| Preserved lock SHA-256, recorded in source evidence | `77861bac2106333c55ea960422cd0b34bca86dc50db2b7806ad7581c3d975576` |

GitHub returned E13 as the direct child of T13 and T13 as the direct child of P13. P13 directly follows canonical E12 `b660df14eaed8892d6ce1b8c4d5fc70ce2bfad2d`. The P13→T13 comparison contains ten implementation files; the T13→E13 comparison contains evidence/handoff/state files only. [S9–S12]

## Read and execute

Read [the architect review](#doc-2), [router execution instructions](#doc-3), and [outcome/receipt rules](#doc-4). Use [the router prompt](#doc-5) and `router-receipt.template.json`. Source references are in [04_SOURCES.md](#doc-6).

The author has not submitted a workflow, sent an external message, changed repository files, or accepted the application. Pack delivery in this conversation is not workflow submission.


---

<a id="doc-2"></a>

<!-- 01_REVIEW_VERDICT.md -->

# Architect review — T13/E13 source publication

## Disposition

**SOURCE REVIEW SUFFICIENT FOR ONE CONTROLLED HOSTED VERIFICATION.**

This is not full acceptance of CH-001, not a claim that all r13 runtime requirements passed, and not certification that the application has no defects. The decision is narrowly that the two previously identified source blockers have been corrected sufficiently to use the already reserved hosted verification request. The first actual hosted outcome must return to the architect. [S1–S8]

## F13-01 — Explicit fixture database routing

The new Node-builtins-only command builder requires a nonempty database and user and puts them into separate `psql -d` and `-U` arguments. Its adapter requires the database argument. The existing main-path wrapper retains its `oss` default, while the marker-regression-local `runSetup` now requires both target strings explicitly. This distinction is intentional; the review did not mistake the main wrapper's preserved default for the fixture-local requirement. [S2, S3]

The actual table/schema privilege call now passes `fixtureDatabase, "oss"`. Role creation, database creation, connection grants, and cleanup run against the maintenance database. Fixture table creation, positive-row insertion, observer reads, and the denied-user check use the fixture database. This removes the reviewed accidental main-database ACL target without moving the main migration earlier or pre-creating its metadata. [S3]

The focused test source imports the real builder/adapter, observes `-d`/`-U`, tests omitted targets, demonstrates the wrong-database witness under both absent and existing main-table conditions, and retains a frozen T12 call-site witness. These are source-boundary tests with fakes; no successful PostgreSQL fixture is inferred from them. [S4]

**Disposition:** source correction supported; real fixture behavior and cleanup still require the fresh hosted run.

## F13-02 — Invocation-preserving evidence

The serializer retains the captured `invocationId`, exact command text, exits, timestamps, and distinct public log paths. It produces corresponding child-invocation records with run and implementation bindings. Finalization uses this serializer for both `command-report.json` and the evidence package supplied to validation. It does not deduplicate repeated SQL or alter the command text to make it appear unique. [S5, S6]

For r13, the validator requires the explicit `invocation-v2` format and checks invocation uniqueness, retrievable in-repository evidence, matching child records, run/implementation bindings, and duplicate log paths. Required-command validation evaluates every matching invocation, so an earlier or later successful invocation cannot conceal a failed one. Older report formats retain explicit legacy duplicate-text handling. The original application gate contract remains separate and strict. [S7]

The unit-test source exercises a complete synthetic evidence package with legitimate repeated command text, malformed identity/evidence cases, and both pass-then-fail and fail-then-pass required-command sequences. Source review supports the implementation; full execution of that repository suite was not repeated by the architect. [S8]

**Disposition:** source correction supported; repeated real database-query evidence and the final hosted manifest still require runtime inspection.

## Reported checks versus independently observed checks

Luna reports pinned Node 20.19.2 / pnpm 12.3.4 source qualification, actionlint 1.7.7, clean and hosted-like prefixes with 10 file-level modules and 85 nested cases, unit 24/24, security 4/4, and the real post-build DB-package import. The repair ledger is 9 PASS / 0 FAIL / 5 NOT_RUN. Local proof remains environment-blocked, with original application counts 4 PASS / 0 FAIL / 68 NOT_RUN. These remain Luna's reported local results, not fresh architect test results. [S1, S13, S14]

The architect independently inspected the two source fixes and their wiring/tests, commit parentage, changed-file comparisons, matching workflow blobs at T13/E13, and manual-run history. The query for manual runs created at or after 2026-09-15T10:39:29Z returned zero records during review. This is point-in-time evidence, not a lock on other actors and not proof that an unknown network request cannot be in flight. [S9–S12, S15, S16]

Additionally, two dependency-free T13 modules were copied into the review sandbox and independently matched to their Git blob identities before execution. Six isolated checks ran on **Node 22.16.0**, covering argument routing and serialization. All six passed. They used no database, Docker, application, or network, and they did not run the full TypeScript validator. They are supplemental checks, not the pinned repository suite or acceptance gates. See `evidence/source-copy-integrity.json`, `evidence/isolated-boundaries.tap`, and the included test-source text.

## Evidence precision note — not a dispatch blocker

The handoff says its local report retains actual repeated command text. The inspected local command array has nine entries with distinct command strings. It establishes the new record format and captured identities; repeat acceptance is currently demonstrated by the synthetic unit cases, not by a live local repeated-query journey. Preserve the historical handoff and carry this clarification into the router receipt rather than fabricating duplicate executions or starting another implementation chapter. [S1, S8, S17]

## Preserved boundaries

The implementation comparison does not modify package/lock, migration entrypoint/SQL, Dockerfile, Compose configuration, workflow, worker, or sandbox source. Retain all earlier package-resolution, observer, projection, verdict, and cleanup repairs. There is no authorization for AI/provider integrations, publishing, scheduling, analytics, billing, video, release/deployment, or v0.2 work. [S10, S12, S18]

No local PostgreSQL, migration, Docker stack, Chromium, full application test suite, or hosted job was run by the architect. A read-only local clone attempt failed on DNS; connected GitHub reads supplied the repository evidence. No repository write or workflow submission was made.


---

<a id="doc-3"></a>

<!-- 02_ROUTER_EXECUTION.md -->

# Router execution — CH-001R-r13-V1

## 1. Scope of authorization

Use the existing published **T13 `6e04b5a5eefe2ef464572da35c88338fa342f525`**. Do not create a T14, edit the app or harness, respawn Luna, repair Colima, or install a new Docker platform merely to repeat the known editing-host limitation. This packet authorizes the existing standard hosted route after the checks below.

Run only the existing manual `ch001-live-proof.yml`, with explicit `sandbox_qualification=true`. Existing non-root execution, exact-managed-browser qualification, run-owned policy cleanup, permissions, timeouts, evidence ownership, and isolated Compose resources remain unchanged. [S15]

This V1 packet is the router execution instruction for the **same one-request r13 budget**. It is not a new attempt, retry, or second permission on top of the r13 implementation packet.

## 2. Recheck publication without changing implementation

Resolve the live remote branch and record its full SHA. Verify the actual Git objects, not a copied abbreviated handoff:

```text
P13 = 34be09f3a211aae01582270708b565b4a7cce539
T13 = 6e04b5a5eefe2ef464572da35c88338fa342f525
T13 tree = 405a6ddc15d54ed7f9b31ce08c53af98afcd8cf8
E13 = d1ab7226b71e93235a9761f1432b6fb7be198609
E13 tree = 77250fc98f4f3c35c91dec6e418690ddb3451360
workflow blob = 35fa339aac2fcb024cd476ff38d87d27eb6482af
workflow SHA-256 = 733643038bc7bc162265abf895e5348b1a0ca9039675740a77e0f5798b3efd2d
```

Verify T13's parent is P13 and E13's parent is T13. Verify T13 is an ancestor of the current `origin/main`. The checked-out implementation for proof must be **T13**, not E13 and not a later packet commit.

Compare T13→E13: evidence/state/handoff only. If main has advanced after E13, allow only clearly identified documentation/receipt/packet progress with no executable change. Do not erase that progress. Unexpected app, test, workflow, package, or runtime changes require a return to review, not a reset or an opportunistic dispatch.

Check the workflow blob at T13, E13, and the current dispatch definition candidate. Independently compute the SHA-256 of the exact workflow bytes using the approved existing toolchain. All must match the values above. Validate the complete publication workflow with the already approved pinned actionlint 1.7.7 route. Preserve the validator result and input hash; do not rely on generic YAML parsing or copy another candidate's PASS.

Inspect the source-bound T13 clean/hosted-like prefix evidence and source checks in E13. Confirm final implementation/tree binding and retrievable logs. Runtime NOT_RUN caused by the known Docker-less editing host is explicitly allowed here. Do not demand an already successful local migration before using the hosted environment intended to verify it.

The implementation delta and local findings are described in the review. The existing package/lock, migrations, Docker/Compose, sandbox, and workflow are frozen. For proof context, the recorded lock SHA-256 is `77861bac2106333c55ea960422cd0b34bca86dc50db2b7806ad7581c3d975576`; no installation may silently rewrite it.

## 3. Establish the request has not already been spent

Check the router's durable request ledger and all relevant manual runs since the r11/r12/r13 publication period. Do **not** filter exclusively by E13 as a run head: workflow definition and implementation checkout are separate identities, and a later documentation commit can be the definition head. The read-only architect query returned zero runs, but the router must recheck immediately before its own action.

If any T13 submission is queued, running, completed, failed, cancelled, or ambiguous, do not submit another. Inspect and report the existing outcome. If an unauthorized superseded T11/T12 run has appeared, return that fact for review rather than adding a concurrent request.

The following historical records are read-only: `34665615514`, `34669975078`, `34671716094`, `34675672523`, `34676862756`, `34678495442`, `34928718810`, `34937329430`, and `34946892709`. Do not rerun, resume, delete, or rewrite them. Do not dispatch old implementation SHAs.

Coordinate a single router owner. Persist an intended-request receipt with UTC time, exact T13 input, current definition head, workflow hash, request-history evidence, and `submission_started=false`. When submission begins, mark that fact. An uncertain network response is **not** permission to resend. Resolve it by read-only inspection and return the ambiguity if necessary.

## 4. Submit exactly once after successful checks

The router may now deliberately execute this command once. It has not been executed by the architect:

```bash
gh workflow run ch001-live-proof.yml \
  --repo klole/reel-farm \
  --ref main \
  -f implementation_sha=6e04b5a5eefe2ef464572da35c88338fa342f525 \
  -f sandbox_qualification=true
```

Only these two workflow inputs are supported. Record purpose `verify_fixture_database_binding_and_invocation_evidence` in the receipt, **not** as a new workflow input. `--ref main` selects the workflow definition; `implementation_sha` selects the source that the workflow checks out. [P1, P2, S15]

A submission rejection is recorded and returned. No automatic reattempt, amended workflow, or replacement candidate is authorized. A CLI success only establishes request submission, not migration or proof success.

## 5. Observe the one outcome

Monitor only the identified fresh run. Record run ID, attempt, job ID, event, actual definition SHA, actual checkout SHA/tree, workflow blob/hash, runner class, and existing bootstrap/sandbox outcomes. Bind the result to actual checkout T13, not just to a command-line intention.

Allow the existing bounded coordinator to execute and finalize its own diagnostics and cleanup. The router must not patch code inside the runner or alter the outcome to turn a red result green. No second dispatch follows either success or failure.

When the coordinator stops, inspect the layers in order:

1. **Bootstrap and sandbox:** actual captured statuses; no borrowing a prior run's PASS.
2. **Image import:** effective CLI/child/retained-container verdict, with real image/process identity; import PASS is not SQL PASS.
3. **PostgreSQL marker regression:** fixture database target, absent/legacy/empty/positive/denied observations, actual expected error class, and fixture cleanup. Confirm the ACL command connects to the fixture database, not `oss`.
4. **Application migration:** fresh precondition, shipped fresh migration, expected schema and single completion row, same-data sentinel, repeat, and restricted-role failure/no false marker. Check inspected CLI/container exits rather than a green wrapper step.
5. **Evidence and cleanup:** repeated commands with distinct captured invocation IDs and retrievable logs, matching child records, useful pre-deletion state, run-owned cleanup, and final manifest integrity.
6. **Downstream only if reached:** worker/browser readiness, integration/E2E/render, slideshow/ZIP/preview hashes, and lifecycle. A later failure does not erase earlier measured migration results.

A raw nonzero expected-negative command can be correct test evidence only when its enclosing assertion verifies the expected failure and state. Preserve it; do not relabel all nonzero commands as infrastructure failures, and do not hide unexpected nonzero exits.

Use the result matrix in `03_OUTCOME_AND_RECEIPT.md` and stop for architect review. Even a successful bounded proof leaves application acceptance false.


---

<a id="doc-4"></a>

<!-- 03_OUTCOME_AND_RECEIPT.md -->

# Outcome capture and stop rules

## Separate the conclusions

| Actual outcome | Router interpretation | Next action |
|---|---|---|
| No submission because a precheck failed or prior request was found | Not a new hosted result; record the exact blocker or existing request | Return evidence; do not submit another request |
| Request rejected or response ambiguous | Submission result only; run/job/proof fields remain null unless verified | Resolve by read-only inspection; no automatic resend |
| Bootstrap or sandbox stops before proof | Record actual classification and `proof_invoked=false` when supported | Preserve available artifact; return, no application verdict |
| Proof runs but marker fixture/import/migration fails | Preserve first relevant stage and measured child/container evidence | Return the specific failure; no generic redesign or retry |
| Migration verifies but worker or application later fails | Migration outcome and downstream failure are separate | Retain migration receipt; return first downstream blocker |
| Bounded proof succeeds | Candidate runtime evidence is ready for architect review | Preserve full artifacts; do not accept v0.1 or start v0.2 |
| Cleanup or evidence validation fails | Record alongside, not instead of, the primary outcome | No successful-complete claim; preserve useful diagnostics |

Do not assume that the “Execute bounded live proof” Actions step being green means the child proof passed. The existing workflow captures the child result and enforces it later. Use `ci-result.json`, `proof-result.json`, the actual child exit, and the job conclusion together.

## Required evidence, when produced

Preserve the run's actual files, including `bootstrap/public/ci-result.json`, sandbox qualification/cleanup records, `module-import-verification.json`, `migration-marker-regression.json`, `migration-verification.json`, `command-report.json`, `gate-results.json`, `verifier-result.json`, `compose-startup-state.json`, `compose-cleanup.json`, `migration-container-cleanup.json`, `proof-result.json`, `artifact-manifest.json`, and associated public logs.

If reached, preserve the application-generated ZIPs, screenshots, preview/export hash evidence, and lifecycle records. Do not generate substitute application evidence merely to fill missing filenames after an earlier stop. A missing report has a null observation, not the preceding local report's values.

Keep the workflow's existing legacy `r4` path prefix and other historic internal stage labels. Run/commit identities determine provenance; cosmetic renaming is not this assignment.

## Archive verification and durable receipt

Download the actual Actions artifact through the existing authorized account. Record API-listed ID, name, size, digest, expiry if returned, and the measured ZIP SHA-256 and size. Preserve the original ZIP bytes unchanged. Confirm archive integrity and reject unsafe member paths or ambiguous duplicate members before extracting a review copy.

Map the artifact's actual common root to the report's repository-relative paths explicitly. Verify every manifest-listed payload hash/size and the referenced public logs. Do not silently choose a same-named suffix from a different run. Records intentionally excluded to avoid circular hashes must remain identified as such; do not claim they are payload-bound when they are not.

Verify that the public publication contains no private raw inspection, environment files, credentials, cookies, or auth storage. If an unsafe payload is discovered, hold public publication, retain the original securely for its owner, and report the issue without posting the secret. Do not mutate the original ZIP and call the altered bytes the GitHub artifact.

Publish only evidence/receipt/handoff changes under the established repository process, preferably `docs/evidence/CH-001R-r13-V1/` and a corresponding router handoff. Do not rewrite E13's historical local ledger or old artifacts. Preserve unrelated concurrent documentation. Bind the new receipt to actual T13, the actual workflow definition, and the actual run.

Keep local source results, supplemental architect checks, hosted results, and the original application-gate ledger separate. In particular, the reviewed local array has nine distinct command strings: real repeated-query evidence must come from the new runtime, not from relabeling that local array.

Avoid self-referential commit/hash claims: a receipt cannot contain its own as-yet-uncreated commit SHA or form a circular manifest digest. Return the evidence commit externally after committing, or bind it with a separate subsequent receipt without claiming self-hash closure.

## Final router message

Return the assignment, `sent` scope, request count, verified T13 and definition identities, UTC submission/settlement times, run/attempt/job, actual bootstrap/proof/migration/downstream classifications, first failure and secondary failures, cleanup outcome, artifact identity and integrity, and evidence commit. Include the new run's application-gate counts only if that run emitted them.

Use separate fields for packet delivery, evidence push, external message send, Luna spawn, and workflow submission. A Git push is not a chat send. A received update is not an agent spawn.

In every outcome:

```text
application_acceptance=false
accepted_application_version=none
root_state=awaiting_review
next_action=architect_review_of_actual_T13_outcome
```

Then stop. No code repair, provider work, release/tag, automatic acceptance, second dispatch, or historical rerun is authorized by this verification packet.


---

<a id="doc-5"></a>

<!-- ROUTER_START_PROMPT.md -->

# Router starting prompt — CH-001R-r13-V1

Execute **CH-001R-r13-V1-r1** as the router-only runtime follow-through of r13. Do not spawn Luna or create another implementation chapter.

The architect's scoped review permits spending the **existing one unspent T13 hosted request**, after the packet's publication, source-evidence, workflow-validation, and request-history checks. Approved T13 is `6e04b5a5eefe2ef464572da35c88338fa342f525` (tree `405a6ddc15d54ed7f9b31ce08c53af98afcd8cf8`); reviewed E13 is `d1ab7226b71e93235a9761f1432b6fb7be198609` (tree `77250fc98f4f3c35c91dec6e418690ddb3451360`). The workflow must retain blob `35fa339aac2fcb024cd476ff38d87d27eb6482af` and SHA-256 `733643038bc7bc162265abf895e5348b1a0ca9039675740a77e0f5798b3efd2d`.

Read the complete packet. Verify no prior, concurrent, or ambiguous T13 request exists; T11/T12 permissions are superseded and all earlier hosted records remain read-only. Confirm the publication workflow with pinned actionlint and preserve both definition and checkout identities. Record an intended-request receipt, then deliberately submit **one** existing `ch001-live-proof.yml` request on `main` with only `implementation_sha=6e04b5a5eefe2ef464572da35c88338fa342f525` and `sandbox_qualification=true`. Purpose `verify_fixture_database_binding_and_invocation_evidence` belongs in the receipt, not a new workflow input.

Capture the actual bootstrap, final-image import, PostgreSQL fixture routing/negative controls, fresh/schema/repeat/sentinel/permission-failure, invocation evidence, cleanup, artifact integrity, and downstream outcomes. Preserve the original ZIP and API digest. Do not claim a migration from import-only success or erase a migration PASS because a later worker stage fails. A green wrapper step is not a child proof verdict.

No source edits, Colima repair, hosted retry, historical rerun, provider work, release, or automatic acceptance. Report the real result and evidence commit, keeping `application_acceptance=false`, accepted version `none`, and root `awaiting_review`. Then stop for architect review. A precheck or ambiguous submission blocks action rather than granting another attempt.


---

<a id="doc-6"></a>

<!-- 04_SOURCES.md -->

# Sources and verification boundary

Repository sources were read through the connected GitHub tool on 2026-09-15. Except S16, commit-pinned URLs identify the reviewed material. Main was separately queried and returned E13. Reported checks are attributed to the handoff; only the six isolated checks and document/integrity checks in this packet were executed by the architect.

A retrieved Git blob SHA identifies the whole file even when only the named line range was read. Do not infer that every file in the repository was audited. Only the two copied dependency-free modules were independently rehashed against their Git blob identities in this review. The workflow SHA-256 and lock hash remain recorded source-evidence values for the router to recompute; matching workflow blob IDs were directly checked at both commits.

- **S1 — r13 handoff:** https://github.com/klole/reel-farm/blob/d1ab7226b71e93235a9761f1432b6fb7be198609/handoffs/CH-001R-r13.md; Git blob `5c5706e1b6c53a36bff0ec5ae7d9454aa6c91e27`.
- **S2 — explicit migration command builder/adapter:** https://github.com/klole/reel-farm/blob/6e04b5a5eefe2ef464572da35c88338fa342f525/scripts/ch001-migration-command.mjs; Git blob `ab09537b92b813d06e41062bf947a761c0a3082f`.
- **S3 — proof SQL adapter and fixture routing, inspected source lines 650–920:** https://github.com/klole/reel-farm/blob/6e04b5a5eefe2ef464572da35c88338fa342f525/scripts/ch001-proof.ts; Git blob `61a34712b878f746dad24f744e4230b443ee7dd9`.
- **S4 — routing/negative-witness tests:** https://github.com/klole/reel-farm/blob/6e04b5a5eefe2ef464572da35c88338fa342f525/tests/ci/migration-regression-boundary.test.mjs; Git blob `d60f451313ed2ed899f0328afecc957703c69309`.
- **S5 — invocation serializer:** https://github.com/klole/reel-farm/blob/6e04b5a5eefe2ef464572da35c88338fa342f525/scripts/ch001-command-records.mjs; Git blob `b667f4c2742a6c90a75b6f0b7b090c20ca5916bb`.
- **S6 — proof final serializer/verifier wiring, inspected lines 1300–end:** https://github.com/klole/reel-farm/blob/6e04b5a5eefe2ef464572da35c88338fa342f525/scripts/ch001-proof.ts; Git blob `61a34712b878f746dad24f744e4230b443ee7dd9`.
- **S7 — command validator and retained gate validation:** https://github.com/klole/reel-farm/blob/6e04b5a5eefe2ef464572da35c88338fa342f525/scripts/ch001-harness.ts; Git blob `03cb94357b8a1fd701360e51020a6c5a44a4bc0e`.
- **S8 — verifier test source, inspected beginning through new r13 cases:** https://github.com/klole/reel-farm/blob/6e04b5a5eefe2ef464572da35c88338fa342f525/tests/unit/verifier.test.ts.
- **S9 — canonical E13 commit and parent:** https://api.github.com/repos/klole/reel-farm/git/commits/d1ab7226b71e93235a9761f1432b6fb7be198609.
- **S10 — P13 to T13 changed-file comparison:** https://api.github.com/repos/klole/reel-farm/compare/34be09f3a211aae01582270708b565b4a7cce539...6e04b5a5eefe2ef464572da35c88338fa342f525.
- **S11 — canonical T13 and parent; P13 and parent:** https://api.github.com/repos/klole/reel-farm/git/commits/6e04b5a5eefe2ef464572da35c88338fa342f525.
- **S12 — T13 to E13 evidence-only comparison:** https://api.github.com/repos/klole/reel-farm/compare/6e04b5a5eefe2ef464572da35c88338fa342f525...d1ab7226b71e93235a9761f1432b6fb7be198609.
- **S13 — r13 repair checklist:** https://github.com/klole/reel-farm/blob/d1ab7226b71e93235a9761f1432b6fb7be198609/docs/evidence/CH-001R-r13/r13-results.json; Git blob `d685fa32abfaaf53a79bc000514f3fd913794579`.
- **S14 — reported command matrix:** https://github.com/klole/reel-farm/blob/d1ab7226b71e93235a9761f1432b6fb7be198609/docs/evidence/CH-001R-r13/commands.md; Git blob `cd8aae202119c8c1ca52b08ec13894ce23ce66f3`.
- **S15 — workflow header/input schema and full blob identity at T13 and E13:** https://github.com/klole/reel-farm/blob/6e04b5a5eefe2ef464572da35c88338fa342f525/.github/workflows/ch001-live-proof.yml; Git blob `35fa339aac2fcb024cd476ff38d87d27eb6482af`.
- **S16 — point-in-time manual-run query; returned zero records:** https://api.github.com/repos/klole/reel-farm/actions/runs?event=workflow_dispatch&created=%3E%3D2026-09-15T10%3A39%3A29Z&per_page=100.
- **S17 — local command array and beginning of child records, inspected lines 1–155:** https://github.com/klole/reel-farm/blob/d1ab7226b71e93235a9761f1432b6fb7be198609/docs/evidence/CH-001R-r13/local-proof/artifacts/ch001r13/r13-local-20260915c/public/command-report.json; Git blob `f623f248aed5b75eb8b8d0f314941f66ba141e87`.
- **S18 — scope/frozen-surface record:** https://github.com/klole/reel-farm/blob/d1ab7226b71e93235a9761f1432b6fb7be198609/docs/evidence/CH-001R-r13/scope-comparison.json; Git blob `176b06ba472945ca8b652b165de63a576d70780c`.
- **P1 — official GitHub CLI workflow dispatch syntax:** https://cli.github.com/manual/gh_workflow_run.
- **P2 — official manual-workflow guidance:** https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow.

P13 parentage was separately read at `https://api.github.com/repos/klole/reel-farm/git/commits/34be09f3a211aae01582270708b565b4a7cce539`. Main query: `https://api.github.com/repos/klole/reel-farm/git/ref/heads/main`.

The official CLI documentation confirms `gh workflow run` submits a manual event, accepts `-f` inputs, and uses `--ref` for the workflow definition branch/tag. GitHub's manual-run guidance requires the workflow-dispatch configuration on the default branch. These documentation facts explain the request command; they are not evidence that any request was sent.


---

## Receipt template

```json
{
  "schema_version": 1,
  "record_kind": "ROUTER_HOSTED_VERIFICATION_RECEIPT_TEMPLATE",
  "assignment": "CH-001R-r13-V1",
  "authorization_revision": "r1",
  "purpose": "verify_fixture_database_binding_and_invocation_evidence",
  "application_acceptance": false,
  "accepted_application_version": "none",
  "root_state": "awaiting_review",
  "source": {
    "expected_t13": "6e04b5a5eefe2ef464572da35c88338fa342f525",
    "expected_t13_tree": "405a6ddc15d54ed7f9b31ce08c53af98afcd8cf8",
    "reviewed_e13": "d1ab7226b71e93235a9761f1432b6fb7be198609",
    "reviewed_e13_tree": "77250fc98f4f3c35c91dec6e418690ddb3451360",
    "expected_workflow_blob": "35fa339aac2fcb024cd476ff38d87d27eb6482af",
    "expected_workflow_sha256": "733643038bc7bc162265abf895e5348b1a0ca9039675740a77e0f5798b3efd2d",
    "publication_head_at_submission": null,
    "actual_checkout_sha": null,
    "actual_checkout_tree": null,
    "actual_definition_sha": null,
    "actual_workflow_blob": null,
    "actual_workflow_sha256": null
  },
  "prechecks": {
    "publication": "NOT_RUN",
    "source_evidence": "NOT_RUN",
    "pinned_workflow_validation": "NOT_RUN",
    "request_history": "NOT_RUN",
    "concurrent_request_resolved": null,
    "observed_prior_t13_request_count": null,
    "history_query_utc": null
  },
  "request": {
    "budget_scope": "original single T13 allowance shared with r13 implementation packet",
    "maximum_submissions": 1,
    "submission_started": false,
    "submission_started_utc": null,
    "submission_count_this_execution": 0,
    "verified_total_t13_submission_count": null,
    "response": null,
    "ambiguous": null,
    "run_id": null,
    "run_attempt": null,
    "job_id": null,
    "settled_utc": null
  },
  "hosted": {
    "run_conclusion": null,
    "bootstrap_status": null,
    "host_sandbox_status": null,
    "proof_invoked": null,
    "proof_exit_code": null,
    "classification": null,
    "proof_status": null,
    "module_import_status": null,
    "marker_observer_status": null,
    "fixture_acl_database": null,
    "fresh_migration_status": null,
    "fresh_cli_exit": null,
    "fresh_container_exit": null,
    "schema_status": null,
    "marker_count": null,
    "repeat_status": null,
    "repeat_cli_exit": null,
    "repeat_container_exit": null,
    "sentinel_preserved": null,
    "permission_control_status": null,
    "migration_qualified": null,
    "worker_readiness_attempted": null,
    "downstream_status": null,
    "first_failure": null,
    "secondary_failures": [],
    "application_gate_counts": null
  },
  "evidence": {
    "command_record_format": null,
    "distinct_invocation_ids_verified": null,
    "repeated_command_evidence": [],
    "required_command_failure_preservation": null,
    "cleanup_status": null,
    "remaining_owned_resources": null,
    "artifact_id": null,
    "artifact_name": null,
    "api_size": null,
    "api_sha256": null,
    "measured_size": null,
    "measured_sha256": null,
    "zip_integrity": null,
    "payload_manifest_verification": null,
    "public_content_review": null,
    "original_archive_path": null,
    "receipt_path": null,
    "evidence_commit_returned_separately": true
  },
  "external_actions": {
    "packet_delivered_to_router": null,
    "evidence_pushed": false,
    "external_message_sent": false,
    "luna_spawned": false,
    "workflow_submission": false,
    "historical_reruns": 0,
    "application_source_modified": false
  },
  "next_action": "architect_review_of_actual_outcome",
  "blockers": []
}
```
