import { describe, expect, it } from "vitest";
import { tokenAuditSummary, tokens, visualDirection } from "./tokens";

describe("NelyoHealth design tokens", () => {
  it("uses the approved visual direction", () => {
    expect(visualDirection.id).toBe("VIS-DIR-002");
    expect(visualDirection.name).toBe("Warm Care Grid");
  });

  it("keeps required category coverage", () => {
    const counts = Object.fromEntries(tokenAuditSummary.map((item) => [item.category, item.count]));
    expect(counts.color).toBeGreaterThanOrEqual(45);
    expect(counts.typography).toBeGreaterThanOrEqual(20);
    expect(counts.spacing).toBeGreaterThanOrEqual(11);
    expect(counts.sizing).toBeGreaterThanOrEqual(14);
    expect(counts.radius).toBeGreaterThanOrEqual(5);
    expect(counts.elevation).toBeGreaterThanOrEqual(5);
    expect(counts.shadow).toBeGreaterThanOrEqual(8);
    expect(counts.zIndex).toBeGreaterThanOrEqual(9);
    expect(counts.breakpoint).toBeGreaterThanOrEqual(7);
    expect(counts.grid).toBeGreaterThanOrEqual(11);
    expect(counts.icon).toBeGreaterThanOrEqual(9);
    expect(counts.status).toBeGreaterThanOrEqual(8);
    expect(counts.button).toBeGreaterThanOrEqual(18);
    expect(counts.card).toBeGreaterThanOrEqual(11);
    expect(counts.formControl).toBeGreaterThanOrEqual(14);
    expect(counts.navigation).toBeGreaterThanOrEqual(11);
    expect(counts.badge).toBeGreaterThanOrEqual(16);
    expect(counts.motion).toBeGreaterThanOrEqual(22);
    expect(counts.marketing).toBeGreaterThanOrEqual(30);
  });

  it("does not reference external font URLs", () => {
    expect(JSON.stringify(tokens)).not.toMatch(/https?:\/\//i);
  });

  it("provides a dark value for every semantic color token", () => {
    const semanticColors = Object.entries(tokens.color).filter(
      ([, definition]) => definition.category === "semantic"
    );
    const missing = semanticColors
      .filter(([, definition]) => !definition.dark)
      .map(([name]) => name);
    expect(missing).toEqual([]);
  });

  it("exposes editorial marketing tokens with clamp-based scales", () => {
    expect(tokens.marketing["display-2xl"].value).toMatch(/^clamp\(/);
    expect(tokens.marketing["display-xl"].value).toMatch(/^clamp\(/);
    expect(tokens.marketing["display-lg"].value).toMatch(/^clamp\(/);
    expect(tokens.marketing["prose-md"].value).toBe("1.125rem");
    expect(tokens.marketing["content-editorial"].value).toBe("72ch");
  });

  it("provides reduced-motion equivalents for every marketing motion pattern", () => {
    const motionTokens = Object.entries(tokens.marketing).filter(
      ([, definition]) => definition.category === "motion"
    );
    const defaults = new Set(
      motionTokens
        .filter(([name]) => !name.includes("-reduced-"))
        .map(([name]) =>
          name
            .replace(/-duration$|-ease$|-distance$/, "")
            .replace(/^motion-/, "")
        )
    );
    const reduced = new Set(
      motionTokens
        .filter(([name]) => name.includes("-reduced-"))
        .map(([name]) =>
          name
            .replace(/-reduced-duration$|-reduced-distance$/, "")
            .replace(/^motion-/, "")
        )
    );
    for (const pattern of defaults) {
      expect(reduced.has(pattern)).toBe(true);
    }
  });
});
