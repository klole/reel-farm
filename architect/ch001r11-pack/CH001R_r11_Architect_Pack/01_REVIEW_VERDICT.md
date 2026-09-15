# Architect review — CH-001R-r10-D1

## Verdict

**Diagnostic objective achieved; application acceptance denied/pending.** The final-image failure is now established as a package-loading failure. R11 may repair the confirmed root dependency relationship immediately. It need not consume another hosted request to reproduce the same missing-package error before editing.

### Reviewed identities

| Item | Observed identity |
|---|---|
| T10 implementation | `ec7cc08d6ed229af9780318858d8051202851746` |
| T10 tree | `9e43ac5c00801f7d523405dbe5874d64264fa7cc` |
| E10 | `f512c9c02620ea600404cd304782a37e6689a109` |
| D1 receipt commit supplied by router | `ad2aab759391c070808024ff98977f72c8cb8ec5` |
| Additional main head observed in this review | `3d1bb3c8b544b295236aa92aaee1e406e26f68aa` |
| Workflow definition used by D1 | `c53f29861640831c4dbd588bef5ec9aa6fef5157` |
| Workflow blob | `35fa339aac2fcb024cd476ff38d87d27eb6482af` |
| Workflow file SHA-256 | `733643038bc7bc162265abf895e5348b1a0ca9039675740a77e0f5798b3efd2d` |
| Hosted run / job | `34946892709` / `104308321648` |
| Hosted attempt | `1`, as bound by artifact and receipt |
| Artifact ID / name | `10387768055` / `ch001-live-proof-34946892709-1` |
| Artifact bytes / SHA-256 | `65347` / `4c6dae545e0f778ff90bebf9216bd90258ceb41fde228a9fdff50f460a34e685` |

The later main commit updates receipt identity and associated metadata, not application code in that commit's diff. Do not reset the repository to T10 and discard those records. Recheck the complete starting ancestry and execution-surface comparison before editing.

## F1 — Confirmed missing root runtime dependency

The archived service log records:

```text
$ node --import tsx scripts/migrate.ts
Error [ERR_MODULE_NOT_FOUND]: Cannot find package '@oss/db' imported from /app/scripts/migrate.ts
Node.js v20.19.2
```

The actual migration container exited **1**. The database was healthy; web and worker containers were only created and had not started. The script imports `pool` from `@oss/db`, but root `package.json` has no `@oss/db` dependency. `packages/db/package.json` exists, is named `@oss/db`, and exports `./dist/index.js` for ESM imports. The Dockerfile performs the frozen workspace install and build, then copies `/app` into the final image.

**Conclusion:** the shipped migration entrypoint is missing a declared root-to-workspace runtime dependency. The authorized correction is the normal package relationship, not an SQL rewrite, registry substitute, custom resolver, broad hoisting change, or hand-created symlink.

The pnpm workspace protocol is explicitly local-only. Node resolves a bare package specifier through its package-resolution rules, not by scanning arbitrary sibling package directories. See primary references in `06_REFERENCES.md`.

A fixed import does not prove that subsequent database connection, DDL, transactions, or repeat migration will work. Those are candidate runtime tests, not historical passes.

## F2 — R10 diagnostics and scoped cleanup worked on this failure path

The artifact includes the stopped migration state, useful service stderr, and a cleanup receipt. Teardown returned **0**; post-cleanup container and labeled-volume inventories were empty. Its teardown output also records removal of the project's default network. No independent network inventory is present in the archived cleanup receipt, so do not describe a separately measured network count as verified here.

The startup record and cleanup receipt are both covered by the original proof payload manifest. Preserve this path. This observation does not close every r10 safety test, prove every timeout/error path, or qualify sibling-resource isolation generally.

## F3 — Existing pin regression would reject the authorized fix

`tests/ci/workflow-validation.test.mjs`, test `R7-T11`, compares the package manifest to T6 after removing only `lint:workflow` and compares the lockfile byte-for-byte to T6. Adding the needed root dependency without addressing that guard would turn the next run into another preventable CI bootstrap failure.

Keep the original test's purpose. Allow exactly `dependencies['@oss/db'] === 'workspace:*'` and its corresponding root importer link. Continue rejecting changed registry package versions, native-package-manager metadata, other workspace relationships, toolchain pins, runtime inputs, and security configuration. Add negative cases so the exception cannot grow into a blanket skip.

This is an explicit r11 exception to earlier package/lock immutability instructions. It is not a retrospective claim that Luna was authorized to do it under the published P10 assignment.

## F4 — Migration proof must precede worker readiness

In T10 the coordinator starts the complete stack, waits for worker/browser/database/storage readiness, and only then tests migration repeat/metadata. A distinct worker failure could therefore prevent any positive migration evidence even after the dependency fix.

R11 may introduce a small migration-first prefix within the existing coordinator, using the same final image, private environment, run-owned project, and shipped migration command. Persist its result before attempting worker/browser readiness; retain it on later failure. This is a verification-order correction, not a change to the shipped Compose dependency graph.

## Actual hosted outcome remains unchanged

```text
bootstrap_status=PASS
classification=LIVE_PROOF_FAILED
proof_invoked=true
proof_exit_code=1
proof_status=TEST_FAILURE
historical_application_gates=4 PASS / 0 FAIL / 68 NOT_RUN
application_acceptance=false
accepted_application_version=none
```

The four passes are source-only. The zero FAIL count in that ledger does not negate the executed startup failure. Missing slideshow/preview/export artifacts are downstream consequences. Successful fresh application, successful repeat, schema qualification, worker rendering, and application acceptance were not established.

The GitHub step that captures the bounded proof returns successfully to let finalization run; the final enforcement step fails. Do not interpret the green capture step as a green proof. The artifact's pre-upload `artifact_delivery=PENDING` is a snapshot before upload; the independently listed/downloaded artifact establishes delivery, not an edited historical report.

## Architect verification actually performed

The downloaded archive matches the API's **65,347 bytes** and SHA-256. ZIP CRC validation passed. All **53 file members** were read and all **34 original manifest-listed payload hashes and byte counts** matched. The archived migration log also matches the Git blob identity of the committed copy. The proof binds the manifest hash correctly.

These are historical-artifact and source-inspection checks, not new runtime/application tests. See `evidence/historical-run-inspection.json` for the precise boundaries. The architect did not patch the repository, install project dependencies, run Docker, execute a migration, launch Chromium, or dispatch a workflow.

## Authorized next owner

**Luna MAX: CH-001R-r11.** Implement the narrow dependency fix and executable verification path. **Router:** publication validation and, if elected under this packet, one fresh T11 hosted request. **Architect:** review its actual result. Full application acceptance remains exclusively pending the original contract.
