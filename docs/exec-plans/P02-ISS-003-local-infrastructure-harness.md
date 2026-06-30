# P02-ISS-003 Local Infrastructure Harness Execution Plan

## Objective

Execute `P02-ISS-003 - Local infrastructure harness` exactly as defined in `docs/engineering/phase-2-issue-backlog.md`.

Add a local-only dependency orchestration harness for PostgreSQL/PostGIS, a Redis-compatible service, an object-storage emulator, and local observability support, without starting P02-ISS-004 or any product feature work.

## Existing context

- Phase 0: PHASE-0-CONDITIONAL-PASS.
- Phase 1: PHASE-1-CONDITIONAL-PASS.
- P02-PLAN-001: ACCEPTED.
- P02-ISS-001: ACCEPTED.
- P02-ISS-002: ACCEPTED by the P02-ISS-003 execution prompt.
- P02-ISS-003 completed.
- P02-ISS-004 remains NOT STARTED.
- Phase 3 remains NOT STARTED.
- Pilot launch remains PILOT-NO-GO.
- Git and GitHub writes remain HUMAN-ONLY.

The repository already contains Phase 1 tooling, accepted Phase 2 ADRs, and the P02-ISS-002 app/package boundary topology.

## Scope

- Add local container workflow files under `infra/local/`.
- Add local infrastructure scripts for static verification, Docker availability, port preflight, start, health, stop, and reset.
- Configure local-only services:
  - PostgreSQL/PostGIS through the `postgis/postgis` image family.
  - Valkey as the Redis-compatible service.
  - Moto Server as the synthetic S3-compatible object-storage emulator.
  - OpenTelemetry Collector Contrib with local health and debug export.
- Add deterministic unit tests for static configuration, exact image pins, local-only binds, synthetic controls, port override validation, and port conflict detection.
- Update documentation and governance.

## Non-goals

- No database schema, migration, seed, reset data, operational `pnpm db:migrate`, or operational `pnpm db:seed`.
- No API, worker, queue job, retry, DLQ, signed URL adapter, bucket, object upload, route, app shell, auth, tenancy, clinical, payment, pharmacy, laboratory, provider matching, or pilot behavior.
- No production infrastructure, production origin, production secret, cloud resource, IaC provider selection, deployment workflow, container publication, package publication, release, tag, PR, commit, push, or GitHub settings mutation.
- No P02-ISS-004 or later issue implementation.

## Source documents

- `AGENTS.md`, `infra/AGENTS.md`, `tools/AGENTS.md`, `tests/AGENTS.md`, `docs/AGENTS.md`, `.agent/PLANS.md`
- `docs/exec-plans/P02-platform-and-infrastructure-foundation.md`
- `docs/engineering/phase-2-issue-backlog.md`
- `docs/engineering/phase-2-local-infrastructure-plan.md`
- `docs/engineering/phase-2-environment-strategy.md`
- `docs/engineering/phase-2-technology-evaluation.md`
- `docs/engineering/phase-2-application-topology.md`
- `docs/engineering/phase-2-browser-harness-plan.md`
- P02-ISS-001 and P02-ISS-002 execution plans
- `docs/engineering/phase-2-dependency-decision-pack.md`
- ADR-P02-001 through ADR-P02-006 and `docs/adr/ADR-index.md`
- Current governance registers and architecture documents
- Repository manifests, CI, TypeScript, ESLint, and Playwright configuration

## Locked rules

- Preserve synthetic-only local data.
- Keep production data, production secrets, production origins, and live provider integrations out of the harness.
- Preserve modular-monolith, adapter, vendor SDK, and telemetry minimization boundaries.
- Keep `pnpm db:migrate` and `pnpm db:seed` phase-gated until P02-ISS-004.
- Keep Git and GitHub writes human-only.
- Do not claim pilot, Phase 3, production deployment, or Phase 2 exit-gate completion.

## Files affected

Created:

