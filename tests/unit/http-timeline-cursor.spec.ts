import { describe, expect, it } from "vitest";
import {
  decodeTimelineCursor,
  encodeTimelineCursor,
  parseLimit
} from "../../apps/api/src/nest/resource/timeline-cursor.js";

describe("timeline cursor (M7, ADR-0014 edge hygiene)", () => {
  const entry = {
    occurredAt: "2026-07-27T10:00:00.000Z",
    entryId: "11111111-1111-1111-1111-111111111111"
  };

  it("round-trips an opaque keyset cursor", () => {
    expect(decodeTimelineCursor(encodeTimelineCursor(entry))).toEqual(entry);
  });

  it("rejects a tampered/malformed cursor with a uniform 400 (never a 500 or oracle)", () => {
    for (const bad of [
      "not-base64!!",
      Buffer.from("garbage").toString("base64url"),
      Buffer.from("2026|not-a-uuid").toString("base64url"),
      Buffer.from("|").toString("base64url")
    ]) {
      let thrown: unknown;
      try {
        decodeTimelineCursor(bad);
      } catch (error) {
        thrown = error;
      }
      // Duck-typed (avoid importing @nestjs/common from the root test context): the
      // RequestValidationException is a Nest 400.
      expect(thrown).toBeTruthy();
      expect((thrown as { getStatus: () => number }).getStatus()).toBe(400);
    }
  });

  it("clamps the page limit into a safe range", () => {
    expect(parseLimit(undefined)).toBe(50);
    expect(parseLimit("10")).toBe(10);
    expect(parseLimit("99999")).toBe(200);
    expect(parseLimit("-5")).toBe(50);
    expect(parseLimit("abc")).toBe(50);
  });
});
