# ADR-P02-006: Observability and Error Reporting Boundary

## Status

ACCEPTED-FOR-PHASE-2-OBSERVABILITY-FOUNDATION; ERROR-REPORTING-VENDOR-DEFERRED; IMPLEMENTATION-PENDING

## Date

2026-06-25

## Decision owners

Engineering/security owner, privacy owner, platform/operations owner, and QA owner. Error-reporting vendor selection requires security, privacy, legal/commercial, and operations review.

## Context

Phase 2 requires logs, metrics, and traces that connect one API request across API and worker. ADR-0010 prohibits production PHI in product analytics or session replay. ADR-0005 requires adapter boundaries and explicit cross-context events/commands.

P02-ISS-001 records the observability/error boundary only. P02-ISS-011 owns implementation.

## Decision

Phase 2 will use OpenTelemetry for traces and metrics, Pino for structured logs, and a repository-owned error-reporting port.

No hosted error-reporting vendor is selected in P02-ISS-001.

OpenTelemetry automatic all-in-one instrumentation is not selected by default. Later implementation should install only explicit instrumentation packages needed for API, worker, PostgreSQL, Redis-compatible queue, and structured logging.

Exact future package pins are:

| Package | Version | Purpose |
|---|---:|---|
| `@opentelemetry/api` | 1.9.1 | Stable OpenTelemetry API |
| `@opentelemetry/sdk-node` | 0.219.0 | Node SDK |
| `@opentelemetry/exporter-trace-otlp-http` | 0.219.0 | Trace export |
| `@opentelemetry/exporter-metrics-otlp-http` | 0.219.0 | Metrics export |
| `@opentelemetry/exporter-logs-otlp-http` | 0.219.0 | Logs export if used |
| `@opentelemetry/instrumentation-http` | 0.219.0 | HTTP instrumentation |
| `@opentelemetry/instrumentation-express` | 0.67.0 | Express instrumentation |
| `@opentelemetry/instrumentation-nestjs-core` | 0.65.0 | Nest instrumentation |
| `@opentelemetry/instrumentation-pg` | 0.71.0 | PostgreSQL instrumentation |
| `@opentelemetry/instrumentation-ioredis` | 0.67.0 | Redis-compatible instrumentation |
| `@opentelemetry/instrumentation-pino` | 0.65.0 | Structured log instrumentation |
| `pino` | 10.3.1 | Structured JSON logging |

## Required observability rules

- Every API request and worker job must carry correlation ID.
- Logs, traces, metrics, and error reports must redact secrets and sensitive payloads.
- Protected provider details, PHI, payment credentials, auth secrets, raw clinical documents, and real user data must not enter general telemetry.
- Exporter failure must not silently drop required readiness evidence; local console/noop behavior must be explicit.
- Vendor SDK types must stay behind an error-reporting adapter or observability package boundary.

## Alternatives considered

| Alternative | Decision |
|---|---|
| Hosted error-reporting SDK now | Deferred pending security/privacy/commercial review. |
| `@opentelemetry/auto-instrumentations-node` default | Rejected as default due broad instrumentation and transitive surface. |
| Console logs only | Rejected for final Phase 2 because exit gates require cross API/worker trace/log/metric evidence. |
| Product analytics/session replay for diagnostics | Rejected by ADR-0010 and locked privacy rules. |

## Consequences

- P02-ISS-011 can implement an observability package without selecting a vendor.
- P02-ISS-015 can type environment variables for exporter configuration without real secrets.
- Error-reporting integration remains a port and local fake/noop until a vendor is approved.

## Security and privacy implications

Telemetry is treated as sensitive. Logs, metrics, traces, errors, screenshots, traces, browser artifacts, and queue payload diagnostics must be scanned and minimized.

## Implementation implications

Implementation is pending P02-ISS-011 and P02-ISS-015. This ADR creates no observability package, exporter config, environment variable, app instrumentation, or error-reporting SDK integration.

## Test implications

P02-ISS-011 must prove request-to-worker correlation, safe log payloads, metric emission, trace propagation, and exporter failure behavior with synthetic data.

## Review triggers

Review before hosted observability backend selection, error-reporting vendor selection, telemetry payload expansion, OpenTelemetry upgrade, logger replacement, production telemetry export, session replay proposal, or analytics vendor selection.

## Supersession rule

This ADR may be superseded only by a later ADR that preserves ADR-0010, PHI exclusion, provider-detail protection, telemetry minimization, and adapter boundaries.

