export interface ApiEnvelope<T> {
  data: T | null;
  meta: {
    requestId: string;
    correlationId: string;
    operationTag?: string;
    decisionReasonTag?: string;
  };
  errors: Array<{
    message: string;
    code?: string;
  }>;
}

export interface ApiEnvelopeInput<T> {
  data: T;
  requestId: string;
  correlationId: string;
  operationTag?: string;
  decisionReasonTag?: string;
}

export interface ErrorEnvelopeInput {
  requestId: string;
  correlationId: string;
  message: string;
  code?: string;
  operationTag?: string;
  decisionReasonTag?: string;
}

export function createApiEnvelope<T>(input: ApiEnvelopeInput<T>): ApiEnvelope<T> {
  return {
    data: input.data,
    meta: {
      requestId: input.requestId,
      correlationId: input.correlationId,
      operationTag: input.operationTag,
      decisionReasonTag: input.decisionReasonTag
    },
    errors: []
  };
}

export function createErrorEnvelope(input: ErrorEnvelopeInput): ApiEnvelope<null> {
  return {
    data: null,
    meta: {
      requestId: input.requestId,
      correlationId: input.correlationId,
      operationTag: input.operationTag,
      decisionReasonTag: input.decisionReasonTag
    },
    errors: [
      {
        message: input.message,
        code: input.code
      }
    ]
  };
}
