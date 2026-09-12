# CH-001R-r5 source and boundary review

Evidence type: T5 implementation and local focused checks. No hosted workflow run or application acceptance is claimed.

## Source identity

- Base P5: `53f7786fdd728140c94bd82e3855cd7e97c96cf5`, tree `9886165add66465f6ee2889027c9abf90ae012a2`.
- T5: `6849b39f4e3c7a03b5f132418b1d33cc84c98d51`, tree `85ea5ab159c6f6bd5babf63246cd16c8c50b8655`.
- T5 workflow blob: `50774746e3ead4922b265af6652a942302743062`; file SHA-256 `a9f2a8b3901a86bf3d5fa8f392cc02188785dde8d3e6785bd6243f3f1f6af4ef`.
- T5 parent is P5. The execution diff has five files: one workflow, one coordinator, one dependency-free boundary helper plus declaration, and one focused regression module.

## Boundary repair

- `.github/workflows/ch001-live-proof.yml` now creates only the bootstrap report parent in the identity step. No workflow pre-proof command creates a path under `CH001_EVIDENCE_ROOT`.
- `scripts/ch001-proof-boundary.mjs` validates the existing short run-ID and repository-contained evidence-root rules, refuses every nonempty root before child creation, and creates `private/commands` and `public/commands` only after a fresh-root check.
- `scripts/ch001-proof.ts` uses the shared helper, removes the pre-try proof-root mkdir, and sets `evidenceOwned` only after preparation returns successfully.
- The coordinator catch path skips `sourceReview()` on refusal, emits the refusal detail to stderr, and calls the shared failure writer with the ownership flag. The writer is a no-op when ownership was not established and uses an atomic replacement only for an owned run.

## Scope preservation

Node `20.19.2`, pnpm `12.3.4`, the native bootstrap and release manifest, lockfile, application dependencies, Dockerfile, app/renderer code, strict 72-gate contract, and bounded r3 proof assertions were not changed. No provider, publishing, scheduling, billing, video, deployment, release, or v0.2 work was added.

The local bounded proof prepared the new T5 run and reached static checks, but the host denied loopback, lacked Docker/Compose, and lacked the pinned Chromium executable. Its `4 PASS / 0 FAIL / 68 NOT_RUN` ledger is local boundary evidence only; it is not a hosted ledger and does not grant acceptance.
