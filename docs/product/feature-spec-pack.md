# Feature Specification Pack

## Status

Draft initial feature blueprint for the later implementation phases.

## Scope

This pack defines the first implementation-ready feature clusters that should be specified before broad feature buildout begins.

## Phase clusters

### Phase 3 — Identity, accounts, organizations, and tenancy
- Goal: create a consistent identity and organization model for users, patients, providers, and organizations.
- Main workflows:
  - account registration,
  - organization membership,
  - role assignment,
  - tenancy context resolution.
- Acceptance notes:
  - one longitudinal patient identity,
  - distinct Person, UserAccount, and Patient concepts,
  - no payer-based access escalation.

### Phase 4 — Authorization, consent, guardianship, and audit
- Goal: enforce access boundaries and audit every meaningful state change.
- Main workflows:
  - consent capture,
  - guardian or delegate authorization,
  - audit event emission,
  - access denial and escalation review.
- Acceptance notes:
  - authorization decisions are explicit and testable,
  - clinical access is never granted by payment status.

### Phase 5 — Design system and application shells
- Goal: deliver consistent web and mobile shells with typed client wiring.
- Main workflows:
  - patient shell navigation,
  - provider shell navigation,
  - admin and organization shell navigation,
  - shared layout and state handling.
- Acceptance notes:
  - responsive behavior,
  - accessibility basics,
  - synthetic-only browser validation.

### Phase 6 — Patient, family, guardian, and diaspora core
- Goal: support primary patient journeys and family or guardian participation.
- Main workflows:
  - patient onboarding,
  - selecting care paths,
  - family or guardian participation,
  - diaspora-specific support flows.
- Acceptance notes:
  - privacy boundaries are preserved,
  - sensitive provider details remain protected until payment.

### Phase 7 — Provider, practitioner, and facility registry
- Goal: support provider and facility discovery with controlled display rules.
- Main workflows:
  - provider search and selection,
  - facility information display,
  - provider metadata handling.
- Acceptance notes:
  - pre-payment provider identity exposure is limited to approved display name data.

### Phase 8 — Service catalogue, pricing, payments, and ledger
- Goal: support quotes, payments, and ledger-backed settlement.
- Main workflows:
  - service quoting,
  - payment initiation,
  - payment success and failure,
  - ledger posting.
- Acceptance notes:
  - payment does not grant access unless the workflow allows it,
  - no provider detail leakage before payment.

### Phase 9 — Scheduling, availability, intake, and triage
- Goal: support booking and triage workflows.
- Main workflows:
  - availability discovery,
  - booking,
  - intake capture,
  - triage routing.
- Acceptance notes:
  - booking and triage remain auditable,
  - emergency flows remain available.

### Phase 10 — Video consultation and clinical encounter
- Goal: support secure consultation and encounter capture.
- Main workflows:
  - consultation start,
  - encounter recording,
  - follow-up action creation.
- Acceptance notes:
  - clinical decisions remain with qualified clinicians,
  - sensitive content handling is explicit.

## Implementation note

Each cluster should later be broken into smaller implementation issues with their own contract, test, and deployment notes.
