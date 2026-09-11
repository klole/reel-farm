import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: false,
    environment: "node",
    includeSource: ["packages/**/*.ts"],
    reporters: ["default", "json"],
    outputFile: { json: "artifacts/unit-results.json" }
  }
});
