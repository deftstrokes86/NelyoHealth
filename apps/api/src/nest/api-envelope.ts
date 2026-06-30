export interface ApiErrorItem {
  code: string;
  message: string;
  details?: string;
}

export interface ApiMeta {
  requestId: string;
  correlationId: string;
  operationTag: string;
  decisionReasonTag: string;
}

export interface ApiEnvelope<T> {
  data: T | null;
  meta: ApiMeta;
  errors: ApiErrorItem[];
}

export function createMeta(
  requestId: string,
  correlationId: string,
  operationTag: string,
  decisionReasonTag: string
): ApiMeta {
  return {
    requestId,
    correlationId,
    operationTag,
    decisionReasonTag
  };
}
