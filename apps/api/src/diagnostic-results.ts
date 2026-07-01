export interface DiagnosticResultDraft {
  diagnosticResultId: string;
  orderId: string;
  status: "pending" | "available" | "reviewed";
  summary: string;
}

export interface DiagnosticResultDraftInput {
  diagnosticResultId: string;
  orderId: string;
  status: "pending" | "available" | "reviewed";
  summary: string;
}

export function createDiagnosticResultDraft(
  input: DiagnosticResultDraftInput
): DiagnosticResultDraft {
  return {
    diagnosticResultId: input.diagnosticResultId,
    orderId: input.orderId,
    status: input.status,
    summary: input.summary
  };
}
