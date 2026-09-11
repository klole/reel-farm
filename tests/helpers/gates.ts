import { mkdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { makeEvidenceRef, type EvidenceKind, type GateRecord, writeJson } from "../../scripts/ch001-harness.js";

const root = resolve(process.cwd());
const evidenceDir = resolve(process.env.CH001_EVIDENCE_DIR ?? "artifacts/ch001r2/local");
const gatePath = resolve(evidenceDir, "gate-evidence.json");

export async function recordGateEvidence(entries: Array<{ id: string; path: string; kind: EvidenceKind; reference: string; reviewer?: string; inspection?: string }>): Promise<void> {
  await mkdir(evidenceDir, { recursive: true });
  let current: GateRecord[];
  try { current = JSON.parse(await readFile(gatePath, "utf8")) as GateRecord[]; } catch { current = []; }
  for (const entry of entries) {
    const ref = await makeEvidenceRef(root, entry.path, entry.kind, entry.reference, process.env.CH001_IMPLEMENTATION_COMMIT ?? "working-tree", { reviewer: entry.reviewer, inspection: entry.inspection });
    const record: GateRecord = { id: entry.id, status: "PASS", implementation_commit: ref.implementation_commit, actual_evidence: [ref], reason: `Executed by ${entry.reference}.` };
    current = [...current.filter((candidate) => candidate.id !== entry.id), record];
  }
  await writeJson(gatePath, current);
}
