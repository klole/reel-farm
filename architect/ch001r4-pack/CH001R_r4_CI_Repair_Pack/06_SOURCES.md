# Source and verification register

Repository reads were made through the connected GitHub tool. Upstream behavior was checked against primary pnpm and GitHub documentation. URLs below are source identifiers, not claims that the packet executed the referenced software.

## Repository and run records

- **R1 — main identity.** `https://api.github.com/repos/klole/reel-farm/branches/main` returned E3 `4cf020317cfc2e8755f35ee6da10f7397c8676f2`, parent T3. A mutable branch must be rechecked before the next dispatch.
- **R2 — failed run, job and logs.** `https://github.com/klole/reel-farm/actions/runs/34665615514`; run metadata, jobs endpoint, and decoded log for job `103476773609` were read. Recorded failure stages and source identities come from these observations. Timestamps are kept verbatim from GitHub, including `2026-09-12T01:42:40Z` creation.
- **R3 — workflow at E3.** `https://github.com/klole/reel-farm/blob/4cf020317cfc2e8755f35ee6da10f7397c8676f2/.github/workflows/ch001-live-proof.yml`. Blob `4a1b045e4771901713a2ad00705a0a84c9ff1dab`.
- **R4 — r3 handoff at E3.** `https://github.com/klole/reel-farm/blob/4cf020317cfc2e8755f35ee6da10f7397c8676f2/handoffs/CH-001R-r3.md`. Source of the historical local preflight report; not independently rerun here.
- **R5 — r3 evidence index at E3.** `https://github.com/klole/reel-farm/blob/4cf020317cfc2e8755f35ee6da10f7397c8676f2/docs/evidence/CH-001R-r3/README.md`.
- **R6 — retrieved historical artifact.** `https://api.github.com/repos/klole/reel-farm/actions/artifacts/10289206189`. Exact downloaded ZIP: 295 bytes, SHA-256 `6286efa33c131379a7855b87890a9450ad11f9a704ec4ee68b50128b5f9188a2`, only `dispatch.txt`. Bytes and content were independently checked locally. GitHub reported expiry `2026-09-26T01:42:53Z`. Do not distribute signed download URLs.
- **R7 — T3 package manifest.** `https://github.com/klole/reel-farm/blob/0b79ed07a25a618ab4da2bf56a2fed6047398cb5/package.json`.
- **R8 — T3 Dockerfile.** `https://github.com/klole/reel-farm/blob/0b79ed07a25a618ab4da2bf56a2fed6047398cb5/Dockerfile`.
- **R9 — T3 proof coordinator.** `https://github.com/klole/reel-farm/blob/0b79ed07a25a618ab4da2bf56a2fed6047398cb5/scripts/ch001-proof.ts`. Entry and finalization portions were inspected, including npm-dependency imports, `CH001_EVIDENCE_ROOT`, `CH001_RUN_ID`, required artifacts and bounded/nonacceptance result semantics. This was not a complete new code audit of every coordinator line.
- **R10 — E3 root state.** `https://github.com/klole/reel-farm/blob/4cf020317cfc2e8755f35ee6da10f7397c8676f2/state/PROJECT_STATE.md`.

## Upstream primary references

- **U1 — pnpm 12 installation and compatibility.** `https://pnpm.io/installation`. Documents native pnpm 12 and distinguishes npm-install requirements from standalone runtime behavior. Do not interpret its mutable current examples as permission to use `latest` in this project.
- **U2 — pnpm CI.** `https://pnpm.io/continuous-integration`. Documents native CI installation and explicit PATH handling; reviewed as supporting context, not copied as an unqualified workflow.
- **U3 — official pnpm v12.3.4 release and asset metadata.** `https://github.com/pnpm/pnpm/releases/tag/v12.3.4` and `https://api.github.com/repos/pnpm/pnpm/releases/tags/v12.3.4`. Release ID `382779697`. Linux x64 archive asset `544431952` and arm64 asset `544431953` metadata supply the pins in this packet. Native archive bytes were not downloaded/executed by the packet author; Luna must verify before execution.
- **U4 — GitHub workflow environment/output/summary commands.** `https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands`. Supports `GITHUB_PATH`, `GITHUB_ENV`, `GITHUB_OUTPUT` and `GITHUB_STEP_SUMMARY` semantics.
- **U5 — GitHub workflow reruns.** `https://docs.github.com/en/actions/how-tos/manage-workflow-runs/re-run-workflows-and-jobs`. Reruns retain original SHA/ref; a fresh repaired-source dispatch is required here.
- **U6 — CLI manual dispatch.** `https://cli.github.com/manual/gh_workflow_run`. Supports the runbook's manual workflow selection, ref, and input mechanism.
- **U7 — workflow contexts.** `https://docs.github.com/en/actions/reference/workflows-and-actions/contexts`. Supports recording workflow-definition and run/source identities distinctly.

## Findings versus proposals

Corepack missing-module failure, shell command-substitution errors, skipped proof, the existing pins, Docker's Corepack calls and artifact contents are observed facts. The legacy-launcher/native-layout incompatibility is a strongly supported diagnosis, not a personally reproduced upstream bug investigation.

The checksummed native installer, split outer failure report, new CI4 regression cases and router runbook are architect implementation decisions. No claim is made that Luna has already implemented them. The safe summary fragment is illustrative and independently testable; it is not a complete workflow patch.

No primary-source quotation is necessary to apply this packet. Source details are summarized; command examples and testing/architecture instructions are original proposed work.
