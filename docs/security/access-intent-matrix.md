# NelyoHealth Access-Intent Matrix (P00-03)

## Document Control

- Document: `docs/security/access-intent-matrix.md`
- Codex prompt ID: `P00-03`
- Complete Breakdown package: `P00-04`
- Issue ID: `P00-IAM-001`
- Owner role: Security + Privacy + Product
- Review state: `PROPOSED`
- Required reviewers: Security lead, Privacy counsel, Clinical lead
- Last updated: `2026-06-24`
- Related decisions: `REQ-LOCK-001`, `REQ-LOCK-002`, `REQ-LOCK-003`, `REQ-LOCK-004`, `REQ-LOCK-006`, `REQ-LOCK-007`, `REQ-LOCK-008`, `REQ-GOV-004`, `REQ-GOV-007`, `REQ-GOV-011`, `REQ-GOV-013`
- Related open questions: `OQ-00-40`, `OQ-00-41`, `OQ-00-42`

## Purpose

This matrix is conceptual and describes intended access direction only. It is not implementation policy and does not define RBAC or permission code.

## Allowed values

- `EXPECTED`: normal intended access path.
- `CONDITIONAL`: requires explicit relationship, context, consent, assignment, or authorization.
- `NOT-PERMITTED`: not within role intent.
- `NOT-APPLICABLE`: no meaningful application.
- `BREAK-GLASS-ONLY`: only through emergency process.

## Access matrix

