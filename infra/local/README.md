# Phase 2 Local Infrastructure Harness

This directory contains the P02-ISS-003 local-only infrastructure harness. It is not production infrastructure, does not deploy anything, and does not create database schemas, migrations, seeds, queues, jobs, buckets, signed URLs, app routes, or product features.

## Services

| Service | Host endpoint | Container target | Purpose |
|---|---|---|---|
| PostgreSQL/PostGIS | `127.0.0.1:55432` | PostgreSQL `5432` | Local database dependency for later P02-ISS-004 work |
| Valkey | `127.0.0.1:56379` | Valkey `6379` | Redis-compatible local cache/queue dependency for later worker work |
| Moto Server | `127.0.0.1:55000` | Moto `5000` | Local S3-compatible object-storage emulator for synthetic tests |
| OpenTelemetry Collector | `127.0.0.1:54317`, `127.0.0.1:54318`, `127.0.0.1:51333` | OTLP gRPC `4317`, OTLP HTTP `4318`, health `13133` | Local observability receiver and debug exporter |

All credentials are synthetic local defaults. They must not be reused as production, development, staging, partner sandbox, or vendor credentials.

## Commands

Run commands through the root package scripts:

```bash
pnpm infra:verify
pnpm infra:doctor
pnpm infra:ports
pnpm infra:start
pnpm infra:health
pnpm infra:stop
pnpm infra:reset
```

`infra:verify` performs static harness checks and does not require Docker. `infra:doctor`, `infra:start`, `infra:health`, `infra:stop`, and `infra:reset` require Docker Compose.

## Port Overrides

Override host ports only for local conflict resolution:

```bash
NELYO_LOCAL_POSTGRES_PORT=55433 pnpm infra:start
```

Available variables:

- `NELYO_LOCAL_POSTGRES_PORT`
- `NELYO_LOCAL_VALKEY_PORT`
- `NELYO_LOCAL_OBJECT_STORAGE_PORT`
- `NELYO_LOCAL_OTEL_GRPC_PORT`
- `NELYO_LOCAL_OTEL_HTTP_PORT`
- `NELYO_LOCAL_OTEL_HEALTH_PORT`

## Cleanup

`pnpm infra:stop` stops containers and leaves named volumes intact for local development. `pnpm infra:reset` removes containers and local named volumes created by this harness.

No production resource cleanup is required because this harness is local-only.
