export const observabilityPackageBoundary = {
  id: "observability",
  packageName: "@nelyohealth/observability",
  kind: "shared-package",
  status: "foundation-implemented",
  owningIssue: "P02-ISS-011",
  publicApi: "Logs, traces, metrics, and safe diagnostics boundary",
  runtimeImplementation: true,
  featureImplementation: false
} as const;

export type ObservabilityPackageBoundary = typeof observabilityPackageBoundary;

export {
  InMemoryObservabilityRecorder,
  type TelemetryContext,
  type TelemetryLogEvent,
  type TelemetryMetricEvent,
  type TelemetrySeverity,
  type TelemetrySnapshot,
  type TelemetrySpanEvent
} from "./telemetry-foundation.js";
