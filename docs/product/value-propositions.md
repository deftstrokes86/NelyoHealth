# NelyoHealth Value Propositions

## Scope

This document is part of `P00-01` and supports `P00-PRD-001`. It defines value at the participant level while preserving a single patient-oriented care model.

Legend:

- `Allowed` = fields that may be surfaced in a patient-facing context by policy and legal basis.
- `Restricted` = fields that may be surfaced only with explicit authorization and workflow scope.

## Individual patients

- **Role in ecosystem:** core care subject and clinical beneficiary.
- **Primary problems:** fragmented handoff between consultation, fulfilment, and closure; confusion on funding status; privacy concerns.
- **Jobs to be done:** find and complete safe care in one continuity path.
- **Proposed value:** clear care journey and visible state transitions.
- **Evidence/capability required:** deterministic journey IDs, state machine discipline, and post-payment access control.
- **Information they may access:** plan/patient appointment status, payment status for own orders, providerDisplayName pre-payment, and final clinical outcomes per authorized scope.
- **Information they must not automatically access:** other people’s records, unauthorized clinical summaries, provider identifiers before payment.
- **Likely adoption barrier:** trust in privacy and closure reliability.
- **Pilot validation signal:** completion of at least one full consult-to-result path without manual intervention.
- **Product promises not to make prematurely:** guaranteed outcomes, guaranteed cure rates, guaranteed provider availability, guaranteed emergency replacement as a substitute service.

## Family-plan administrators

- **Role:** payer and support coordinator for a household cluster.
- **Primary problems:** cost management for multiple members with varying authorization needs.
- **Jobs to be done:** fund and monitor eligible services without assuming clinical ownership.
- **Proposed value:** billing coordination and entitlement management over a consistent patient-level model.
- **Evidence/capability required:** relationship graph and budget/limits enforcement.
- **Information they may access:** coverage status, spend summaries, authorization outcomes.
- **Information they must not automatically access:** protected clinical notes, test results, prescriptive details.
- **Adoption barrier:** fear of overstepping legal consent boundaries.
- **Pilot validation signal:** no unauthorized clinical access events while billing coordination succeeds.
- **Promise restraint:** no claim that administrator access equals clinical access.

## Family members and dependants

- **Role:** care recipients/follow-up participants.
- **Primary problems:** inability to navigate plans quickly during urgent needs.
- **Jobs to be done:** access support while maintaining age- and consent-related boundaries.
- **Proposed value:** patient-led enrollment and journey continuity.
- **Evidence/capability required:** age-aware role governance and guardian workflows.
- **Information they may access:** role-appropriate status and scheduling views.
- **Information they must not automatically access:** restricted clinical records without legal basis.
- **Adoption barrier:** unclear minor/consent transition rules.
- **Pilot signal:** successful dependent activation and revocation handling.
- **Promise restraint:** no default assumptions of full clinical visibility.

## Guardians

- **Role:** delegated care support for minors or dependent adults as defined by policy.
- **Primary problems:** uncertain legal scope and rapid response needs.
- **Jobs to be done:** manage care authorization and safety boundaries.
- **Proposed value:** clear delegated authority with explicit limits.
- **Evidence/capability required:** guardian verification and dispute/rescission workflow.
- **Information they may access:** relationship-scoped non-clinical and clinically authorized care signals.
- **Information they must not automatically access:** full records without authorization.
- **Adoption barrier:** legal inconsistency across age and consent frameworks.
- **Pilot signal:** guardian actions audited with correct completion and error paths.
- **Promise restraint:** no guardian override of clinician judgment.

## Diaspora sponsors

- **Role:** off-shore financial support and coordination actor.
- **Primary problems:** distance and control ambiguity.
- **Jobs to be done:** fund care and track outcomes without data overreach.
- **Proposed value:** transparent sponsored-payment workflows and non-clinical reporting.
- **Evidence/capability required:** cross-border policy handling and audit trails.
- **Information they may access:** spending and entitlement summary for their authorized sponsorship.
- **Information they must not automatically access:** diagnosis, notes, prescriptions, and raw clinical attachments.
- **Adoption barrier:** cross-border compliance uncertainty.
- **Pilot signal:** sponsor actions complete without clinical-data bleed.
- **Promise restraint:** no claim to sponsor clinical access rights.