- `infra/local/AGENTS.md`
- `infra/local/README.md`
- `infra/local/compose.yaml`
- `infra/local/otel-collector.yaml`
- `tools/local-infra/local-infra.mjs`
- `tests/unit/local-infrastructure-harness.spec.ts`
- `docs/exec-plans/P02-ISS-003-local-infrastructure-harness.md`
- `docs/engineering/phase-2-local-infrastructure-harness.md`

Updated:

- `infra/AGENTS.md`
- `package.json`
- `README.md`
- `CONTRIBUTING.md`
- `docs/STATUS.md`
- `docs/engineering/phase-2-local-infrastructure-plan.md`
- governance registers and traceability docs

## Dependency changes

No npm dependency is added.

Local container image pins are added in `infra/local/compose.yaml`:

| Service | Image |
|---|---|
| PostgreSQL/PostGIS | `postgis/postgis:18-3.6-alpine@sha256:24047f97be7cf496a6e41a40a236f489fc4ac9caf26794f0882461f5bb6cd758` |
| Valkey | `valkey/valkey:8.1.8-alpine@sha256:77643d152547b446fc15cbafaff22004545663fcd40c6b28038ad283837baa75` |
| Object-storage emulator | `motoserver/moto:5.2.2@sha256:d8ae5edc2bf080e7e4c13f9bd4b29b53ac3b4427e92956318db3dbe23ec43eb7` |
| Observability collector | `otel/opentelemetry-collector-contrib:0.155.0@sha256:4935caa35e9a4cb387e35732e8fb22b2b5759af8d12e7043357f03837f6e8df5` |

## Architecture impact

The harness creates local infrastructure support only. It preserves the modular-monolith direction and adapter boundaries by exposing services for later issues without adding app code or SDK types to domain contracts.

Moto Server is selected for P02-ISS-003 local S3-compatible emulation because LocalStack currently has auth/licensing uncertainty and MinIO has AGPL/commercial review concerns. Moto does not select a production object-storage provider and does not replace the P02-ISS-009 signed URL adapter decision.

## Data-model impact

None. No schema, migration, table, model, seed, reset data, fixture, clinical record, payment record, provider record, or production-like data is created.

## API impact

None. No API route, controller, DTO, OpenAPI artifact, signed URL endpoint, health endpoint, or application runtime behavior is created.

## UI impact

None. No route, page, browser shell, component, visual output, accessibility surface, or user-facing app behavior changes.

## Privacy and security impact

- All host ports bind to `127.0.0.1`.
- Defaults are synthetic and local-only.
- No auth token, cloud credential, production secret, production origin, PHI, payment credential, provider detail, or real organization data is added.
- OpenTelemetry uses a local debug exporter only.
- Docker runtime commands fail explicitly if Docker is missing.
- Port preflight refuses to start over an occupied local port.

## Environment impact

Adds a local environment harness only. Development, staging, production, and partner sandbox remain unprovisioned. P02-ISS-016 and P02-ISS-017 remain blocked by human cloud/provider decisions.

## Browser scenarios

No browser-visible app surface changes. Deterministic browser, accessibility, and visual suites remain repository-level validation only.

Interactive browser inspection is not issue-specific for P02-ISS-003.

## Tests

Added `tests/unit/local-infrastructure-harness.spec.ts` to verify:

- exact image digest pins and no floating image tags;
- local-only `127.0.0.1` port bindings;
- no auth token or production marker in the Compose file;
- all expected services are documented;
- invalid port overrides are rejected;
- occupied ports are detected before start;
- Docker availability is reported without requiring Docker for static checks.

## Milestones

1. Read prompt, backlog, instructions, Phase 2 docs, ADRs, governance registers, architecture docs, manifests, and P02-ISS-001/P02-ISS-002 outputs.
2. Recheck current primary sources and image metadata.
3. Create execution plan and local infrastructure runbook.
4. Add Compose harness, OTel config, control script, root scripts, and tests.
5. Update status, traceability, decisions, dependencies, blockers, risks, document register, and change log.
6. Run issue-specific and repository validation.
7. Report completion or blockers honestly.

## Validation commands

