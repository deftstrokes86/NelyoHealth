import {
  FORBIDDEN_EVENT_PAYLOAD_KEY_FRAGMENTS,
  strictestClassification,
  type DataClassification
} from "@nelyohealth/domain";

/**
 * Central projection / redaction layer (roadmap M8.1, AM-8).
 *
 * The single place a cross-context read is reduced to a minimum-necessary,
 * classification-checked projection. Redaction was per-handler (provider-disclosure
 * for provider identity/location; the M7 controllers' allowlist DTOs at the edge);
 * this generalizes it: every projected field DECLARES its data classification
 * (docs/data/data-classification.md), and the engine decides — from the reader's
 * obligations (derived from the Acting Context + the PDP decision) — whether that
 * classification may cross the boundary. The pre/post-payment provider rule is the
 * flagship case; the forbidden-fragment key scan is the generalized M7 sentinel.
 */

/** The reader's disclosure obligations for one projection (from Acting Context + PDP). */
export interface ProjectionContext {
  purpose: string;
  /** Authorized for the subject's SENSITIVE-PERSONAL-DATA (identity refs / demographics). */
  identityAuthorized: boolean;
  /** Authorized for the subject's PROTECTED-CLINICAL-DATA. */
  clinicalAuthorized: boolean;
  /** Provider identity/location unlocked (post-payment authorized disclosure). */
  providerDisclosureAuthorized: boolean;
  /** Authorized for PAYMENT-DATA (finance / own-payer scope). */
  financeAuthorized: boolean;
}

/**
 * A field-level allowance that overrides the classification gate. Only the
 * `providerDisplayName` pre-payment allowance exists today (data-classification.md).
 */
export type FieldAllowance = "provider-display-name-pre-payment";

export interface FieldClassification {
  classification: DataClassification | readonly DataClassification[];
  allowance?: FieldAllowance;
}

export type ClassificationEntry =
  | DataClassification
  | readonly DataClassification[]
  | FieldClassification;

/** Every field of the projected shape declares its classification. */
export type ClassificationMap<T> = {
  [K in keyof T]-?: ClassificationEntry;
};

function normalize(entry: ClassificationEntry): FieldClassification {
  if (typeof entry === "string" || Array.isArray(entry)) {
    return { classification: entry as DataClassification | readonly DataClassification[] };
  }
  return entry as FieldClassification;
}

/** Whether a field of a given classification may cross the boundary for this reader. */
export function isFieldPermitted(entry: ClassificationEntry, context: ProjectionContext): boolean {
  const { classification, allowance } = normalize(entry);
  if (allowance === "provider-display-name-pre-payment") {
    return true; // field-level allowance overrides the document-level rule
  }
  const tags = Array.isArray(classification) ? classification : [classification];
  const strictest = strictestClassification(tags);
  switch (strictest) {
    case "PUBLIC":
    case "INTERNAL":
    case "DEIDENTIFIED-OR-AGGREGATED-DATA":
      return true;
    case "SENSITIVE-PERSONAL-DATA":
      return context.identityAuthorized;
    case "PROTECTED-CLINICAL-DATA":
      return context.clinicalAuthorized;
    case "PROVIDER-IDENTITY-LOCATION-DATA":
      return context.providerDisclosureAuthorized;
    case "PAYMENT-DATA":
      return context.financeAuthorized;
    // Never client-facing on these read surfaces (own contexts handle them):
    case "AUTHENTICATION-SECRET":
    case "PROVIDER-CREDENTIAL-DATA":
    case "REGULATORY-EVIDENCE":
    case "CONFIDENTIAL":
    case "SECURITY-OPERATIONAL-DATA":
      return false;
  }
}

function assertNoForbiddenKeys(record: Record<string, unknown>): void {
  for (const key of Object.keys(record)) {
    const normalized = key.toLowerCase();
    for (const fragment of FORBIDDEN_EVENT_PAYLOAD_KEY_FRAGMENTS) {
      if (normalized.includes(fragment)) {
        throw new Error(
          `Projection emitted a forbidden key '${key}' (references-not-bodies rule: '${fragment}').`
        );
      }
    }
  }
}

/**
 * Redact `value` to the fields the reader may see. Iterates the DECLARED map (not the
 * value), so an undeclared field is never emitted (allowlist). Present, permitted
 * fields survive; others are dropped. Safety here is the CLASSIFICATION gate — a
 * legitimately-authorized field (e.g. a post-payment provider address) may be
 * disclosed even though its key name matches an event-forbidden fragment; the
 * key-name scan therefore does NOT apply to this redacting path (see `projectExact`).
 */
export function project<T extends object>(
  value: T,
  map: ClassificationMap<T>,
  context: ProjectionContext
): Partial<T> {
  const source = value as Record<string, unknown>;
  const entries = map as Record<string, ClassificationEntry>;
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(entries)) {
    if (source[key] !== undefined && isFieldPermitted(entries[key], context)) {
      result[key] = source[key];
    }
  }
  return result as Partial<T>;
}

/**
 * Project a REFERENCE-ONLY shape that must be FULLY disclosed to this reader (an
 * authorized M7 read DTO of references/labels — never clinical bodies or protected
 * provider detail). Fails closed if any declared field would be dropped (a
 * classification/authorization mismatch, not a silent leak), and asserts the result
 * carries no forbidden-fragment key — the generalized M7 sentinel. Returns the value
 * unchanged (strongly typed) once verified.
 */
export function projectExact<T extends object>(
  value: T,
  map: ClassificationMap<T>,
  context: ProjectionContext
): T {
  const source = value as Record<string, unknown>;
  const entries = map as Record<string, ClassificationEntry>;
  for (const key of Object.keys(entries)) {
    if (source[key] !== undefined && !isFieldPermitted(entries[key], context)) {
      throw new Error(
        `Projection would drop declared field '${key}' — classification not permitted for this reader.`
      );
    }
  }
  assertNoForbiddenKeys(source);
  return value;
}
