# Sources and verification boundary

Repository sources were read through the connected GitHub tool on 2026-09-15. Except S16, commit-pinned URLs identify the reviewed material. Main was separately queried and returned E13. Reported checks are attributed to the handoff; only the six isolated checks and document/integrity checks in this packet were executed by the architect.

A retrieved Git blob SHA identifies the whole file even when only the named line range was read. Do not infer that every file in the repository was audited. Only the two copied dependency-free modules were independently rehashed against their Git blob identities in this review. The workflow SHA-256 and lock hash remain recorded source-evidence values for the router to recompute; matching workflow blob IDs were directly checked at both commits.

- **S1 — r13 handoff:** https://github.com/klole/reel-farm/blob/d1ab7226b71e93235a9761f1432b6fb7be198609/handoffs/CH-001R-r13.md; Git blob `5c5706e1b6c53a36bff0ec5ae7d9454aa6c91e27`.
- **S2 — explicit migration command builder/adapter:** https://github.com/klole/reel-farm/blob/6e04b5a5eefe2ef464572da35c88338fa342f525/scripts/ch001-migration-command.mjs; Git blob `ab09537b92b813d06e41062bf947a761c0a3082f`.
- **S3 — proof SQL adapter and fixture routing, inspected source lines 650–920:** https://github.com/klole/reel-farm/blob/6e04b5a5eefe2ef464572da35c88338fa342f525/scripts/ch001-proof.ts; Git blob `61a34712b878f746dad24f744e4230b443ee7dd9`.
- **S4 — routing/negative-witness tests:** https://github.com/klole/reel-farm/blob/6e04b5a5eefe2ef464572da35c88338fa342f525/tests/ci/migration-regression-boundary.test.mjs; Git blob `d60f451313ed2ed899f0328afecc957703c69309`.
- **S5 — invocation serializer:** https://github.com/klole/reel-farm/blob/6e04b5a5eefe2ef464572da35c88338fa342f525/scripts/ch001-command-records.mjs; Git blob `b667f4c2742a6c90a75b6f0b7b090c20ca5916bb`.
- **S6 — proof final serializer/verifier wiring, inspected lines 1300–end:** https://github.com/klole/reel-farm/blob/6e04b5a5eefe2ef464572da35c88338fa342f525/scripts/ch001-proof.ts; Git blob `61a34712b878f746dad24f744e4230b443ee7dd9`.
- **S7 — command validator and retained gate validation:** https://github.com/klole/reel-farm/blob/6e04b5a5eefe2ef464572da35c88338fa342f525/scripts/ch001-harness.ts; Git blob `03cb94357b8a1fd701360e51020a6c5a44a4bc0e`.
- **S8 — verifier test source, inspected beginning through new r13 cases:** https://github.com/klole/reel-farm/blob/6e04b5a5eefe2ef464572da35c88338fa342f525/tests/unit/verifier.test.ts.
- **S9 — canonical E13 commit and parent:** https://api.github.com/repos/klole/reel-farm/git/commits/d1ab7226b71e93235a9761f1432b6fb7be198609.
- **S10 — P13 to T13 changed-file comparison:** https://api.github.com/repos/klole/reel-farm/compare/34be09f3a211aae01582270708b565b4a7cce539...6e04b5a5eefe2ef464572da35c88338fa342f525.
- **S11 — canonical T13 and parent; P13 and parent:** https://api.github.com/repos/klole/reel-farm/git/commits/6e04b5a5eefe2ef464572da35c88338fa342f525.
- **S12 — T13 to E13 evidence-only comparison:** https://api.github.com/repos/klole/reel-farm/compare/6e04b5a5eefe2ef464572da35c88338fa342f525...d1ab7226b71e93235a9761f1432b6fb7be198609.
- **S13 — r13 repair checklist:** https://github.com/klole/reel-farm/blob/d1ab7226b71e93235a9761f1432b6fb7be198609/docs/evidence/CH-001R-r13/r13-results.json; Git blob `d685fa32abfaaf53a79bc000514f3fd913794579`.
- **S14 — reported command matrix:** https://github.com/klole/reel-farm/blob/d1ab7226b71e93235a9761f1432b6fb7be198609/docs/evidence/CH-001R-r13/commands.md; Git blob `cd8aae202119c8c1ca52b08ec13894ce23ce66f3`.
- **S15 — workflow header/input schema and full blob identity at T13 and E13:** https://github.com/klole/reel-farm/blob/6e04b5a5eefe2ef464572da35c88338fa342f525/.github/workflows/ch001-live-proof.yml; Git blob `35fa339aac2fcb024cd476ff38d87d27eb6482af`.
- **S16 — point-in-time manual-run query; returned zero records:** https://api.github.com/repos/klole/reel-farm/actions/runs?event=workflow_dispatch&created=%3E%3D2026-09-15T10%3A39%3A29Z&per_page=100.
- **S17 — local command array and beginning of child records, inspected lines 1–155:** https://github.com/klole/reel-farm/blob/d1ab7226b71e93235a9761f1432b6fb7be198609/docs/evidence/CH-001R-r13/local-proof/artifacts/ch001r13/r13-local-20260915c/public/command-report.json; Git blob `f623f248aed5b75eb8b8d0f314941f66ba141e87`.
- **S18 — scope/frozen-surface record:** https://github.com/klole/reel-farm/blob/d1ab7226b71e93235a9761f1432b6fb7be198609/docs/evidence/CH-001R-r13/scope-comparison.json; Git blob `176b06ba472945ca8b652b165de63a576d70780c`.
- **P1 — official GitHub CLI workflow dispatch syntax:** https://cli.github.com/manual/gh_workflow_run.
- **P2 — official manual-workflow guidance:** https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow.

P13 parentage was separately read at `https://api.github.com/repos/klole/reel-farm/git/commits/34be09f3a211aae01582270708b565b4a7cce539`. Main query: `https://api.github.com/repos/klole/reel-farm/git/ref/heads/main`.

The official CLI documentation confirms `gh workflow run` submits a manual event, accepts `-f` inputs, and uses `--ref` for the workflow definition branch/tag. GitHub's manual-run guidance requires the workflow-dispatch configuration on the default branch. These documentation facts explain the request command; they are not evidence that any request was sent.
