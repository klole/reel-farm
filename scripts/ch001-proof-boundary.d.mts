export type ProofEvidenceDirectories = {
  evidenceRoot: string;
  privateDir: string;
  publicDir: string;
  privateCommandDir: string;
  publicCommandDir: string;
  emptyEnvPath: string;
};

export function assertValidProofRunId(runId: string): string;
export function resolveProofEvidenceRoot(repositoryRoot: string, configuredRoot: string | undefined, runId: string): string;
export function prepareProofEvidenceDirectories(evidenceRoot: string): Promise<ProofEvidenceDirectories>;
export function writeCoordinatorFailureReport(options: { publicDir: string; ownsEvidence: boolean; report: unknown }): Promise<boolean>;
