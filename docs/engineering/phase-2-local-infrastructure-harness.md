# Phase 2 Local Infrastructure Harness

## Status

P02-ISS-003 implemented a static local infrastructure harness and scripts. Live runtime evidence has been validated on a Docker Compose-capable host.

## Scope

The harness is local-only and synthetic-only. It does not create schemas, migrations, seed data, queues, jobs, buckets, signed URLs, app routes, deployment workflows, cloud resources, production secrets, or product features.

## Service Matrix

| Service | Local image pin | Host port | Health path | Licence posture | Notes |
|---|---|---:|---|---|---|
| PostgreSQL/PostGIS | `postgis/postgis:18-3.6-alpine@sha256:24047f97be7cf496a6e41a40a236f489fc4ac9caf26794f0882461f5bb6cd758` | 55432 | TCP plus PostGIS control-file check in Compose | PostgreSQL/PostGIS open-source stack; PostGIS GPL family review noted | P02-ISS-004 owns schemas, migrations, seeds, and operational database commands |
| Valkey | `valkey/valkey:8.1.8-alpine@sha256:77643d152547b446fc15cbafaff22004545663fcd40c6b28038ad283837baa75` | 56379 | TCP and `valkey-cli ping` in Compose | BSD-3-Clause | Redis-compatible local path; Redis OSS 8 production reliance remains review-required |
| Moto Server | `motoserver/moto:5.2.2@sha256:d8ae5edc2bf080e7e4c13f9bd4b29b53ac3b4427e92956318db3dbe23ec43eb7` | 55000 | `/moto-api/` | Apache-2.0 | Local S3-compatible emulator only; not a production object-storage provider |
| OpenTelemetry Collector Contrib | `otel/opentelemetry-collector-contrib:0.155.0@sha256:4935caa35e9a4cb387e35732e8fb22b2b5759af8d12e7043357f03837f6e8df5` | 54317, 54318, 51333 | Collector health extension on 51333 | Apache-2.0 | Local OTLP receiver and debug exporter only; hosted backend deferred |

## Primary-Source Verification

Checked on 2026-06-25:

| Component | Source | Evidence used |
|---|---|---|
| Docker Compose health/dependency behavior | https://docs.docker.com/reference/compose-file/services/ and https://docs.docker.com/compose/how-tos/startup-order/ | Compose supports service health checks and local dependency ordering. |
| PostgreSQL | https://www.postgresql.org/support/versioning/ and https://www.postgresql.org/docs/release/18.4/ | PostgreSQL 18 current supported minor is 18.4. |
| PostGIS | https://postgis.net/docs/release_notes.html and https://github.com/postgis/docker-postgis | PostGIS 3.6.4 is current in the 3.6 line; docker-postgis provides PostgreSQL 18/PostGIS 3.6 Alpine image source. |
| Valkey | https://valkey.io/download/ and https://github.com/valkey-io/valkey-container | Valkey 8.1.8 is the current supported 8.x release and `valkey/valkey:8.1.8-alpine` is a published tag. |
| Moto Server | https://docs.getmoto.org/en/stable/docs/server_mode.html and https://github.com/getmoto/moto | Moto has standalone server mode and Apache-2.0 licence; Docker Hub metadata confirmed `motoserver/moto:5.2.2`. |
| OpenTelemetry Collector | https://opentelemetry.io/docs/collector/install/ and https://github.com/open-telemetry/opentelemetry-collector-releases/releases | Collector deployments are supported by the project; Docker Hub metadata confirmed `otel/opentelemetry-collector-contrib:0.155.0`. |

Image tag metadata was checked through Docker Hub registry metadata for exact tags and digest pins.

## Local Commands

```bash
pnpm infra:verify
pnpm infra:doctor
pnpm infra:ports
pnpm infra:start
pnpm infra:health
pnpm infra:stop
pnpm infra:reset
```

`infra:verify` is static and does not require Docker. The remaining commands require Docker Compose and have been validated on the current host.

## Runtime Validation

The local validation host now provides Docker and Docker Compose. Live start/stop/healthcheck evidence completed successfully with the validated image pins and service health checks.

## Safety Controls

- All host bindings use `127.0.0.1`.
- No floating image tag is used.
- Every service image is tag and digest pinned.
- Defaults are synthetic local values.
- No auth token, cloud credential, production origin, deployment command, schema, migration, seed, or product data is included.
- `infra:ports` refuses to start over occupied local ports.
- `infra:reset` removes local named volumes created by the harness.

## Completion Evidence

- `pnpm infra:verify` passed.
- `pnpm infra:doctor` passed and reported Docker / Docker Compose availability.
- `pnpm infra:start` passed and the stack became healthy.
- `pnpm infra:health` reported all services healthy.
- `pnpm infra:stop` passed and removed the local stack cleanly.
