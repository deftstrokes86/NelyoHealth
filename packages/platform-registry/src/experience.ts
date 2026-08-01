import { z } from "zod";
import { workspaceKindSchema } from "./workspace.js";

/**
 * Experience Registry (roadmap M8.3c).
 *
 * The third composition axis, alongside Navigation (where you can go) and Dashboard
 * (what you see once there): how a workspace FEELS and how an actor is brought into it.
 * One id space, three kinds:
 *
 * - `onboarding`      — an ordered, capability-filtered step flow (persona.onboardingFlows)
 * - `homepage-section` — a composable landing section (persona.homepageComposition)
 * - `profile`          — an experience profile: tone, density, and motion posture
 *   (workspace.presentation.experienceProfile, overridable by
 *   persona.behavior.preferredLandingExperience)
 *
 * Keeping the three in one registry means one validated id space and one filter rule,
 * rather than three near-identical registries — while `kind` keeps each reference site
 * strict (an onboarding flow can never be used as an experience profile).
 *
 * INVARIANT: composition, never authorization. A step surviving the capability filter
 * does not grant its action; the PDP re-decides when the step is performed.
 */
export const experienceKindSchema = z.enum(["onboarding", "homepage-section", "profile"]);
export type ExperienceKind = z.infer<typeof experienceKindSchema>;

export const experienceStepSchema = z.object({
  id: z.string().regex(/^[a-z][a-z0-9-]*$/),
  label: z.string().min(1),
  description: z.string().min(1),
  /** Capability ref this step exercises (declaration; the PDP decides). */
  requiresCapability: z.string().nullable().default(null),
  /** Tool Registry ref this step invokes, when it invokes one. */
  tool: z.string().nullable().default(null),
  /** The actor may skip this step. */
  optional: z.boolean().default(false),
  order: z.number().int().default(0)
});
export type ExperienceStep = z.infer<typeof experienceStepSchema>;

export const experienceSchema = z
  .object({
    id: z.string().regex(/^[a-z][a-z0-9-]*$/),
    kind: experienceKindSchema,
    label: z.string().min(1),
    description: z.string().min(1),
    appliesToWorkspaceKinds: z.array(workspaceKindSchema).min(1),
    /** Capability ref required to compose this experience. */
    requiresCapability: z.string().nullable().default(null),
    /** Feature Registry ref that must be available to the workspace. */
    requiresFeature: z.string().nullable().default(null),
    /** Ordered steps — required for `onboarding`, empty for every other kind. */
    steps: z.array(experienceStepSchema).default([]),
    /** Presentation posture, meaningful for `profile` (tone/density/motion). */
    tone: z.enum(["warm", "clinical", "neutral"]).default("neutral"),
    density: z.enum(["comfortable", "compact"]).default("comfortable"),
    motion: z.enum(["full", "reduced", "none"]).default("full"),
    order: z.number().int().default(0),
    metadata: z.record(z.string(), z.unknown()).default({})
  })
  .superRefine((experience, ctx) => {
    if (experience.kind === "onboarding" && experience.steps.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["steps"],
        message: "an onboarding experience must declare at least one step"
      });
    }
    if (experience.kind !== "onboarding" && experience.steps.length > 0) {
      ctx.addIssue({
        code: "custom",
        path: ["steps"],
        message: `steps are only valid on an onboarding experience (kind '${experience.kind}')`
      });
    }
  });
export type Experience = z.infer<typeof experienceSchema>;

