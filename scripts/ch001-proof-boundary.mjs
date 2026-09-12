/* global process */

import { mkdir, readdir, rename, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve } from "node:path";

const RUN_ID_PATTERN = /^[a-z0-9][a-z0-9-]{2,47}$/;

function errorCode(error) {
  return error && typeof error === "object" && "code" in error ? error.code : undefined;
}

export function assertValidProofRunId(runId) {
  if (typeof runId !== "string" || !RUN_ID_PATTERN.test(runId)) throw new Error("CH001_RUN_ID must be a short lowercase run-owned identifier.");
  return runId;
}

export function resolveProofEvidenceRoot(repositoryRoot, configuredRoot, runId) {
  assertValidProofRunId(runId);
  const root = resolve(repositoryRoot);
  const evidenceRoot = resolve(root, configuredRoot ?? `artifacts/ch001r3/${runId}`);
  const evidenceRelative = relative(root, evidenceRoot);
  if (!evidenceRelative || evidenceRelative.startsWith("..") || isAbsolute(evidenceRelative)) throw new Error(`CH001_EVIDENCE_ROOT must remain inside the repository: ${evidenceRoot}`);
  return evidenceRoot;
}

export async function prepareProofEvidenceDirectories(evidenceRoot) {
  const root = resolve(evidenceRoot);
  await mkdir(dirname(root), { recursive: true });

  let created = false;
  try {
    await mkdir(root, { recursive: false, mode: 0o750 });
    created = true;
  } catch (error) {
    if (errorCode(error) !== "EEXIST") throw error;
  }

  if (!created && (await readdir(root)).length > 0) throw new Error(`Evidence run directory already exists and is non-empty: ${root}. Use a new CH001_RUN_ID; proof resumption is not implicit.`);

  const privateDir = resolve(root, "private");
  const publicDir = resolve(root, "public");
  const privateCommandDir = resolve(privateDir, "commands");
  const publicCommandDir = resolve(publicDir, "commands");
  await mkdir(privateCommandDir, { recursive: true, mode: 0o700 });
  await mkdir(publicCommandDir, { recursive: true, mode: 0o750 });
  return { evidenceRoot: root, privateDir, publicDir, privateCommandDir, publicCommandDir, emptyEnvPath: resolve(privateDir, "empty.env") };
}

export async function writeCoordinatorFailureReport({ publicDir, ownsEvidence, report }) {
  if (!ownsEvidence) return false;
  const target = resolve(publicDir, "proof-result.json");
  await mkdir(dirname(target), { recursive: true, mode: 0o750 });
  const temporary = resolve(dirname(target), `.proof-result.${process.pid}.tmp`);
  await writeFile(temporary, `${JSON.stringify(report, null, 2)}\n`, { mode: 0o640 });
  await rename(temporary, target);
  return true;
}
