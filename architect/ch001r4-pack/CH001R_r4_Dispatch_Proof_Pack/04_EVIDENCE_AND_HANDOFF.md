# Evidence collection and architect handoff

## 1. Identity comes before conclusions

Record these identities separately. Their values may legitimately differ.

| Field | Meaning |
|---|---|
| `implementation_sha` | T3 requested by the dispatch and actually checked out/tested. |
| `implementation_tree` | T3's source tree; expected `2852c9a96595e9aca234aa30f449ec615a4b43bd`. |
| `workflow_definition_sha` | Commit W from which GitHub loaded the workflow definition. This can be E3/main, not T3. |
| `workflow_blob_sha` | Exact workflow-file blob used; compare with reviewed `4a1b045e4771901713a2ad00705a0a84c9ff1dab`. |
| `github_run_id` / `run_attempt` | The exact hosted execution and attempt. |
| `coordinator_run_id` | Expected `r3-<run_id>-<attempt>` for this workflow. |
| `job_ids` | Actual jobs belonging to the selected attempt. |
| `artifact_ids` | Actual retained upload(s), matched by name and selected execution. |
| `evidence_commit` | E4, if a later docs-only handoff commit is created. |

A run's `headSha` is not automatically the tested implementation: this workflow explicitly checks out its `implementation_sha` input. If main is E3, that distinction is expected. The displayed summary also has a known quoting defect. Require agreement among the dispatch input/receipt, exact-HEAD checkout check, `dispatch.txt`, `proof-result.json`, and suite/report identities. Do not accept a user-entered SHA field alone as proof of checkout.

Re-fetch workflow bytes at the actual W if main moved during dispatch. If the bytes differ from the reviewed workflow or the runner/scope changed, hold the result for a new source review rather than silently accepting it.

## 2. Retrieve one recorded execution

The following commands are examples for a run that actually exists. Supply the real numeric run ID and attempt; no IDs have been assigned by this packet.

```bash
set -euo pipefail
REPO='klole/reel-farm'
: "${RUN_ID:?Set RUN_ID to the exact observed numeric GitHub run ID}"
: "${ATTEMPT:?Set ATTEMPT to the exact observed run attempt}"
[[ "$RUN_ID" =~ ^[0-9]+$ ]]
[[ "$ATTEMPT" =~ ^[1-9][0-9]*$ ]]
OUT=$(mktemp -d "${TMPDIR:-/tmp}/ch001r4-evidence.XXXXXXXX")
ARTIFACT_NAME="ch001-live-proof-${RUN_ID}-${ATTEMPT}"

# Treat API responses/logs as private until sanitized; do not blindly commit them.
gh api "repos/$REPO/actions/runs/$RUN_ID/attempts/$ATTEMPT" > "$OUT/run.json"
gh api --paginate "repos/$REPO/actions/runs/$RUN_ID/attempts/$ATTEMPT/jobs?per_page=100" \
  --jq '.jobs[] | {id,name,status,conclusion,started_at,completed_at,html_url,steps}' \
  > "$OUT/jobs.jsonl"
gh api --paginate "repos/$REPO/actions/runs/$RUN_ID/artifacts?per_page=100" \
  --jq '.artifacts[] | {id,name,size_in_bytes,expired,created_at,expires_at,digest,workflow_run}' \
  > "$OUT/artifacts.jsonl"

# Run only once logs/artifacts exist; a missing artifact remains a real finding.
gh run view "$RUN_ID" --repo "$REPO" --attempt "$ATTEMPT" --log > "$OUT/job-output.private.log"
gh run download "$RUN_ID" --repo "$REPO" --name "$ARTIFACT_NAME" --dir "$OUT/public-evidence"
printf 'Evidence downloaded to: %s\n' "$OUT"
```

