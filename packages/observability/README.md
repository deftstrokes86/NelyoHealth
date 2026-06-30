# @nelyohealth/observability

Observability foundation package for safe logs, traces, and metrics helpers.

## Public API

- Exports `observabilityPackageBoundary` for topology and phase status validation.
- Exports `InMemoryObservabilityRecorder` and telemetry event contracts for synthetic correlation tests.
- Includes attribute redaction safeguards for secret-like and protected payload fragments.

OpenTelemetry exporter wiring and vendor-specific observability backends remain out of scope for this foundation slice.
