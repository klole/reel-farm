# CH-001R-r5 — Complete architect review and Luna MAX assignment

This is the reading/dispatch copy. The ZIP includes the actual reviewed T4 evidence. No repair implementation, external send, or new workflow dispatch is claimed.


---

<!-- Source: README.md -->

# CH-001R-r5 — Proof-directory handoff repair

Status: **architect follow-up issued; not executed or sent to Luna by this packet author**.

This packet follows the actual settled T4 workflow run, not the old T3 failure and not a hypothetical successful run. It authorizes a small CI/coordinator boundary repair and one fresh router-controlled proof dispatch after publication. It does not authorize product redesign, a new feature chapter, or application acceptance.

Read in order:

1. [Architect review](#architect-review--settled-ch-001r-r4-hosted-run).
2. [Luna MAX assignment](#luna-max-assignment--ch-001r-r5).
3. [Router publication and outcome instructions](#router--publish-the-r5-repair-and-return-its-actual-outcome).
4. [Starting prompt](#starting-prompt-for-luna-max--ch-001r-r5).

The `evidence/` directory contains the downloaded T4 artifact, selected unchanged payloads, an independently computed archive inventory, a small filesystem-model observation, and an architect receipt. The filesystem model is not an application or repository test. Source references are in [SOURCES.md](#source-and-evidence-index).

The existing North Star, original CH-001 contract, strict 72-gate verifier, and r3 bounded-proof scope remain authoritative. This packet changes only the specifically authorized continuation scope; it does not replace those reference documents.

---

<!-- Source: 01_ARCHITECT_REVIEW.md -->

# Architect review — settled CH-001R-r4 hosted run

## Decision

**Bootstrap demonstrated on the hosted runner. Bounded proof failed before application testing. Application acceptance remains false.**

Proceed with **CH-001R-r5**, limited to the proof-directory initialization boundary and focused regressions. Do not rerun an unchanged T4 or reopen the package-manager design. Do not start v0.2.

## Reviewed identities and actual outcome

| Field | Observed value |
|---|---|
| Repository | `klole/reel-farm` |
| T4 implementation | `69b784526260e3e5acf133da8d1a2fb33447d20f` |
| T4 tree, as recorded in the handoff | `55fdf4fc16f1d07498f6fb447cddc64e5261be2c` |
| E4 / workflow-definition commit | `2dd7737aedb60dcb2536ded77a2e64dc56545a9d` |
| E4 tree in Actions metadata | `cc06e262c4557388d963b27f21e7280a7a60dd13` |
| Workflow blob | `65f1ae428e925b4747fea03f6c228a8af4acf15b` |
| Workflow file SHA-256 | `e41c6ce267c8dacfe759f83c873c0f53ebca90e2c56f19e6d17202267b06b896` |
| Hosted run / attempt / job | `34669975078` / `1` / `103489379533` |
| Dispatch event / actor | `workflow_dispatch` / `klole` |
| Actual implementation checkout | T4, not E4; recorded in logs and artifact |
| Settled GitHub outcome | `completed` / `failure` |
| Run created / terminal metadata updated | `2026-09-12T03:17:40Z` / `2026-09-12T03:18:40Z` |
| Outer classification | `LIVE_PROOF_FAILED` |
| Bootstrap result | `PASS` |
| Proof command invoked / exit | `true` / `1` |
| Coordinator result | `TEST_FAILURE` |
| Recorded coordinator steps | Empty array |
| Recorded environment failures | Empty array; preflight was not reached |
| Application acceptance / accepted version | `false` / `none` |

The initial status read was in progress; subsequent job logs and attempt metadata established the terminal failure. This decision uses the terminal observation. [S1–S4]

`main` advanced after the user's update. At review it points to `df008ff64d02ada64b8e91578143709ea7b98b89`, an artifact-ingestion commit directly parented by E4. Its inspected diff adds only the T4 artifact ZIP and extracted evidence, not execution changes. Preserve that commit as the starting baseline; do not reset to E4. [S5]

## What worked—and what that does not prove

The hosted run completed source identity verification, pinned Node setup, CI helper tests, native pnpm bootstrap, frozen installation, managed Chromium installation, and Docker/Compose probes. The bootstrap report records pnpm `12.3.4`, Node `v20.19.2`, and identical lockfile hashes before and after installation:

`9c49bf356bdd523623b79cf6096df83de51f06b358bffa88391700a4c5719d70`.

The actual hosted CI helper TAP output reports **9 tests, 9 passed, 0 failed, 0 skipped**. The prior local handoff describes 10 cases/subtests. Preserve that distinction and reconcile the wording in the next handoff rather than inheriting the local count into the hosted result. [S2, S3, S7]

Installing Chromium is not proof that the sandboxed browser launched. A Docker daemon probe is not a shipped-image build or lifecycle test. The coordinator stopped before its own static and live suite steps. This run therefore does not establish hosted application build, database, browser journey, rendering, export, or restart success.

The Actions step named `Execute bounded live proof` is green because it captures the proof exit for subsequent reporting and exits 0. Its captured child exit was 1. The final enforcement step correctly made the job fail. Do not change that reporting pattern merely to make the step colors look consistent. [S2, S3]

## R5-01 — confirmed orchestration defect

The T4 workflow's identity/setup step executes:

```sh
mkdir -p "$(dirname "$CI_BOOTSTRAP_REPORT")" "$CH001_EVIDENCE_ROOT/public"
```

The coordinator's `prepareRun()` checks the contents of `CH001_EVIDENCE_ROOT` and refuses an existing nonempty directory. Even an empty `public` child makes the parent nonempty. Thus the workflow violates the coordinator's freshness precondition before the coordinator is invoked. [S6, S8]

The downloaded proof report records:

> Evidence run directory already exists and is non-empty

It also records `steps: []`, and no environment-failure reason. This is not the former local Docker/loopback limitation, and it is not evidence of an application defect. Changing only the run ID would reproduce the same premature child-directory creation. [S4]

The packet author reproduced those filesystem operations in an isolated Python temporary directory: creating `proof/public` produces `['public']` under `proof`, while creating only a sibling `bootstrap/public` leaves a newly created proof root empty. This corroborates the source-level explanation; it is explicitly not an execution of the TypeScript coordinator or a replacement for Luna's regression tests.

## R5-02 — adjacent preservation risk to cover in the same repair

The coordinator's top-level catch currently calls `sourceReview()` and writes `public/proof-result.json` even when `prepareRun()` refused a nonempty root. In a genuinely reused run directory, those writes could replace earlier evidence. That consequence was not reproduced against an existing repository run here; the write path is visible in the inspected source. [S8]

Preserve the refusal guard and ensure that refusal does not mutate the refused directory. A small ownership flag or equivalent narrowly scoped initialization helper is appropriate. Refusal diagnostics can remain on stderr for the existing outer CI recorder, or use a separately owned bootstrap report location. Do not introduce a general-purpose evidence storage service.

## Artifact inspection and limits

Artifact ID `10290367825`, named `ch001-live-proof-34669975078-1`, was downloaded through the connected GitHub tool. It is **9,894 bytes**, contains **12 file members**, and its locally computed SHA-256 matches GitHub metadata:

`af14a46a2a85825cb784387b60e6da353b0ff93591607a000b98baf66fb1001d`.

The proof payload also hashes to Git blob `d578278bb2e88c255b5c39a2a7bc7202cf431ba3`, matching the proof JSON committed in the artifact-ingestion commit. The archive contains bootstrap/reporting material and the coordinator failure report, but no `gate-results.json`, application screenshots, or slideshow export. Hosted gate counts are therefore **unavailable**, not the local `4 PASS / 0 FAIL / 68 NOT_RUN` result. No gate count is fabricated for this run. [S3–S5]

The archive's outer reports say artifact delivery `PENDING` and summary exit `null`, because the archive was uploaded before the later receipt/summary steps updated those files. GitHub's artifact metadata and job logs independently confirm upload success. The same archive also contains an earlier fallback bootstrap snapshot with null identities. Those are chronological snapshots, not contradictory proof runs. Do not interpret the fallback file as the primary report, or edit historical payloads to manufacture a final receipt. A separate router receipt is sufficient for this bounded continuation. [S2, S3, S6]

GitHub metadata records artifact expiration at `2026-09-26T03:18:35Z`. The repository's artifact-ingestion commit and the copy in this packet preserve the observed bytes independently of that Actions retention period.

## Acceptance boundary

The r3 command `pnpm proof:ch001` is a **bounded live-proof profile**, not the strict `pnpm verify:ch001` acceptance command. Its own implementation keeps `application_acceptance=false` even on a bounded success and deliberately leaves uncovered parent gates open. Preserve that distinction. [S8]

No full-v0.1 acceptance is granted. No original finding is closed solely by CI bootstrap success. Keep the historical strict ledger and the local r4 ledger intact; do not replace either with this missing hosted ledger.

## Work performed by this architect review

Read-only GitHub inspection, artifact download and hashing, source inspection, and an isolated filesystem model were performed. No repository writes, application tests, paid API calls, account authorization, workflow dispatch/rerun, release, deployment, or Luna send occurred. The files in this packet are instructions and review evidence, not a tested repair.

---

<!-- Source: 02_LUNA_ASSIGNMENT.md -->

# Luna MAX assignment — CH-001R-r5

## Objective and stop rule

Repair the specific workflow/coordinator directory collision demonstrated by T4 run `34669975078`, add real focused regression coverage, and return a new committed implementation for the router to publish and exercise once. Protect rejected historical evidence as part of the same initialization boundary.

This is not another broad CH-001 rebuild. Do not redesign the app, CI bootstrap, package manager, original gate contract, or r3 proof profile. If the fresh proof reaches a new unrelated application defect, preserve its evidence and stop for architect review rather than expanding this repair without a new assignment.

Use MAX effort in the agent interface; the text does not itself configure the agent's effort setting.

## Starting authority and identities

Review baseline: `df008ff64d02ada64b8e91578143709ea7b98b89`. T4: `69b784526260e3e5acf133da8d1a2fb33447d20f`. E4: `2dd7737aedb60dcb2536ded77a2e64dc56545a9d`.

Before editing, inspect `git status`, `git rev-parse HEAD`, `git log`, and the diff from this baseline. Preserve user work and the committed T4 hosted evidence. If `main` has advanced with execution-affecting work, record the divergence and do not overwrite or retest T4 as though it includes those changes.

Read the existing `AGENTS.md` if present; the North Star and original CH-001 packet; the r3/r4 handoffs and current state; this review; the T4 hosted artifact; `.github/workflows/ch001-live-proof.yml`; `scripts/ch001-proof.ts`; `scripts/ci/ci-result.mjs`; and `tests/ci/`.

The router may first commit this packet as P5. Record the actual P5/base SHA when it exists. Do not invent P5, T5, E5, run IDs, or artifact references. T5 will be the new execution-affecting commit, and E5 a subsequent evidence/documentation-only commit.

## Authorized scope

Allowed: the workflow identity/evidence initialization block; narrowly related coordinator initialization and refusal reporting; a small filesystem-only helper if needed for genuine shared-code tests; targeted regression files and their test wiring; handoff/state/evidence documentation.

Keep unchanged unless a separately demonstrated necessity is recorded: Node `20.19.2`, pnpm `12.3.4`, pnpm release manifest/digests, lockfile, application dependencies, native bootstrap implementation, Dockerfile, app code, renderer code, the 72 gate IDs and definitions, strict verifier acceptance thresholds, r3 bounded-proof assertions, runtime security controls, and scope exclusions.

Do not add providers, AI, Pinterest, TikTok/direct official APIs/bridges, scheduling, analytics, billing, video, release/deployment, or v0.2 work. Do not rewrite historical handoffs or raw evidence. Use an addendum/new r5 record for new observations.

## Required repair

### 1. Give each component its own output directory

The intended existing layout remains:

```text
<run-parent>/
  bootstrap/public/     # outer workflow/helper-owned
  proof/                # coordinator-owned
    public/
    private/
```

Before the proof begins, the workflow may create its own bootstrap path and fallback path, but must not create anything within the proof root. The smallest observed fix is to remove the premature `"$CH001_EVIDENCE_ROOT/public"` operand from workflow setup. Audit other pre-proof steps for the same side effect.

Creating an empty proof root inside the coordinator is consistent with the current contract; creating its children before the freshness guard is not. Keep path quoting and the run-ID validation intact. Any r4-to-r5 output-prefix label change must be consistent across all environment/report/upload paths and must not be the actual fix.

### 2. Preserve refusal and historical evidence

Retain the nonempty-run refusal. Do not clear, rename away, silently resume, merge into, or whitelist a nonempty prior proof directory to obtain a green result. Do not change the guard to ignore `public/`.

Only write coordinator-owned reports after this invocation successfully establishes ownership of a fresh proof root. On refusal, leave all prior bytes intact, return a nonzero result, and report the error through the outer bootstrap recorder or stderr. Keep `proof_invoked=true` when the coordinator was actually called; a missing proof file must not imply that it was never invoked. Existing nullable absent-report semantics remain in force.

A focused ownership flag or shared directory initializer is allowed. Avoid generic storage abstractions, broad refactors, automatic resumption, and cleanup of non-owned data. Address errors in the same boundary without changing the substantive proof assertions.

### 3. Add executable regression coverage

The tests must exercise the real initialization code or the actual workflow setup fragment, not merely assert that a string is absent from YAML. Do not create an independent test-only implementation that can diverge from production.

Required cases:

| ID | Case | Required observation |
|---|---|---|
| R5-T01 | Reproduce the old boundary in an isolated fixture | Creating `proof/public` before preparation triggers the current nonempty-root failure. |
| R5-T02 | Corrected workflow setup | Bootstrap reports/directories can be initialized without populating the proof root. |
| R5-T03 | Corrected handoff | Real coordinator preparation accepts that fresh root and creates its owned children. This is a boundary assertion, not a live-app pass. |
| R5-T04 | Preexisting empty `public` child | The root is still refused; the guard has not been weakened. |
| R5-T05 | Prior evidence payload | Refusal preserves existing report and sentinel hashes, with no overwritten or deleted files. |
| R5-T06 | Repeat same run | A second initialization is rejected; implicit resumption is not introduced. |
| R5-T07 | Separate run | A different fresh run works without touching its sibling run's evidence. |
| R5-T08 | Quoted paths | A temporary repository/run-parent path containing spaces is handled correctly. |
| R5-T09 | Invalid run/path | Existing invalid run-ID and outside-repository protections still reject unsafe input. |
| R5-T10 | Refusal result propagation | Outer CI remains nonzero, retains the actual child exit, and never claims app tests ran. |
| R5-T11 | Failure after successful initialization | Owned failure-report writing still works and stays in the correct run. |
| R5-T12 | Existing CI regressions | Native bootstrap, digest/pin, literal summary, absent proof, and exit-classification regressions remain passing. Report actual counts. |

Use temporary run-owned directories and deterministic assertions. No Docker, credentials, network download, or real app launch should be necessary merely to test directory ownership. If shared preparation currently mixes those concerns, extract only the filesystem boundary needed for these tests; keep test stubs out of the deployed proof outcome.

## Verification on the editing host

Execute the focused tests, the existing CI regression command, lint, typecheck, build, unit, and security checks. Retain exact commands, exits, discovered/executed/passed/failed/skipped counts, and new logs. Check lockfile and pinned configuration hashes before and after. Do not describe old local results as a new run.

Where setup is required, use the already-approved native bootstrap and frozen install. Do not return to Corepack. The new regression must fail for the historical boundary and pass for the corrected boundary, with both outcomes clearly labeled as a focused regression rather than application acceptance.

A local `pnpm proof:ch001` run is useful when the environment permits it; use a fresh ID and preserve its actual result. If the host still denies Docker, loopback, or Chromium, report the exact limitation and return the tested boundary repair for router publication. Do not demand that the restricted editing host magically pass all 72 gates before publication; the authorized hosted proof is the next capability check. Do not mark unexecuted runtime gates PASS.

Commit all execution-affecting changes as T5 before authoritative proof. Any later execution change invalidates that tested identity and requires a new implementation SHA. E5 must be documentation/evidence only. Record file lists and actual trees/workflow hashes. Do not rewrite a commit to make its own hash appear inside its contents.

## Handoff and state

Create `handoffs/CH-001R-r5.md` and `docs/evidence/CH-001R-r5/` with the base, T5, E5 convention; changed files; actual test evidence; the T4 root-cause reference; exact scope declaration; and remaining environment/hosted gaps. Update root state and evidence index additively, following existing repository conventions.

Maintain:

```text
root state: awaiting_review
application_acceptance: false
accepted application version: none
```

Use `READY_FOR_ROUTER_PUBLISH / NEEDS_WORKFLOW_DISPATCH` only after the focused repair and runnable regressions are committed. It means ready to publish/test, not app acceptance. If those local checks fail, use a blocked status and explain the failure rather than dispatching broken code.

Do not dispatch from the editing box or seek broader credentials. Hand the new identities to the existing workflow-capable router. No retry of old run `34665615514`, no T3 dispatch, and no re-run of the unchanged T4 failure `34669975078`.

## Completion criteria for this continuation

The local implementation deliverable is complete when the specific boundary regression is fixed, protection tests pass, existing scoped checks have actual results, pins/contract are preserved, and T5/E5 are recorded. Hosted completion additionally requires the router to publish, dispatch once at T5, retrieve the settled outcome, and show whether the coordinator passed initialization and reached its real preflight/proof steps.

A new downstream failure is valuable evidence, not permission to expand scope. Return it intact for the next architect decision. A bounded success still does not close all 72 parent gates or authorize v0.2.

---

<!-- Source: 03_ROUTER_AND_EVIDENCE.md -->

# Router — publish the r5 repair and return its actual outcome

## Baseline and no-repeat rules

The reviewed T4 run is `https://github.com/klole/reel-farm/actions/runs/34669975078` (attempt 1). It failed with a coordinator-directory collision. Do not rerun it unchanged. Do not rerun old T3 run `34665615514` or dispatch T3.

The reviewed remote artifact baseline is `df008ff64d02ada64b8e91578143709ea7b98b89`, directly after E4. Preserve that evidence. Review later changes before advancing. The architect has created this packet locally; no repository publication or dispatch was performed by this review.

## Publication gate

Receive actual T5/E5 identities from Luna. Inspect their ancestry and diff. Ensure T5 includes the narrow fix and tests, E5 contains no execution-affecting change, and there is no app/provider/scope drift. Publish through the already authorized workflow-capable route; do not force-push, squash away provenance, or ask the editing box to expose credentials.

Fetch `origin/main`, verify T5 and E5 are reachable, and record their tree hashes. Verify the published workflow blob and SHA-256, the actual workflow-definition commit that a `--ref main` dispatch will use, and that its workflow content matches the reviewed repair. Record `main` immediately before dispatch; refuse an intervening unreviewed execution change.

Only after those checks, use **one fresh manual dispatch** with the real new full T5 SHA:

```sh
# T5 must already contain the actual reviewed 40-character repair commit.
test "${#T5}" -eq 40 || exit 1
git cat-file -e "$T5^{commit}" || exit 1
git merge-base --is-ancestor "$T5" origin/main || exit 1
gh workflow run ch001-live-proof.yml --repo klole/reel-farm --ref main \
  -f implementation_sha="$T5"
```

This is an instruction for the router, not a record that this command has run. Do not substitute T4 because T5 has not yet been assigned. Select the resulting run by actor, time, event, requested input and actual checkout, not simply the first item in a run list.

## Evidence returned after settlement

Record run ID, attempt, job, final status/conclusion, actual requested/checked-out T5, workflow-definition commit/blob/hash, each relevant bootstrap step, the proof command's captured exit, and whether preparation proceeded to real proof steps. Separate a green wrapper step from its captured child result.

Download the actual new artifact. Record ID/name, archive bytes, SHA-256 from GitHub and from the downloaded bytes, creation/expiry, and exact source paths. Inspect the authoritative checked-out bootstrap report and proof report rather than a fallback snapshot. Record whether a gate ledger exists. When absent, use null/unavailable counts; when present, count its actual IDs/statuses and validate references without importing local gate results.

Use a separate small `publication-receipt.json` after artifact upload/summary to record delivery and terminal verdict. An archive generated before upload cannot contain a trustworthy receipt for its own completed upload. Do not mutate the original archive or require circular self-hashes. Preserve the API/log observations used for the receipt.

Return any screenshots, canonical/alternate ZIPs, hash comparisons, runtime/lifecycle evidence only if produced by the actual new proof. Preserve a failed report as failed. Do not manufacture a 72-gate report after an early crash or claim that installed browser binaries prove a live browser journey.

## Outcome routing

| Actual new outcome | Required router action |
|---|---|
| Bootstrap fails | Capture the first failed stage and reports; stop. No unrelated redesign. |
| Same directory refusal | Repair not demonstrated; return exact workflow and preparation evidence. No automatic rerun. |
| Directory preparation passes; environment blocks | Capture the measured blocker and any work that ran. Keep acceptance false. |
| Preparation passes; new build/runtime/application assertion fails | Preserve artifacts/logs and stop for an architect-defined follow-up. |
| Bounded proof passes | Verify downloadable artifacts and identity; return `READY_FOR_ARCHITECT_REVIEW`, never release acceptance. |
| Run/transport outcome unknown | Return a precise blocker. Do not infer success or dispatch another run blindly. |

## Receipt fields

At minimum: phase, repository, starting baseline, P5 when used, T5, E5, actual trees, remote main before dispatch, workflow commit/blob/SHA-256, dispatch count, run ID/attempt/job, timestamps, terminal conclusion, bootstrap status, proof invoked/exit, coordinator status/steps, artifact ID/bytes/digest/expiry, downloaded digest verification, proof-report and gate-ledger paths, actual gate counts or null, remaining blockers, and `application_acceptance=false` / accepted version `none`.

Preserve the r4 artifact facts in a historical section. Do not replace its missing hosted gate counts with local `4/0/68`, its nine hosted CI cases with the handoff's ten local cases, or its pre-upload `PENDING` snapshot with edited payloads.

The user-facing status should state whether the new packet/update was actually sent to Luna/router and the current blocker. Never label a locally created file as an external send.

---

<!-- Source: 04_START_PROMPT.md -->

# Starting prompt for Luna MAX — CH-001R-r5

Execute the attached CH-001R-r5 packet as a narrow workflow/coordinator boundary repair, not a redesign or new feature chapter.

The fresh T4 run 34669975078, attempt 1, finished with bootstrap PASS but proof exit 1. The workflow created `$CH001_EVIDENCE_ROOT/public` before the coordinator, so `prepareRun()` rejected the now-nonempty proof root. No application tests were reached. The downloaded artifact and its verified digest are included.

Read the architect review and current repository state first. Preserve the artifact-ingestion baseline df008ff64d02ada64b8e91578143709ea7b98b89 and any later authorized work. Give the outer workflow ownership only of bootstrap output; leave proof initialization to the coordinator. Keep the nonempty-root refusal strict and ensure refusal cannot overwrite prior evidence. Add the real positive/negative boundary regressions specified in the assignment and run the existing scoped checks.

Do not change Node/pnpm/application pins, native bootstrap design, lockfile, app features, renderer behavior, the strict 72-gate contract, or r3 bounded-proof requirements. No providers, TikTok, publishing, scheduling, billing, video, deployment, releases, or v0.2 work.

Return actual T5/E5 commits, focused regression results and evidence, and a handoff for the existing workflow-capable router. Do not dispatch from the editing box. The router may publish and dispatch once using the new T5; do not rerun T3 or unchanged T4. Stop on a new downstream failure with evidence rather than broadening scope.

Keep root awaiting_review, application_acceptance=false, accepted application version none. Report whether an external send actually occurred and any blocker.

---

<!-- Source: SOURCES.md -->

# Source and evidence index

These references are to the reviewed repository/run, not claims that the architect ran the application. The included artifact and selected JSON payloads are unchanged downloads; the inspection/receipt/model files are explicitly architect-authored observations.

- **S1 — settled attempt metadata:** https://api.github.com/repos/klole/reel-farm/actions/runs/34669975078/attempts/1. Observed `completed`, `failure`, attempt 1, workflow ref at E4. Initial earlier run read was in progress and is superseded for this verdict.
- **S2 — actual job and logs:** https://github.com/klole/reel-farm/actions/runs/34669975078/job/103489379533. Retrieved with the connected GitHub jobs/logs actions. Includes 9 hosted CI test passes, successful bootstrap/install/probes, proof child exit 1, artifact upload, and final enforcement failure.
- **S3 — artifact metadata:** https://api.github.com/repos/klole/reel-farm/actions/artifacts/10290367825. Archive in `evidence/T4-hosted-artifact.zip`; measured inventory in `evidence/archive-inspection.json`. Download URL: https://github.com/klole/reel-farm/actions/runs/34669975078/artifacts/10290367825. No expiring signed URL is embedded in this pack.
- **S4 — committed proof failure:** https://github.com/klole/reel-farm/blob/df008ff64d02ada64b8e91578143709ea7b98b89/architect/ch001r4-live-proof-34669975078/r4-34669975078-1/proof/public/proof-result.json. Git blob `d578278bb2e88c255b5c39a2a7bc7202cf431ba3`; independently matched against downloaded payload.
- **S5 — later artifact-ingestion baseline:** https://github.com/klole/reel-farm/commit/df008ff64d02ada64b8e91578143709ea7b98b89. Direct parent E4; tree `606537439e58bf2373e1f7fb0b7786d9819d1f38`. Full inspected file list contains artifact/evidence additions only. Remote main observation was this commit during review, not the previously reported E4 tip.
- **S6 — T4 workflow:** https://github.com/klole/reel-farm/blob/69b784526260e3e5acf133da8d1a2fb33447d20f/.github/workflows/ch001-live-proof.yml. Read setup/identity section, especially premature proof-public `mkdir`; complete sequencing is also represented in the actual job log.
- **S7 — historical local r4 handoff:** https://github.com/klole/reel-farm/blob/2dd7737aedb60dcb2536ded77a2e64dc56545a9d/handoffs/CH-001R-r4.md. Distinguish its then-unpublished/local observations from the later hosted run and artifact commit.
- **S8 — coordinator:** https://github.com/klole/reel-farm/blob/69b784526260e3e5acf133da8d1a2fb33447d20f/scripts/ch001-proof.ts. `prepareRun` around lines 266–272 contains the nonempty guard; source-review/finalize/main/catch near the end define report writes and bounded-not-full-acceptance behavior. Source line numbers are navigation aids; names/immutable commit are authoritative.

`evidence/run-receipt.json` is an architect transcript of observed tool results, not a file emitted by Actions. `evidence/filesystem-observation.json` is a Python filesystem model only, not a new repository test run. `evidence/bootstrap-result.json` and `evidence/ci-result.json` are pre-upload snapshots extracted from the primary checked-out artifact path; `PENDING` is preserved as observed. The archive also contains a separate older fallback snapshot.
