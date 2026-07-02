import { describe, expect, it } from "vitest";
import {
  AuditAppendOnlyViolationError,
  AuditEventNotFoundError,
  AuditEventWorkflowService,
  InMemoryAuditEventRepository
} from "./audit-event-workflows.js";

describe("audit event workflows", () => {
  it("captures full audit metadata on append", () => {
    const repository = new InMemoryAuditEventRepository();
    const workflows = new AuditEventWorkflowService(repository);

    const event = workflows.appendEvent({
      eventId: "audit-1",
      actorId: "actor-1",
      subjectId: "patient-1",
      organizationId: "tenant-1",
      action: "read",
      resource: "clinical-record-summary",
      purpose: "care-delivery",
      occurredAt: "2026-07-02T12:00:00.000Z",
      requestId: "req-1",
      ipAddress: "198.51.100.10",
      device: {
        deviceId: "device-1",
        deviceType: "browser",
        userAgent: "SyntheticBrowser/1.0"
      },
      breakGlassUsed: false,
      priorState: {
        consentStatus: "granted"
      },
      newState: {
        decisionStatus: "allowed"
      }
    });

    expect(event).toMatchObject({
      eventId: "audit-1",
      eventVersion: 1,
      appendOnly: true,
      actorId: "actor-1",
      subjectId: "patient-1",
      organizationId: "tenant-1",
      action: "read",
      resource: "clinical-record-summary",
      purpose: "care-delivery",
      occurredAt: "2026-07-02T12:00:00.000Z",
      requestId: "req-1",
      ipAddress: "198.51.100.10",
      device: {
        deviceId: "device-1",
        deviceType: "browser",
        userAgent: "SyntheticBrowser/1.0"
      },
      breakGlassUsed: false,
      priorState: {
        consentStatus: "granted"
      },
      newState: {
        decisionStatus: "allowed"
      }
    });
  });

  it("rejects write-overwrite attempts for existing events", () => {
    const repository = new InMemoryAuditEventRepository();
    const workflows = new AuditEventWorkflowService(repository);

    workflows.appendEvent({
      eventId: "audit-2",
      actorId: "actor-1",
      subjectId: "patient-1",
      organizationId: "tenant-1",
      action: "read",
      resource: "clinical-record-summary",
      purpose: "care-delivery",
      occurredAt: "2026-07-02T12:00:00.000Z",
      requestId: "req-2",
      ipAddress: "198.51.100.11",
      device: {
        deviceId: "device-2",
        deviceType: "browser",
        userAgent: "SyntheticBrowser/1.0"
      },
      breakGlassUsed: false
    });

    expect(() =>
      workflows.appendEvent({
        eventId: "audit-2",
        actorId: "actor-2",
        subjectId: "patient-1",
        organizationId: "tenant-1",
        action: "write",
        resource: "clinical-record-summary",
        purpose: "care-delivery",
        occurredAt: "2026-07-02T12:01:00.000Z",
        requestId: "req-2b",
        ipAddress: "198.51.100.12",
        device: {
          deviceId: "device-2b",
          deviceType: "browser",
          userAgent: "SyntheticBrowser/1.0"
        },
        breakGlassUsed: false
      })
    ).toThrowError(AuditAppendOnlyViolationError);
  });

  it("enforces amendment/versioning instead of edits", () => {
    const repository = new InMemoryAuditEventRepository();
    const workflows = new AuditEventWorkflowService(repository);

    workflows.appendEvent({
      eventId: "audit-3",
      actorId: "actor-1",
      subjectId: "patient-1",
      organizationId: "tenant-1",
      action: "write",
      resource: "clinical-note",
      purpose: "care-delivery",
      occurredAt: "2026-07-02T12:00:00.000Z",
      requestId: "req-3",
      ipAddress: "198.51.100.13",
      device: {
        deviceId: "device-3",
        deviceType: "mobile",
        userAgent: "SyntheticApp/1.0"
      },
      breakGlassUsed: true,
      priorState: {
        noteVersion: 1,
        signed: true
      },
      newState: {
        noteVersion: 1,
        correctionRequested: true
      }
    });

    const amendment = workflows.appendAmendment({
      amendmentEventId: "audit-3-amendment",
      targetEventId: "audit-3",
      actorId: "clinician-1",
      subjectId: "patient-1",
      organizationId: "tenant-1",
      action: "amend",
      resource: "clinical-note",
      purpose: "care-delivery",
      occurredAt: "2026-07-02T12:05:00.000Z",
      requestId: "req-3-amendment",
      ipAddress: "198.51.100.14",
      device: {
        deviceId: "device-4",
        deviceType: "desktop",
        userAgent: "SyntheticDesktop/1.0"
      },
      breakGlassUsed: false,
      priorState: {
        noteVersion: 1,
        signed: true
      },
      newState: {
        noteVersion: 2,
        amendmentApplied: true
      },
      amendmentReason: "post-sign-correction"
    });

    expect(amendment).toMatchObject({
      eventId: "audit-3-amendment",
      eventVersion: 2,
      supersedesEventId: "audit-3",
      amendmentReason: "post-sign-correction",
      priorState: {
        noteVersion: 1,
        signed: true
      },
      newState: {
        noteVersion: 2,
        amendmentApplied: true
      }
    });
  });

  it("rejects amendments when target event does not exist", () => {
    const repository = new InMemoryAuditEventRepository();
    const workflows = new AuditEventWorkflowService(repository);

    expect(() =>
      workflows.appendAmendment({
        amendmentEventId: "audit-missing-amendment",
        targetEventId: "audit-missing",
        actorId: "actor-1",
        subjectId: "patient-1",
        organizationId: "tenant-1",
        action: "amend",
        resource: "clinical-note",
        purpose: "care-delivery",
        occurredAt: "2026-07-02T12:05:00.000Z",
        requestId: "req-missing-amendment",
        ipAddress: "198.51.100.20",
        device: {
          deviceId: "device-5",
          deviceType: "desktop",
          userAgent: "SyntheticDesktop/1.0"
        },
        breakGlassUsed: false,
        priorState: { noteVersion: 1 },
        newState: { noteVersion: 2 },
        amendmentReason: "correction"
      })
    ).toThrowError(AuditEventNotFoundError);
  });

  it("rejects update/delete mutation attempts at the workflow boundary", () => {
    const repository = new InMemoryAuditEventRepository();
    const workflows = new AuditEventWorkflowService(repository);

    expect(() =>
      workflows.rejectMutationAttempt({
        eventId: "audit-4",
        attemptedOperation: "update",
        attemptedAt: "2026-07-02T12:10:00.000Z",
        actorId: "actor-1"
      })
    ).toThrowError(AuditAppendOnlyViolationError);

    expect(() =>
      workflows.rejectMutationAttempt({
        eventId: "audit-4",
        attemptedOperation: "delete",
        attemptedAt: "2026-07-02T12:10:01.000Z",
        actorId: "actor-1"
      })
    ).toThrowError(AuditAppendOnlyViolationError);
  });
});
