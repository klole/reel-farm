import { mkdir, readFile, rename } from "node:fs/promises";
import { resolve } from "node:path";
import { makeEvidenceRef, type EvidenceKind, type GateRecord, writeJson } from "../../scripts/ch001-harness.js";

const root = resolve(process.cwd());
const evidenceDir = resolve(process.env.CH001_EVIDENCE_DIR ?? "artifacts/ch001r3/local");
const gatePath = resolve(evidenceDir, "gate-evidence.json");
let writeQueue = Promise.resolve();

function sameEvidence(left: GateRecord["actual_evidence"][number], right: GateRecord["actual_evidence"][number]): boolean {
  return left.path === right.path && left.sha256 === right.sha256 && left.kind === right.kind && left.reference === right.reference && left.implementation_commit === right.implementation_commit;
}

export async function recordGateEvidence(entries: Array<{ id: string; path: string; kind: EvidenceKind; reference: string; reviewer?: string; inspection?: string }>): Promise<void> {
  const task = writeQueue.then(async () => {
    await mkdir(evidenceDir, { recursive: true });
    let current: GateRecord[];
    try {
      const loaded = JSON.parse(await readFile(gatePath, "utf8")) as unknown;
      current = Array.isArray(loaded) ? loaded : [];
    } catch { current = []; }
    const records = new Map(current.map((record) => [record.id, record]));
    for (const entry of entries) {
      const extras = { ...(entry.reviewer ? { reviewer: entry.reviewer } : {}), ...(entry.inspection ? { inspection: entry.inspection } : {}) };
      const ref = await makeEvidenceRef(root, entry.path, entry.kind, entry.reference, process.env.CH001_IMPLEMENTATION_COMMIT ?? "working-tree", extras);
      const previous = records.get(entry.id);
      const evidence = [...(previous?.actual_evidence ?? [])];
      if (!evidence.some((candidate) => sameEvidence(candidate, ref))) evidence.push(ref);
      records.set(entry.id, {
        id: entry.id,
        // A separately recorded failure remains a failure until the central
        // coordinator explicitly resolves it; evidence contributions do not
        // erase an assertion result from another suite.
        status: previous?.status === "FAIL" ? "FAIL" : "PASS",
        implementation_commit: ref.implementation_commit,
        actual_evidence: evidence,
        reason: previous?.status === "FAIL" ? previous.reason : `Executed by ${entry.reference}.`
      });
    }
    const temporaryPath = `${gatePath}.${process.pid}.tmp`;
    await writeJson(temporaryPath, [...records.values()]);
    await rename(temporaryPath, gatePath);
  });
  writeQueue = task.catch(() => undefined);
  await task;
}
