/**
 * Data classification model (roadmap M8.1, from docs/data/data-classification.md).
 *
 * The 12 classification tags every projectable field is labelled with, plus the
 * "strictest applicable rule controls" precedence. This is the domain-pure taxonomy;
 * the projection ENGINE (apps/api/src/projection.ts) decides, per classification and
 * the reader's obligations, whether a field may cross a context boundary. Keeping the
 * taxonomy in @nelyohealth/domain lets events, audit, and HTTP projections share one
 * source of truth for what a field IS.
 */
export const DATA_CLASSIFICATIONS = [
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
] as const;

export type DataClassification = (typeof DATA_CLASSIFICATIONS)[number];

/**
 * Strictness rank (higher = stricter). Encodes "the strictest applicable handling
 * rule controls" so a field carrying multiple tags resolves to the most restrictive.
 * Ordering: public/derived < operational < personal < security/provider < financial <
 * clinical < secret.
 */
const CLASSIFICATION_STRICTNESS: Record<DataClassification, number> = {
  PUBLIC: 0,
  "DEIDENTIFIED-OR-AGGREGATED-DATA": 1,
  INTERNAL: 2,
  CONFIDENTIAL: 3,
  "SENSITIVE-PERSONAL-DATA": 4,
  "SECURITY-OPERATIONAL-DATA": 5,
  "PROVIDER-CREDENTIAL-DATA": 6,
  "PROVIDER-IDENTITY-LOCATION-DATA": 7,
  "REGULATORY-EVIDENCE": 8,
  "PAYMENT-DATA": 9,
  "PROTECTED-CLINICAL-DATA": 10,
  "AUTHENTICATION-SECRET": 11
};

/** The strictest tag among several (field-level tags for one field). */
export function strictestClassification(tags: readonly DataClassification[]): DataClassification {
  if (tags.length === 0) {
    // No tag declared is treated as the strictest — a field must be classified to be
    // disclosed; an unlabelled field is never assumed safe.
    return "AUTHENTICATION-SECRET";
  }
  return tags.reduce((strictest, tag) =>
    CLASSIFICATION_STRICTNESS[tag] > CLASSIFICATION_STRICTNESS[strictest] ? tag : strictest
  );
}
