import { describe, expect, it } from "vitest";
import {
  ScopeIntegrityError,
  assertScopedMutation,
  requireOrganizationScope,
  requireScopeRef
} from "../../packages/database/src/scope-guard.js";

/**
 * M8.2 runtime tenant-scope guard (AM-7). The fail-closed primitives that give the
 * repository its INDEPENDENT scope proof: a scope-owned query never runs without a
 * concrete scope, and a scoped mutation that matched no row is an integrity violation.
 */
describe("scope guard (M8.2)", () => {
  it("requireScopeRef returns a concrete ref and fails closed on null/blank", () => {
    expect(requireScopeRef("organization", "org-1", "ctx")).toBe("org-1");
    for (const bad of [null, undefined, "", "   "]) {
      expect(() => requireScopeRef("organization", bad, "ctx")).toThrow(ScopeIntegrityError);
    }
  });

  it("requireOrganizationScope is the organization convenience over requireScopeRef", () => {
    expect(requireOrganizationScope("org-9", "loadX")).toBe("org-9");
    expect(() => requireOrganizationScope(null, "loadX")).toThrow(/organization scope/);
  });

  it("assertScopedMutation throws when a scoped write matched no row (mismatched scope)", () => {
    for (const zero of [0, null, undefined]) {
      expect(() => assertScopedMutation(zero, "setX")).toThrow(ScopeIntegrityError);
    }
    expect(() => assertScopedMutation(1, "setX")).not.toThrow();
    expect(() => assertScopedMutation(3, "setX")).not.toThrow();
  });

  it("the error names the operation for auditability", () => {
    expect(() => assertScopedMutation(0, "markRelationshipRevoked")).toThrow(
      /markRelationshipRevoked/
    );
  });
});
