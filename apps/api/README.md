# @nelyohealth/api

Phase 2 NestJS API skeleton workspace.

## Current scope (P02-ISS-005)

- Provides health and readiness routes.
- Adds request and correlation ID middleware.
- Adds idempotency middleware for unsafe request fingerprints.
- Adds standardized API error envelopes through a global exception filter.

## Out of scope

- No auth, clinical, payment, provider matching, pharmacy, laboratory, or production behavior.
- No direct controller database access.
- No external provider calls from controllers.
