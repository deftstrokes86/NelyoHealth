import { describe, expect, it } from "vitest";
import {
  DASHBOARDS,
  EXPERIENCES,
  NAVIGATION_ITEMS,
  composeSurface,
  experienceSchema,
  findNavigationItem,
  isKnownTool,
  navigationItemSchema,
  resolveComposition,
  surfaceRoutes,
  validatePlatformRegistry,
  type ComposedNavigationItem
} from "../../packages/platform-registry/src/index.js";

/**
 * M8.3c Navigation / Dashboard / Experience registries + `composeSurface`.
 *
 * The surface is DECLARED and then filtered by the composition capability set the
 * Context Engine resolves — never assembled by per-persona rendering code. These tests
 * pin the filtering rules (capability, feature, workspace kind), the group-drop rule,
 * the fail-closed posture, and the composition-only invariant.
 */
const child = (items: ComposedNavigationItem[], id: string) => items.find((i) => i.id === id);
const ids = (items: { id: string }[]) => items.map((i) => i.id);

describe("platform surface registries (M8.3c)", () => {
  it("keeps the whole registry layer coherent with the new registries wired in", () => {
    expect(validatePlatformRegistry()).toEqual([]);
  });

  it("declares navigation as data: routes, hierarchy, and one level of nesting", () => {
    for (const item of NAVIGATION_ITEMS) {
      if (item.parentId === null) continue;
      expect(findNavigationItem(item.parentId)?.parentId).toBeNull();
    }
    // Every dashboard widget that reads data names a real tool.
    for (const dashboard of DASHBOARDS) {
      for (const widget of dashboard.widgets) {
        if (widget.tool) expect(isKnownTool(widget.tool)).toBe(true);
      }
    }
  });

  it("keeps experience kinds strict: steps belong to onboarding alone", () => {
    expect(
      EXPERIENCES.filter((e) => e.kind === "onboarding").every((e) => e.steps.length > 0)
    ).toBe(true);
    expect(() =>
      experienceSchema.parse({
        id: "bad-profile",
        kind: "profile",
        label: "Bad",
        description: "A profile may not carry steps.",
        appliesToWorkspaceKinds: ["personal"],
        steps: [{ id: "step", label: "Step", description: "…" }]
      })
    ).toThrow();
    expect(() =>
      experienceSchema.parse({
        id: "bad-onboarding",
        kind: "onboarding",
        label: "Bad",
        description: "An onboarding flow must declare steps.",
        appliesToWorkspaceKinds: ["personal"]
      })
    ).toThrow();
    // A navigation item must declare at least one workspace kind.
    expect(() =>
      navigationItemSchema.parse({ id: "x", label: "X", description: "…", workspaceKinds: [] })
    ).toThrow();
  });
});

describe("composeSurface — navigation (M8.3c)", () => {
  it("composes the patient's declared navigation, filtered by capability and feature", () => {
    const surface = composeSurface("personal", "patient");
    expect(surface.active).toBe(true);
    expect(ids(surface.navigation)).toEqual([
      "home",
      "appointments",
      "care-circle",
      "messages",
      "personal-health",
      "settings"
    ]);
    // The health-record group keeps what the patient can compose and drops the rest:
    // `prescriptions` needs prescription.read AND the pharmacy feature — neither applies.
    const health = child(surface.navigation, "personal-health");
    expect(ids(health!.children)).toEqual(["timeline", "documents"]);
    expect(ids(child(surface.navigation, "settings")!.children)).toEqual([
      "settings-profile",
      "settings-consent",
      "settings-notifications"
    ]);
  });

  it("filters the same declarations down for a caregiver's narrower capability set", () => {
    const surface = composeSurface("personal", "caregiver");
    expect(ids(surface.navigation)).toEqual([
      "home",
      "appointments",
      "care-circle",
      "messages",
      "personal-health"
    ]);
    // No document.read -> the group survives on `timeline` alone.
    expect(ids(child(surface.navigation, "personal-health")!.children)).toEqual(["timeline"]);
  });

  it("drops a group whose children all filter out (a group that opens nothing)", () => {
    const admin = composeSurface("hospital", "organization-admin");
    // `org-clinical` is declared for the persona but needs clinical-record.read /
    // consultation.conduct, which an administrator does not compose.
    expect(ids(admin.navigation)).toEqual(["org-home", "org-schedule", "org-admin"]);
    expect(ids(child(admin.navigation, "org-admin")!.children)).toEqual([
      "org-admin-members",
      "org-admin-settings"
    ]);

    const clinician = composeSurface("hospital", "clinician");
    expect(ids(clinician.navigation)).toEqual([
      "org-home",
      "org-schedule",
      "org-clinical",
      "org-messages"
    ]);
    expect(ids(child(clinician.navigation, "org-clinical")!.children)).toEqual([
      "org-patients",
      "org-consultations"
    ]);
  });

  it("flattens to routable paths, skipping group items", () => {
    const routes = surfaceRoutes(composeSurface("hospital", "clinician"));
    expect(routes).toContain("/schedule");
    expect(routes).toContain("/consultations");
    // `org-clinical` is a group: it contributes children, not a route of its own.
    expect(routes.filter((route) => route === "")).toEqual([]);
  });
});

