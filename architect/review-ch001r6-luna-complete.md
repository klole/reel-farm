# CH-001R-r6 — Complete architect review and Luna MAX assignment



## README.md

# CH-001R-r6 — Hosted Chromium sandbox qualification

**Authority:** architect follow-up to the actual T5 hosted outcome, not a new product chapter.

**Current decision:** the r5 directory-initialization repair is substantiated for its bounded scope. The live application proof is still blocked. `application_acceptance=false`; root `awaiting_review`; accepted application version `none`; target `0.1.0`.

## The assignment in one paragraph

Keep the T5 evidence-directory fix and the working native pnpm bootstrap. On the existing manually dispatched GitHub-hosted Ubuntu runner, qualify the pinned Playwright browser with its sandbox enabled. Prefer a narrowly attached, temporary AppArmor user-namespace exception for the exact managed browser executable, after collecting the relevant host facts. Do not disable Chromium's sandbox, disable AppArmor globally, loosen Docker isolation, replace the browser with a system channel, or alter application dependencies. Run the existing bounded proof once on a new implementation commit. Preserve the actual outcome and return for review, even when that outcome is a new downstream blocker.

## Read order

1. [Review decision and evidence](01_REVIEW_VERDICT.md).
2. [Luna MAX implementation assignment](02_LUNA_ASSIGNMENT.md).
3. [Regression, runtime, and evidence requirements](03_TESTS_AND_EVIDENCE.md).
4. [Router publication and dispatch rules](04_ROUTER_HANDOFF.md).
5. [Pinned identities and primary sources](05_SOURCES_AND_IDENTITIES.md).

Use [START_PROMPT.md](START_PROMPT.md) as the dispatch prompt. The [handoff template](templates/CH-001R-r6_HANDOFF.md) and [r6 checklist](templates/r6-checklist.template.json) are blank templates, not test results. The original 72 CH001 gate definitions remain authoritative and unchanged.

## What this packet is not

It is not proof of a repaired sandbox, a runnable application, a passing export, or v0.1 acceptance. No new workflow was dispatched by the packet author. No repository content was changed by the packet author. The attached historical archive is evidence from T5, not T6.

The public artifact's internal labels still use `r4-34671716094-1` and a legacy r3 coordinator profile. Those labels are inherited names. Its actual checkout is T5 and its Actions run is 34671716094; do not confuse it with the earlier T4 run.

## Required return

Luna returns a tested implementation commit T6 and an evidence-only commit E6, plus actual commands, report hashes, and remaining limitations. The router verifies publication and initiates at most one new approved hosted dispatch with T6. The next architect review judges the result; neither Luna nor the router self-accepts the application.

A green bounded proof remains a prerequisite for a later acceptance review. It does not replace the strict 72-gate contract or close the original R01–R11 findings automatically.

## Packet validation

[PACK_VALIDATION.json](PACK_VALIDATION.json) records document and historical-artifact checks only. Reproduce them with `python scripts/validate_pack.py`. No application test, sandbox-policy execution, or workflow dispatch is implied.


## 01_REVIEW_VERDICT.md

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


## 02_LUNA_ASSIGNMENT.md

# Luna MAX assignment — CH-001R-r6

## 1. Goal and stop boundary

Repair the hosted pinned-Chromium launch prerequisite without disabling its sandbox, and qualify the existing bounded application proof on a new committed implementation.

This is a continuation of CH-001, target v0.1.0. It is not v0.2. It is not a request to reconstruct the studio or rewrite the test coordinator.

Use the highest available effort setting. Implement, test, and document the bounded change; do not return another implementation plan in place of code. When the editing host cannot execute privileged policy/runtime checks, finish the deterministic regressions and handoff honestly for the router's one hosted dispatch. Do not repeatedly rerun known-unavailable local services.

## 2. Baseline and reads

Start from `6f600381c72bc68bc550e69ab0e86d522a81a389`, or its descendant containing only this approved packet. Record the exact P6 and its tree. A newer unrelated implementation needs reconciliation; do not overwrite it or quietly adopt its results.

Read:

- This packet's review, tests, and router rules.
- `handoffs/CH-001R-r5.md` and `docs/evidence/CH-001R-r5/`.
- `architect/ch001r5-live-proof-34671716094/ROUTER_RECEIPT.md` and preserved artifact reports.
- `state/PROJECT_STATE.md`, requirement status, and evidence index.
- The original CH-001 acceptance contract under `architect/Luna_CH001_v0.1.0_Pack/`.
- `.github/workflows/ch001-live-proof.yml`, `scripts/ch001-proof.ts`, `scripts/ch001-proof-boundary.mjs`, `scripts/ci/ci-result.mjs`, `scripts/ch001-compose.ts`, and `playwright.config.ts`.
- Every direct Chromium launch call used by the proof, its tests, and the worker. Enumerate the actual call sites rather than assuming the preflight path covers all of them.

Preserve the North Star baseline SHA-256 `3175b197c221588fa92273c9f8403ecbcc2357fe486f63a97365205d951ad80d` and the original 72 gate definitions.

## 3. Fixed commitments

Do not change Node `20.19.2`, pnpm `12.3.4`, Playwright `1.63.0`, the frozen lockfile, application dependency versions, the checked native-release manifest, or the native bootstrap mechanism. Do not switch runner images merely to avoid learning what failed. Keep `ubuntu-24.04`, the approved standard-hosted public-repository path, pinned Actions, read-only repository permission, and manual dispatch.

Do not add a browser service, hosted rendering API, paid runner, new provider key, public deployment, or system browser substitution. The future ScrapeCreators and one-key fal.ai choices remain deferred; direct official TikTok Content Posting API work remains prohibited.

Do not use:

- `chromiumSandbox: false`, `--no-sandbox`, disabling seccomp filtering, or a permissive launch retry;
- global AppArmor shutdown, profile removal unrelated to this job, permissive global user-namespace sysctls, or permanent sysctl configuration;
- root browser execution, `--privileged`, `CAP_SYS_ADMIN`, `seccomp=unconfined`, or container `apparmor=unconfined`;
- external/unpinned Chrome, `CH001_ALLOW_EXTERNAL_BROWSER=1` as proof qualification, or an old successful report;
- blanket source-string checks as the only runtime security evidence.

Some upstream documentation describes these alternatives. They are not authorized here.

## 4. Small implementation surface

Expected changes are confined to the workflow, one small sandbox-policy/probe helper (plus typing if needed), focused tests, and limited proof/reporting integration. Add documentation/state/evidence separately.

`playwright.config.ts` or existing browser-launch helpers may change only to consistently use and record the qualified pinned executable/options. Do not alter application behavior, templates, renderer output, migrations, credentials, queue policy, or gate semantics.

The shipped Dockerfile and production Compose isolation defaults are not authorized for speculative changes. If a distinct worker namespace/seccomp failure appears, capture its exact context and stop for the next review. The researched container options in the source note are contingencies, not permission to weaken or replace the current worker configuration.

## 5. Collect host facts before changing policy

After frozen dependencies and the managed browser are installed, and before the coordinator starts, gather a small sanitized record containing:

- OS release, kernel, runner image identity where supplied, uid/gid, Node, Playwright, and actual requested/checked-out commits;
- canonical managed browser executable path, permissions, ownership, and SHA-256; record which launch sites use it;
- AppArmor enabled/disabled/unavailable status and parser/version availability;
- readable values of `kernel.apparmor_restrict_unprivileged_userns`, `kernel.unprivileged_userns_clone`, and `user.max_user_namespaces`; absent keys remain null/unavailable, not guessed zero;
- relevant profile attachment information and a bounded kernel-denial excerpt tied to the probe when accessible;
- default sandboxed-launch outcome, bounded timeout, exit/error, and selected executable.

Read-only probes may run in other environments. Privileged writes may not. Do not dump full host logs, credentials, environment variables, or unrelated profiles into a public artifact. A failed generic `unshare` shell probe is contextual evidence only: a policy attached to Chrome intentionally need not allow an unrelated shell binary.

