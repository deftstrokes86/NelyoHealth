# Phase 2 Technology Evaluation

## Scope

This evaluation supports P02-PLAN-001 only. It records current primary-source research and planning recommendations. It does not install packages, create application code, provision infrastructure, or approve production use.

## Local evidence command

`npm view` was used on 2026-06-25 to check current package metadata without installing anything. Notable current package versions returned:

| Package | Current version | License | Runtime notes |
|---|---:|---|---|
| next | 16.2.9 | MIT | Node >=20.9.0; React 18.2 or 19 supported |
| react | 19.2.7 | MIT | Already used in Phase 1 foundation |
| @nestjs/core | 11.1.27 | MIT | Node >=20 |
| expo | 56.0.12 | MIT | Peer depends on React and React Native |
| react-native | 0.86.0 | MIT | Node ^20.19.4, ^22.13.0, ^24.3.0, or >=25 |
| typescript | 6.0.3 | Apache-2.0 | Already pinned in repo |
| pnpm | 11.9.0 | MIT | Node >=22.13 |
| @opentelemetry/api | 1.9.1 | Apache-2.0 | Peer-compatible with SDK Node |
| @opentelemetry/sdk-node | 0.219.0 | Apache-2.0 | Node ^18.19.0 or >=20.6.0 |
| @nestjs/swagger | 11.4.4 | MIT | Peer compatible with NestJS 11 |
| openapi-typescript | 7.13.0 | MIT | Peer TypeScript ^5.x |
| @hey-api/openapi-ts | 0.99.0 | MIT | Node >=22.18.0 |
| orval | 8.19.0 | MIT | Node >=22.18.0 |
| bullmq | 5.79.1 | MIT | Requires Redis peer >=5.0.0 |
| pg-boss | 12.23.0 | MIT | Node >=22.12.0 |
| testcontainers | 12.0.3 | MIT | Docker-backed test infrastructure |
| minio | 8.0.7 | Apache-2.0 | Node ^16, ^18, or >=20 |
| ioredis | 5.11.1 | MIT | Node >=12.22 |

## App stack recommendations

| Area | Recommendation | Decision status | Source basis |
|---|---|---|---|
| Node runtime | Keep repository-pinned Node 24.18.0 for Phase 2. Node 24 is LTS and current repo tooling supports it. | APPROVED-BY-P01; preserve | https://nodejs.org/en/about/previous-releases |
| Package manager | Keep pnpm 11.9.0 and exact dependency pins. | APPROVED-BY-P01; preserve | package.json, pnpm-workspace.yaml, pnpm docs and npm metadata |
| TypeScript | Keep strict TypeScript and shared base config. | APPROVED-BY-P01; preserve | package.json, tsconfig.base.json |
| API | Use NestJS 11 for the API skeleton. | RECOMMENDED-FOR-P02-ISS-001 | https://docs.nestjs.com/first-steps |
| Web apps | Use Next.js 16 for patient, provider, organization, and admin shells. | RECOMMENDED-FOR-P02-ISS-001 | https://nextjs.org/docs/app/getting-started/installation |
| React | Keep React 19.2.7 alignment from Phase 1 foundation. | APPROVED-BY-P01; preserve | npm metadata; package.json |
| Mobile | Prefer Expo SDK 56 empty shell unless P02-ISS-001 proves raw React Native is lower risk. No native feature parity in Phase 2. | RECOMMENDED-WITH-ADR | https://docs.expo.dev/versions/latest/ and https://reactnative.dev/versions |

## Data and infrastructure recommendations

