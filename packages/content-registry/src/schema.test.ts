import { describe, expect, it } from "vitest";
import { syntheticPreviewContent } from "./synthetic-preview-content";
import { validateContentRegistry } from "./validation";
describe("content registry schema", () => {
  it("validates synthetic preview content", () => {
    expect(validateContentRegistry(syntheticPreviewContent)).toHaveLength(
      syntheticPreviewContent.length
    );
  });
});
