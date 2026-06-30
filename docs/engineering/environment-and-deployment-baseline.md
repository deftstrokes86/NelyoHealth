# Environment and Deployment Baseline

## Status

Draft provider-neutral deployment contract baseline for local, development, and staging readiness.

Cloud provider selection remains human-decision gated. The baseline records the contract shape now so later deployment automation can be implemented without revisiting the Phase 2 environment rules.

## Target environments

### Local
- Purpose: developer validation and browser-based local testing.
- Required services:
  - Postgres/PostGIS,
  - Redis-compatible queue/cache service,
  - object storage emulator,
  - observability collector,
  - synthetic seed data.

### Development
- Purpose: automated integration and preview validation.
- Required capabilities:
  - deployment from mainline changes,
  - migration apply and rollback path,
  - synthetic environment configuration,
  - log and trace correlation.

### Staging
- Purpose: release rehearsal and controlled validation.
- Required capabilities:
  - promotion from development,
  - migration rehearsal,
  - observability and rollback evidence,
  - synthetic test data only.

## Environment configuration model

Each environment should expose a typed configuration surface with:

- required variables,
- optional variables,
- example values,
- validation behavior,
- and secret handling rules.

## Required configuration categories

- application runtime configuration,
- database connection configuration,
- queue and cache configuration,
- object storage configuration,
- observability configuration,
- feature flags and provider adapters,
- secrets and credential references.

## Deployment expectations

- Deployments must be repeatable and auditable.
- Database migrations must be part of release execution.
- Rollback must be documented and testable.
- No production secret should be introduced into local or synthetic environments.

## Deployment contract

- The deployment contract is provider-neutral until a human cloud decision is recorded.
- OpenTofu remains the preferred IaC candidate, Pulumi remains a candidate, and Terraform remains review-required.
- No cloud provider, cloud account, or IaC skeleton is selected by this baseline.
- Development and staging remain planning targets only until later deployment workflow implementation is authorized.
- Any future IaC implementation must preserve the synthetic-only data rule and the separation between local, development, staging, production, and partner sandbox boundaries.

## Initial implementation checklist

- Define the environment variable catalog.
- Define the synthetic secrets strategy.
- Define the local service startup and healthcheck story.
- Define the promotion path from development to staging.
- Define the rollback path for app artifacts and migrations.
- Define the human-gated cloud/IaC approval checkpoint before deployment automation begins.
