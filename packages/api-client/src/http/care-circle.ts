/**
 * Care Circle HTTP contract (roadmap M7, exposes ADR-0012/M6.1's read service).
 *
 * Two views: a patient's circle (members) and the caller's own wards. Both carry
 * relationship references + capability labels only — no clinical data. Internal
 * projection fields (organizationRef, verificationMethod, projectedAt/created/
 * updated) are excluded by allowlist construction.
 */
export interface CareCircleMemberDto {
  /** Stable membership reference (the source relationship id). */
  memberRef: string;
  actorRef: string;
  relationshipType: string;
  membershipStatus: string;
  permittedActions: string[];
  effectiveDate: string | null;
  expiryDate: string | null;
}

export interface CareCircleDto {
  members: CareCircleMemberDto[];
}

export interface WardDto {
  patientRef: string;
  relationshipType: string;
  membershipStatus: string;
  permittedActions: string[];
  effectiveDate: string | null;
  expiryDate: string | null;
}

export interface WardsDto {
  wards: WardDto[];
}

export function createCareCircleMemberDto(fields: {
  memberRef: string;
  actorRef: string;
  relationshipType: string;
  membershipStatus: string;
  permittedActions: string[];
  effectiveDate: string | null;
  expiryDate: string | null;
}): CareCircleMemberDto {
  return {
    memberRef: fields.memberRef,
    actorRef: fields.actorRef,
    relationshipType: fields.relationshipType,
    membershipStatus: fields.membershipStatus,
    permittedActions: [...fields.permittedActions],
    effectiveDate: fields.effectiveDate,
    expiryDate: fields.expiryDate
  };
}

export function createWardDto(fields: {
  patientRef: string;
  relationshipType: string;
  membershipStatus: string;
  permittedActions: string[];
  effectiveDate: string | null;
  expiryDate: string | null;
}): WardDto {
  return {
    patientRef: fields.patientRef,
    relationshipType: fields.relationshipType,
    membershipStatus: fields.membershipStatus,
    permittedActions: [...fields.permittedActions],
    effectiveDate: fields.effectiveDate,
    expiryDate: fields.expiryDate
  };
}
