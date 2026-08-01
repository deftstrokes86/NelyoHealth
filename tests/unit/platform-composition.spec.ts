import { describe, expect, it } from "vitest";
import type { PersistedRelationship } from "@nelyohealth/database";
import {
  composeRuntimeSurface,
  resolveCompositionTarget,
  resolveRuntimeToolContract,
  selectCompositionRole,
  type CompositionPorts
} from "../../apps/api/src/platform-composition.js";
import type { ActingContext } from "../../apps/api/src/acting-context-resolver.js";

/**
 * M8.3e runtime composition. The Context Engine resolves WHO is acting, in which
 * workspace, for WHICH SUBJECT; this service turns that into a composed experience by
 * registry lookup alone. These tests pin the four runtime switches the milestone
 * required — persona, subject, care circle, organization type — and the fail-closed
 * behaviour that replaced the old hardcoded assumptions.
 */
const ACTOR_PERSON = "person-actor";
const ACTOR_ACCOUNT = "account-actor";
const WARD_PERSON = "person-ward";

function actingContext(overrides: Partial<ActingContext> = {}): ActingContext {
  return {
    identity: { personId: ACTOR_PERSON, accountId: ACTOR_ACCOUNT },
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
  } as ActingContext;
}

function relationship(overrides: Partial<PersistedRelationship> = {}): PersistedRelationship {
  return {
    relationshipId: "rel-1",
    relationshipType: "guardian",
    status: "active",
    organizationRef: "org-1",
    effectiveDate: "2020-01-01T00:00:00.000Z",
    expiryDate: null,
    ...overrides
  } as PersistedRelationship;
}

const portsWith = (relationships: PersistedRelationship[]): CompositionPorts => ({
  listActiveRelationshipsForActorPatient: async () => relationships
});

const NO_RELATIONSHIPS = portsWith([]);

describe("runtime composition — persona switching (M8.3e)", () => {
  it("composes the patient persona for a personal context acting on itself", async () => {
    const { target, composed } = await composeRuntimeSurface(
      NO_RELATIONSHIPS,
      actingContext(),
      null
    );
    expect(target).toMatchObject({ workspaceId: "personal", personaId: "patient", reason: "self" });
    expect(composed.active).toBe(true);
    expect(composed.navigation.map((item) => item.id)).toContain("appointments");
  });

  it("composes an organization persona from the membership role code", async () => {
    const { target, composed } = await composeRuntimeSurface(
      NO_RELATIONSHIPS,
      actingContext({
        workspace: "organization",
        workspaceId: "hospital",
        activeTenantId: "org-1",
        persona: { kind: "organization", actorRole: "clinician", actorRoles: ["clinician"] }
      }),
      null
    );
    expect(target.personaId).toBe("clinician");
    expect(composed.landingDashboard?.id).toBe("clinician-home");
  });

  it("fails CLOSED for a membership with no registry persona", async () => {
    const { composed } = await composeRuntimeSurface(
      NO_RELATIONSHIPS,
      actingContext({
        workspace: "organization",
        workspaceId: "hospital",
        activeTenantId: "org-1",
        persona: { kind: "organization", actorRole: "member", actorRoles: [] }
      }),
      null
    );
    expect(composed.active).toBe(false);
    expect(composed.reasonCode).toBe("persona-unknown");
    expect(composed.navigation).toEqual([]);
  });
});

