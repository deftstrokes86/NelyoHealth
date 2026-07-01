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

export function createDiagnosticResultDraftDto(
  input: DiagnosticResultDraftRequestDto
): DiagnosticResultDraftDto {
  return {
    diagnosticResultId: input.diagnosticResultId,
    orderId: input.orderId,
    status: input.status,
    summary: input.summary
  };
}
