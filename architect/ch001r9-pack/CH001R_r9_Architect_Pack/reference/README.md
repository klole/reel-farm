# Reference diagnostics, not application proof

`resolve-actionlint-report.reference.sh` is an architect-proposed caller-side resolver. It runs in the checked-out repository working directory. Relative report roots are resolved there; an already-absolute root is preserved. It does not modify `CI_BOOTSTRAP_REPORT` or create directories.

`T8-report-guard.excerpt.mjs` contains the relevant inspected T8 path-check logic with a small diagnostic entry point. It is **not** the full bootstrap implementation. `diagnose-report-path.py` exercises shell/path behavior only, without downloads, actionlint, GitHub Actions, or application processes.

The mandatory Luna tests must use actual source bytes and the real bootstrap/reporter; these reference results cannot replace them.
