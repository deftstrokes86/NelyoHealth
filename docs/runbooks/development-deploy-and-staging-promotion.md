# Development Deploy and Staging Promotion Runbook

## Status

Draft Phase 2 runbook for `P02-ISS-017`.

This runbook governs synthetic-only development deployment and staging promotion workflow usage. It does not authorize production deployment or cloud resource mutation by Codex.

## Scope

- Development deploy path after human merge to `main`.
- Human-triggered staging promotion path based on candidate SHA and versioned artifact reference.
- Evidence and rollback requirements before promotion can be treated as successful.

## Preconditions

- `P02-ISS-016` deployment contract baseline is recorded.
- Required GitHub workflow files exist:
  - `.github/workflows/deploy-development.yml`
  - `.github/workflows/promote-staging.yml`
- Candidate build uses synthetic-only test and validation data.
- No production secrets or production data are present in logs or artifacts.

## Development deploy procedure

1. A human reviews and merges an approved pull request to `main`.
2. Confirm `Development deploy path` workflow starts on the merge push.
3. Validate workflow gates pass:
   - dependency install
   - release-readiness check
   - migration command gate
4. Review `Development Deploy Path` step summary and manifest output.
5. Record run ID, commit SHA, and outcome in governance evidence.

## Staging promotion procedure

1. A human selects the candidate commit SHA and versioned artifact reference.
2. Trigger `Staging promotion path` workflow via `workflow_dispatch`.
3. Provide `candidate_sha` and `candidate_version` inputs.
4. Validate workflow gates pass:
   - dependency install
   - release-readiness check
   - migration gate contract check
5. Review `Staging Promotion Path` step summary and manifest output.
6. Confirm required evidence is available before accepting promotion:
   - migration plan
   - rollback plan
   - dependency readiness
   - smoke/browser evidence

## Required evidence record

- GitHub run URL and run ID for development deploy.
- GitHub run URL and run ID for staging promotion.
- Candidate SHA and version reference.
- Confirmation that no cloud mutation step was executed by workflow.
- Confirmation that data and browser artifacts remain synthetic-only.

## Rollback procedure

1. Identify previous known-good candidate version.
2. Trigger staging promotion workflow for previous known-good candidate when rollback is approved by humans.
3. Execute documented migration rollback or compensating action per database runbook.
4. Record rollback evidence and reason in governance logs.

## Prohibited actions

- No production deployment.
- No cloud provider setting mutation.
- No creation or disclosure of live secrets in workflow logs.
- No production data in development or staging evidence.
- No autonomous merge, release publication, or promotion bypass.

## Related documents

- `docs/engineering/phase-2-environment-strategy.md`
- `docs/engineering/environment-and-deployment-baseline.md`
- `docs/exec-plans/P02-ISS-017-development-deploy-and-staging-promotion-path.md`
- `docs/governance/phase-2-requirements-traceability.md`