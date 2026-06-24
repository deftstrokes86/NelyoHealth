# NelyoHealth Tenancy Concept (P00-03)

## Document Control

- Document: `docs/architecture/tenancy-concept.md`
- Codex prompt ID: `P00-03`
- Complete Breakdown package: `P00-04`
- Issue ID: `P00-IAM-001`
- Owner role: Product + Security + Architecture
- Review state: `PROPOSED`
- Required reviewers: Product owner, Architecture lead, Security lead
- Last updated: `2026-06-24`
- Related decisions: `REQ-LOCK-001`, `REQ-LOCK-002`, `REQ-GOV-006`, `REQ-GOV-007`, `REQ-GOV-008`, `REQ-GOV-010`, `REQ-GOV-017`, `REQ-GOV-018`
- Related open questions: `OQ-00-40`, `OQ-00-41`, `OQ-00-42`

## Tenancy definition

Tenant boundary in this phase is a governance and authorization boundary, not an ownership substitute for personhood.

Tenant concepts apply to:

- policy enforcement
- role evaluation
- membership audit
- organization-specific operational workflows

Tenancy does **not**:

- replace a Person,
- replace a Patient continuity record,
- define who owns a care identity,
- permit bypass of payer vs clinical boundaries by tenant scope alone.

## Organization types

NelyoHealth recognizes organization contexts that may appear in parallel:

- Employer
- HMO
- Pharmacy organization
- Laboratory organization
- Hospital organization
- Home-care agency
- Provider group
- NelyoHealth operations organization
- Delivery partner

Organization types can appear as tenant anchors without owning protected clinical narratives.

## Facility concept

Facility is a constrained operating boundary inside one organization:

- Organization
- Facility
- Branch
- Service location
- Service area

Protected provider location details (address, coordinates, distance, branch pin, map requests, directions, photos, internal identifiers) are constrained by pre-payment disclosure rules and are not shown across tenant boundaries before successful payment.

## Multi-organization membership

Members may belong to multiple organizations across time, including:

- doctor working across provider groups
- pharmacist with multiple facilities
- platform staff with operations role and external duties
- patients connected to employer, HMO, and sponsor contexts

Membership requirements:

- explicit active context
- visible chosen tenant/facility context
- no silent privilege carryover across contexts
- tenant-specific authorization evaluation
- tenant-specific audit stream
- deterministic session context transitions

## Shared patient interaction

Shared patient interactions are mediated through scoped workflows, not implicit tenancy sharing:

- Doctor access: active encounter + selected order + authorization
- Laboratory access: selected diagnostic order + authorization
- Pharmacy access: selected prescription order + authorization
- Hospital referral: approved referral packet + emergency/compliance routing
- Employer/HMO contribution: funding policy only (not routine clinical visibility)
- Diaspora sponsor: funding and receipt scope only

Each interaction uses one patient anchor and one active order anchor.

## Cross-tenant interaction

Cross-tenant actions are limited to:

- shared referral identifiers,
- order movement metadata,
- eligibility checks,
- payment settlement events,
- claims/authorization state when separately defined,
- audit events.

Cross-tenant interaction never includes full patient timeline sharing by default.

## Staff offboarding

When staff membership ends:

- organization access is revoked for that context,
- sessions for that context are invalidated,
- new assignments are blocked,
- existing signed records remain attributable to actor identity and timestamp,
- patient continuity and audit chain remain intact.

## Patient continuity and continuity-state behavior

Change of coverage, organization, or sponsorship cannot:

- delete patient identity,
- delete clinical timeline,
- remove historical order trace,
- migrate records as a side effect.

Continuity is preserved as:

- one patient anchor,
- one continuity chain,
- one audit history per care entity.

## Administrative access boundaries

Administrative actors have no hidden global rights:

- support access is scoped by workflow and evidence.
- finance access is financial, not clinical.
- security access is security event-focused and non-clinical by default.
- technical administration manages platform operations only.
- compliance access is policy and exception-focused.
- clinical supervision is exceptional and separately authorized.
- break-glass access is emergency-oriented and auditable.

## Pilot and future tenancy

### PILOT tenant set

- Patient context
- Provider/doctor context
- Pharmacy context
- Laboratory context
- Referral context
- NelyoHealth operations context

### DESIGN-NOW-IMPLEMENT-LATER tenant set

- Employer tenant runtime
- HMO tenant runtime
- Home-care tenant runtime
- Enterprise SSO and identity federation
- claims and prior-authorization tenant pathways

## Validation notes

- Tenant context is explicit in actor, relation, and action planning.
- Tenant switch is not an implicit privilege switch.
- Patient continuity is preserved across all tenancy transitions.