These commands use real run/attempt metadata and a matching named artifact. See official references D07–D09 and D12–D13 in [05_SOURCES.md](05_SOURCES.md). If an API/CLI capability differs on the operator's installed version, preserve the actual error and use an equivalent documented read. Do not guess an artifact URL or silently switch to another run.

Inspect artifact metadata before download: name, ID, timestamps, expiry and selected run association. On multiple attempts, do not use a prior attempt's similarly named upload. If raw archives are retained for transfer, also calculate their SHA-256. An artifact ZIP digest, a sample export ZIP digest, and each JPEG digest are different values; never substitute one for another.

## 3. Expected evidence, conditional on what actually executed

The r3 handoff describes public reports including `proof-result.json`, `environment.json`, `command-report.json`, `gate-results.json`, `verifier-result.json`, suite reports, `finding-dispositions.json`, `sanitization.json`, and `artifact-manifest.json`. The workflow additionally writes `dispatch.txt` before installing dependencies. Read their actual schema and contents; the list is not a claim that every file will exist after an early failure. [R05–R08, R11]

For a proof-ready result, the reports must demonstrate the assigned runtime path rather than just contain filenames. Check:

- final runtime image build and genuinely sandboxed worker start;
- empty-database migration and repeat invocation;
- real integration, authenticated E2E, and render suites with actual discovered/executed tests;
- the canonical seven-slide project created/edited through the application and reloaded from persisted data;
- actual final preview and application-generated ordered JPEG ZIP, with its post text and manifest;
- byte/hash equality between corresponding authenticated final-preview responses and exported JPEGs;
- actual alternate 4:5 output and expected decoded dimensions;
- worker stopped, request queued, worker restarted, completion observed, and completed artifact downloadable;
- recreation/restart preserving the same project/data/artifact rather than silently regenerating a substitute;
- screenshots, comparison records, and hashes referring to real produced files.

Use the original r3 assigned proof as the boundary. These are not newly added full-product tests. An existing code path, source-string scan, mocked response, skipped suite, or screenshot of a fixture-only page cannot stand in for the real application path.

Check the original 72 gate IDs are preserved exactly once. Their PASS/FAIL/NOT_RUN status must match actual evidence at the required level. A passing suite does not automatically prove every parent gate. Source-only gates may legitimately use E1 evidence; browser/lifecycle gates cannot borrow those passes.

`proof:ch001` success may coexist with incomplete full acceptance. `verifier-result.json` must not be edited to say full acceptance passed. Preserve strict `verify:ch001` behavior, historical ledgers, and all unexercised original gates.

## 4. Integrity and retrieval

Recompute the artifact manifest's declared hashes against actual files. Reject missing members, unsafe relative paths, duplicate conflicting names, symlinks pointing outside the package, unexplained executable content, or an identity mismatch. Do not execute scripts found in a downloaded artifact merely because they arrived from CI.

Inspect a real ZIP: exactly seven ordered JPEGs for the canonical demo, correct dimensions/order, readable post text and manifest, and no credentials or private filesystem paths. Compare the hash of each exported JPEG with the recorded preview-response hash. If preview bytes are included, independently hash those too. Distinguish a recorded test assertion from independently recomputing its result.

Do not demand bit-identical images across different operating systems or browser builds. The required equality is between preview and export for the same canonical render output within the tested run.

The inspected workflow requests **14-day artifact retention**. Save the actual `expires_at`; do not assume the artifact remains reviewable forever. Retain a sanitized durable copy or attach the actual evidence bundle to the review conversation before expiry. Do not publish a release merely to store evidence. If only a local path exists, label it local/unavailable remotely until a real attachment or retained artifact is supplied. [R05]

Treat all raw job logs and browser traces as private until reviewed. Never publish tokens, setup passwords, cookies, auth state, database connection strings, `.env` files, provider credentials, or ordinary user data. Retain the existing synthetic fixtures and public/private evidence separation.

## 5. Result interpretation

