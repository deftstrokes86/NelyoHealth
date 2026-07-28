import { describe, expect, it } from "vitest";
import { isSameOrigin } from "../../apps/patient-web/src/lib/same-origin.js";

/**
 * M7.1, ADR-0014: the BFF's HttpOnly-cookie auth reintroduces CSRF. The origin
 * check on mutation routes must accept same-origin and reject cross-origin (and a
 * request with neither Origin nor Referer). SameSite=Lax on the cookie is the first
 * line; this is the second.
 */
describe("BFF CSRF same-origin check", () => {
  it("accepts a same-origin POST (Origin host matches Host)", () => {
    expect(
      isSameOrigin({
        host: "patient.nelyo.test",
        origin: "https://patient.nelyo.test",
        referer: null
      })
    ).toBe(true);
  });

  it("accepts when Origin is absent but Referer is same-origin", () => {
    expect(
      isSameOrigin({
        host: "patient.nelyo.test",
        origin: null,
        referer: "https://patient.nelyo.test/dashboard"
      })
    ).toBe(true);
  });

  it("REJECTS a cross-origin POST (hostile page)", () => {
    expect(
      isSameOrigin({ host: "patient.nelyo.test", origin: "https://evil.example", referer: null })
    ).toBe(false);
  });

  it("REJECTS a request with neither Origin nor Referer (conservative)", () => {
    expect(isSameOrigin({ host: "patient.nelyo.test", origin: null, referer: null })).toBe(false);
  });

  it("REJECTS a malformed Origin", () => {
    expect(isSameOrigin({ host: "patient.nelyo.test", origin: "!!not-a-url", referer: null })).toBe(
      false
    );
  });
});
