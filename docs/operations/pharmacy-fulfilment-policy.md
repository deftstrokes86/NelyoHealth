# Pharmacy Fulfilment Policy

## Document Control

| Field | Value |
|---|---|
| Document title | Pharmacy Fulfilment Policy |
| Codex prompt ID | P00-10 |
| Complete Breakdown work package | P00-13 |
| Issue ID | P00-FUL-001 |
| Owner role | Pharmacy Operations Lead + Clinical Lead |
| Status | DRAFT-PENDING-APPROVAL |
| Clinical status | DRAFT-PENDING-APPROVAL |
| Review state | REQUIRES_APPROVAL |
| Required reviewers | Pharmacy Operations Lead, Clinical Lead/Medical Director, Legal Counsel, Regulatory Reviewer, Finance Owner, Privacy Counsel, Security Lead |
| Last updated | 2026-06-24 |
| Effective date | NOT EFFECTIVE UNTIL APPROVED |
| Version | 0.1 draft |
| Related decisions | REQ-LOCK-003 through REQ-LOCK-009, REQ-PRV-001 through REQ-PRV-028, REQ-FUL-010 through REQ-FUL-024 |
| Related open questions | OQ-00-217 through OQ-00-229 |
| Related journeys | JRN-004, JRN-011, JRN-020 |
| Related workflows | WFL-008 Pharmacy quote, WFL-009 Stock reservation, WFL-010 Pharmacy order, WFL-018 Payment intent, WFL-019 Refund |

Pharmacy rules are not effective until approved by pharmacy operations, clinical governance, legal, and regulatory reviewers. Final payment sequencing and disclosure-unlock evidence remain dependencies of P00-13. This policy does not replace qualified professional judgment or pharmacist professional duties.

## Scope

This draft covers pharmacy matching, quotation, provider selection, stock confirmation, reservation, payment coordination, pharmacist review, dispensing, collection or delivery handoff, completion, exceptions, and refund handoff.

It does not select a pharmacy vendor, inventory integration, logistics vendor, payment vendor, map vendor, or final medicine catalogue. It does not approve final payment capture timing or final provider-detail unlock evidence.

## Policy Rules

