import { z } from "zod";

/**
 * Workspace Registry (roadmap M8.3a, refinement 3).
 *
 * A workspace is a context an actor operates within. It FORMALIZES what the Context
 * Engine already resolves imperatively (`WorkspaceKind` = personal | organization) and
 * makes the organization sub-types (hospital, pharmacy, laboratory, employer, insurer,
 * NGO, government, diaspora household) DATA rather than code branches. `scopeType`
 * aligns with the M8.2 Scope Registry so persistence tenancy and platform composition
 * share one scope vocabulary.
 *
 * Lifecycle metadata (status, enablement, feature flags, verification/subscription
 * requirements) lets a workspace type be introduced, gated, and rolled out without a
 * code change — and lets a future platform builder enable/configure workspaces as data.
 */

export const workspaceKindSchema = z.enum(["personal", "organization"]);
export type WorkspaceKind = z.infer<typeof workspaceKindSchema>;

export const lifecycleStatusSchema = z.enum(["active", "beta", "planned", "deprecated"]);
export const enablementStateSchema = z.enum(["enabled", "invite-only", "disabled"]);

export const workspaceLifecycleSchema = z.object({
  status: lifecycleStatusSchema,
  enablementState: enablementStateSchema,
  featureFlags: z.array(z.string()).default([]),
  /** Verifications the workspace must satisfy before it is usable (e.g. license). */
  verificationRequirements: z.array(z.string()).default([]),
  /** Subscription/plan requirements before enablement. */
  subscriptionRequirements: z.array(z.string()).default([])
});
export type WorkspaceLifecycle = z.infer<typeof workspaceLifecycleSchema>;

/**
 * Presentation metadata (refinement 3): a workspace is a complete EXPERIENCE
 * definition, not just a permission container. `landingDashboard` (Dashboard Registry)
 * and `experienceProfile` (Experience Registry, kind `profile`) resolved in M8.3c and
 * are enforced by the validation gate; empty means "none declared".
 */
export const workspacePresentationSchema = z.object({
  branding: z.string().default("nelyo"),
  theme: z.string().default("warm-care"),
  navigationStyle: z.enum(["sidebar", "topbar", "tabbed"]).default("sidebar"),
  landingDashboard: z.string().default(""),
  experienceProfile: z.string().default("")
});
export type WorkspacePresentation = z.infer<typeof workspacePresentationSchema>;

export const workspaceSchema = z.object({
  id: z.string().regex(/^[a-z][a-z0-9-]*$/),
  kind: workspaceKindSchema,
  /** Scope Registry scope type that owns this workspace's data (`none` for personal). */
  scopeType: z.string().regex(/^[a-z][a-z-]*$/),
  label: z.string().min(1),
  description: z.string().min(1),
  /** Persona ids that may act within this workspace (Persona Registry refs). */
  personas: z.array(z.string()).default([]),
  /** Baseline capabilities the workspace confers (Capability catalog refs). */
  capabilities: z.array(z.string()).default([]),
  /** Feature ids available to this workspace (Feature Registry refs, M8.3b). */
  features: z.array(z.string()).default([]),
  lifecycle: workspaceLifecycleSchema,
  presentation: workspacePresentationSchema.default({
    branding: "nelyo",
    theme: "warm-care",
    navigationStyle: "sidebar",
    landingDashboard: "",
    experienceProfile: ""
  }),
  metadata: z.record(z.string(), z.unknown()).default({})
});
export type Workspace = z.infer<typeof workspaceSchema>;

/**
 * The workspace catalog. `personal` and the generic `organization` (clinic/hospital)
 * are ACTIVE — they are what the Context Engine resolves today. The remaining
 * organization sub-types are declared as PLANNED so the composition layer is
 * extensible from the outset without code branching; enablement flips in data.
 */
