# Laboratory Ordering Policy

## Document Control

| Field | Value |
|---|---|
| Document title | Laboratory Ordering Policy |
| Codex prompt ID | P00-10 |
| Complete Breakdown work package | P00-13 |
| Issue ID | P00-FUL-001 |
| Owner role | Clinical Lead + Laboratory Operations Lead |
| Status | DRAFT-PENDING-APPROVAL |
| Clinical status | DRAFT-PENDING-APPROVAL |
| Review state | REQUIRES_APPROVAL |
| Required reviewers | Clinical Lead/Medical Director, Laboratory Operations Lead, Laboratory Clinical Owner, Legal Counsel, Regulatory Reviewer, Privacy Counsel, Security Lead |
| Last updated | 2026-06-24 |
| Effective date | NOT EFFECTIVE UNTIL APPROVED |
| Version | 0.1 draft |
| Related decisions | REQ-LOCK-003 through REQ-LOCK-011, REQ-CLN-020, REQ-FUL-025 through REQ-FUL-030 |
| Related open questions | OQ-00-243 through OQ-00-252 |
| Related journeys | JRN-005, JRN-006, JRN-020 |
| Related workflows | WFL-012 Diagnostic order, WFL-013 Laboratory appointment, WFL-014 Specimen, WFL-015 Diagnostic result |

Laboratory rules are not effective until approved by laboratory operations, clinical governance, legal, and regulatory reviewers. Final payment sequencing and disclosure-unlock evidence remain dependencies of P00-13. This policy does not replace qualified professional judgment.

## Scope

This draft covers clinician-directed diagnostic ordering, test-catalogue governance, laboratory matching, booking, preparation, approved home collection, specimen identity, processing handoff, result verification handoff, failure, and recollection.

It does not approve a pilot test catalogue, critical-value thresholds, preparation advice, home-collection operation, specimen-label technology, turnaround classifications, recollection cost rules, or final laboratory legal obligations.

## Policy Rules

