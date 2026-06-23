# NelyoHealth Product Charter

## Document Control

- Document title: NelyoHealth Product Charter
- Codex prompt ID: **P00-01**
- Complete Breakdown work package: **P00-02**
- Issue ID: **P00-PRD-001**
- Owner role: **Product + Clinical + Privacy + Legal Governance Team**
- Review state: **PROPOSED**
- Required reviewers: **Product owner, Clinical lead, Privacy/DPO, Legal counsel, Operations lead, Security lead**
- Last updated date: **2026-06-23**
- Related decisions: **REQ-LOCK-001, REQ-LOCK-002, REQ-LOCK-003, REQ-LOCK-004, REQ-LOCK-006, REQ-LOCK-007, REQ-LOCK-008, REQ-LOCK-010, REQ-LOCK-011, REQ-LOCK-012**
- Related open questions: **OQ-00-06, OQ-00-07, OQ-00-08, OQ-00-09, OQ-00-14, OQ-00-15**

## Executive Summary

NelyoHealth is a patient-centered care-orchestration platform for Nigeria that coordinates clinical encounters and care completion across a connected set of participant layers: patients, doctors, pharmacies, laboratories, hospitals, home-care providers, families, guardians, diaspora sponsors, employers, and HMOs.

The platform is not a single-consultation app. It is an end-to-end care coordination layer that supports:

- clinical triage and consultation,
- prescription and diagnostic order generation,
- coverage and sponsorship interactions,
- pharmacy and laboratory fulfilment flow control, and
- follow-up and closure workflows.

The product design intentionally separates **clinical workflow ownership** from **financial administration**, while preserving a single longitudinal patient core.

## Product Vision

Make coordinated digital care practical and safe for Nigerian users by connecting clinical care, financing, and fulfilment in a way that is explainable, auditable, and privacy-preserving.

Vision principles:

- reduce dropped journeys between consultation, diagnosis, medicine, and results,
- preserve continuity of patient identity across plans and organisations,
- keep emergency access and escalation operational under adverse conditions,
- make safe decisions visible through auditable workflows,
- and keep commercial pressure from driving unsafe care or disclosure.

The vision avoids unsupported claims about market dominance or guaranteed clinical outcomes.

## Product Mission

NelyoHealth will enable a person to move from need to clinical completion with controlled coordination at each step: registration, identity verification, care engagement, financing decision, provider selection, fulfilment, results, and closure.

The mission requires:

- explicit role separation across payer, clinical, and operational contexts,
- predictable failure and recovery behavior,
- and explicit post-payment disclosure boundaries for providers.

## Central Product Thesis

1. **Individual patient care is the platform core.**  
   Every journey starts and ends in a longitudinal patient record that remains stable across plans and relationships.

2. **B2C and B2B layers share one clinical workflow.**  
   Family plans, employer programs, HMO administration, and diaspora support wrap the same patient-level record instead of creating duplicate records.

3. **Funding and administration do not own clinical visibility.**  
   A payer can be the financial authority for some actions, but not an automatic gateway to clinical records.

4. **Closed care loops are the value.**  
   A consultation without dependable follow-through is treated as incomplete.

5. **Video consultation is part of the care loop, not the platform definition.**  
   The platform is defined by continuity from consultation to treatment outcome, not by communication mode alone.

## Market Problems

### Individual patients

- Fragmented care journey across providers and funding sources.
- Unclear what is happening after initial consultation.
- Exposure of sensitive provider details before payment or authorization.

### Families

- Complexity when managing dependents across employers, HMOs, and providers.
- Poor visibility into who may pay, who may view, and what is clinically allowed.

### Guardians

- Delayed dependency workflows for minor care with mixed legal, consent, and clinical steps.
- Risk of overstepping legal authority without clear role boundaries.

### Diaspora sponsors

- Need to support care across distance with trust and auditability.
- Difficulty balancing payment convenience with local clinical control and privacy rules.

### Employers

- Desire aggregate care benefits without direct rights to clinical data.
- Need predictable and auditable sponsorship behavior.

### HMOs

- Need claims or support workflows that do not break clinical boundaries.
- Need controlled visibility tied to authorized program rules.

### Doctors

- Need reliable referral and follow-up loops.
- Need safeguards against unsafe incentives and administrative ambiguity.

### Pharmacies

- Need verified order execution and unambiguous release conditions.
- Need protection from early/provider-disclosure leakage.

### Laboratories

- Need clear workflow from order to result with accountable handoff and escalation.

### Hospitals

- Need referral intake and communication that preserves patient continuity and safety.

### Home-care agencies and workers

