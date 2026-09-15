#!/usr/bin/env bash
# Reference only: splice the stage_report assignment into the existing workflow
# stage after review. This file is not a replacement for the full CI stage.
set -euo pipefail
stage_report="$(node --input-type=commonjs -e '
  const path = require("node:path");
  const base = process.env.CI_BOOTSTRAP_REPORT;
  if (typeof base !== "string" || base.length === 0 || /[\0\r\n]/.test(base)) {
    throw new Error("CI_BOOTSTRAP_REPORT must be a non-empty single-line path.");
  }
  process.stdout.write(path.resolve(path.dirname(base), "actionlint-bootstrap.json"));
')"
printf '%s\n' "$stage_report"