export const EXPERIENCES: readonly Experience[] = [
  // Onboarding flows
  experienceSchema.parse({
    id: "patient-onboarding",
    kind: "onboarding",
    label: "Getting started",
    description: "Bring a new person into their personal health workspace.",
    appliesToWorkspaceKinds: ["personal"],
    steps: [
      {
        id: "verify-identity",
        label: "Verify your identity",
        description: "Confirm identity before health information is made available.",
        order: 10
      },
      {
        id: "complete-profile",
        label: "Complete your profile",
        description: "Add the details needed to coordinate care.",
        requiresCapability: "patient-profile.update",
        order: 20
      },
      {
        id: "set-consents",
        label: "Choose what you share",
        description: "Grant the consents that let care be coordinated on your behalf.",
        requiresCapability: "consent.grant",
        order: 30
      },
      {
        id: "add-care-circle",
        label: "Add your care circle",
        description: "Invite family or caregivers to support your care.",
        requiresCapability: "care-circle.manage",
        optional: true,
        order: 40
      }
    ]
  }),
  experienceSchema.parse({
    id: "caregiver-onboarding",
    kind: "onboarding",
    label: "Caring for someone",
    description: "Bring a delegated caregiver into the person's workspace.",
    appliesToWorkspaceKinds: ["personal"],
    tone: "neutral",
    density: "compact",
    steps: [
      {
        id: "confirm-delegation",
        label: "Confirm your delegation",
        description: "Accept the caregiver delegation the person granted you.",
        requiresCapability: "care-circle.read",
        order: 10
      },
      {
        id: "review-what-you-can-see",
        label: "Review what you can see",
        description:
          "Understand the scope of the delegation — what is shared with you, and what is not.",
        requiresCapability: "care-circle.read",
        order: 20
      },
      {
        id: "set-up-scheduling",
        label: "Help with appointments",
        description: "Book and track appointments on this person's behalf.",
        requiresCapability: "appointment.book",
        optional: true,
        order: 30
      }
    ]
  }),
  experienceSchema.parse({
    id: "clinician-onboarding",
    kind: "onboarding",
    label: "Clinician setup",
    description: "Bring a clinician into an organization workspace.",
    appliesToWorkspaceKinds: ["organization"],
    tone: "clinical",
    density: "compact",
    steps: [
      {
        id: "verify-credentials",
        label: "Verify your credentials",
        description: "Confirm professional registration before clinical access.",
        order: 10
      },
      {
        id: "set-availability",
        label: "Publish your availability",
        description: "Open the slots patients can book into.",
        requiresCapability: "availability-slot.open",
        order: 20
      },
      {
        id: "review-clinical-safety",
        label: "Review clinical safety",
        description: "Acknowledge the consultation and safety-netting standards.",
        order: 30
      }
    ]
  }),
  experienceSchema.parse({
    id: "organization-admin-onboarding",
    kind: "onboarding",
    label: "Organization setup",
    description: "Bring an organization administrator into a new workspace.",
    appliesToWorkspaceKinds: ["organization"],
    tone: "neutral",
    density: "compact",
    steps: [
      {
        id: "verify-organization",
        label: "Verify the organization",
        description: "Complete organization verification before enablement.",
        order: 10
      },
      {
        id: "invite-members",
        label: "Invite your team",
        description: "Add members and assign role scopes.",
        requiresCapability: "organization.administer",
        order: 20
      },
      {
        id: "configure-services",
        label: "Configure services",
        description: "Choose the services this organization offers.",
        requiresCapability: "organization.administer",
        order: 30
      }
    ]
  }),

  // Homepage sections
  experienceSchema.parse({
    id: "next-appointment-card",
    kind: "homepage-section",
    label: "Your next appointment",
    description: "The next upcoming appointment, front and centre.",
    appliesToWorkspaceKinds: ["personal"],
    requiresCapability: "appointment.read",
    requiresFeature: "appointments",
    order: 10
  }),
  experienceSchema.parse({
    id: "care-circle-highlights",
    kind: "homepage-section",
    label: "Your care circle",
    description: "Recent care-circle activity and who is supporting this person.",
    appliesToWorkspaceKinds: ["personal"],
    requiresCapability: "care-circle.read",
    requiresFeature: "care-circle",
    order: 20
  }),
  experienceSchema.parse({
    id: "health-tips",
    kind: "homepage-section",
    label: "Health guidance",
    description: "General, non-personalised health guidance.",
    appliesToWorkspaceKinds: ["personal"],
    order: 30
  }),
  experienceSchema.parse({
    id: "clinic-day-summary",
    kind: "homepage-section",
    label: "Your day",
    description: "A summary of today's clinical workload.",
    appliesToWorkspaceKinds: ["organization"],
    requiresCapability: "appointment.read",
    requiresFeature: "appointments",
    order: 10
  }),
  experienceSchema.parse({
    id: "pending-consultations",
    kind: "homepage-section",
    label: "Awaiting you",
    description: "Consultations awaiting completion.",
    appliesToWorkspaceKinds: ["organization"],
    requiresCapability: "consultation.conduct",
    requiresFeature: "consultations",
    order: 20
  }),

  experienceSchema.parse({
    id: "org-admin-overview",
    kind: "homepage-section",
    label: "Organization at a glance",
    description: "Headline organization health: membership, verification, and coverage.",
    appliesToWorkspaceKinds: ["organization"],
    requiresCapability: "organization.administer",
    order: 10
  }),
  experienceSchema.parse({
    id: "org-schedule-coverage",
    kind: "homepage-section",
    label: "Schedule coverage",
    description: "Published availability against demand across the organization.",
    appliesToWorkspaceKinds: ["organization"],
    requiresCapability: "availability-slot.open",
    requiresFeature: "appointments",
    order: 20
  }),

  // --- Diaspora + organization-type experiences (M8.3e) ---
  experienceSchema.parse({
    id: "diaspora-sponsor-onboarding",
    kind: "onboarding",
    label: "Supporting family at home",
    description: "Bring a diaspora sponsor into their household workspace.",
    appliesToWorkspaceKinds: ["personal"],
    steps: [
      {
        id: "verify-sponsor-identity",
        label: "Verify your identity",
        description: "Confirm who you are before you can be linked to family at home.",
        order: 10
      },
      {
        id: "link-family",
        label: "Link your family",
        description: "Connect to the people whose care you will support.",
        requiresCapability: "care-circle.read",
        order: 20
      },
      {
        id: "set-up-funding",
        label: "Set up funding",
        description: "Add a funding method so care can be paid for from abroad.",
        requiresCapability: "sponsorship.fund",
        order: 30
      }
    ]
  }),
  experienceSchema.parse({
    id: "pharmacy-onboarding",
    kind: "onboarding",
    label: "Pharmacy setup",
    description: "Bring a pharmacy into the platform.",
    appliesToWorkspaceKinds: ["organization"],
    tone: "clinical",
    density: "compact",
    steps: [
      {
        id: "verify-pharmacy-licence",
        label: "Verify your licence",
        description: "Confirm the pharmacy licence before dispensing is enabled.",
        order: 10
      },
      {
        id: "configure-dispensing",
        label: "Configure dispensing",
        description: "Set up the dispensing queue and stock handling.",
        requiresCapability: "prescription.dispense",
        order: 20
      }
    ]
  }),
  experienceSchema.parse({
    id: "laboratory-onboarding",
    kind: "onboarding",
    label: "Laboratory setup",
    description: "Bring a laboratory into the platform.",
    appliesToWorkspaceKinds: ["organization"],
    tone: "clinical",
    density: "compact",
    steps: [
      {
        id: "verify-accreditation",
        label: "Verify accreditation",
        description: "Confirm laboratory accreditation before results may be recorded.",
        order: 10
      },
      {
        id: "configure-result-recording",
        label: "Configure result recording",
        description: "Set up the worklist and result-recording workflow.",
        requiresCapability: "laboratory.record-result",
        order: 20
      }
    ]
  }),
  experienceSchema.parse({
    id: "programme-onboarding",
    kind: "onboarding",
    label: "Programme setup",
    description: "Bring an employer, NGO, or government programme into the platform.",
    appliesToWorkspaceKinds: ["organization"],
    tone: "neutral",
    density: "compact",
    steps: [
      {
        id: "verify-programme-sponsor",
        label: "Verify the sponsoring organization",
        description: "Complete organization verification before enrolment opens.",
        order: 10
      },
      {
        id: "define-programme",
        label: "Define the programme",
        description: "Set the services, eligibility, and enrolment rules.",
        requiresCapability: "program.administer",
        order: 20
      }
    ]
  }),
  experienceSchema.parse({
    id: "coverage-onboarding",
    kind: "onboarding",
    label: "Coverage setup",
    description: "Bring an insurer into the platform.",
    appliesToWorkspaceKinds: ["organization"],
    tone: "neutral",
    density: "compact",
    steps: [
      {
        id: "verify-payer",
        label: "Verify the payer",
        description: "Complete payer verification before coverage is exposed.",
        order: 10
      },
      {
        id: "configure-plans",
        label: "Configure plans",
        description: "Define the plans and eligibility rules this insurer offers.",
        requiresCapability: "coverage.read",
        order: 20
      }
    ]
  }),
  experienceSchema.parse({
    id: "sponsored-care-summary",
    kind: "homepage-section",
    label: "Care you support",
    description: "How the people this sponsor supports are doing — coordination, not clinical.",
    appliesToWorkspaceKinds: ["personal"],
    requiresCapability: "care-circle.read",
    requiresFeature: "care-circle",
    order: 10
  }),
  experienceSchema.parse({
    id: "funding-summary",
    kind: "homepage-section",
    label: "Funding",
    description: "Balance, recent top-ups, and upcoming costs.",
    appliesToWorkspaceKinds: ["personal"],
    requiresCapability: "sponsorship.read",
    requiresFeature: "diaspora-sponsorship",
    order: 20
  }),
  experienceSchema.parse({
    id: "dispensing-queue-summary",
    kind: "homepage-section",
    label: "Dispensing queue",
    description: "Prescriptions awaiting dispensing.",
    appliesToWorkspaceKinds: ["organization"],
    requiresCapability: "prescription.dispense",
    requiresFeature: "pharmacy",
    order: 10
  }),
  experienceSchema.parse({
    id: "lab-worklist-summary",
    kind: "homepage-section",
    label: "Worklist",
    description: "Specimens and results awaiting recording.",
    appliesToWorkspaceKinds: ["organization"],
    requiresCapability: "laboratory.record-result",
    requiresFeature: "labs",
    order: 10
  }),
  experienceSchema.parse({
    id: "programme-overview-section",
    kind: "homepage-section",
    label: "Programme at a glance",
    description: "Enrolment and utilisation headlines for the programme.",
    appliesToWorkspaceKinds: ["organization"],
    requiresCapability: "program.administer",
    requiresFeature: "programmes",
    order: 10
  }),
  experienceSchema.parse({
    id: "coverage-overview-section",
    kind: "homepage-section",
    label: "Coverage at a glance",
    description: "Active plans and member eligibility.",
    appliesToWorkspaceKinds: ["organization"],
    requiresCapability: "coverage.read",
    requiresFeature: "coverage",
    order: 10
  }),

  // Experience profiles
  experienceSchema.parse({
    id: "diaspora-sponsor-profile",
    kind: "profile",
    label: "Supportive, from afar",
    description:
      "A warm, reassuring posture for someone coordinating care across a distance and a time zone.",
    appliesToWorkspaceKinds: ["personal"],
    tone: "warm",
    density: "comfortable",
    motion: "reduced"
  }),
  experienceSchema.parse({
    id: "administrative-focus",
    kind: "profile",
    label: "Administrative",
    description: "A dense, low-distraction posture for programme and coverage administration.",
    appliesToWorkspaceKinds: ["organization"],
    tone: "neutral",
    density: "compact",
    motion: "reduced"
  }),
  experienceSchema.parse({
    id: "warm-care-personal",
    kind: "profile",
    label: "Warm care",
    description: "The supportive, spacious posture of the personal workspace.",
    appliesToWorkspaceKinds: ["personal"],
    tone: "warm",
    density: "comfortable",
    motion: "full"
  }),
  experienceSchema.parse({
    id: "focused-personal",
    kind: "profile",
    label: "Focused",
    description: "A compact, task-oriented posture for someone coordinating another person's care.",
    appliesToWorkspaceKinds: ["personal"],
    tone: "neutral",
    density: "compact",
    motion: "reduced"
  }),
  experienceSchema.parse({
    id: "clinical-focus",
    kind: "profile",
    label: "Clinical focus",
    description: "The dense, low-distraction posture of a clinical workspace.",
    appliesToWorkspaceKinds: ["organization"],
    tone: "clinical",
    density: "compact",
    motion: "reduced"
  })
] as const;

const EXPERIENCE_IDS = new Set(EXPERIENCES.map((entry) => entry.id));

export function isKnownExperience(id: string): boolean {
  return EXPERIENCE_IDS.has(id);
}

export function findExperience(id: string): Experience | undefined {
  return EXPERIENCES.find((entry) => entry.id === id);
}

/** Whether an id names an experience of a specific kind (used by the validation gate). */
export function isExperienceOfKind(id: string, kind: ExperienceKind): boolean {
  return findExperience(id)?.kind === kind;
}
