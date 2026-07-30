export interface ReferralDraftAdvancedDto {
    referralId: string;
    patientId: string;
    referringProviderId: string;
    receivingProviderId: string | null;
    status: "pending" | "sent" | "accepted" | "declined" | "completed" | "cancelled";
    specialty: string;
    reason: string;
    createdAt: string;
    sentAt: string | null;
    respondedAt: string | null;
    completedAt: string | null;
    cancelledAt: string | null;
}
export interface PrescriptionDraftAdvancedDto {
    prescriptionId: string;
    patientId: string;
    providerId: string;
    medicationCode: string;
    medicationName: string;
    dosage: string;
    frequency: string;
    status: "prescribed" | "verified" | "dispensed" | "completed" | "cancelled";
    prescribedAt: string;
    verifiedAt: string | null;
    dispensedAt: string | null;
    completedAt: string | null;
    cancelledAt: string | null;
}
export declare function createReferralDraftAdvancedDto(input: Partial<ReferralDraftAdvancedDto>): ReferralDraftAdvancedDto;
export declare function createPrescriptionDraftAdvancedDto(input: Partial<PrescriptionDraftAdvancedDto>): PrescriptionDraftAdvancedDto;
//# sourceMappingURL=referral-prescription.d.ts.map