## Employers

- **Role:** employee welfare or benefits administrator.
- **Primary problems:** balancing benefit scope, privacy, and support.
- **Jobs to be done:** provide benefits, verify utilization patterns, and support employees.
- **Proposed value:** clean separation between administration and clinical records.
- **Evidence/capability required:** role matrices and non-clinical reporting APIs.
- **Information they may access:** payroll-like payment/reconciliation views as approved.
- **Information they must not automatically access:** protected clinical records and provider location details pre-payment.
- **Adoption barrier:** concern about legal obligations around health data.
- **Pilot signal:** no unauthorized clinical visibility with operational reporting success.
- **Promise restraint:** no employer "view all patient records" promise.

## Employees

- **Role:** direct users of employer or subsidy programs.
- **Primary problems:** confusion over personal vs. employer rights.
- **Jobs to be done:** receive care access while preserving privacy.
- **Proposed value:** transparent ownership model and role clarity.
- **Evidence/capability required:** per-user entitlement and consent surfaces.
- **Information they may access:** their own journey and authorized billing context.
- **Information they must not automatically access:** coworker records and unrelated clinical content.
- **Adoption barrier:** fear that accepting employer support reduces privacy.
- **Pilot signal:** low support load from privacy confusion.
- **Promise restraint:** no claim of automatic privacy waiver by employment.

## HMOs

- **Role:** benefit administrator and network policy authority.
- **Primary problems:** aligning coverage with clinical workflows.
- **Jobs to be done:** enforce benefit rules without clinical substitution.
- **Proposed value:** policy-driven coverage checks and auditable exceptions.
- **Evidence/capability required:** HMO-specific policy engine and approval states.
- **Information they may access:** approved scope and spend summaries.
- **Information they must not automatically access:** diagnostic and treatment records beyond agreed basis.
- **Adoption barrier:** policy interpretation and claims mapping complexity.
- **Pilot signal:** controlled authorization path success with no clinical overreach.
- **Promise restraint:** no HMO-only claim for full clinical custody.

## Doctors

- **Role:** clinical providers and decision makers.
- **Primary problems:** incomplete administrative context and unsafe commercial pressure.
- **Jobs to be done:** deliver clinically appropriate care with continuity.
- **Proposed value:** integrated care loop that supports follow-up and prescriptions securely.
- **Evidence/capability required:** patient-safe workflows and no implicit payer overrides.
- **Information they may access:** clinically authorized patient records and care tasks.
- **Information they must not automatically access:** unrelated payer/internal financing details unless needed.
- **Adoption barrier:** workflow friction and administrative complexity.
- **Pilot signal:** minimal manual exceptions for routine cases.
- **Promise restraint:** no promise that platform can replace clinical judgment.

## Pharmacies

- **Role:** fulfillment partner.
- **Primary problems:** order ambiguity, wrong disclosure timing, and payment mismatch.
- **Jobs to be done:** fulfil valid prescriptions safely.
- **Proposed value:** exact order-scoped state model and secure handoff.
- **Evidence/capability required:** order-scoped authorization and post-payment disclosure controls.
- **Information they may access:** operational fulfillment instructions for authorized orders.
- **Information they must not automatically access:** pre-payment patient financial and unrelated order details outside scope.
- **Adoption barrier:** integration complexity and release logic reliability.
- **Pilot signal:** zero pre-payment disclosure of protected provider fields.
- **Promise restraint:** no guarantee of instant fulfillment across all medicine classes.

## Laboratories

