# R9 acceptance and evidence contract

## Three different acceptance levels

**Local repair readiness** means R9-T01 through R9-T12 are supported by actual evidence against T9. **Hosted repair outcome** is the result of a separately authorized fresh T9 run and artifact inspection. **Application acceptance** still requires the original CH-001 contract and an architect decision; neither of the first two levels grants it.

Do not require all 72 application gates to pass as a condition of handing off this small bootstrap repair. Equally, do not mark them PASS merely because the repair tests pass. A fresh proof ledger exists only if the coordinator actually produces one.

## Checklist (do not replace original gate IDs)

| ID | Required check and evidence |
|---|---|
| R9-T01 | Read-only historical receipt: correct T8/E8, hosted run/job, actual artifact ID, archive SHA-256/length, and no inherited hosted gate counts. |
| R9-T02 | Historical negative control: exact T8 caller yields a relative report path and the real contract rejects it; original hosted failure bytes remain unchanged. |
| R9-T03 | Real corrected caller step succeeds with the original relative job-level report root; real inner attestation and outer recorded stage agree. |
| R9-T04 | Quoted spaces and already-absolute report bases work; helper and recorder consume one identical target located beside the correct outer report. |
| R9-T05 | Missing, empty, multiline, and otherwise invalid explicit report inputs reject; no fallback to a guessed current/home directory. Preserve optional null/no-report semantics. |
| R9-T06 | Early rejection is side-effect-free: no download/tool execution, no tool directory creation, no command-file modification, no false PASS attestation. Use explicit spies/sentinels for failure-only tests. |
| R9-T07 | Failure propagation: helper nonzero cannot be erased by successful recording; report I/O failure remains nonzero; uninvoked proof is false/null. No stale prior attestation can satisfy success. |
| R9-T08 | Clean and hosted-like source-bound prefixes use exact final workflow bodies/raw environment forms, independent no-node_modules checkouts, real actionlint, outer reporter, and isolated command files. |
| R9-T09 | Complete prior r4–r8 regression suite plus new tests executes with nonzero counts, zero failures/skips; deleted fixture variables do not reappear and parent files are unchanged. |
| R9-T10 | Actual pinned actionlint accepts complete final workflow and still rejects the historical invalid T6/other semantic-negative controls for their intended reasons. No actionlint-regression suppression. |
| R9-T11 | Scoped final commands pass: frozen install, syntax, workflow lint, CI, lint, typecheck, build, unit, security, diff. Frozen source/pin surfaces are compared and unchanged. |
| R9-T12 | Final source identities, raw logs, prefix/body hashes, artifacts, and safe evidence are committed or durably attached; current state remains awaiting_review, not accepted. |
| R9-T13 | Router independently confirms T9/E9 publication ancestry, W9 exact bytes, source-bound preflight, and no execution-affecting post-test delta. |
| R9-T14 | Only if manually authorized: one fresh T9 request, selected by input/definition/actual checkout, settled actual stages, downloaded artifact integrity, and honest sandbox/proof/cleanup results. |

R9-T13/T14 may legitimately be NOT_RUN in Luna's pre-publication handoff. Hosted R6 sandbox checks and original CH001 gates remain separate. If a fresh run fails later, record that specific outcome and stop rather than widening r9.

## Prefix execution record

For each mode provide `prefix-clean.json` or `prefix-hosted-like.json` with: T9 and tree; workflow path and SHA-256; exact named step IDs and source-body hashes; actual cwd; pinned Node version; no-node_modules check; raw CI report/evidence path values; resolved absolute actionlint report target; same target passed to helper and recorder; actionlint expected/measured archive and executable digests and observed version; tool cache/download source; child command exit codes; real complete test counts; inner and outer report paths/hashes; command-file sentinel comparisons; proof/policy tree absence; and precise unavailable checks.

This record must be generated from execution, not hand-filled with optimistic values. Commit the runner/rehearsal script so another reviewer can repeat it. A source manifest is not itself evidence that commands ran.

## Minimum final commands

```text
syntax checks for changed Node and Bash files
pnpm install --frozen-lockfile
pnpm lint:workflow
pnpm test:ci
source-bound clean prefix at T9 without node_modules
source-bound hosted-like prefix at T9 without node_modules
pnpm lint
pnpm typecheck
pnpm build
pnpm test:unit
pnpm test:security
git diff --check
```

Use the actual reproducible prefix command chosen in implementation, not this descriptive text in the command-result record. Pin Node `20.19.2`, pnpm `12.3.4`, and existing tool versions. The architect's Node v22 reference diagnostic does not substitute for these results.

## Evidence location and preservation

Create `handoffs/CH-001R-r9.md` and `docs/evidence/CH-001R-r9/`, including the checklist, raw commands, source-bound prefix evidence, frozen-source comparison, and a historical hosted receipt. Update the top/current section of `state/PROJECT_STATE.md` and `state/EVIDENCE_INDEX.md`. Mark all older “next actions” historical; the current r9 router rules take precedence without rewriting earlier outcomes.

Use E9 for evidence/state-only changes after tested T9. Do not claim E9's full SHA inside the very file determining that SHA; return it after commit. Check `git check-ignore` for logs/artifacts and ensure promised evidence is actually present in the final committed or attached package, not just a transient `/tmp` path.

Retain the original T8 ZIP unchanged, with a separate inspection/receipt. Do not rename internal archive members or alter captured status fields. Never include credentials, environment dumps, auth storage, cookies, or real command-file contents. The historical artifact contains a cleanup-generated NOT_RUN sandbox report; do not promote it to a qualification result.

## Hosted result schema

After any authorized new run, distinguish `dispatch_submitted`, `request_accepted`, `run_started`, `bootstrap_status`, `failed_stage`, `sandbox_qualification_status`, `proof_invoked`, `proof_exit_code`, `gate_counts`, `worker_qualification_status`, `cleanup_status`, and `application_acceptance`.

For an accepted run that fails before proof: `proof_invoked=false`, `proof_exit_code=null`, and `gate_counts=null` if no ledger exists. For a rejected request: no invented run/job/artifact identifiers. Null is not zero; NOT_RUN is not PASS. If an artifact is present but the inner report is absent, record missing report evidence rather than reconstructing a report from expectations.