If the pinned browser already launches with the required sandbox, do not install an unnecessary policy. Record `policy_change=none` and qualify that measured route. If it cannot launch for missing libraries, a corrupt executable, a dependency mismatch, or another cause, classify that cause rather than claiming AppArmor was proven.

## 6. Authorized AppArmor exception

### 6.1 Permission boundary

Apply a profile only in the manually authorized proof job for this public repository on the standard GitHub-hosted Linux runner, with an explicit r6 opt-in. Check repository/event/runner identities, exact requested-versus-checked-out commit, Linux/Ubuntu expectations, non-root browser uid, and the opt-in before any privileged write. Those checks prevent accidental local use; they are not an authentication mechanism against malicious code already running with CI permissions. No passwords or new credentials may be requested. Use existing noninteractive sudo only for the scoped host-policy operation.

Do not apply the policy on Kyle's Mac, the editing box, a self-hosted runner, a production server, or an ordinary user installation. Do not package it into application startup or `pnpm setup`.

### 6.2 Target selection

Resolve the executable through the installed pinned Playwright package, canonicalize the real path, verify it is a regular executable inside the expected managed-browser installation, and record its hash. Reject unsupported or ambiguous paths. Do not construct an AppArmor policy from arbitrary workflow text, a project upload, or a generic basename search.

The T5 failure used the full managed `.../chrome-linux64/chrome`. Some launch sites may choose a headless-shell binary instead. Either explicitly align proof/test call sites to the same qualified managed full executable, or enumerate and separately qualify each managed executable actually used. Do not grant permissions to an unused alternate binary preemptively. The worker's in-container binary is not a host executable to allowlist this way.

Reject profile-language metacharacters, newline injection, shell injection, globbing, and paths escaping the managed root. Handle normal spaces with valid quoting rather than interpolation into a shell command. Do not follow a symlink to an arbitrary outside executable. Recheck recorded executable identity before the measured launch.

### 6.3 Policy content and tradeoff

Chromium's documented targeted pattern uses an AppArmor profile attached to a browser path, with a `userns,` rule. A conceptual template is:

```text
abi <abi/4.0>,
include <tunables/global>
profile UNIQUE_RUN_PROFILE "EXACT_CANONICAL_MANAGED_BROWSER_PATH" flags=(unconfined) {
  userns,
}
```

This is a policy template, not a ready-to-run profile. The helper must produce escaped, validated exact values and check syntax with the available parser before loading. Use the supported syntax on the measured runner; do not add broad fallback rules to make a parse or launch error disappear.

Here `flags=(unconfined)` is the upstream exact-program exception pattern enabling user namespaces. It is **not** permission to launch the Docker worker with `apparmor=unconfined`, and it does not create a restrictive AppArmor sandbox of its own. Chromium's own process sandbox must still initialize and be observed.

Attaching by path also means software able to replace that executable could benefit from the exception. Restrict it to the trusted, manually dispatched ephemeral job; use no broad cache-directory glob, admit no untrusted PR code, record executable identity, and remove the owned profile afterward. Do not claim the exception has no security cost.

### 6.4 Installation and ownership

Use a unique run-specific profile name and root-owned profile file. Keep a small ownership record outside the coordinator's proof root containing the profile name, exact attachment, content hash, creation/load outcomes, and removal status. Create exclusively and refuse name/path collisions; never replace an existing unrelated system profile. Do not invoke a global AppArmor service restart as a shortcut.

Validate the actual generated profile and load only that profile using the parser. Preserve parse/load errors and actual exit codes. If permission is unavailable or a policy cannot be safely installed, return a measured environment block; never switch to an unsandboxed browser.

The privilege-bearing helper should do only validated profile install/load/remove work. Do not run the coordinator, package installation, browser, or arbitrary test commands as root.

## 7. Prove the selected browser route

After a successful scoped policy setup, launch the **same** pinned executable, as the ordinary runner user, with the same headless mode, narrow environment, and `chromiumSandbox: true` used by the coordinator. Use a disposable profile directory. Run an actual page/render operation on synthetic local content, then close the browser. Keep the probe network-free except for explicitly local content; it does not need any online page.

Evidence must distinguish:

- `sandbox_requested`: configuration says true;
- `launch_succeeded`: a real browser returned a version and performed the operation;
- `sandbox_observed`: runtime diagnostic evidence is present and interpreted;
- `policy_changed`: whether an owned AppArmor profile was installed;
- `selected_executable`: path and hash actually used.

Do not set `sandbox_observed=true` merely because the option is true or because the process did not crash. Collect supported Chromium sandbox diagnostics, a minimal `chrome://sandbox` result, and/or relevant browser/renderer process namespace/seccomp facts. Explain which facts support the result. Do not require the obsolete SUID sandbox specifically: a successful user-namespace sandbox is the intended route. Container seccomp alone is not proof of Chromium renderer sandboxing. Where a diagnostic surface is unavailable, retain null/unknown and disclose exactly what was demonstrated.

When checking runtime arguments, inspect actual launch/process data and known bypass switches, not a naive substring check against all log text: the historical error messages themselves mention forbidden switches. Do not add bypass switches to make diagnostic collection work.

Keep the host policy active through all host-side test-browser lifetimes. A probe using one executable while E2E silently launches another does not qualify the pipeline.

## 8. Workflow integration without another directory collision

The workflow owns bootstrap/provisioning records. The coordinator owns its fresh `proof` root. Put pre-coordinator sandbox records under the outer bootstrap public/private siblings or the existing runner-temp fallback, never under `CH001_EVIDENCE_ROOT` before ownership is acquired.

Preserve all twelve R5 boundary regressions, refusal behavior, failure-report ownership checks, and fresh run-ID rules. A new sandbox helper must not pre-create `proof/public`, consume an old proof directory, delete historical evidence, or implicitly resume a run.

The workflow must capture actual provisioning, coordinator, reporting, upload, and cleanup outcomes separately. It may allow the coordinator to run after a failed policy prerequisite so that the existing coordinator produces its own honest blocked report; record that choice and preserve the provisioning failure. Do not silently treat a helper/configuration bug as a benign environment failure.

If the coordinator was never invoked, retain `proof_invoked=false` and `proof_exit_code=null`. An outer prerequisite exit 2 is not a fictional coordinator exit 2. If it ran, capture its actual exit, including 1 versus 2. A summary/upload step must not overwrite the primary failure with apparent success.

A policy cleanup failure is a real secondary problem and must be visible even if the bounded proof passed. Do not turn an incomplete cleanup record into an acceptance claim.

## 9. Cleanup and isolation

Implement an always-run cleanup path that removes only profiles/files created and loaded by this run, after the relevant browsers are stopped. Validate ownership and expected hashes before removal. Refuse to remove unknown or modified files/profiles and report the refusal. Cleanup must be idempotent and safe after partial setup or failure.

Record before/after host restriction values and confirm they were not globally altered. No `/etc/sysctl.d` changes, global service disabling, unrelated profile edits, root browser processes, or persistent user-installation changes are authorized.

The ephemeral hosted VM's eventual destruction is a fallback property, not a substitute for a cleanup implementation and receipt. Cancellation may prevent final evidence; such a run stays incomplete, never silently successful.

## 10. Existing bounded proof, once

After the new implementation is committed and locally checked, the router publishes T6/E6, verifies exact source/workflow identities, and dispatches at most one new workflow using T6. Follow `04_ROUTER_HANDOFF.md`.

Exercise the existing proof profile: host preflight/static checks, shipped Compose setup, worker browser/readiness, authenticated seven-slide journey, alternate ratio, JPEG-preview/export byte equality, and same-data restart/lifecycle checks. Do not reduce the required artifacts or convert the bounded proof into full acceptance.

Explicitly distinguish host browser qualification from the in-container worker. Keep the worker's non-root user, no-new-privileges, dropped capabilities, existing AppArmor/seccomp posture, and sandboxed launch. If its sandbox fails under the unchanged shipped settings, capture the container/image/security-option identity and the exact error. A host AppArmor fix is not evidence of a worker fix.

The next distinct application/container failure stops this phase for architect review. Do not continue modifying code and repeatedly dispatching under the same authorization. This packet authorizes fixing the known host prerequisite and recording the next real outcome, not an unlimited repair campaign.