| Rule ID | Rule | Source requirement | Owning document | Owning role | Approval status | Related journey | Related workflow | Related exception | Future test | Related open question or configuration dependency |
|---|---|---|---|---|---|---|---|---|---|---|
| PHA-POL-001 | Eligible pharmacy work requires verified pharmacy organization, verified facility or branch, responsible professional, current credential status, approved service area, approved medicine category, storage and handling capability, no suspension, and operational readiness. | P00-10 provider eligibility | Pharmacy Fulfilment Policy | Pharmacy Operations Lead + Credentialing Lead | REQUIRES_APPROVAL | JRN-004 | WFL-003; WFL-004; WFL-010 | EXC-053 | TST-PHA-015 | OQ-00-225 |
| PHA-POL-002 | Pharmacy server-side search starts at 4 km, expands only through controlled policy stages, filters eligible providers, handles no-match safely, terminates search under approved rules, and routes wider-network cases to manual operations where approved. | P00-10 server-side search | Pharmacy Fulfilment Policy | Operations Lead + Security Lead | PROPOSED | JRN-004 | WFL-008 | EXC-034 | TST-PHA-001; TST-PHA-002 | OQ-00-217 |
| PHA-POL-003 | Matching criteria include exact medicine, strength, dosage form, quantity, valid prescription, allowed substitution, stock freshness, eligibility, service area, storage capability, delivery or collection capability, price, fulfilment window, coverage network, reliability projection, accessibility, and safe patient preferences without exposing internal ranking. | P00-10 matching criteria | Pharmacy Fulfilment Policy | Pharmacy Operations Lead | REQUIRES_APPROVAL | JRN-004 | WFL-008 | EXC-034 | TST-PHA-002 | OQ-00-218; OQ-00-219 |
| PHA-POL-004 | Pre-payment offers expose providerDisplayName as the only provider identity field, approved non-identifying price and availability information, opaque selection token, quote version, and quote expiry. | REQ-LOCK-003; P00-08 contract | Pharmacy Fulfilment Policy | Security Lead + Product Owner | APPROVED | JRN-004 | WFL-008 | EXC-052 | TST-PHA-004 | OQ-00-006 |
| PHA-POL-005 | Pre-payment offers must not expose provider location, branch, coordinates, distance, maps, directions, contact details, collection instructions, pickup instructions, internal IDs, metadata, or provider-specific ranking features; backend serialization removes them before client payload creation. | REQ-LOCK-004; P00-08 contract | Pharmacy Fulfilment Policy | Security Lead | APPROVED | JRN-004 | WFL-008 | EXC-052 | TST-PHA-005 | OQ-00-013 |
| PHA-POL-006 | Quote validity records quote issuer, content, price validity, stock-freshness timestamp, expiry policy, provider withdrawal, supersession, patient selection, duplicate selection handling, selection-token expiry, and audit without approving durations. | P00-10 quote validity | Pharmacy Fulfilment Policy | Pharmacy Operations Lead + Finance Owner | REQUIRES_APPROVAL | JRN-004 | WFL-008 | EXC-034 | TST-PHA-006 | OQ-00-219 |
| PHA-POL-007 | Inventory freshness sources may include manual entry, approved import, partner API, operational confirmation, or reservation system, but each needs source, timestamp, confidence or freshness status, reconciliation, failure handling, and audit. Stale stock must not be represented as confirmed stock. | P00-10 inventory freshness | Pharmacy Fulfilment Policy | Pharmacy Operations Lead | REQUIRES_APPROVAL | JRN-004 | WFL-009 | EXC-033 | TST-PHA-007 | OQ-00-218 |
| PHA-POL-008 | Stock reservation requires exact medicine, strength, form, quantity, selected pharmacy, intended order, available-stock guard, atomic reservation, expiry policy, idempotent consume/release/expiry, double-sale prevention, reconciliation path, and patient notification when reservation fails. | P00-10 stock reservation | Pharmacy Fulfilment Policy | Pharmacy Operations Lead + Architecture Lead | REQUIRES_APPROVAL | JRN-004 | WFL-009 | EXC-033 | TST-PHA-008 through TST-PHA-012 | OQ-00-220 |
| PHA-POL-009 | Reservation or approved firm confirmation must occur before payment capture; capture must not occur after reservation expiry. No detail release arises from reservation alone, pharmacist acceptance alone, or a client success screen. | P00-10 payment sequence | Pharmacy Fulfilment Policy | Finance Owner + Pharmacy Operations Lead + Security Lead | REQUIRES_APPROVAL | JRN-004 | WFL-009; WFL-018 | EXC-035 | TST-PHA-013 | OQ-00-221 |
| PHA-POL-010 | Proposed sequence: patient selects quote, server validates opaque token, ServiceOrder binds selected pharmacy, stock reserves or is firmly confirmed, payment or coverage begins, pharmacist review occurs at the approved point, pharmacist accepts or rejects, capture occurs only at the later approved point, ProviderDetailDisclosureDecision is evaluated separately, exact-order details release when approved, dispensing and reconciliation follow. | P00-10 proposed sequence | Pharmacy Fulfilment Policy | Finance Owner + Operations Lead | REQUIRES_APPROVAL | JRN-004 | WFL-008; WFL-009; WFL-010; WFL-018 | EXC-035 | TST-PHA-013 | OQ-00-221 |
| PHA-POL-011 | Pharmacist acceptance or rejection covers valid prescription, cancelled prescription, expired prescription, medicine unavailable, quantity unavailable, clarification required, restricted category, storage capability unavailable, safety concern, provider unable to fulfil, suspected fraud, or duplication. | P00-10 pharmacist acceptance | Pharmacy Fulfilment Policy | Pharmacy Operations Lead + Clinical Lead | REQUIRES_APPROVAL | JRN-004 | WFL-010 | EXC-032 | TST-PHA-014 | OQ-00-222 |
| PHA-POL-012 | Patient-facing rejection or hold messages must be privacy-safe and must not reveal unnecessary internal provider, stock, safety, fraud, or alternative-provider information. | P00-10 privacy-safe messages | Pharmacy Fulfilment Policy | Privacy Counsel + Security Lead | APPROVED | JRN-004 | WFL-010 | EXC-052 | TST-PHA-014 | OQ-00-013 |
| PHA-POL-013 | Dispensing requires authorized pharmacist action, exact order, exact prescription, exact quantity, substitution record where applicable, partial fulfilment record where applicable, batch or expiry information where approved, timestamp, handover mode, audit, and duplicate-dispensing prevention. | P00-10 dispensing | Pharmacy Fulfilment Policy | Pharmacy Operations Lead | REQUIRES_APPROVAL | JRN-004 | WFL-010 | EXC-032 | TST-PHA-016 | OQ-00-224 |
| PHA-POL-014 | Post-payment provider-detail disclosure remains exact-order, selected-provider, actor, patient, tenant, and server-decision bound. Provider replacement requires a fresh disclosure decision. Payer or support status does not create general access. | REQ-LOCK-006 through REQ-LOCK-009; P00-08 | Pharmacy Fulfilment Policy | Security Lead | APPROVED | JRN-004 | WFL-010 | EXC-052 | TST-PHA-018 | OQ-00-226 |
| PHA-POL-015 | Collection requires collection eligibility, authorized collector, recipient identity, pickup instructions only after disclosure authorization, handover proof, failed-collection handling, reservation/order expiry policy, safe return-to-stock review, and privacy-safe communication. | P00-10 collection | Pharmacy Fulfilment Policy | Pharmacy Operations Lead + Privacy Counsel | REQUIRES_APPROVAL | JRN-004 | WFL-010; WFL-011 | EXC-038 | TST-PHA-017 | OQ-00-227; OQ-00-228 |
| PHA-POL-016 | Failure and recovery paths must cover no match, stale stock, reservation failure, expiry, duplicate reservation, payment failure, pharmacist rejection, pharmacy suspension, prescription cancellation, provider replacement, patient cancellation, price change, partial fulfilment, dispensing error, collection failure, delivery failure, refund handoff, reconciliation mismatch, privacy incident, and clinical incident. | P00-10 failure list | Pharmacy Fulfilment Policy | Operations Lead | REQUIRES_APPROVAL | JRN-004; JRN-020 | WFL-008; WFL-009; WFL-010; WFL-019 | EXC-032 through EXC-035 | TST-PHA-003 through TST-PHA-019 | OQ-00-217 through OQ-00-229 |
| PHA-POL-017 | Pharmacy suspension during active work routes to explicit review, reassignment, cancellation, patient-safety process, refund handoff where applicable, and audit; new work is blocked while suspension applies. | Provider credential gating | Pharmacy Fulfilment Policy | Pharmacy Operations Lead + Credentialing Lead | PROPOSED | JRN-004 | WFL-004; WFL-010 | EXC-053 | TST-PHA-015 | OQ-00-225 |
| PHA-POL-018 | Partial-stock fulfilment cannot proceed without approved policy, patient approval where required, quantity tracking, price or refund adjustment handoff, and prevention of over-dispensing. | P00-10 partial stock | Pharmacy Fulfilment Policy | Pharmacy Operations Lead + Finance Owner | REQUIRES_APPROVAL | JRN-004 | WFL-010; WFL-019 | EXC-032 | TST-PHA-016 | OQ-00-224 |
| PHA-POL-019 | Refund, reversal, and chargeback handling after stock or fulfilment failure remains finance-approved policy and cannot create initial provider-detail disclosure eligibility. | P00-10 refund nuance | Pharmacy Fulfilment Policy | Finance Owner + Legal Counsel + Security Lead | REQUIRES_APPROVAL | JRN-004 | WFL-019 | EXC-035 | TST-PHA-019 | OQ-00-229; OQ-00-001 through OQ-00-004 |
| PHA-POL-020 | Future pharmacy tests use synthetic patients, prescriptions, pharmacies, quotes, stock states, payments, collection flows, disclosure decisions, and failure states only. | Locked testing rule | Pharmacy Fulfilment Policy | QA Lead + Security Lead | APPROVED | JRN-004 | WFL-008; WFL-009; WFL-010 | EXC-052 | TST-PHA-001 through TST-PHA-019 | P00-14 browser strategy |

