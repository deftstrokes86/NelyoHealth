export interface IntakeDraftDto {
    intakeId: string;
    bookingId: string;
    summary: string;
    urgency: "low" | "medium" | "high";
    status: "draft" | "submitted";
}
export interface IntakeDraftRequestDto {
    intakeId: string;
    bookingId: string;
    summary: string;
    urgency: "low" | "medium" | "high";
    status: "draft" | "submitted";
}
export declare function createIntakeDraftDto(input: IntakeDraftRequestDto): IntakeDraftDto;
//# sourceMappingURL=intake.d.ts.map