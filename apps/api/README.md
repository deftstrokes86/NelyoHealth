# @nelyohealth/api

Phase 2 and early Phase 3 API contract scaffold workspace.

## Current scope

- Provides health and readiness routes.
- Adds request and correlation ID middleware.
- Adds idempotency middleware for unsafe request fingerprints.
- Adds standardized API error envelopes through a global exception filter.
- Adds deterministic authentication decision scaffolds for Step 2 capabilities:
	- password and passwordless login checks
	- OTP challenge handling
	- provider and admin MFA requirements
	- suspicious-login denial path
	- login rate-limit denial path
	- account-recovery challenge path
	- phone-change OTP workflow path
	- session and trusted-device action intents
- Adds deterministic tenancy and organization-control decision scaffolds for Step 3 capabilities:
	- tenant context validation per request
	- organization membership presence and status checks
	- role-assignment and facility-scope checks
	- explicit tenant-switch challenge and switch decision intent
	- invitation acceptance, suspension, and offboarding lifecycle decisions
	- immediate session-revoke intent for suspension and offboarding

## Out of scope

- No production authentication, cryptography, token issuance, persistence, or external identity provider integration.
- No production tenancy persistence, invitation delivery, membership directory integration, or cross-service tenant enforcement.
- No direct controller database access.
- No external provider calls from controllers.