```bash
git status --short
node -v
npm -v
npm exec --yes pnpm@11.9.0 -- -v
docker --version
docker compose version
npm exec --yes pnpm@11.9.0 -- install
npm exec --yes pnpm@11.9.0 -- install --frozen-lockfile
npm exec --yes pnpm@11.9.0 -- infra:verify
npm exec --yes pnpm@11.9.0 -- infra:doctor
npm exec --yes pnpm@11.9.0 -- infra:ports
npm exec --yes pnpm@11.9.0 -- infra:start
npm exec --yes pnpm@11.9.0 -- infra:health
npm exec --yes pnpm@11.9.0 -- infra:stop
npm exec --yes pnpm@11.9.0 -- test
npm exec --yes pnpm@11.9.0 -- test:integration
npm exec --yes pnpm@11.9.0 -- format:check
npm exec --yes pnpm@11.9.0 -- lint
npm exec --yes pnpm@11.9.0 -- typecheck
npm exec --yes pnpm@11.9.0 -- build
npm exec --yes pnpm@11.9.0 -- repository:verify
npm exec --yes pnpm@11.9.0 -- verify
npm exec --yes pnpm@11.9.0 -- secret:scan
npm exec --yes pnpm@11.9.0 -- deps:policy
npm exec --yes pnpm@11.9.0 -- deps:licenses
npm exec --yes pnpm@11.9.0 -- actions:verify
git diff --check
git diff --stat
git status --short
```

`infra:start`, `infra:health`, `infra:stop`, and `infra:reset` require Docker Compose.

## Rollback

- Stop local services with `pnpm infra:stop` if they were started.
- Remove local volumes with `pnpm infra:reset` if synthetic local data was created.
- Revert `infra/local/`, `tools/local-infra/`, package scripts, unit tests, docs, and governance changes.
- No production resource, database, object, cloud, or deployment cleanup is required.

## Risks

- Live start/stop/health evidence has been validated on a Docker Compose-capable validation host.
- A local emulator can be mistaken for production object storage. Mitigation: runbook, Compose names, docs, and governance mark Moto as local synthetic only.
- Moto S3 behavior may diverge from real S3. Mitigation: P02-ISS-009 still owns signed URL adapter tests and provider review.
- Local ports can conflict with developer services. Mitigation: preflight port checks and documented overrides.
- Telemetry debug output can become noisy or sensitive if later apps send real payloads. Mitigation: synthetic-only rule and P02-ISS-011 redaction remains required.

## Decisions

- Use digest-pinned local container images only.
- Use Moto Server 5.2.2 as the P02-ISS-003 local S3-compatible emulator because it is Apache-2.0 and requires no LocalStack auth token or MinIO AGPL posture for this local mock scope.
- Keep local infrastructure scripts Docker-optional for static verification, but require Docker for runtime start/stop/health.
- Add `infra:verify` to the repository verification chain as a static check only.
- Do not add npm dependencies or change app/package boundaries.

## Completion evidence

Completed on 2026-06-30:

- Local harness files, scripts, docs, and unit tests were created.
- `node -v` returned `v24.18.0` when the repository was run through the pinned local Node bundle.
- `npm -v` returned `11.11.0` on the host shell and `pnpm` 11.9.0 was available through Corepack.
- `docker --version` returned `Docker version 29.5.3, build d1c06ef`.
- `docker compose version` returned `Docker Compose version v5.1.4`.
- `pnpm infra:verify` passed.
- `pnpm infra:doctor` passed.
- `pnpm infra:start` passed and the stack became healthy after correcting the local compose definitions.
- `pnpm infra:health` reported all local services healthy.
- `pnpm infra:stop` passed and removed the local stack cleanly.
- `pnpm test`, `pnpm test:integration`, `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm build`, `pnpm secret:scan`, `pnpm deps:policy`, `pnpm deps:licenses`, `pnpm actions:verify`, and `pnpm repository:verify` passed in the prior validation cycle for this issue.
- Repository browser validation inside `repository:verify` passed: e2e 10/10, accessibility 2/2, and visual 1/1.
- P02-ISS-004 remains NOT STARTED.
- No Git/GitHub write was performed.