## 11. Reports and delivery

Create `handoffs/CH-001R-r6.md` and `docs/evidence/CH-001R-r6/`. Update root operational state and evidence indexes without altering historical r1–r5 reports. Keep original finding dispositions honest and application acceptance false.

T6 contains execution-affecting changes, including workflow/helpers/config/tests. E6 contains evidence/docs/state only. Any execution-affecting edit after T6 produces a new tested implementation identity; never attach T6 results to different code.

Local fixtures for policy generation, report propagation, and cleanup may use fake executors. Mark them as local/helper evidence. They are not hosted AppArmor, browser, worker, or application proof.

Return `READY_FOR_ROUTER_PUBLISH / NEEDS_WORKFLOW_DISPATCH` only when the scoped implementation and local regressions are complete. Return `BLOCKED` with the exact remaining cause otherwise. After the router's result, do not mark v0.1 accepted; stop for architect review.


## 03_TESTS_AND_EVIDENCE.md

# r6 tests, runtime qualification, and evidence

## Evidence classes and ownership

This checklist is for the r6 repair, not a replacement for `CH001-001` through `CH001-072`. Record real results in `docs/evidence/CH-001R-r6/r6-results.json` and preserve the old gate ledgers. Local deterministic tests may substantiate helper behavior; hosted cases require actual hosted evidence.

Use the blank [checklist template](templates/r6-checklist.template.json). Every new row begins `NOT_RUN`. Do not copy this packet's artifact-integrity passes into Luna's runtime checklist.

## Deterministic local regressions

| ID | Required behavior | Evidence |
|---|---|---|
| R6-T01 | Resolver selects the installed pinned managed browser and records its canonical path/hash. A same-name system binary is not accepted. | Real temporary filesystem fixtures plus resolver tests. |
| R6-T02 | Reject outside-root targets, escaping symlinks, globs, newlines, profile-language injection, and command injection. Correctly quote supported space-containing paths. | Positive and negative fixtures; no privileged writes. |
| R6-T03 | Identity/pin drift and executable changes between resolution and launch fail closed rather than using stale authorization. | Deliberate drift/mutation fixtures. |
| R6-T04 | Generated profile has a unique name, exact attachment and intended userns rule, with no directory wildcard or arbitrary appended policy. | Structured output assertions; hosted parser validation is separate. |
| R6-T05 | Privileged provisioning is refused outside explicitly opted-in, identity-checked, manually dispatched standard-hosted Linux context. Probe-only mode stays unprivileged. | Injected environment/executor tests including editing-box/self-hosted refusal. |
| R6-T06 | Already-working sandbox requests no unnecessary policy. A confirmed unavailable prerequisite is distinguished from a malformed-helper/configuration error. | Deterministic decision tests with explicit outcomes. |
| R6-T07 | Existing profile/file collision is refused without replacement or deletion; partial installs track what this invocation actually owns. | Temporary fixtures and recorded executor calls. |
| R6-T08 | Cleanup removes only owned, unchanged resources; unknown/mutated resources are preserved; repeated cleanup is harmless and reported. | Hash preservation and positive/negative cleanup tests. |
| R6-T09 | All qualified launch paths retain sandbox=true and report requested, launched, and observed states separately; a config boolean alone never proves runtime isolation. | Launch-option/observation tests including null/unknown cases. |
| R6-T10 | Coordinator, host E2E/render tests, and direct launch helpers select the qualified executable or explicitly enumerate a separately qualified managed binary. | Call-site mapping plus tests for full-Chrome/headless-shell mismatch. |
| R6-T11 | Pre-coordinator provisioning does not create/write the proof root; all twelve prior boundary cases remain passing. | Execute the existing boundary suite and workflow-boundary integration regression. |
| R6-T12 | Not-invoked proof has null exit; real child exits 1 and 2 stay distinct; reporting/cleanup problems cannot erase the primary failure. | Execute the previous CI suite plus new prerequisite/cleanup propagation tests. |
| R6-T13 | Node/pnpm/Playwright/lock/native manifest and application pins remain unchanged. No new provider, bypass flag, broad host policy, or container security relaxation appears. | Exact hashes and scoped diff review, not only dependency names. |
| R6-T14 | The code awaiting publication passes syntax checks, lint, typecheck, build, unit, security, existing CI tests, and new focused regressions, with nonzero real test counts. | Timestamped command logs and native reporter counts. |

## Hosted and router cases

| ID | Required behavior | Evidence |
|---|---|---|
| R6-T15 | On the approved hosted runner, measure the default failure or default success, apply only the permitted policy when needed, then run the pinned browser sandboxed as non-root with usable runtime diagnostics. | OS/policy before-after record, profile hash, executable hash, launch args/outcome, synthetic render, observed sandbox facts. |
| R6-T16 | Owned policy cleanup actually occurs after browser shutdown; global restrictions and unrelated profiles are not altered. | Owned-resource receipt, before-after values, parser removal result; note unobserved cancellation cases. |
| R6-T17 | The shipped worker's own browser completes a sandboxed launch under its actual non-root container configuration. | Image/container identity, effective security options, selected browser, launch/runtime evidence. Never infer from R6-T15. |
| R6-T18 | Existing bounded application proof produces the real canonical seven-slide ZIP, alternate-format ZIP, preview byte comparisons, screenshots, and restart/lifecycle evidence. | Fresh matching coordinator/command/suite reports and actual artifacts. |
| R6-T19 | Router retrieves the new artifact independently, confirms length/digest/identities, validates referenced payloads, and appends a post-delivery receipt without rewriting the archive. | Run/attempt/job/artifact IDs, digest, expiry, payload checks, receipt commit. |
| R6-T20 | Final handoff/state preserves historical evidence, no feature/scope drift, `application_acceptance=false`, accepted version none, and awaiting review. | T6/E6 diffs, state, action declaration, strict versus bounded distinction. |

A newly observed worker/application failure may leave R6-T17 or R6-T18 incomplete. That is a truthful phase result requiring architect review, not permission to mark the repair or application fully qualified. A passing R6-T15 with a blocked R6-T17 establishes a host-only fix.

## Commands to execute and record

Keep the project's existing pinned/native bootstrap. Record actual commands, UTC start/end, exit codes, test counts, source commit/tree, and logs:

```text
node --check <new or changed .mjs helpers>
pnpm test:ci
<explicit new sandbox-regression entry point, if not included above>
pnpm lint
pnpm typecheck
pnpm build
pnpm test:unit
pnpm test:security
git diff --check
```

Where dependencies need installation, use the existing verified native pnpm and `pnpm install --frozen-lockfile`, with lock hash before/after. No install is needed merely to make an already verified working tree look active.

A restricted editing host may run one fresh diagnostic bounded proof when useful and permitted, reporting its real environment limitation. Do not repeatedly run Docker/loopback probes known unavailable, or generate an old result into a reused directory. Do not rerun the full strict verifier expecting acceptance on that host.

The router's fresh hosted run executes the existing `pnpm proof:ch001` route with the new T6. The strict `pnpm verify:ch001` remains a separate acceptance contract; it is not changed to equate a bounded proof with all 72 gates passed.

## Minimum new sandbox report

A new sanitized report must bind the following concepts. Field names may fit the existing schema; do not invent measurements to fill them:

```json
{
  "phase": "CH-001R-r6",
  "run_id": "actual-run-key",
  "implementation_commit": "actual-full-T6-sha",
  "workflow_definition_commit": "actual-workflow-commit",
  "context": "host-proof-browser",
  "selected_executable": {"path": "measured", "sha256": "measured"},
  "uid": null,
  "apparmor_enabled": null,
  "restriction_before": null,
  "restriction_after": null,
  "default_probe": {"launch_succeeded": false, "error": "actual-or-null"},
  "policy": {"changed": false, "profile_name": null, "sha256": null, "loaded": false},
  "qualified_probe": {
    "sandbox_requested": true,
    "launch_succeeded": false,
    "sandbox_observed": null,
    "browser_version": null,
    "diagnostic_evidence": []
  },
  "cleanup": {"status": "NOT_RUN", "owned_resources_removed": null},
  "application_acceptance": false
}
```