## Future Pharmacy Tests

Synthetic tests must cover initial 4 km search, radius expansion, no match, providerDisplayName-only offer, protected-field absence, quote expiry, stale stock, atomic reservation, concurrent last-unit reservation, duplicate consume, duplicate release, reservation expiry, payment failure, pharmacist rejection, provider suspension, provider replacement, dispensing, collection, and refund handoff.

## Reservation and Payment Sequence

P00-10 records only the guard that stock reservation or an approved equivalent firm confirmation precedes payment capture. The exact order among payment authorization, pharmacist acceptance, capture, settlement, coverage evidence, and provider-detail disclosure remains REQUIRES_APPROVAL for P00-13 and cannot be treated as approved by this policy.

## Common Policy Status Statements

- Status: DRAFT-PENDING-APPROVAL.
- Clinical rules are not effective until approved by the designated clinical authority.
- Pharmacy rules are not effective until approved by pharmacy operations, clinical governance, legal, and regulatory reviewers.
- Laboratory rules are not effective until approved by laboratory operations, clinical governance, legal, and regulatory reviewers.
- Delivery rules are not effective until approved by operations, pharmacy, privacy, security, and legal reviewers.
- Final payment sequencing and disclosure-unlock evidence remain dependencies of P00-13.
- This document does not replace qualified professional judgment.
- Effective date: NOT EFFECTIVE UNTIL APPROVED.
- Version and change-control: every approved change requires a version increment, change reason, reviewer record, approval state, and preservation of previous versions.
- Required reviewers are listed in Document Control.
- Related decisions and open questions are listed in Document Control and the rule traceability tables.
