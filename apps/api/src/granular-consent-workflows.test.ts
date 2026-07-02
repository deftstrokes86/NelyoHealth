import { describe, expect, it } from "vitest";
import {
  ConsentVersionStaleError,
  GranularConsentWorkflowService,
  InMemoryConsentRepository
} from "./granular-consent-workflows.js";

describe("granular consent workflows", () => {
  it("creates initial granted consent and supersedes to a new version", () => {
    const repository = new InMemoryConsentRepository();
    const workflows = new GranularConsentWorkflowService(repository);

    const created = workflows.createConsentRecord({
      consentId: "consent-ops-1",
      patientId: "patient-1",
      organizationId: "tenant-1",
      createdAt: "2026-01-01T00:00:00.000Z",
      createdByActorId: "patient-1",
      grantedDomains: ["telemedicine", "provider-data-sharing", "research"],
      effectiveDate: "2026-01-01T00:00:00.000Z"
    });

    expect(created.currentVersion).toBe(1);

    const updated = workflows.supersedeConsentVersion({
      consentId: "consent-ops-1",
      expectedCurrentVersion: 1,
      createdAt: "2026-02-01T00:00:00.000Z",
      createdByActorId: "patient-1",
      grantedDomains: ["telemedicine", "provider-data-sharing"],
      effectiveDate: "2026-02-01T00:00:00.000Z"
    });

    expect(updated.currentVersion).toBe(2);
    expect(updated.versions.find((version) => version.version === 1)?.supersededByVersion).toBe(2);
    expect(updated.versions.find((version) => version.version === 2)?.grantedDomains).toEqual([
      "telemedicine",
      "provider-data-sharing"
    ]);
  });

  it("enforces stale-version handling in service flows", () => {
    const repository = new InMemoryConsentRepository();
    const workflows = new GranularConsentWorkflowService(repository);

    workflows.createConsentRecord({
      consentId: "consent-ops-2",
      patientId: "patient-1",
      organizationId: "tenant-1",
      createdAt: "2026-01-01T00:00:00.000Z",
      createdByActorId: "patient-1",
      grantedDomains: ["telemedicine"],
      effectiveDate: "2026-01-01T00:00:00.000Z"
    });

    expect(() =>
      workflows.supersedeConsentVersion({
        consentId: "consent-ops-2",
        expectedCurrentVersion: 99,
        createdAt: "2026-02-01T00:00:00.000Z",
        createdByActorId: "patient-1",
        grantedDomains: ["telemedicine", "research"],
        effectiveDate: "2026-02-01T00:00:00.000Z"
      })
    ).toThrowError(ConsentVersionStaleError);
  });

  it("revokes a target version with current-version guard", () => {
    const repository = new InMemoryConsentRepository();
    const workflows = new GranularConsentWorkflowService(repository);

    workflows.createConsentRecord({
      consentId: "consent-ops-3",
      patientId: "patient-1",
      organizationId: "tenant-1",
      createdAt: "2026-01-01T00:00:00.000Z",
      createdByActorId: "patient-1",
      grantedDomains: ["telemedicine", "provider-data-sharing"],
      effectiveDate: "2026-01-01T00:00:00.000Z"
    });

    const revoked = workflows.revokeConsentVersion({
      consentId: "consent-ops-3",
      targetVersion: 1,
      expectedCurrentVersion: 1,
      revokedAt: "2026-03-01T00:00:00.000Z",
      revokedByActorId: "patient-1",
      revocationReason: "withdrawn"
    });

    expect(revoked.versions.find((version) => version.version === 1)?.status).toBe("revoked");
    expect(revoked.versions.find((version) => version.version === 1)?.revocationReason).toBe(
      "withdrawn"
    );
  });
});
