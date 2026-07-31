import { z } from "zod";
import { dataClassificationSchema } from "./event.js";

/**
 * Notification Registry (roadmap M8.3b, refinement 8).
 *
 * Declarative notification routing: which event triggers a notification, who receives
 * it (personas / care-circle roles / a capability), on which channels, with which
 * template and data classification, at which priority. Care Circle collaboration,
 * workflow transitions, and future event subscribers all route through these
 * declarations instead of hardcoded logic. This formalizes the M6.2 orchestration and
 * gives the deferred notification-preference layer a declared surface to resolve
 * against — still references-not-bodies (no PHI in the notification itself; the
 * `classification` bounds what may be conveyed).
 */
export const notificationChannelSchema = z.enum(["in-app", "email", "sms", "push"]);

export const notificationRouteSchema = z.object({
  id: z.string().regex(/^[a-z][a-z0-9-]*$/),
  description: z.string().min(1),
  /** The event that triggers this route (Event Registry ref). */
  trigger: z.string().regex(/^[A-Z][A-Za-z]+$/),
  /** Recipients — any combination of personas, care-circle roles, or a capability holder. */
  audience: z.object({
    personas: z.array(z.string()).default([]),
    careCircleRoles: z.array(z.string()).default([]),
    capability: z.string().nullable().default(null)
  }),
  channels: z.array(notificationChannelSchema).min(1),
  /** Content template ref (content-registry family) — forward-ref, resolved later. */
  template: z.string().default(""),
  classification: dataClassificationSchema.default("INTERNAL"),
  priority: z.enum(["low", "normal", "high", "urgent"]).default("normal"),
  metadata: z.record(z.string(), z.unknown()).default({})
});
export type NotificationRoute = z.infer<typeof notificationRouteSchema>;

export const NOTIFICATION_ROUTES: readonly NotificationRoute[] = [
  notificationRouteSchema.parse({
    id: "appointment-confirmed",
    description: "Confirm a newly booked appointment to the patient and their care circle.",
    trigger: "AppointmentBooked",
    audience: { personas: ["patient"], careCircleRoles: ["guardian", "caregiver-delegation"] },
    channels: ["in-app", "email"],
    template: "appointment-booking.confirmed"
  }),
  notificationRouteSchema.parse({
    id: "appointment-cancelled",
    description: "Notify of an appointment cancellation.",
    trigger: "AppointmentCancelled",
    audience: { personas: ["patient"], careCircleRoles: ["guardian", "caregiver-delegation"] },
    channels: ["in-app", "push"],
    priority: "high"
  }),
  notificationRouteSchema.parse({
    id: "message-received",
    description: "Notify the recipient of a new secure message.",
    trigger: "MessagePosted",
    audience: { personas: ["patient"] },
    channels: ["in-app", "push"]
  }),
  notificationRouteSchema.parse({
    id: "consent-withdrawn",
    description: "Confirm a consent withdrawal to the patient.",
    trigger: "ConsentWithdrawn",
    audience: { personas: ["patient"] },
    channels: ["in-app", "email"],
    classification: "REGULATORY-EVIDENCE",
    priority: "high"
  }),
  notificationRouteSchema.parse({
    id: "lab-result-ready",
    description: "Notify the patient that a laboratory result is available.",
    trigger: "LabResultRecorded",
    audience: { personas: ["patient"] },
    channels: ["in-app"]
  }),
  notificationRouteSchema.parse({
    id: "dead-letter-alert",
    description: "Alert operations when a notification exhausts delivery attempts.",
    trigger: "NotificationDeadLettered",
    audience: { capability: "organization.administer" },
    channels: ["in-app"],
    classification: "SECURITY-OPERATIONAL-DATA",
    priority: "urgent"
  })
] as const;

const ROUTE_IDS = new Set(NOTIFICATION_ROUTES.map((entry) => entry.id));

export function isKnownNotificationRoute(id: string): boolean {
  return ROUTE_IDS.has(id);
}

export function findNotificationRoute(id: string): NotificationRoute | undefined {
  return NOTIFICATION_ROUTES.find((entry) => entry.id === id);
}
