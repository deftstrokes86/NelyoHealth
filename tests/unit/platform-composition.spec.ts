import { describe, expect, it } from "vitest";
import { resolveCompositionForActingContext } from "../../apps/api/src/platform-composition.js";
import type { ActingContext } from "../../apps/api/src/acting-context-resolver.js";

/**
 * M8.3a Context Engine → Platform Registry integration. The adapter maps the resolved
 * ActingContext (workspace + persona) to the composition capability set — formalizing,
 * not duplicating, the Context Engine — and stays fail-closed and composition-only.
 */
function actingContext(overrides: Partial<ActingContext> = {}): ActingContext {
  return {
    identity: { personId: "p-1", accountId: "a-1" },
    sessionStatus: "active",
    activeTenantId: null,
    activeTenantReasonCode: "personal-context",
    memberships: [],
    workspace: "personal",
    persona: { kind: "personal", actorRole: "patient", actorRoles: ["patient"] },
    ...overrides
  } as ActingContext;
}

describe("platform composition adapter (M8.3a)", () => {
  it("resolves the patient composition in the personal workspace", () => {
    const resolved = resolveCompositionForActingContext(actingContext());
    expect(resolved.active).toBe(true);
    expect(resolved.workspaceId).toBe("personal");
    expect(resolved.capabilities.some((c) => c.id === "appointment.book")).toBe(true);
  });

  it("maps an organization workspace + clinician persona to the hospital composition", () => {
    const resolved = resolveCompositionForActingContext(
      actingContext({
        workspace: "organization",
        activeTenantId: "org-1",
        persona: { kind: "organization", actorRole: "clinician", actorRoles: ["clinician"] }
      })
    );
    expect(resolved.workspaceId).toBe("hospital");
    expect(resolved.active).toBe(true);
    expect(resolved.capabilities.some((c) => c.id === "consultation.conduct")).toBe(true);
  });

  it("fails closed for an unmapped persona role (composes nothing)", () => {
    const resolved = resolveCompositionForActingContext(
      actingContext({
        workspace: "organization",
        persona: { kind: "organization", actorRole: "member", actorRoles: ["member"] }
      })
    );
    expect(resolved.active).toBe(false);
    expect(resolved.capabilities).toEqual([]);
  });
});
