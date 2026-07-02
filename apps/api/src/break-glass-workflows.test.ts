import { describe, expect, it } from "vitest";
import {
  BreakGlassExpiredError,
  BreakGlassValidationError,
  BreakGlassWorkflowService,
  InMemoryBreakGlassRepository,
  InMemoryComplianceNotifier
} from "./break-glass-workflows.js";

describe("break-glass operational workflows", () => {
  it("creates request with short-lived expiry and enforces ttl bounds", () => {
    const service = new BreakGlassWorkflowService(
      new InMemoryBreakGlassRepository(),
      new InMemoryComplianceNotifier()
    );

    const access = service.requestAccess({
      accessId: "bg-1",
      actorId: "clinician-1",
      patientId: "patient-1",
      organizationId: "tenant-1",
      reason: "critical deterioration",
      requestedAt: "2026-07-02T12:00:00.000Z",
      ttlMinutes: 10
    });

    expect(access).toMatchObject({
      accessId: "bg-1",
      status: "requested",
      expiresAt: "2026-07-02T12:10:00.000Z"
    });

    expect(() =>
      service.requestAccess({
        accessId: "bg-1-invalid",
        actorId: "clinician-1",
        patientId: "patient-1",
        organizationId: "tenant-1",
        reason: "critical deterioration",
        requestedAt: "2026-07-02T12:00:00.000Z",
        ttlMinutes: 20
      })
    ).toThrowError(BreakGlassValidationError);
  });

  it("notifies compliance immediately on activation", () => {
    const repository = new InMemoryBreakGlassRepository();
    const notifier = new InMemoryComplianceNotifier();
    const service = new BreakGlassWorkflowService(repository, notifier);

    service.requestAccess({
      accessId: "bg-2",
      actorId: "clinician-1",
      patientId: "patient-1",
      organizationId: "tenant-1",
      reason: "critical deterioration",
      requestedAt: "2026-07-02T12:00:00.000Z",
      ttlMinutes: 5
    });

    const active = service.activateAccess({
      accessId: "bg-2",
      activatedAt: "2026-07-02T12:01:00.000Z"
    });

    expect(active).toMatchObject({
      status: "active",
      complianceNotificationId: "compliance-bg-2-2026-07-02T12:01:00.000Z",
      complianceNotifiedAt: "2026-07-02T12:01:00.000Z"
    });
    expect(notifier.notifications).toHaveLength(1);
    expect(notifier.notifications[0]).toMatchObject({
      accessId: "bg-2",
      actorId: "clinician-1",
      patientId: "patient-1"
    });
  });

  it("rejects activation after short-lived expiry", () => {
    const service = new BreakGlassWorkflowService(
      new InMemoryBreakGlassRepository(),
      new InMemoryComplianceNotifier()
    );

    service.requestAccess({
      accessId: "bg-3",
      actorId: "clinician-1",
      patientId: "patient-1",
      organizationId: "tenant-1",
      reason: "critical deterioration",
      requestedAt: "2026-07-02T12:00:00.000Z",
      ttlMinutes: 1
    });

    expect(() =>
      service.activateAccess({
        accessId: "bg-3",
        activatedAt: "2026-07-02T12:02:00.000Z"
      })
    ).toThrowError(BreakGlassExpiredError);

    expect(service.getAccess("bg-3")?.status).toBe("expired");
  });

  it("records post-event review and exposes patient-visible access history", () => {
    const service = new BreakGlassWorkflowService(
      new InMemoryBreakGlassRepository(),
      new InMemoryComplianceNotifier()
    );

    service.requestAccess({
      accessId: "bg-4",
      actorId: "clinician-1",
      patientId: "patient-1",
      organizationId: "tenant-1",
      reason: "critical deterioration",
      requestedAt: "2026-07-02T12:00:00.000Z",
      ttlMinutes: 5
    });
    service.activateAccess({
      accessId: "bg-4",
      activatedAt: "2026-07-02T12:01:00.000Z"
    });

    const reviewed = service.reviewAccess({
      accessId: "bg-4",
      reviewId: "review-bg-4",
      reviewedByActorId: "compliance-1",
      reviewedAt: "2026-07-02T12:30:00.000Z",
      outcome: "approved",
      notes: "validated emergency rationale"
    });

    expect(reviewed).toMatchObject({
      status: "review-completed",
      reviews: [
        {
          reviewId: "review-bg-4",
          outcome: "approved"
        }
      ]
    });

    const patientHistory = service.listPatientVisibleHistory({
      patientId: "patient-1",
      organizationId: "tenant-1"
    });

    expect(patientHistory).toEqual([
      {
        accessId: "bg-4",
        actorId: "clinician-1",
        patientId: "patient-1",
        organizationId: "tenant-1",
        reason: "critical deterioration",
        usedAt: "2026-07-02T12:01:00.000Z",
        expiresAt: "2026-07-02T12:05:00.000Z",
        status: "review-completed",
        reviewOutcome: "approved",
        reviewedAt: "2026-07-02T12:30:00.000Z"
      }
    ]);
  });
});