- Need structured task assignment, limited visibility, and escalation for exception states.

## Platform Model

NelyoHealth is defined as four linked concerns:

1. **Clinical care**  
   consultation, triage outcomes, prescriptions, tests, results, referrals, and amendments.

2. **Coverage and sponsorship**  
   direct pay, family plans, diaspora support, employer and HMO contributions.

3. **Provider fulfilment**  
   pharmacy and laboratory service delivery, logistics, and completion tracking.

4. **Platform governance and operations**  
   access, safety, auditability, privacy, and exception management.

## Core Care Loop

The platform baseline loop:

1. Registration  
2. Identity and relationship verification  
3. Symptom intake and triage  
4. Appointment booking  
5. Consultation  
6. Prescription, diagnostic order, referral, or care plan creation  
7. Payment/coverage authorization  
8. Provider fulfilment execution  
9. Follow-up  
10. Documented closure

During emergencies, this loop is explicitly bypassed for safety escalation and urgent response.

## B2C Model

### Individual patients
- Own their core patient identity and care journey.
- May pay directly with platform-mediated funding options.
- Clinical access remains constrained by clinical authorization logic.

### Family plan administrators
- Fund treatment episodes for dependents or associated members.
- Do not gain inherent access to protected clinical records.

### Guardians
- May support or activate care permissions where allowed by policy.
- Operate under minor-protection and revocation rules.

### Diaspora sponsors
- Fund care for identified patients from diaspora arrangements.
- Must not be treated as clinical owners unless separately authorized.

### Patient-controlled access
- Patients retain centrality in all care, identity, and disclosure boundaries.

## B2B Model

### Employers
- Run employee benefit and entitlement processes.
- Receive program-level administrative information under approved scopes.
- Must not receive unrestricted clinical data.

### HMOs
- Validate and process membership/capability permissions.
- Coordinate claims-like functions while respecting privacy and clinical-authorization boundaries.

### Provider organizations
- Join a marketplace where appropriate.
- Operate under licensing and credential conditions.

### Home-care organizations
- Participate in care continuity workflows where in-scope.

### Enterprise integration concerns
- SSO and enterprise directory integration are future implementation concerns; they are not implied in this prompt.
- Claims, reconciliation, and aggregate reporting are planned with legal and privacy constraints.

## Platform Role

NelyoHealth positions itself as:

- a technology platform,
- a care-orchestration layer,
- an administration and coordination layer,
- a provider coordination/marketplace layer where legally appropriate.

Each role is contingent on licensing, registration, and external review.

## Roles NelyoHealth Must Not Claim Without Approval

NelyoHealth must not claim to be:

- an insurer,
- an HMO,
- a licensed medical provider,
- a pharmacy,
- a laboratory,
- a hospital,
- an emergency medical service,
- an unlicensed custodian of stored value,
- an autonomous diagnostic service.

These claims require explicit legal and regulatory approval.

## Customer, User, Payer, Beneficiary, and Provider Distinctions

- **Customer:** organization or individual funding/administrating services.
- **User:** account performing actions in the product.
- **Payer:** role with financial authority for selected actions only.
- **Beneficiary/Patient:** person whose longitudinal clinical care is being managed.
- **Provider:** clinician or service organization delivering care/fulfilment.

One person may hold multiple roles, but no single role creates a duplicate patient record.

## Pilot Success Conditions

- Patients complete one closed-loop pilot path without manual engineering intervention.
- Providers and coordinators can execute assigned tasks with clear state transitions.
- Payment/coverage states and reconciliation follow approved event logic.
- Pharmacy and laboratory protected-field rules remain enforced until the exact paid order unlock event.
- Emergency escalation executes under load and failure scenarios.
- Clinical follow-up closure states are explicit and auditable.
- Privacy boundaries remain enforced across standard and failure paths.
- Operations can handle required exceptions with logged ownership.

## Pilot Failure Conditions

- Unsafe patient matching or duplicate patient records.
- Provider detail leakage before successful payment.
- Payer receiving or inferencing protected records by implication.
- Emergency escalation blocked by commercial flow conditions.
- Repeated fulfillment mismatch or unclosed prescriptions/results.
- Inaccurate refund/reversal behavior in payment-state logic.
- Excessive manual interventions required to complete journeys.
- Critical requirements missing explicit ownership.

## Non-Goals of the Charter

- final pricing and commercial rates,
- final launch geography,
- final specialist or service inclusion policy,
- final provider contract terms,
- final payment provider decisions,
- final legal interpretation or licensing strategy,
- detailed technical architecture patterns.

These are addressed in later prompts or external approvals.

