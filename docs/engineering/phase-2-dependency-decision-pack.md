# Phase 2 Dependency Decision Pack

## Status

P02-ISS-001 dependency decision evidence. No dependency is installed by this document.

## Evidence date

2026-06-25.

## Runtime baseline

| Runtime/tool | Repository pin | Local evidence | Decision |
|---|---:|---|---|
| Node.js | 24.18.0 | `.node-version` is 24.18.0; local host reported v25.8.1 | Preserve repository pin; do not change because of host warning |
| pnpm | 11.9.0 | `npm exec --yes pnpm@11.9.0 -- -v` returned 11.9.0 | Preserve repository pin |
| TypeScript | 6.0.3 | Existing exact dev dependency | Preserve strict TypeScript |

Official/runtime sources checked:

- Node.js releases: https://nodejs.org/en/about/previous-releases
- Next.js installation requirements: https://nextjs.org/docs/app/getting-started/installation
- NestJS docs: https://docs.nestjs.com/first-steps and npm metadata for `@nestjs/core`
- React Native versions: https://reactnative.dev/versions and https://reactnative.dev/blog/2026/06/11/react-native-0.86
- Expo SDK 56 changelog/docs: https://expo.dev/changelog/sdk-56 and https://docs.expo.dev/versions/v56.0.0/

## Package metadata method

`npm view` was used without installing packages. The checked fields were version, licence, engines, scripts, repository, homepage, peer dependencies, dependencies, and modified time where relevant.

The repository package policy still requires exact top-level dependency versions. Later issues must re-run the checks before installation because registry metadata may change.

## Future exact package pins

