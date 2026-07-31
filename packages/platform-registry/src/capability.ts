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
 * The business DOMAIN a capability belongs to — a higher-level classification than
 * `category` (which is UI/grouping oriented). Domains support future discovery, AI
 * reasoning, analytics, and search. Extended additively.
 */
export const capabilityDomainSchema = z.enum([
  "clinical",
  "care-coordination",
  "communication",
  "identity",
  "administrative",
  "finance",
  "research",
  "government",
  "analytics",
  "platform"
]);
export type CapabilityDomain = z.infer<typeof capabilityDomainSchema>;

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
    /** Business domain — higher-level than category (discovery / AI / analytics / search). */
    domain: capabilityDomainSchema,
    category: capabilityCategorySchema,
    scope: capabilityScopeSchema,
    description: z.string().min(1),
    /** Free-form tags for discovery, AI reasoning, analytics, and search. */
    tags: z.array(z.string()).default([]),
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
  domain: CapabilityDomain,
  category: CapabilityCategory,
  scope: CapabilityScope,
  description: string,
  tags: string[] = []
): Capability =>
  capabilitySchema.parse({
    id: `${resource}.${action}`,
    resource,
    action,
    domain,
    category,
    scope,
    description,
    tags
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
    "care-coordination",
    "care-circle",
    "Read a patient's longitudinal timeline.",
    ["longitudinal"]
  ),
  capability(
    "care-circle",
    "read",
    "care-coordination",
    "care-coordination",
    "care-circle",
    "View a patient's care circle."
  ),
  capability(
    "care-circle",
    "manage",
    "care-coordination",
    "care-coordination",
    "care-circle",
    "Invite/adjust care-circle membership."
  ),
  capability(
    "consent",
    "grant",
    "care-coordination",
    "identity",
    "self",
    "Grant a consent to a party.",
    ["consent"]
  ),
  capability(
    "consent",
    "withdraw",
    "care-coordination",
    "identity",
    "self",
    "Withdraw a previously granted consent.",
    ["consent"]
  ),
  // Scheduling
  capability("appointment", "read", "clinical", "scheduling", "self", "View appointments."),
  capability(
    "appointment",
    "book",
    "clinical",
    "scheduling",
    "self",
    "Book an appointment into an open slot."
  ),
  capability(
    "appointment",
    "reschedule",
    "clinical",
    "scheduling",
    "self",
    "Move an appointment to another slot."
  ),
  capability("appointment", "cancel", "clinical", "scheduling", "self", "Cancel an appointment."),
  capability(
    "availability-slot",
    "open",
    "administrative",
    "scheduling",
    "organization",
    "Publish clinician availability."
  ),
  // Clinical
  capability(
    "consultation",
    "read",
    "clinical",
    "clinical",
    "care-circle",
    "View a consultation record."
  ),
  capability(
    "consultation",
    "conduct",
    "clinical",
    "clinical",
    "organization",
    "Start/complete a consultation."
  ),
  capability(
    "clinical-record",
    "read",
    "clinical",
    "clinical",
    "care-circle",
    "Read the clinical record summary."
  ),
  capability(
    "clinical-record",
    "amend",
    "clinical",
    "clinical",
    "organization",
    "Amend a clinical record entry."
  ),
  capability("prescription", "read", "clinical", "clinical", "care-circle", "View prescriptions."),
  capability(
    "prescription",
    "dispense",
    "clinical",
    "clinical",
    "organization",
    "Dispense a prescription fill.",
    ["pharmacy"]
  ),
  capability(
    "laboratory",
    "read",
    "clinical",
    "clinical",
    "care-circle",
    "View laboratory orders/results."
  ),
  capability(
    "laboratory",
    "record-result",
    "clinical",
    "clinical",
    "organization",
    "Record a laboratory result.",
    ["labs"]
  ),
  // Communication / documents / notifications
  capability(
    "message",
    "read",
    "communication",
    "communication",
    "care-circle",
    "Read secure messages."
  ),
  capability(
    "message",
    "send",
    "communication",
    "communication",
    "care-circle",
    "Send a secure message."
  ),
  capability(
    "notification",
    "read",
    "communication",
    "communication",
    "self",
    "Read the notification inbox."
  ),
  capability("document", "read", "clinical", "documents", "care-circle", "View documents."),
  capability("document", "upload", "clinical", "documents", "care-circle", "Upload a document."),
  // Identity / administrative
  capability("patient-profile", "read", "identity", "identity", "self", "View a patient profile."),
  capability(
    "patient-profile",
    "update",
    "identity",
    "identity",
    "self",
    "Update a patient profile."
  ),
  capability(
    "organization",
    "administer",
    "administrative",
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
