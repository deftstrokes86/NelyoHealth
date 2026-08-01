import { z } from "zod";
import { capabilityDomainSchema } from "./capability.js";

/**
 * Feature Registry (roadmap M8.3b, refinement 5).
 *
 * A feature is a platform capability made AVAILABLE to a workspace/organization —
 * Appointments, Messaging, Care Circle, Labs, Pharmacy, AI, Employer Portal, Government
 * Portal, etc. Features are DISTINCT from feature FLAGS: a feature is a durable product
 * capability a workspace offers; a flag (workspace lifecycle `featureFlags`) is a
 * rollout mechanism that gates a feature's exposure. Workspaces reference features
 * (`Workspace.features`); features bundle the capabilities and events they involve.
 */
export const featureSchema = z.object({
  id: z.string().regex(/^[a-z][a-z0-9-]*$/),
  name: z.string().min(1),
  description: z.string().min(1),
  domain: capabilityDomainSchema,
  /** Capability catalog refs this feature bundles. */
  capabilities: z.array(z.string()).default([]),
  /** Event Registry refs (validated in M8.3b). */
  events: z
    .object({
      produces: z.array(z.string()).default([]),
      consumes: z.array(z.string()).default([])
    })
    .default({ produces: [], consumes: [] }),
  status: z.enum(["active", "beta", "planned", "deprecated"]).default("planned"),
  metadata: z.record(z.string(), z.unknown()).default({})
});
export type Feature = z.infer<typeof featureSchema>;

export const FEATURES: readonly Feature[] = [
  featureSchema.parse({
    id: "appointments",
    name: "Appointments",
    description: "Book, reschedule, and manage appointments.",
    domain: "clinical",
    capabilities: [
      "appointment.read",
      "appointment.book",
      "appointment.reschedule",
      "appointment.cancel",
      "availability-slot.open"
    ],
    events: { produces: ["AppointmentBooked", "AppointmentRescheduled", "AppointmentCancelled"] },
    status: "active"
  }),
  featureSchema.parse({
    id: "messaging",
    name: "Messaging",
    description: "Secure care messaging.",
    domain: "communication",
    capabilities: ["message.read", "message.send"],
    events: { produces: ["MessagePosted"] },
    status: "active"
  }),
  featureSchema.parse({
    id: "care-circle",
    name: "Care Circle",
    description: "Collaborative care with family, caregivers, and guardians.",
    domain: "care-coordination",
    capabilities: ["care-circle.read", "care-circle.manage", "timeline.read"],
    events: { produces: ["CareCircleMemberAdded"] },
    status: "active"
  }),
  featureSchema.parse({
    id: "consultations",
    name: "Consultations",
    description: "Conduct and record consultations.",
    domain: "clinical",
    capabilities: ["consultation.read", "consultation.conduct"],
    events: { produces: ["ConsultationCompleted"] },
    status: "active"
  }),
  featureSchema.parse({
    id: "clinical-records",
    name: "Clinical Records",
    description: "Clinical record summaries and documents.",
    domain: "clinical",
    capabilities: [
      "clinical-record.read",
      "clinical-record.amend",
      "document.read",
      "document.upload"
    ],
    status: "active"
  }),
  featureSchema.parse({
    id: "labs",
    name: "Laboratory",
    description: "Laboratory orders and results.",
    domain: "clinical",
    capabilities: ["laboratory.read", "laboratory.record-result"],
    events: { produces: ["LabResultRecorded"] },
    status: "planned"
  }),
  featureSchema.parse({
    id: "pharmacy",
    name: "Pharmacy",
    description: "Prescription dispensing.",
    domain: "clinical",
    capabilities: ["prescription.read", "prescription.dispense"],
    events: { produces: ["PrescriptionDispensed"] },
    status: "planned"
  }),
  featureSchema.parse({
    id: "ai",
    name: "AI Assistance",
    description:
      "AI assistance composed from the Tool Registry (a consumer, not a parallel platform).",
    domain: "platform",
    capabilities: [],
    status: "planned"
  }),
  featureSchema.parse({
    id: "diaspora-sponsorship",
    name: "Diaspora Sponsorship",
    description: "Fund and coordinate care for family at home from abroad. Non-clinical by design.",
    domain: "finance",
    capabilities: ["sponsorship.read", "sponsorship.fund", "care-circle.read"],
    events: { produces: ["CareSponsorshipFunded"] },
    status: "active"
  }),
  featureSchema.parse({
    id: "coverage",
    name: "Coverage & Eligibility",
    description: "Plan coverage, eligibility, and benefit administration.",
    domain: "finance",
    capabilities: ["coverage.read"],
    status: "planned"
  }),
  featureSchema.parse({
    id: "programmes",
    name: "Health Programmes",
    description: "Sponsored health programme administration and population reporting.",
    domain: "administrative",
    capabilities: ["program.administer", "population-health.read"],
    status: "planned"
  }),
  featureSchema.parse({
    id: "employer-portal",
    name: "Employer Portal",
    description: "Employer-sponsored health program administration.",
    domain: "administrative",
    capabilities: [],
    status: "planned"
  }),
  featureSchema.parse({
    id: "government-portal",
    name: "Government Portal",
    description: "Government health authority administration.",
    domain: "government",
    capabilities: [],
    status: "planned"
  })
] as const;

const FEATURE_IDS = new Set(FEATURES.map((entry) => entry.id));

export function isKnownFeature(id: string): boolean {
  return FEATURE_IDS.has(id);
}

export function findFeature(id: string): Feature | undefined {
  return FEATURES.find((entry) => entry.id === id);
}