| Area | Package or component | Exact version | Licence | Node 24.18.0 compatibility | Install decision |
|---|---|---:|---|---|---|
| Web framework | `next` | 16.2.9 | MIT | Requires Node >=20.9.0 | Approved for P02-ISS-012 |
| Web peer | `react` | 19.2.7 | MIT | Existing repo dependency; React Native peer-compatible | Already present; preserve |
| Web peer | `react-dom` | 19.2.7 | MIT | Existing repo dependency; Next peer-compatible | Already present; preserve |
| API framework | `@nestjs/core` | 11.1.27 | MIT | Requires Node >=20 | Approved for P02-ISS-005 |
| API framework | `@nestjs/common` | 11.1.27 | MIT | Compatible through Nest 11 stack | Approved for P02-ISS-005 |
| API framework | `@nestjs/platform-express` | 11.1.27 | MIT | Compatible through Nest 11 stack | Approved for P02-ISS-005 |
| API tests | `@nestjs/testing` | 11.1.27 | MIT | Compatible through Nest 11 stack | Approved for P02-ISS-005 |
| API peer | `reflect-metadata` | 0.2.2 | Apache-2.0 | Satisfies Nest peer `^0.1.12 || ^0.2.0` | Approved for P02-ISS-005 |
| API peer | `rxjs` | 7.8.2 | Apache-2.0 | Satisfies Nest peer `^7.1.0` | Approved for P02-ISS-005 |
| OpenAPI | `@nestjs/swagger` | 11.4.4 | MIT | Peer-compatible with Nest 11 | Approved for P02-ISS-006 |
| OpenAPI typed client | `openapi-typescript` | 7.13.0 | MIT | Node-compatible; peer TypeScript support to recheck before install | Approved for P02-ISS-006 |
| OpenAPI typed client | `openapi-fetch` | 0.17.0 | MIT | Node-compatible metadata; browser/runtime wrapper | Approved for P02-ISS-006 |
| Mobile shell | `expo` | 56.0.12 | MIT | Compatible with Node 24 through package metadata and Expo SDK 56 docs | Approved for P02-ISS-013 empty shell |
| Mobile shell | `react-native` | 0.85.3 | MIT | Requires Node `^20.19.4 || ^22.13.0 || ^24.3.0 || >=25.0.0`; Expo SDK 56 target line is React Native 0.85 | Approved for P02-ISS-013 empty shell |
| Database ORM | `drizzle-orm` | 0.45.2 | Apache-2.0 | Node-compatible; uses selected PostgreSQL driver | Approved for P02-ISS-004 |
| Database migrations | `drizzle-kit` | 0.31.10 | MIT | Node-compatible; CLI migration generation | Approved for P02-ISS-004 |
| PostgreSQL driver | `pg` | 8.22.0 | MIT | Requires Node >=16.0.0 | Approved for P02-ISS-004 |
| PostgreSQL types | `@types/pg` | 8.20.0 | MIT | Type-only | Approved for P02-ISS-004 if needed |
| Queue | `bullmq` | 5.79.1 | MIT | Requires Node >=12.22.0 | Approved for P02-ISS-007 behind queue adapter |
| Redis-compatible client | `ioredis` | 5.11.1 | MIT | Requires Node >=12.22.0 | Approved for P02-ISS-007 behind adapter |
| Object storage client | `@aws-sdk/client-s3` | 3.1075.0 | Apache-2.0 | Requires Node >=20.0.0 | Approved for P02-ISS-009 behind adapter |
| Signed URLs | `@aws-sdk/s3-request-presigner` | 3.1075.0 | Apache-2.0 | Requires Node >=20.0.0 | Approved for P02-ISS-009 behind adapter |
| Observability API | `@opentelemetry/api` | 1.9.1 | Apache-2.0 | Compatible with SDK peer `>=1.3.0 <1.10.0` | Approved for P02-ISS-011 |
| Observability SDK | `@opentelemetry/sdk-node` | 0.219.0 | Apache-2.0 | Requires Node `^18.19.0 || >=20.6.0` | Approved for P02-ISS-011 |
| Trace export | `@opentelemetry/exporter-trace-otlp-http` | 0.219.0 | Apache-2.0 | Requires Node `^18.19.0 || >=20.6.0` | Approved for P02-ISS-011 |
| Metrics export | `@opentelemetry/exporter-metrics-otlp-http` | 0.219.0 | Apache-2.0 | Requires Node `^18.19.0 || >=20.6.0` | Approved for P02-ISS-011 |
| Logs export | `@opentelemetry/exporter-logs-otlp-http` | 0.219.0 | Apache-2.0 | Requires Node `^18.19.0 || >=20.6.0` | Approved for P02-ISS-011 if logs export is used |
| HTTP instrumentation | `@opentelemetry/instrumentation-http` | 0.219.0 | Apache-2.0 | Requires Node `^18.19.0 || >=20.6.0` | Approved for P02-ISS-011 |
| Express instrumentation | `@opentelemetry/instrumentation-express` | 0.67.0 | Apache-2.0 | Requires Node `^18.19.0 || >=20.6.0` | Approved for P02-ISS-011 |
| Nest instrumentation | `@opentelemetry/instrumentation-nestjs-core` | 0.65.0 | Apache-2.0 | Requires Node `^18.19.0 || >=20.6.0` | Approved for P02-ISS-011 |
| PostgreSQL instrumentation | `@opentelemetry/instrumentation-pg` | 0.71.0 | Apache-2.0 | Requires Node `^18.19.0 || >=20.6.0` | Approved for P02-ISS-011 |
| Redis-compatible instrumentation | `@opentelemetry/instrumentation-ioredis` | 0.67.0 | Apache-2.0 | Requires Node `^18.19.0 || >=20.6.0` | Approved for P02-ISS-011 |
| Log instrumentation | `@opentelemetry/instrumentation-pino` | 0.65.0 | Apache-2.0 | Requires Node `^18.19.0 || >=20.6.0` | Approved for P02-ISS-011 |
| Structured logging | `pino` | 10.3.1 | MIT | Node-compatible by package metadata | Approved for P02-ISS-005/P02-ISS-011 |
| Feature flags | `@openfeature/core` | 1.11.0 | Apache-2.0 | Node-compatible metadata | Approved for P02-ISS-010 |
| Feature flags | `@openfeature/server-sdk` | 1.22.0 | Apache-2.0 | Requires Node >=20 | Approved for P02-ISS-010 |
| Feature flags | `@openfeature/nestjs-sdk` | 0.2.7 | Apache-2.0 | Peer-compatible with Nest 11 and server SDK 1.22.0 | Approved for P02-ISS-010 |
| Container tests | `testcontainers` | 12.0.3 | MIT | Node-compatible metadata; Docker runtime required | Approved for P02-ISS-003/P02-ISS-004 if test strategy needs it |
| Container tests | `@testcontainers/postgresql` | 12.0.3 | MIT | Node-compatible metadata; Docker runtime required | Approved for P02-ISS-004 if test strategy needs it |
| Container tests | `@testcontainers/redis` | 12.0.3 | MIT | Node-compatible metadata; Docker runtime required | Approved for Redis-compatible tests if adapter needs it |
| Container tests | `@testcontainers/localstack` | 12.0.3 | MIT | Node-compatible metadata; LocalStack licensing must be separately reviewed before CI use | Conditional only |

## Infrastructure component pins and decisions

| Component | Version or path | Decision | Evidence |
|---|---|---|---|
| PostgreSQL | 18.4 | Use PostgreSQL 18.4 for Phase 2 database foundation | https://www.postgresql.org/support/versioning/ and https://www.postgresql.org/docs/release/18.4/ |
| PostGIS | 3.6.4 | Use PostGIS 3.6.4 with PostgreSQL 18 where the selected provider/image supports it | https://postgis.net/docs/release_notes.html |
| Redis OSS | 8.x tri-license includes RSALv2, SSPLv1, and AGPLv3 | Not selected as default until legal/commercial review | https://redis.io/legal/licenses/ |
| Valkey | 8.1.8 supported 8.x release; 9.1.0 release observed | Select Valkey 8.1.8-compatible local Redis-protocol service for Phase 2 local queue/cache if P02-ISS-003 confirms BullMQ behavior | https://valkey.io/download/ and https://github.com/valkey-io/valkey/releases |
| Local object storage | LocalStack and MinIO reviewed | S3-compatible port approved; emulator remains review-bound because LocalStack subscription/licence and MinIO AGPLv3 posture require commercial/legal review | https://docs.localstack.cloud/aws/licensing/, https://github.com/localstack/localstack/blob/master/LICENSE.txt, https://github.com/minio/minio |
| IaC | OpenTofu 1.12.x preferred candidate; Pulumi 3.248.0 candidate; Terraform 1.15.7 review-required | Cloud provider remains human-decision gated; no IaC implementation in P02-ISS-001 | https://opentofu.org/docs/intro/install/, https://github.com/opentofu/opentofu/blob/main/LICENSE, https://www.pulumi.com/docs/install/, https://developer.hashicorp.com/terraform/install |

