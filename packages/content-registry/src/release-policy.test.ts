import { describe, expect, it } from "vitest";
import { evaluateContentRelease } from "./release-policy";
import { syntheticPreviewContent } from "./synthetic-preview-content";
import type { ContentEntry } from "./schema";
describe("content release policy", () => {
  it("rejects draft or synthetic preview content for production", () => {
    for (const entry of syntheticPreviewContent)
      expect(evaluateContentRelease(entry, "production").releasable).toBe(false);
  });

  it("blocks draft public-site entries from production", () => {
    const entry: ContentEntry = {
      id: "marketing-home.hero.headline",
      family: "marketing-home",
      status: "draft",
      contentClass: "public",
      surface: "public-site",
      title: "Care that follows the patient",
      body: "Routing across the care journey.",
      evidence: [],
      syntheticOnly: false
    };
    const decision = evaluateContentRelease(entry, "production");
    expect(decision.releasable).toBe(false);
    expect(decision.reasons.join(" ")).toMatch(/approved/i);
  });

  it("releases approved public-site entries with approvedBy evidence to production", () => {
    const entry: ContentEntry = {
      id: "marketing-home.hero.headline",
      family: "marketing-home",
      status: "approved",
      contentClass: "public",
      surface: "public-site",
      title: "Care that follows the patient",
      body: "Routing across the care journey.",
      approvedBy: "Content Owner (2026-07-13)",
      evidence: ["DEC-P05-MKT-004"],
      syntheticOnly: false
    };
    const decision = evaluateContentRelease(entry, "production");
    expect(decision.releasable).toBe(true);
  });
});
