# Architect review — T5/E5 and hosted run 34671716094

## 1. Decision

**r5 boundary repair: substantiated within the reviewed scope.**

**Application checkpoint: NOT ACCEPTED.**

**Next authorized work: CH-001R-r6, hosted browser-sandbox qualification only.**

The evidence supports moving past the r4 proof-directory collision, not moving to v0.2. Keep `application_acceptance=false`, `accepted_application_version=none`, and root `awaiting_review`.

## 2. Exact reviewed identities

| Identity | Value |
|---|---|
| Repository | `klole/reel-farm` |
| P5 packet | `53f7786fdd728140c94bd82e3855cd7e97c96cf5` |
| T5 implementation | `6849b39f4e3c7a03b5f132418b1d33cc84c98d51` |
| T5 tree | `85ea5ab159c6f6bd5babf63246cd16c8c50b8655` |
| E5 evidence / dispatched workflow-definition commit | `a27bb4bbae78cd618e2ccf6c14a6593df7f83554` |
| E5 tree reported by Actions | `cb0c0bcb0687fbfb7802f41f3cb7a3669fe8d597` |
| Router artifact commit / observed main | `6f600381c72bc68bc550e69ab0e86d522a81a389` |
| Workflow | `.github/workflows/ch001-live-proof.yml` |
| Workflow blob | `50774746e3ead4922b265af6652a942302743062` |
| Workflow SHA-256 recorded in bootstrap report | `a9f2a8b3901a86bf3d5fa8f392cc02188785dde8d3e6785bd6243f3f1f6af4ef` |
| Run / attempt / job | `34671716094` / `1` / `103494183389` |
| Artifact ID | `10290953048` |
| Artifact name | `ch001-live-proof-34671716094-1` |
| Downloaded archive bytes | `50,693` |
| Downloaded archive SHA-256 | `89d18eebcbd629c7a504151c85a558610039052447baf21d82d00595227f96bb` |
| Artifact expiry reported by GitHub | `2026-09-26T03:58:41Z` |

Actions records the run as completed/failure. The bounded coordinator's actual exit is **2**, with classification **BLOCKED_ENVIRONMENT**. An Actions failure icon is not, by itself, an application assertion failure. [S01–S05](05_SOURCES_AND_IDENTITIES.md)

## 3. Independent artifact inspection

The architect downloaded the artifact through the GitHub connection and inspected its bytes. Its measured length and SHA-256 match GitHub artifact metadata and the router's receipt. The archive contains 39 file entries. All 25 payload files named by the proof's `artifact-manifest.json` exist in the archive and match their declared lengths and SHA-256 hashes.

The artifact's environment and proof-result bytes also reproduce the Git blob IDs of the preserved repository files. This verifies those two archived files against the committed copy, not merely against a repeated filename.

The archive contains both an early `_temp/.../bootstrap/public` fallback and the actual checked-out workspace's bootstrap reports. The workspace reports with matching T5/run identities are the relevant completed-stage records. The fallback is not the final result.

The review inspection is recorded in [review/T5_ARTIFACT_INSPECTION.json](review/T5_ARTIFACT_INSPECTION.json). Its validation is an artifact-integrity check, not execution of the application. The historical archive is included unchanged at [review/T5_HOSTED_ARTIFACT.zip](review/T5_HOSTED_ARTIFACT.zip).

## 4. What the hosted evidence establishes

The outer bootstrap records passing helper regressions, native pnpm setup, frozen dependency installation, managed Chromium installation, and Docker preflight. The hosted helper log reports **21 tests passed**, comprising the earlier nine CI tests and the twelve R5 boundary regressions. This is distinct from the editing host's test-runner presentation.

After preparation, the coordinator successfully ran Docker version/info/Compose probes and host lint, typecheck, build, unit, and security commands. The unit report contains 20 passing tests and the security report four. These are real hosted results, but they do not exercise the application journey.

The 72-ID ledger is exactly **4 PASS / 0 FAIL / 68 NOT_RUN**. The four source-only PASS IDs are `CH001-067`, `CH001-068`, `CH001-069`, and `CH001-072`. Record them as reported source assessments; do not promote them to runtime proof or independently close every parent requirement they mention.