| Actor | Register/activate own account | Manage own profile | Schedule care | Reschedule or cancel care | Join consultation | Invite consultation participant | Pay | Approve spending | View receipt | View order fulfilment status | View limited clinical summary | View full clinical record | View prescription | View laboratory order | View laboratory result | Receive medicine | Receive provider details after payment | Manage family relationship | Manage guardian relationship | Manage caregiver delegation | Manage coverage | View aggregate organization reporting | Manage organization | Manage facility | Review credentials | Process refund | Review audit history | Use break-glass access |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Patient | EXPECTED | EXPECTED | EXPECTED | EXPECTED | EXPECTED | CONDITIONAL[1] | EXPECTED | NOT-PERMITTED | EXPECTED | EXPECTED | EXPECTED | CONDITIONAL[6] | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[6] | EXPECTED | CONDITIONAL[7] | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[10] | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[2] | NOT-PERMITTED |
| Guardian | EXPECTED | EXPECTED | CONDITIONAL[1] | CONDITIONAL[1] | CONDITIONAL[3] | EXPECTED | EXPECTED | CONDITIONAL[4] | EXPECTED | CONDITIONAL[3] | CONDITIONAL[3] | CONDITIONAL[3] | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[3] | CONDITIONAL[7] | CONDITIONAL[4] | EXPECTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[8] | CONDITIONAL[9] |
| Clinical proxy | EXPECTED | EXPECTED | CONDITIONAL[1] | CONDITIONAL[1] | CONDITIONAL[3] | CONDITIONAL[3] | CONDITIONAL[5] | CONDITIONAL[5] | EXPECTED | CONDITIONAL[3] | CONDITIONAL[3] | CONDITIONAL[3] | CONDITIONAL[3] | CONDITIONAL[4] | CONDITIONAL[6] | CONDITIONAL[7] | CONDITIONAL[11] | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[8] | NOT-PERMITTED |
| Delegated caregiver | EXPECTED | EXPECTED | CONDITIONAL[1] | CONDITIONAL[1] | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | EXPECTED | CONDITIONAL[4] | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[4] | CONDITIONAL[4] | EXPECTED | CONDITIONAL[12] | NOT-PERMITTED | NOT-PERMITTED | EXPECTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[9] |
| Family-plan administrator | EXPECTED | EXPECTED | CONDITIONAL[13] | CONDITIONAL[13] | NOT-PERMITTED | NOT-PERMITTED | EXPECTED | CONDITIONAL[14] | EXPECTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | EXPECTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[14] | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[2] | NOT-PERMITTED | NOT-PERMITTED |
| Diaspora sponsor | EXPECTED | EXPECTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | EXPECTED | CONDITIONAL[15] | EXPECTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[15] | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[2] | NOT-PERMITTED | NOT-PERMITTED |
| Doctor | EXPECTED | EXPECTED | EXPECTED | EXPECTED | EXPECTED | EXPECTED | NOT-PERMITTED | NOT-PERMITTED | EXPECTED | EXPECTED | CONDITIONAL[16] | CONDITIONAL[16] | EXPECTED | CONDITIONAL[16] | CONDITIONAL[16] | NOT-PERMITTED | CONDITIONAL[16] | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[17] | CONDITIONAL[17] | NOT-PERMITTED | CONDITIONAL[2] | NOT-PERMITTED | NOT-PERMITTED |
| Pharmacist | EXPECTED | EXPECTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | EXPECTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[18] | NOT-PERMITTED | NOT-PERMITTED | EXPECTED | CONDITIONAL[18] | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[18] | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[18] | NOT-PERMITTED | CONDITIONAL[2] | NOT-PERMITTED | NOT-PERMITTED |
| Laboratory scientist | EXPECTED | EXPECTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | EXPECTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | EXPECTED | CONDITIONAL[19] | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[2] | NOT-PERMITTED |
| Nurse | EXPECTED | EXPECTED | CONDITIONAL[20] | CONDITIONAL[20] | CONDITIONAL[20] | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[20] | CONDITIONAL[20] | CONDITIONAL[20] | NOT-PERMITTED | CONDITIONAL[20] | CONDITIONAL[20] | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[20] | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[20] | NOT-PERMITTED | CONDITIONAL[2] | CONDITIONAL[9] |
| Home-care worker | EXPECTED | EXPECTED | CONDITIONAL[20] | CONDITIONAL[20] | CONDITIONAL[20] | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[20] | CONDITIONAL[20] | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[20] | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[20] | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[20] | NOT-PERMITTED | CONDITIONAL[2] | CONDITIONAL[9] |
| Hospital/referral coordinator | EXPECTED | EXPECTED | CONDITIONAL[21] | CONDITIONAL[21] | CONDITIONAL[21] | CONDITIONAL[21] | NOT-PERMITTED | NOT-PERMITTED | EXPECTED | CONDITIONAL[21] | CONDITIONAL[21] | CONDITIONAL[21] | NOT-PERMITTED | CONDITIONAL[21] | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[21] | CONDITIONAL[21] | NOT-PERMITTED | CONDITIONAL[21] | NOT-PERMITTED | CONDITIONAL[2] | CONDITIONAL[9] |
| HMO administrator | EXPECTED | EXPECTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[22] | CONDITIONAL[22] | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[2] | NOT-PERMITTED | NOT-PERMITTED |
| HMO claims operator | EXPECTED | EXPECTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[22] | CONDITIONAL[22] | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[2] | NOT-PERMITTED | NOT-PERMITTED |
| Employer benefits admin | EXPECTED | EXPECTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[23] | NOT-PERMITTED | CONDITIONAL[23] | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[2] | NOT-PERMITTED | NOT-PERMITTED |
| Employer finance operator | EXPECTED | EXPECTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[23] | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[2] | NOT-PERMITTED | NOT-PERMITTED |
| Provider organization administrator | EXPECTED | EXPECTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[24] | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[24] | EXPECTED | CONDITIONAL[24] | EXPECTED | CONDITIONAL[2] | NOT-PERMITTED | NOT-PERMITTED |
| Platform support operator | EXPECTED | EXPECTED | CONDITIONAL[25] | CONDITIONAL[25] | CONDITIONAL[25] | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[25] | CONDITIONAL[25] | CONDITIONAL[25] | CONDITIONAL[25] | CONDITIONAL[25] | CONDITIONAL[25] | CONDITIONAL[25] | CONDITIONAL[25] | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[25] | CONDITIONAL[25] | NOT-PERMITTED | CONDITIONAL[2] | NOT-PERMITTED | NOT-PERMITTED |
| Platform finance operator | EXPECTED | EXPECTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | EXPECTED | CONDITIONAL[26] | EXPECTED | EXPECTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[26] | NOT-PERMITTED | CONDITIONAL[26] | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[2] | CONDITIONAL[2] | NOT-PERMITTED |
| Credential reviewer | EXPECTED | EXPECTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[27] | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED |
| Compliance officer | EXPECTED | EXPECTED | CONDITIONAL[28] | CONDITIONAL[28] | CONDITIONAL[28] | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[28] | CONDITIONAL[28] | CONDITIONAL[28] | CONDITIONAL[28] | CONDITIONAL[28] | CONDITIONAL[28] | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[28] | CONDITIONAL[28] | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[2] | CONDITIONAL[2] | NOT-PERMITTED |
| Clinical supervisor | EXPECTED | EXPECTED | CONDITIONAL[29] | CONDITIONAL[29] | CONDITIONAL[29] | CONDITIONAL[29] | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[29] | CONDITIONAL[29] | CONDITIONAL[29] | CONDITIONAL[29] | CONDITIONAL[29] | CONDITIONAL[29] | CONDITIONAL[29] | CONDITIONAL[29] | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[2] | CONDITIONAL[2] | NOT-PERMITTED |
| Security administrator | EXPECTED | EXPECTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | EXPECTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[27] | CONDITIONAL[27] | CONDITIONAL[27] | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[2] | NOT-PERMITTED |
| Platform administrator | EXPECTED | EXPECTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[30] | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[30] | NOT-PERMITTED | CONDITIONAL[30] | CONDITIONAL[30] | NOT-PERMITTED | CONDITIONAL[2] | CONDITIONAL[2] | NOT-PERMITTED |
| Auditor | EXPECTED | EXPECTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[31] | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[31] | CONDITIONAL[31] | CONDITIONAL[31] | CONDITIONAL[31] | CONDITIONAL[31] | CONDITIONAL[31] | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[31] | CONDITIONAL[2] | CONDITIONAL[2] | NOT-PERMITTED |
| Delivery participant | EXPECTED | EXPECTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | EXPECTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | EXPECTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | CONDITIONAL[32] | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED | NOT-PERMITTED |

