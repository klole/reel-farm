export type MigrationStatus = "PASS" | "FAIL" | "NOT_RUN";
export type MigrationCommandObservation = {
  cli?: { exit_code?: number | null; timed_out?: boolean; [key: string]: unknown };
  container?: { exit_code?: number | null; state?: string | null; timed_out?: boolean; [key: string]: unknown };
  [key: string]: unknown;
};
export declare function isSuccessfulMigrationTerminal(observation: MigrationCommandObservation): boolean;
export declare function isSuccessfulExpectedFailure(observation: MigrationCommandObservation): boolean;
export declare function runMigrationFirstQualification(input: {
  identity: Record<string, unknown> & { run_id: string; implementation_commit: string };
  adapter: {
    buildImages: () => Promise<MigrationCommandObservation>;
    verifyModuleImport: () => Promise<Record<string, unknown>>;
    startDatabase: () => Promise<MigrationCommandObservation>;
    waitForDatabase: () => Promise<Record<string, unknown>>;
    confirmFreshMarkerAbsent: () => Promise<Record<string, unknown>>;
    runMigration: (stage: "fresh" | "repeat") => Promise<MigrationCommandObservation>;
    inspectSchema: () => Promise<Record<string, unknown>>;
    createSentinel: () => Promise<Record<string, unknown>>;
    inspectRepeatState: () => Promise<Record<string, unknown>>;
    runFailureControl: () => Promise<Record<string, unknown>>;
    cleanupFixtures: () => Promise<Record<string, unknown>>;
  };
  writeResult: (result: Record<string, unknown>) => Promise<void>;
}): Promise<Record<string, unknown>>;
export declare const MIGRATION_STATUS: Readonly<{ PASS: "PASS"; FAIL: "FAIL"; NOT_RUN: "NOT_RUN" }>;
