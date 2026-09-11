# Acceptance coverage and evidence rules

## 1. Preserve the original contract

There are exactly 72 mandatory CH-001 IDs, CH001-001 through CH001-072. The original procedures and evidence types are preserved verbatim in [reference/ORIGINAL_ACCEPTANCE_TESTS.md](reference/ORIGINAL_ACCEPTANCE_TESTS.md) and copied into [gate-coverage.plan.json](gate-coverage.plan.json). The JSON is a coverage plan; every initial status is NOT_RUN. It is not a fresh execution report.

Do not delete, renumber, weaken, or silently defer these gates. Do not treat all mature North Star requirements as due now. One gate may have multiple assertions and one parameterized test may support multiple gates, but each assertion needs an explicit coverage link.

## 2. Evidence is gate-specific

E1 is identified source/configuration/provenance inspection. E2 is actually executed automated tests. E4-local is actually exercised process/storage/restart behavior in a named environment, which may be a permitted CI host running the local stack. “Local” describes the tested self-hosted application pipeline, not a requirement to use Kyle's personal laptop.

The source-only gates are CH001-067, 068, 069, 070, and 072. Assess them with the documented inspection, not a Docker prerequisite. Other gates explicitly mix source, tests, lifecycle, visual, or keyboard evidence. Preserve those combinations. CH001-060 requires actual visual/keyboard review; CH001-061 combines executed checks with manual/keyboard observations. The original CH001-066 needs documentation review and a clean run, not a fabricated independent-reader study.

A source check saying `chromiumSandbox: true` exists does not prove the effective sandbox. A screenshot of “Saved” does not prove the DB commit. A JPEG hash match proves byte identity, not typography or composition quality. These evidence types complement one another.

PASS means every required part of that gate was checked and passed. FAIL means an executed assertion or inspection found a violation. NOT_RUN means required evidence was not obtained; include which portion is missing and why. A partly checked gate remains NOT_RUN unless a demonstrated violation makes it FAIL. Keep partial observations without upgrading the whole gate.

## 3. Suite organization

The following logical suites are a proposed organization, not existing commands or results. File names may vary if the mapping is documented.

| Logical suite | Coverage purpose |
|---|---|
| UNIT | Canonical hashing, schema boundaries, error classification, editor transitions, stable IDs, result-validator negative cases. |
| DB | Disposable real PostgreSQL, ownership, revision immutability, save replay/conflict, outbox transaction, migrations, artifact finalization. |
| HTTP | Real login/session/CSRF/authorization matrix, protected media/export routes, actual uploads and failure boundaries. |
| UI | Primary user journey, uploads during edits, save states, navigation, undo/redo, two tabs, network response faults, stale preview. |
| RENDER | Pinned worker/browser corpus, all layouts/ratios, decode/font readiness, glyphs/overflow, containment, exact export bytes. |
| LIFECYCLE | Clean Compose setup, rerun preservation, container recreation, worker death/reclaim, crash boundaries and bounded retries. |
| SECURITY | Runtime canaries, origin/auth checks, private paths, upload limits, network observation, effective renderer containment. |
| VISUAL | Actual output inspection, both canvas presets, desktop/narrow usability, keyboard path, accessibility report. |
| DOC | Provenance/scope, state and commit traceability, handoff consistency, sanitized evidence accessibility. |

Root integration/security/browser/render/smoke commands may share these helpers. Do not mock PostgreSQL in the real DB suite, replace the worker with a fake render completion in the primary journey, or seed an authentication bypass into the app.

The coverage plan maps every gate to one or more suites. It deliberately does not mandate 72 test files, an enterprise test platform, or a rewritten architecture.

## 4. Canonical output and fixtures

Use the original `A little room to focus` demonstration, its seven slide texts/layout roles, post title, caption, and hashtags from the reference. Generate fixture images locally from reproducible code; use obvious off-center crop markers. No provider keys, external image source, stock subscription, or scraped content.

