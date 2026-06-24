# NelyoHealth Relationship Model (P00-03)

## Document Control

- Document: `docs/product/relationship-model.md`
- Codex prompt ID: `P00-03`
- Complete Breakdown package: `P00-04`
- Issue ID: `P00-IAM-001`
- Owner role: Product + Clinical + Privacy
- Review state: `PROPOSED`
- Required reviewers: Product owner, Clinical lead, Security lead, Privacy counsel
- Last updated: `2026-06-24`
- Related decisions: `REQ-LOCK-001`, `REQ-LOCK-002`, `REQ-GOV-004`, `REQ-GOV-005`, `REQ-GOV-006`, `REQ-GOV-007`, `REQ-GOV-017`, `REQ-GOV-018`
- Related open questions: `OQ-00-34`, `OQ-00-35`, `OQ-00-39`, `OQ-00-40`, `OQ-00-41`, `OQ-00-42`

## Relationship Principles

This model separates six axes:

1. `Person` identity: real-world human existence.
2. `Role`: the capability expectation in a context.
3. `Relationship`: legal or delegated association between persons.
4. `Membership`: formal inclusion in an organization, facility, or tenant.
5. `Coverage`: payer, sponsor, or benefit-linked funding arrangement.
6. `Consent/Delegation`: explicit authority to act for care, payment, or logistics.

No single axis is sufficient for full access; authorized action requires compatible combinations of:

- correct actor
- correct patient
- correct context
- correct relationship or coverage
- correct authorization status
- emergency/compliance guardrails

## Core conceptual relationships

The following relationships are tracked conceptually and are distinct:

- `Person -> UserAccount`
- `Person -> Patient`
- `Person -> Practitioner`
- `Person -> OrganizationMembership`
- `Practitioner -> Organization`
- `Practitioner -> Facility`
- `Organization -> Facility`
- `Patient -> FamilyPlanMembership`
- `Patient -> Guardian`
- `Patient -> ClinicalProxy`
- `Patient -> DelegatedCaregiver`
- `Patient -> Sponsor`
- `Patient -> Payer`
- `Patient -> EmployerCoverage`
- `Patient -> HMOCoverage`
- `Patient -> ProviderCareRelationship`
- `Patient -> ConsultationParticipant`
- `Patient -> EmergencyContact`
- `Organization -> Facility`

## Core relationship matrix

| Relationship type | Subject | Related actor | Scope | Statuses | Prohibited outcomes |
|---|---|---|---|---|---|
| Person-to-UserAccount | Person | UserAccount | Global account context | `active`, `pending`, `revoked` | Account without identity link |
| Person-to-Patient | Person | Patient | Patient continuity context | `active`, `historical`, `record-locked` | Creating duplicate Patient records |
| Person-to-OrganizationMembership | Person | OrganizationMembership | Tenant/org context | `invited`, `active`, `suspended`, `expired` | Membership as clinical authorization |
| OrganizationMembership-to-Facility | Person role | Facility | Facility context | `assigned`, `reassigned`, `removed` | Facility context as patient relationship |
| Patient-to-FamilyPlanMembership | Patient | Family-plan account | Funding/administration context | `invited`, `active`, `suspended`, `removed` | Unlimited family access to records |
| Patient-to-Guardian | Patient | Guardian | Care-governance context | `proposed`, `active`, `revoked` | Automatic diagnosis access for guardian |
| Patient-to-ClinicalProxy | Patient | Clinical proxy | Care-delegation context | `active`, `time-limited`, `revoked` | Clinical override without verification |
| Patient-to-DelegatedCaregiver | Patient | Caregiver | Task context | `active`, `revoked` | Caregiver with full record authority |
| Patient-to-Sponsor | Patient | Sponsor | Funding context | `pending`, `approved`, `revoked` | Sponsor as care-rights actor |
| Patient-to-Payer | Patient | Payer | Funding context | `approved`, `active`, `rejected`, `expired` | Payer viewed as clinician |
| Patient-to-EmployerCoverage | Patient | Employer coverage | Coverage context | `active`, `expired` | Employer controlling patient record |
| Patient-to-HMOCoverage | Patient | HMO coverage | Coverage context | `eligible`, `ineligible`, `terminated` | HMO acting without explicit policy |
| Patient-to-ProviderCareRelationship | Patient | Provider practitioner/pharmacy/lab | Care context | `active`, `suspended`, `closed` | Provider using unselected order context |
| Patient-to-ConsultationParticipant | Patient | Consultation participant | Encounter context | `invited`, `accepted`, `declined` | Non-participant reading encounter |
| Patient-to-EmergencyContact | Patient | Emergency contact | Safety context | `approved`, `inactive` | Emergency contact replacing clinician escalation |

## Relationship attributes

Each relationship in the model can hold these conceptual attributes:

- `relationshipType`
- `subjectActor`
- `relatedActor`
- `scope`
- `status`
- `effectiveDate`
- `expiryDate`
- `verificationStatus`
- `verificationEvidence`
- `consentBasis`
- `grantedCapabilities`
- `prohibitedCapabilities`
- `revocation`
- `suspension`
- `issuingAuthority`
- `reviewAuthority`
- `creationSource`
- `auditHistory`

## Relationship independence rules

- `Sponsor` does not equal `Guardian`.
- `Guardian` does not equal `ClinicalProxy`.
- `Payer` does not equal automatic `ClinicalProxy`.
- `Family administrator` is not automatically a `Guardian`.
- `Caregiver` is not automatically a clinical role.
- `Employer/HMO administrator` is not patient clinician.
- `Provider organization administrator` is not treating practitioner.
- `Platform administrator` does not receive unconditional clinical content.
- `Emergency contact` is not routine clinical actor.
- `Receiving medicine` is not equivalent to prescription viewing authority.
- `Organization membership`, `coverage`, and `clinical relationship` are evaluated independently.

## Accountless patient relationships

Accountless patient records are allowed at intake stages and during deferred onboarding flows only if:

- a `Person` and/or `Patient` continuity anchor is discoverable,
- identity linking checks are retained for duplicate-detection,
- no automatic merge occurs on matching names alone,
- activation requires explicit account linking before sensitive actions.

No accountless patient may receive protected details before successful payment unlock conditions and all channel protections are active.

## Relationship revocation

The following revocations can end trust paths:

| Trigger | Immediate outcome | Non-erasable outcome |
|---|---|---|
| Sponsor revocation | sponsor payment rights end, sponsorship journeys close | patient care continuity remains; medical record persists |
| Caregiver revocation | caregiver tasks stop and future handoffs blocked | care timeline remains auditable |
| Clinical proxy revocation | delegated clinical tasks close | historical delegation actions remain in audit |
| Guardian suspension | guardian workflow blocked until review | clinical visibility model preserved with legal guardrails |
| Family-plan removal | family admin rights end | family member patient continuity remains |
| Employer offboarding | employer operational context exits | patient and patient record do not delete |
| HMO coverage expiry | authorization updates stop | clinical continuity does not move or delete patient |
| Provider staff offboarding | facility and org privilege removed instantly | signed records remain attributable |
| Organization suspension | membership action scope ends in that context | cross-context patient continuity remains |

## Multi-organization and continuity summary

- A person may hold multiple memberships simultaneously with one active tenant at a time per task context.
- Multiple organizations can care for the same patient without creating new patient identities.
- Tenant changes do not remove clinical timeline history.
- Coverage transitions do not split clinical records.
- One patient identity remains the core continuity anchor.
