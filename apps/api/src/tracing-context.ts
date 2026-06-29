/**
 * Tracing context for distributed request tracking.
 * Generates and manages traceId and spanId for observability.
 */

export interface TracingContext {
  traceId: string;
  spanId: string;
}

/**
 * Generate a new tracing context with unique IDs.
 * Uses crypto.randomUUID() for trace and span IDs.
 */
export function createTracingContext(): TracingContext {
  return {
    traceId: crypto.randomUUID(),
    spanId: crypto.randomUUID()
  };
}

/**
 * Extract tracing context from request headers.
 * Falls back to generated IDs if headers are missing.
 */
export function extractTracingContext(headers: Record<string, string | undefined>): TracingContext {
  return {
    traceId: headers["x-trace-id"] ?? crypto.randomUUID(),
    spanId: headers["x-span-id"] ?? crypto.randomUUID()
  };
}

/**
 * Create middleware-compatible headers from tracing context.
 * Used to propagate tracing through downstream requests.
 */
export function tracingContextToHeaders(context: TracingContext): Record<string, string> {
  return {
    "x-trace-id": context.traceId,
    "x-span-id": context.spanId
  };
}
