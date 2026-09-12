import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

const unitReport = process.env.CH001_UNIT_REPORT ?? "artifacts/unit-results.json";

export default defineConfig({
  test: {
    globals: false,
    environment: "node",
    includeSource: ["packages/**/*.ts"],
    reporters: ["default", "json"],
    outputFile: { json: resolve(process.cwd(), unitReport) }
  }
});