This is illustrative, not an executed report. Separate the worker context into its own record. Missing/unavailable measurements are null with a reason, not false successes. A profile load is not a browser launch; a browser launch is not a seven-slide journey.

## Failure and downstream-artifact semantics

For a prerequisite block before a producing stage runs, retain that producer's NOT_RUN state and name the blocker. Do not generate placeholder ZIPs, synthetic success screenshots, or zero-case suite passes. Existing missing-artifact diagnostics may remain, but make their dependency clear.

For a producer that actually runs and claims success but fails to create required output, fail the proof. A successful exit with missing canonical output, zero discovered tests, mismatched identity, stale reports, or invalid hashes is not a usable success.

Keep the primary error readable. Missing expected exports after the host browser never launched must not obscure the sandbox diagnosis. Conversely, an unrelated assertion failure after the browser succeeds must not be relabeled as that earlier environment problem.

## Evidence delivery

Use only synthetic/local data. Keep private env files, authentication storage, cookies, credentials, raw host/process dumps, and unredacted logs out of public upload paths. The new preflight record belongs outside `proof` before coordinator ownership.

The public archive may be a pre-upload snapshot of delivery fields. Preserve it byte-for-byte and add an independent router receipt with actual upload and retrieval metadata. Do not solve receipt self-reference by modifying the archived JSON and reusing the original digest. Cleanup evidence created after an initial upload must be included in a separate explicitly named receipt artifact or preserved by the router from actual job output; do not claim it was in the earlier archive.

Retain all 72 original gate IDs and their actual evidence. The new 20-row r6 checklist does not waive their requirements, replace their statuses, or close original review findings.


## 04_ROUTER_HANDOFF.md

# Router protocol — T6 publication and one fresh proof

## 1. Roles

The architect issues this scoped assignment. Luna implements/tests and returns T6/E6. The router uses its existing workflow-capable publication path, verifies exact identities, dispatches at most one new hosted run, retrieves evidence, and returns the result. Application acceptance remains reserved for architect review.

The packet author has not sent this assignment to an external agent, pushed a commit, changed settings, or dispatched a workflow.

## 2. Publication checks

P6 is the actual commit that imports this approved packet after the recorded T5 artifact baseline. T6 is the new execution-affecting implementation; E6 is documentation/evidence only. Record all three full SHAs and trees. Do not invent them in advance or require an evidence commit to contain its own self-referential SHA.

Verify that the preserved baseline `6f600381c72bc68bc550e69ab0e86d522a81a389` is an ancestor and that unrelated work was not overwritten. Do not amend, force-push, or reuse T5 as if it contained the new policy repair.

Before dispatch, establish:

- T6 and E6 exist on `origin/main`, and T6 is an ancestor of E6.
- T6→E6 changes only docs/state/evidence, not workflow/helpers/config/tests.
- The workflow definition on the dispatch ref contains the authorized policy and cleanup behavior.
- Its execution-affecting workflow content matches the intended T6 version, or any difference is explicitly reviewed before execution.
- Pin and lockfile hashes remain unchanged.
- The new helper tests and all R5 regressions were really executed against T6.
- No new execution-affecting changes happened after the tested T6.

A workflow-capability error is a publication blocker, not a reason to strip checks or request broad tokens. Use the already authorized router path. Never expose credentials in the handoff.

## 3. Exact one-dispatch rule

Dispatch exactly one new workflow for the newly published T6, using full SHAs and the existing workflow name. The following is a router template, not a command already run:

```bash
set -euo pipefail
REPO=klole/reel-farm
T6=REPLACE_WITH_ACTUAL_FULL_T6_SHA
E6=REPLACE_WITH_ACTUAL_FULL_E6_SHA

[[ "$T6" =~ ^[0-9a-f]{40}$ && "$E6" =~ ^[0-9a-f]{40}$ ]]
git fetch origin main
git cat-file -e "$T6^{commit}"
git cat-file -e "$E6^{commit}"
git merge-base --is-ancestor "$T6" "$E6"
git merge-base --is-ancestor "$E6" origin/main

# Inspect the T6..E6 diff and capture the workflow identity before proceeding.
git diff --name-status "$T6" "$E6"
gh api "repos/$REPO/contents/.github/workflows/ch001-live-proof.yml?ref=main" --jq .sha

gh workflow run ch001-live-proof.yml \
  --repo "$REPO" --ref main -f implementation_sha="$T6"
```

Do not run the template twice because the CLI does not immediately print a run URL. Find the new run using dispatch time, actor, event, workflow, input and checkout identities. Confirm the requested SHA in the actual reports/logs, not merely the workflow's head SHA; those are different identities by design.

Do not rerun T3, T4 run `34669975078`, T5 run `34671716094`, or the older failure `34665615514`. A new arbitrary run ID without code repair would not address the sandbox policy.

## 4. Observe the actual result

Record the new run ID, attempt, job, head/workflow-definition commit, workflow blob/hash, requested implementation, actual checkout, and tree. A completed Actions failure can represent a measured environment block; read the coordinator and outer reports rather than inferring from the icon.

Inspect the host policy record, before/after sandbox evidence, cleanup receipt, bootstrap report, coordinator result, command/suite reports, gate ledger, and actual payload files. Record whether the shipped worker browser ran and whether the application journey really started.

Outcome decisions:

| Observed outcome | Router disposition |
|---|---|
| Setup/refusal/configuration error before proof | Preserve real stage/exit and null absent-proof fields; return for review. |
| Host sandbox still unavailable | Preserve targeted policy/launch diagnostics and unchanged global settings; stop. |
| Host sandbox passes; worker sandbox or image fails | Report separate worker/image context and evidence; stop. Do not weaken container isolation. |
| Browser prerequisites pass; application assertion fails | Preserve actual assertion and source identity; stop. No unrelated fix/redispatch loop. |
| Bounded proof succeeds with valid artifacts | Return `LIVE_PROOF_READY_FOR_REVIEW`; keep application acceptance false. |
| Artifact delivery, evidence integrity, cleanup, or identity is incomplete | Record the secondary blocker; do not promote to acceptance. |

## 5. Preserve the artifact and post-delivery receipt

Download the actual Actions archive, record its byte length and SHA-256, compare with Actions' digest, and verify payload references and hashes. Retain the archived bytes unchanged. Never create a download link or receipt for an artifact that does not exist.

Preserve under a new run-specific `architect/` evidence path or the established durable artifact mechanism. If a small public ZIP is committed, include only sanitized synthetic proof data. Do not overwrite the T5 archive or `architect/ch001r5-live-proof-34671716094/`.

Append a router receipt binding archive digest, run/attempt/job IDs, final outcome, actual source/workflow identities, cleanup outcome, and explicit artifact expiry. A metadata-only E6 receipt may be followed by a router artifact commit; give it a separate real SHA.

Do not copy the old 4/0/68 counts into the new run. Count the newly produced ledger. If no new ledger exists because the coordinator did not reach it, record the current run's gate counts as unavailable and cite historical counts separately.

## 6. Return message

Use a compact update containing:

```text
CH-001R-r6 router outcome
P6 / T6 / E6 / router artifact commit: actual full identities
Run / attempt / job / workflow definition: actual identities
Bootstrap: actual result
Host sandbox: actual default + qualified launch/observation
Owned policy cleanup: actual result
Worker sandbox: actual result or NOT_RUN
Proof invoked / actual proof exit / classification: actual values
Current run gate counts: actual ledger or unavailable
Artifact ID / name / bytes / digest / expiry: actual values
Canonical export/preview/lifecycle: actual files or NOT_RUN with cause
Primary blocker: exact observed error or none
application_acceptance=false; root awaiting_review; accepted version none
Dispatch count: 1 (or 0 if publication blocked)
```

Do not begin the next chapter. Successful host qualification is progress, not application acceptance. Successful bounded application proof is reviewable evidence, not automatic satisfaction of the strict checkpoint.


## 05_SOURCES_AND_IDENTITIES.md

# Sources and identity rules

## Reviewed evidence versus proposed work

