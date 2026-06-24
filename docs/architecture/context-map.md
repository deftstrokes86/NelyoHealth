# NelyoHealth Context Map

## Document Control

| Field | Value |
|---|---|
| Prompt | P00-06 |
| Complete Breakdown work packages | P00-07; P00-08 |
| Issue IDs | P00-DOM-001; P00-ARC-001 |
| Owner role | Architecture lead |
| Review state | PROPOSED |
| Last updated | 2026-06-24 |
| Related decisions | REQ-ARC-001 through REQ-ARC-018 |

## Relationship Types

| Label | Meaning |
|---|---|
| UPSTREAM | Source authority or policy source. |
| DOWNSTREAM | Consumer of events, projections, or interfaces. |
| PUBLISHED-LANGUAGE | Explicit contract/interface language shared across contexts. |
| CONFORMIST | Consumer follows upstream model. |
| ANTI-CORRUPTION-LAYER | Adapter shields domain from external/vendor language. |
| OPEN-HOST-SERVICE | Explicit interface exposed by a context. |
| CUSTOMER-SUPPLIER | Upstream and downstream coordinate contract changes. |
| REDACTED-PROJECTION | Consumer sees minimized projection, not source record. |
| EVENT-CONSUMER | Consumer receives events asynchronously. |

## Context Map Diagram

```mermaid
flowchart LR
  IA[Identity and Access]
  ORG[Organizations and Facilities]
  PR[Patients and Relationships]
  CRED[Credentialing]
  SCH[Scheduling]
  ENC[Consultations and Encounters]
  CR[Clinical Records]
  RX[Prescriptions]
  DX[Diagnostics]
  MKT[Marketplace and Matching]
  PH[Pharmacy Fulfilment]
  LAB[Laboratory Operations]
  REF[Referrals]
  HC[Home Care]
  PC[Plans and Coverage]
  CLM[Claims]
  PAY[Payments and Ledger]
  CA[Consent and Audit]
  NOTIF[Notifications]
  SUP[Support and Operations]
  AN[Analytics]
  INT[Integrations]
  EXT[External systems through ports/adapters]

  IA -->|Person/UserAccount reference| PR
  IA -->|actor identity| ORG
  ORG -->|provider/facility projection| CRED
  ORG -->|redacted capability projection| MKT
  CRED -->|eligible provider projection| SCH
  CRED -->|eligible practitioner projection| ENC
  PR -->|Patient reference| SCH
  SCH -->|AppointmentBooked| ENC
  ENC -->|disposition| CR
  ENC -->|Prescription request| RX
  ENC -->|Diagnostic order request| DX
  ENC -->|Referral request| REF
  ENC -->|EmergencyEscalationTriggered| SUP
  RX -->|PrescriptionIssued| MKT
  DX -->|DiagnosticOrderIssued| MKT
  MKT -->|selected ServiceOrder| PH
  MKT -->|selected ServiceOrder| LAB
  PH -->|fulfilment status| SUP
  LAB -->|specimen/process status| DX
  DX -->|verified result| CR
  PC -->|funding eligibility| PAY
  MKT -->|order payment context| PAY
  PAY -->|scoped payment status| MKT
  PAY -->|financial events| CLM
  CLM -->|claim projections| PC
  CR -->|minimum necessary packet| REF
  REF -->|partner handoff| INT
  HC -->|future home-care events| CR
  CA <-->|audit/consent interface| IA
  CA <-->|audit/consent interface| PR
  CA <-->|audit/consent interface| ENC
  CA <-->|audit/consent interface| CR
  CA <-->|audit/consent interface| PAY
  NOTIF -->|messages| EXT
  INT -->|anti-corruption adapters| EXT
  IA -->|domain events| NOTIF
  SCH -->|domain events| NOTIF
  ENC -->|domain events| NOTIF
  MKT -->|domain events| NOTIF
  PAY -->|domain events| NOTIF
  SUP -->|redacted commands/projections| IA
  SUP -->|redacted commands/projections| PR
  SUP -->|redacted commands/projections| MKT
  SUP -->|redacted commands/projections| PAY
  IA -->|minimized events| AN
  PR -->|minimized events| AN
  ENC -->|minimized events| AN
  PAY -->|minimized events| AN
  MKT -->|minimized events| AN
```

This diagram shows a modular monolith, not microservices. Arrows describe conceptual dependencies, events, or projections. Analytics and Notifications are downstream. Support and Operations uses approved commands/projections rather than private storage bypass. Integrations protects domain contexts from vendor-specific types.

## Provider-Disclosure Projection Boundary

