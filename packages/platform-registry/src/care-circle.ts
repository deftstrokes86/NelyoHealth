import { z } from "zod";

/**
 * Care Circle Registry (roadmap M8.3b, refinement 6) — Care Circle as a first-class
 * platform construct.
 *
 * The registry MODELS collaboration: for each relationship role it declares
 * responsibilities, communication rules, shared resources, financial sponsorship,
 * emergency escalation, AI collaboration, care goals, and task ownership — replacing
 * the ad-hoc, capacity-only view. It supports diaspora, family, and household care as
 * DATA, not code exclusions.
 *
 * INVARIANTS:
 *  - Membership is still DERIVED from the relationship graph (derive-don't-persist);
 *    this registry defines the role TAXONOMY, not the members.
 *  - `capacity` is a DECLARATION for composition/discovery. It is NOT an authorization
 *    input: the PDP remains the sole authorization decision point and resolves actual
 *    cross-patient capacity from the relationship graph + consent. A role with
 *    `capacity: null` is declared but not (yet) authz-mapped — the PDP default-denies
 *    it, exactly as today. This registry mirrors that state; it never grants.
 */

export const careCircleCommunicationSchema = z.enum(["full", "summary", "emergency-only", "none"]);

export const careCircleCollaborationSchema = z.object({
  responsibilities: z.array(z.string()).default([]),
  communicationRules: careCircleCommunicationSchema.default("summary"),
  /** Resource domains this role may collaborate on (timeline, appointments, messaging, documents…). */
  sharedResources: z.array(z.string()).default([]),
  financialSponsorship: z.boolean().default(false),
  emergencyEscalation: z.boolean().default(false),
  aiCollaboration: z.boolean().default(false),
  careGoals: z.boolean().default(false),
  taskOwnership: z.boolean().default(false)
});
export type CareCircleCollaboration = z.infer<typeof careCircleCollaborationSchema>;

/** The composition capacity DECLARATION — mirrors the PDP's capacity map; not an authz input. */
export const careCircleCapacitySchema = z.object({
  actorRole: z.string(),
  actorType: z.string(),
  priority: z.number().int().min(0)
});

export const careCircleRoleSchema = z.object({
  /** The registry role id, e.g. `guardian`, `caregiver-delegation`, `diaspora-sponsor`. */
  id: z.string().regex(/^[a-z][a-z0-9-]*$/),
  label: z.string().min(1),
  description: z.string().min(1),
  /**
   * The PERSISTED relationship type this role corresponds to in the relationship graph.
   * Defaults to the role id; `diaspora-sponsor` maps to the stored type `sponsor`. This
   * is what lets the runtime map a relationship to a role by lookup, not by a hardcoded
   * table (M8.3e).
   */
  relationshipType: z.string().min(1).optional(),
  /**
   * The Persona Registry id an actor COMPOSES AS when acting for a subject through this
   * role, and the Workspace Registry id they compose in. Null means the role is declared
   * but composes nothing — the runtime then offers no surface for that subject.
   */
  composesAsPersona: z.string().nullable().default(null),
  composesInWorkspace: z.string().nullable().default(null),
  /**
   * EXPLICIT composition precedence when an actor holds several relationships to the same
   * subject — lower wins. Declared per role rather than inferred from array position, so
   * reordering this catalog for readability can never change runtime behaviour. The
   * validation gate requires it to be unique among roles that compose, so precedence is
   * always total and deterministic.
   */
  compositionPriority: z.number().int().min(0).nullable().default(null),
  /** Declared capacity (composition). `null` = declared but not authz-mapped (PDP default-denies). */
  capacity: careCircleCapacitySchema.nullable().default(null),
  /** Capability refs this role collaborates with (composition). */
  capabilities: z.array(z.string()).default([]),
  collaboration: careCircleCollaborationSchema,
  /** Event Registry refs (validated in M8.3b). */
  events: z
    .object({
      produces: z.array(z.string()).default([]),
      consumes: z.array(z.string()).default([])
    })
    .default({ produces: [], consumes: [] }),
  status: z.enum(["active", "planned"]).default("planned"),
  metadata: z.record(z.string(), z.unknown()).default({})
});
export type CareCircleRole = z.infer<typeof careCircleRoleSchema>;

