# Phase 2 ISS-017 CI and Workflow Pattern Map

## Purpose

Map existing repository CI and workflow patterns into reusable implementation guidance for `P02-ISS-017 - Development deploy and staging promotion path`.

This is a pattern map only. It does not create deployment automation, cloud resources, secrets, or promotion runtime behavior.

## Source workflows

| Source workflow | Path | Trigger pattern | Purpose pattern |
|---|---|---|---|
| Foundation CI | `.github/workflows/ci.yml` | `pull_request`, `push` on `main` | Deterministic verification gate before or after merge |
| Release readiness | `.github/workflows/release-readiness.yml` | `workflow_dispatch` | Manual, read-only release readiness checks |

## Repository workflow baseline patterns

### 1. Trigger model pattern

- Verification baseline: automatic workflow on PR and `main` push.
- Human-controlled baseline: explicit manual dispatch workflow for readiness checks.
- ISS-017 mapping: keep development deployment tied to human merge to `main`; keep staging promotion human-triggered.

### 2. Permissions pattern

- Existing workflows use least privilege: `permissions: contents: read`.
- No elevated token scopes are granted.
- ISS-017 mapping: deployment and promotion workflows should start with least privilege and only add narrow permissions where required by approved deployment mechanics.

### 3. Action pinning pattern

- External actions are pinned to immutable full commit SHAs.
- Current examples:
  - `actions/checkout@df4cb1c069e1874edd31b4311f1884172cec0e10`
  - `pnpm/action-setup@b0f76dfb45f55f8421693e4803ac7bb65143bd34`
  - `actions/setup-node@48b55a011bda9f5d6aeb4c2d9c7362e8dae4041e`
- ISS-017 mapping: preserve full-SHA pinning for every external action used by deployment or promotion workflows.

### 4. Runtime toolchain setup pattern

- Standard setup sequence:
  1. Checkout repository.
  2. Install pnpm pinned to `11.9.0`.
  3. Setup Node from `.node-version`.
  4. Install dependencies with `pnpm install --frozen-lockfile`.
- ISS-017 mapping: reuse this sequence for development deployment and staging promotion workflows.

### 5. Browser dependency pattern

- Existing workflows install Chromium with Playwright before browser/a11y/visual checks.
- ISS-017 mapping: any promotion gate requiring smoke/browser evidence should install browser dependencies in workflow before running evidence steps.

### 6. Verification command pattern

- Current workflows favor script-based orchestration in `package.json` rather than inline shell logic.
- Examples:
  - `pnpm repository:verify`
  - `pnpm design:verify`
  - `pnpm release:check`
- ISS-017 mapping: deployment workflows should call stable script entry points for migration gates, smoke checks, and release validation.

### 7. Read-only readiness pattern

- `release-readiness.yml` is manual and read-only, with no deploy or publish step.
- ISS-017 mapping: keep a manual non-deploy promotion validation path even after deployment workflows are added.

### 8. Governance and safety pattern

- Workflows are constrained by repository governance:
  - no auto-merge
  - no automatic release publication
  - no deployment without explicit authorization
  - manual Git and GitHub writes are human-only
- ISS-017 mapping: deployment workflow design must preserve human gate semantics and avoid autonomous promotion behavior.

## Pattern-to-ISS-017 implementation matrix

| ISS-017 need | Reuse from existing patterns | Constraint to preserve |
|---|---|---|
| Dev deployment after merge to main | `push` on `main` trigger model from `ci.yml` | Must remain human-merge initiated |
| Staging promotion path | Manual dispatch model from `release-readiness.yml` | Promotion remains human-triggered |
| Deterministic environment setup | Shared Node/pnpm setup sequence | Keep exact pinned tool versions |
| Promotion quality gates | Script-first verification pattern | Reuse existing root scripts where possible |
| Security posture | Least-privilege permissions and SHA-pinned actions | Do not introduce broad token scopes |
| Auditability | Manual readiness workflow pattern | Preserve read-only validation path |

## Gaps to close in ISS-017 implementation

- No deployment workflow file currently exists for development deployment.
- No staging promotion workflow file currently exists.
- No deployment runbook currently exists under `docs/runbooks/` for development/staging promotion.
- No workflow-level migration gate command exists yet for deployment promotion.

## Proposed ISS-017 file targets

- `.github/workflows/deploy-development.yml`
- `.github/workflows/promote-staging.yml`
- `docs/runbooks/development-deploy-and-staging-promotion.md`

These targets remain implementation proposals and require the same governance and human-gate constraints documented above.