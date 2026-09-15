# CH-001R-r9 evidence

Status: `READY_FOR_ROUTER_PUBLISH`. This is a bounded v0.1.0 CI repair, not application acceptance. `application_acceptance=false`, accepted version `none`, and root state `awaiting_review` remain in force.

## Identities

| Item | Identity |
|---|---|
| E8 baseline | `d04a0a70d890890132041061be87742396c1909e`, tree `40b9bc095b139a19e1c42130bf5e43ca15c79cc6` |
| P9 packet | `1f7a920e437d561fd40e8524cdb11453294a6124`, tree `b98145e3bed876d880beb9c09306715ff7e02f3d` |
| T9 implementation | `6014a247b124a186a1abfcb6d65a7ef024cf8cfc`, tree `6e590387c666ee3672210d022e51fc9283e07737` |
| Current workflow blob | `35fa339aac2fcb024cd476ff38d87d27eb6482af` |
| Current workflow SHA-256 | `733643038bc7bc162265abf895e5348b1a0ca9039675740a77e0f5798b3efd2d` |
| Runtime pins | Node `20.19.2`; pnpm `12.3.4`; actionlint `1.7.7` |

E9 is the subsequent evidence/state-only commit and is intentionally not embedded self-referentially in this file. Its actual identity is returned in Luna’s final message.

## Repair

The workflow keeps the raw relative `CI_BOOTSTRAP_REPORT` job value and derives `stage_report` with `path.resolve(path.dirname(base), "actionlint-bootstrap.json")`. The same absolute sibling is passed to `actionlint-bootstrap.mjs --report` and `ci-result.mjs --detail-file`. The helper validates an explicit report path before creating temporary directories, downloading/extracting actionlint, running the tool, writing a report, or appending `GITHUB_ENV`; its defensive report writer and supported null/no-report behavior remain.

The actual boundary suite executes the extracted current workflow shell body with the real helper and reporter, covers quoted-space and already-absolute bases, and runs the exact frozen T8 body as a negative control. The architect-only T8 guard excerpt received only a non-semantic ESLint global declaration, matching the prior r8 fixture; its diagnostic behavior and packet evidence remain unchanged.

## Source-bound prefixes

Both records were generated from independent `git clone --no-local` detached T9 checkouts with no `node_modules`, Node `v20.19.2`, the real official actionlint v1.7.7 archive, synthetic command files, and false sandbox opt-in.

| Mode | Synthetic run | Result | Counts | Evidence |
|---|---:|---|---|---|
| Clean | `900000601` | PASS | file-level `6/6`; nested cases `64/64`; 0 failed/skipped | [prefix-clean.json](prefix-clean.json), [raw commands](prefix-clean.commands.log) |
| Hosted-like | `900000602` | PASS | file-level `6/6`; nested cases `64/64`; 0 failed/skipped | [prefix-hosted-like.json](prefix-hosted-like.json), [raw commands](prefix-hosted-like.commands.log) |

Both prefixes record the raw report roots, the resolved sibling target, matching helper/recorder target, expected/measured archive SHA-256 `023070a287cd8cccd71515fedc843f1985bf96c436b7effaecce67290e7e0757`, expected/measured executable SHA-256 `9f7dedb4e23f89f2922073d1a6720405b7b520d4f5832ebb96f0d55a2958886c`, observed version `1.7.7`, absolute `ACTIONLINT_BIN` transfer, preserved command-file sentinels, and absent proof/policy/sandbox trees. The hosted-like prefix carries inherited synthetic sandbox state but leaves opt-in false.

The aggregate `pnpm test:ci` run is reported separately from the nested case probes: the Node runner discovered 6 file-level subtests, while the six modules contain and execute 64 inner cases (`6 + 4 + 11 + 12 + 18 + 13`). No count is borrowed from the failed hosted T8 run.

## Required local checks

All final T9 checks passed: frozen install (the initial restricted DNS failure and approved retry are both retained), syntax, real `pnpm lint:workflow`, `pnpm test:ci`, both source-bound prefixes, `pnpm lint`, `pnpm typecheck`, `pnpm build`, `pnpm test:unit` (`20/20`), `pnpm test:security` (`4/4`), and diff checks. See [commands.log](commands.log) and the individual raw logs.

## Historical hosted result

The settled T8 run `34928718810`, job `104252240220`, remains read-only evidence in [historical-hosted-receipt.json](historical-hosted-receipt.json). The API-listed artifact is `10380711446`, 5558 bytes, SHA-256 `3c3905e781479fb627481c6bbf5a0bbea03ae1ab93d323cfda5b1475415db92f`; the router-message ID `10380718846` is preserved only as a discrepancy. Its classification was `CI_BOOTSTRAP_FAILURE` at `actionlint-bootstrap`, with `proof_invoked=false`, `proof_exit_code=null`, and application gate counts `null`. The original ZIP is retained unchanged in the reviewed packet.

## Scope and ownership

[scope-comparison.json](scope-comparison.json) records the frozen application, sandbox, worker/renderer, Docker/Compose, dependency/native/Node/pnpm/Playwright, verifier, and original acceptance surfaces. No providers, publishing, release, deployment, credentials, hosted dispatch, sandbox qualification, bounded proof, or v0.2 work occurred. R9-T01 through R9-T12 are PASS; R9-T13 and R9-T14 remain router-owned NOT_RUN in [r9-results.json](r9-results.json).
