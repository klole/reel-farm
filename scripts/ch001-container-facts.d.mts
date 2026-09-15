export type SelectedMigrationContainerFacts = Record<string, unknown> & {
  inspection_status: "PASS" | "FAIL";
};
export declare function projectMigrationContainerInspection(value: unknown, fallbackName?: string | null, redact?: (value: string) => string): SelectedMigrationContainerFacts;
export declare function projectDockerImageInspection(value: unknown, fallbackId?: string | null, redact?: (value: string) => string): Record<string, unknown> & { inspection_status: "PASS" | "FAIL" };