export const CARE_CIRCLE_ROLES: readonly CareCircleRole[] = [
  careCircleRoleSchema.parse({
    id: "guardian",
    label: "Guardian",
    description: "A guardian acting for a dependent — full care collaboration.",
    composesAsPersona: "guardian",
    composesInWorkspace: "personal",
    compositionPriority: 0,
    // Mirrors RELATIONSHIP_CAPACITY (guardian, priority 0) — declaration only.
    capacity: { actorRole: "guardian", actorType: "guardian", priority: 0 },
    capabilities: [
      "timeline.read",
      "care-circle.read",
      "care-circle.manage",
      "appointment.book",
      "consent.grant"
    ],
    collaboration: {
      responsibilities: ["scheduling", "consent", "records"],
      communicationRules: "full",
      sharedResources: ["timeline", "appointments", "messaging", "documents"],
      emergencyEscalation: true,
      aiCollaboration: true,
      careGoals: true,
      taskOwnership: true
    },
    events: { consumes: ["CareCircleMemberAdded"] },
    status: "active"
  }),
  careCircleRoleSchema.parse({
    id: "caregiver-delegation",
    label: "Caregiver",
    description: "A delegated caregiver — day-to-day care coordination.",
    composesAsPersona: "caregiver",
    composesInWorkspace: "personal",
    compositionPriority: 10,
    // Mirrors RELATIONSHIP_CAPACITY (caregiver, priority 1) — declaration only.
    capacity: { actorRole: "caregiver", actorType: "caregiver", priority: 1 },
    capabilities: ["timeline.read", "care-circle.read", "appointment.book", "message.send"],
    collaboration: {
      responsibilities: ["scheduling", "day-to-day"],
      communicationRules: "summary",
      sharedResources: ["timeline", "appointments", "messaging"],
      aiCollaboration: true,
      careGoals: true,
      taskOwnership: true
    },
    events: { consumes: ["CareCircleMemberAdded"] },
    status: "active"
  }),
  careCircleRoleSchema.parse({
    id: "family-member",
    label: "Family member",
    description:
      "A family member collaborating on care (declared; PDP default-denies until mapped).",
    capacity: null,
    capabilities: ["timeline.read", "message.send"],
    collaboration: {
      responsibilities: ["support"],
      communicationRules: "summary",
      sharedResources: ["messaging"],
      careGoals: true
    },
    status: "planned"
  }),
  careCircleRoleSchema.parse({
    id: "diaspora-sponsor",
    label: "Diaspora sponsor",
    relationshipType: "sponsor",
    composesAsPersona: "diaspora-sponsor",
    composesInWorkspace: "diaspora-household",
    compositionPriority: 20,
    description:
      "A relative abroad sponsoring care — financial sponsorship + emergency escalation.",
    // capacity stays null BY DESIGN: the PDP separates a sponsor's payment relationship
    // from clinical access (`sponsorPaymentOnly` / `sponsor-payment-no-clinical-access`).
    // The capabilities below are the NON-CLINICAL set a sponsor composes when acting for
    // a sponsored person — funding and coordination, never a clinical record.
    capacity: null,
    capabilities: [
      "care-circle.read",
      "appointment.read",
      "notification.read",
      "message.read",
      "message.send",
      "sponsorship.read",
      "sponsorship.fund"
    ],
    collaboration: {
      responsibilities: ["sponsorship"],
      communicationRules: "summary",
      sharedResources: ["appointments", "messaging"],
      financialSponsorship: true,
      emergencyEscalation: true,
      aiCollaboration: true
    },
    events: { produces: ["CareSponsorshipFunded"] },
    status: "active"
  }),
  careCircleRoleSchema.parse({
    id: "household",
    label: "Household member",
    description: "A household member (declared; not yet authz-mapped).",
    capacity: null,
    collaboration: { communicationRules: "summary", sharedResources: [], careGoals: true },
    status: "planned"
  }),
  careCircleRoleSchema.parse({
    id: "emergency-contact",
    label: "Emergency contact",
    description:
      "An emergency contact — escalation only (break-glass territory, not routine access).",
    capacity: null,
    collaboration: {
      responsibilities: ["escalation"],
      communicationRules: "emergency-only",
      emergencyEscalation: true
    },
    status: "planned"
  })
] as const;

const ROLE_IDS = new Set(CARE_CIRCLE_ROLES.map((entry) => entry.id));

export function isKnownCareCircleRole(id: string): boolean {
  return ROLE_IDS.has(id);
}

export function findCareCircleRole(id: string): CareCircleRole | undefined {
  return CARE_CIRCLE_ROLES.find((entry) => entry.id === id);
}

/** The persisted relationship type a role corresponds to (defaults to the role id). */
export function careCircleRelationshipType(role: CareCircleRole): string {
  return role.relationshipType ?? role.id;
}

/**
 * Find the role a PERSISTED relationship type composes as (M8.3e). This is the lookup
 * that replaces a hardcoded relationship→persona table in the runtime: the registry
 * declares the correspondence, the runtime reads it.
 */
export function findCareCircleRoleByRelationshipType(
  relationshipType: string
): CareCircleRole | undefined {
  return CARE_CIRCLE_ROLES.find((entry) => careCircleRelationshipType(entry) === relationshipType);
}

/**
 * Composition precedence when an actor holds several relationships to the same subject —
 * lower wins. Read from each role's EXPLICIT `compositionPriority`, never from catalog
 * position, so the catalog can be reordered or extended without changing which capacity
 * an actor composes under. A role that declares no priority sorts last.
 *
 * Mirrors, but never substitutes for, the PDP's own capacity ordering
 * (`RELATIONSHIP_CAPACITY`), which is resolved independently at the resource door.
 */
export function careCircleCompositionPriority(roleId: string): number {
  return findCareCircleRole(roleId)?.compositionPriority ?? Number.MAX_SAFE_INTEGER;
}
