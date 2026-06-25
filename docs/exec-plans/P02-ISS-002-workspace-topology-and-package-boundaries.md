# P02-ISS-002 Workspace Topology and Package Boundaries Execution Plan

## Objective

Execute `P02-ISS-002 - Workspace topology and package boundaries` exactly as defined in `docs/engineering/phase-2-issue-backlog.md`.

Create the approved `apps/` workspace and shared package boundaries with nested instructions, private workspace manifests, build/typecheck wiring, and validation evidence, without implementing product features or runtime frameworks.

## Existing context

- Phase 0: PHASE-0-CONDITIONAL-PASS.
- Phase 1: PHASE-1-CONDITIONAL-PASS.
- P02-PLAN-001: ACCEPTED.
- P02-ISS-001: ACCEPTED by the P02-ISS-002 execution prompt.
- P02-ISS-002 may begin.
- P02-ISS-003 remains NOT STARTED.
- Phase 3 remains NOT STARTED.
- Pilot launch remains PILOT-NO-GO.
- Git and GitHub writes remain HUMAN-ONLY.

The repository already contains Phase 1 tooling, design/content/UI foundation packages, accepted Phase 2 planning docs, and P02-ISS-001 ADR/dependency decisions. P02-ISS-002 is the first issue that creates `apps/` and the Phase 2 shared package boundary set.

## Scope

- Add `apps/*` to the pnpm workspace.
- Create approved boundary-only app workspaces:
  - `apps/api`
  - `apps/worker`
  - `apps/patient-web`
  - `apps/provider-web`
  - `apps/organization-web`
  - `apps/admin-web`
  - `apps/mobile`
- Create approved boundary-only shared package workspaces:
  - `packages/api-client`
  - `packages/config`
  - `packages/domain`
  - `packages/observability`
  - `packages/platform-adapters`
  - `packages/testing-factories`
- Add nested `AGENTS.md` guidance under `apps/` and each app.
- Add private package manifests, `tsconfig.json`, README public-boundary notes, and tiny boundary exports.
- Wire root typecheck/build and package-policy checks to include the new workspaces.
- Add deterministic topology unit tests.
- Update status, traceability, governance registers, and applicable engineering docs.

## Non-goals

- No NestJS, Next.js, Expo, React Native, database, queue, object storage, OpenTelemetry, OpenFeature, or vendor SDK installation.
- No routes, controllers, DTOs, API endpoints, web pages, mobile shell runtime, worker jobs, queues, retries, DLQ, schemas, migrations, seeds, reset, containers, infrastructure, deployment, auth, tenancy, clinical, payment, provider matching, pharmacy, laboratory, admin/support workflow, or pilot behavior.
- No production data, production secrets, production origin, package publication, release, tag, deployment, PR, commit, push, GitHub setting change, or GitHub API write.
- No P02-ISS-003 or later issue implementation.

## Source documents

- `AGENTS.md`
- `docs/AGENTS.md`
- `packages/AGENTS.md`
- `tests/AGENTS.md`
- `.agent/PLANS.md`
- `docs/exec-plans/P02-platform-and-infrastructure-foundation.md`
- `docs/engineering/phase-2-issue-backlog.md`
- `docs/governance/phase-2-requirements-traceability.md`
- `docs/engineering/phase-2-technology-evaluation.md`
- `docs/engineering/phase-2-application-topology.md`
- `docs/engineering/phase-2-environment-strategy.md`
- `docs/engineering/phase-2-local-infrastructure-plan.md`
- `docs/engineering/phase-2-browser-harness-plan.md`
- P02-ISS-001 execution plan, dependency decision pack, ADR checklist, and ADR-P02-001 through ADR-P02-006
- `docs/STATUS.md`
- governance registers
- architecture docs and referenced ADRs
- repository manifests, TypeScript, ESLint, CI, Playwright, and Codex config

## Locked rules

- Preserve one longitudinal Patient identity and distinct Person, UserAccount, and Patient concepts.
- Payer status does not grant clinical access.
- Emergency care is not blocked by payment.
- Finalized clinical records use amendments or versions.
- `providerDisplayName` is the only pre-payment pharmacy or laboratory identity field.
- Protected provider data is removed server-side before serialization.
- Post-payment disclosure is exact-order and authorization scoped.
- `OrderFundingSecured` does not expose provider details by itself.
- Clinical decisions remain with qualified clinicians.
- No production PHI in analytics, session replay, logs, tests, browser artifacts, or scaffold docs.
- No routine production database editing.
- Vendor SDK types remain behind adapters.
- Synthetic data only outside production.
- Browser validation remains interactive plus deterministic when browser surfaces are added.
- Git and GitHub writes remain human-only.

## Files affected

Created:

- `apps/AGENTS.md`
- app boundary packages under `apps/api`, `apps/worker`, `apps/patient-web`, `apps/provider-web`, `apps/organization-web`, `apps/admin-web`, and `apps/mobile`
- shared boundary packages under `packages/api-client`, `packages/config`, `packages/domain`, `packages/observability`, `packages/platform-adapters`, and `packages/testing-factories`
- `tests/unit/workspace-topology.spec.ts`
- `docs/exec-plans/P02-ISS-002-workspace-topology-and-package-boundaries.md`

Updated:

- `.gitignore`
- `package.json`
- `pnpm-workspace.yaml`
- `pnpm-lock.yaml`
- `tsconfig.base.json`
- `tools/checks/package-policy.mjs`
- `README.md`
- `CONTRIBUTING.md`
- `docs/engineering/phase-2-application-topology.md`
- `docs/STATUS.md`
- governance registers and traceability docs

## Dependency changes

No external dependency is added.

