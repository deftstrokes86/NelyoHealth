import { describe, expect, it } from "vitest";
import {
  createReferralDraftAdvancedDto,
  createPrescriptionDraftAdvancedDto
} from "./referral-prescription.js";

describe("referral and prescription advanced DTOs", () => {
  it("creates referral DTO with defaults", () => {
    const dto = createReferralDraftAdvancedDto({
      referralId: "ref-dto-1",
      patientId: "patient-1",
      specialty: "cardiology"
    });

    expect(dto.referralId).toBe("ref-dto-1");
    expect(dto.status).toBe("pending");
  });

  it("creates prescription DTO with defaults", () => {
    const dto = createPrescriptionDraftAdvancedDto({
      prescriptionId: "rx-dto-1",
      medicationName: "Amoxicillin"
    });

    expect(dto.prescriptionId).toBe("rx-dto-1");
    expect(dto.status).toBe("prescribed");
  });
});
