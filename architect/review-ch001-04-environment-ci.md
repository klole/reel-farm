# Execution environment and CI escape route

## 1. Objective

Provide one reproducible, disposable environment that can run the shipped web, PostgreSQL, media volume, separate worker, and locked browser. Missing Docker on the previous agent host is an observed limitation of that run, not a permanent product assumption.

The repair should yield both real tests and instructions a reviewer can execute. A Dockerfile, workflow YAML, or `SELECT 1` alone is not a successful environment test.

## 2. Choose a permitted execution route

Preferred: a Docker/Compose-capable disposable host running the repository's final runtime image. This covers the shipped installation path and container lifecycle.

Alternative diagnostic route: directly run disposable PostgreSQL, the built web/worker, and the matching managed Chromium on a permitted host. It can establish DB/browser behavior, but it does not prove the Compose clean-install/recreation gates. Those remain open until actually exercised.

CI route: add a bounded verification workflow in the existing repository, using available, authorized execution only. Follow the official Playwright CI pattern—install pinned dependencies and browser requirements, run tests, retain reports—but adapt it to this repo's exact lockfile and safety constraints rather than copying `latest` or wildcard versions. [W03]

A prior query returned no Actions run for the reviewed implementation SHA. No CI execution is assumed available or successful. Do not buy a runner, provision a cloud VM, enable billing, change repository settings, or add external account secrets. If existing permissions or runner availability prevent execution, commit the runnable harness/workflow under the session's authorization and return BLOCKED with the exact remaining command. Do not keep repeating the old unsupported-host command.

## 3. Preflight capabilities

Record actual Node/pnpm versions, lockfile hash, OS/architecture, Docker client and daemon reachability, Compose version, browser executable/version, final image identity, media path ownership, PostgreSQL availability, and security policy limitations. A Docker client binary without a reachable daemon is not Docker availability.

Do not hardcode the previous Debian/Chrome environment into a new report. The old host's system Chrome can be diagnostic information, but arbitrary browser substitution must not become the validated renderer baseline. Use the pinned managed browser or an explicitly documented compatible test profile, and keep output baselines environment-specific. [W01–W02]

Reuse locked package/runtime versions initially. If a pin or image fails to resolve or is incompatible, record the exact observed failure, use official sources to select a minimal fix, and update the lock/provenance deliberately. Do not invent a dependency version or silently upgrade the entire stack.

## 4. Disposable resource contract

Every test run needs a unique run ID, isolated database/media storage, synthetic owner credentials, and a dedicated Compose project name such as `oss-ch001-test-<run-id>`. Pass the explicit project name on every orchestration command and inspect effective configuration. Docker documents `-p` as taking precedence over the Compose file's top-level name. [W05]

Never test against Kyle's ordinary database, `.env`, media folder, or default production-like Compose project. The test utility must refuse destructive setup without a run-owned marker and an allowlisted disposable resource identity. Do not accept an arbitrary DATABASE_URL as permission to reset it.

Use a test env file generated outside committed config. Do not overwrite the user's env file. Bind web only to loopback on an available test port, matching APP_ORIGIN and browser requests. Any test-only database access must stay within the isolated network or an explicitly loopback-only test binding, not alter shipped defaults.

Container recreation tests must preserve the test volumes so persistence is actually tested. Volume deletion is allowed only for final cleanup of verified run-owned resources. Compose's volume-removal flag is destructive; never invoke it against the user's default project. [W06]

Record IDs and before/after hashes for the test project/revision/media/export, without copying secrets. Do not report only that containers restarted.

## 5. Final-image and sandbox checks

Fix the final image, not merely the build container. Browser binaries and their operating-system dependencies must be available in the runtime stage. Verify the selected non-root identity and writable media/cache paths. Inspect the base image's existing UID assignments before creating another user. [S12, W02, W04]

The worker's actual browser launch must enable sandboxing. Test the effective launch and process configuration under the shipped restrictions; record sanitized evidence. No fallback to `--no-sandbox`, privileged containers, broad added capabilities, host Docker socket, or unconfined policy. A documented narrow security-profile adjustment may be necessary; qualify it rather than disabling isolation. [S11, W01–W02]

Keep the renderer's environment allowlist and test that synthetic authentication/database canaries do not enter the browser subprocess. Process environment redaction is not the entire sandbox proof, and a container boundary is not automatically evidence of browser sandboxing.

Use a final-image browser startup self-check as part of readiness. Avoid repeatedly launching full browsers just to update a status badge. Distinguish cached successful capability checks from untested startup assumptions.

## 6. Harness structure and orchestration

Luna may introduce helpers such as `tests/helpers/environment.ts`, `tests/helpers/fixtures.ts`, `tests/helpers/faults.ts`, and a safe `scripts/ch001-test-env.ts`. Those are proposed paths, not files this review claims exist.

Keep service startup/teardown separate from assertions. Use bounded readiness polling and failure diagnostics, not guessed fixed sleeps. Test-specific synchronization may control a lost response, queue claim, or finalization boundary deterministically. Inject faults in isolated test code or guarded internal interfaces, never a public unauthenticated endpoint.

Install dependencies and browser packages before the runtime network-observation window. Then deny or monitor external runtime traffic while allowing the local web/database communication needed by the app. Record the observation boundary and components monitored. A page-level network hook alone must not be called full-process network isolation.

On failure, preserve sanitized diagnostics before cleanup. Terminate run-owned child processes and containers, not arbitrary processes on the host. Keep raw sensitive traces private unless actually scrubbed.

## 7. CI requirements

An allowed workflow should use a fixed supported Linux runner profile and exact application/runtime pins, a locked install, bounded execution, isolated Compose resources, and the same root commands as local verification. Default repository token permissions should be read-only (`contents: read`); no deployment job or provider credentials belong here.

Do not execute untrusted PR code using privileged triggers or publish reports to a new public website. Retain sanitized artifacts through the repository's existing artifact mechanism. Record the real run ID, head SHA, jobs, artifact ID/name, and retention/access limitations. Redact tokens/cookies/connection strings; no environment dump.

Do not hide failed tests with `continue-on-error`. An upload-artifact step can run after a failed test so diagnostics survive, but uploading reports is not test success. Confirm the command/test ledger, not just a green workflow label.

The CI path is a way to run the same tests on capable infrastructure, not a waiver for the reference environment. A directly hosted DB test does not replace testing the app's actual Compose image.

## 8. Honest blocked outcome

When execution is genuinely impossible after bounded permitted attempts, return the completed harnesses, exact environment probes, unexecuted commands, and the needed capability. Keep runtime gates NOT_RUN and any demonstrated defects FAIL. Explain whether failure is missing Docker daemon, sandbox restrictions, unavailable browser dependencies, missing permission, or an application problem.

A missing implementation is not an environment limitation. Finish the real harness code even when its live execution cannot be completed on the present host. Do not start providers or the next chapter while waiting for a capable environment.
