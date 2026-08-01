import { z } from "zod";
import { capabilityDomainSchema } from "./capability.js";
import { dataClassificationSchema } from "./event.js";
import { workspaceKindSchema } from "./workspace.js";

/**
 * Report Registry (roadmap M8.3d).
 *
 * A report is a declared read over the event stream — the M6 projection pattern given a
 * catalogue. Each entry states its source events, dimensions and measures, delivery, and
 * the two things that decide whether it is lawful to produce: its **aggregation** and its
 * **classification**.
 *
 * ADR-0010 (no production PHI in product analytics) is enforced structurally here rather
 * than left to reviewer discipline: an `analytics` report MUST be aggregated or
 * de-identified and MUST carry `DEIDENTIFIED-OR-AGGREGATED-DATA`, and the validation gate
 * additionally refuses any analytics report sourced from an event the Event Registry has
 * not marked `analyticsVisible`. A row-level clinical report is still expressible — as an
 * `operational` or `clinical` report, where it is visible for what it is.
 *
 * INVARIANT: composition, never authorization. A report surviving the filter does not
 * grant its data; the PDP authorizes the run and the projection layer redacts the output.
 */
export const reportKindSchema = z.enum(["operational", "clinical", "regulatory", "analytics"]);
export type ReportKind = z.infer<typeof reportKindSchema>;

export const reportAggregationSchema = z.enum(["row-level", "aggregated", "de-identified"]);
export type ReportAggregation = z.infer<typeof reportAggregationSchema>;

export const reportSchema = z
  .object({
    id: z.string().regex(/^[a-z][a-z0-9-]*$/),
    label: z.string().min(1),
    description: z.string().min(1),
    kind: reportKindSchema,
    domain: capabilityDomainSchema,
    appliesToWorkspaceKinds: z.array(workspaceKindSchema).min(1),
    /** Capability ref required to compose this report (declaration; the PDP decides). */
    requiresCapability: z.string().nullable().default(null),
    /** Feature Registry ref that must be available to the workspace. */
    requiresFeature: z.string().nullable().default(null),
    aggregation: reportAggregationSchema,
    classification: dataClassificationSchema,
    /** Event Registry refs this report is projected from. */
    sourceEvents: z.array(z.string()).min(1),
    dimensions: z.array(z.string()).default([]),
    measures: z.array(z.string()).default([]),
    schedule: z.enum(["on-demand", "daily", "weekly", "monthly"]).default("on-demand"),
    delivery: z.array(z.enum(["in-app", "email", "export"])).min(1),
    retention: z.enum(["transient", "standard", "extended", "regulatory"]).default("standard"),
    order: z.number().int().default(0),
    status: z.enum(["active", "beta", "planned"]).default("planned"),
    metadata: z.record(z.string(), z.unknown()).default({})
  })
  .superRefine((report, ctx) => {
    if (report.kind !== "analytics") return;
    // ADR-0010: product analytics never carries production PHI.
    if (report.aggregation === "row-level") {
      ctx.addIssue({
        code: "custom",
        path: ["aggregation"],
        message: "an analytics report may not be row-level (ADR-0010)"
      });
    }
    if (report.classification !== "DEIDENTIFIED-OR-AGGREGATED-DATA") {
      ctx.addIssue({
        code: "custom",
        path: ["classification"],
        message: `an analytics report must be classified DEIDENTIFIED-OR-AGGREGATED-DATA, not '${report.classification}' (ADR-0010)`
      });
    }
  });
export type Report = z.infer<typeof reportSchema>;

