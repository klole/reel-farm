# CH-001 preflight and baseline record

Recorded 2026-09-11 UTC for CH-001-r1 / target v0.1.0.

## Repository control

- Repository: `reel-farm`; branch: `main`.
- Remote: `origin` points to the authorized GitHub repository; no credential-bearing URL is recorded here.
- Required starting base: `ce17fdf5cade9b91b46da86af943a8be651289f5`.
- Implementation commits: `a74cc83` introduced the application, `9afb7a2` fixed executable gate scripts, `bbe3709` hardened the renderer, and final tested implementation commit is `bdd6540b90f2d59b7ef11215cd0ceb631fc6336a`.
- The starting commit was verified exactly. At activation the repository had no application implementation. Two pre-existing untracked user paths were preserved untouched: `handoffs/luna-ch001-dispatch.md` and `logs/luna-ch001.jsonl`.
- Generated TypeScript build-info files are ignored and are not part of the implementation commit.

## Packet fingerprints

The supplied packet was read before implementation. SHA-256 values at activation:

| File | SHA-256 |
|---|---|
| `ACTIVATION_AND_BASELINE.md` | `5563e36ba347287ad51b2a98fce3800d3a4a6f714f49ca7bfd41045564a6ac5c` |
| `CHAPTER_BRIEF.md` | `e470de3dacb935c017dbaf994e893ef6d7876eb71617ca35449755ed5c2a54d7` |
| `ACCEPTANCE_TESTS.md` | `3d599ea95cc20cd08cee8ec05aa55df47f91eaf918c37cbef969e4186174c7ef` |
| `HANDOFF_TEMPLATE.md` | `83be77c88eea69544f7773b8af8ab3289ea4099d2fa2015c5d7bc1587f79e936` |
| `LUNA_CH001_v0.1.0_COMPLETE.md` | `2ee9eeef164740cb28f8f7f879f9f4c45418139b7e03b47dc6ecffd042058a3b` |
| `reference/north-star/NORTH_STAR.md` (NS-0.2) | `3175b197c221588fa92273c9f8403ecbcc2357fe486f63a97365205d951ad80d` |
| `gate-results.template.json` | `a9e6860ee8d377bc7e23e6f365f441705722723319d8367a515dd51c16a4531c` |

## Reference environment

- OS/kernel: Debian 13, Linux 6.12.94+, x86_64.
- Node.js: `v20.19.2`.
- pnpm: `12.3.4`.
- System browser: Google Chrome `151.0.7922.169`.
- Docker, Docker Compose, Podman, PostgreSQL client, `pg_isready`, and a `chromium` executable were unavailable in the activation host.
- No `.env` or local database was created during this checkpoint run. The setup script remains idempotent and generates secrets only when a user invokes it.

The host therefore supported static compilation, isolated unit/security checks, and dependency installation, but not the required real PostgreSQL, Compose, authenticated browser, or worker render exercises. Those gates are recorded as `NOT_RUN`; no mock result is promoted to a live-pipeline pass.
