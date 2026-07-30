import { describe, expect, it } from "vitest";
import { strictestClassification } from "../../packages/domain/src/index.js";
import {
  isFieldPermitted,
  project,
  projectExact,
  type ProjectionContext
} from "../../apps/api/src/projection.js";

/**
 * M8.1 central projection/redaction engine (AM-8). Proves the classification-driven
 * gate: per-classification permit by reader obligations, the provider pre/post-payment
 * field-level allowance, strictest-wins for multi-tag fields, allowlist (undeclared
 * fields never emitted), and fail-closed exact projection.
 */
function ctx(overrides: Partial<ProjectionContext> = {}): ProjectionContext {
  return {
    purpose: "care-coordination",
    identityAuthorized: false,
    clinicalAuthorized: false,
    providerDisclosureAuthorized: false,
    financeAuthorized: false,
    ...overrides
  };
}

describe("projection engine (M8.1)", () => {
  it("permits references/labels always; gates sensitive classes by the reader's obligations", () => {
    const bare = ctx();
    expect(isFieldPermitted("INTERNAL", bare)).toBe(true);
    expect(isFieldPermitted("PUBLIC", bare)).toBe(true);
    expect(isFieldPermitted("SENSITIVE-PERSONAL-DATA", bare)).toBe(false);
    expect(isFieldPermitted("SENSITIVE-PERSONAL-DATA", ctx({ identityAuthorized: true }))).toBe(
      true
    );
    expect(isFieldPermitted("PROTECTED-CLINICAL-DATA", ctx({ clinicalAuthorized: true }))).toBe(
      true
    );
    expect(isFieldPermitted("PROTECTED-CLINICAL-DATA", bare)).toBe(false);
    expect(isFieldPermitted("PAYMENT-DATA", ctx({ financeAuthorized: true }))).toBe(true);
  });

  it("NEVER discloses secrets/credentials/regulatory/security on these read surfaces", () => {
    const anything = ctx({
      identityAuthorized: true,
      clinicalAuthorized: true,
      providerDisclosureAuthorized: true,
      financeAuthorized: true
    });
    for (const tag of [
      "AUTHENTICATION-SECRET",
      "PROVIDER-CREDENTIAL-DATA",
      "REGULATORY-EVIDENCE",
      "CONFIDENTIAL",
      "SECURITY-OPERATIONAL-DATA"
    ] as const) {
      expect(isFieldPermitted(tag, anything)).toBe(false);
    }
  });

  it("PROVIDER pre/post-payment: displayName always shown; location only post-payment (flagship rule)", () => {
    const map = {
      orderId: "INTERNAL",
      providerDisplayName: {
        classification: "PROVIDER-IDENTITY-LOCATION-DATA",
        allowance: "provider-display-name-pre-payment"
      },
      providerLocation: "PROVIDER-IDENTITY-LOCATION-DATA"
    } as const;
    const value = {
      orderId: "o1",
      providerDisplayName: "Nelyo Clinic",
      providerLocation: "12 Marina St"
    };

    const prePayment = project(value, map, ctx());
    expect(prePayment).toEqual({ orderId: "o1", providerDisplayName: "Nelyo Clinic" }); // location dropped

    const postPayment = project(value, map, ctx({ providerDisclosureAuthorized: true }));
    expect(postPayment.providerLocation).toBe("12 Marina St"); // location now disclosed
  });

  it("strictest-wins for a multi-tag field", () => {
    expect(strictestClassification(["INTERNAL", "PROTECTED-CLINICAL-DATA"])).toBe(
      "PROTECTED-CLINICAL-DATA"
    );
    const map = { note: ["INTERNAL", "PROTECTED-CLINICAL-DATA"] } as const;
    // Treated as clinical: dropped for a non-clinical reader even though also INTERNAL.
    expect(project({ note: "x" }, map, ctx())).toEqual({});
    expect(project({ note: "x" }, map, ctx({ clinicalAuthorized: true }))).toEqual({ note: "x" });
  });

  it("is an allowlist: an undeclared field is never emitted", () => {
    const map = { entryId: "INTERNAL" } as const;
    const projected = project(
      { entryId: "e1", secretSmuggled: "leak" } as Record<string, unknown>,
      map,
      ctx()
    );
    expect(projected).toEqual({ entryId: "e1" });
  });

  it("projectExact fails closed if a declared field is not permitted for the reader", () => {
    const map = { entryId: "INTERNAL", body: "PROTECTED-CLINICAL-DATA" } as const;
    // Reader lacks clinical authorization -> the clinical field can't be fully disclosed.
    expect(() => projectExact({ entryId: "e1", body: "diagnosis" }, map, ctx())).toThrow(
      /not permitted/
    );
    // With clinical authorization it returns the value unchanged.
    expect(
      projectExact({ entryId: "e1", body: "diagnosis" }, map, ctx({ clinicalAuthorized: true }))
    ).toEqual({
      entryId: "e1",
      body: "diagnosis"
    });
  });
});
