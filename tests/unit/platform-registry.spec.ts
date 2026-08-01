import { describe, expect, it } from "vitest";
import {
  CAPABILITIES,
  EVENTS,
  FEATURES,
  NOTIFICATION_ROUTES,
  PERSONAS,
  TOOLS,
  WORKFLOWS,
  compositionHasCapability,
  findCareCircleRole,
  findWorkspace,
  isKnownCapability,
  isKnownEvent,
  isWorkspaceComposable,
  resolveComposition,
  validatePlatformRegistry,
  workflowSchema
} from "../../packages/platform-registry/src/index.js";

/**
 * M8.3a Platform Registry Layer foundation: the registries are coherent, tools expose
 * real capabilities, org types are declared data (not code branches), and the Context
 * Engine composition resolver is fail-closed and composition-only (never authorization).
 */
describe("platform registry (M8.3a)", () => {
  it("is internally coherent (schemas + cross-references)", () => {
    expect(validatePlatformRegistry()).toEqual([]);
  });

  it("has a structured capability vocabulary (resource.action + domain + category + scope + tags)", () => {
    const timeline = CAPABILITIES.find((c) => c.id === "timeline.read");
    expect(timeline).toMatchObject({
      resource: "timeline",
      action: "read",
      domain: "care-coordination",
      scope: "care-circle"
    });
    expect(Array.isArray(timeline?.tags)).toBe(true);
    for (const tool of TOOLS) expect(isKnownCapability(tool.capability)).toBe(true);
  });

  it("tools declare compatibility/execution characteristics (AI is a consumer)", () => {
    const book = TOOLS.find((t) => t.id === "book-appointment");
    expect(book?.compatibility.supportsAI).toBe(true);
    expect(book?.compatibility.requiresApproval).toBe(true); // AI-initiated write needs approval
    // Every event a tool references is a real Event Registry entry.
    for (const tool of TOOLS) {
      for (const id of [...tool.events.produces, ...tool.events.consumes]) {
        expect(isKnownEvent(id)).toBe(true);
      }
    }
  });

  it("Event Registry formalizes the M6 contract (publishers, classification, DLQ)", () => {
    const booked = EVENTS.find((e) => e.id === "AppointmentBooked");
    expect(booked?.publishers).toContain("appointment");
    expect(booked?.deadLetter.enabled).toBe(true);
    const consent = EVENTS.find((e) => e.id === "ConsentGranted");
    expect(consent?.classification).toBe("REGULATORY-EVIDENCE");
    expect(consent?.retention).toBe("regulatory");
  });

  it("Feature Registry bundles capabilities/events and is distinct from feature flags", () => {
    const appointments = FEATURES.find((f) => f.id === "appointments");
    expect(appointments?.capabilities).toContain("appointment.book");
    expect(appointments?.events.produces).toContain("AppointmentBooked");
    // Planned features are declared data, not code branches.
    expect(FEATURES.find((f) => f.id === "pharmacy")?.status).toBe("planned");
  });

  it("Care Circle Registry models collaboration; capacity is a declaration, not authz", () => {
    const guardian = findCareCircleRole("guardian");
    // Mirrors the PDP capacity map (declaration only).
    expect(guardian?.capacity).toEqual({
      actorRole: "guardian",
      actorType: "guardian",
      priority: 0
    });
    expect(guardian?.collaboration.emergencyEscalation).toBe(true);
    // family-member is declared but NOT authz-mapped -> capacity null (PDP default-denies).
    expect(findCareCircleRole("family-member")?.capacity).toBeNull();
    // diaspora care is data: financial sponsorship modeled.
    expect(findCareCircleRole("diaspora-sponsor")?.collaboration.financialSponsorship).toBe(true);
  });

  it("Notification Registry routes are triggered by real events with a defined audience", () => {
    for (const route of NOTIFICATION_ROUTES) {
      expect(isKnownEvent(route.trigger)).toBe(true);
      expect(route.channels.length).toBeGreaterThan(0);
    }
  });

  it("Workflow Registry is a generic engine; transitions bind capabilities/events/hooks", () => {
    const booking = WORKFLOWS.find((w) => w.id === "appointment-booking");
    const book = booking?.transitions.find((t) => t.id === "book");
    expect(book?.requiresCapability).toBe("appointment.book");
    expect(book?.emitsEvents).toContain("AppointmentBooked");
    expect(book?.notificationHooks).toContain("appointment-confirmed");
    // The engine rejects a transition to an undeclared state.
    expect(() =>
      workflowSchema.parse({
        id: "bad",
        name: "Bad",
        domain: "clinical",
        states: ["a", "b"],
        initialState: "a",
        transitions: [{ id: "x", from: "a", to: "zzz", trigger: "go" }]
      })
    ).toThrow();
  });

  it("carries workspace lifecycle so org types are data, not code branches", () => {
    expect(findWorkspace("personal")?.lifecycle.status).toBe("active");
    expect(findWorkspace("hospital")?.lifecycle.status).toBe("active");
    // M8.3e: every organization type is supported and composable; enablement is the
    // rollout control, and `invite-only` still composes for those who hold one.
    expect(findWorkspace("pharmacy")?.lifecycle.enablementState).toBe("enabled");
    expect(findWorkspace("government")?.lifecycle.enablementState).toBe("invite-only");
    for (const id of ["employer", "insurer", "government", "ngo", "laboratory"]) {
      expect(findWorkspace(id)?.kind).toBe("organization");
    }
    // The disabled rule itself is still enforced, independently of today's catalog.
    expect(isWorkspaceComposable({ lifecycle: { ...findWorkspace("pharmacy")!.lifecycle } })).toBe(
      true
    );
    expect(
      isWorkspaceComposable({
        lifecycle: { ...findWorkspace("pharmacy")!.lifecycle, enablementState: "disabled" }
      })
    ).toBe(false);
  });

  it("resolves the patient composition set for the personal workspace", () => {
    const resolved = resolveComposition("personal", "patient");
    expect(resolved.active).toBe(true);
    expect(resolved.reasonCode).toBe("resolved");
    expect(compositionHasCapability(resolved, "appointment.book")).toBe(true);
    expect(compositionHasCapability(resolved, "timeline.read")).toBe(true);
    // A clinician-only capability is NOT composed for a patient.
    expect(compositionHasCapability(resolved, "clinical-record.amend")).toBe(false);
  });

  it("fails CLOSED: unknown workspace / persona or non-applicable persona composes nothing", () => {
    expect(resolveComposition("nope", "patient").reasonCode).toBe("workspace-unknown");
    expect(resolveComposition("personal", "nope").reasonCode).toBe("persona-unknown");
    expect(resolveComposition("hospital", "patient").reasonCode).toBe("persona-not-applicable");
    const unknown = resolveComposition("nope", "patient");
    expect(unknown.active).toBe(false);
    expect(unknown.capabilities).toEqual([]);
    // M8.3e: acting for a subject with no declared capacity composes nothing either.
    const stranger = resolveComposition("personal", "patient", { isSelf: false });
    expect(stranger.reasonCode).toBe("subject-no-capacity");
    expect(stranger.capabilities).toEqual([]);
  });

  it("resolves every composition reference on a live persona (no forward refs left)", () => {
    // M8.3c closed dashboards/navigation/onboarding/homepage; M8.3d closed search/reports.
    const patient = PERSONAS.find((p) => p.id === "patient");
    expect(patient?.defaultDashboards).toContain("patient-home");
    expect(patient?.navigation).toContain("appointments");
    expect(patient?.searchScopes).toContain("my-appointments");
    expect(patient?.reports).toContain("my-care-summary");
    // M8.3e: every persona in the catalog now carries a real composition — an org type
    // differs from another only in the registry data its persona points at.
    for (const persona of PERSONAS) {
      expect(persona.defaultDashboards.length, `${persona.id} dashboards`).toBeGreaterThan(0);
      expect(persona.navigation.length, `${persona.id} navigation`).toBeGreaterThan(0);
    }
  });
});
