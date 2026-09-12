# CH-001R-r6 source and scope review

Implementation commit: `e0ea57665d00a643a8c392dfb9f6a84a723729af`
Implementation tree: `7a5ada37e8ee88a1617ff19039fa116ced44e9c5`
Parent P6: `8fa06ddae978eb6ca8f946e77459810a7bc68cb3`
Evidence class: local committed-source review; not hosted proof and not v0.1 acceptance.

## Required source identities

| Item | SHA-256 / identity | Result |
|---|---|---|
| Node pin | `.nvmrc` = `20.19.2` | PASS; unchanged |
| pnpm pin | `package.json` = `pnpm@12.3.4` | PASS; unchanged |
| Playwright pin | `package.json` = `1.63.0` | PASS; unchanged |
| `package.json` | `cb1e1a5c2ec11ecc7d397c9aa7700d76841cede38615656e3e273f34b140dbd0` | PASS; unchanged |
| `pnpm-lock.yaml` | `9c49bf356bdd523623b79cf6096df83de51f06b358bffa88391700a4c5719d70` | PASS; unchanged |
| native pnpm manifest | `fb6212a43173722f565a4101c311b23b54b7204f4828e0c62e9b9f7af1a8bd6d` | PASS; unchanged |
| North Star | `3175b197c221588fa92273c9f8403ecbcc2357fe486f63a97365205d951ad80d` | PASS; unchanged |
| r6 workflow blob | `f1ddbbfc0cbaa4602663428d569b61dbf12bd068` | PASS; T6 |
| r6 workflow file | `e1e4f6e5ebfa61f2aae3c04bcf985d12407a8f921dfeaa34dae01d103d01af85` | PASS; T6 |

## Boundary review

- The workflow's only new privileged operation is the helper's exact `apparmor_parser` install/remove route, gated by public repository, `workflow_dispatch`, `github-hosted`, Linux/Ubuntu, non-root uid, full requested/checked-out SHA equality, and the explicit boolean opt-in. It uses existing noninteractive `sudo`; no credentials are introduced.
- `scripts/ch001-sandbox.mjs` contains no sysctl write, global AppArmor shutdown, container privilege change, root browser launch, external browser fallback, or permissive Chromium launch. Its only policy content is the exact path-attached `flags=(unconfined)` / `userns,` exception authorized by the packet.
- The resolver canonicalizes both Playwright's selected executable and any configured path, checks the recognized managed revision layout, and records mode/uid/gid/size/hash. Revalidation prevents stale policy authorization after executable drift.
- The coordinator, Playwright host config, gated E2E/render launcher, and lifecycle launcher keep `chromiumSandbox: true`. The worker remains `user: node`, `no-new-privileges`, and `cap_drop: ALL` under unchanged Compose/Docker defaults; it no longer accepts a host executable override.
- Workflow bootstrap creates only the bootstrap report parent. The sandbox report is a bootstrap sibling, the ownership/request record is under a fresh runner-temp r6 state directory, and the coordinator still owns creation of the proof root.
- The existing original 72-gate contract and historical T5 evidence were not edited. Providers, publishing, deployment, release, video, and v0.2 work did not begin.

## Local command outcome

`pnpm test:ci`, `pnpm lint`, `pnpm typecheck`, `pnpm build`, `pnpm test:unit`, `pnpm test:security`, both changed `.mjs` syntax checks, and `git diff --check` all exited 0 against the committed T6. Unit counts were 20 passed; security counts were 4 passed; the CI file-level suite passed `ci-repair` (10 cases), all R5 boundary cases (12), and the r6 focused file (18 cases).

The local fresh proof was intentionally not used to claim runtime success. It measured only the editing host's unavailable prerequisites; see [local-proof-summary.json](local-proof-summary.json) and [sandbox-local-host-snapshot.json](sandbox-local-host-snapshot.json).