describe("runtime composition — subject switching (M8.3e)", () => {
  it("viewing a ward composes a different surface from viewing yourself", async () => {
    const self = await composeRuntimeSurface(NO_RELATIONSHIPS, actingContext(), null);
    const ward = await composeRuntimeSurface(
      portsWith([relationship({ relationshipType: "guardian" })]),
      actingContext(),
      WARD_PERSON
    );

    expect(self.target.personaId).toBe("patient");
    expect(ward.target.personaId).toBe("guardian");
    expect(ward.target.careCircleRoleId).toBe("guardian");
    expect(ward.composed.subjectIsSelf).toBe(false);

    // Acting for another NARROWS: a guardian composes strictly fewer capabilities than
    // the patient acting on their own record.
    const selfCaps = self.composed.capabilities.map((c) => c.id);
    const wardCaps = ward.composed.capabilities.map((c) => c.id);
    expect(wardCaps.length).toBeLessThan(selfCaps.length);
    expect(wardCaps.every((id) => selfCaps.includes(id))).toBe(true);
    // Something the patient can do for themselves but a guardian cannot compose.
    expect(selfCaps).toContain("document.read");
    expect(wardCaps).not.toContain("document.read");
  });

  it("a caregiver delegation composes the caregiver persona and its narrower surface", async () => {
    const { target, composed } = await composeRuntimeSurface(
      portsWith([relationship({ relationshipType: "caregiver-delegation" })]),
      actingContext(),
      WARD_PERSON
    );
    expect(target.personaId).toBe("caregiver");
    expect(composed.capabilities.map((c) => c.id).sort()).toEqual([
      "appointment.book",
      "care-circle.read",
      "message.send",
      "timeline.read"
    ]);
  });

  it("fails CLOSED for a subject the actor has no declared capacity toward", async () => {
    const { target, composed } = await composeRuntimeSurface(
      NO_RELATIONSHIPS,
      actingContext(),
      "person-stranger"
    );
    expect(target.reason).toBe("subject-no-capacity");
    expect(composed.active).toBe(false);
    expect(composed.navigation).toEqual([]);
    expect(composed.dashboards).toEqual([]);
    expect(composed.capabilities).toEqual([]);
  });

  it("picks capacity by registry declaration order, then most-recently-effective", async () => {
    const selected = selectCompositionRole(
      [
        relationship({ relationshipId: "rel-caregiver", relationshipType: "caregiver-delegation" }),
        relationship({ relationshipId: "rel-guardian", relationshipType: "guardian" })
      ],
      Date.now()
    );
    // Guardian is declared before caregiver-delegation in the registry, so it wins.
    expect(selected?.role.id).toBe("guardian");

    // A relationship type the registry declares but does not say how to compose is skipped.
    expect(
      selectCompositionRole([relationship({ relationshipType: "emergency-contact" })], Date.now())
    ).toBeNull();
    // An expired relationship confers no composition capacity.
    expect(
      selectCompositionRole(
        [relationship({ expiryDate: "2020-06-01T00:00:00.000Z" })],
        Date.parse("2026-01-01T00:00:00.000Z")
      )
    ).toBeNull();
  });
});

describe("runtime composition — Care Circle and Diaspora (M8.3e)", () => {
  it("a diaspora sponsor composes the sponsor workspace, persona, and surfaces", async () => {
    const { target, composed } = await composeRuntimeSurface(
      portsWith([relationship({ relationshipType: "sponsor" })]),
      actingContext(),
      WARD_PERSON
    );

    expect(target).toMatchObject({
      workspaceId: "diaspora-household",
      personaId: "diaspora-sponsor",
      careCircleRoleId: "diaspora-sponsor",
      reason: "delegated"
    });
    expect(composed.active).toBe(true);
    expect(composed.navigation.map((item) => item.id)).toEqual([
      "sponsor-home-nav",
      "sponsored-people",
      "sponsor-funding",
      "messages"
    ]);
    expect(composed.landingDashboard?.id).toBe("sponsor-home");
    expect(composed.experienceProfile?.id).toBe("diaspora-sponsor-profile");
    expect(composed.reports.map((r) => r.id)).toEqual(["sponsorship-statement"]);
  });

  it("keeps a sponsor NON-CLINICAL, matching the PDP's sponsor/clinical separation", async () => {
    const { composed } = await composeRuntimeSurface(
      portsWith([relationship({ relationshipType: "sponsor" })]),
      actingContext(),
      WARD_PERSON
    );
    const capabilities = composed.capabilities.map((c) => c.id);
    expect(capabilities).toContain("sponsorship.fund");
    // The PDP denies a sponsor clinical access (`sponsor-payment-no-clinical-access`);
    // composing a clinical surface for them would offer what would then be refused.
    for (const clinical of [
      "timeline.read",
      "clinical-record.read",
      "document.read",
      "prescription.read",
      "laboratory.read"
    ]) {
      expect(capabilities).not.toContain(clinical);
    }
  });
});

