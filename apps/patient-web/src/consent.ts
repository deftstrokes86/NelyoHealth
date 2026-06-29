export interface ConsentDraftDtoLike {
  consentId: string;
  subjectId: string;
  grantedTo: string;
  scope: string;
  status: "granted" | "declined" | "withdrawn" | "expired" | "invalidated";
  effectiveAt: string;
  revokedAt: string | null;
}

export interface ConsentViewModel {
  consentId: string;
  subjectId: string;
  grantedTo: string;
  scope: string;
  status: "granted" | "declined" | "withdrawn" | "expired" | "invalidated";
  effectiveAt: string;
  revokedAt: string | null;
}

export function createConsentViewModel(dto: ConsentDraftDtoLike): ConsentViewModel {
  return {
    consentId: dto.consentId,
    subjectId: dto.subjectId,
    grantedTo: dto.grantedTo,
    scope: dto.scope,
    status: dto.status,
    effectiveAt: dto.effectiveAt,
    revokedAt: dto.revokedAt
  };
}
