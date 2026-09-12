# Architect review — CH-001R-r6 → r7

## 1. Decision

**CH-001 remains unaccepted. Authorize only CH-001R-r7: workflow-context repair and pre-publication validation.** The r6 sandbox implementation is carried forward, not declared qualified and not replaced.

The reported manual dispatch failed before start. This is not a fresh hosted `BLOCKED_ENVIRONMENT` proof result: the proof process was never invoked. Its exit code, live-proof run/job IDs, and artifact IDs must remain null. The earlier local r6 exit 2 and its 4/0/68 gate ledger remain local evidence only.

## 2. Inspected identities

| Identity | Value | Basis |
|---|---|---|
| Repository | `klole/reel-farm` | Connected GitHub reads |
| P6 | `8fa06ddae978eb6ca8f946e77459810a7bc68cb3` | Published handoff |
| T6 | `e0ea57665d00a643a8c392dfb9f6a84a723729af` | Published workflow and handoff |
| T6 tree | `7a5ada37e8ee88a1617ff19039fa116ced44e9c5` | Published handoff; not independently rehashed |
| E6 | `a4d6e7a0149d6852bf348d6277c4200720320f9c` | GitHub main ref and commit metadata |
| E6 parent | T6 | GitHub Git commit metadata |
| E6 tree | `ff094c15669f90b32335d8bde4f809356b18caf2` | GitHub Git commit metadata |
| Workflow blob at T6 and E6 | `f1ddbbfc0cbaa4602663428d569b61dbf12bd068` | Both pinned file responses |
| Workflow SHA-256 | `e1e4f6e5ebfa61f2aae3c04bcf985d12407a8f921dfeaa34dae01d103d01af85` | Handoff/router reported; full file bytes not independently rehashed here |

At inspection, `origin/main` as exposed by the connected GitHub ref was E6. Recheck it before work; a later packet-only commit is possible. Never overwrite intervening work to force this historical baseline.

## 3. Confirmed source defect: R7-F01

**Location:** `.github/workflows/ch001-live-proof.yml`, T6/E6, original file line 39 under `jobs.live-proof.env`.

```yaml
CH001_SANDBOX_STATE_DIR: ${{ runner.temp }}/ch001r6/${{ github.run_id }}-${{ github.run_attempt }}/sandbox
```

GitHub's context-availability table permits `github, needs, strategy, matrix, vars, secrets, inputs` at job-level `env`; it does not permit `runner` there. `runner` is available in a step's environment or running-step context. [S1, S2]

This is a GitHub Actions expression/context-validation defect. The file need not be malformed YAML. A YAML parser, JavaScript syntax check, TypeScript build, or unit suite can pass while this placement is still invalid. No change to pnpm, Chromium, AppArmor, or application code can correct this particular definition error.

**Disposition:** source-confirmed blocker consistent with the router's reported parse rejection. This review does not invent the original dispatch HTTP status, response body, or GitHub annotation text; the router should preserve its actual command output if available.

## 4. Confirmed validation gap: R7-F02

The r6 handoff reports successful `node --check`, CI helper tests, lint, typecheck, build, unit and security checks. The inspected package script `lint` calls ESLint, and `test:ci` calls Node's test runner. No GitHub Actions-aware workflow-validation command appears in the inspected root scripts. [S3, S4]

This is not a reason to discard those checks. They cover different subjects. Add a separate mandatory local/router command that understands workflow structure and expression contexts. Running such a check only inside the workflow being validated is insufficient: an invalid definition may never start that step. [S2, S5]

**Disposition:** require a real validator, negative controls, and evidence tied to the exact workflow bytes before publication and dispatch.

## 5. GitHub's validation-only record

The connected API returned a record at E6:

- Run-record ID: `34675672523`.
- Event: `push`.
- Name: `.github/workflows/ch001-live-proof.yml`.
- Status/conclusion: `completed` / `failure`.
- Creation/update shown: `2026-09-12T05:28:32Z`.
- Jobs endpoint: `total_count=0`, empty `jobs` array. [S6, S7]

This is a validation-only failure record, not a successful manual dispatch and not a live-proof execution. Preserve it separately from the router's rejected dispatch attempt. Do not describe it as a browser test run or count it against application gates. Do not rerun it.

No new live-proof artifact is reported by the router. This review did not download a new T6 hosted artifact. No application assertions or sandbox qualification were observed for T6 on a hosted runner.

## 6. Historical evidence retained, not promoted

The r6 handoff reports local checks passing, local bounded proof exit 2, and local gate counts of 4 PASS / 0 FAIL / 68 NOT_RUN. Its host-policy qualification is explicitly unexecuted. Preserve these as historical reported local results, not independently rerun results. [S3]

The last actual bounded hosted result provided before T6 is T5 run `34671716094`, with the sandbox launch blocker documented in the r6 packet. Neither its counts nor its artifact may be relabeled as T6 or T7 evidence.

## 7. Approved repair direction

Remove only the unsupported job-level binding. Resolve `RUNNER_TEMP` within an existing running step, preferably the existing source-identity/evidence-initialization step, and append the resolved `CH001_SANDBOX_STATE_DIR` to `GITHUB_ENV` for later steps. Preserve the exact `/ch001r6/<run-id>-<attempt>/sandbox` suffix. This is r7 repair work on r6 behavior, not a reason to rename every historic path. [S8]

Do not replace the expression with a literal `$RUNNER_TEMP` in job-level `env`: environment values do not acquire a second shell-expansion pass merely by being read later. Do not hard-code a runner filesystem path. Do not make qualification and cleanup compute different paths.

The included reference shell checks demonstrate literal path transfer across simulated steps, including spaces and shell-looking text. They do not emulate GitHub's expression evaluator or validate the complete workflow.

## 8. Not newly authorized

No application or provider features; no new browser model; no dependency upgrades; no global AppArmor or user-namespace relaxation; no unsandboxed fallback; no root browser; no privileged/unconfined container workaround; no altered original acceptance gates; no strict-verifier weakening.

If a full Actions-aware validator exposes another genuine definition error, repair only that definition/wiring defect and add a regression. If a new runtime sandbox, worker, or application failure appears in a fresh authorized run, preserve the evidence and return it for the next decision.

All sources are resolved in [the source index](06_SOURCE_INDEX.md).
