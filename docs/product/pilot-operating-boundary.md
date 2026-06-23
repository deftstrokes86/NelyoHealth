# NelyoHealth Pilot Operating Boundary (P00-02)

## Document control

- Document: Pilot operating boundary
- Codex prompt ID: P00-02
- Complete Breakdown work package: P00-03
- Issue ID: P00-PRD-002
- Owner role: Product + Clinical + Operations
- Review state: PROPOSED
- Required reviewers: Product owner, Clinical lead, Operations lead, Privacy counsel, Legal counsel
- Last updated: 2026-06-23
- Related decisions: REQ-SCOPE-001 to REQ-SCOPE-018; REQ-LOCK-003 to REQ-LOCK-007

## Geographic boundary

- **Pilot geography**: One controlled Nigerian service area in a defined state/city/region.
- **Exact launch geography**: `BLOCKED-PENDING-REVIEW` until legal and clinical approvals confirm local operations and data-handling obligations.
- **Service-area enforcement**: System-level service boundary checks on patient registration, provider matching, and payment routing, enforced by server policy and not just UI text.
- **Provider service zones**: Selected providers must be mapped to the same operational service area for safety and logistics.
- **Patient-location handling**: Location used only to enforce service eligibility and safety routing.
- **Referral behavior outside service area**: Provide safe referral handoff guidance and denial messaging; no claims or fulfillment outside the approved service boundary.
- **Emergency behavior outside service area**: Emergency escalation is always allowed and must provide guidance for nearest available pathway without waiting on geography approval.

## Participant boundary

### Included in pilot

- Adult patients in the controlled market.
- Doctors in the selected and verified pool for primary-care routines.
- Pharmacy and laboratory partners from the approved pilot catalogue.
- Referral facilities with explicit referral arrangements and documented handoff criteria.
- Family payers and family-plan administrators with no implicit clinical visibility.
- Diaspora sponsors with explicit consent and payer-only authority.
- Operations staff with bounded exception and queue permissions.

### Deferred in pilot

- Minors and full guardian clinical handling (kept architecture-safe only).
- HMOs and employer tenants in runtime mode.
- Home-care agencies and home-care workers.
- Full provider self-service marketplace enrollment.

## Operational boundary

- **Controlled provider onboarding**: Manual/assisted onboarding only for pre-approved doctors, pharmacists, and laboratories.
- **Credential verification**: Required before each partner appears in active matching sets.
- **Service hours**: Production hours are controlled by operations policy and are `BLOCKED-PENDING-REVIEW` until explicit staffing and reliability decision.
- **Support coverage**: Incident intake and escalation coverage is defined for pilot services only; extended 24/7 operations are deferred.
- **Incident escalation**: Includes failed payment, failed matching, failed delivery, failed referral handoff, failed logistics, and critical-result escalation.
- **Refund operations**: Initiation and state capture in payment ledger with clinician-agnostic restrictions on details re-disclosure.
- **Provider suspension**: Immediate suspension path and reassignment where possible.
- **Failed fulfilment**: Retry, rebook, and safe customer communication with bounded retry windows.
- **Manual exception handling**: Operations staff tools for manual correction without direct production database editing.
- **Direct database edits for routine operations**: Prohibited in pilot; all routine changes must route through workflow and audit logs.

## Clinical boundary

- Included: Routine adult outpatient teleconsultation, primary care, standard follow-up, routine referrals, and urgent non-critical transfer pathways.
- Excluded without review: Pediatric care, mental-health crisis care, inpatient and complex chronic-care pathways, controlled/dangerous medicines, and cross-border medication delivery.
- Marked `BLOCKED-PENDING-REVIEW` until final clinical/governance approval:
  - Detailed inclusion/exclusion symptom lists
  - Initial medication catalogue
  - Initial laboratory catalogue
  - Exact specialist scope
  - Emergency referral operating protocol

## Technology boundary

- **Client channels**: Responsive patient, doctor/provider, and operations web applications only.
- **Devices and browsers**: Desktop, tablet, and mobile browser support required in web stack; no native mobile implementation in this prompt.
- **Low-bandwidth behavior**: Reduced media mode and resilient retry handling required for degraded network conditions.
- **Audio fallback**: Required for consultation continuity.
- **No native mobile in pilot**: Native mobile platforms are out of pilot scope and remain deferred.
- **Browser testing expectations**: Web journeys must include accessibility, focus order, network failure visibility, and privacy-boundary checks for pilot-critical flows.
- **Phase 0 tooling boundary**: No dependency install or browser tooling implementation in P00-02.

## Data and privacy boundary

- **Synthetic data**: Only synthetic test data for preparation and planning exercises.
- **Payer/clinical separation**: Payer authority never implies record-viewing authority by default.
- **Provider-detail obscuration**: Before successful payment, only approved non-identifying fields may be shown.
- **Tenant isolation**: Tenant context required on every service and admin route.
- **Consent**: Funding and clinical-consent states remain explicit and separate.
- **Audit**: All disclosure and access events must be auditable.
- **Restricted notification content**: No protected clinical or provider location data in notifications beyond required minimums.
- **Storage boundary**: No production PHI copied into lower environments without policy and approved transfer controls.

## Financial boundary

- **Payment provider**: Licensed provider dependency is `BLOCKED-PENDING-REVIEW` until explicit final selection.
- **Internal ledger**: Required for payment and settlement integrity.
- **Reconciliation**: Required for each pilot payment path and failure/reversal path.
- **Refunds**: Explicitly handled with state-driven reversibility constraints.
- **No unapproved stored-value custody**: Patient or payer balances are not treated as proprietary financial custody products.
- **Family/diaspora payment**: Supported with funded-role controls.
- **Employer/HMO funding**: Architecture modeled only; live employer/HMO funding deferred unless explicitly approved.

## Emergency boundary

- Pilot is not an emergency medical service or ambulance dispatcher.
- Emergency escalation never blocked by payment, marketplace comparison, registration, or ordinary booking logic.
- Emergency pathways leave ordinary comparison and plan-authorization workflows.
- Provider-detail obscuration cannot block emergency guidance and triage handoffs.
- Exact operational emergency protocol is owned by P00-09 / P00-12 and remains a high-priority external review output.
