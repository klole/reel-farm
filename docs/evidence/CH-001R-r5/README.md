# CH-001R-r5 evidence index

Status: `READY_FOR_ROUTER_PUBLISH / NEEDS_WORKFLOW_DISPATCH`. This is a narrow proof-directory ownership repair for Open Slideshow Studio `v0.1.0`; it is not application acceptance and does not authorize v0.2.

## Identities

| Field | Actual value |
|---|---|
| Review baseline / packet P5 | `df008ff64d02ada64b8e91578143709ea7b98b89` / `53f7786fdd728140c94bd82e3855cd7e97c96cf5` |
| P5 tree | `9886165add66465f6ee2889027c9abf90ae012a2` |
| T5 implementation | `6849b39f4e3c7a03b5f132418b1d33cc84c98d51` |
| T5 tree | `85ea5ab159c6f6bd5babf63246cd16c8c50b8655` |
| T5 parent | `53f7786fdd728140c94bd82e3855cd7e97c96cf5` |
| E5 | This documentation/evidence-only commit; full SHA is returned in the handoff and final response. |
| Published ref observed | `origin/main` resolved to T5 after the successful push; no workflow dispatch was performed. |
| Workflow blob at T5 | `50774746e3ead4922b265af6652a942302743062` |
| Workflow SHA-256 at T5 | `a9f2a8b3901a86bf3d5fa8f392cc02188785dde8d3e6785bd6243f3f1f6af4ef` |

The T5 execution-affecting diff is limited to the workflow setup line, the shared dependency-free proof-boundary helper and declaration, the coordinator integration, and the focused CI regression file. No package manifest, lockfile, application, renderer, Dockerfile, gate definition, or provider file changed.

## Repair evidence

The workflow identity step now creates only `$(dirname "$CI_BOOTSTRAP_REPORT")`. It does not create `CH001_EVIDENCE_ROOT/public`; the coordinator owns proof initialization.

The coordinator calls `prepareProofEvidenceDirectories()` before creating `private/`, `public/`, or their command directories. It still rejects any nonempty proof root, including a preexisting empty `public/` child. An ownership flag is set only after the fresh-root check and owned child initialization succeed. The catch path writes `proof-result.json` only through `writeCoordinatorFailureReport()` when that flag is true; refusal diagnostics go to stderr and the refused directory is not mutated.

The focused regression implementation is [proof-boundary.test.mjs](../../../tests/ci/proof-boundary.test.mjs), and the exact summary log is [focused-regressions.log](focused-regressions.log). The structured results are [r5-results.json](r5-results.json).

## Boundary regressions

All R5-T01 through R5-T12 cases passed with exit `0` in the focused test module. The cases use temporary run-owned directories and the real shared preparation/reporting helper; R5-T02 also executes the dependency-free `ci-result.mjs init` command used by the workflow setup. R5-T10 exercises actual outer CI result recording and classification with a captured child exit of `1`.

The existing CI helper module contains 9 executable node:test cases and the new boundary module contains 12. Under the editing host’s Node `v20.19.2`, `pnpm test:ci` reports 2 file-level tests and 2 passes; direct execution of the two node:test modules reports 9/9 and 12/12 respectively. These are reported separately rather than conflated.

## Scoped checks after T5

| Command | Exit | Result |
|---|---:|---|
| `node --check scripts/ch001-proof-boundary.mjs && node --check tests/ci/proof-boundary.test.mjs` | 0 | Syntax checks passed |
| `pnpm test:ci` | 0 | 2 file-level tests, 2 passed; underlying modules: 9 existing + 12 R5 cases |
| `pnpm lint` | 0 | ESLint passed |
| `pnpm typecheck` | 0 | Project and test TypeScript checks passed |
| `pnpm build` | 0 | All workspace builds and Next production build passed |
| `pnpm test:unit` | 0 | 3 test files, 20 tests passed |
| `pnpm test:security` | 0 | 1 test file, 4 tests passed |
| `git diff --check` | 0 | No whitespace errors |

The native package-manager and project pins remained unchanged:

- Node: `20.19.2` (`.nvmrc` SHA-256 `4500e8d9dd80dba8f66ec54b39b8dce1d0dcbd3d8b2a93e9960a19cfd7d25f40`)
- pnpm: `12.3.4`; release manifest SHA-256 `fb6212a43173722f565a4101c311b23b54b7204f4828e0c62e9b9f7af1a8bd6d`
- `pnpm-lock.yaml` SHA-256 before/after: `9c49bf356bdd523623b79cf6096df83de51f06b358bffa88391700a4c5719d70`
- `package.json` SHA-256: `cb1e1a5c2ec11ecc7d397c9aa7700d76841cede38615656e3e273f34b140dbd0`

## Fresh local bounded proof

Command:

```text
CH001_RUN_ID=r5-local-t5-boundary CH001_EVIDENCE_ROOT=artifacts/ch001r5/r5-local-t5-boundary/proof pnpm proof:ch001
```

Exit: `2`. The coordinator prepared its own proof root and reached preflight/static checks; it did not reproduce the T4 directory collision. Result: `BLOCKED_ENVIRONMENT`, implementation T5, run `r5-local-t5-boundary`.

The local gate ledger contains 72 IDs: `CH001-067`, `CH001-068`, `CH001-069`, and `CH001-072` are source-only PASS; `0` FAIL and `68` NOT_RUN. The local run is not hosted evidence and is not application acceptance.

Measured environment limitations were loopback `listen EPERM`, missing Docker/Compose (`spawn docker ENOENT`), and unavailable pinned Playwright Chromium at `/home/box/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome`. Integration, e2e, render, smoke, Compose, image, migration, lifecycle, ZIP, screenshot, and export assertions were not executed as live application checks. The ignored run-owned public evidence is under `artifacts/ch001r5/r5-local-t5-boundary/proof/public/`.

Recorded local evidence hashes:

- `proof-result.json`: `6ace27aecd04197ae18876c2866ed090a330ce57695c689290f9faa64e36aae8`
- `gate-results.json`: `d583843dd7693530002bb251b734f325ead419d3168073d8d0680e4dfe163073`
- `artifact-manifest.json`: `4cf7242e995436e2ec346ef757dd87235536a4f22e789a76c3d5353a64663d8b`
- `environment.json`: `94c83f6642f7aea53fc84a2f79c2f93c4f63928b20ceab190fed39a6ccb32b4e`

## Historical T4 boundary

T4 run `34669975078`, attempt `1`, job `103489379533` had bootstrap `PASS` but bounded proof child exit `1` and classification `LIVE_PROOF_FAILED`. The workflow created `proof/public` before coordinator preparation, so the coordinator rejected the nonempty root before application tests. Its downloaded artifact was 9,894 bytes, artifact ID `10290367825`, SHA-256 `af14a46a2a85825cb784387b60e6da353b0ff93591607a000b98baf66fb1001d`, expiring `2026-09-26T03:18:35Z`. Hosted gate counts for that artifact remain unavailable; they are not replaced with local counts.

## Router handoff boundary

The T5 commit was published to `origin/main`; no external Luna/router message or Actions dispatch occurred. The existing workflow-capable router must verify T5 and this E5 commit, verify the workflow identity at published `main`, and dispatch exactly once with `implementation_sha=6849b39f4e3c7a03b5f132418b1d33cc84c98d51`. It must select the resulting run by actor/time/event/requested SHA/actual checkout, retrieve the settled artifact, and preserve any downstream failure without broadening this scope.

Root state remains `awaiting_review`, `application_acceptance=false`, and accepted application version `none`.
