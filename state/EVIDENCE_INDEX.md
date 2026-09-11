# Evidence index — CH-001

| Evidence | Location | State |
|---|---|---|
| Baseline, packet hashes, host capabilities | [CH-001 preflight](../docs/chapters/CH-001/PREFLIGHT.md) | Recorded |
| Install, service lifecycle, command contract | [CH-001 commands](../docs/chapters/CH-001/COMMANDS.md) | Recorded |
| Versions, licenses, fixture/UI provenance | [CH-001 dependencies](../docs/chapters/CH-001/DEPENDENCIES.md) | Recorded |
| Gate ledger for CH001-001..072 | [gate-results.json](../docs/evidence/CH-001/gate-results.json) | Recorded; unavailable live gates are NOT_RUN |
| Raw command output | `artifacts/ch001/local/` | Generated locally; gitignored |
| Screenshots, browser trace, render corpus, seven-slide ZIP | `artifacts/ch001/local/` | Not produced: required services/browser unavailable |
| Handoff | [handoffs/CH-001.md](../handoffs/CH-001.md) | Awaiting architect review |

## CH-001R-r2 continuation

| Evidence | Location | State |
|---|---|---|
| Fresh command, suite, environment, and verifier reports | [CH-001R-r2 evidence](../docs/evidence/CH-001R-r2/README.md) | Recorded; aggregate blocked by unavailable live prerequisites |
| Fresh 72-gate ledger | [gate-results.json](../docs/evidence/CH-001R-r2/gate-results.json) | 4 E1 source-only PASS, 0 FAIL, 68 NOT_RUN |
| Fresh retrievable command logs | `docs/evidence/CH-001R-r2/01-*.log` through `09-*.log` | Recorded; all nine root commands ran |
| Seven-slide ZIP/screenshots/preview hashes | `docs/evidence/CH-001R-r2/` | Not produced because PostgreSQL, browser, and Docker were unavailable |
| Handoff | [handoffs/CH-001R.md](../handoffs/CH-001R.md) | Awaiting architect review |

No artifact path in this index is a promise of a future CI run or external attachment. Missing live artifacts are disclosed rather than represented by placeholder screenshots or exports.
