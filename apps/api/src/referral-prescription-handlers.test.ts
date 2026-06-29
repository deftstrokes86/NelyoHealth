import { describe, expect, it } from "vitest";
import { createReferralDraftAdvanced } from "./referral-advanced.js";
import { createPrescriptionDraftAdvanced } from "./prescription-advanced.js";
import {
  transitionReferralStatus,
  transitionPrescriptionStatus
} from "./referral-prescription-handlers.js";

describe("referral and prescription handlers", () => {
  it("transitions referral through valid states", () => {
    const referral = createReferralDraftAdvanced({
      referralId: "ref-1",
      patientId: "patient-1",
      referringProviderId: "provider-1",
      receivingProviderId: null,
      status: "pending",
      specialty: "cardiology",
      reason: "Hypertension management",
      createdAt: "2026-07-21T10:00:00.000Z",
      sentAt: null,
      respondedAt: null,
      completedAt: null,
      cancelledAt: null
    });

    const sent = transitionReferralStatus({
      referral,
      toStatus: "sent",
      updatedAt: "2026-07-21T10:05:00.000Z"
    });

    expect(sent.status).toBe("sent");
    expect(sent.sentAt).toBe("2026-07-21T10:05:00.000Z");

    const accepted = transitionReferralStatus({
      referral: sent,
      toStatus: "accepted",
      updatedAt: "2026-07-21T10:10:00.000Z",
      receivingProviderId: "provider-specialist-1"
    });

    expect(accepted.status).toBe("accepted");
    expect(accepted.respondedAt).toBe("2026-07-21T10:10:00.000Z");
    expect(accepted.receivingProviderId).toBe("provider-specialist-1");
  });

  it("rejects invalid referral transitions", () => {
    const referral = createReferralDraftAdvanced({
      referralId: "ref-2",
      patientId: "patient-2",
      referringProviderId: "provider-2",
      receivingProviderId: null,
      status: "pending",
      specialty: "dermatology",
      reason: "Skin condition evaluation",
      createdAt: "2026-07-21T10:00:00.000Z",
      sentAt: null,
      respondedAt: null,
      completedAt: null,
      cancelledAt: null
    });

    expect(() =>
      transitionReferralStatus({
        referral,
        toStatus: "completed",
        updatedAt: "2026-07-21T10:05:00.000Z"
      })
    ).toThrow(/Invalid referral transition/);
  });

  it("transitions prescription through valid states", () => {
    const prescription = createPrescriptionDraftAdvanced({
      prescriptionId: "rx-1",
      patientId: "patient-3",
      providerId: "provider-3",
      medicationCode: "AMOX500",
      medicationName: "Amoxicillin",
      dosage: "500mg",
      frequency: "three times daily",
      status: "prescribed",
      prescribedAt: "2026-07-21T09:00:00.000Z",
      verifiedAt: null,
      dispensedAt: null,
      completedAt: null,
      cancelledAt: null
    });

    const verified = transitionPrescriptionStatus({
      prescription,
      toStatus: "verified",
      updatedAt: "2026-07-21T09:15:00.000Z"
    });

    expect(verified.status).toBe("verified");
    expect(verified.verifiedAt).toBe("2026-07-21T09:15:00.000Z");

    const dispensed = transitionPrescriptionStatus({
      prescription: verified,
      toStatus: "dispensed",
      updatedAt: "2026-07-21T09:20:00.000Z"
    });

    expect(dispensed.status).toBe("dispensed");
    expect(dispensed.dispensedAt).toBe("2026-07-21T09:20:00.000Z");

    const completed = transitionPrescriptionStatus({
      prescription: dispensed,
      toStatus: "completed",
      updatedAt: "2026-07-21T10:00:00.000Z"
    });

    expect(completed.status).toBe("completed");
    expect(completed.completedAt).toBe("2026-07-21T10:00:00.000Z");
  });

  it("rejects invalid prescription transitions", () => {
    const prescription = createPrescriptionDraftAdvanced({
      prescriptionId: "rx-2",
      patientId: "patient-4",
      providerId: "provider-4",
      medicationCode: "IBUP200",
      medicationName: "Ibuprofen",
      dosage: "200mg",
      frequency: "twice daily",
      status: "prescribed",
      prescribedAt: "2026-07-21T09:00:00.000Z",
      verifiedAt: null,
      dispensedAt: null,
      completedAt: null,
      cancelledAt: null
    });

    expect(() =>
      transitionPrescriptionStatus({
        prescription,
        toStatus: "completed",
        updatedAt: "2026-07-21T09:05:00.000Z"
      })
    ).toThrow(/Invalid prescription transition/);
  });
});