| Area | Recommendation | Decision status | Source basis |
|---|---|---|---|
| PostgreSQL | Use PostgreSQL 18.x latest minor available in the approved image/provider at implementation time. | RECOMMENDED-FOR-P02-ISS-004 | https://www.postgresql.org/support/versioning/ and https://www.postgresql.org/docs/release/ |
| PostGIS | Use PostGIS 3.6.x compatible with PostgreSQL 18. | RECOMMENDED-FOR-P02-ISS-004 | https://postgis.net/documentation/getting_started/install_windows/released_versions/ |
| Redis | Use a Redis-compatible abstraction. Redis Open Source 8 has tri-license options including AGPLv3; legal/commercial review is required before production reliance. | APPROVAL-REQUIRED | https://redis.io/legal/licenses/ |
| Queue | Prefer BullMQ if Redis license and provider posture are approved. Keep pg-boss as Postgres-backed fallback if Redis is deferred. | ADR-REQUIRED | https://docs.bullmq.io/guide/queues and https://docs.bullmq.io/guide/retrying-failing-jobs |
| Object storage | Use an object-storage port with S3-compatible signed URL semantics. Do not bind domain code to AWS, MinIO, or LocalStack types. | ADR-REQUIRED | https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html |
| Local object storage | Evaluate MinIO Community and LocalStack. MinIO Community is AGPLv3; LocalStack has plan/auth-token considerations. | APPROVAL-REQUIRED | https://github.com/minio/minio and https://docs.localstack.cloud/aws/getting-started/ |
| Feature flags | Use OpenFeature as the application-facing API with an in-memory/local provider first. | RECOMMENDED-FOR-ADAPTER | https://openfeature.dev/ and https://openfeature.dev/docs/reference/sdks/server/javascript/nestjs/ |
| Email/SMS/push | Create ports and fake local adapters only. No vendor is selected in Phase 2 planning. | DEFERRED-VENDOR | Phase 2 prompt scope |
| Secrets | Use environment-scoped secret references and local examples without real secret values. Provider-specific secret managers require IaC ADR. | ADR-REQUIRED | Phase 2 prompt scope |
| Logging/metrics/tracing | Use OpenTelemetry instrumentation boundaries; backend exporter/provider remains adapter-configured. | RECOMMENDED-FOR-P02-ISS-011 | https://opentelemetry.io/docs/ and https://opentelemetry.io/docs/languages/js/getting-started/nodejs/ |
| Error reporting | Define error reporter port. Do not select a vendor until security/privacy review. | DEFERRED-VENDOR | ADR-0010 |

## API contract and client generation

| Option | Notes | Recommendation |
|---|---|---|
| @nestjs/swagger | Official Nest OpenAPI module. Required to generate REST contract from the API skeleton. | Use in P02-ISS-006. Source: https://docs.nestjs.com/openapi/introduction |
| openapi-typescript + openapi-fetch | Minimal, runtime-light typed fetch client. | Preferred default unless issue-specific needs require SDK generation. Source: https://openapi-ts.dev/ |
| @hey-api/openapi-ts | Generates richer SDKs and plugins, current package requires Node >=22.18.0. | Evaluate only if generated SDK ergonomics are required. Source: https://heyapi.dev/docs/openapi/typescript/get-started |
| orval | Generates type-safe clients and mocks, more configuration surface. | Defer unless mocks/query hooks become a clear need. Source: https://orval.dev/docs |

## Local development and testing recommendations

| Area | Recommendation | Source basis |
|---|---|---|
| Local multi-service dev | Use Docker Compose or an approved local container workflow for Postgres/PostGIS, Redis-compatible service, object storage, and observability dev collectors. | https://docs.docker.com/compose/intro/compose-application-model/ |
| Service readiness | Require healthchecks and dependency readiness rather than relying on container start order. | https://docs.docker.com/compose/how-tos/startup-order/ |
| Integration tests | Evaluate Testcontainers for isolated Postgres/Redis/object-storage tests where deterministic setup is safer than shared Compose state. | https://node.testcontainers.org/ |
| Browser tests | Use Playwright projects per app and viewport class, storage states, tracing, screenshots, videos, sharding, retries, and artifact retention rules. | https://playwright.dev/docs/auth and https://playwright.dev/docs/test-sharding |

## IaC evaluation

| Tool | Current version evidence | License posture | Runtime / platform | Recommendation |
|---|---|---|---|---|
| Terraform | Official install page listed 1.15.7 latest. | HashiCorp Business Source License for current releases. | Windows, macOS, Linux binaries. | Do not choose by default without license/commercial review. |
| OpenTofu | Official docs listed OpenTofu 1.12.0 released. | MPL-2.0, Linux Foundation project. | Windows, macOS, Linux, BSD and OCI image. | Preferred default for provider-neutral HCL workflow if cloud provider supports required resources. |
| Pulumi | Official install page listed 3.248.0 latest. | Apache-2.0 core. | Supports Node current/active/maintenance LTS and pnpm. | Strong candidate if TypeScript IaC is preferred and state/secrets model is approved. |
| Cloud-native templates | Provider-specific. | Varies by cloud. | Locks to chosen provider. | Defer until cloud provider decision. |

Primary sources: https://developer.hashicorp.com/terraform/install, https://www.hashicorp.com/en/bsl, https://opentofu.org/docs/intro/install/, https://github.com/opentofu/opentofu/blob/main/LICENSE, https://www.pulumi.com/docs/install/, https://www.pulumi.com/docs/iac/languages-sdks/javascript/, and https://github.com/pulumi/pulumi/blob/master/LICENSE.

## ADRs required before implementation

- ADR-P02-001: Application framework and exact dependency pins.
- ADR-P02-002: Database access and migration tool.
- ADR-P02-003: Redis-compatible cache/queue provider and license posture.
- ADR-P02-004: Object storage local/prod strategy and signed URL adapter.
- ADR-P02-005: IaC tool and cloud provider.
- ADR-P02-006: Observability exporter/backend and error-reporting boundary.

