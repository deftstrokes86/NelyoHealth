export function createPrescriptionDraftDto(input) {
    return {
        prescriptionId: input.prescriptionId,
        referralId: input.referralId,
        medicationName: input.medicationName,
        dosage: input.dosage,
        status: input.status
    };
}
//# sourceMappingURL=prescriptions.js.map