import { z } from "zod";

/**
 * Platform Registry Layer — the structured Capability vocabulary (roadmap M8.3a).
 *
 * A capability is the atomic unit of platform composition: a `resource.action` pair
 * with a category and a scope. Every registry entry (workspace, persona, tool, and —
 * in later phases — navigation, dashboard, search, report, workflow) declares the
 * capabilities it REQUIRES or CONTRIBUTES. Composition = filter registries by the
 * capability set the Context Engine resolves for the actor.
 *
 * INVARIANT: capabilities are a COMPOSITION vocabulary, never an authorization input.
 * A surfaced capability does not grant access — the PDP (Authorization Platform)
 * remains the sole authorization decision point and re-decides at the resource door.
 *
 * Structured (not string) so capabilities are discoverable, groupable, and extensible,
 * and so the registry can eventually be edited by an administrator through a platform
 * builder rather than only by developers.
 */

/** Broad grouping for discovery / navigation / analytics. */
export const capabilityCategorySchema = z.enum([
  "clinical",
  "scheduling",
  "communication",
  "care-coordination",
  "documents",
  "identity",
  "financial",
  "administrative",
  "analytics",
  "ai"
]);
export type CapabilityCategory = z.infer<typeof capabilityCategorySchema>;

/**
 * The relational reach of a capability. Mirrors the platform's access scopes so the
 * Context Engine can resolve a capability set consistently with the Scope Registry
 * (M8.2) and the PDP scopes — self, care-circle, one organization, across
 * organizations, or platform-wide.
 */
export const capabilityScopeSchema = z.enum([
  "self",
  "care-circle",
  "organization",
  "cross-organization",
  "platform"
]);
export type CapabilityScope = z.infer<typeof capabilityScopeSchema>;

export const capabilitySchema = z
  .object({
    /** `resource.action`, e.g. `appointment.book`. */
    id: z.string().regex(/^[a-z][a-z-]*\.[a-z][a-z-]*$/),
    resource: z.string().regex(/^[a-z][a-z-]*$/),
    action: z.string().regex(/^[a-z][a-z-]*$/),
    category: capabilityCategorySchema,
    scope: capabilityScopeSchema,
    description: z.string().min(1),
    /** Open extension point (feature flags, ownership, future scope hints). */
    metadata: z.record(z.string(), z.unknown()).default({})
  })
  .superRefine((capability, ctx) => {
    if (capability.id !== `${capability.resource}.${capability.action}`) {
      ctx.addIssue({
        code: "custom",
        path: ["id"],
        message: "Capability id must equal `${resource}.${action}`."
      });
    }
  });

export type Capability = z.infer<typeof capabilitySchema>;

const capability = (
  resource: string,
  action: string,
  category: CapabilityCategory,
  scope: CapabilityScope,
  description: string
): Capability =>
  capabilitySchema.parse({
    id: `${resource}.${action}`,
    resource,
    action,
    category,
    scope,
    description
  });

/**
 * The initial capability catalog — the vocabulary, grounded in the platform's live
 * resources and PDP actions. Extended additively; a future platform builder adds
 * entries as data, not code.
 */
export const CAPABILITIES: readonly Capability[] = [
  // Care-coordination / longitudinal
  capability(
    "timeline",
    "read",
    "care-coordination",
    "care-circle",
    "Read a patient's longitudinal timeline."
  ),
  capability(
    "care-circle",
    "read",
    "care-coordination",
    "care-circle",
    "View a patient's care circle."
  ),
  capability(
    "care-circle",
    "manage",
    "care-coordination",
    "care-circle",
    "Invite/adjust care-circle membership."
  ),
  capability("consent", "grant", "identity", "self", "Grant a consent to a party."),
  capability("consent", "withdraw", "identity", "self", "Withdraw a previously granted consent."),
  // Scheduling
  capability("appointment", "read", "scheduling", "self", "View appointments."),
  capability("appointment", "book", "scheduling", "self", "Book an appointment into an open slot."),
  capability(
    "appointment",
    "reschedule",
    "scheduling",
    "self",
    "Move an appointment to another slot."
  ),
  capability("appointment", "cancel", "scheduling", "self", "Cancel an appointment."),
  capability(
    "availability-slot",
    "open",
    "scheduling",
    "organization",
    "Publish clinician availability."
  ),
  // Clinical
  capability("consultation", "read", "clinical", "care-circle", "View a consultation record."),
  capability(
    "consultation",
    "conduct",
    "clinical",
    "organization",
    "Start/complete a consultation."
  ),
  capability(
    "clinical-record",
    "read",
    "clinical",
    "care-circle",
    "Read the clinical record summary."
  ),
  capability(
    "clinical-record",
    "amend",
    "clinical",
    "organization",
    "Amend a clinical record entry."
  ),
  capability("prescription", "read", "clinical", "care-circle", "View prescriptions."),
  capability(
    "prescription",
    "dispense",
    "clinical",
    "organization",
    "Dispense a prescription fill."
  ),
  capability("laboratory", "read", "clinical", "care-circle", "View laboratory orders/results."),
  capability(
    "laboratory",
    "record-result",
    "clinical",
    "organization",
    "Record a laboratory result."
  ),
  // Communication / documents / notifications
  capability("message", "read", "communication", "care-circle", "Read secure messages."),
  capability("message", "send", "communication", "care-circle", "Send a secure message."),
  capability("notification", "read", "communication", "self", "Read the notification inbox."),
  capability("document", "read", "documents", "care-circle", "View documents."),
  capability("document", "upload", "documents", "care-circle", "Upload a document."),
  // Identity / administrative
  capability("patient-profile", "read", "identity", "self", "View a patient profile."),
  capability("patient-profile", "update", "identity", "self", "Update a patient profile."),
  capability(
    "organization",
    "administer",
    "administrative",
    "organization",
    "Administer an organization workspace."
  )
] as const;

const CAPABILITY_IDS = new Set(CAPABILITIES.map((entry) => entry.id));

/** Whether a capability id exists in the catalog. */
export function isKnownCapability(id: string): boolean {
  return CAPABILITY_IDS.has(id);
}

/** The catalog entry for an id, or undefined. */
export function findCapability(id: string): Capability | undefined {
  return CAPABILITIES.find((entry) => entry.id === id);
}
