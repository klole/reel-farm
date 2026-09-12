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
