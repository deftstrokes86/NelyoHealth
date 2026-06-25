import { describe, expect, it } from "vitest";
import { tokenAuditSummary, tokens, visualDirection } from "./tokens";

describe("NelyoHealth design tokens", () => {
  it("uses the approved visual direction", () => {
    expect(visualDirection.id).toBe("VIS-DIR-002");
    expect(visualDirection.name).toBe("Warm Care Grid");
  });

  it("keeps required category coverage", () => {
    const counts = Object.fromEntries(tokenAuditSummary.map((item) => [item.category, item.count]));
    expect(counts.color).toBeGreaterThanOrEqual(26);
    expect(counts.typography).toBeGreaterThanOrEqual(12);
    expect(counts.spacing).toBeGreaterThanOrEqual(9);
    expect(counts.sizing).toBeGreaterThanOrEqual(8);
    expect(counts.radius).toBeGreaterThanOrEqual(5);
    expect(counts.elevation).toBeGreaterThanOrEqual(5);
    expect(counts.zIndex).toBeGreaterThanOrEqual(7);
    expect(counts.breakpoint).toBeGreaterThanOrEqual(5);
    expect(counts.motion).toBeGreaterThanOrEqual(16);
  });

  it("does not reference external font URLs", () => {
    expect(JSON.stringify(tokens)).not.toMatch(/https?:\/\//i);
  });
});
