# Production Readiness Compliance Checklist

## Status

Draft acceptance checklist for clinical, privacy, legal, and operational readiness.

## Core review areas

### Privacy and data handling
- No PHI in logs, analytics, browser snapshots, or synthetic fixtures.
- Protected provider details remain hidden until authorized payment completion.
- Pre-payment responses expose only approved display-name information.
- Post-payment disclosure is scoped to the authorized order.

### Authorization and consent
- Access is explicitly checked for every sensitive operation.
- Consent state is visible and auditable.
- Guardians, sponsors, and delegated actors receive only the permissions granted to them.

### Clinical safety
- Clinical decisions remain with qualified clinicians.
- Record changes use amendment or versioning semantics.
- Emergency access is not blocked by payment or normal authorization gates.

### Operational readiness
- Monitoring, telemetry, and tracing are present.
- Rollback and incident handling are documented.
- Health, readiness, and dependency checks are available.

### Release readiness
- Browser tests and deterministic tests are passing.
- Deployment promotion evidence exists.
- Human approvals are recorded for gated decisions.

## Implementation rule

No feature should be considered complete until the relevant checklist items have been reviewed and verified.
