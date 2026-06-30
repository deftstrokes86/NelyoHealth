import { createHash, randomUUID } from "node:crypto";

export type TelemetrySeverity = "debug" | "info" | "warn" | "error";

export interface TelemetryContext {
  requestId: string;
  correlationId: string;
  traceId: string;
  operationTag: string;
}

export interface TelemetryLogEvent {
  recordedAt: string;
  severity: TelemetrySeverity;
  message: string;
  context: TelemetryContext;
  attributes: Record<string, string | number | boolean>;
}

export interface TelemetryMetricEvent {
  recordedAt: string;
  name: string;
  value: number;
  context: TelemetryContext;
  attributes: Record<string, string | number | boolean>;
}

export interface TelemetrySpanEvent {
  recordedAt: string;
  spanId: string;
  parentSpanId: string | null;
  name: string;
  phase: "start" | "end";
  context: TelemetryContext;
}

export interface TelemetrySnapshot {
  logs: TelemetryLogEvent[];
  metrics: TelemetryMetricEvent[];
  spans: TelemetrySpanEvent[];
}

const forbiddenFragments = [
  "phi",
  "clinical",
  "provideraddress",
  "providernpi",
  "paymentcard",
  "secret",
  "token",
  "password"
] as const;

export class InMemoryObservabilityRecorder {
  private readonly logs: TelemetryLogEvent[] = [];
  private readonly metrics: TelemetryMetricEvent[] = [];
  private readonly spans: TelemetrySpanEvent[] = [];

  createContext(input: {
    requestId: string;
    correlationId: string;
    operationTag: string;
  }): TelemetryContext {
    const traceId = createHash("sha256")
      .update(`${input.correlationId}:${input.requestId}:${input.operationTag}`)
      .digest("hex")
      .slice(0, 32);

    return {
      requestId: input.requestId,
      correlationId: input.correlationId,
      traceId,
      operationTag: input.operationTag
    };
  }

  startSpan(name: string, context: TelemetryContext, parentSpanId: string | null = null): string {
    const spanId = randomUUID();
    this.spans.push({
      recordedAt: new Date().toISOString(),
      spanId,
      parentSpanId,
      name,
      phase: "start",
      context
    });
    return spanId;
  }

  endSpan(name: string, context: TelemetryContext, spanId: string, parentSpanId: string | null = null): void {
    this.spans.push({
      recordedAt: new Date().toISOString(),
      spanId,
      parentSpanId,
      name,
      phase: "end",
      context
    });
  }

  log(
    severity: TelemetrySeverity,
    message: string,
    context: TelemetryContext,
    attributes: Record<string, string | number | boolean> = {}
  ): void {
    this.logs.push({
      recordedAt: new Date().toISOString(),
      severity,
      message,
      context,
      attributes: sanitizeAttributes(attributes)
    });
  }

  metric(
    name: string,
    value: number,
    context: TelemetryContext,
    attributes: Record<string, string | number | boolean> = {}
  ): void {
    this.metrics.push({
      recordedAt: new Date().toISOString(),
      name,
      value,
      context,
      attributes: sanitizeAttributes(attributes)
    });
  }

  snapshot(): TelemetrySnapshot {
    return {
      logs: [...this.logs],
      metrics: [...this.metrics],
      spans: [...this.spans]
    };
  }

  reset(): void {
    this.logs.length = 0;
    this.metrics.length = 0;
    this.spans.length = 0;
  }
}

function sanitizeAttributes(
  attributes: Record<string, string | number | boolean>
): Record<string, string | number | boolean> {
  const sanitized: Record<string, string | number | boolean> = {};

  for (const [key, value] of Object.entries(attributes)) {
    const normalizedKey = key.toLowerCase();
    const normalizedValue = String(value).toLowerCase();
    const isForbidden = forbiddenFragments.some(
      (fragment) => normalizedKey.includes(fragment) || normalizedValue.includes(fragment)
    );

    sanitized[key] = isForbidden ? "[REDACTED]" : value;
  }

  return sanitized;
}
