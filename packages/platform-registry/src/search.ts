import { z } from "zod";
import { dataClassificationSchema } from "./event.js";
import { workspaceKindSchema } from "./workspace.js";

/**
 * Search Registry (roadmap M8.3d).
 *
 * A search scope declares WHAT is searchable, by whom, and — critically for a health
 * platform — at what data classification. Search is the surface most likely to leak
 * across a context boundary (a free-text query is an invitation to fish), so every
 * scope names the classification of what it returns and whether its results may be
 * matched across a care-circle or an organization.
 *
 * `resultClassification` is the ceiling the **projection layer** (M8.1) enforces on the
 * way out; declaring it here means a scope can never be added without stating what it
 * exposes, and the gate refuses a scope that claims a classification its capability's
 * reach cannot justify.
 *
 * INVARIANT: composition, never authorization. A scope surviving the filter does not
 * grant its results; the PDP authorizes the query and the projection layer redacts the
 * response. This registry decides what may be OFFERED as searchable.
 */

/** How far a scope's matching may reach — mirrors the capability scope vocabulary. */
export const searchReachSchema = z.enum([
  "self",
  "care-circle",
  "organization",
  "cross-organization"
]);
export type SearchReach = z.infer<typeof searchReachSchema>;

export const searchFieldSchema = z.object({
  name: z.string().min(1),
  /** `exact` fields are matched whole; `text` fields are tokenised. */
  match: z.enum(["exact", "text", "prefix"]).default("text"),
  /** The field participates in ranking, not just filtering. */
  ranked: z.boolean().default(true)
});
export type SearchField = z.infer<typeof searchFieldSchema>;

export const searchScopeSchema = z
  .object({
    id: z.string().regex(/^[a-z][a-z0-9-]*$/),
    label: z.string().min(1),
    description: z.string().min(1),
    /** The resource searched — matches the Capability catalog's `resource`. */
    resource: z.string().regex(/^[a-z][a-z-]*$/),
    appliesToWorkspaceKinds: z.array(workspaceKindSchema).min(1),
    /** Capability ref required to compose this scope (declaration; the PDP decides). */
    requiresCapability: z.string().nullable().default(null),
    /** Feature Registry ref that must be available to the workspace. */
    requiresFeature: z.string().nullable().default(null),
    reach: searchReachSchema,
    /** The highest classification a result from this scope may carry. */
    resultClassification: dataClassificationSchema,
    fields: z.array(searchFieldSchema).min(1),
    /** Tool Registry ref that executes the query, when one exists. */
    tool: z.string().nullable().default(null),
    order: z.number().int().default(0),
    status: z.enum(["active", "beta", "planned"]).default("planned"),
    metadata: z.record(z.string(), z.unknown()).default({})
  })
  .superRefine((scope, ctx) => {
    // Cross-organization reach over clinical or sensitive data is exactly the fishing
    // surface this registry exists to make visible. It must be an explicit, reviewed
    // decision, never a default that slips in with a new scope.
    const restricted = ["PROTECTED-CLINICAL-DATA", "SENSITIVE-PERSONAL-DATA"];
    if (scope.reach === "cross-organization" && restricted.includes(scope.resultClassification)) {
      ctx.addIssue({
        code: "custom",
        path: ["reach"],
        message: `cross-organization reach may not return '${scope.resultClassification}' — narrow the reach or the classification`
      });
    }
  });
export type SearchScope = z.infer<typeof searchScopeSchema>;