## Conditional and break-glass notes

### CONDITIONAL

`[1]` active patient context, ownership check, and journey state allow participation.  
`[2]` only for records tied to own action or active order with legal evidence and explicit authorization.  
`[3]` only if legal delegation and current patient consent support access.  
`[4]` allowed only when a verified dependent relationship and care plan explicitly allow that action.  
`[5]` only when patient, payer, and order policy explicitly delegate clinical-proxy spending power.  
`[6]` only the patient or actor with valid treatment link and encounter context.  
`[7]` only after successful payment unlock for the selected order and order-linked provider.  
`[8]` requires signed incident or refund workflow evidence and role scope.  
`[9]` access may support governance review with limited event-only visibility.  
`[10]` if patient is member of current coverage context and active terms remain valid.  
`[11]` requires explicit clinical proxy grant in law-compliant capacity.  
`[12]` if caregiver delegation and incident case is task-scoped and expiry-safe.  
`[13]` only for family plans where person is designated to fund or manage the account and has continuity context.  
`[14]` only for designated spending roles with transaction controls and signed terms.  
`[15]` funding state only; no clinical detail access.  
`[16]` requires active doctor-patient or consultation relationship.  
`[17]` only for organization/facility role administration for approved orgs.  
`[18]` only for order-specific fulfilment and release path.  
`[19]` only for own assigned diagnostic order context and result workflow.  
`[20]` limited to future or deferred non-clinical support roles; not for routine treatment actions.  
`[21]` referral-specific context and active facility transition rules.  
`[22]` only for eligibility and benefits administration, not patient treatment authority.  
`[23]` only in coverage context with explicit employee consent and data minimization.  
`[24]` organization membership and credential gating only; no clinical authority.  
`[25]` incident-driven support scope and active case ownership.  
`[26]` payment scope only; excludes clinical records and treatment decisions.  
`[27]` review of proof artifacts and expiry-limited credentials only.  
`[28]` governance exception scope and policy-defined authority.  
`[29]` clinical escalation and harm-management context with clinical signoff.  
`[30]` platform operations context; no direct clinical data without explicit legal basis.  
`[31]` read-only review scope with fixed query intent and redaction.  
`[32]` order-scoped and facility-specific handling only.

### BREAK-GLASS-ONLY

- No actor in this matrix has `BREAK-GLASS-ONLY` as the current default value.
- Break-glass access is represented by the policy engine outside routine operational behavior and is restricted to:
  - emergency clinical situations,
  - explicit pre-authorized actor list,
  - required reason capture,
  - short-lived audit capture,
  - and post-event compliance review.

## Matrix outcomes required by policy

- A patient can view their own authorized clinical and care states.
- A sponsor may pay and view receipts but not clinical records by default.
- Family-plan administrators cannot read full records by organization role alone.
- Guardians and clinical proxies are action-limited to explicit delegated scopes.
- A caregiver can only perform explicitly delegated non-clinical tasks.
- A doctor sees clinical content only within legal and encounter scope.
- A pharmacist and lab scientist receive only information necessary to perform selected order duties.
- A hospital can receive referral packet and safety handoff context only.
- Employer, HMO, and support roles do not receive clinical content by default.
- Break-glass never grants hidden or tenant-wide access.

## Provider-disclosure boundary

- Pre-payment provider or lab details remain blocked outside `providerDisplayName` and non-identifying commercial fields.
- Post-payment provider detail access is allowed only for:
  - selected paid order,
  - matching actor and tenant context,
  - matching patient and encounter context,
  - explicit payment unlock event.
- Administrative classes (finance, support, compliance, security, operations) do not gain map/location, branch, or contact details without separate policy path.
- Emergency guidance and escalation routing is not blocked by payment or coverage lock state.
