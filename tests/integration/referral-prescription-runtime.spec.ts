import { describe, expect, it } from "vitest";
import { app } from "../../apps/api/src/server.js";
import { createPrescriptionDraftAdvanced } from "../../apps/api/src/prescription-advanced.js";
import { createReferralDraftAdvanced } from "../../apps/api/src/referral-advanced.js";
import {
  handlePrescriptionStatusRoute,
  handleReferralStatusRoute
} from "../../apps/api/src/referral-prescription-routes.js";

describe("referral and prescription runtime flows", () => {
  it("transitions referral status end-to-end and preserves tracing metadata", async () => {
    const referral = createReferralDraftAdvanced({
      referralId: "ref-int-1",
      patientId: "patient-int-1",
      referringProviderId: "provider-a",
      receivingProviderId: null,
      status: "pending",
      specialty: "cardiology",
      reason: "specialist consult",
      createdAt: "2026-07-22T09:00:00.000Z",
      sentAt: null,
      respondedAt: null,
      completedAt: null,
      cancelledAt: null
    });

    const req = new Request("http://localhost/api/referral-status", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-request-id": "req-int-ref-1",
        "x-correlation-id": "corr-int-ref-1",
        "x-trace-id": "trace-int-ref-1",
        "x-span-id": "span-int-ref-1"
      },
      body: JSON.stringify({
        referral,
        toStatus: "sent",
        transitionedAt: "2026-07-22T09:05:00.000Z"
      })
    });

    const res = await app.fetch(req);
    expect(res.status).toBe(200);

    const envelope = await res.json();
    expect(envelope).toMatchObject({
      data: {
        referralId: "ref-int-1",
        status: "sent"
      },
      meta: {
        requestId: "req-int-ref-1",
        correlationId: "corr-int-ref-1",
        traceId: "trace-int-ref-1",
        spanId: "span-int-ref-1",
        operationTag: "referral.status.transition",
        decisionReasonTag: "to:sent"
      },
      errors: []
    });
    expect(envelope.data.createdAt).toBe("2026-07-22T09:00:00.000Z");
  });

  it("transitions prescription status end-to-end and preserves tracing metadata", async () => {
    const prescription = createPrescriptionDraftAdvanced({
      prescriptionId: "rx-int-1",
      patientId: "patient-int-1",
      providerId: "provider-a",
      medicationCode: "MED-001",
      medicationName: "Amoxicillin",
      dosage: "500mg",
      frequency: "bid",
      status: "prescribed",
      prescribedAt: "2026-07-22T09:10:00.000Z",
      verifiedAt: null,
      dispensedAt: null,
      completedAt: null,
      cancelledAt: null
    });

    const req = new Request("http://localhost/api/prescription-status", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-request-id": "req-int-rx-1",
        "x-correlation-id": "corr-int-rx-1",
        "x-trace-id": "trace-int-rx-1",
        "x-span-id": "span-int-rx-1"
      },
      body: JSON.stringify({
        prescription,
        toStatus: "verified",
        transitionedAt: "2026-07-22T09:15:00.000Z"
      })
    });

    const res = await app.fetch(req);
    expect(res.status).toBe(200);

    const envelope = await res.json();
    expect(envelope).toMatchObject({
      data: {
        prescriptionId: "rx-int-1",
        status: "verified"
      },
      meta: {
        requestId: "req-int-rx-1",
        correlationId: "corr-int-rx-1",
        traceId: "trace-int-rx-1",
        spanId: "span-int-rx-1",
        operationTag: "prescription.status.transition",
        decisionReasonTag: "to:verified"
      },
      errors: []
    });
    expect(envelope.data.prescribedAt).toBe("2026-07-22T09:10:00.000Z");
  });

  it("returns deterministic error envelope for invalid referral transition", () => {
    const response = handleReferralStatusRoute({
      requestId: "req-int-ref-err",
      correlationId: "corr-int-ref-err",
      input: {
        referral: createReferralDraftAdvanced({
          referralId: "ref-int-err-1",
          patientId: "patient-int-err-1",
          referringProviderId: "provider-a",
          receivingProviderId: null,
          status: "pending",
          specialty: "cardiology",
          reason: "specialist consult",
          createdAt: "2026-07-22T09:20:00.000Z",
          sentAt: null,
          respondedAt: null,
          completedAt: null,
          cancelledAt: null
        }),
        toStatus: "completed",
        transitionedAt: "2026-07-22T09:21:00.000Z"
      }
    });

    expect(response.data).toBeNull();
    expect(response.errors).toHaveLength(1);
    expect(response.meta).toMatchObject({
      operationTag: "referral.status.transition",
      decisionReasonTag: "transition-denied"
    });
  });

  it("returns deterministic error envelope for invalid prescription transition", () => {
    const response = handlePrescriptionStatusRoute({
      requestId: "req-int-rx-err",
      correlationId: "corr-int-rx-err",
      input: {
        prescription: createPrescriptionDraftAdvanced({
          prescriptionId: "rx-int-err-1",
          patientId: "patient-int-err-1",
          providerId: "provider-a",
          medicationCode: "MED-ERR-1",
          medicationName: "Error Rx",
          dosage: "10mg",
          frequency: "qd",
          status: "prescribed",
          prescribedAt: "2026-07-22T09:22:00.000Z",
          verifiedAt: null,
          dispensedAt: null,
          completedAt: null,
          cancelledAt: null
        }),
        toStatus: "completed",
        transitionedAt: "2026-07-22T09:23:00.000Z"
      }
    });

    expect(response.data).toBeNull();
    expect(response.errors).toHaveLength(1);
    expect(response.meta).toMatchObject({
      operationTag: "prescription.status.transition",
      decisionReasonTag: "transition-denied"
    });
  });
});