| Observed result | Correct follow-up |
|---|---|
| T3/E3 not on main or workflow absent | Publication/owner gate remains; no live-proof claim. |
| Dispatch refused | Capture sanitized error; resolve caller authorization or repository policy, not application code. |
| Dispatch response uncertain | Inspect existing runs; do not blindly double-submit. |
| Run exists, not complete | Record ID/attempt and pending status; no PASS claim. |
| Install/build fails before proof begins | Workflow/bootstrap failure; collect available logs. Do not invent proof reports. |
| Coordinator exit 2 / measured prerequisite missing | `BLOCKED_ENVIRONMENT`; show actual probe and runner class. |
| Coordinator exit 1 / live assertion fails | `LIVE_PROOF_FAILED`; identify first reproducible failure and dependent NOT_RUN cases. |
| Workflow says success but artifact/identity incomplete | `EVIDENCE_INVALID`; green status does not repair missing evidence. |
| Correct run, complete assigned proof, valid retrievable artifact | `LIVE_PROOF_READY_FOR_REVIEW`; root still awaiting review. |
| Bounded proof ready but some original gates incomplete | Return a precise remaining-gate list. Do not begin v0.2 or issue full acceptance. |

A tiny early `dispatch.txt` artifact is useful evidence of identity/entry into the job, not proof of a successful application journey. Conversely, an early failure before checkout may produce no artifact at all; job logs remain useful, but the result is not proof-ready.

## 6. Required final handoff template

Write this as an evidence-only result, replacing placeholders with actual observations. Do not prefill an unknown numeric identifier or command result.

```text
CH-001R-r4 — operational handoff
Task status: OWNER_ACTION_REQUIRED | DISPATCH_SUBMITTED_PENDING |
             BLOCKED_ENVIRONMENT | LIVE_PROOF_FAILED |
             EVIDENCE_INVALID | LIVE_PROOF_READY_FOR_REVIEW
Application acceptance: false
Root state: awaiting_review
Accepted version: none

Identity:
  T3 requested:
  T3 actually checked out:
  Implementation tree / tracked-tree cleanliness:
  Main before/after publication:
  E3 retained on main:
  Workflow-definition SHA W:
  Workflow blob / SHA-256:
  GitHub run URL / ID:
  Run attempt:
  Coordinator run ID:
  Job IDs / URLs:
  Artifact name / ID / expiry / actual retrieval reference:
  Evidence-only commit E4, if created:

Actual execution:
  Dispatch time UTC / actor / event / ref:
  Final workflow and proof-step conclusions:
  Coordinator command and exit:
  Install/build/migration/worker outcomes:
  Per-suite discovered/executed/passed/failed/skipped counts:
  Canonical UI / ZIP / preview-equality outcome:
  Alternate-format outcome:
  Worker/recreation lifecycle outcome:
  Known summary-quoting defect observed:

Evidence:
  Actual downloaded reports and screenshots:
  Sample ZIP, manifest and JPEG hashes:
  Artifact-integrity/sanitization checks actually performed:
  Missing/expired/unavailable files:
  Independent recomputations versus reporter assertions:

Original CH-001 ledger:
  PASS / FAIL / NOT_RUN totals and exact remaining IDs:
  No historical overwrites or inferred runtime passes:
  Full acceptance verifier result, or explicitly not run:

External actions:
  Actual repository pushes/ref updates:
  Actual dispatches/attempts:
  Credential changes performed by owner, without secret values:
  Actual cleanup limited to run-owned resources:
  No providers, social account authorization, billing,
  deployment, release/tagging, or v0.2 work:

Next decision requested:
  One specific owner action, or one narrowly evidenced repair,
  or review of the completed bounded proof. Then stop.
```

Unknown values remain `not observed`/`null`, not placeholders masquerading as completed evidence. If an E4 commit is created, return its SHA after commit creation rather than editing it into itself. Source-code fixes after this run require a newly identified test target and fresh applicable proof.

