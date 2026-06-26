export interface ApiEnvelope<T> {
  data: T | null;
  meta: {
    requestId: string;
    correlationId: string;
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
}

export interface ErrorEnvelopeInput {
  requestId: string;
  correlationId: string;
  message: string;
  code?: string;
}

export function createApiEnvelope<T>(input: ApiEnvelopeInput<T>): ApiEnvelope<T> {
  return {
    data: input.data,
    meta: {
      requestId: input.requestId,
      correlationId: input.correlationId
    },
    errors: []
  };
}

export function createErrorEnvelope(input: ErrorEnvelopeInput): ApiEnvelope<null> {
  return {
    data: null,
    meta: {
      requestId: input.requestId,
      correlationId: input.correlationId
    },
    errors: [
      {
        message: input.message,
        code: input.code
      }
    ]
  };
}
