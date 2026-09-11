import { describe, expect, it } from "vitest";
import { safeStorageKey } from "../../packages/storage/src/index.ts";

describe("local storage containment", () => {
  it("accepts scoped keys and rejects traversal, absolute, and platform separator forms", () => {
    expect(safeStorageKey("accepted/workspace/asset/derivative.jpg")).toBe("accepted/workspace/asset/derivative.jpg");
    for (const key of ["../escape", "accepted/../escape", "/tmp/escape", "accepted\\\\escape", ""]) {
      expect(() => safeStorageKey(key)).toThrow();
    }
  });
});
