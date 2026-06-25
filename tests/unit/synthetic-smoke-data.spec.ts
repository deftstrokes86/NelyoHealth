import { describe, expect, it } from "vitest";
import { forbiddenProtectedSentinels, smokeCopy } from "../helpers/synthetic-smoke-data.js";

describe("synthetic smoke data", () => {
  it("uses only synthetic smoke labels", () => {
    expect(smokeCopy.heading).toContain("Smoke");
    expect(Object.values(smokeCopy).join(" ").toLowerCase()).toContain("synthetic");
  });

  it("tracks protected sentinels for browser artifact checks", () => {
    expect(forbiddenProtectedSentinels).toContain("real patient");
    expect(forbiddenProtectedSentinels).toContain("pharmacy address");
    expect(forbiddenProtectedSentinels).toContain("laboratory address");
  });
});
