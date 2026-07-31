import { z } from "zod";
import { workspaceKindSchema } from "./workspace.js";

/**
 * Persona Registry (roadmap M8.3a, refinement 4).
 *
 * A persona is the role an actor plays within a workspace. It FORMALIZES the Context
 * Engine's `ResolvedPersona` (`actorRole`) and expands it into the full default
 * composition for that role: not just capabilities, but the default dashboards,
 * navigation, search scopes, notification preferences, reports, onboarding flows,
 * homepage composition, and interaction patterns.
 *
 * The composition fields are id arrays into the other registries: `capabilities`
 * (M8.3a), `defaultDashboards` / `navigation` / `onboardingFlows` / `homepageComposition`
 * (M8.3c), and `searchScopes` / `reports` (M8.3d). As of M8.3d **every** reference on a
 * persona resolves against a live registry and is enforced by the validation gate —
 * there are no forward references left in this schema.
 */

export const interactionPatternsSchema = z.object({
  /** Visual density preference for this persona's surfaces. */
  density: z.enum(["comfortable", "compact"]).default("comfortable"),
  /** Ordered capability ids surfaced as primary actions. */
  primaryActions: z.array(z.string()).default([]),
  metadata: z.record(z.string(), z.unknown()).default({})
});

/**
 * Behavioral metadata (refinement 4): how a persona prefers to be communicated with and
 * assisted. `preferredLandingExperience` (Experience, kind `profile`),
 * `defaultSearchPreference` (Search), and `defaultReportPreference` (Report) are all
 * resolved by the validation gate as of M8.3d; empty means "no preference declared".
 */
export const personaBehaviorSchema = z.object({
  communicationStyle: z.enum(["supportive", "clinical", "concise"]).default("supportive"),
  notificationStrategy: z.enum(["proactive", "balanced", "minimal"]).default("balanced"),
  aiInteractionProfile: z.enum(["off", "assistive", "autonomous"]).default("assistive"),
  preferredLandingExperience: z.string().default(""),
  defaultSearchPreference: z.string().default(""),
  defaultReportPreference: z.string().default("")
});
export type PersonaBehavior = z.infer<typeof personaBehaviorSchema>;

export const personaSchema = z.object({
  id: z.string().regex(/^[a-z][a-z0-9-]*$/),
  label: z.string().min(1),
  description: z.string().min(1),
  appliesToWorkspaceKinds: z.array(workspaceKindSchema).min(1),
  /** Capability catalog refs — validated in M8.3a. */
  capabilities: z.array(z.string()).default([]),
  /** Dashboard Registry refs — validated in M8.3c. */
  defaultDashboards: z.array(z.string()).default([]),
  /** Navigation Registry refs — TOP-LEVEL items only; children come from the hierarchy. */
  navigation: z.array(z.string()).default([]),
  /** Experience Registry refs, kind `onboarding` — validated in M8.3c. */
  onboardingFlows: z.array(z.string()).default([]),
  /** Experience Registry refs, kind `homepage-section` — validated in M8.3c. */
  homepageComposition: z.array(z.string()).default([]),
  /** Search Registry refs — validated in M8.3d. */
  searchScopes: z.array(z.string()).default([]),
  /** Report Registry refs — validated in M8.3d. */
  reports: z.array(z.string()).default([]),
  /** Default notification routing preferences (channel/opt-out defaults). */
  notificationPreferences: z.record(z.string(), z.unknown()).default({}),
  interactionPatterns: interactionPatternsSchema.default({
    density: "comfortable",
    primaryActions: [],
    metadata: {}
  }),
  behavior: personaBehaviorSchema.default({
    communicationStyle: "supportive",
    notificationStrategy: "balanced",
    aiInteractionProfile: "assistive",
    preferredLandingExperience: "",
    defaultSearchPreference: "",
    defaultReportPreference: ""
  }),
  metadata: z.record(z.string(), z.unknown()).default({})
});
export type Persona = z.infer<typeof personaSchema>;

/**
 * The persona catalog. `patient`, `clinician`, `organization-admin`, `caregiver`, and
 * `guardian` carry a full composition; the organization sub-type personas are declared
 * for the planned workspaces and compose nothing until their workspace is enabled and
 * their surfaces are authored.
 */
