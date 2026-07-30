export interface DiagnosticResultDraftDto {
    diagnosticResultId: string;
    orderId: string;
    status: "pending" | "available" | "reviewed";
    summary: string;
}
export interface DiagnosticResultDraftRequestDto {
    diagnosticResultId: string;
    orderId: string;
    status: "pending" | "available" | "reviewed";
    summary: string;
}
export declare function createDiagnosticResultDraftDto(input: DiagnosticResultDraftRequestDto): DiagnosticResultDraftDto;
//# sourceMappingURL=diagnostic-results.d.ts.map