import { describe, expect, it } from "vitest";
import { assertAccessibleContrast, contrastRatio, evaluateContrast } from "./contrast";
describe("contrast checks", () => {
  it("computes a known black and white ratio", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBe(21);
  });
  it("passes required AA normal text pairs", () => {
    assertAccessibleContrast();
    expect(evaluateContrast().every((item) => item.passesAaNormal)).toBe(true);
  });
});