describe("runtime composition — organization type (M8.3e)", () => {
  const orgContext = (workspaceId: string | null, actorRole: string) =>
    actingContext({
      workspace: "organization",
      workspaceId,
      activeTenantId: "org-1",
      persona: { kind: "organization", actorRole, actorRoles: [actorRole] }
    });

  it("composes each organization type from its own registry data, with no code branch", async () => {
    const cases: [string, string, string][] = [
      ["hospital", "clinician", "clinician-home"],
      ["pharmacy", "pharmacist", "pharmacy-home"],
      ["laboratory", "lab-technician", "laboratory-home"],
      ["employer", "employer-admin", "programme-home"],
      ["insurer", "insurer-agent", "coverage-home"]
    ];
    for (const [workspaceId, persona, dashboard] of cases) {
      const { composed } = await composeRuntimeSurface(
        NO_RELATIONSHIPS,
        orgContext(workspaceId, persona),
        null
      );
      expect(composed.active, `${workspaceId} should compose`).toBe(true);
      expect(composed.landingDashboard?.id).toBe(dashboard);
    }
  });

  it("changing only the organization type changes navigation, tools, search and reports", async () => {
    const pharmacy = await composeRuntimeSurface(
      NO_RELATIONSHIPS,
      orgContext("pharmacy", "pharmacist"),
      null
    );
    const laboratory = await composeRuntimeSurface(
      NO_RELATIONSHIPS,
      orgContext("laboratory", "lab-technician"),
      null
    );
    expect(pharmacy.composed.navigation.map((i) => i.id)).toContain("pharmacy-dispensing");
    expect(laboratory.composed.navigation.map((i) => i.id)).toContain("lab-worklist");
    expect(pharmacy.composed.search.map((s) => s.id)).toContain("pharmacy-prescriptions");
    expect(laboratory.composed.search.map((s) => s.id)).toContain("lab-orders");
    expect(pharmacy.composed.reports.map((r) => r.id)).toEqual(["dispensing-activity"]);
    expect(laboratory.composed.reports.map((r) => r.id)).toEqual(["lab-turnaround"]);
  });

  it("fails CLOSED for an organization whose type could not be resolved", async () => {
    const { target, composed } = await composeRuntimeSurface(
      NO_RELATIONSHIPS,
      orgContext(null, "clinician"),
      null
    );
    // The old runtime defaulted an untyped organization to "hospital"; it now composes
    // nothing rather than showing a clinical surface to an unknown organization type.
    expect(target.reason).toBe("workspace-untyped");
    expect(composed.active).toBe(false);
    expect(composed.navigation).toEqual([]);
  });
});

describe("runtime tool contract (M8.3e)", () => {
  it("resolves the same target as the surface read, for the same subject", async () => {
    const ports = portsWith([relationship({ relationshipType: "guardian" })]);
    const surface = await composeRuntimeSurface(ports, actingContext(), WARD_PERSON);
    const tools = await resolveRuntimeToolContract(ports, actingContext(), "ui", WARD_PERSON);
    expect(tools.target).toEqual(surface.target);
  });

  it("narrows the AI contract to the subject's care-circle capacity", async () => {
    const ports = portsWith([relationship({ relationshipType: "guardian" })]);
    const self = await resolveRuntimeToolContract(NO_RELATIONSHIPS, actingContext(), "ai", null);
    const ward = await resolveRuntimeToolContract(ports, actingContext(), "ai", WARD_PERSON);

    expect(self.composed.tools.map((t) => t.tool.id)).toContain("book-appointment");
    expect(ward.composed.tools.map((t) => t.tool.id)).toContain("book-appointment");
    // Every AI-offered write still requires human approval.
    for (const offered of ward.composed.tools) {
      if (offered.effect === "write") expect(offered.requiresApproval).toBe(true);
    }
  });

  it("reports withheld tools with a reason when composition is inactive", async () => {
    const contract = await resolveRuntimeToolContract(
      NO_RELATIONSHIPS,
      actingContext(),
      "ai",
      "person-stranger"
    );
    expect(contract.composed.active).toBe(false);
    expect(contract.composed.tools).toEqual([]);
    expect(contract.composed.withheld.every((w) => w.reason === "composition-inactive")).toBe(true);
  });
});

describe("registry-data-only behaviour change (M8.3e)", () => {
  it("resolves the composition target purely from acting context + registry lookup", async () => {
    // Same actor, same session — only the SUBJECT changes, and workspace, persona,
    // care-circle role, and reason all change with it. No code path is selected by type.
    const ports = portsWith([relationship({ relationshipType: "sponsor" })]);
    const self = await resolveCompositionTarget(ports, actingContext(), null);
    const sponsored = await resolveCompositionTarget(ports, actingContext(), WARD_PERSON);

    expect(self).toMatchObject({ workspaceId: "personal", personaId: "patient", reason: "self" });
    expect(sponsored).toMatchObject({
      workspaceId: "diaspora-household",
      personaId: "diaspora-sponsor",
      careCircleRoleId: "diaspora-sponsor"
    });
  });
});
