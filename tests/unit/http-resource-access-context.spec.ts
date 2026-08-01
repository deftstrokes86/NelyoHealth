import { describe, expect, it } from "vitest";
import type { ActingContext } from "../../apps/api/src/acting-context-resolver.js";
import { buildResourceAccessContext } from "../../apps/api/src/nest/resource/resource-access-context.js";

/**
 * The trust seam (M7, ADR-0014). Identity / persona / workspace / session are
 * SERVER-DERIVED from the ActingContext; only the subject-patient intent comes from
 * the request. "self" is computed from the server-resolved identity link, never a
 * client claim.
 */
function actingContext(overrides: Partial<ActingContext> = {}): ActingContext {
  return {
    identity: { accountId: "account-1", personId: "person-1" },
    sessionId: "session-1",
    sessionStatus: "active",
    authLevel: "primary",
    activeTenantId: null,
    activeTenantValid: false,
    activeTenantReasonCode: "personal-context",
    workspace: "personal",
    workspaceId: "personal",
    persona: { kind: "personal", actorRole: "patient", actorRoles: ["patient"] },
    memberships: [],
    resolvedAt: new Date().toISOString(),
    ...overrides
  };
}

describe("buildResourceAccessContext (trust seam)", () => {
  it("derives actor identity/role from the context, not the request", () => {
    const { access } = buildResourceAccessContext(actingContext(), {
      subjectPatientRef: "person-1",
      purpose: "care-coordination"
    });
    expect(access.actorId).toBe("account-1");
    expect(access.actorRole).toBe("patient");
    expect(access.actorType).toBe("patient");
    expect(access.sessionStatus).toBe("active");
    expect(access.emergencyStatus).toBe("none"); // break-glass is never a header
  });

  it("marks self ONLY when the subject equals the server-resolved person link", () => {
    const self = buildResourceAccessContext(actingContext(), {
      subjectPatientRef: "person-1",
      purpose: "care-coordination"
    });
    expect(self.subjectIsSelf).toBe(true);
    expect(self.subjectPersonRef).toBe("person-1");

    const other = buildResourceAccessContext(actingContext(), {
      subjectPatientRef: "person-2",
      purpose: "care-coordination"
    });
    expect(other.subjectIsSelf).toBe(false);
    expect(other.access.patientId).toBe("person-2");
  });

  it("a client cannot forge self by claiming a patientRef — the link is server-side", () => {
    const resolution = buildResourceAccessContext(
      actingContext({ identity: { accountId: "account-1", personId: "person-1" } }),
      { subjectPatientRef: "person-9", purpose: "care-coordination" }
    );
    expect(resolution.subjectIsSelf).toBe(false);
  });

  it("maps an org-workspace clinician persona to a clinician actor", () => {
    const { access, subjectIsSelf } = buildResourceAccessContext(
      actingContext({
        activeTenantId: "org-1",
        activeTenantValid: true,
        workspace: "organization",
        persona: { kind: "organization", actorRole: "clinician", actorRoles: ["clinician"] }
      }),
      { subjectPatientRef: "person-2", purpose: "care-coordination" }
    );
    expect(access.actorRole).toBe("clinician");
    expect(access.actorType).toBe("clinician");
    expect(access.organizationId).toBe("org-1");
    expect(subjectIsSelf).toBe(false);
  });
});
