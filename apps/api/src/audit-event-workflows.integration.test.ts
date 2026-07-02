import { describe, expect, it } from "vitest";
import { evaluateAuthorizationPolicyDecision } from "./authorization-policy-handlers.js";
import {
  AuditAppendOnlyViolationError,
  AuditEventWorkflowService,
  InMemoryAuditEventRepository
} from "./audit-event-workflows.js";

describe("audit event workflow integration", () => {
  it("stores authorization decisions as append-only events with full metadata", () => {
    const repository = new InMemoryAuditEventRepository();
    const workflows = new AuditEventWorkflowService(repository);

    const decision = evaluateAuthorizationPolicyDecision({
      decisionRequestId: "policy-audit-int-1",
      actorId: "actor-1",
      actorRole: "guardian",
      actorType: "guardian",
      organizationId: "tenant-1",
      patientId: "patient-1",
      relationshipType: "guardian",
      relationship: {
        relationshipId: "rel-1",
        relationshipType: "guardian",
        actorId: "actor-1",
        patientId: "patient-1",
        organizationId: "tenant-1",
        lifecycle: {
          status: "active",
          verificationMethod: "legal-document",
          effectiveDate: "2026-01-01T00:00:00.000Z",
          expiryDate: "2027-01-01T00:00:00.000Z",
          permittedActions: ["read"],
          supportingDocuments: [],
          reviewHistory: []
        }
      },
      requestedConsentDomains: ["telemedicine", "provider-data-sharing"],
      consent: {
        consentId: "consent-1",
        patientId: "patient-1",
        organizationId: "tenant-1",
        currentVersion: 1,
        updatedAt: "2026-01-01T00:00:00.000Z",
        versions: [
          {
            version: 1,
            status: "granted",
            grantedDomains: ["telemedicine", "provider-data-sharing"],
            effectiveDate: "2026-01-01T00:00:00.000Z",
            createdAt: "2026-01-01T00:00:00.000Z",
            createdByActorId: "patient-1"
          }
        ]
      },
      requestedResource: "clinical-record-summary",
      requestedAction: "read",
      purpose: "care-delivery",
      consentStatus: "granted",
      relationshipStatus: "active",
      sessionStatus: "active",
      activeEncounter: true,
      emergencyStatus: "none",
      sameTenant: true,
      sponsorPaymentOnly: false,
      requiresRelationship: true,
      breakGlassRequested: false,
      breakGlassReason: undefined,
      breakGlassWindowMinutes: 0,
      impersonationAttempt: false,
      auditEventEditAttempt: false,
      evaluatedAt: "2026-07-02T12:00:00.000Z"
    });

    const stored = workflows.appendEvent({
      eventId: "audit-int-1",
      actorId: "actor-1",
      subjectId: "patient-1",
      organizationId: "tenant-1",
      action: "read",
      resource: "clinical-record-summary",
      purpose: "care-delivery",
      occurredAt: decision.evaluatedAt,
      requestId: decision.decisionRequestId,
      ipAddress: "203.0.113.10",
      device: {
        deviceId: "device-int-1",
        deviceType: "browser",
        userAgent: "SyntheticBrowser/1.0"
      },
      breakGlassUsed: decision.breakGlassActive,
      priorState: {
        policy: "pre-evaluation"
      },
      newState: {
        status: decision.status,
        reasonCode: decision.reasonCode
      }
    });

    expect(stored).toMatchObject({
      eventVersion: 1,
      appendOnly: true,
      requestId: "policy-audit-int-1",
      priorState: {
        policy: "pre-evaluation"
      },
      newState: {
        status: "allowed",
        reasonCode: "allowed"
      }
    });
  });

  it("rejects mutation and requires amendment/versioning for changes", () => {
    const repository = new InMemoryAuditEventRepository();
    const workflows = new AuditEventWorkflowService(repository);

    workflows.appendEvent({
      eventId: "audit-int-2",
      actorId: "actor-1",
      subjectId: "patient-1",
      organizationId: "tenant-1",
      action: "write",
      resource: "clinical-note",
      purpose: "care-delivery",
      occurredAt: "2026-07-02T12:00:00.000Z",
      requestId: "req-int-2",
      ipAddress: "203.0.113.11",
      device: {
        deviceId: "device-int-2",
        deviceType: "browser",
        userAgent: "SyntheticBrowser/1.0"
      },
      breakGlassUsed: false,
      priorState: {
        noteVersion: 1
      },
      newState: {
        noteVersion: 1,
        status: "signed"
      }
    });

    expect(() =>
      workflows.rejectMutationAttempt({
        eventId: "audit-int-2",
        attemptedOperation: "update",
        attemptedAt: "2026-07-02T12:01:00.000Z",
        actorId: "actor-1"
      })
    ).toThrowError(AuditAppendOnlyViolationError);

    const amendment = workflows.appendAmendment({
      amendmentEventId: "audit-int-2-amendment",
      targetEventId: "audit-int-2",
      actorId: "clinician-1",
      subjectId: "patient-1",
      organizationId: "tenant-1",
      action: "amend",
      resource: "clinical-note",
      purpose: "care-delivery",
      occurredAt: "2026-07-02T12:02:00.000Z",
      requestId: "req-int-2-amendment",
      ipAddress: "203.0.113.12",
      device: {
        deviceId: "device-int-3",
        deviceType: "desktop",
        userAgent: "SyntheticDesktop/1.0"
      },
      breakGlassUsed: false,
      priorState: {
        noteVersion: 1,
        status: "signed"
      },
      newState: {
        noteVersion: 2,
        status: "signed-amended"
      },
      amendmentReason: "documentation-correction"
    });

    expect(amendment).toMatchObject({
      eventVersion: 2,
      supersedesEventId: "audit-int-2",
      amendmentReason: "documentation-correction"
    });
  });
});
