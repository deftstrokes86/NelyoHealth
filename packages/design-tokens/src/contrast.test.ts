import { describe, expect, it } from "vitest";
import { assertAccessibleContrast, contrastRatio, evaluateContrast } from "./contrast";
describe("contrast checks", () => {
  it("computes a known black and white ratio", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBe(21);
  });
  it("passes required AA normal text pairs (light theme)", () => {
    assertAccessibleContrast("light");
    expect(evaluateContrast("light").every((item) => item.passesAaNormal)).toBe(true);
  });
  it("passes required AA normal text pairs (dark theme)", () => {
    assertAccessibleContrast("dark");
    const dark = evaluateContrast("dark");
    expect(dark.length).toBeGreaterThan(0);
    expect(dark.every((item) => item.passesAaNormal)).toBe(true);
  });
});
