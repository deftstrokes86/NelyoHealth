export interface ApiEnvelope<T> {
  data: T | null;
  meta: {
    requestId: string;
    correlationId: string;
    operationTag?: string;
    decisionReasonTag?: string;
    traceId?: string;
    spanId?: string;
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
  traceId?: string;
  spanId?: string;
}

export interface ErrorEnvelopeInput {
  requestId: string;
  correlationId: string;
  message: string;
  code?: string;
  operationTag?: string;
  decisionReasonTag?: string;
  traceId?: string;
  spanId?: string;
}

export function createApiEnvelope<T>(input: ApiEnvelopeInput<T>): ApiEnvelope<T> {
  return {
    data: input.data,
    meta: {
      requestId: input.requestId,
      correlationId: input.correlationId,
      operationTag: input.operationTag,
      decisionReasonTag: input.decisionReasonTag,
      traceId: input.traceId,
      spanId: input.spanId
    },
    errors: []
  };
}

export function createErrorEnvelope<T = null>(input: ErrorEnvelopeInput): ApiEnvelope<T> {
  return {
    data: null,
    meta: {
      requestId: input.requestId,
      correlationId: input.correlationId,
      operationTag: input.operationTag,
      decisionReasonTag: input.decisionReasonTag,
      traceId: input.traceId,
      spanId: input.spanId
    },
    errors: [
      {
        message: input.message,
        code: input.code
      }
    ]
  } as ApiEnvelope<T>;
}