All historical claims in this packet are tied to the T5 artifact and pinned repository files below. The repository and Actions data were read through the GitHub connection. The archive was downloaded and locally checked. The external technical references were consulted through primary documentation.

The AppArmor repair is proposed, not live-tested by the packet author. The current artifact proves launch failure but does not directly measure the exact AppArmor denial. r6 supplies that missing measurement and qualification.

Do not use an upstream moving page as proof that this repository or runner already implements a feature. Pin implementation choices in the repository and retain actual runtime evidence. No package upgrades are authorized by newer documentation examples.

## Baseline hashes

```text
North Star SHA-256: 3175b197c221588fa92273c9f8403ecbcc2357fe486f63a97365205d951ad80d
Node: 20.19.2
pnpm: 12.3.4
Playwright: 1.63.0
Lock SHA-256: 9c49bf356bdd523623b79cf6096df83de51f06b358bffa88391700a4c5719d70
package.json SHA-256 (E5 handoff): cb1e1a5c2ec11ecc7d397c9aa7700d76841cede38615656e3e273f34b140dbd0
Native manifest SHA-256 (E5 handoff): fb6212a43173722f565a4101c311b23b54b7204f4828e0c62e9b9f7af1a8bd6d
T5 workflow blob: 50774746e3ead4922b265af6652a942302743062
T5 workflow SHA-256: a9f2a8b3901a86bf3d5fa8f392cc02188785dde8d3e6785bd6243f3f1f6af4ef
T5 archive SHA-256: 89d18eebcbd629c7a504151c85a558610039052447baf21d82d00595227f96bb
```

The T5 workflow and archive hashes are also present in the retrieved records. Recompute working-tree hashes before T6; the handoff's package/native hashes are a preservation baseline, not a statement that this reviewer executed a fresh install.

## Source register

### S01 — Actions run, attempt 1