describe("composeSurface — dashboards and experiences (M8.3c)", () => {
  it("filters widgets individually so one dashboard serves several personas", () => {
    const patient = composeSurface("personal", "patient");
    const dashboard = patient.dashboards.find((d) => d.id === "patient-home");
    expect(ids(dashboard!.widgets)).toEqual([
      "upcoming-appointments",
      "quick-book",
      "care-circle-summary",
      "health-timeline",
      "unread-messages"
    ]);
    expect(patient.landingDashboard?.id).toBe("patient-home");
  });

  it("falls back to the first composed dashboard when the workspace's landing one is not the persona's", () => {
    const admin = composeSurface("hospital", "organization-admin");
    // The hospital workspace lands on `clinician-home`, which an admin does not compose.
    expect(ids(admin.dashboards)).toEqual(["organization-admin-home"]);
    expect(admin.landingDashboard?.id).toBe("organization-admin-home");
    expect(composeSurface("hospital", "clinician").landingDashboard?.id).toBe("clinician-home");
  });

  it("filters onboarding steps by capability", () => {
    const patient = composeSurface("personal", "patient");
    expect(ids(patient.onboarding)).toEqual(["patient-onboarding"]);
    expect(ids(patient.onboarding[0].steps)).toEqual([
      "verify-identity",
      "complete-profile",
      "set-consents",
      "add-care-circle"
    ]);
    // A guardian runs the same flow without `complete-profile` (no patient-profile.update).
    const guardian = composeSurface("personal", "guardian");
    expect(ids(guardian.onboarding[0].steps)).toEqual([
      "verify-identity",
      "set-consents",
      "add-care-circle"
    ]);
  });

  it("resolves the experience profile: persona preference overrides the workspace default", () => {
    expect(composeSurface("personal", "patient").experienceProfile?.id).toBe("warm-care-personal");
    // The caregiver prefers the compact profile over the workspace's warm default.
    expect(composeSurface("personal", "caregiver").experienceProfile?.id).toBe("focused-personal");
    expect(composeSurface("hospital", "clinician").experienceProfile?.id).toBe("clinical-focus");
  });

  it("composes homepage sections in declared order", () => {
    expect(ids(composeSurface("personal", "patient").homepage)).toEqual([
      "next-appointment-card",
      "care-circle-highlights",
      "health-tips"
    ]);
    expect(ids(composeSurface("hospital", "clinician").homepage)).toEqual([
      "clinic-day-summary",
      "pending-consultations"
    ]);
  });
});

describe("composeSurface — invariants (M8.3c)", () => {
  it("fails CLOSED: a disabled workspace or non-applicable persona composes nothing", () => {
    const disabled = composeSurface("pharmacy", "pharmacist");
    expect(disabled.active).toBe(false);
    expect(disabled.reasonCode).toBe("workspace-disabled");
    expect(disabled.navigation).toEqual([]);
    expect(disabled.dashboards).toEqual([]);
    expect(disabled.onboarding).toEqual([]);
    expect(disabled.homepage).toEqual([]);
    expect(disabled.landingDashboard).toBeNull();
    expect(disabled.experienceProfile).toBeNull();
    expect(disabled.capabilities).toEqual([]);

    expect(composeSurface("nope", "patient").reasonCode).toBe("workspace-unknown");
    expect(composeSurface("hospital", "patient").reasonCode).toBe("persona-not-applicable");
  });

  it("is composition-only: the surface is filtered BY the capability set, never adding to it", () => {
    const surface = composeSurface("personal", "patient");
    const composition = resolveComposition("personal", "patient");
    expect(ids(surface.capabilities)).toEqual(ids(composition.capabilities));

    // Every capability any composed item requires is one the actor already composes —
    // a surface never introduces a capability, and never decides authorization.
    const composed = new Set(ids(surface.capabilities));
    const walk = (items: ComposedNavigationItem[]) => {
      for (const item of items) {
        if (item.requiresCapability) expect(composed.has(item.requiresCapability)).toBe(true);
        walk(item.children);
      }
    };
    walk(surface.navigation);
    for (const dashboard of surface.dashboards) {
      for (const widget of dashboard.widgets) {
        if (widget.requiresCapability) expect(composed.has(widget.requiresCapability)).toBe(true);
      }
    }
  });
});