export const SEARCH_SCOPES: readonly SearchScope[] = [
  searchScopeSchema.parse({
    id: "my-appointments",
    label: "Appointments",
    description: "Search a person's own and care-circle appointments.",
    resource: "appointment",
    appliesToWorkspaceKinds: ["personal"],
    requiresCapability: "appointment.read",
    requiresFeature: "appointments",
    reach: "care-circle",
    resultClassification: "INTERNAL",
    fields: [
      { name: "reasonForVisit", match: "text" },
      { name: "providerName", match: "text" },
      { name: "scheduledAt", match: "exact", ranked: false }
    ],
    tool: "list-appointments",
    order: 10,
    status: "active"
  }),
  searchScopeSchema.parse({
    id: "my-documents",
    label: "Documents",
    description: "Search documents shared with a person or their care circle.",
    resource: "document",
    appliesToWorkspaceKinds: ["personal"],
    requiresCapability: "document.read",
    requiresFeature: "clinical-records",
    reach: "care-circle",
    resultClassification: "PROTECTED-CLINICAL-DATA",
    fields: [
      { name: "title", match: "text" },
      { name: "documentType", match: "exact", ranked: false }
    ],
    order: 20,
    status: "active"
  }),
  searchScopeSchema.parse({
    id: "my-messages",
    label: "Messages",
    description: "Search secure message threads a person participates in.",
    resource: "message",
    appliesToWorkspaceKinds: ["personal", "organization"],
    requiresCapability: "message.read",
    requiresFeature: "messaging",
    reach: "care-circle",
    resultClassification: "SENSITIVE-PERSONAL-DATA",
    fields: [
      { name: "subject", match: "text" },
      { name: "body", match: "text" }
    ],
    order: 30,
    status: "active"
  }),
  searchScopeSchema.parse({
    id: "org-patients",
    label: "Patients",
    description: "Search patients under this organization's care.",
    resource: "patient-profile",
    appliesToWorkspaceKinds: ["organization"],
    requiresCapability: "patient-profile.read",
    requiresFeature: "clinical-records",
    reach: "organization",
    resultClassification: "SENSITIVE-PERSONAL-DATA",
    fields: [
      { name: "familyName", match: "text" },
      { name: "givenName", match: "text" },
      { name: "patientIdentifier", match: "exact", ranked: false }
    ],
    order: 110,
    status: "active"
  }),
  searchScopeSchema.parse({
    id: "org-clinical-records",
    label: "Clinical records",
    description: "Search clinical records held by this organization.",
    resource: "clinical-record",
    appliesToWorkspaceKinds: ["organization"],
    requiresCapability: "clinical-record.read",
    requiresFeature: "clinical-records",
    reach: "organization",
    resultClassification: "PROTECTED-CLINICAL-DATA",
    fields: [
      { name: "summary", match: "text" },
      { name: "recordType", match: "exact", ranked: false }
    ],
    order: 120,
    status: "active"
  }),
  searchScopeSchema.parse({
    id: "org-schedule",
    label: "Schedule",
    description: "Search the organization's appointment schedule.",
    resource: "appointment",
    appliesToWorkspaceKinds: ["organization"],
    requiresCapability: "appointment.read",
    requiresFeature: "appointments",
    reach: "organization",
    resultClassification: "INTERNAL",
    fields: [
      { name: "patientReference", match: "exact", ranked: false },
      { name: "scheduledAt", match: "exact", ranked: false },
      { name: "reasonForVisit", match: "text" }
    ],
    tool: "list-appointments",
    order: 130,
    status: "active"
  }),
  searchScopeSchema.parse({
    id: "provider-directory",
    label: "Find care",
    description:
      "Search the public provider directory. Identity/location detail is released only after the ADR-0001 disclosure rules are met.",
    resource: "organization",
    appliesToWorkspaceKinds: ["personal", "organization"],
    requiresCapability: null,
    reach: "cross-organization",
    resultClassification: "PUBLIC",
    fields: [
      { name: "organizationName", match: "text" },
      { name: "specialty", match: "text" },
      { name: "serviceArea", match: "prefix" }
    ],
    order: 200,
    status: "active"
  }),

  // --- Diaspora + organization-type scopes (M8.3e) ---
  searchScopeSchema.parse({
    id: "sponsored-care",
    label: "Sponsored care",
    description: "Search appointments for the people a sponsor supports.",
    resource: "appointment",
    appliesToWorkspaceKinds: ["personal"],
    requiresCapability: "appointment.read",
    requiresFeature: "appointments",
    reach: "care-circle",
    resultClassification: "INTERNAL",
    fields: [
      { name: "sponsoredPerson", match: "text" },
      { name: "scheduledAt", match: "exact", ranked: false }
    ],
    tool: "list-appointments",
    order: 40,
    status: "active"
  }),
  searchScopeSchema.parse({
    id: "pharmacy-prescriptions",
    label: "Prescriptions",
    description: "Search prescriptions presented to this pharmacy.",
    resource: "prescription",
    appliesToWorkspaceKinds: ["organization"],
    requiresCapability: "prescription.read",
    requiresFeature: "pharmacy",
    reach: "organization",
    resultClassification: "PROTECTED-CLINICAL-DATA",
    fields: [
      { name: "prescriptionReference", match: "exact", ranked: false },
      { name: "medicationName", match: "text" }
    ],
    order: 140,
    status: "active"
  }),
  searchScopeSchema.parse({
    id: "lab-orders",
    label: "Laboratory orders",
    description: "Search laboratory orders and results held by this laboratory.",
    resource: "laboratory",
    appliesToWorkspaceKinds: ["organization"],
    requiresCapability: "laboratory.read",
    requiresFeature: "labs",
    reach: "organization",
    resultClassification: "PROTECTED-CLINICAL-DATA",
    fields: [
      { name: "orderReference", match: "exact", ranked: false },
      { name: "testName", match: "text" }
    ],
    order: 150,
    status: "active"
  }),
  searchScopeSchema.parse({
    id: "programme-members-search",
    label: "Programme members",
    description: "Search people enrolled in this sponsored health programme.",
    resource: "program",
    appliesToWorkspaceKinds: ["organization"],
    requiresCapability: "program.administer",
    requiresFeature: "programmes",
    reach: "organization",
    resultClassification: "CONFIDENTIAL",
    fields: [
      { name: "memberReference", match: "exact", ranked: false },
      { name: "enrolmentStatus", match: "exact", ranked: false }
    ],
    order: 160,
    status: "active"
  }),
  searchScopeSchema.parse({
    id: "coverage-search",
    label: "Coverage",
    description: "Search plan coverage and member eligibility.",
    resource: "coverage",
    appliesToWorkspaceKinds: ["organization"],
    requiresCapability: "coverage.read",
    requiresFeature: "coverage",
    reach: "organization",
    resultClassification: "CONFIDENTIAL",
    fields: [
      { name: "planName", match: "text" },
      { name: "memberReference", match: "exact", ranked: false }
    ],
    order: 170,
    status: "active"
  })
] as const;

const SEARCH_SCOPE_IDS = new Set(SEARCH_SCOPES.map((entry) => entry.id));

export function isKnownSearchScope(id: string): boolean {
  return SEARCH_SCOPE_IDS.has(id);
}

export function findSearchScope(id: string): SearchScope | undefined {
  return SEARCH_SCOPES.find((entry) => entry.id === id);
}