[Actions run, attempt 1](https://github.com/klole/reel-farm/actions/runs/34671716094)

Completed hosted failure; workflow head E5, run/attempt identity.

### S02 — Actions artifact metadata

[Actions artifact metadata](https://api.github.com/repos/klole/reel-farm/actions/artifacts/10290953048)

Archive ID, size, digest, expiry; independently downloaded in this review.

### S03 — Committed router receipt

[Committed router receipt](https://github.com/klole/reel-farm/blob/6f600381c72bc68bc550e69ab0e86d522a81a389/architect/ch001r5-live-proof-34671716094/ROUTER_RECEIPT.md)

Publication/dispatch and preservation record.

### S04 — Committed proof result

[Committed proof result](https://github.com/klole/reel-farm/blob/6f600381c72bc68bc550e69ab0e86d522a81a389/architect/ch001r5-live-proof-34671716094/proof/public/proof-result.json)

BLOCKED_ENVIRONMENT; exit 2; 4/0/68 ledger and downstream missing artifacts.

### S05 — Committed environment record

[Committed environment record](https://github.com/klole/reel-farm/blob/6f600381c72bc68bc550e69ab0e86d522a81a389/architect/ch001r5-live-proof-34671716094/proof/public/environment.json)

Installed managed executable; Docker/loopback available; sandbox launch error.

### S06 — E5 handoff

[E5 handoff](https://github.com/klole/reel-farm/blob/a27bb4bbae78cd618e2ccf6c14a6593df7f83554/handoffs/CH-001R-r5.md)

r5 scope, local results, fixed dependency hashes, implementation identity.

### S07 — T5 boundary helper

[T5 boundary helper](https://github.com/klole/reel-farm/blob/6849b39f4e3c7a03b5f132418b1d33cc84c98d51/scripts/ch001-proof-boundary.mjs)

Nonempty-root guard, coordinator-owned paths, owned failure reporting.

### S08 — Chromium: AppArmor user-namespace restrictions

[Chromium: AppArmor user-namespace restrictions](https://chromium.googlesource.com/chromium/src/+/main/docs/security/apparmor-userns-restrictions.md)

Primary explanation and targeted exact-program userns exception; global bypass alternatives are not authorized.

### S09 — Ubuntu security: AppArmor

[Ubuntu security: AppArmor](https://documentation.ubuntu.com/security/security-features/privilege-restriction/apparmor/)

Primary description of AppArmor userns restrictions and explicit profile allowance.

### S10 — Ubuntu 24.04 release notes

[Ubuntu 24.04 release notes](https://discourse.ubuntu.com/t/ubuntu-24-04-lts-noble-numbat-release-notes/39890)

Primary release explanation of restricted unprivileged namespaces and application profile exceptions.

### S11 — Playwright BrowserType API

[Playwright BrowserType API](https://playwright.dev/docs/api/class-browsertype#browser-type-launch-option-chromium-sandbox)

Launch option and distinction between configured sandbox request and execution.

### S12 — Playwright Docker documentation

[Playwright Docker documentation](https://playwright.dev/docs/docker)

Non-root sandboxed container execution and namespace-compatible seccomp; worker is separate from host policy.

### S13 — Docker seccomp documentation

[Docker seccomp documentation](https://docs.docker.com/engine/security/seccomp/)

Default syscall allowlist and namespace restrictions; no blanket disabling authorized.

### S14 — T5 coordinator

[T5 coordinator](https://github.com/klole/reel-farm/blob/6849b39f4e3c7a03b5f132418b1d33cc84c98d51/scripts/ch001-proof.ts)

Host facts/preflight, executable override, worker probe, bounded artifact requirements.

### S15 — T5 Playwright config

[T5 Playwright config](https://github.com/klole/reel-farm/blob/6849b39f4e3c7a03b5f132418b1d33cc84c98d51/playwright.config.ts)

Explicit sandbox true and conditional executablePath on host tests.

### S16 — T5 Compose configuration

[T5 Compose configuration](https://github.com/klole/reel-farm/blob/6849b39f4e3c7a03b5f132418b1d33cc84c98d51/compose.yaml)

Separate non-root worker; no-new-privileges and dropped capabilities retained.

### S17 — T5 Dockerfile

[T5 Dockerfile](https://github.com/klole/reel-farm/blob/6849b39f4e3c7a03b5f132418b1d33cc84c98d51/Dockerfile)

Pinned native bootstrap, runtime browser dependencies, non-root node user.

### S18 — Playwright 1.63.0 seccomp profile

[Playwright 1.63.0 seccomp profile](https://github.com/microsoft/playwright/blob/v1.63.0/utils/docker/seccomp_profile.json)

Reviewed primary contingency: default ERRNO with clone/setns/unshare allowances; not a new authorized worker policy.

## Container contingency is not the selected r6 repair

The Playwright Docker documentation describes a non-root browser and a seccomp profile with namespace-related allowances; the retrieved versioned profile has blob ID `fddc05fb520affb145404e6f6f647ca96af8087d`. Docker documentation independently explains namespace syscall restrictions. These sources justify testing the worker separately. They do not prove T5's worker failed, because T5 never started it, and do not authorize copying an upstream profile blindly over current container policy.

A subsequently observed worker restriction requires a context-specific review of the current default policy, a narrowly documented delta, and measured runtime behavior. Do not add broad privileges or assume host-path AppArmor attachment overrides the container's existing confinement.


## START_PROMPT.md

# Dispatch prompt for Luna MAX — CH-001R-r6

Execute the attached CH-001R-r6 architect packet as a narrow continuation of CH-001, target v0.1.0. Inspect the real repository before changing code.

T5 `6849b39f4e3c7a03b5f132418b1d33cc84c98d51` resolved the evidence-directory initialization collision. Its fresh hosted run `34671716094` reached preflight/static checks but exited 2 as BLOCKED_ENVIRONMENT: the installed pinned Chromium could not launch with its sandbox. The 4 PASS / 0 FAIL / 68 NOT_RUN ledger is not application acceptance. The artifact's AppArmor explanation is strongly supported but lacks direct policy/denial measurements; collect them.

Implement host diagnostics and, only in the explicitly opted-in manually dispatched standard GitHub-hosted Ubuntu job, a temporary exact-managed-executable AppArmor userns exception where required. Keep chromiumSandbox=true, qualify the actual pinned executable used by each host launch path, record effective launch/sandbox evidence, and remove only this run's owned policy afterward. Preserve global restrictions and all Docker isolation defaults. No no-sandbox, global sysctl relaxation, root browser, unconfined container, external browser, provider, publishing, feature, or dependency-upgrade work.

Preserve the working native pnpm bootstrap, all R5 boundary regressions, fresh proof ownership rules, the existing bounded proof profile, and the strict original 72-gate contract. Provisioning must not pre-create the coordinator's proof directory.

Execute local regressions and static checks, create the real tested T6 implementation commit and evidence-only E6, and return the completed r6 handoff. Report unavailable runtime cases honestly. The router—not the editing box—will verify publication and dispatch at most one fresh T6 run. A subsequent worker/app failure returns to architect review rather than broadening the repair. Even bounded hosted success leaves application_acceptance=false, root awaiting_review, and accepted version none.

Deliver code, tests, measured results, and evidence references; do not stop at another plan. Stop at READY_FOR_ROUTER_PUBLISH / NEEDS_WORKFLOW_DISPATCH or an explicit factual blocker. Do not initiate the next chapter or any workflow rerun yourself.


## templates/CH-001R-r6_HANDOFF.md

# Luna/router handoff — CH-001R-r6

> TEMPLATE ONLY. Replace every placeholder with an actual value or null plus reason. Do not claim template rows were executed.

## State

Operational status: `REPLACE_WITH_ACTUAL_STATUS`.

Application acceptance: **false**. Root: `awaiting_review`. Accepted version: `none`. Target: `0.1.0`.

## Source identities

- Baseline: `6f600381c72bc68bc550e69ab0e86d522a81a389`.
- P6 / tree: `ACTUAL`.
- T6 implementation / tree / parent: `ACTUAL`.
- E6 evidence-only commit: returned externally as the commit containing this handoff.
- Workflow definition / blob / SHA-256: `ACTUAL_OR_NOT_YET_DISPATCHED`.
- Native/Node/pnpm/Playwright/lock hashes compared: `ACTUAL`.
- Working tree / preserved unrelated files: `ACTUAL`.

## Scoped changes

List exact execution-affecting files and why each is necessary for host sandbox qualification. Explicitly state whether application code, Dockerfile, Compose defaults, or original gates changed; explain any deviation instead of concealing it.

## Host qualification

- Context and opt-in guard: `ACTUAL`.
- Managed executable / hash / launch-site coverage: `ACTUAL`.
- Default probe: `ACTUAL_OR_NOT_RUN`.
- AppArmor enabled / restrictions / relevant denial: `ACTUAL_OR_NULL_WITH_REASON`.
- Profile installed / exact attachment / profile hash: `ACTUAL_OR_NONE`.
- Qualified probe requested/launched/observed: `ACTUAL`.
- Runtime diagnostic evidence: `ACTUAL_PATHS_OR_NONE`.
- Global policy before/after: `ACTUAL_OR_NOT_RUN`.
- Owned cleanup: `ACTUAL_OR_NOT_RUN`.
- Remaining uncertainty: `ACTUAL`.

## Commands and tests

| Command | Source commit/tree | Environment | Start/end UTC | Exit | Discovered/executed/passed/failed/skipped | Evidence |
|---|---|---|---|---:|---|---|
| ACTUAL | ACTUAL | ACTUAL | ACTUAL | ACTUAL | ACTUAL | ACTUAL |

Include old CI regressions, all R5 boundary cases, new r6 tests, lint, typecheck, build, unit, and security. Distinguish fixture/mock policy tests from actual privileged hosted policy work.

## Hosted outcome — router appends after dispatch

- Run / attempt / job: `null until real dispatch`.
- Requested implementation / actual checkout: `null until observed`.
- Bootstrap / provisioning / worker / proof / cleanup: `ACTUAL_OR_NOT_RUN`.
- Proof invoked: `ACTUAL_BOOLEAN`; proof exit: `null when not invoked`.
- Primary versus downstream errors: `ACTUAL`.
- Fresh 72-gate counts: `ACTUAL_OR_UNAVAILABLE`.
- Artifact ID / name / bytes / digest / expiry: `ACTUAL_OR_NULL`.
- Archive independently downloaded and verified: `ACTUAL`.
- Canonical ZIP, alternate ZIP, preview hashes, screenshots, lifecycle: `ACTUAL_FILES_OR_NOT_RUN`.
- Router artifact/receipt commit: `ACTUAL_OR_NULL`.

## Checklist and evidence

Link the actual `r6-results.json`, command logs, sandbox records, policy cleanup receipt, and evidence index. Preserve T5 records unchanged. Do not attach current-run claims to a historical artifact.

## External actions and stop

Record actual publication path and hosted dispatch count. State whether privileged policy work occurred and on which allowed host. Declare provider/account/publication/deployment/release activity; expected none.

Keep application acceptance false. Return to architect review with the exact outcome and stop.


## templates/r6-checklist.template.json

{
  "record_kind": "UNEXECUTED_TEMPLATE",
  "phase": "CH-001R-r6",
  "implementation_commit": null,
  "evidence_commit": null,
  "run_id": null,
  "application_acceptance": false,
  "accepted_application_version": "none",
  "gates_replaced": false,
  "checks": [
    {
      "id": "R6-T01",
      "evidence_class": "local_regression",
      "requirement": "Resolve and identify pinned managed executable",
      "status": "NOT_RUN",
      "command_or_case": null,
      "actual_evidence": [],
      "reason": "Template only; no T6 execution has occurred."
    },
    {
      "id": "R6-T02",
      "evidence_class": "local_regression",
      "requirement": "Reject unsafe paths, symlink escapes and injection",
      "status": "NOT_RUN",
      "command_or_case": null,
      "actual_evidence": [],
      "reason": "Template only; no T6 execution has occurred."
    },
    {
      "id": "R6-T03",
      "evidence_class": "local_regression",
      "requirement": "Reject identity, pin and executable drift",
      "status": "NOT_RUN",
      "command_or_case": null,
      "actual_evidence": [],
      "reason": "Template only; no T6 execution has occurred."
    },
    {
      "id": "R6-T04",
      "evidence_class": "local_regression",
      "requirement": "Generate exact scoped AppArmor profile",
      "status": "NOT_RUN",
      "command_or_case": null,
      "actual_evidence": [],
      "reason": "Template only; no T6 execution has occurred."
    },
    {
      "id": "R6-T05",
      "evidence_class": "local_regression",
      "requirement": "Guard privileged setup to approved hosted context",
      "status": "NOT_RUN",
      "command_or_case": null,
      "actual_evidence": [],
      "reason": "Template only; no T6 execution has occurred."
    },
    {
      "id": "R6-T06",
      "evidence_class": "local_regression",
      "requirement": "Avoid unnecessary policy and classify failures honestly",
      "status": "NOT_RUN",
      "command_or_case": null,
      "actual_evidence": [],
      "reason": "Template only; no T6 execution has occurred."
    },
    {
      "id": "R6-T07",
      "evidence_class": "local_regression",
      "requirement": "Preserve colliding resources and track partial ownership",
      "status": "NOT_RUN",
      "command_or_case": null,
      "actual_evidence": [],
      "reason": "Template only; no T6 execution has occurred."
    },
    {
      "id": "R6-T08",
      "evidence_class": "local_regression",
      "requirement": "Remove only owned unchanged resources idempotently",
      "status": "NOT_RUN",
      "command_or_case": null,
      "actual_evidence": [],
      "reason": "Template only; no T6 execution has occurred."
    },
    {
      "id": "R6-T09",
      "evidence_class": "local_regression",
      "requirement": "Distinguish requested, launched and observed sandbox",
      "status": "NOT_RUN",
      "command_or_case": null,
      "actual_evidence": [],
      "reason": "Template only; no T6 execution has occurred."
    },
    {
      "id": "R6-T10",
      "evidence_class": "local_regression",
      "requirement": "Align actual managed launch targets across proof callers",
      "status": "NOT_RUN",
      "command_or_case": null,
      "actual_evidence": [],
      "reason": "Template only; no T6 execution has occurred."
    },
    {
      "id": "R6-T11",
      "evidence_class": "local_regression",
      "requirement": "Preserve all prior directory-boundary regressions",
      "status": "NOT_RUN",
      "command_or_case": null,
      "actual_evidence": [],
      "reason": "Template only; no T6 execution has occurred."
    },
    {
      "id": "R6-T12",
      "evidence_class": "local_regression",
      "requirement": "Preserve nullable exits and primary failure semantics",
      "status": "NOT_RUN",
      "command_or_case": null,
      "actual_evidence": [],
      "reason": "Template only; no T6 execution has occurred."
    },
    {
      "id": "R6-T13",
      "evidence_class": "source_and_regression",
      "requirement": "Preserve pins, scope and security defaults",
      "status": "NOT_RUN",
      "command_or_case": null,
      "actual_evidence": [],
      "reason": "Template only; no T6 execution has occurred."
    },
    {
      "id": "R6-T14",
      "evidence_class": "executed_commands",
      "requirement": "Pass actual local command/regression checks",
      "status": "NOT_RUN",
      "command_or_case": null,
      "actual_evidence": [],
      "reason": "Template only; no T6 execution has occurred."
    },
    {
      "id": "R6-T15",
      "evidence_class": "hosted_runtime",
      "requirement": "Measure and qualify the sandboxed host browser",
      "status": "NOT_RUN",
      "command_or_case": null,
      "actual_evidence": [],
      "reason": "Template only; no T6 execution has occurred."
    },
    {
      "id": "R6-T16",
      "evidence_class": "hosted_runtime",
      "requirement": "Prove owned cleanup and unchanged global restrictions",
      "status": "NOT_RUN",
      "command_or_case": null,
      "actual_evidence": [],
      "reason": "Template only; no T6 execution has occurred."
    },
    {
      "id": "R6-T17",
      "evidence_class": "hosted_runtime",
      "requirement": "Qualify the shipped worker browser separately",
      "status": "NOT_RUN",
      "command_or_case": null,
      "actual_evidence": [],
      "reason": "Template only; no T6 execution has occurred."
    },
    {
      "id": "R6-T18",
      "evidence_class": "hosted_application",
      "requirement": "Execute the existing bounded slideshow proof",
      "status": "NOT_RUN",
      "command_or_case": null,
      "actual_evidence": [],
      "reason": "Template only; no T6 execution has occurred."
    },
    {
      "id": "R6-T19",
      "evidence_class": "router_receipt",
      "requirement": "Independently retrieve and verify new hosted artifact",
      "status": "NOT_RUN",
      "command_or_case": null,
      "actual_evidence": [],
      "reason": "Template only; no T6 execution has occurred."
    },
    {
      "id": "R6-T20",
      "evidence_class": "state_and_scope",
      "requirement": "Preserve awaiting review and nonacceptance",
      "status": "NOT_RUN",
      "command_or_case": null,
      "actual_evidence": [],
      "reason": "Template only; no T6 execution has occurred."
    }
  ]
}


## review/T5_ARTIFACT_INSPECTION.json

{
  "review_kind": "READ_ONLY_ARCHIVE_AND_PINNED_SOURCE_REVIEW",
  "application_tests_executed_by_architect": false,
  "workflow_dispatched_by_architect": false,
  "repository_modified_by_architect": false,
  "repository": "klole/reel-farm",
  "implementation_commit": "6849b39f4e3c7a03b5f132418b1d33cc84c98d51",
  "evidence_commit": "a27bb4bbae78cd618e2ccf6c14a6593df7f83554",
  "router_artifact_commit": "6f600381c72bc68bc550e69ab0e86d522a81a389",
  "run_id": 34671716094,
  "attempt": 1,
  "job_id": 103494183389,
  "artifact_id": 10290953048,
  "artifact_name": "ch001-live-proof-34671716094-1",
  "archive_bytes": 50693,
  "archive_sha256": "89d18eebcbd629c7a504151c85a558610039052447baf21d82d00595227f96bb",
  "archive_sha256_matches_actions_metadata": true,
  "archive_file_entries": 39,
  "manifest_payload_count": 25,
  "manifest_payloads_valid": true,
  "payload_checks": [
    {
      "path": "artifacts/ch001r4/r4-34671716094-1/proof/public/command-report.json",
      "bytes": 24013,
      "sha256": "eca9954e147dc6d828fdbf289f193adb9fa1dd1e5f1df807ae06a6eab5cf8d5f",
      "bytes_match": true,
      "sha256_match": true
    },
    {
      "path": "artifacts/ch001r4/r4-34671716094-1/proof/public/commands/001-docker-version.log",
      "bytes": 7,
      "sha256": "6bd60857f0062defe4edbffc3b3e49ecd7b055a2598326793fc1cfb435587e0d",
      "bytes_match": true,
      "sha256_match": true
    },
    {
      "path": "artifacts/ch001r4/r4-34671716094-1/proof/public/commands/002-docker-info.log",
      "bytes": 7,
      "sha256": "6bd60857f0062defe4edbffc3b3e49ecd7b055a2598326793fc1cfb435587e0d",
      "bytes_match": true,
      "sha256_match": true
    },
    {
      "path": "artifacts/ch001r4/r4-34671716094-1/proof/public/commands/003-compose-version.log",
      "bytes": 7,
      "sha256": "278ec87a75ab3da08b3b34c6d9e678df7a3c71298d2f3ea3880f078e1b71b1e3",
      "bytes_match": true,
      "sha256_match": true
    },
    {
      "path": "artifacts/ch001r4/r4-34671716094-1/proof/public/commands/004-host-lint.log",
      "bytes": 11,
      "sha256": "050c69da23536758722729aeda55a8d0fb9d557495ef6d33d70873a3b64a71c1",
      "bytes_match": true,
      "sha256_match": true
    },
    {
      "path": "artifacts/ch001r4/r4-34671716094-1/proof/public/commands/005-host-typecheck.log",
      "bytes": 62,
      "sha256": "f6e04c1d444f9763504feca2dbbdf170e0f84adc9fd976d9e449a6146b533b4f",
      "bytes_match": true,
      "sha256_match": true
    },
    {
      "path": "artifacts/ch001r4/r4-34671716094-1/proof/public/commands/006-host-build.log",
      "bytes": 2154,
      "sha256": "7eb5ab6af36bf52b9ac737e8490e7ccc1b128e3f5f499cf95e9b6b23afdd258e",
      "bytes_match": true,
      "sha256_match": true
    },
    {
      "path": "artifacts/ch001r4/r4-34671716094-1/proof/public/commands/007-host-unit.log",
      "bytes": 842,
      "sha256": "6c5bb6b72176c51b096893ecda3857b65f104fb7c652f34143c5d4406a6d7280",
      "bytes_match": true,
      "sha256_match": true
    },
    {
      "path": "artifacts/ch001r4/r4-34671716094-1/proof/public/commands/008-host-security.log",
      "bytes": 639,
      "sha256": "fbacb67b984153a52bef18b58b69448588165f0687eafcafac6322352c4c41be",
      "bytes_match": true,
      "sha256_match": true
    },
    {
      "path": "artifacts/ch001r4/r4-34671716094-1/proof/public/commands/compose.log",
      "bytes": 58,
      "sha256": "f3663014902590b2b6210e548f27ea03e0e70f4b1f3d50bf938a79ae265a3e3f",
      "bytes_match": true,
      "sha256_match": true
    },
    {
      "path": "artifacts/ch001r4/r4-34671716094-1/proof/public/dispatch.json",
      "bytes": 401,
      "sha256": "19cb9ac40623476af6bb4edde0505a8d3da19cfd1938f5bc917e6383a2252664",
      "bytes_match": true,
      "sha256_match": true
    },
    {
      "path": "artifacts/ch001r4/r4-34671716094-1/proof/public/environment.json",
      "bytes": 7440,
      "sha256": "a5a06feb0268b72844c9d74ec632e96323c5ad6e38d793815fa6edd684e54697",
      "bytes_match": true,
      "sha256_match": true
    },
    {
      "path": "artifacts/ch001r4/r4-34671716094-1/proof/public/finding-dispositions.json",
      "bytes": 4423,
      "sha256": "7be3ce3eda661522209fb59b30eae2c0f77a2c5fd8a83f0048eace9001952e0b",
      "bytes_match": true,
      "sha256_match": true
    },
    {
      "path": "artifacts/ch001r4/r4-34671716094-1/proof/public/sanitization.json",
      "bytes": 371,
      "sha256": "6eb18d043890339d376d7239c652800656a03bf98ebff8383b8d7b2cbe3be48e",
      "bytes_match": true,
      "sha256_match": true
    },
    {
      "path": "artifacts/ch001r4/r4-34671716094-1/proof/public/security-results.json",
      "bytes": 2140,
      "sha256": "60c7d6a0a92d94413b079f62745ecca390b94d716133844b37dc93aaf9e1d8de",
      "bytes_match": true,
      "sha256_match": true
    },
    {
      "path": "artifacts/ch001r4/r4-34671716094-1/proof/public/smoke-results.json",
      "bytes": 165,
      "sha256": "f2d91a706e3f4a076e26a3eb90ac24f338d151ac66f54dff7fb9dda9189261fd",
      "bytes_match": true,
      "sha256_match": true
    },
    {
      "path": "artifacts/ch001r4/r4-34671716094-1/proof/public/source-review.md",
      "bytes": 780,
      "sha256": "0eebcff4ae5640fde55afcfe2316cb3e10a03762220815c02634720a8b9a8d05",
      "bytes_match": true,
      "sha256_match": true
    },
    {
      "path": "artifacts/ch001r4/r4-34671716094-1/proof/public/suite-e2e-unavailable.log",
      "bytes": 5804,
      "sha256": "bb252c4de10f05f0529334c47e0fca23cbb6551c782d2612f1ab1b28223b7ebd",
      "bytes_match": true,
      "sha256_match": true
    },
    {
      "path": "artifacts/ch001r4/r4-34671716094-1/proof/public/suite-e2e.json",
      "bytes": 6381,
      "sha256": "859a1561c36356a6874473d717f0c1effaca133f4502ac554610bbdfdaf4ded0",
      "bytes_match": true,
      "sha256_match": true
    },
    {
      "path": "artifacts/ch001r4/r4-34671716094-1/proof/public/suite-integration-unavailable.log",
      "bytes": 5804,
      "sha256": "bb252c4de10f05f0529334c47e0fca23cbb6551c782d2612f1ab1b28223b7ebd",
      "bytes_match": true,
      "sha256_match": true
    },
    {
      "path": "artifacts/ch001r4/r4-34671716094-1/proof/public/suite-integration.json",
      "bytes": 6413,
      "sha256": "fa080d1973e69677db82474434d6c24ead6f44f9889f29a9f3c42c99ef7f5714",
      "bytes_match": true,
      "sha256_match": true
    },
    {
      "path": "artifacts/ch001r4/r4-34671716094-1/proof/public/suite-render-unavailable.log",
      "bytes": 5804,
      "sha256": "bb252c4de10f05f0529334c47e0fca23cbb6551c782d2612f1ab1b28223b7ebd",
      "bytes_match": true,
      "sha256_match": true
    },
    {
      "path": "artifacts/ch001r4/r4-34671716094-1/proof/public/suite-render.json",
      "bytes": 6393,
      "sha256": "44720eedd4cbbadfbcf3d6cf37ac58d099e61efe2ea9684bf64e53ef5cbd824f",
      "bytes_match": true,
      "sha256_match": true
    },
    {
      "path": "artifacts/ch001r4/r4-34671716094-1/proof/public/suite-smoke.json",
      "bytes": 550,
      "sha256": "4ae0eba3fa47e6b735b4fa632d91da9cca9334240d13758ddf4ad9465904592d",
      "bytes_match": true,
      "sha256_match": true
    },
    {
      "path": "artifacts/ch001r4/r4-34671716094-1/proof/public/unit-results.json",
      "bytes": 7226,
      "sha256": "079497c65ac230c52358f87a751140fd67ebfaf2b63b66a43cea6cd9cd39ce1c",
      "bytes_match": true,
      "sha256_match": true
    }
  ],
  "committed_blob_checks": [
    {
      "path": "proof/public/environment.json",
      "expected_git_blob": "94c03625d13e859ef2e1c92df143bcea0352295d",
      "actual_git_blob": "94c03625d13e859ef2e1c92df143bcea0352295d",
      "matches": true
    },
    {
      "path": "proof/public/proof-result.json",
      "expected_git_blob": "89371aa32c515d686a3106f9722c1fb61c06839a",
      "actual_git_blob": "89371aa32c515d686a3106f9722c1fb61c06839a",
      "matches": true
    }
  ],
  "coordinator_status": "BLOCKED_ENVIRONMENT",
  "coordinator_exit_code": 2,
  "outer_classification": "BLOCKED_ENVIRONMENT",
  "bootstrap_status": "PASS",
  "gate_counts": {
    "NOT_RUN": 68,
    "PASS": 4
  },
  "source_only_pass_ids": [
    "CH001-067",
    "CH001-068",
    "CH001-069",
    "CH001-072"
  ],
  "application_acceptance": false,
  "primary_observation": "Pinned managed Chromium exists but sandboxed host launch aborts with No usable sandbox. AppArmor/userns cause strongly indicated; policy/denial measurements not present.",
  "hosted_live_application_suites_executed": false,
  "repair_proposed_not_executed": "Exact-path temporary hosted AppArmor userns exception with measured launch and owned cleanup."
}


## PACK_VALIDATION.json

{
  "validation_kind": "DOCUMENT_AND_HISTORICAL_ARTIFACT_INTEGRITY_ONLY",
  "application_tests_executed": false,
  "new_sandbox_policy_executed": false,
  "new_workflow_dispatched": false,
  "check_count": 20,
  "pass_count": 20,
  "failure_count": 0,
  "checks": [
    {
      "name": "required_files_exist",
      "status": "PASS",
      "detail": ""
    },
    {
      "name": "markdown_utf8_and_nonempty",
      "status": "PASS",
      "detail": ""
    },
    {
      "name": "internal_links_resolve",
      "status": "PASS",
      "detail": ""
    },
    {
      "name": "twenty_unique_r6_checklist_ids",
      "status": "PASS",
      "detail": ""
    },
    {
      "name": "test_table_matches_template",
      "status": "PASS",
      "detail": ""
    },
    {
      "name": "template_not_claiming_execution",
      "status": "PASS",
      "detail": ""
    },
    {
      "name": "template_preserves_nonacceptance",
      "status": "PASS",
      "detail": ""
    },
    {
      "name": "historical_archive_size_and_hash",
      "status": "PASS",
      "detail": ""
    },
    {
      "name": "archive_paths_unique_and_safe",
      "status": "PASS",
      "detail": ""
    },
    {
      "name": "historical_archive_has_39_file_entries",
      "status": "PASS",
      "detail": ""
    },
    {
      "name": "artifact_identities_match_review",
      "status": "PASS",
      "detail": ""
    },
    {
      "name": "actual_blocked_result_retained",
      "status": "PASS",
      "detail": ""
    },
    {
      "name": "all_72_historical_gate_ids_preserved",
      "status": "PASS",
      "detail": ""
    },
    {
      "name": "historical_gate_counts_match",
      "status": "PASS",
      "detail": ""
    },
    {
      "name": "four_source_only_passes_identified",
      "status": "PASS",
      "detail": ""
    },
    {
      "name": "all_25_manifest_payload_hashes_match",
      "status": "PASS",
      "detail": ""
    },
    {
      "name": "archived_reports_match_pinned_git_blob_ids",
      "status": "PASS",
      "detail": ""
    },
    {
      "name": "review_declares_no_app_execution",
      "status": "PASS",
      "detail": ""
    },
    {
      "name": "primary_source_register_present",
      "status": "PASS",
      "detail": ""
    },
    {
      "name": "dispatch_uses_new_unassigned_T6",
      "status": "PASS",
      "detail": ""
    }
  ]
}
