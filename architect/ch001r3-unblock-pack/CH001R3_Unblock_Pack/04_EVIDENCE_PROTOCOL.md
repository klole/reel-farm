# Evidence protocol and exit semantics

## 1. Two different questions

**Live proof:** did the bounded CH-001R-r3 workflow actually run and produce the required artifacts and lifecycle observations?

**v0.1 acceptance:** are all 72 original gates fully supported, required manual/visual reviews complete, and blocking findings closed or disproved?

A PASS for the first question must not be represented as a PASS for the second. This distinction fixes the planning sequence; it does not create a waiver for any parent requirement.

## 2. Run identities

Record a full implementation SHA T3 after application, test, coordinator, dependency and workflow changes are committed. Run against that committed source. If a failing live test requires another code change, commit a new T and rerun affected proof; do not relabel old output as evidence for the new code.

A new evidence/handoff commit E3 may then add documentation and sanitized proof references. Preserve historical r1/r2 reports. Since a commit cannot conveniently contain its own final hash, record T3 inside the reports; resolve and return E3 after commit creation. The handoff or external response supplies E3. Do not repeatedly amend E3 merely to insert its own hash.

When docs-only changes separate the checked-out SHA and the application T, record both and verify the actual diff/tree identity. Never trust `CH001_IMPLEMENTATION_COMMIT` simply because an environment variable contains a 40-character string.

Record a unique run ID, every child invocation ID, checkout SHA, workflow-definition SHA, relevant source-tree digest/clean status, UTC timestamps, OS/arch, image IDs/digests, Node/pnpm, Playwright and actual browser versions. No report from a different invocation can replace an earlier failure with the same filename.

## 3. Proposed outputs

Use `artifacts/ch001r3/<run-id>/private/` for raw execution files and `artifacts/ch001r3/<run-id>/public/` for reviewed/sanitized deliverables. The CI artifact uploads only the latter. Raw `.env`, auth storage state, cookies and setup requests must never be uploaded by wildcard.

The public packet should contain:

- `proof-result.json`: profile, scope, actual verdict/exit, T3, run identity, and required-step outcomes;
- `command-report.json`: command, argv without secrets, timestamps, exit, suite report path and hash;
- real Vitest/Playwright suite reports and sanitized logs with discovered/executed/pass/fail/skip counts;
- `environment.json`: measured non-secret runtime/container/browser facts;
- `lifecycle.json`: before/after identities, same-data/hash assertions, worker-down and restart transitions;
- `a-little-room-to-focus.zip` plus extracted `manifest.json`/`post.txt` for easy inspection;
- the alternate 4:5 output and actual dimension checks;
- `journey-hashes.json`: full project/revision/render/slide identities and preview-versus-ZIP equality, dimensions and hashes;
- real screenshots: populated editor, final preview, alternate-format output, and worker-down/queued state;
- a fresh `gate-results.json` covering exactly the original 72 IDs with evidence-specific PASS/FAIL/NOT_RUN;
- `finding-dispositions.json`: original R01–R11 and new U01–U08, with actual tests or remaining gaps;
- a sanitization record and `artifact-manifest.json` listing existing public files with SHA-256 hashes;
- optional actual visual/keyboard review records, explicitly identifying who/what performed the inspection.

No original font binaries are included in this architect packet or its reference files. Application fixture fonts should follow the repository's dependency/license process; do not obtain or redistribute font files from the architect's environment.

## 4. Reporter rules

A test result is not a gate result until it covers that gate's full text and all required evidence kinds. A SQL fixture transaction does not prove the production transaction function. A live web heartbeat does not prove data survives a restart. Saving an image hash in JSON does not prove it matches a valid authenticated JPEG response unless that equality was asserted.

Preserve all three statuses. Do not turn FAIL into NOT_RUN when loading the ledger. Do not retain a previous PASS for a newly unexecuted run. Use per-case identities and a merge that preserves multiple evidence contributions. A source review must identify the actual relevant files/checks; one generic string scan cannot sign every E1 gate.

Paths must be relative to a defined evidence/repository root after validation. Resolve real paths to prevent symlink escape. Normalize inside-root absolute paths at the writer boundary if accepted by its contract; retain rejection of outside-root paths. Missing, malformed, contradictory or stale evidence must fail validation, not be treated as an optional file.

Read raw reporter results and compare their counts/statuses with the summary. Validate suite run IDs, child invocation IDs, source identities and timestamps. A zero-test run, test import error, or skipped required case cannot produce a proof PASS.

## 5. Separate commands

### `pnpm proof:ch001` — new, bounded execution profile

- Exit `0`: all **assigned live-proof** steps and artifact checks passed, with a real app ZIP and basic lifecycle evidence.
- Exit `1`: an assertion, setup implementation, report, sanitization or artifact failure occurred.
- Exit `2`: a measured external prerequisite or execution permission is genuinely unavailable.

A proof exit 0 is explicitly labeled `LIVE_PROOF_READY_FOR_REVIEW`, with `application_acceptance: false`. It need not imply the 72-gate verifier is green.

### `pnpm verify:ch001` — original complete acceptance command

Keep it strict: it must remain nonzero whenever a mandatory gate is FAIL/NOT_RUN, required inspection is absent, a blocking finding is open, or evidence is invalid. Never alias this name to the smaller proof profile. Never use `requireCompleted: false` to obtain a full-acceptance success.

It may reuse immutable, validated per-run suite results rather than repeating expensive tests solely to generate manual-evidence loops. Such collection must verify T/run/artifact identity and freshness. Support a clearly named report-collection mode if needed. It must not invent command executions or silently skip required commands.

**Expected r3 outcome:** limited proof may succeed while full CH-001 remains incomplete because later security/concurrency/recovery/manual gates are open. Report that plainly. Do not use `|| true` or `continue-on-error` to paint full acceptance green.

## 6. Finalization order and non-circular hashes

Execute tests and write stable raw results. Sanitize copies to final public paths. Generate inspections referencing those exact artifacts. Assemble the ledger and command/finding summaries from those stable records. Build a manifest over an explicit payload allowlist; exclude the manifest itself and its verifier output. Validate the payload and manifest. Finally write the verifier result referencing the manifest hash. Do not mutate files after hashing them.

Avoid the reviewed behavior of scanning an existing directory that may contain previous results and then overwriting those results after hashing. Use fresh run directories and deterministic finalization. Keep manual reviews bound to the same artifact bytes; do not rerender after inspection and reuse the old signoff.

For CI, record actual run/job/artifact IDs, artifact name, download link/reference, artifact hash and expiry/retention. Artifacts are not permanent archival storage. Before expiry, preserve the approved small synthetic evidence set or a durable retrievable copy in accordance with repo policy. Never invent a future Actions URL.

## 7. Review and acceptance

No agent signs as Kyle or a human reviewer. Report automated checks as automated and an actual agent image inspection as agent-performed. A screenshot existing is not a visual review. This architect can review supplied images in a subsequent turn; that future possibility is not current evidence.

The historical submitted r2 ledger remains 4 source-only PASS / 0 FAIL / 68 NOT_RUN, as reported. New source findings are not retroactively fabricated runtime FAIL entries. In the new run, a measured failure must be recorded as FAIL and retain its exact failed step.

Root state: `awaiting_review`. Accepted application version: `none`. Only a separate architect decision can accept v0.1 after the unchanged contract is met.