export const PERSONAS: readonly Persona[] = [
  personaSchema.parse({
    id: "patient",
    label: "Patient",
    description: "A person managing their own care.",
    appliesToWorkspaceKinds: ["personal"],
    capabilities: [
      "timeline.read",
      "care-circle.read",
      "care-circle.manage",
      "appointment.read",
      "appointment.book",
      "appointment.reschedule",
      "appointment.cancel",
      "notification.read",
      "message.read",
      "message.send",
      "document.read",
      "document.upload",
      "patient-profile.read",
      "patient-profile.update",
      "consent.grant",
      "consent.withdraw"
    ],
    defaultDashboards: ["patient-home"],
    navigation: ["home", "appointments", "care-circle", "messages", "personal-health", "settings"],
    onboardingFlows: ["patient-onboarding"],
    homepageComposition: ["next-appointment-card", "care-circle-highlights", "health-tips"],
    searchScopes: ["my-appointments", "my-documents", "my-messages", "provider-directory"],
    reports: ["my-care-summary"],
    interactionPatterns: {
      density: "comfortable",
      primaryActions: ["appointment.book", "message.send"]
    },
    behavior: {
      communicationStyle: "supportive",
      notificationStrategy: "proactive",
      aiInteractionProfile: "assistive"
    }
  }),
  personaSchema.parse({
    id: "caregiver",
    label: "Caregiver",
    description: "A delegated actor caring for another person (care-circle capacity).",
    appliesToWorkspaceKinds: ["personal"],
    capabilities: [
      "timeline.read",
      "care-circle.read",
      "appointment.read",
      "appointment.book",
      "notification.read",
      "message.read",
      "message.send"
    ],
    defaultDashboards: ["patient-home"],
    navigation: ["home", "appointments", "care-circle", "messages", "personal-health"],
    onboardingFlows: ["caregiver-onboarding"],
    homepageComposition: ["next-appointment-card", "care-circle-highlights"],
    searchScopes: ["my-appointments", "my-messages", "provider-directory"],
    // Coordinating another person's care is task-work: override the workspace's warm
    // default with the compact profile.
    behavior: { preferredLandingExperience: "focused-personal" }
  }),
  personaSchema.parse({
    id: "guardian",
    label: "Guardian",
    description: "A guardian acting for a dependent (care-circle capacity).",
    appliesToWorkspaceKinds: ["personal"],
    capabilities: [
      "timeline.read",
      "care-circle.read",
      "care-circle.manage",
      "appointment.read",
      "appointment.book",
      "appointment.reschedule",
      "appointment.cancel",
      "notification.read",
      "message.read",
      "message.send",
      "consent.grant",
      "consent.withdraw"
    ],
    defaultDashboards: ["patient-home"],
    navigation: ["home", "appointments", "care-circle", "messages", "personal-health", "settings"],
    onboardingFlows: ["patient-onboarding"],
    homepageComposition: ["next-appointment-card", "care-circle-highlights"],
    searchScopes: ["my-appointments", "my-documents", "my-messages", "provider-directory"],
    reports: ["my-care-summary"]
  }),
  personaSchema.parse({
    id: "clinician",
    label: "Clinician",
    description: "A care provider within an organization.",
    appliesToWorkspaceKinds: ["organization"],
    capabilities: [
      "timeline.read",
      "appointment.read",
      "availability-slot.open",
      "consultation.read",
      "consultation.conduct",
      "clinical-record.read",
      "clinical-record.amend",
      "patient-profile.read",
      "prescription.read",
      "laboratory.read",
      "message.read",
      "message.send"
    ],
    defaultDashboards: ["clinician-home"],
    navigation: ["org-home", "org-schedule", "org-clinical", "org-messages"],
    onboardingFlows: ["clinician-onboarding"],
    homepageComposition: ["clinic-day-summary", "pending-consultations"],
    searchScopes: ["org-patients", "org-clinical-records", "org-schedule", "my-messages"],
    reports: ["my-clinic-day"],
    interactionPatterns: { density: "compact", primaryActions: ["consultation.conduct"] },
    behavior: {
      communicationStyle: "clinical",
      notificationStrategy: "minimal",
      aiInteractionProfile: "assistive",
      preferredLandingExperience: "clinical-focus"
    }
  }),
  personaSchema.parse({
    id: "organization-admin",
    label: "Organization administrator",
    description: "An administrator of an organization workspace.",
    appliesToWorkspaceKinds: ["organization"],
    capabilities: ["organization.administer", "availability-slot.open"],
    defaultDashboards: ["organization-admin-home"],
    // `org-clinical` is declared but composes only for an admin who also holds clinical
    // capabilities; it drops out for an administrator who does not.
    navigation: ["org-home", "org-schedule", "org-clinical", "org-admin"],
    onboardingFlows: ["organization-admin-onboarding"],
    homepageComposition: ["org-admin-overview", "org-schedule-coverage"],
    searchScopes: ["org-schedule", "provider-directory"],
    // `platform-demand-trends` is declared but `planned`, so it never composes yet.
    reports: [
      "clinic-activity",
      "schedule-utilisation",
      "consent-evidence",
      "platform-demand-trends"
    ],
    interactionPatterns: { density: "compact", primaryActions: [] }
  }),
  personaSchema.parse({
    id: "pharmacist",
    label: "Pharmacist",
    description: "A dispensing provider (planned).",
    appliesToWorkspaceKinds: ["organization"],
    capabilities: ["prescription.read", "prescription.dispense"]
  }),
  personaSchema.parse({
    id: "lab-technician",
    label: "Laboratory technician",
    description: "A diagnostics provider (planned).",
    appliesToWorkspaceKinds: ["organization"],
    capabilities: ["laboratory.read", "laboratory.record-result"]
  }),
  personaSchema.parse({
    id: "employer-admin",
    label: "Employer administrator",
    description: "An employer program administrator (planned).",
    appliesToWorkspaceKinds: ["organization"],
    capabilities: []
  }),
  personaSchema.parse({
    id: "insurer-agent",
    label: "Insurer agent",
    description: "An insurance organization agent (planned).",
    appliesToWorkspaceKinds: ["organization"],
    capabilities: []
  })
] as const;

const PERSONA_IDS = new Set(PERSONAS.map((entry) => entry.id));

export function isKnownPersona(id: string): boolean {
  return PERSONA_IDS.has(id);
}

export function findPersona(id: string): Persona | undefined {
  return PERSONAS.find((entry) => entry.id === id);
}
