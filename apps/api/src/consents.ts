export interface ConsentDraft {
  consentId: string;
  subjectId: string;
  grantedTo: string;
  scope: string;
  status: "granted" | "declined" | "withdrawn" | "expired" | "invalidated";
  effectiveAt: string;
  revokedAt: string | null;
}

export interface ConsentDraftInput {
  consentId: string;
  subjectId: string;
  grantedTo: string;
  scope: string;
  status: "granted" | "declined" | "withdrawn" | "expired" | "invalidated";
  effectiveAt: string;
  revokedAt: string | null;
}

export function createConsentDraft(input: ConsentDraftInput): ConsentDraft {
  return {
    consentId: input.consentId,
    subjectId: input.subjectId,
    grantedTo: input.grantedTo,
    scope: input.scope,
    status: input.status,
    effectiveAt: input.effectiveAt,
    revokedAt: input.revokedAt
  };
}