P02-ISS-002 adds private workspace importers and updates `pnpm-lock.yaml` to recognize the new dependency-free workspaces. All new package manifests are exact-version, private, publish-disabled by policy, and contain no dependency fields.

## Architecture impact

The approved Phase 2 topology now exists as repository directories and private workspaces. Runtime implementation remains deferred to the owning P02 issues.

The app/package boundaries preserve the modular-monolith direction, adapter isolation, vendor SDK restrictions, and synthetic-only lower-environment requirements.

## Data-model impact

None. No schema, migration, model, entity, fixture, seed, reset, database package, or database container is created.

## API impact

None. `apps/api` is a boundary-only workspace and does not contain controllers, routes, DTOs, OpenAPI output, request handling, or framework configuration.

## UI impact

None. Web and mobile directories are boundary-only. No route, page, component, browser storage, visual output, motion, accessibility surface, or content surface is created.

## Privacy and security impact

- New app and package instructions prohibit real data, PHI, protected provider details, secrets, production origins, and live provider integrations.
- Package policy now scans `apps/*` as well as `packages/*` and `tools/*`.
- New manifests contain no runtime dependencies or lifecycle install scripts.
- Vendor-specific types remain absent from shared package APIs.

## Environment impact

No environment variables, secrets, local services, containers, cloud resources, deployment workflows, production origins, or partner sandbox behavior are created.

The workspace topology prepares later local/development/staging work but does not implement it.

## Browser scenarios

No browser-visible route, page, preview, or shell is created. Interactive browser inspection is not issue-specific for P02-ISS-002.

Existing repository browser, accessibility, and visual checks remain part of `repository:verify` and `verify`.

## Tests

Added `tests/unit/workspace-topology.spec.ts` to validate:

- approved app directories are registered in `pnpm-workspace.yaml`;
- new app and shared package manifests are private and dependency-free;
- no lifecycle install scripts exist;
- boundary modules are explicitly `boundary-only`;
- nested app `AGENTS.md` files exist.

## Milestones

1. Read P02-ISS-002 prompt, backlog, instructions, Phase 2 docs, P02-ISS-001 outputs, governance registers, ADRs, architecture docs, and repository manifests.
2. Add workspace globs, package-policy scanning, TypeScript include paths, and root build/typecheck wiring.
3. Create app and shared package boundary scaffolds.
4. Add topology contract test.
5. Update documentation and governance.
6. Run install, validation, diff checks, and status review.
7. Report completion or blockers.

## Validation commands

```bash
git status --short
node -v
npm -v
npm exec --yes pnpm@11.9.0 -- -v
npm exec --yes pnpm@11.9.0 -- install
npm exec --yes pnpm@11.9.0 -- install --frozen-lockfile
npm exec --yes pnpm@11.9.0 -- format:check
npm exec --yes pnpm@11.9.0 -- lint
npm exec --yes pnpm@11.9.0 -- typecheck
npm exec --yes pnpm@11.9.0 -- test
npm exec --yes pnpm@11.9.0 -- test:integration
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

Browser/a11y/visual commands are not issue-specific because no browser surface changed, but they are still covered by repository verification.

## Rollback

Rollback is filesystem and manifest-only:

- remove the new `apps/*` and shared package boundary directories;
- remove `apps/*` from `pnpm-workspace.yaml`;
- revert root build/typecheck/package-policy/TypeScript wiring;
- revert lockfile importer entries;
- remove topology contract test;
- revert related documentation and governance register updates.

No runtime, database, container, object storage, cloud, browser artifact, or deployment cleanup is required.

## Risks

- Boundary packages could be mistaken for runtime implementation. Mitigation: README, `AGENTS.md`, boundary exports, tests, and status docs all mark them as boundary-only.
- Package policy could miss app manifests. Mitigation: package-policy scanning now includes `apps/*`.
- Later issues could add dependencies outside their owning app/package. Mitigation: root package policy, exact pins, and ADR references remain required.
- Local host Node may differ from repository-pinned Node 24.18.0 during validation.

## Decisions

- P02-ISS-002 creates private dependency-free workspaces only.
- Root `build` and `typecheck` include topology workspaces.
- Package policy scans `apps/*`.
- No new ADR is required because ADR-P02-001 through ADR-P02-006 already cover the relevant architecture decisions.

## Completion evidence

Completed on 2026-06-25:

- P02-ISS-002 boundary workspaces created under `apps/*` and the approved shared package directories.
- Workspace manifests, TypeScript includes, build/typecheck scripts, package policy scanning, and `pnpm-lock.yaml` importer entries updated.
- Topology unit test created in `tests/unit/workspace-topology.spec.ts`.
- Governance, status, application topology, traceability, risk, decision, document, dependency, and change-log documentation updated.
- `npm exec --yes pnpm@11.9.0 -- run repository:verify` passed.
- `git diff --check` passed with Windows line-ending normalization warnings only.
- Placeholder/version shortcut scan found no new package-manager shortcuts or unresolved placeholders in the touched scope; the only `@latest` match is an existing governance sentence documenting that `@latest` is not used.
- New app/shared package manifests contain no dependency, dev dependency, peer dependency, or optional dependency fields.
- New app/shared package TypeScript boundary files contain no imports, environment reads, network calls, browser storage access, or provider-specific runtime calls.
- No Git/GitHub write was performed: no commit, push, PR, tag, release, deploy, or settings change.
- No external dependencies added.
- No runtime app, database, infrastructure, browser route, production data, or later issue implementation created.

Validation note: the local host runs Node `v25.8.1`; repository policy still records Node `24.18.0` as the intended pinned runtime. Validation passed with pnpm's existing unsupported-engine warning.
