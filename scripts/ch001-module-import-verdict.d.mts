export type FinalImageModuleImportVerdict = {
  status: "PASS" | "FAIL";
  classification: "MODULE_IMPORT_PASS_NOT_DATABASE_PROOF" | "MODULE_IMPORT_FAIL";
  effective_verdict: "PASS" | "FAIL";
  cli: { exit_code: number | null; timed_out: boolean; output_truncated: boolean };
  child_report: { status: string | null; classification: string | null; valid: boolean };
  container: { state: string | null; exit_code: number | null; identity_present: boolean };
  inspection_error: "inspection_failed" | null;
  reasons: string[];
};
export declare function evaluateFinalImageModuleImport(input: { cli: Record<string, unknown> | null; parsed: unknown; container: Record<string, unknown> | null; inspectionError?: string | null }): FinalImageModuleImportVerdict;