```mermaid
flowchart TD
  ORG[Organizations and Facilities\nprovider/facility master data]
  PH[Pharmacy Fulfilment\ncapability/inventory projection]
  LAB[Laboratory Operations\ncapability/availability projection]
  MKT[Marketplace and Matching\nserver-side matching]
  CAND[InternalProviderMatchingCandidate\nserver-side only]
  OFFER[PrePaymentProviderOfferView\nproviderDisplayName + approved fields]
  TOKEN[OpaqueSelectionToken\nnon-derivable scoped token]
  CLIENT[Patient-facing client]
  SO[ServiceOrder\nexact selected provider/order]
  PAY[Payments and Ledger\nverified transaction status]
  POLICY[ProviderDetailDisclosureDecision\norder/provider/actor/patient/tenant scoped]
  POST[AuthorizedPostPaymentFulfilmentView]
  AUD[Consent and Audit\ndisclosure audit]
  DENY[Denied for other order/provider/actor/patient/tenant]

  ORG --> MKT
  PH --> MKT
  LAB --> MKT
  MKT --> CAND
  CAND --> OFFER
  OFFER --> TOKEN
  OFFER --> CLIENT
  TOKEN --> SO
  SO --> POLICY
  PAY --> POLICY
  POLICY -->|approved after P00-13 success rule| POST
  POLICY -->|deny by default| DENY
  POST --> CLIENT
  POLICY --> AUD
```

Flow description:

1. Organizations and Facilities owns provider and facility master data.
2. Pharmacy Fulfilment or Laboratory Operations supplies capability and availability data.
3. Marketplace and Matching performs server-side matching.
4. Marketplace creates `InternalProviderMatchingCandidate` for server use only.
5. Marketplace produces `PrePaymentProviderOfferView`.
6. The client receives `providerDisplayName` and approved fields only.
7. The user selects through an opaque scoped token.
8. Marketplace creates or associates the exact `ServiceOrder`.
9. Payments and Ledger supplies verified transaction status.
10. The disclosure policy evaluates selected order, selected provider, actor authorization, patient context, tenant context, and the later P00-13 approved successful-payment rule.
11. Only then is `AuthorizedPostPaymentFulfilmentView` produced.
12. Consent and Audit records the disclosure.
13. Another order, actor, patient, provider, or tenant remains denied.

The exact successful-payment event remains `REQUIRES_APPROVAL` for P00-13. `ProviderDetailDisclosureEligibilityEstablished` is not a generic payment-success event.

## Clinical Flow Map

```mermaid
flowchart LR
  SCH[Appointment] --> ENC[Encounter]
  ENC --> CR[ClinicalRecord/ClinicalNote]
  ENC --> RX[Prescription]
  ENC --> DX[DiagnosticOrder]
  DX --> LAB[Laboratory Operations]
  LAB --> DRES[Verified DiagnosticResult]
  DRES --> CR
  ENC --> REF[Referral]
  ENC --> EM[Emergency escalation]
  PC[Coverage] --> PAY[Payment]
  PAY --> LED[LedgerEntry]
  ENC --> AUD[Audit intent]
  RX --> AUD
  DX --> AUD
  PAY --> AUD
  AUD --> CA[Canonical AuditEvent]
  ENC --> NOTIF[Notifications]
  RX --> NOTIF
  DRES --> NOTIF
  PAY --> NOTIF
  CR --> AN[Approved analytics projections]
  PAY --> AN
```

Clinical flow description:

- Appointment may lead to Encounter.
- Encounter may produce ClinicalRecord entries, Prescription, DiagnosticOrder, Referral, FollowUpPlan, or EmergencyEscalationTriggered.
- Laboratory Operations owns specimen/process while Diagnostics owns clinical order and verified result.
- Emergency escalation is safety-first and not blocked by payment, coverage, registration, provider comparison, funding, sponsor approval, employer/HMO authorization, or pharmacy/lab provider-detail protection.
- Coverage informs payment; payment creates ledger entries but does not own care or disclosure authority.
- Domain actions produce audit intent and notification events with minimum necessary data.
- Analytics receives approved minimized projections only.

## External Adapter Map

```mermaid
flowchart LR
  DOM[Domain contexts] -->|ports| INT[Integrations]
  INT --> IDP[Identity provider]
  INT --> VID[Video provider]
  INT --> PAYP[Payment provider]
  INT --> MAP[Map/geocoding provider]
  INT --> MSG[Messaging provider]
  INT --> DEL[Delivery provider]
  INT --> EMP[Employer integration]
  INT --> HMO[HMO integration]
  INT --> PHARM[Pharmacy integration]
  INT --> LABI[Laboratory integration]
  INT --> HOSP[Hospital integration]
  INT --> REG[Credential registry]
  INT --> OBJ[Object storage]
  INT --> MAL[Malware scanning]
  INT --> AEXP[Analytics export]
```

External adapter description: domains define ports in domain-neutral terms. Integrations maps to vendor-specific contracts and delivery state. No vendor, SDK type, processor enum, map provider type, video provider type, or identity provider type becomes a canonical domain type.
