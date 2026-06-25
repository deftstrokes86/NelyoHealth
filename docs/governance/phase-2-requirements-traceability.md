# Phase 2 Requirements Traceability

## Status

P02-PLAN-001 planning traceability is accepted. P02-ISS-001 is accepted. P02-ISS-002 is accepted. P02-ISS-003 is partial with local harness files and static checks implemented; live Docker start/stop/health evidence is blocked on the current validation host. P02-ISS-004 and later implementation issues remain NOT STARTED.

## Requirement map

| Requirement ID | Requirement | Source | Primary issue | Supporting issue(s) | Status |
|---|---|---|---|---|---|
| P02-REQ-001 | Deployable application skeleton with local, development, and staging environments | Implementation map Phase 2 | P02-ISS-017 | P02-ISS-002 through P02-ISS-018 | TOPOLOGY-SCAFFOLDED-PENDING-RUNTIME-IMPLEMENTATION |
| P02-REQ-002 | NestJS API | Implementation map Phase 2 | P02-ISS-005 | P02-ISS-006, P02-ISS-011 | WORKSPACE-BOUNDARY-CREATED-PENDING-P02-ISS-005 |
| P02-REQ-003 | Background worker | Implementation map Phase 2 | P02-ISS-007 | P02-ISS-008, P02-ISS-011 | WORKSPACE-BOUNDARY-CREATED-PENDING-P02-ISS-007 |
| P02-REQ-004 | Next.js patient, provider, organization, and admin apps | Implementation map Phase 2 | P02-ISS-012 | P02-ISS-006, P02-ISS-014 | WORKSPACE-BOUNDARY-CREATED-PENDING-P02-ISS-012 |
| P02-REQ-005 | Empty Expo or React Native mobile shell | Implementation map Phase 2 | P02-ISS-013 | P02-ISS-014 | WORKSPACE-BOUNDARY-CREATED-PENDING-P02-ISS-013 |
| P02-REQ-006 | PostgreSQL and PostGIS | Implementation map Phase 2 | P02-ISS-004 | P02-ISS-003 | LOCAL-HARNESS-CONFIGURED-PENDING-DOCKER-RUNTIME-EVIDENCE |
| P02-REQ-007 | Redis-compatible cache/queue foundation | Implementation map Phase 2 | P02-ISS-003 | P02-ISS-007 | LOCAL-VALKEY-HARNESS-CONFIGURED-PENDING-DOCKER-RUNTIME-EVIDENCE |
| P02-REQ-008 | Object storage with signed URL support | Implementation map Phase 2 | P02-ISS-009 | P02-ISS-014 | LOCAL-MOTO-EMULATOR-CONFIGURED-PENDING-DOCKER-RUNTIME-EVIDENCE-AND-P02-ISS-009-SIGNED-URL-IMPLEMENTATION |
| P02-REQ-009 | Email, SMS, push adapters | Implementation map Phase 2 | P02-ISS-010 | None | PLANNED |
| P02-REQ-010 | Feature flags | Implementation map Phase 2 | P02-ISS-010 | P02-ISS-015 | PLANNED |
| P02-REQ-011 | Secrets manager boundary | Implementation map Phase 2 | P02-ISS-015 | P02-ISS-016 | PLANNED |
| P02-REQ-012 | Managed logging, metrics/tracing, error reporting boundaries | Implementation map Phase 2 | P02-ISS-011 | P02-ISS-015 | LOCAL-OTEL-COLLECTOR-HARNESS-CONFIGURED-PENDING-DOCKER-RUNTIME-EVIDENCE |
| P02-REQ-013 | Modular-monolith, REST, OpenAPI, typed client | Phase 2 prompt and ADR-0005 | P02-ISS-005 | P02-ISS-006 | PLANNED |
| P02-REQ-014 | Request/correlation IDs and standard errors | Phase 2 prompt | P02-ISS-005 | P02-ISS-011 | PLANNED |
| P02-REQ-015 | Idempotency-key middleware | Phase 2 prompt | P02-ISS-005 | P02-ISS-014 | PLANNED |
| P02-REQ-016 | DB transaction helpers and transactional outbox | Phase 2 prompt and ADR-0005 | P02-ISS-008 | P02-ISS-004, P02-ISS-007 | PLANNED |
| P02-REQ-017 | Domain event dispatch, retry, DLQ | Phase 2 prompt | P02-ISS-007 | P02-ISS-008, P02-ISS-011 | PLANNED |
| P02-REQ-018 | Health/readiness endpoints | Phase 2 prompt | P02-ISS-005 | P02-ISS-003, P02-ISS-015 | PLANNED |
| P02-REQ-019 | Browser harness projects, auth states, seed/reset, API helpers, page objects, assertions, artifacts, a11y, privacy, sharding/retry | Phase 2 prompt and ADR-0003 | P02-ISS-014 | P02-ISS-004, P02-ISS-012, P02-ISS-013 | PLANNED |
| P02-REQ-020 | Environment strategy for local, PR, development, staging, production, partner sandbox | Phase 2 prompt | P02-ISS-015 | P02-ISS-016, P02-ISS-017 | PLANNED |
| P02-REQ-021 | Production data never copied downward | Phase 2 prompt and locked data rules | P02-ISS-015 | P02-ISS-014, P02-ISS-018 | PLANNED |
| P02-REQ-022 | IaC plan for network, hosting, managed data services, DNS/TLS/CDN/WAF, secrets, backups, monitoring | Phase 2 prompt | P02-ISS-016 | P02-ISS-017 | PLANNED-HUMAN-DECISION-REQUIRED |
| P02-REQ-023 | Vendor-specific code stays in adapters | Phase 2 prompt and ADR-0005 | P02-ISS-001 | P02-ISS-005 through P02-ISS-011 | ADR-BOUNDARY-RECORDED-PENDING-IMPLEMENTATION-EVIDENCE |

