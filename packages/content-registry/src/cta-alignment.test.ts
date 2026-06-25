import { describe, expect, it } from "vitest";
import { syntheticPreviewContent } from "./synthetic-preview-content";
import { assertNoProtectedProviderLeakage } from "./validation";
describe("CTA alignment", () => {
  it("keeps CTAs aligned with locked requirements", () => {
    assertNoProtectedProviderLeakage(syntheticPreviewContent);
    expect(
      syntheticPreviewContent.find((entry) => entry.id === "emergency-escalation.always-available")
        ?.body
    ).toMatch(/never blocked/i);
  });
});
