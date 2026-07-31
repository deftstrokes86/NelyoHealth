import { z } from "zod";
import { dataClassificationSchema } from "./event.js";

/**
 * Integration Registry (roadmap M8.3d).
 *
 * Every boundary at which data leaves or enters the platform, declared as data: the
 * direction, the protocol, the classification of what crosses, whether it crosses a
 * border, and how the counterparty authenticates. Integrations are the other half of the
 * Tool Registry's "one contract, many consumers" claim — a tool is how the platform is
 * driven from inside, an integration is how it meets a system outside.
 *
 * This registry deliberately carries the governance fields the privacy work already
 * requires (`docs/privacy/cross-border-data-register.md`,
 * `docs/privacy/subprocessor-register-draft.md`): declaring an integration without a
 * processor agreement, or with anonymous auth over non-public data, fails the gate. The
 * registry is the machine-readable half of those registers, not a replacement for them.
 *
 * INVARIANT: an entry here is a declared boundary, not a granted one. Credentials,
 * enablement, and the actual egress decision live in configuration and the PDP.
 */
export const integrationDirectionSchema = z.enum(["inbound", "outbound", "bidirectional"]);
export type IntegrationDirection = z.infer<typeof integrationDirectionSchema>;

export const integrationProtocolSchema = z.enum([
  "rest",
  "webhook",
  "fhir",
  "hl7v2",
  "sftp",
  "smtp",
  "sms",
  "file"
]);
export type IntegrationProtocol = z.infer<typeof integrationProtocolSchema>;

export const integrationAuthSchema = z.enum([
  "oauth2",
  "api-key",
  "mtls",
  "signed-webhook",
  "none"
]);
export type IntegrationAuth = z.infer<typeof integrationAuthSchema>;

export const integrationSchema = z
  .object({
    id: z.string().regex(/^[a-z][a-z0-9-]*$/),
    label: z.string().min(1),
    description: z.string().min(1),
    direction: integrationDirectionSchema,
    protocol: integrationProtocolSchema,
    /** Counterparty category — who is on the other side. */
    counterparty: z.enum([
      "payment-provider",
      "communications-provider",
      "payer",
      "laboratory",
      "pharmacy",
      "identity-provider",
      "regulator",
      "internal"
    ]),
    /** The highest classification of data crossing this boundary. */
    classification: dataClassificationSchema,
    /** Data leaves the jurisdiction (cross-border register applies). */
    crossBorder: z.boolean().default(false),
    auth: integrationAuthSchema,
    /** A data-processing agreement is in place with the counterparty. */
    processorAgreement: z.boolean().default(false),
    /** Capability ref an actor needs to administer this integration. */
    requiresCapability: z.string().nullable().default(null),
    /** Event Registry refs this integration produces / consumes. */
    events: z
      .object({
        produces: z.array(z.string()).default([]),
        consumes: z.array(z.string()).default([])
      })
      .default({ produces: [], consumes: [] }),
    status: z.enum(["active", "beta", "planned", "deprecated"]).default("planned"),
    metadata: z.record(z.string(), z.unknown()).default({})
  })
  .superRefine((integration, ctx) => {
    if (integration.classification !== "PUBLIC" && integration.auth === "none") {
      ctx.addIssue({
        code: "custom",
        path: ["auth"],
        message: `an integration carrying '${integration.classification}' may not be unauthenticated`
      });
    }
    // Anything that is not public and leaves the platform needs a processor agreement;
    // crossing a border makes that non-negotiable.
    const outbound = integration.direction !== "inbound";
    if (
      integration.classification !== "PUBLIC" &&
      (outbound || integration.crossBorder) &&
      !integration.processorAgreement
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["processorAgreement"],
        message:
          "a non-public integration that sends data (or crosses a border) requires a processor agreement"
      });
    }
  });
export type Integration = z.infer<typeof integrationSchema>;