export const REPORTS: readonly Report[] = [
  reportSchema.parse({
    id: "my-care-summary",
    label: "My care summary",
    description: "A person's own appointments and care activity over a period.",
    kind: "operational",
    domain: "care-coordination",
    appliesToWorkspaceKinds: ["personal"],
    requiresCapability: "timeline.read",
    aggregation: "row-level",
    classification: "SENSITIVE-PERSONAL-DATA",
    sourceEvents: ["AppointmentBooked", "AppointmentCancelled", "ConsultationCompleted"],
    dimensions: ["period", "provider"],
    measures: ["appointmentCount", "consultationCount"],
    delivery: ["in-app", "export"],
    order: 10,
    status: "active"
  }),
  reportSchema.parse({
    id: "clinic-activity",
    label: "Clinic activity",
    description: "Appointment and consultation volume for the organization.",
    kind: "operational",
    domain: "administrative",
    appliesToWorkspaceKinds: ["organization"],
    requiresCapability: "organization.administer",
    requiresFeature: "appointments",
    aggregation: "aggregated",
    classification: "INTERNAL",
    sourceEvents: ["AppointmentBooked", "AppointmentCancelled", "ConsultationCompleted"],
    dimensions: ["period", "facility", "clinician"],
    measures: ["booked", "cancelled", "completed"],
    schedule: "weekly",
    delivery: ["in-app", "email", "export"],
    order: 10,
    status: "active"
  }),
  reportSchema.parse({
    id: "schedule-utilisation",
    label: "Schedule utilisation",
    description: "Published availability against booked demand.",
    kind: "operational",
    domain: "administrative",
    appliesToWorkspaceKinds: ["organization"],
    requiresCapability: "availability-slot.open",
    requiresFeature: "appointments",
    aggregation: "aggregated",
    classification: "INTERNAL",
    sourceEvents: ["AppointmentBooked", "AppointmentCancelled", "AppointmentRescheduled"],
    dimensions: ["period", "clinician"],
    measures: ["slotsOpened", "slotsFilled", "utilisationRate"],
    schedule: "weekly",
    delivery: ["in-app", "export"],
    order: 20,
    status: "active"
  }),
  reportSchema.parse({
    id: "my-clinic-day",
    label: "My clinic day",
    description: "A clinician's own scheduled and completed workload.",
    kind: "clinical",
    domain: "clinical",
    appliesToWorkspaceKinds: ["organization"],
    requiresCapability: "consultation.conduct",
    requiresFeature: "consultations",
    aggregation: "row-level",
    classification: "PROTECTED-CLINICAL-DATA",
    sourceEvents: ["AppointmentBooked", "ConsultationCompleted"],
    dimensions: ["day"],
    measures: ["scheduled", "completed"],
    schedule: "daily",
    delivery: ["in-app"],
    order: 30,
    status: "active"
  }),
  reportSchema.parse({
    id: "consent-evidence",
    label: "Consent evidence",
    description: "Consent grants and withdrawals held as regulatory evidence.",
    kind: "regulatory",
    domain: "identity",
    appliesToWorkspaceKinds: ["organization"],
    requiresCapability: "organization.administer",
    aggregation: "row-level",
    classification: "REGULATORY-EVIDENCE",
    sourceEvents: ["ConsentGranted", "ConsentWithdrawn"],
    dimensions: ["period", "consentDomain"],
    measures: ["granted", "withdrawn"],
    schedule: "monthly",
    delivery: ["export"],
    retention: "regulatory",
    order: 40,
    status: "active"
  }),
  reportSchema.parse({
    id: "platform-demand-trends",
    label: "Demand trends",
    description:
      "De-identified appointment demand trends for platform planning. Carries no production PHI (ADR-0010).",
    kind: "analytics",
    domain: "analytics",
    appliesToWorkspaceKinds: ["organization"],
    requiresCapability: "organization.administer",
    aggregation: "de-identified",
    classification: "DEIDENTIFIED-OR-AGGREGATED-DATA",
    sourceEvents: ["AppointmentBooked", "AppointmentCancelled", "AppointmentRescheduled"],
    dimensions: ["period", "serviceArea"],
    measures: ["demandIndex", "cancellationRate"],
    schedule: "monthly",
    delivery: ["in-app", "export"],
    order: 50,
    status: "planned"
  }),

  // --- Diaspora + organization-type reports (M8.3e) ---
  reportSchema.parse({
    id: "sponsorship-statement",
    label: "Sponsorship statement",
    description: "What a sponsor funded, for whom, over a period. Financial, never clinical.",
    kind: "operational",
    domain: "finance",
    appliesToWorkspaceKinds: ["personal"],
    requiresCapability: "sponsorship.read",
    requiresFeature: "diaspora-sponsorship",
    aggregation: "row-level",
    classification: "PAYMENT-DATA",
    sourceEvents: ["CareSponsorshipFunded"],
    dimensions: ["period", "sponsoredPerson"],
    measures: ["amountFunded", "careEventsCovered"],
    schedule: "monthly",
    delivery: ["in-app", "export"],
    retention: "extended",
    order: 60,
    status: "active"
  }),
  reportSchema.parse({
    id: "dispensing-activity",
    label: "Dispensing activity",
    description: "Dispensing volume for the pharmacy over a period.",
    kind: "operational",
    domain: "clinical",
    appliesToWorkspaceKinds: ["organization"],
    requiresCapability: "prescription.dispense",
    requiresFeature: "pharmacy",
    aggregation: "aggregated",
    classification: "INTERNAL",
    sourceEvents: ["PrescriptionDispensed"],
    dimensions: ["period"],
    measures: ["dispensed"],
    schedule: "weekly",
    delivery: ["in-app", "export"],
    order: 70,
    status: "active"
  }),
  reportSchema.parse({
    id: "lab-turnaround",
    label: "Result turnaround",
    description: "Time from specimen receipt to result for the laboratory.",
    kind: "operational",
    domain: "clinical",
    appliesToWorkspaceKinds: ["organization"],
    requiresCapability: "laboratory.read",
    requiresFeature: "labs",
    aggregation: "aggregated",
    classification: "INTERNAL",
    sourceEvents: ["LabResultRecorded"],
    dimensions: ["period", "testName"],
    measures: ["medianTurnaroundHours", "resultsRecorded"],
    schedule: "weekly",
    delivery: ["in-app", "export"],
    order: 80,
    status: "active"
  }),
  reportSchema.parse({
    id: "programme-population-health",
    label: "Programme population health",
    description:
      "De-identified population health reporting for a sponsored programme. Carries no production PHI (ADR-0010).",
    kind: "analytics",
    domain: "analytics",
    appliesToWorkspaceKinds: ["organization"],
    requiresCapability: "population-health.read",
    requiresFeature: "programmes",
    aggregation: "de-identified",
    classification: "DEIDENTIFIED-OR-AGGREGATED-DATA",
    sourceEvents: ["AppointmentBooked", "AppointmentCancelled", "CareSponsorshipFunded"],
    dimensions: ["period", "serviceArea"],
    measures: ["utilisationIndex", "accessIndex"],
    schedule: "monthly",
    delivery: ["in-app", "export"],
    order: 90,
    status: "active"
  })
] as const;

const REPORT_IDS = new Set(REPORTS.map((entry) => entry.id));

export function isKnownReport(id: string): boolean {
  return REPORT_IDS.has(id);
}

export function findReport(id: string): Report | undefined {
  return REPORTS.find((entry) => entry.id === id);
}