export const WORKSPACES: readonly Workspace[] = [
  workspaceSchema.parse({
    id: "personal",
    kind: "personal",
    scopeType: "none",
    label: "Personal",
    description: "A person's own health workspace — self and care-circle scope.",
    personas: ["patient", "caregiver", "guardian"],
    capabilities: ["timeline.read", "care-circle.read", "appointment.read", "notification.read"],
    features: ["appointments", "messaging", "care-circle", "clinical-records"],
    lifecycle: { status: "active", enablementState: "enabled" },
    presentation: {
      navigationStyle: "tabbed",
      landingDashboard: "patient-home",
      experienceProfile: "warm-care-personal"
    }
  }),
  workspaceSchema.parse({
    id: "diaspora-household",
    kind: "personal",
    scopeType: "none",
    label: "Diaspora household",
    description:
      "A relative abroad funding and coordinating care for family at home. Non-clinical by design — the PDP separates sponsorship from clinical access.",
    personas: ["diaspora-sponsor"],
    capabilities: ["care-circle.read", "notification.read"],
    features: ["diaspora-sponsorship", "care-circle", "messaging", "appointments"],
    lifecycle: { status: "active", enablementState: "enabled" },
    presentation: {
      navigationStyle: "tabbed",
      theme: "warm-care",
      landingDashboard: "sponsor-home",
      experienceProfile: "diaspora-sponsor-profile"
    }
  }),
  workspaceSchema.parse({
    id: "hospital",
    kind: "organization",
    scopeType: "organization",
    label: "Hospital / Clinic",
    description: "A care-delivery organization workspace.",
    personas: ["clinician", "organization-admin"],
    // Baseline = what EVERY persona in the workspace composes. Clinical actions belong to
    // the clinician persona (which declares them), not to the workspace floor.
    capabilities: ["timeline.read"],
    features: ["appointments", "consultations", "clinical-records", "messaging"],
    lifecycle: {
      status: "active",
      enablementState: "enabled",
      verificationRequirements: ["organization-verified"]
    },
    presentation: {
      navigationStyle: "sidebar",
      theme: "clinical",
      landingDashboard: "clinician-home",
      experienceProfile: "clinical-focus"
    }
  }),
  workspaceSchema.parse({
    id: "pharmacy",
    kind: "organization",
    scopeType: "organization",
    label: "Pharmacy",
    description: "A dispensing organization workspace.",
    personas: ["pharmacist", "organization-admin"],
    capabilities: [],
    features: ["pharmacy", "messaging"],
    lifecycle: {
      status: "active",
      enablementState: "enabled",
      verificationRequirements: ["organization-verified", "pharmacy-license-verified"]
    },
    presentation: {
      navigationStyle: "sidebar",
      landingDashboard: "pharmacy-home",
      experienceProfile: "clinical-focus"
    }
  }),
  workspaceSchema.parse({
    id: "laboratory",
    kind: "organization",
    scopeType: "organization",
    label: "Laboratory",
    description: "A diagnostics organization workspace.",
    personas: ["lab-technician", "organization-admin"],
    capabilities: [],
    features: ["labs", "messaging"],
    lifecycle: {
      status: "active",
      enablementState: "enabled",
      verificationRequirements: ["organization-verified", "laboratory-accredited"]
    },
    presentation: {
      navigationStyle: "sidebar",
      landingDashboard: "laboratory-home",
      experienceProfile: "clinical-focus"
    }
  }),
  workspaceSchema.parse({
    id: "employer",
    kind: "organization",
    scopeType: "employer",
    label: "Employer",
    description: "An employer sponsoring employee health programs.",
    personas: ["employer-admin"],
    capabilities: [],
    features: ["employer-portal", "programmes"],
    lifecycle: {
      status: "active",
      enablementState: "enabled",
      subscriptionRequirements: ["employer-program"],
      verificationRequirements: ["organization-verified"]
    },
    presentation: {
      navigationStyle: "sidebar",
      landingDashboard: "programme-home",
      experienceProfile: "administrative-focus"
    }
  }),
  workspaceSchema.parse({
    id: "insurer",
    kind: "organization",
    scopeType: "insurer",
    label: "Insurer",
    description: "An insurance organization workspace.",
    personas: ["insurer-agent"],
    capabilities: [],
    features: ["coverage"],
    lifecycle: {
      status: "active",
      enablementState: "enabled",
      verificationRequirements: ["organization-verified"]
    },
    presentation: {
      navigationStyle: "sidebar",
      landingDashboard: "coverage-home",
      experienceProfile: "administrative-focus"
    }
  }),
  workspaceSchema.parse({
    id: "ngo",
    kind: "organization",
    scopeType: "organization",
    label: "NGO",
    description: "A non-governmental health organization workspace.",
    personas: ["program-administrator", "organization-admin"],
    capabilities: [],
    features: ["programmes"],
    lifecycle: { status: "active", enablementState: "invite-only" },
    presentation: {
      navigationStyle: "sidebar",
      landingDashboard: "programme-home",
      experienceProfile: "administrative-focus"
    }
  }),
  workspaceSchema.parse({
    id: "government",
    kind: "organization",
    scopeType: "government-region",
    label: "Government",
    description: "A government health authority workspace.",
    personas: ["program-administrator", "organization-admin"],
    capabilities: [],
    features: ["government-portal", "programmes"],
    lifecycle: {
      status: "active",
      enablementState: "invite-only",
      verificationRequirements: ["government-authority-verified"]
    },
    presentation: {
      navigationStyle: "sidebar",
      landingDashboard: "programme-home",
      experienceProfile: "administrative-focus"
    }
  })
] as const;

/**
 * The organization types the platform recognises (M8.3e). This list IS the runtime
 * mapping: an `Organization.organizationType` column carries one of these values and
 * resolves directly to the workspace of the same id — there is no code branch per type.
 */
export const ORGANIZATION_TYPES = WORKSPACES.filter((entry) => entry.kind === "organization").map(
  (entry) => entry.id
);

/**
 * Resolve the workspace for a persisted organization type. Returns undefined for an
 * unknown type so the caller fails closed rather than defaulting to a hospital.
 */
export function findOrganizationWorkspace(organizationType: string): Workspace | undefined {
  const workspace = findWorkspace(organizationType);
  return workspace?.kind === "organization" ? workspace : undefined;
}

const WORKSPACE_IDS = new Set(WORKSPACES.map((entry) => entry.id));

export function isKnownWorkspace(id: string): boolean {
  return WORKSPACE_IDS.has(id);
}

export function findWorkspace(id: string): Workspace | undefined {
  return WORKSPACES.find((entry) => entry.id === id);
}