export const INTEGRATIONS: readonly Integration[] = [
  integrationSchema.parse({
    id: "payment-gateway",
    label: "Payment gateway",
    description: "Card and transfer collection for consultations, orders, and plans.",
    direction: "bidirectional",
    protocol: "rest",
    counterparty: "payment-provider",
    classification: "PAYMENT-DATA",
    auth: "oauth2",
    processorAgreement: true,
    requiresCapability: "organization.administer",
    status: "planned"
  }),
  integrationSchema.parse({
    id: "payment-webhook",
    label: "Payment status callback",
    description: "Signed callbacks confirming settlement or failure of a payment intent.",
    direction: "inbound",
    protocol: "webhook",
    counterparty: "payment-provider",
    classification: "PAYMENT-DATA",
    auth: "signed-webhook",
    processorAgreement: true,
    status: "planned"
  }),
  integrationSchema.parse({
    id: "sms-gateway",
    label: "SMS gateway",
    description:
      "Outbound SMS notifications. References only — no clinical content leaves in the message body.",
    direction: "outbound",
    protocol: "sms",
    counterparty: "communications-provider",
    classification: "INTERNAL",
    auth: "api-key",
    processorAgreement: true,
    status: "planned"
  }),
  integrationSchema.parse({
    id: "email-gateway",
    label: "Email gateway",
    description: "Outbound transactional email. References only, never clinical content.",
    direction: "outbound",
    protocol: "smtp",
    counterparty: "communications-provider",
    classification: "INTERNAL",
    auth: "api-key",
    processorAgreement: true,
    status: "planned"
  }),
  integrationSchema.parse({
    id: "identity-verification",
    label: "Identity verification",
    description: "National identity verification for a person or a practitioner.",
    direction: "outbound",
    protocol: "rest",
    counterparty: "identity-provider",
    classification: "SENSITIVE-PERSONAL-DATA",
    auth: "oauth2",
    processorAgreement: true,
    status: "planned"
  }),
  integrationSchema.parse({
    id: "hmo-eligibility",
    label: "HMO eligibility and claims",
    description: "Coverage checks and claim submission with a payer. Payer/clinical split applies.",
    direction: "bidirectional",
    protocol: "rest",
    counterparty: "payer",
    classification: "CONFIDENTIAL",
    auth: "mtls",
    processorAgreement: true,
    requiresCapability: "organization.administer",
    status: "planned"
  }),
  integrationSchema.parse({
    id: "laboratory-results",
    label: "Laboratory results feed",
    description: "Inbound diagnostic results from a laboratory information system.",
    direction: "inbound",
    protocol: "hl7v2",
    counterparty: "laboratory",
    classification: "PROTECTED-CLINICAL-DATA",
    auth: "mtls",
    processorAgreement: true,
    events: { produces: ["LabResultRecorded"] },
    status: "planned"
  }),
  integrationSchema.parse({
    id: "pharmacy-dispensing",
    label: "Pharmacy dispensing feed",
    description: "Dispensing confirmations from a pharmacy management system.",
    direction: "inbound",
    protocol: "rest",
    counterparty: "pharmacy",
    classification: "PROTECTED-CLINICAL-DATA",
    auth: "mtls",
    processorAgreement: true,
    events: { produces: ["PrescriptionDispensed"] },
    status: "planned"
  }),
  integrationSchema.parse({
    id: "clinical-record-exchange",
    label: "Clinical record exchange",
    description: "FHIR exchange of clinical records with an external care provider.",
    direction: "bidirectional",
    protocol: "fhir",
    counterparty: "laboratory",
    classification: "PROTECTED-CLINICAL-DATA",
    auth: "mtls",
    processorAgreement: true,
    requiresCapability: "clinical-record.read",
    status: "planned"
  })
] as const;

const INTEGRATION_IDS = new Set(INTEGRATIONS.map((entry) => entry.id));

export function isKnownIntegration(id: string): boolean {
  return INTEGRATION_IDS.has(id);
}

export function findIntegration(id: string): Integration | undefined {
  return INTEGRATIONS.find((entry) => entry.id === id);
}
