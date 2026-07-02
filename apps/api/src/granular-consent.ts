export type ConsentDomain =
  | "telemedicine"
  | "provider-data-sharing"
  | "sponsor-participation"
  | "family-participation"
  | "caregiver-participation"
  | "consultation-participants"
  | "recording"
  | "marketing"
  | "research"
  | "cross-border-processing"
  | "emergency-access";

export type ConsentVersionStatus = "granted" | "revoked" | "expired";

export interface ConsentVersionDraft {
  version: number;
  status: ConsentVersionStatus;
  grantedDomains: ConsentDomain[];
  effectiveDate: string;
  expiryDate?: string;
  revokedAt?: string;
  revokedByActorId?: string;
  revocationReason?: string;
  createdAt: string;
  createdByActorId: string;
  supersededByVersion?: number;
}

export interface ConsentRecordDraft {
  consentId: string;
  patientId: string;
  organizationId: string;
  currentVersion: number;
  versions: ConsentVersionDraft[];
  updatedAt: string;
}

export function createConsentRecordDraft(input: ConsentRecordDraft): ConsentRecordDraft {
  return {
    ...input,
    versions: input.versions.map((version) => ({
      ...version,
      grantedDomains: [...version.grantedDomains]
    }))
  };
}
