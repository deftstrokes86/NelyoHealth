import { describe, expect, it } from "vitest";
import { evaluateContentRelease } from "./release-policy";
import { syntheticPreviewContent } from "./synthetic-preview-content";
describe("content release policy", () => {
  it("rejects draft or synthetic preview content for production", () => {
    for (const entry of syntheticPreviewContent)
      expect(evaluateContentRelease(entry, "production").releasable).toBe(false);
  });
});
