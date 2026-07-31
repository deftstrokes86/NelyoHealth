import { z } from "zod";

/**
 * Event Registry (roadmap M8.3b, refinement 9).
 *
 * Formalizes the M6 Event Platform as a declared CONTRACT: every domain event's
 * publishers, subscribers, retry policy, dead-letter handling, data classification,
 * retention, and analytics visibility. Other registries (tools, workflows, features,
 * care-circle roles) reference these event ids via `produces` / `consumes`, so M6
 * becomes the implementation of an already-defined contract rather than a redesign.
 *
 * `classification` mirrors the M8.1 data-classification taxonomy (docs/data/
 * data-classification.md); it is declared here as an enum so this stays a pure leaf
 * registry — the values are the single vocabulary shared with the projection layer.
 */

/** M8.1 data classifications (mirrored; the projection layer is the enforcement point). */
export const dataClassificationSchema = z.enum([
  "PUBLIC",
  "INTERNAL",
  "CONFIDENTIAL",
  "SENSITIVE-PERSONAL-DATA",
  "PROTECTED-CLINICAL-DATA",
  "AUTHENTICATION-SECRET",
  "PAYMENT-DATA",
  "PROVIDER-CREDENTIAL-DATA",
  "PROVIDER-IDENTITY-LOCATION-DATA",
  "REGULATORY-EVIDENCE",
  "SECURITY-OPERATIONAL-DATA",
  "DEIDENTIFIED-OR-AGGREGATED-DATA"
]);

export const retryPolicySchema = z.object({
  maxAttempts: z.number().int().min(1).default(5),
  backoff: z.enum(["fixed", "exponential"]).default("exponential")
});

export const deadLetterSchema = z.object({
  enabled: z.boolean().default(true),
  /** Backlog/exhaustion count that should alert a human (see M6.2 hardening backlog). */
  alertThreshold: z.number().int().min(0).default(1)
});

export const eventSchema = z.object({
  /** PascalCase event type, e.g. `AppointmentBooked`. */
  id: z.string().regex(/^[A-Z][A-Za-z]+$/),
  domain: z.string().regex(/^[a-z][a-z-]*$/),
  description: z.string().min(1),
  classification: dataClassificationSchema,
  /** Producing contexts/services. */
  publishers: z.array(z.string()).min(1),
  /** Consuming projections/consumers. */
  subscribers: z.array(z.string()).default([]),
  retryPolicy: retryPolicySchema.default({ maxAttempts: 5, backoff: "exponential" }),
  deadLetter: deadLetterSchema.default({ enabled: true, alertThreshold: 1 }),
  retention: z.enum(["transient", "standard", "extended", "regulatory"]).default("standard"),
  analyticsVisible: z.boolean().default(false),
  metadata: z.record(z.string(), z.unknown()).default({})
});
export type PlatformEvent = z.infer<typeof eventSchema>;

export const EVENTS: readonly PlatformEvent[] = [
  eventSchema.parse({
    id: "AppointmentBooked",
    domain: "clinical",
    description: "An appointment was booked into an open slot.",
    classification: "INTERNAL",
    publishers: ["appointment"],
    subscribers: ["timeline", "care-circle", "notification"],
    retention: "standard",
    analyticsVisible: true
  }),
  eventSchema.parse({
    id: "AppointmentRescheduled",
    domain: "clinical",
    description: "An appointment was moved to another slot.",
    classification: "INTERNAL",
    publishers: ["appointment"],
    subscribers: ["timeline", "notification"],
    analyticsVisible: true
  }),
  eventSchema.parse({
    id: "AppointmentCancelled",
    domain: "clinical",
    description: "An appointment was cancelled.",
    classification: "INTERNAL",
    publishers: ["appointment"],
    subscribers: ["timeline", "notification"],
    analyticsVisible: true
  }),
  eventSchema.parse({
    id: "ConsultationCompleted",
    domain: "clinical",
    description: "A consultation was completed.",
    classification: "INTERNAL",
    publishers: ["consultation"],
    subscribers: ["timeline"]
  }),
  eventSchema.parse({
    id: "MessagePosted",
    domain: "communication",
    description: "A secure message was posted to a thread.",
    classification: "INTERNAL",
    publishers: ["messaging"],
    subscribers: ["notification"]
  }),
  eventSchema.parse({
    id: "PrescriptionDispensed",
    domain: "clinical",
    description: "A prescription fill was dispensed.",
    classification: "INTERNAL",
    publishers: ["prescription"],
    subscribers: ["timeline", "notification"]
  }),
  eventSchema.parse({
    id: "LabResultRecorded",
    domain: "clinical",
    description: "A laboratory result was recorded.",
    classification: "INTERNAL",
    publishers: ["laboratory"],
    subscribers: ["timeline", "notification"]
  }),
  eventSchema.parse({
    id: "ConsentGranted",
    domain: "care-coordination",
    description: "A consent was granted.",
    classification: "REGULATORY-EVIDENCE",
    publishers: ["consent"],
    subscribers: ["care-circle"],
    retention: "regulatory"
  }),
  eventSchema.parse({
    id: "ConsentWithdrawn",
    domain: "care-coordination",
    description: "A consent was withdrawn.",
    classification: "REGULATORY-EVIDENCE",
    publishers: ["consent"],
    subscribers: ["care-circle", "notification"],
    retention: "regulatory"
  }),
  eventSchema.parse({
    id: "CareCircleMemberAdded",
    domain: "care-coordination",
    description: "A care-circle membership was projected from a relationship.",
    classification: "SENSITIVE-PERSONAL-DATA",
    publishers: ["relationship"],
    subscribers: ["care-circle", "notification"]
  }),
  eventSchema.parse({
    id: "NotificationDeadLettered",
    domain: "communication",
    description: "A notification exhausted its delivery attempts.",
    classification: "SECURITY-OPERATIONAL-DATA",
    publishers: ["notification"],
    subscribers: ["ops-alerting"],
    retention: "extended"
  })
] as const;

const EVENT_IDS = new Set(EVENTS.map((entry) => entry.id));

export function isKnownEvent(id: string): boolean {
  return EVENT_IDS.has(id);
}

export function findEvent(id: string): PlatformEvent | undefined {
  return EVENTS.find((entry) => entry.id === id);
}