The integration, E2E, and render reports show zero discovered/executed live cases. The Compose lifecycle was not executed. The smoke wrapper records a nonzero exit with zero executed cases; read that together with the coordinator's environment block, not as evidence that the shipped application failed a live smoke assertion. [S03–S05](05_SOURCES_AND_IDENTITIES.md)

## 5. What r5 fixed

The workflow no longer creates `proof/public` before the coordinator owns the proof directory. The shared boundary helper retains refusal of an existing nonempty root. The coordinator now guards failure-report writes with ownership, and the hosted run advanced into preflight and static checks without the former collision.

The source inspection, twelve reported boundary regressions, and hosted progression substantiate that narrow repair. This is not a comprehensive filesystem-security certification and does not authorize weakening that boundary in r6. [S06–S07](05_SOURCES_AND_IDENTITIES.md)

## 6. New primary blocker: installed browser cannot launch sandboxed

The hosted report establishes:

- The pinned executable exists and is executable at `/home/runner/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome`.
- Node is `v20.19.2`, pnpm `12.3.4`, and Playwright `1.63.0`.
- Docker client/daemon are `28.0.4`; Compose is `2.38.2`.
- A loopback port was allocated, so the editing box's loopback denial is not this hosted blocker.
- Launch was requested with `chromiumSandbox: true`, but the returned browser version is null because launch aborted.
- Chromium reported `No usable sandbox!` and referred to Ubuntu's AppArmor/user-namespace restrictions.

**Confirmed:** a sandboxed launch prerequisite failed on this runner.

**Strongly supported diagnosis, not yet measured conclusively:** AppArmor's unprivileged user-namespace policy denied the pinned cache-path Chromium the permissions it needs. The current artifact does not contain the relevant sysctl readings, AppArmor profile attachment, or a kernel denial tied to the browser PID. Obtain those in r6 instead of asserting they were already measured.

The `sandbox: true` field in the current host report describes the requested option. It does not mean a sandbox successfully initialized. r6 must distinguish configuration, launch success, and observed sandbox evidence. [S05, S08–S11](05_SOURCES_AND_IDENTITIES.md)

## 7. Missing exports are downstream, not eleven new product failures

The proof's finalization checks emitted missing-file diagnostics for the canonical ZIP, alternate ZIP, screenshots, and lifecycle/hash files. They are missing because the prerequisite failure prevented their producing stages from running. Preserve these historical diagnostics verbatim, but do not describe them as independent defects reproduced in the slideshow application.

Future reporting may add a `blocked_by`/stage annotation to distinguish unexecuted producers from missing output after a successful producer. It must never suppress a real producer failure or accept a nominally successful proof without its required artifacts.

## 8. Authorized technical direction

Prefer the exact-executable AppArmor exception documented by Chromium and Ubuntu over a global host-policy change. This grants selected browser processes access to user namespaces so that Chromium can construct its own sandbox. It is a limited security-policy exception, not an absence of security tradeoffs: permitted processes regain access to a kernel feature that Ubuntu restricts to reduce attack surface.

Only apply it inside the explicitly authorized, ephemeral, manually dispatched proof job. Target the canonical path of the pinned managed executable, not all programs named `chrome`, all of `/home`, or arbitrary repository binaries. Keep Chromium sandboxing enabled and collect a real post-policy launch result.

The worker browser is a separate execution context. An AppArmor exception on the host does not automatically establish sandbox compatibility inside the Docker worker. Exercise the shipped worker configuration separately; a newly observed container restriction returns to review rather than triggering an automatic insecure fallback. [S08–S13](05_SOURCES_AND_IDENTITIES.md)

## 9. Other observations, not permission to expand scope

The artifact's outer report still says artifact delivery `PENDING` and summary exit null because upload captured the pre-delivery snapshot. GitHub metadata and the router's independent receipt establish that the upload happened. Do not rewrite the historical archive to pretend it contains a later receipt; append a separate receipt referencing its exact digest.

The legacy `r4-...` run prefix and r3 proof-profile label are not the cause of this failure. Changing those names everywhere is unnecessary. Commit, workflow, run, and artifact identities must remain unambiguous in the new handoff.

No feature work, dependency upgrade, direct TikTok integration, provider integration, repository rewrite, or new runner service is warranted by this result.