- **Role:** diagnostic partner.
- **Primary problems:** delayed result workflows and patient notification uncertainty.
- **Jobs to be done:** process test orders and return results with critical-result escalation.
- **Proposed value:** order-scoped intake and result handoff model.
- **Evidence/capability required:** secure result state transitions and alert workflows.
- **Information they may access:** authorized lab order details and escalation outputs.
- **Information they must not automatically access:** unrelated clinical narratives and unrelated patient journeys.
- **Adoption barrier:** critical-result integration reliability.
- **Pilot signal:** consistent result acknowledgment and escalation.
- **Promise restraint:** no promise of unlimited test catalog in pilot.

## Hospitals

- **Role:** referral and higher-acuity care partner.
- **Primary problems:** unreliable referral continuity and incomplete transfer context.
- **Jobs to be done:** accept escalations and complete referral loops.
- **Proposed value:** referral outputs with auditable handoff records.
- **Evidence/capability required:** referral payload standards and closure status transitions.
- **Information they may access:** referral-specific clinical and administrative packets where authorized.
- **Information they must not automatically access:** unrelated payer or patient scope data.
- **Adoption barrier:** workflow misalignment and data format variance.
- **Pilot signal:** reliable urgent referral conversion with audit logs.
- **Promise restraint:** no claim to full referral replacement for emergency services.

## Home-care agencies

- **Role:** scheduled or skilled support providers.
- **Primary problems:** fragmented assignment and unclear boundaries.
- **Jobs to be done:** receive assignment context and execute within strict scope.
- **Proposed value:** structured visit/task management and exception reporting.
- **Evidence/capability required:** assignment, location-safe context gating, check-in/out states.
- **Information they may access:** role-limited care instructions for assigned cases.
- **Information they must not automatically access:** unrelated PHI or undisclosed location/provider details.
- **Adoption barrier:** low connectivity and route complexity.
- **Pilot signal:** stable execution under exception scenarios.
- **Promise restraint:** no promise of autonomous scheduling across all care types.

## Home-care workers

- **Role:** field operator in care tasks.
- **Primary problems:** unclear task scope and incomplete updates.
- **Jobs to be done:** complete assigned visit tasks and report outcomes.
- **Proposed value:** operational task checklists and secure handoff.
- **Evidence/capability required:** worker-level authorization and audit of delivery/follow-up.
- **Information they may access:** task-specific care context only.
- **Information they must not automatically access:** complete clinical records and unrelated patient context.
- **Adoption barrier:** trust and training under restricted visibility.
- **Pilot signal:** completion with zero overexposure events.
- **Promise restraint:** no claim of all-in-home clinical role.

## Platform operations staff

- **Role:** support and operational oversight.
- **Primary problems:** manual fixes for workflow edge cases and exception routing.
- **Jobs to be done:** triage support while preserving privacy and tenant boundaries.
- **Proposed value:** queue-based support flow and auditable interventions.
- **Evidence/capability required:** least-privilege access tooling and operation logs.
- **Information they may access:** support-scoped data needed for resolution.
- **Information they must not automatically access:** full medical records or pre-payment provider details not tied to support permission.
- **Adoption barrier:** balancing speed with strict audit controls.
- **Pilot signal:** support volume reduced without privacy incidents.
- **Promise restraint:** no promise of unlimited operator visibility.

## Distinguishing core actors for downstream prompts

### Customer
Someone who pays or administers the commercial flow.

### Payer
Entity with funding authority, which does not imply clinical-record authority by default.

### User
Someone who acts in the product (clinically, operationally, or administratively).

### Economic buyer
The entity funding the transaction or subscription.

### Beneficiary
The individual whose care is delivered and documented.

### Provider
The clinician, facility, or service partner delivering a care action.

### Administrator
Person controlling program, account, or organization settings with role-specific limits.

### Sponsor
An organization or person financing care on another party’s behalf.

### Guardian
Person granted delegated care authority under defined safeguards.

### Caregiver
Person contributing support but not replacing clinical access.

## Shared platform coherence

All listed groups share one coherent platform model: one patient journey, one longitudinal care identity, and role-based disclosure rules that prevent payer and administrative roles from becoming clinical substitutes.
