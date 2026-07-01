# Environment and Deployment Baseline

## Status

Approved Phase 2 foundation deployment baseline for local, development, and staging readiness.

Cloud/deployment model is now recorded: Supabase is the primary platform, Hostinger shared hosting is the selected web-hosting surface, and API/worker runtime uses Supabase Edge Functions and scheduled jobs.

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

- Supabase is the selected platform for Postgres and signed URL object storage.
- Hostinger shared hosting is selected for web hosting where shared hosting applies.
- API/worker runtime is Supabase Edge Functions plus scheduled jobs.
- Redis-compatible queue/cache uses a managed Redis-compatible service (recommended: Upstash).
- Observability baseline is platform logs plus structured app logs; self-hosted observability expansion is deferred.
- IaC for the current phase uses documented manual steps; OpenTofu and Pulumi remain future automation candidates, and Terraform remains review-required.
- Development and staging remain evidence-gated targets until controlled deployment/promotion evidence is captured.
- Any future IaC implementation must preserve the synthetic-only data rule and the separation between local, development, staging, production, and partner sandbox boundaries.

## Initial implementation checklist

- Define the environment variable catalog.
- Define the synthetic secrets strategy.
- Define the local service startup and healthcheck story.
- Define the promotion path from development to staging.
- Define the rollback path for app artifacts and migrations.
- Define the human-gated cloud/IaC approval checkpoint before deployment automation begins.
