export interface DiagnosticResultDraftDtoLike {
  diagnosticResultId: string;
  orderId: string;
  status: "pending" | "available" | "reviewed";
  summary: string;
}

export interface DiagnosticResultViewModel {
  diagnosticResultId: string;
  orderId: string;
  status: "pending" | "available" | "reviewed";
  summary: string;
}

export function createDiagnosticResultViewModel(
  dto: DiagnosticResultDraftDtoLike
): DiagnosticResultViewModel {
  return {
    diagnosticResultId: dto.diagnosticResultId,
    orderId: dto.orderId,
    status: dto.status,
    summary: dto.summary
  };
}
