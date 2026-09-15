# References and reading boundaries

Reviewed on 2026-09-15. Repository links use immutable refs. Canonical URLs are included for a portable offline handoff; they do not imply a write or dispatch.

## Repository primary evidence

**D1 migration log:** actual exception in the final image; blob `dcdf6d53c20f9501d8e9c71330221fdc7ca3bd78`, full file read. The archived bytes were independently hashed and matched to this blob identity.

```text
https://github.com/klole/reel-farm/blob/ad2aab759391c070808024ff98977f72c8cb8ec5/docs/evidence/CH-001R-r10-D1/public/migrate.log
```

**D1 receipt:** supplied run/source bindings and diagnostic scope; full file read. Its summaries do not supersede the downloaded original archive.

```text
https://github.com/klole/reel-farm/blob/ad2aab759391c070808024ff98977f72c8cb8ec5/docs/evidence/CH-001R-r10-D1/router-receipt.json
https://github.com/klole/reel-farm/actions/runs/34946892709
https://api.github.com/repos/klole/reel-farm/actions/runs/34946892709/artifacts
```

**Root manifest:** blob `f237e403132a7103d3622e9405fff28e9152c963`, full file read; no root `@oss/db` dependency.

```text
https://github.com/klole/reel-farm/blob/ec7cc08d6ed229af9780318858d8051202851746/package.json
```

**DB package:** blob `1944b8041171f4f7e860855dc58fcc2ccf11bac6`, full file read; built ESM export.

```text
https://github.com/klole/reel-farm/blob/ec7cc08d6ed229af9780318858d8051202851746/packages/db/package.json
```

**Migration:** blob `468dd8c82cc2db53da81f50fc65b8548ede706ae`, full file read; bare `@oss/db` import plus existing transaction/lock/marker behavior.

```text
https://github.com/klole/reel-farm/blob/ec7cc08d6ed229af9780318858d8051202851746/scripts/migrate.ts
```

**Image packaging:** blob `23cad19d631b5d3048e8b3a899f51d0a63b6de52`, full file read; pinned install/build and final `/app` copy under non-root execution.

```text
https://github.com/klole/reel-farm/blob/ec7cc08d6ed229af9780318858d8051202851746/Dockerfile
```

**Pin regression:** blob `ae849214bf29c9cd2f116da607e7ddf3ae9bcf92`; lines 300–440 requested/read, including `R7-T11` at the end. The unchanged remainder was not re-read in this review.

```text
https://github.com/klole/reel-farm/blob/ec7cc08d6ed229af9780318858d8051202851746/tests/ci/workflow-validation.test.mjs
```

**Coordinator:** previously inspected immutable T10 excerpts establish the migration checks after worker readiness and diagnostics before finalization. Re-read the complete candidate when implementing.

```text
https://github.com/klole/reel-farm/blob/ec7cc08d6ed229af9780318858d8051202851746/scripts/ch001-proof.ts
https://github.com/klole/reel-farm/blob/ec7cc08d6ed229af9780318858d8051202851746/scripts/ch001-compose-diagnostics.mjs
```

**Receipt-sealing commit:** later main head observed during this review; diff limited to receipt/manifest metadata in that commit.

```text
https://github.com/klole/reel-farm/commit/3d1bb3c8b544b295236aa92aaee1e406e26f68aa
```

## External primary documentation

**pnpm workspace protocol (12.x):** `workspace:` restricts a declared dependency to local workspace resolution. It provides the intended relationship without a registry substitute. The declaration does not itself prove the candidate image succeeds.

```text
https://pnpm.io/workspaces#workspace-protocol-workspace
```

**Node 20.19.2 ESM:** bare package imports and package exports follow Node's package-resolution algorithm; explicit resolution and real module evaluation are distinct checks. Match the pinned runtime in tests rather than relying on a different global Node.

```text
https://nodejs.org/download/release/v20.19.2/docs/api/esm.html
```

**Docker Compose run:** one-off service execution uses the service configuration; a command following the service overrides its configured command. `--no-deps` prevents implicit dependent-service startup; omission of `--rm` permits later inspection. Confirm terminal container state as well as CLI exit.

```text
https://docs.docker.com/reference/cli/docker/compose/run/
```

**Docker Compose up:** starting detached services is distinct from proving that a one-shot migration completed; use explicit terminal-state/exit observations. Maintain the shipped successful-completion dependency graph.

```text
https://docs.docker.com/reference/cli/docker/compose/up/
```

The docs support implementation choices, not a claim that Luna has executed them. All candidate test results remain to be obtained.