Retain the original fixture families: portrait/landscape/square, transparent PNG, EXIF-rotated JPEG, static WebP, identical bytes under a second filename, safely generated corrupt/misleading/animated/limit fixtures; newline/accented/long/unsupported text; two tabs, foreign workspace, missing/corrupt media, pending render, dropped save response, worker stop, and finalization crash.

The canonical primary journey must use the UI. Additional API/DB fixtures may make adversarial cases precise. The required download contains exactly `01.jpg` through `07.jpg`, `post.txt`, and `manifest.json`, in the original structure. Do not substitute PNG or a video.

For every slide, record the final-preview response-body SHA-256, ZIP-entry SHA-256, manifest SHA-256 value, dimensions, bytes, and slide ID. Assert all three hashes agree and IDs/order match the saved revision. Hash `post.txt` and compare its exact content to that revision. Do not compare only URLs, filenames, or visual similarity.

## 5. Artifact availability

Keep full sensitive raw outputs in an ignored run-specific directory. Publish or commit only sanitized evidence from synthetic data. For GitHub review, provide actual small evidence files or an actually created downloadable artifact with an exact run/artifact reference. A future URL, ignored directory name, or nonexistent screenshot path is not acceptable evidence.

Required review artifacts include: Projects/editor/alternate-format/final-preview screenshots; overflow or save-conflict and worker-down screenshots; a successful download/result view; the real seven-slide ZIP; image/post/manifest hashes; browser/renderer/font environment; layout corpus comparisons; migration/concurrency/recovery assertions; security/network/accessibility summaries; command reports with executed/skipped counts; and the gate ledger.

Do not attach font binaries from this conversation or the architect environment. The implementation must obtain fonts through its declared sources. Do not include user databases, real uploads, live credentials, cookies, traces containing secret request bodies, or unredacted setup-token output. Inspect traces before making them public; synthetic data alone does not make auth headers safe.

## 6. Aggregate verifier contract

The implementation must validate these conditions before reporting an accepted-evidence candidate:

1. The original gate source was successfully loaded and has exactly the expected IDs, each once. Missing source is a failure, not an empty pass.
2. Each required suite discovered and executed tests, with legitimate nonzero counts. Commands retain their real exit status; skips affecting mandatory coverage fail the checkpoint.
3. Each gate has its required evidence type, a run/test/review reference, the exact tested implementation commit or tree, and an actual evidence path/hash. Do not infer individual assertions from a suite's exit code alone.
4. All evidence is from the same identified implementation, or an explicitly compatible unchanged tree checked by the verifier. Missing/stale files, mismatched hashes, and unbound records fail.
5. Manual/source/visual reviews identify the inspecting agent or person and what was inspected. No blanket automated PASS for a human/visual requirement.
6. Every mandatory gate is PASS. Any FAIL or NOT_RUN yields an overall nonzero result. No removed gate, silent waiver, or empty denominator.
7. The artifact manifest and command reports are present and retrievable in the final evidence package. The final output hash comparison actually passed.

At the suite level, code 2 may mean unavailable external prerequisites. A missing test implementation, malformed report, or discovered regression is code 1. The aggregate returns 1 for any incomplete chapter, preserving child outcomes.

Suggested negative validator tests: missing contract; 71 gates; duplicate ID; unknown ID; all commands green but one NOT_RUN gate; zero discovered tests; absent visual review; missing JPEG; false checksum; prior-SHA report; unclosed P1 finding; and a failing child process hidden behind a successful shell pipeline. Valid fixtures for validator unit tests are test-only report examples, not application gate passes.

## 7. Avoid a paperwork deadlock

Do not require live evidence where E1 is the contract. Do not require a finalized new license where CH001-067 explicitly allows a recorded pending decision. Do not require a file to contain the SHA of the commit that will contain it; use the two-commit handoff protocol.

Conversely, source inspections and honest declarations do not waive real browser, database, render, or lifecycle requirements. A test harness that has only been written is progress but does not complete those gates. Keep blocked reasons precise enough to distinguish missing infrastructure, missing harness, actual application failure, and unavailable review evidence.