## Exit-gate map

| Gate ID | Exit gate | Primary issue | Evidence required | Status |
|---|---|---|---|---|
| P02-EG-001 | Human-merged main deploys automatically to development | P02-ISS-017 | Human merge evidence, dev deployment log, no Codex GitHub writes | PLANNED |
| P02-EG-002 | A version can be promoted to staging | P02-ISS-017 | Versioned artifact, promotion evidence, staging smoke | PLANNED |
| P02-EG-003 | Database migrations run safely | P02-ISS-004 | Migration apply/status/rollback or compensation evidence | PLANNED |
| P02-EG-004 | Logs, traces, and metrics connect one request across API and worker | P02-ISS-011 | Correlated request/job trace/log/metric evidence | PLANNED |
| P02-EG-005 | Background job enqueue/process/retry/DLQ | P02-ISS-007 | Deterministic job test evidence | PLANNED |
| P02-EG-006 | Document uploaded using signed URL | P02-ISS-009 | Synthetic document upload/download/expiry evidence | PLANNED |
| P02-EG-007 | Browser tests start apps, seed, sign in, navigate, and retain traces | P02-ISS-014 | Playwright report and artifact retention evidence | PLANNED |
| P02-EG-008 | Codex can inspect local routes and report console/network failures | P02-ISS-014 | MCP or CLI local inspection evidence | PLANNED |
| P02-EG-009 | Vendor-specific code stays in adapters | P02-ISS-018 | Import boundary checks and review evidence; P02-ISS-001 ADR boundary decisions; P02-ISS-002 dependency-free boundary packages | PARTIAL-ADR-AND-WORKSPACE-BOUNDARY-RECORDED |

## P02-ISS-001 evidence

