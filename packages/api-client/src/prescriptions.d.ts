export interface PrescriptionDraftDto {
    prescriptionId: string;
    referralId: string;
    medicationName: string;
    dosage: string;
    status: "draft" | "issued" | "cancelled";
}
export interface PrescriptionDraftRequestDto {
    prescriptionId: string;
    referralId: string;
    medicationName: string;
    dosage: string;
    status: "draft" | "issued" | "cancelled";
}
export declare function createPrescriptionDraftDto(input: PrescriptionDraftRequestDto): PrescriptionDraftDto;
//# sourceMappingURL=prescriptions.d.ts.map