| Rule ID | Rule | Source requirement | Owning document | Owning role | Approval status | Related journey | Related workflow | Related exception | Future test | Related open question or configuration dependency |
|---|---|---|---|---|---|---|---|---|---|---|
| LAB-POL-001 | Diagnostic orders require authorized clinician, valid credential, clinical assessment, correct patient, clinical reason, required test or panel, priority, relevant history where necessary, preparation requirements, specimen requirements, safety consideration, signature or equivalent, and audit. | P00-10 authorized ordering | Laboratory Ordering Policy | Clinical Lead | REQUIRES_APPROVAL | JRN-005 | WFL-012 | EXC-041 | TST-LAB-001 | OQ-00-243 |
| LAB-POL-002 | Proposed diagnostic-order content includes patient identity, order identifier, ordering clinician, encounter/assessment reference, test or panel, order items, clinical reason, priority, specimen type, collection method, preparation instructions, fasting requirement where approved, home-collection eligibility, relevant patient context, result recipients, expiry policy, version, signature, and cancellation/replacement linkage. Final mandatory fields require approval. | P00-10 diagnostic order content | Laboratory Ordering Policy | Clinical Lead + Laboratory Operations Lead | REQUIRES_APPROVAL | JRN-005 | WFL-012 | EXC-041 | TST-LAB-001 | OQ-00-243 |
| LAB-POL-003 | Test catalogue governance requires entry identifier, test name, synonyms, specimen type, collection requirements, preparation, method dependencies, turnaround classification, reference-range requirements, critical-result configuration, capability requirement, scope status, approval, version, effective date, suspension, retirement, and evidence. No pilot test list is approved in P00-10. | P00-10 test catalogue | Laboratory Ordering Policy | Laboratory Clinical Owner + Laboratory Operations Lead | REQUIRES_APPROVAL | JRN-005 | WFL-012; WFL-013 | EXC-041 | TST-LAB-003 | OQ-00-243; OQ-00-252 |
| LAB-POL-004 | Laboratory matching starts with a 4 km server-side search, controlled radius expansion, exact test capability, laboratory credential status, facility credential status, collection capability, home-collection capability where approved, availability, price, turnaround information, coverage network, accessibility, service area, and quality/reliability projection. | P00-10 lab matching | Laboratory Ordering Policy | Laboratory Operations Lead + Security Lead | PROPOSED | JRN-005 | WFL-013 | EXC-041 | TST-LAB-002 | OQ-00-243 |
| LAB-POL-005 | Internal ranking, provider location, address, branch identity, distance, maps, directions, contact details, collection instructions, preparation instructions that reveal location, internal IDs, and derivable metadata are not exposed pre-payment. | REQ-LOCK-003; REQ-LOCK-004 | Laboratory Ordering Policy | Security Lead | APPROVED | JRN-005 | WFL-013 | EXC-052 | TST-LAB-004; TST-LAB-005 | OQ-00-006; OQ-00-013 |
| LAB-POL-006 | Pre-payment laboratory offers expose providerDisplayName as the only provider identity field, approved price and non-identifying information, opaque selection token, and no location or identifying metadata. | P00-08 contract | Laboratory Ordering Policy | Security Lead + Product Owner | APPROVED | JRN-005 | WFL-013 | EXC-052 | TST-LAB-004 | OQ-00-006 |
| LAB-POL-007 | Selection, booking, and disclosure require quote selection, token validation, ServiceOrder association, funding flow, booking or slot hold, final financial evidence dependency, ProviderDetailDisclosureDecision, exact-order laboratory-detail release, preparation/visit instructions after authorization, home-collection address handling, and provider replacement. | P00-10 selection/booking/disclosure | Laboratory Ordering Policy | Laboratory Operations Lead + Finance Owner + Security Lead | REQUIRES_APPROVAL | JRN-005 | WFL-013; WFL-018 | EXC-041; EXC-052 | TST-LAB-006; TST-LAB-007 | OQ-00-245; OQ-00-246 |
| LAB-POL-008 | Preparation instructions are test-specific, versioned, clinically and laboratory approved, accessible, delivered after correct order selection, reissued when order changes, and do not invent fasting or medication handling advice without approval. | P00-10 preparation | Laboratory Ordering Policy | Clinical Lead + Laboratory Clinical Owner | REQUIRES_APPROVAL | JRN-005 | WFL-012; WFL-013 | EXC-041 | TST-LAB-008 | OQ-00-247 |
| LAB-POL-009 | Home collection is PILOT only where explicitly approved; otherwise it is BLOCKED-PENDING-REVIEW or POST-PILOT. It requires patient location, collector identity, collector credential, appointment, specimen kit, chain of custody, safety, failed-visit handling, privacy, collection incident handling, disclosure control, and payment/refund handoff. | P00-10 home collection | Laboratory Ordering Policy | Laboratory Operations Lead + Privacy Counsel | REQUIRES_APPROVAL | JRN-005 | WFL-013; WFL-014 | EXC-041; EXC-042 | TST-LAB-008 | OQ-00-244 |
| LAB-POL-010 | Specimen identity and chain of custody require correct patient, order, order item, specimen label, collector, collection location, collection timestamp, specimen type, transport condition, receipt, accession, acceptance or rejection, and audit. | P00-10 specimen identity | Laboratory Ordering Policy | Laboratory Operations Lead | REQUIRES_APPROVAL | JRN-005 | WFL-014 | EXC-042 | TST-LAB-009 | OQ-00-248 |
| LAB-POL-011 | Identity mismatch, wrong patient, wrong order, wrong container, insufficient specimen, damaged specimen, delayed transport, contamination, unapproved handling, lost specimen, or processing failure requires rejection, containment, communication, recollection ownership, payment/refund question handling, incident review, and audit. No costs are assigned in P00-10. | P00-10 specimen rejection | Laboratory Ordering Policy | Laboratory Operations Lead + Clinical Lead | REQUIRES_APPROVAL | JRN-005 | WFL-014 | EXC-042 | TST-LAB-010 through TST-LAB-013 | OQ-00-249; OQ-00-250; OQ-00-251 |
| LAB-POL-012 | Laboratory suspension during active work routes to explicit review, reassignment, cancellation, patient-safety handling, refund handoff where applicable, and audit; new work is blocked while suspension applies. | Provider credential gating | Laboratory Ordering Policy | Laboratory Operations Lead + Credentialing Lead | PROPOSED | JRN-005 | WFL-004; WFL-013; WFL-014 | EXC-053 | TST-LAB-014 | OQ-00-253 |
| LAB-POL-013 | Failure handling must cover no laboratory match, capability mismatch, booking failure, payment failure, laboratory rejection, credential suspension, patient no-show, collector no-show, invalid specimen, result delay, test cancellation, order replacement, wrong patient, wrong test, privacy incident, and critical-result workflow unavailable. | P00-10 failure cases | Laboratory Ordering Policy | Laboratory Operations Lead + Operations Lead | REQUIRES_APPROVAL | JRN-005; JRN-020 | WFL-012; WFL-013; WFL-014; WFL-015 | EXC-041 through EXC-045 | TST-LAB-001 through TST-LAB-015 | OQ-00-243 through OQ-00-253 |
| LAB-POL-014 | Laboratory order replacement, cancellation, or correction preserves history and does not overwrite earlier signed or issued clinical records. | REQ-LOCK-011 | Laboratory Ordering Policy | Clinical Lead + Laboratory Clinical Owner | APPROVED | JRN-005 | WFL-012 | EXC-041 | TST-LAB-015 | OQ-00-216 |
| LAB-POL-015 | Emergency safety action is not blocked by laboratory availability, booking failure, specimen workflow, payment, coverage, provider-detail protection, or laboratory processing status. | REQ-LOCK-010 | Laboratory Ordering Policy | Clinical Lead + Operations Lead | APPROVED | JRN-001; JRN-009 | WFL-006; WFL-016 | EXC-001 | TST-LAB-015 | OQ-00-030 |
| LAB-POL-016 | Future laboratory tests use synthetic patients, clinicians, laboratories, test catalogue entries, specimens, bookings, home-collection scenarios, identity mismatches, and result-delay cases only. | Locked testing rule | Laboratory Ordering Policy | QA Lead + Security Lead | APPROVED | JRN-005 | WFL-012; WFL-013; WFL-014 | EXC-052 | TST-LAB-001 through TST-LAB-015 | P00-14 browser strategy |

## Future Laboratory Tests

Synthetic tests must cover authorized diagnostic order, 4 km search, radius expansion, providerDisplayName-only offer, protected-field absence, booking, preparation, home collection disabled when unapproved, correct specimen identity, identity mismatch, rejection, recollection, lost specimen, laboratory suspension, and delayed result.

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
