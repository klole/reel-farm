# CH-001R-r8 evidence — bounded CI helper and environment re-merge repair

This is the bounded v0.1.0 continuation for Open Slideshow Studio. It repairs the pre-install CI boundary from hosted run `34678495442`; it is not v0.2, full application acceptance, browser proof, provider work, publishing, or a hosted rerun.

State remains `awaiting_review`; `application_acceptance=false`; accepted application version is `none`.

## Identities

| Item | Value |
|---|---|
| Packet P8 | `f2d6baa075af14fbe74e836240198a90ea5d4fd1` / tree `a832532aad3956687c169c57c3c6e5c8adff51a1` |
| Prior T7 | `6b02857401a9b1e81e1bd36d5a4418f90903adcb` / tree `fdbe7da15964659d4e2514580f6606f5731790ce` |
| Prior E7 | `6e4f9b3d288b7177ebfc8b49ff3c833610640060` |
| T8 implementation | `0144f6c41ae4c6143a2dc46fe22d59d453ce8763` / tree `f16f32465b37439774369ddf002a22063c104088` |
| T8 parent | `f2d6baa075af14fbe74e836240198a90ea5d4fd1` |
| T8 workflow blob | `fb4d3e4ee58eff81e43395fa6df99c53b65de417` |
| T8 workflow SHA-256 | `0ca1701d63be141fccff778c03e199cd3a55c5502d186000adf0e4bd545eac6c` |
| actionlint provenance | [`scripts/ci/actionlint-provenance.json`](../../../scripts/ci/actionlint-provenance.json), SHA-256 `77b06107c044ad17b5b483f47e9365f587731a5697f4399d6b0086297cc3ef17` |
| Evidence commit | Returned after this evidence-only commit; not embedded self-referentially |

## Historical failure and bounded repair

The architect packet's hosted observation for run `34678495442`, job `103512556268`, records the unchanged T7 checkout, Node `20.19.2`, `50` CI tests with `45` pass, `5` fail, and `0` skipped. The failing helper cases were R7-T01 through R7-T04 and R7-T07; native pnpm, install, browser, sandbox, Docker, and proof were skipped, with `proof_invoked=false`. That run was read as evidence and was not rerun.

The two causes were repaired at their boundaries:

1. The workflow now provisions and verifies the checked-in Linux/amd64 actionlint `1.7.7` archive before semantic workflow validation and before `node --test tests/ci`. The archive and installed executable are verified against the pinned SHA-256 values, the version is checked, and the same absolute executable is exported to the current process and appended to `GITHUB_ENV`.
2. The environment tests now distinguish a complete child environment from an override map. Hosted-like parent variables are explicit, and deleting `RUNNER_TEMP` or `GITHUB_ENV` is no longer accidentally undone by a second merge. Child observations show the missing key stays absent, the initializer fails, and both synthetic environment files remain byte-preserved.

The architect reproduction fixture received only a `/* global process */` ESLint declaration so the required repository-wide lint command remains clean; it does not alter the reproduction.

## Fresh results

- Official actionlint archive download and verification passed in both final T8 prefix runs. Archive SHA-256 was `023070a287cd8cccd71515fedc843f1985bf96c436b7effaecce67290e7e0757`; executable SHA-256 was `9f7dedb4e23f89f2922073d1a6720405b7b520d4f5832ebb96f0d55a2958886c`; observed version was `1.7.7`.
- Clean prefix run `800000016` and hosted-like prefix run `800000017` checked out T8 with no `node_modules`, Node `v20.19.2`, and the real validator. Each ran `node --test tests/ci`: `58` discovered, `58` passed, `0` failed, `0` skipped.
- In both prefixes, exactly one `ACTIONLINT_BIN` entry was appended to `GITHUB_ENV`; `GITHUB_PATH`, `GITHUB_STEP_SUMMARY`, and `GITHUB_OUTPUT` stayed byte-identical. The hosted-like run also carried an inherited sandbox-state value.
- The native pinned pnpm bootstrap and `pnpm install --frozen-lockfile` passed with pnpm `12.3.4`. The first restricted-sandbox registry attempt failed DNS resolution; the bounded approved retry passed. This is recorded transparently in [`commands.log`](commands.log).
- Final scoped commands passed: `pnpm lint:workflow`, `pnpm test:ci`, `pnpm lint`, `pnpm typecheck`, `pnpm build`, `pnpm test:unit` (`20/20`), `pnpm test:security` (`4/4`), syntax checks, and `git diff --check`.

No `pnpm proof:ch001`, `pnpm verify:ch001`, browser proof, Docker/Compose proof, AppArmor operation, provider call, publication, release, or hosted workflow dispatch was performed. The original 72-gate contract and application acceptance state were not changed.

See [`r8-results.json`](r8-results.json) for the bounded checklist, [`actionlint-bootstrap.json`](actionlint-bootstrap.json) for prerequisite attestations, and [`clean-prefix.json`](clean-prefix.json) plus [`hosted-like-prefix.json`](hosted-like-prefix.json) for the two pre-install rehearsals. All raw temporary paths are disclosed as execution evidence and are not relied upon as future artifacts.

## Router boundary

T8 and this evidence remain local. `origin/main` was still P8 at the final check, and no hosted job was dispatched from Luna. The router must publish through its authorized path, revalidate the publication tree and exact workflow bytes, and own the optional single fresh T8 dispatch. R8-T13 and R8-T14 therefore remain `NOT_RUN`.
