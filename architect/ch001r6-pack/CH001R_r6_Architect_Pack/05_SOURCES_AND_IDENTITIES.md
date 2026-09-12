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
