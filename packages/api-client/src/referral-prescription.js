export function createReferralDraftAdvancedDto(input) {
    return {
        referralId: input.referralId ?? "",
        patientId: input.patientId ?? "",
        referringProviderId: input.referringProviderId ?? "",
        receivingProviderId: input.receivingProviderId ?? null,
        status: input.status ?? "pending",
        specialty: input.specialty ?? "",
        reason: input.reason ?? "",
        createdAt: input.createdAt ?? "",
        sentAt: input.sentAt ?? null,
        respondedAt: input.respondedAt ?? null,
        completedAt: input.completedAt ?? null,
        cancelledAt: input.cancelledAt ?? null
    };
}
export function createPrescriptionDraftAdvancedDto(input) {
    return {
        prescriptionId: input.prescriptionId ?? "",
        patientId: input.patientId ?? "",
        providerId: input.providerId ?? "",
        medicationCode: input.medicationCode ?? "",
        medicationName: input.medicationName ?? "",
        dosage: input.dosage ?? "",
        frequency: input.frequency ?? "",
        status: input.status ?? "prescribed",
        prescribedAt: input.prescribedAt ?? "",
        verifiedAt: input.verifiedAt ?? null,
        dispensedAt: input.dispensedAt ?? null,
        completedAt: input.completedAt ?? null,
        cancelledAt: input.cancelledAt ?? null
    };
}
//# sourceMappingURL=referral-prescription.js.map