## Alternatives rejected or deferred

| Area | Alternative | Decision |
|---|---|---|
| API framework | Fastify-only or unstructured Express app | Rejected for Phase 2 because approved topology calls for NestJS API skeleton |
| Web shells | Vite-only app shells | Rejected for Phase 2 because approved topology calls for Next.js web apps |
| Mobile shell | Raw React Native first | Deferred; Expo SDK 56 empty shell is lower operational scope for Phase 2 |
| Mobile shell | React Native 0.86 under Expo SDK 56 | Deferred because Expo SDK 56 documentation targets the React Native 0.85 line; 0.86 can be re-evaluated only through a later mobile ADR. |
| Database | Prisma as default | Deferred because generated client/binary lifecycle and abstraction are heavier than needed for modular-monolith SQL-first foundation |
| Database | Kysely-only migration path | Deferred because Drizzle provides ORM plus migration CLI in one selected path |
| Redis service | Redis OSS 8 default | Review-required because Redis 8 tri-license includes AGPLv3, RSALv2, and SSPLv1 |
| Queue fallback | pg-boss | Kept as fallback if Redis-compatible service is later rejected |
| Object storage SDK | MinIO JavaScript SDK | Deferred to keep app-facing surface S3-compatible and avoid domain coupling to one local product |
| IaC | Terraform default | Review-required because current Terraform releases use HashiCorp BSL |
| Observability | Sentry/New Relic/Datadog vendor SDKs | Deferred; error-reporting vendor selection requires privacy/security/commercial review |
| Observability | `@opentelemetry/auto-instrumentations-node` | Rejected as default due broad transitive/instrumentation surface; use explicit instrumentations instead |

## Lifecycle-script and security review notes

- No package is installed by P02-ISS-001, so no lifecycle script is executed.
- Selected npm package metadata was reviewed for `scripts`. Many packages contain build, test, prepack, prepublish, or prepare scripts in source/package metadata. Later installation must verify that no `preinstall`, `install`, or `postinstall` lifecycle script violates repository policy.
- Published registry packages with optional native binaries, such as Next SWC packages, must be captured in the lockfile and dependency inventory when installed by later issues.
- Vendor SDK packages must be installed only in adapter or infrastructure-wiring packages, not domain packages.
- Object storage, OpenTelemetry exporters, queue clients, and feature flag SDKs must not receive production secrets or PHI in local/test artifacts.

## Package-policy implications

No package-policy file is changed by P02-ISS-001 because no dependency is installed. Later implementation issues must:

- add exact dependency versions only;
- update the lockfile;
- run package-policy, licence-policy, audit, and inventory commands;
- record new review-required licences;
- reject unpinned Git/archive/URL dependencies;
- keep lifecycle scripts out of workspace packages;
- keep package publication disabled.

## Recheck rule

Every package and infrastructure version in this document must be rechecked immediately before the later issue that installs or implements it.

## P02-ISS-003 local infrastructure recheck

Checked on 2026-06-30 after validating the local harness:

| Component | P02-ISS-003 local pin | Evidence | Status |
|---|---|---|---|
| PostgreSQL/PostGIS image | `postgis/postgis:18-3.6-alpine@sha256:24047f97be7cf496a6e41a40a236f489fc4ac9caf26794f0882461f5bb6cd758` | PostgreSQL 18.4 official release/versioning docs; PostGIS 3.6.4 release notes; docker-postgis source and Docker Hub metadata | Configured and validated for local harness |
| Valkey image | `valkey/valkey:8.1.8-alpine@sha256:77643d152547b446fc15cbafaff22004545663fcd40c6b28038ad283837baa75` | Valkey download page and Docker Hub metadata | Configured and validated for local harness |
| Object-storage emulator image | `motoserver/moto:5.2.2@sha256:d8ae5edc2bf080e7e4c13f9bd4b29b53ac3b4427e92956318db3dbe23ec43eb7` | Moto server-mode docs, Moto Apache-2.0 repository metadata, and Docker Hub metadata | Configured and validated for local synthetic S3-compatible emulation; P02-ISS-009 still owns signed URL evidence |
| OpenTelemetry Collector image | `otel/opentelemetry-collector-contrib:0.155.0@sha256:4935caa35e9a4cb387e35732e8fb22b2b5759af8d12e7043357f03837f6e8df5` | OpenTelemetry Collector docs/releases and Docker Hub metadata | Configured and validated for local OTLP health/debug collector; P02-ISS-011 still owns app instrumentation |

No npm dependency was installed by P02-ISS-003.