| Evidence item | Result | Artifact |
|---|---|---|
| Application framework decision | Recorded | docs/adr/ADR-P02-001-application-framework-and-dependency-pins.md |
| Database access/migration decision | Recorded | docs/adr/ADR-P02-002-database-access-and-migration-tool.md |
| Redis-compatible queue/cache decision | Recorded | docs/adr/ADR-P02-003-redis-compatible-cache-queue-and-worker-backplane.md |
| Object-storage signed URL adapter decision | Recorded with emulator review condition | docs/adr/ADR-P02-004-object-storage-signed-url-adapter.md |
| IaC/cloud path decision | Recorded with cloud provider human-decision condition | docs/adr/ADR-P02-005-iac-cloud-provider-and-deployment-path.md |
| Observability/error-reporting boundary | Recorded with vendor selection deferred | docs/adr/ADR-P02-006-observability-and-error-reporting-boundary.md |
| Exact future dependency pins | Recorded without install | docs/engineering/phase-2-dependency-decision-pack.md |
| ADR checklist | Accepted by P02-ISS-002 execution prompt | docs/governance/p02-iss-001-adr-review-checklist.md |

## P02-ISS-002 evidence

| Evidence item | Result | Artifact |
|---|---|---|
| Approved app topology | Boundary-only workspaces created | apps/ |
| Approved shared package topology | Boundary-only workspaces created | packages/api-client, packages/config, packages/domain, packages/observability, packages/platform-adapters, packages/testing-factories |
| Nested app instructions | Created | apps/AGENTS.md and app-specific AGENTS.md files |
| Workspace manifest coverage | Updated | pnpm-workspace.yaml and pnpm-lock.yaml |
| Build/typecheck wiring | Updated | package.json, tsconfig.base.json, app/package tsconfig files |
| Package policy coverage | Updated to scan apps | tools/checks/package-policy.mjs |
| Topology contract test | Added | tests/unit/workspace-topology.spec.ts |
| Runtime implementation | Not started | No routes, controllers, pages, mobile runtime, jobs, database, containers, IaC, or external providers |

## P02-ISS-003 evidence

| Evidence item | Result | Artifact |
|---|---|---|
| Local Compose harness | Created, static verification passed | infra/local/compose.yaml |
| Local infrastructure control script | Created with verify, doctor, ports, start, health, stop, and reset commands | tools/local-infra/local-infra.mjs |
| Local infrastructure runbook | Created | docs/engineering/phase-2-local-infrastructure-harness.md |
| Unit test coverage | Added for static config, image pins, local binds, port validation, and port conflict detection | tests/unit/local-infrastructure-harness.spec.ts |
| Docker runtime evidence | Blocked | Docker CLI unavailable on the validation host |
| Database implementation | Not started | P02-ISS-004 remains NOT STARTED |

## Locked requirement preservation

| Locked area | Phase 2 preservation rule |
|---|---|
| One longitudinal patient identity | Phase 2 may only create synthetic identity harness data, not Phase 3 identity model implementation. |
| Payer does not get clinical access | No clinical or payer feature in Phase 2; browser harness must preserve negative checks. |
| Provider detail disclosure | No provider matching in Phase 2; privacy assertions must prove protected fields are absent from shells and artifacts. |
| Emergency independence | No emergency workflow in Phase 2; future adapters must not create dependency on payment or marketplace flows. |
| Clinical record amendment | No clinical record implementation in Phase 2. |
| Browser validation | P02-ISS-014 implements both deterministic Playwright and Codex local inspection paths. |
| Synthetic data only | Every Phase 2 test, seed, auth state, document, queue job, and artifact uses synthetic data only. |
| Human-only Git | P02 issues must record that Codex performed no Git or GitHub writes. |

## Planning artifacts

| Artifact | Purpose |
|---|---|
| docs/exec-plans/P02-platform-and-infrastructure-foundation.md | Canonical Phase 2 execution plan |
| docs/engineering/phase-2-technology-evaluation.md | Current primary-source technology evaluation |
| docs/engineering/phase-2-application-topology.md | Future app and package topology |
| docs/engineering/phase-2-environment-strategy.md | Environment, data, promotion, rollback, and secrets plan |
| docs/engineering/phase-2-local-infrastructure-plan.md | Local infrastructure plan |
| docs/engineering/phase-2-browser-harness-plan.md | Browser harness plan |
| docs/engineering/phase-2-issue-backlog.md | Authoritative 18-issue backlog |
| docs/governance/phase-2-requirements-traceability.md | Requirement and exit-gate traceability |
