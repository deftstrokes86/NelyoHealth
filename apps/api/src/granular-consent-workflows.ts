import {
  createConsentRecordDraft,
  type ConsentDomain,
  type ConsentRecordDraft,
  type ConsentVersionDraft,
  type ConsentVersionStatus
} from "./granular-consent.js";

export interface ConsentRepository {
  save(consent: ConsentRecordDraft): ConsentRecordDraft;
  getById(consentId: string): ConsentRecordDraft | null;
}

export class InMemoryConsentRepository implements ConsentRepository {
  private readonly records = new Map<string, ConsentRecordDraft>();

  save(consent: ConsentRecordDraft): ConsentRecordDraft {
    const copy = createConsentRecordDraft(consent);
    this.records.set(copy.consentId, copy);
    return createConsentRecordDraft(copy);
  }

  getById(consentId: string): ConsentRecordDraft | null {
    const record = this.records.get(consentId);
    return record ? createConsentRecordDraft(record) : null;
  }
}

export interface CreateConsentRecordInput {
  consentId: string;
  patientId: string;
  organizationId: string;
  createdAt: string;
  createdByActorId: string;
  grantedDomains: ConsentDomain[];
  effectiveDate: string;
  expiryDate?: string;
}

export interface SupersedeConsentVersionInput {
  consentId: string;
  expectedCurrentVersion: number;
  createdAt: string;
  createdByActorId: string;
  grantedDomains: ConsentDomain[];
  effectiveDate: string;
  expiryDate?: string;
}

export interface RevokeConsentVersionInput {
  consentId: string;
  targetVersion: number;
  expectedCurrentVersion: number;
  revokedAt: string;
  revokedByActorId: string;
  revocationReason: string;
}

export class ConsentVersionStaleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConsentVersionStaleError";
  }
}

export class GranularConsentWorkflowService {
  constructor(private readonly repository: ConsentRepository) {}

  createConsentRecord(input: CreateConsentRecordInput): ConsentRecordDraft {
    const existing = this.repository.getById(input.consentId);
    if (existing) {
      throw new Error(`Consent already exists: ${input.consentId}`);
    }

    const firstVersion: ConsentVersionDraft = {
      version: 1,
      status: "granted",
      grantedDomains: [...input.grantedDomains],
      effectiveDate: input.effectiveDate,
      expiryDate: input.expiryDate,
      createdAt: input.createdAt,
      createdByActorId: input.createdByActorId
    };

    return this.repository.save({
      consentId: input.consentId,
      patientId: input.patientId,
      organizationId: input.organizationId,
      currentVersion: 1,
      versions: [firstVersion],
      updatedAt: input.createdAt
    });
  }

  supersedeConsentVersion(input: SupersedeConsentVersionInput): ConsentRecordDraft {
    const consent = this.mustGet(input.consentId);
    this.assertCurrentVersion(consent.currentVersion, input.expectedCurrentVersion, input.consentId);

    const nextVersionNumber = consent.currentVersion + 1;
    const supersededVersions = consent.versions.map((version) =>
      version.version === consent.currentVersion
        ? {
            ...version,
            supersededByVersion: nextVersionNumber
          }
        : version
    );

    const nextVersion: ConsentVersionDraft = {
      version: nextVersionNumber,
      status: "granted",
      grantedDomains: [...input.grantedDomains],
      effectiveDate: input.effectiveDate,
      expiryDate: input.expiryDate,
      createdAt: input.createdAt,
      createdByActorId: input.createdByActorId
    };

    return this.repository.save({
      ...consent,
      currentVersion: nextVersionNumber,
      versions: [...supersededVersions, nextVersion],
      updatedAt: input.createdAt
    });
  }

  revokeConsentVersion(input: RevokeConsentVersionInput): ConsentRecordDraft {
    const consent = this.mustGet(input.consentId);
    this.assertCurrentVersion(consent.currentVersion, input.expectedCurrentVersion, input.consentId);

    const nextVersions = consent.versions.map((version) => {
      if (version.version !== input.targetVersion) {
        return version;
      }

      return {
        ...version,
        status: "revoked" as ConsentVersionStatus,
        revokedAt: input.revokedAt,
        revokedByActorId: input.revokedByActorId,
        revocationReason: input.revocationReason
      };
    });

    return this.repository.save({
      ...consent,
      versions: nextVersions,
      updatedAt: input.revokedAt
    });
  }

  getConsentRecord(consentId: string): ConsentRecordDraft | null {
    return this.repository.getById(consentId);
  }

  private mustGet(consentId: string): ConsentRecordDraft {
    const consent = this.repository.getById(consentId);
    if (!consent) {
      throw new Error(`Consent not found: ${consentId}`);
    }

    return consent;
  }

  private assertCurrentVersion(actual: number, expected: number, consentId: string): void {
    if (actual !== expected) {
      throw new ConsentVersionStaleError(
        `Consent version stale for ${consentId}: expected ${expected}, actual ${actual}`
      );
    }
  }
}
