# NelyoHealth Phase 0 Change Log

## 2026-06-23

### Entry 001 - Baseline planning shell created (P00-00)
- Added repository preflight + governance artifacts:
  - `docs/STATUS.md`
  - `docs/exec-plans/P00-product-clinical-regulatory-foundation.md`
  - `docs/governance/document-register.md`
  - `docs/governance/decision-register.md`
  - `docs/governance/open-questions.md`
  - `docs/governance/assumptions-register.md`
  - `docs/governance/traceability-conventions.md`
- Captured all locked phase-0 requirements as approved base decisions.
- Mapped `P00-01` through `P00-17` into execution order.
- Logged source-precedence and unresolved external questions.
- Confirmed no committed implementation code existed in the repository before planning baseline.
- Added explicit conflict references for bootstrap/dependency and package-numbering assumptions.

### Opened by
- Execution lead for NelyoHealth planning
- No external approvers were required to create this baseline, but several approvals remain pending.

### Change intent
- Preserve locked safety rules.
- Keep Phase 0 documentation-only and prepare stable handoff artifacts for external review.

### Risk notes
- This baseline is blocked for full implementation by unresolved legal and clinical questions listed in `docs/governance/open-questions.md`.

### Entry P00-00-REM-001 - P00-00 remediation corrections
- Date: 2026-06-23
- Files changed:
  - `docs/STATUS.md`
  - `docs/exec-plans/P00-product-clinical-regulatory-foundation.md`
  - `docs/governance/document-register.md`
  - `docs/governance/decision-register.md`
  - `docs/governance/open-questions.md`
  - `docs/governance/assumptions-register.md` (scoped consistency update)
  - `docs/governance/change-log.md`
  - `docs/governance/traceability-conventions.md`
- Provider-disclosure decision correction:
  - Confirmed explicit pre-payment allow-list and prohibited channels in locked decisions.
- Order-scoped authorization correction:
  - Replaced loose wording with actor, order, patient, tenant, and provider binding in REQ-LOCK-006 and REQ-LOCK-007.
- Deny-by-default payment-state correction:
  - Added explicit denied states covering created, initiated, pending, awaiting action, failed, cancelled, expired, unverified, and wrong-binding variants.
- Open-question schema correction:
  - Added required fields across all OQ entries (source docs, ownership, target prompt/package, priority, blocking, criterion, approval authority).
- Prompt/work-package crosswalk correction:
  - Added canonical mapping in `docs/exec-plans/P00-product-clinical-regulatory-foundation.md` and `docs/governance/traceability-conventions.md`.
- Document-register correction:
  - Removed duplicate `docs/architecture/context-map.md` row and normalized review states to allowed values.
- Status encoding correction:
  - Removed mojibake, added exact locked-decision count, and updated remediation progress and next action.
- Assumption-register correction:
  - Marked `ASSUMPT-06` as superseded by locked disclosure decisions.
- Reason for each correction:
  - Remediation required by validation against locked requirements and explicit source-precedence constraints before `P00-01` starts.
- Open approvals still required:
  - Legal disclosure minima, payer role scope, payment unlock/failure/refund/reversal/chargeback behaviors.

### Entry P00-01-001 - Product charter and principles authoring
- Date: 2026-06-23
- Files changed:
  - `docs/product/product-charter.md`
  - `docs/product/value-propositions.md`
  - `docs/product/business-model-hypotheses.md`
  - `docs/product/product-principles.md`
  - `docs/STATUS.md`
  - `docs/governance/document-register.md`
  - `docs/governance/change-log.md`
- Decisions and controls:
  - Preserved all locked product, payer-separation, disclosure, emergency, and clinical-integrity constraints.
  - Added explicit issue linkage for P00-01 and P00-PRD-001.
  - Added product and commercial hypotheses as non-final, non-binding assumptions.
  - Updated status to mark `P00-00` as PASS and `P00-01` as completed pending review.
- Validation notes:
  - No source code or configuration changes.
  - No production dependencies installed.
  - No unsupported claims of being insurer, provider, lab, hospital, HMO, emergency service.

### Entry P00-02-001 - MVP and pilot boundary planning
- Date: 2026-06-23
- Files changed:
  - `docs/product/mvp-scope.md`
  - `docs/product/pilot-operating-boundary.md`
  - `docs/product/service-catalogue-boundary.md`
  - `docs/product/non-goals.md`
  - `docs/product/expansion-gates.md`
  - `docs/product/business-model-hypotheses.md` (added BM-12 + scope note)
  - `docs/governance/document-register.md`
  - `docs/governance/decision-register.md`
  - `docs/governance/open-questions.md`
  - `docs/governance/assumptions-register.md`
  - `docs/governance/change-log.md`
  - `docs/STATUS.md`
  - `docs/exec-plans/P00-product-clinical-regulatory-foundation.md`
- Decisions and controls:
  - Added explicit P00-02 scope decision matrix entries: launch geography, age, consultation scope, pharmacy/lab scope, employer/HMO, home-care, and payment-method gating.
  - Added BM-12 to business-model-hypotheses as a non-approved pilot-coordination hypothesis.
  - Added `OQ-00-20` and `OQ-00-21` for unresolved launch geography and payment-method scope.
  - Updated `docs/governance/document-register.md` rows for the five P00-02 documents.
  - Updated execution status in `docs/STATUS.md` to `P00-02 COMPLETE, READY FOR ORCHESTRATION ACCEPTANCE`.
- Validation notes:
  - No production code or dependency changes.
  - All five required P00-02 artifacts created with required scope-label framing.
  - No unsupported treatment claims for home-care scope were included in pilot documents.

### Entry P00-02-002 - Service catalogue boundary completion
- Date: 2026-06-23
- Files changed:
  - `docs/product/service-catalogue-boundary.md`
  - `docs/governance/change-log.md`
- Corrections made:
  - Added explicit **Deferred employer and HMO services** section required by P00-02 catalogue structure.
  - Added explicit **Deferred home-care services** section required by P00-02 catalogue structure.
  - Aligned each new service row with existing scope labels, approval ownership, and P00-02 ownership mapping.
- Risk notes:
  - No scope expansion decisions were introduced by these additions; entries are all non-live pilot artifacts.
  - All non-pilot services remain documented as design-only or deferred.

### Entry P00-03-001 - Actor-tenancy model completion
- Date: 2026-06-24
- Prompt ID: P00-03
- Files changed:
  - `docs/product/personas.md`
  - `docs/product/actor-catalogue.md`
  - `docs/product/relationship-model.md`
  - `docs/architecture/tenancy-concept.md`
  - `docs/security/access-intent-matrix.md`
  - `docs/STATUS.md`
  - `docs/exec-plans/P00-product-clinical-regulatory-foundation.md`
  - `docs/governance/document-register.md`
  - `docs/governance/open-questions.md`
  - `docs/governance/change-log.md`
- Decisions added/updated:
  - Added P00-03 conceptual decisions in `docs/governance/decision-register.md` (REQ-GOV-001 through REQ-GOV-018).
  - Recorded canonicalization of disclosure and order-lock decisions (`REQ-LOCK-006`, `REQ-LOCK-007`, `REQ-LOCK-009`) and superseding lock scope notes.
  - Confirmed no implementation-facing RBAC, database, or dependency changes during actor-tenancy documentation.
- Assumptions added/updated:
  - Preserved `ASSUMPT-11` and linked no-new-continuity assumptions for account lifecycle transitions.
  - Reaffirmed approved synthetic-test and non-production constraint assumptions for this phase.
- Open questions added:
  - Added OQ-00-34 through OQ-00-43 to cover actor-tenancy conflict resolution, context switching, and matrix completion.
- Review/validation status:
  - Documentation-only constraints preserved.
  - No production code or dependency changes.
  - Updated status and register rows for P00-03 completion state.
- External approvals obtained or blocked:
  - BLOCKED / required for implementation: role-overlap precedence, overlap of sponsor/clinical proxy authority, multi-organization context semantics.
  - APPROVED: no-claim constraints, payer-clinical separation, and pre-payment/ordered-provider disclosure boundaries remain locked from earlier phase outputs.

## Template for future entries

For all future phase updates:
- Entry ID
- Date
- Prompt ID
- Files changed
- Decisions added/updated
- Assumptions added/updated
- Open questions added/closed
- Review/validation status
- External approvals obtained or blocked

### Entry P00-04-001 - Funding and coverage execution
- Date: 2026-06-24
- Files changed:
  - `docs/product/funding-and-coverage-model.md`
  - `docs/product/family-plan-rules.md`
  - `docs/product/diaspora-plan-rules.md`
  - `docs/product/employer-benefit-rules.md`
  - `docs/product/hmo-coverage-rules.md`
  - `docs/security/payer-visibility-matrix.md` (new)
  - `docs/STATUS.md`
  - `docs/exec-plans/P00-product-clinical-regulatory-foundation.md`
  - `docs/governance/document-register.md`
  - `docs/governance/decision-register.md`
  - `docs/governance/open-questions.md`
  - `docs/governance/assumptions-register.md`
  - `docs/governance/change-log.md`
  - `docs/governance/traceability-conventions.md`
- Decisions added:
  - Added `REQ-COV-001` through `REQ-COV-028` in decision register.
  - Added approved and review-gated payer-visibility and funding-boundary decisions.
- Open questions added:
  - Added `OQ-00-44` through `OQ-00-69` for P00-04 coverage and funding control uncertainties.
- Assumptions added/updated:
  - Added explicit pilot-scope and funding-selection assumptions for deferred employer/HMO and adult sponsorship boundaries.
- Governance and validation status:
  - Document register rows for P00-04 outputs set to DONE.
  - `docs/STATUS.md` now marks `P00-04` completed pending orchestration acceptance and `P00-05` not started.
  - Matrix and role visibility now explicitly represented in `docs/security/payer-visibility-matrix.md` with lock-bound protected disclosure constraints.
- External approvals/constraints:
  - No final payer/funding visibility or payment unlock behavior marked approved without external review.
  - Several questions remain open and blocking at finance/legal/privacy boundaries.

### Entry P00-04-002 - Funding and coverage follow-up refinements
- Date: 2026-06-24
- Files changed:
  - `docs/product/funding-and-coverage-model.md`
  - `docs/product/diaspora-plan-rules.md`
- Refinements:
  - Added explicit overlap-resolve policy options and overlap examples in the funding-and-coverage model.
  - Added waiting period and grace period semantics to funding lifecycle and re-authorization behavior.
  - Expanded diaspora cross-border boundary section with settlement currency and failed-payment constraints.
  - Added sponsor boundary failure case for attempts to access another beneficiaryÃ¢â‚¬â„¢s order.
- Validation impact:
  - No new requirements were approved during this follow-up.
  - No governance status transitions were changed; this is a documentation completeness update within `P00-04`.

### Entry P00-05-001 - End-to-end journeys and service blueprints
- Date: 2026-06-24
- Prompt ID: P00-05
- Files created:
  - `docs/product/user-journeys.md`
  - `docs/product/service-blueprints.md`
  - `docs/product/exception-journeys.md`
  - `docs/testing/journey-test-catalogue.md`
- Files updated:
  - `docs/STATUS.md`
  - `docs/exec-plans/P00-product-clinical-regulatory-foundation.md`
  - `docs/governance/document-register.md`
  - `docs/governance/decision-register.md`
  - `docs/governance/open-questions.md`
  - `docs/governance/assumptions-register.md`
  - `docs/governance/change-log.md`
- Decisions added/updated:
  - Added `REQ-JRN-001` through `REQ-JRN-012` for journey closure, exception ownership, conceptual state-language boundaries, provider-disclosure testing, browser validation, emergency precedence, and traceability identifiers.
- Assumptions added/updated:
  - Added `ASSUMPT-17` through `ASSUMPT-19` for functional journey ownership, conceptual state-language boundaries, and non-vendor external handoffs.
- Open questions added/closed:
  - Added `OQ-00-70` through `OQ-00-89` for operational queue targets, after-hours support, consultation failures, no-show handling, delivery failures, specimen recollection, delayed/critical lab results, referral follow-up, emergency fallback, account recovery, provider suspension, incident severity, privacy notification, direct-DB-edit prohibition, and browser artifact retention.
- Review/validation status:
  - Documented all 20 journeys (`JRN-001` through `JRN-020`) with scope labels and journey-level closure/reopening expectations.
  - Documented 20 service blueprints (`BP-JRN-001` through `BP-JRN-020`) with frontstage/backstage and human-operations boundaries.
  - Documented 54 exception journeys (`EXC-001` through `EXC-054`), including a provider-disclosure incident flow and prohibited direct-production-DB-edit escalation.
  - Documented 70 journey test scenarios with mandatory interactive IDE browser and deterministic Playwright coverage as strategy only.
  - Preserved pharmacy and laboratory pre-payment disclosure restrictions as server-side filtering and non-visual negative proof obligations.
  - Preserved emergency escalation outside payment, registration, plan authorization, marketplace comparison, and provider-detail obscuration.
- External approvals obtained or blocked:
  - No new clinical, legal, finance, vendor, payment, or operational approvals were claimed.
  - Operational SLOs, clinical escalation intervals, payment refund/reversal behavior, privacy incident notification, and browser artifact retention remain open for later prompts and external owners.

### Entry P00-06-001 - Glossary, data classification, and conceptual domain boundaries
- Date: 2026-06-24
- Prompt ID: P00-06
- Files created or completed:
  - `docs/glossary.md`
  - `docs/data/data-classification.md`
  - `docs/data/data-handling-matrix.md`
  - `docs/architecture/domain-boundaries.md`
  - `docs/architecture/context-map.md`
  - `docs/architecture/conceptual-domain-model.md`
  - `docs/architecture/source-of-truth-matrix.md`
  - `docs/architecture/event-catalogue-draft.md`
- Files updated:
  - `docs/STATUS.md`
  - `docs/exec-plans/P00-product-clinical-regulatory-foundation.md`
  - `docs/governance/document-register.md`
  - `docs/governance/decision-register.md`
  - `docs/governance/open-questions.md`
  - `docs/governance/assumptions-register.md`
  - `docs/governance/change-log.md`
- Coverage counts:
  - Glossary terms: 152 canonical glossary rows.
  - Data classifications: 12.
  - Bounded contexts: 22.
  - Source-of-truth entries: 31 major entity/concept rows plus 12 redacted projection rows.
  - Draft events: 82.
- Decisions added:
  - Added `REQ-DOM-001` through `REQ-DOM-012`.
  - Added `REQ-ARC-001` through `REQ-ARC-018`.
- Open questions added:
  - Added `OQ-00-90` through `OQ-00-110` for identity, source ownership, workflow/entity boundaries, provider disclosure persistence, audit retention, classification inheritance, de-identification, support projections, projection freshness, event ordering, integration retention, analytics review, and object metadata restrictions.
- Assumptions added:
  - Added `ASSUMPT-20` through `ASSUMPT-24` for modular-monolith module boundaries, rebuildable read models, vendor-neutral adapters, explicit orchestration, and analytics consistency.
- Provider-disclosure projection controls:
  - Defined `InternalProviderMatchingCandidate`, `PrePaymentProviderOfferView`, and `AuthorizedPostPaymentFulfilmentView` as separate conceptual views.
  - Preserved server-side pre-payment sanitization and exact-order, selected-provider, actor, patient, and tenant scoped post-payment disclosure.
  - Confirmed `providerDisplayName` as a field-level allowance only.
- Transaction and eventual-consistency rules:
  - Recorded atomic local invariants for ledger movements, finalized record versioning, prescriptions, diagnostic results, consent/audit, membership revocation, provider selection binding, stock reservation, account activation, and audit/outbox intent.
  - Recorded acceptable eventual consistency for notifications, analytics, search, reporting, partner callbacks, support projections, and read-model refresh.
- Remaining approvals:
  - Final successful-payment event remains pending P00-13.
  - Privacy/security approvals remain pending for final classification inheritance, support projection, artifact retention, audit retention, and de-identification policy.
  - Clinical/operations approvals remain pending for final workflow states and clinical ownership refinements.
- Validation status:
  - P00-06 documentation-only scope preserved.
  - No P00-07 workflow state machines were created.
  - No application code, database schema, dependency, configuration, or browser-tooling changes were introduced.

### Entry P00-07-001 - Workflow state-machine documentation
- Date: 2026-06-24
- Prompt ID: P00-07
- Files created:
  - `docs/workflows/state-machine-index.md`
  - `docs/workflows/cross-workflow-invariants.md`
  - `docs/workflows/identity-verification.md`
  - `docs/workflows/guardian-verification.md`
  - `docs/workflows/practitioner-credential-review.md`
  - `docs/workflows/facility-credential-review.md`
  - `docs/workflows/appointment.md`
  - `docs/workflows/encounter.md`
  - `docs/workflows/prescription.md`
  - `docs/workflows/pharmacy-quote.md`
  - `docs/workflows/stock-reservation.md`
  - `docs/workflows/pharmacy-order.md`
  - `docs/workflows/delivery.md`
  - `docs/workflows/diagnostic-order.md`
  - `docs/workflows/laboratory-appointment.md`
  - `docs/workflows/specimen.md`
  - `docs/workflows/diagnostic-result.md`
  - `docs/workflows/referral.md`
  - `docs/workflows/home-care-visit.md`
  - `docs/workflows/payment-intent.md`
  - `docs/workflows/refund.md`
  - `docs/workflows/payout.md`
  - `docs/workflows/prior-authorization.md`
  - `docs/workflows/claim.md`
  - `docs/workflows/consent.md`
  - `docs/workflows/complaint.md`
  - `docs/workflows/clinical-incident.md`
- Files updated:
  - `docs/STATUS.md`
  - `docs/exec-plans/P00-product-clinical-regulatory-foundation.md`
  - `docs/governance/document-register.md`
  - `docs/governance/decision-register.md`
  - `docs/governance/open-questions.md`
  - `docs/governance/assumptions-register.md`
  - `docs/governance/change-log.md`
- Coverage counts:
  - State machines: 25 (`WFL-001` through `WFL-025`).
  - Workflow states: 273 conceptual states.
  - Allowed transitions: 248 conceptual transition rows.
  - Illegal transitions: 125 illegal-transition rows.
  - Mermaid diagrams: 25 workflow state diagrams.
  - Cross-workflow invariants: 25 (`INV-WFL-001` through `INV-WFL-025`).
- Decisions added:
  - Added `REQ-WFL-001` through `REQ-WFL-025`.
- Open questions added:
  - Added `OQ-00-111` through `OQ-00-136` for workflow policy, clinical timing, finance, disclosure, retry, expiry, and operational ownership gaps.
- Assumptions added:
  - Added `ASSUMPT-25` through `ASSUMPT-30` for conceptual state names, configuration-controlled timing, authoritative state/version/history, stale projections, duplicate/out-of-order callbacks, and explicit orchestration.
- Event-catalogue reconciliation:
  - Inspected `docs/architecture/event-catalogue-draft.md`.
  - No file change was required because P00-07 workflows reference existing draft events or transition-history/audit intent.
  - `ProviderDetailDisclosureEligibilityEstablished` remains `REQUIRES_APPROVAL` and is not treated as a generic payment-success event.
- Provider-disclosure safeguards:
  - Payment intent states do not unlock provider details.
  - Pharmacy quote and laboratory appointment workflows preserve server-side sanitization and `providerDisplayName`-only pre-payment provider identity.
  - Post-payment disclosure remains exact-order, selected-provider, actor, patient, tenant, and server-authorized.
- Clinical-record integrity safeguards:
  - Prescription, diagnostic result, encounter, referral, and clinical incident workflows preserve amendment/replacement/correction/supersession rather than silent overwrite.
- Emergency safeguards:
  - Emergency escalation remains independent of payment, coverage, registration, prior authorization, marketplace comparison, and provider-detail obscuration.
- Remaining approvals:
  - Numeric timeouts, retry limits, clinical escalation intervals, payment unlock event, refund/reversal/chargeback disclosure effects, operational queue targets, and regulatory reporting obligations remain pending.
### Entry P00-08-001 - Provider-detail disclosure contract and threat model

- **Date:** 2026-06-24
- **Prompt:** P00-08
- **Files created:** 5
- **Files updated:** 8
- **Requirements added:** `PRV-REQ-001` through `PRV-REQ-040`
- **Contract fields added:** `PRV-FLD-001` through `PRV-FLD-034`
- **Policy rules added:** `PRV-POL-001` through `PRV-POL-033`
- **Threat scenarios added:** `PRV-THR-001` through `PRV-THR-065`
- **Test scenarios added:** `PRV-TST-001` through `PRV-TST-035`
- **ADR:** `ADR-0001` accepts server-side provider-detail release after order-scoped eligibility; final financial evidence remains `REQUIRES_APPROVAL` for P00-13.
- **Decisions added:** `REQ-PRV-001` through `REQ-PRV-028`
- **Open questions added:** `OQ-00-137` through `OQ-00-160`
- **Open questions linked:** `OQ-00-087`, `OQ-00-089`, `OQ-00-097`, `OQ-00-098`, `OQ-00-101`, `OQ-00-129`, `OQ-00-130`
- **Assumptions added:** `ASSUMPT-31` through `ASSUMPT-35`
- **Summary:** Added allow-list/deny-list provider-disclosure contract, exact-order authorization model, map/cache/telemetry/support restrictions, threat model, negative test matrix, and remaining approval map.
- **Next prompt status:** P00-09 NOT STARTED.
### Entry P00-09-001 - Clinical scope, safety, emergency, referral, and critical-result protocols

- **Date:** 2026-06-24
- **Prompt:** P00-09
- **Files created:** 12
- **Files updated:** 15
- **Clinical requirement count:** `CLN-REQ-001` through `CLN-REQ-035` = 35
- **Scope-rule count:** `CLN-SCP-001` through `CLN-SCP-013` = 13
- **Hazard count:** `CLN-SAF-001` through `CLN-SAF-025` = 25 hazards
- **Emergency-rule count:** `CLN-EMR-001` through `CLN-EMR-012` = 12
- **Urgent-rule count:** `CLN-URG-001` through `CLN-URG-005` = 5
- **Referral-rule count:** `CLN-REF-001` through `CLN-REF-008` = 8
- **Critical-result-rule count:** `CLN-CRT-001` through `CLN-CRT-009` = 9
- **Incident-rule count:** `CLN-INC-001` through `CLN-INC-007` = 7
- **Runbook-step count:** `CLN-RUN-001` through `CLN-RUN-040` = 40
- **Decisions added:** `REQ-CLN-001` through `REQ-CLN-035`
- **Open questions added:** `OQ-00-161` through `OQ-00-204`
- **Assumptions added:** `ASSUMPT-36` through `ASSUMPT-40`
- **Workflow alignment:** P00-09 clinical guard sections added to appointment, encounter, diagnostic order, diagnostic result, referral, clinical incident, and cross-workflow invariants.
- **Event alignment:** Added minimum-necessary draft clinical events `EVT-083` through `EVT-093`; existing `EVT-027 EmergencyEscalationTriggered` was not duplicated.
- **Remaining approvals:** Clinical, legal, privacy, security, operations, laboratory, pharmacy, finance, accessibility, and regulatory approvals remain required before the documents become effective.
- **Next prompt status:** P00-10 NOT STARTED.


### Entry P00-10-001 - Prescription, pharmacy, laboratory, result-release, and delivery policies

- **Date:** 2026-06-24
- **Prompt:** P00-10
- **Complete Breakdown work package:** P00-13
- **Files created:** 5
- **Files updated:** 20
- **Prescription-rule count:** `RX-POL-001` through `RX-POL-014` = 14
- **Pharmacy-rule count:** `PHA-POL-001` through `PHA-POL-020` = 20
- **Delivery-rule count:** `DLV-POL-001` through `DLV-POL-016` = 16
- **Laboratory-ordering-rule count:** `LAB-POL-001` through `LAB-POL-016` = 16
- **Result-release-rule count:** `RES-POL-001` through `RES-POL-016` = 16
- **Cross-cutting fulfilment requirements:** `FUL-REQ-001` through `FUL-REQ-021` = 21
- **Decisions added:** `REQ-FUL-001` through `REQ-FUL-040`
- **Open questions added:** `OQ-00-205` through `OQ-00-264`
- **Assumptions added:** `ASSUMPT-41` through `ASSUMPT-48`
- **Workflow alignment:** P00-10 alignment notes added to prescription, pharmacy quote, stock reservation, pharmacy order, delivery, diagnostic order, laboratory appointment, specimen, diagnostic result, payment intent, refund, and cross-workflow invariants.
- **Event alignment:** Added draft fulfilment/result events `EVT-094` through `EVT-110` with minimum-necessary payloads.
- **Reservation-before-capture safeguard:** recorded stock reservation or approved firm confirmation before capture, while leaving final sequencing for P00-13.
- **Provider-disclosure safeguards:** preserved `providerDisplayName`-only pre-payment provider identity, server-side field removal, exact-order post-payment disclosure, and fresh disclosure decision on provider replacement.
- **Critical-result safeguards:** result release policy references P00-09 and keeps notification, acknowledgment, escalation, clinical action, and closure distinct.
- **Result-to-treatment boundary:** laboratory result verification or release does not create prescriptions, start pharmacy search, purchase medicine, change treatment, or close diagnostic loop.
- **Remaining approvals:** clinical, pharmacy, laboratory, legal, privacy, security, finance, regulatory, operations, delivery, and architecture approvals remain required before policy effectiveness or implementation.
- **Next prompt status:** P00-11 NOT STARTED.
## P00-11 privacy, consent, guardianship, delegation, and data governance

- Created ten draft P00-11 artifacts: data-flow map, processing activities draft, consent matrix, guardian and delegation policy, retention schedule draft, data-subject-rights workflows, cross-border data register, subprocessor register draft, break-glass policy, and notification data policy.
- Added 32 `DAT-REQ-*` requirements, 56 `DFM-FLW-*` data-flow rows, 42 `ROPA-ACT-*` processing activities, 25 `CNS-POL-*` consent rules, 11 `GDN-POL-*` guardian/delegation rules, 59 `RET-CAT-*` retention categories, 20 `DSR-WFL-*` data-subject-rights workflow entries, 28 `XBR-FLW-*` cross-border flows, 28 `SUB-REQ-*` subprocessor due-diligence categories, 9 `BGA-POL-*` break-glass rules, and 42 `NTF-POL-*` notification rules.
- Added decisions `REQ-DAT-001` through `REQ-DAT-040`, open questions `OQ-00-265` through `OQ-00-346`, and assumptions `ASSUMPT-49` through `ASSUMPT-56`.
- Updated document register, decision register, open questions, assumptions register, traceability conventions, status, execution plan, event catalogue, and workflow privacy alignment sections.
- Preserved locked requirements: one longitudinal patient identity, payer/clinical-access separation, order-scoped provider-detail disclosure after successful payment only, emergency escalation independent of marketplace/payment/registration, signed-record amendment/versioning, synthetic-only browser testing, and Phase 0 documentation-only scope.
- Remaining approvals: privacy counsel, legal counsel, DPO/privacy owner, security lead, clinical lead, operations lead, finance/payments owner, architecture owner, QA/accessibility owner, pharmacy operations lead, laboratory operations lead, and external regulatory counsel where applicable.
## P00-12 regulatory source and obligations register

- Executed P00-12 / issue `P00-REG-001` for Complete Breakdown work package P00-15.
- Created six compliance artifacts: official source register, obligations register, legal question log, licence and registration matrix, contract register draft, and regulatory change monitoring.
- Official authorities researched: NDPC, PCN, MDCN, MLSCN, NHIA, CBN, Federal Ministry of Health and Social Welfare, NAFDAC, FCCPC, ARCON, NITDA/cybersecurity sources, official gazette/certified legal material sources, and state authorities as state-dependent.
- Source count: 24 `REG-SRC-*` entries.
- Obligation count: 46 `REG-OBL-*` entries.
- Legal-question count: 40 `REG-Q-*` entries.
- Licence-matrix count: 30 `REG-LIC-*` entries.
- Contract-category count: 33 `REG-CTR-*` entries.
- Monitoring-source count: 15 `REG-MON-*` entries.
- Decisions added: `REQ-REG-001` through `REQ-REG-028`.
- Open questions added: `OQ-00-347` through `OQ-00-386`.
- Assumptions added: `ASSUMPT-57` through `ASSUMPT-63`.
- PCN disclosure conflict recorded: PCN e-pharmacy platform/display duties may conflict with the locked transaction-level providerDisplayName-only pre-payment matching model; pharmacy pilot is launch-gated pending Nigerian legal/regulatory review and likely PCN clarification.
- First-pilot legal blockers include entity/telemedicine posture, PCN aggregator classification, PCN display-rule reconciliation, NEPP, pharmacy partner/SP structure, lab facility and practitioner verification, doctor licensing/practice structure, NDPC registration/DPIA, payment/wallet structure, pilot-state requirements, emergency-treatment responsibilities, and required provider contracts.
- Access-limited or uncertain sources include MDCN full Code of Medical Ethics, certified National Health Act copy, Child Rights/state laws, Cybercrimes Act/amendment copies, detailed MLSCN standards, ARCON current code/Act copies, and pilot-state materials.
- Remaining approvals: Nigerian legal/regulatory counsel, clinical lead, privacy/DPO, finance/payments owner, security lead, operations lead, pharmacy operations lead, laboratory operations lead, architecture owner, marketing owner, and external orchestration.

### Entry 013 - Payments, ledger, claims, and commercial rules documented (P00-13)

- **Prompt:** P00-13.
- **Complete Breakdown work package:** P00-16.
- **Files created:** `docs/finance/funds-flow.md`, `docs/finance/payment-state-model.md`, `docs/finance/ledger-principles.md`, `docs/finance/refund-and-dispute-policy.md`, `docs/finance/provider-settlement-policy.md`, `docs/finance/claims-and-remittance-boundary.md`, `docs/adr/ADR-0002-wallet-as-ledger-backed-balance.md`.
- **Files updated:** status, execution plan, document register, decision register, open questions, assumptions register, traceability conventions, event catalogue, payment/refund/payout/prior-authorization/claim/stock-reservation/pharmacy-order/laboratory-appointment workflows, cross-workflow invariants, and provider-disclosure artifacts.
- **Counts:** 17 `FIN-REQ-*` finance requirement rows, 15 funds flows, 45 finance decisions, 105 finance open questions, 7 finance assumptions, 30 event-catalogue additions, 60 `FIN-TST-*` future test requirements, 20 `LED-POL-*` ledger invariants, 14 `PAY-POL-*` canonical payment concepts, 13 `RFD-POL-*` refund definitions, 8 `STL-POL-*` provider-settlement principles, and 10 `CLM-POL-*` claims/remittance boundary rules.
- **OrderFundingSecured:** proposed as a finance fact requiring verified capture or confirmed receipt or approved equivalent, exact order/provider/patient/tenant binding, all funding allocations secured, balanced ledger posting, idempotency, correlation, and audit. It remains PROPOSED and is not approved for implementation.
- **Provider disclosure:** financial facts do not directly expose provider details; `ProviderDetailDisclosureDecision` remains separately authoritative, exact-order scoped, deny-by-default, server-side, and no-store.
- **Wallet and custody:** ADR-0002 proposes ledger-backed FundingBalanceView and keeps wallet terminology, custody, stored value, FX, tax, and customer-fund handling approval-gated.
- **P00-12 dependencies:** CBN/PCN/MLSCN/NHIA/data-protection/payment/wallet legal and regulatory issues remain unresolved where P00-12 marked them unresolved.
- **Phase boundary:** no production code, API, database schema, migration, dependency, payment integration, provider selection, browser tooling, currency, FX provider, tax rate, percentage, settlement interval, payout interval, refund interval, or chargeback period was introduced.
- **Remaining approvals:** finance, Nigerian legal/regulatory, accounting, tax, privacy/DPO, security, pharmacy operations, laboratory operations, product, architecture, operations, and external orchestration acceptance.



## Entry 014 - P00-14 non-functional requirements and browser-validation strategy

- **Prompt:** P00-14
- **Date:** 2026-06-24
- **Change type:** Documentation implementation
- **Summary:** Added draft security, reliability, accessibility, performance, test strategy, browser validation strategy, privacy-boundary testing, and ADR-0003 artifacts.
- **Constraints preserved:** No production code, dependency installation, browser tooling, `.codex/config.toml`, Playwright configuration, smoke route, fixtures, or browser execution.
- **Approval status:** DRAFT-PENDING-SECURITY-ARCHITECTURE-QA-ACCESSIBILITY-PRIVACY-AND-OPERATIONS-APPROVAL.

## Entry 015 - P00-14 revision for experience quality, motion, UI UX Pro Max, and content alignment

- **Prompt:** P00-14 revision
- **Date:** 2026-06-24
- **Change type:** Documentation implementation
- **Summary:** Added experience-quality, Motion for React, UI UX Pro Max governance, content-alignment, design/content validation, and ADR-0004 artifacts; registered P00-14A as the next required supplemental work package before P00-15.
- **Constraints preserved:** No Motion dependency, UI UX Pro Max install, Playwright install, browser tooling, UI components, routes, design tokens, visual fixtures, production copy, or AGENTS.md workflow introduced.
- **Approval status:** DRAFT-PENDING-SECURITY-ARCHITECTURE-QA-ACCESSIBILITY-PRIVACY-AND-OPERATIONS-APPROVAL.

## Entry 016 - P00-14A experience design, visual system, motion system, and content architecture

- **Prompt:** P00-14A
- **Date:** 2026-06-25
- **Change type:** Documentation implementation
- **Files created:** 23 P00-14A artifacts.
- **Files updated:** STATUS, execution plan, document register, decision register, open questions, assumptions, change log, traceability conventions, ADR-0004.
- **Experience-principle count:** 20.
- **Candidate visual directions:** 3.
- **Recommended visual direction:** VIS-DIR-002 Warm Care Grid.
- **Token count by category:** 26 color, 12 typography, 9 spacing, 8 sizing, 5 radius, 5 shadow/elevation, 7 z-index, 5 breakpoints, 16 motion.
- **Page count:** 29 seed pages.
- **Section count:** 37 canonical section contracts covering the P00-14A seed page inventory.
- **Component count:** 32 primitives, 26 domain components, 22 content-component contracts, 33 interaction patterns.
- **Motion-pattern count:** 22.
- **Public website page count:** 18.
- **Content-model count:** 25 conceptual content types.
- **CTA count:** 14 CTA verb rules.
- **Message count:** 27 state-message templates.
- **Validation-requirement count:** 54 design/content validation anchors.
- **Decisions added:** 40 (`REQ-DES-001` through `REQ-DES-020`, `REQ-CNT-001` through `REQ-CNT-020`).
- **Open questions added:** 42 (`OQ-00-633` through `OQ-00-674`).
- **Assumptions added:** 9 (`ASSUMPT-81` through `ASSUMPT-89`).
- **UI UX Pro Max review brief:** Created; no skill installed or executed.
- **Phase 1 Motion handoff:** Created in motion-system and validation documents; no package installed.
- **Phase 1 content-registry handoff:** Repository-based structured content registry recommended; not implemented.

## Entry 017 - P00-15 metrics, service levels, operational queues, and pilot readiness

| Field | Value |
|---|---|
| Date | 2026-06-25 |
| Prompt | P00-15 |
| Complete Breakdown work package | P00-18 |
| Issue ID | P00-OPS-001 |
| Files created | docs/operations/metric-catalogue.md; docs/operations/sli-slo-draft.md; docs/operations/exception-queue-catalogue.md; docs/operations/pilot-stop-conditions.md; docs/data/analytics-data-policy.md |
| Files updated | docs/STATUS.md; docs/exec-plans/P00-product-clinical-regulatory-foundation.md; docs/governance/document-register.md; docs/governance/decision-register.md; docs/governance/open-questions.md; docs/governance/assumptions-register.md; docs/governance/change-log.md; docs/governance/traceability-conventions.md; docs/architecture/event-catalogue-draft.md |
| Metric count | 300 |
| Metric-group count | 15 |
| SLI count | 64 |
| SLO count | 64 |
| Dashboard count | 16 |
| Queue count | 90 |
| Stop-condition count | 55 |
| Analytics-policy count | 15 |
| Decision count | 45 |
| Open-question count | 100 |
| Assumption count | 10 |
| Event or workflow alignment | Added P00-15 operational event candidates to docs/architecture/event-catalogue-draft.md; workflow redesign was not performed. |
| Provider-disclosure analytics safeguards | Pre-payment provider address, branch, coordinates, distance, map, route, contact, matching features, patient-provider location pairs, and enumeration-enabling identifiers are prohibited from analytics. |
| Accessibility, design, and content readiness metrics | Accessibility blockers, keyboard/focus/screen-reader/reflow/reduced-motion defects, browser release gates, design review, UI UX Pro Max review evidence, content approval, unsupported claims, CTA mismatch, visual regression, and protected visual artifact checks are included. |
| Pilot decision model | CONTINUE, CONTINUE-WITH-CONDITIONS, FREEZE-EXPANSION, PAUSE-CAPABILITY, PAUSE-PILOT, STOP-PILOT, ROLLBACK-RELEASE, and EMERGENCY-CONTAINMENT are defined as proposed decision outcomes. |
| Remaining approvals | Product, operations, clinical, privacy, security, finance, accessibility, design, content, engineering, and legal/regulatory approvals remain required before production reliance. |

## Entry 018 - P00-16 risks, assumptions, dependencies, and ADR consolidation

| Field | Value |
|---|---|
| Date | 2026-06-25 |
| Prompt | P00-16 |
| Complete Breakdown work package | P00-19 |
| Issue ID | P00-RSK-001 |
| Files created | docs/governance/risk-register.md; docs/governance/dependency-register.md; docs/adr/ADR-index.md; ADR-0005 through ADR-0011 |
| Files updated | docs/governance/assumptions-register.md; docs/STATUS.md; docs/exec-plans/P00-product-clinical-regulatory-foundation.md; docs/governance/document-register.md; docs/governance/decision-register.md; docs/governance/open-questions.md; docs/governance/change-log.md; docs/governance/traceability-conventions.md |
| Risk count | 147 |
| Risk-category count | 15 |
| Top-ten risks | RSK-091, RSK-100, RSK-109, RSK-112, RSK-114, RSK-115, RSK-116, RSK-031, RSK-032, RSK-033 |
| Pilot blockers | 51 |
| Phase 1 blockers | 41 |
| Dependency count | 168 |
| Dependency categories | 26 |
| Assumptions reviewed | 42 named planning assumptions plus architecture-changing assumption summary |
| Assumptions validated | 0 newly validated by Codex |
| Assumptions challenged | Approval-required and unvalidated assumptions recorded |
| Assumptions superseded | Locked requirements confirmed as decisions, not assumptions |
| Architecture-changing assumptions | 19 |
| ADR count | 11 indexed |
| New ADRs | ADR-0005 through ADR-0011 |
| Superseded ADRs | None |
| Decisions added | 35 |
| Open questions added | 57 |
| Provider-disclosure risks | Covered, including PCN conflict, API/DOM/accessibility-tree/map/analytics/log/browser/support leakage, wrong order/patient/tenant, refund/chargeback recomputation, replacement, and external lookup. |
| Regulatory risks | Covered, including legal posture, PCN, NEPP, pharmacist/pharmacy/lab, NDPC/DPIA/DPO, CBN/payment, HMO/employer, advertising, and geography. |
| Tooling and supply-chain risks | Covered, including Playwright, MCP, browser artifacts, prompt injection, UI UX Pro Max, Motion, Node/package, CI, secrets, and environment parity. |
| Remaining approvals | Product, clinical, legal/regulatory, privacy, security, finance, operations, accessibility, design, content, engineering, and founder approvals remain required. |

## Entry 019 - P00-17 Phase 0 traceability, consistency gate, approval review, and Phase 1 handoff

| Field | Value |
|---|---|
| Date | 2026-06-25 |
| Prompt | P00-17 |
| Complete Breakdown work package | P00-20 |
| Issue ID | P00-GATE-001 |
| Files created | docs/governance/phase-0-requirements-traceability.md; docs/governance/phase-0-consistency-audit.md; docs/governance/approval-register.md; docs/governance/unresolved-blocker-register.md; docs/governance/phase-0-gate-review.md; docs/governance/phase-1-readiness-handoff.md; docs/governance/phase-0-completion-report.md |
| Files updated | docs/STATUS.md; docs/exec-plans/P00-product-clinical-regulatory-foundation.md; docs/governance/document-register.md; docs/governance/decision-register.md; docs/governance/change-log.md; docs/governance/traceability-conventions.md |
| Artifact coverage | P00-00 through P00-17 and P00-14A covered; registered artifact path check performed. |
| Traceability coverage | 30 locked requirements plus ADRs, top risks, blockers, and requirement-family inventory. |
| Consistency findings | 10 audit findings; no Phase 0 blocking locked-requirement contradiction found. |
| Corrections made | Corrected old requirements-traceability-matrix document-register path to phase-0-requirements-traceability. |
| Approval items | 38 |
| Blocker count by class | {'BLOCKS-SPECIFIC-CAPABILITY-IMPLEMENTATION': 10, 'BLOCKS-PILOT-LAUNCH': 25, 'NONBLOCKING-TRACKED': 1} |
| Phase 0 verdict | PHASE-0-CONDITIONAL-PASS |
| Phase 1 verdict | PHASE-1-GO-WITH-CONDITIONS |
| Pilot verdict | PILOT-NO-GO |
| Conditions | Phase 1 restricted to foundation work, synthetic data, no live operation, and blocker governance; pilot launch remains blocked. |
| Next action | External orchestration acceptance of P00-17. |


## Entry 020 - P01-FND-001 repository, toolchain, CI, and browser foundation

- **Date:** 2026-06-25.
- **Prompt:** P01-FND-001.
- **Scope:** TypeScript monorepo foundation, pnpm workspace, Turborepo, ESLint, Prettier, TypeScript, Vitest, Playwright Test, accessibility smoke, synthetic smoke server, CI, Codex project MCP config, basic secret scan, and engineering documentation.
- **Files created:** root toolchain/config files, .github workflow, .codex config, tests, smoke server, engineering docs, execution plan, README, lockfile.
- **Validation passed:** install, frozen-lockfile install, format:check, lint, typecheck, unit test, integration test, test:e2e, test:browser, test:a11y, build, verify, basic secret scan.
- **Validation warning:** local host Node is v25.8.1 while repository runtime is pinned to Node 24.18.0.
- **Interactive browser result:** PARTIAL; Codex browser runtime call failed with `codex/sandbox-state-meta: missing field sandboxPolicy` before page automation.
- **Phase boundary:** no Phase 2 work, no application feature, no domain feature, no database, no auth, no payment, no provider integration, no Motion, no UI UX Pro Max, no AGENTS.md, no .agent/PLANS.md, and no .agents/skills were created.
- **Next action:** external orchestration review, then browser-integration verification only after IDE/runtime reload or compatibility correction.

## Entry 021 - P01-FND-001R interactive browser CLI fallback and foundation closure

- **Date:** 2026-06-25.
- **Prompt:** P01-FND-001R.
- **Scope:** Official Playwright CLI fallback for interactive Codex IDE terminal browser operation while preserving the existing Playwright MCP configuration and blocker.
- **Files changed:** package and lockfile for `@playwright/cli@0.1.14`, `.gitignore`, README, browser tooling docs, browser CLI fallback doc, P01 execution plan, status, decision register, dependency register, unresolved blocker register, and this change log.
- **Validation evidence:** exact CLI package metadata and version verified; CLI Chromium browser installed; named `nelyohealth-smoke` session opened `http://127.0.0.1:4173`; interactive smoke sequence completed for accessibility snapshot, heading/navigation, button/live-region, invalid/valid form, dialog focus, same-origin request, console, storage, IndexedDB, service workers, desktop/tablet/mobile snapshots, keyboard focus, reduced motion, screenshot, trace, browser close, server stop, and no remaining CLI browser session.
- **MCP status:** Playwright MCP remains upstream blocked with `codex/sandbox-state-meta: missing field sandboxPolicy`; blocker downgraded to `NONBLOCKING-TRACKED` for P01-FND-001 closure only.
- **Phase boundary:** no P01-FND-002 work, Phase 2 work, production feature, application framework, product UI, real data, global package, personal browser profile, extension mode, CDP attach, unsafe sandbox flag, undocumented `sandboxPolicy`, `.agents/skills`, or `AGENTS.md` was introduced.
- **Next action:** external orchestration review of P01-FND-001R. P01-FND-002 remains not started.


## 2026-06-25T03:29:17.292Z - P01-FND-002 design foundation
- Added design tokens, content registry, UI foundation primitives, synthetic design preview, browser/a11y tests, and governed UI UX Pro Max advisory wrapper.
- No production application feature, clinical workflow, payment flow, database, or product app implementation was added.
- UI UX Pro Max remains advisory only; external license review remains tracked.

## 2026-06-25 - P01-FND-003

- Added repository collaboration, release-readiness, dependency-governance, and Phase 1 closure artifacts.
- Installed @changesets/cli 2.31.0 as an exact local development dependency.
- Added local policy checks for package versions, GitHub Actions pinning, community health, dependency licenses, Changesets config, and release readiness.
- Updated CI to include repository governance checks and added a read-only manual release-readiness workflow.
- Recorded Phase 1 as PHASE-1-CONDITIONAL-PASS, Phase 2 entry as PHASE-2-GO-WITH-CONDITIONS, and pilot as PILOT-NO-GO.

## 2026-06-25 - P01-FND-004

- Added root and nested `AGENTS.md` repository instruction files.
- Added `.agent/PLANS.md` as an execution-plan convention, not autonomous-agent configuration.
- Added the `nelyo-browser-validation` Codex Skill and references for browser, provider-disclosure, and artifact-safety review.
- Added human-only Git and GitHub governance, the manual GitHub ruleset checklist, and explicit Phase 1 map amendments.
- Added `pnpm test:visual` as a deterministic synthetic visual-contract suite and kept screenshot baselines deferred pending a controlled environment.
- Added `pnpm db:migrate` and `pnpm db:seed` command interfaces that intentionally fail in Phase 1 and create no database artifacts.
- Updated CI, repository verification, governance registers, status, gate review, completion report, and Phase 2 handoff for P01-FND-004.
- Preserved Playwright CLI as the verified interactive fallback and reverified project-scoped Playwright MCP for local synthetic smoke with Codex CLI 0.141.0.
- Preserved Phase 1 as PHASE-1-CONDITIONAL-PASS, Phase 2 as NOT STARTED, and pilot as PILOT-NO-GO.

## 2026-06-25 - P02-PLAN-001

- Added Phase 2 platform and infrastructure foundation planning artifacts.
- Created the authoritative 18-issue Phase 2 implementation backlog without starting implementation.
- Added current primary-source technology evaluation for app stack, data/infra, local testing, browser harness, and IaC options.
- Planned future app topology, local infrastructure, environment strategy, browser harness, and requirement/exit-gate traceability.
- Updated governance registers for P02 planning decisions, open questions, assumptions, risks, dependencies, blockers, document registration, and traceability prefixes.
- Did not create apps, database schemas, migrations, seeds, Docker files, IaC, deployment workflows, framework configs, or application code.
- Preserved manual Git/GitHub governance, Phase 2 implementation as NOT STARTED, Phase 3 as NOT STARTED, and pilot as PILOT-NO-GO.

## 2026-06-25 - P02-ISS-001

- Accepted P02-PLAN-001 status from the execution prompt and completed P02-ISS-001 pending orchestration acceptance.
- Added the P02-ISS-001 execution plan, dependency decision pack, and ADR review checklist.
- Added ADR-P02-001 through ADR-P02-006 for application frameworks, database access/migrations, Redis-compatible queue/cache, object storage, IaC/cloud path, and observability/error reporting.
- Recorded exact future dependency pins without installing dependencies or changing package manifests.
- Updated ADR index, status, decision register, dependency register, blocker register, risk register, document register, and Phase 2 traceability.
- Did not create apps, schemas, migrations, seeds, Docker files, IaC files, deployment workflows, framework configs, application code, or CI deployment changes.
- Preserved manual Git/GitHub governance, P02-ISS-002 as NOT STARTED, Phase 3 as NOT STARTED, and pilot as PILOT-NO-GO.

## 2026-06-25 - P02-ISS-002

- Treated P02-ISS-001 as ACCEPTED per the P02-ISS-002 execution prompt.
- Created the approved `apps/*` workspace topology and shared package boundaries as private, boundary-only packages.
- Added nested app instructions, package READMEs, boundary metadata exports, tsconfig files, build/typecheck wiring, package-policy coverage for `apps/*`, and topology unit tests.
- Updated workspace manifests and lockfile importer evidence without adding external dependencies.
- Updated status, application topology docs, decision register, dependency register, risk register, document register, traceability, README, and contributing guidance.
- Preserved P02-ISS-003 as NOT STARTED, Phase 3 as NOT STARTED, pilot as PILOT-NO-GO, and Git/GitHub writes as HUMAN-ONLY.

## 2026-06-25 - P02-ISS-003

- Treated P02-ISS-002 as ACCEPTED per the P02-ISS-003 execution prompt.
- Added a local-only infrastructure harness under `infra/local/` for PostgreSQL/PostGIS, Valkey, Moto Server, and OpenTelemetry Collector Contrib.
- Added `tools/local-infra/local-infra.mjs` and package scripts for static verification, Docker checks, port preflight, start, health, stop, and reset.
- Added local infrastructure unit tests for exact image pins, local-only binds, synthetic controls, port override validation, and port-conflict detection.
- Updated status, local infrastructure docs, decision register, dependency register, blocker register, risk register, document register, traceability, README, and contributing guidance.
- Marked P02-ISS-003 PARTIAL because Docker CLI and Docker Compose are unavailable on the validation host, blocking live start/health/stop evidence.
- Preserved P02-ISS-004 as NOT STARTED, Phase 3 as NOT STARTED, pilot as PILOT-NO-GO, and Git/GitHub writes as HUMAN-ONLY.

## 2026-06-30 - P02-ISS-016

- Refined the Phase 2 environment and deployment baseline into the canonical provider-neutral deployment contract.
- Kept cloud provider selection explicitly human-gated and preserved the OpenTofu-preferred, Pulumi-candidate, Terraform-review-required posture from ADR-P02-005.
- Added the P02-ISS-016 execution plan, updated the human-gated decisions tracker, and recorded the deployment-contract decision entries.
- Updated traceability to keep deployment implementation blocked on human provider approval rather than implying cloud selection or IaC implementation.
- Did not create IaC files, cloud resources, deployment workflows, secrets, or runtime infrastructure.
- Preserved manual Git/GitHub governance, P02-ISS-017 as blocked on the unresolved human cloud decision, Phase 3 as NOT STARTED, and pilot as PILOT-NO-GO.

## 2026-06-30 - P02-ISS-017

- Advanced the Phase 2 backlog to the development deploy and staging promotion path.
- Added the P02-ISS-017 execution plan to define the deployment workflow boundary after the environment and deployment contract baseline.
- Recorded the human-gated deployment workflow and staging promotion requirements in the governance trail.
- Marked P02-ISS-017 as the next active implementation issue after the deployment-contract baseline work completed.
- Updated status and traceability so the next active implementation step is the deployment workflow rather than cloud selection or environment-contract work.
- Updated `docs/STATUS.md` to mark P02-ISS-017 as STARTED and set next action to continue P02-ISS-017.
- Updated `docs/governance/phase-2-requirements-traceability.md` requirement status wording for P02-REQ-001 to `DEPLOYMENT-WORKFLOW-PLAN-RECORDED-IMPLEMENTATION-PENDING`.
- Added `.github/workflows/deploy-development.yml` as the human-merge-to-main development deploy workflow artifact using pinned actions and contract-only manifest evidence.
- Added `.github/workflows/promote-staging.yml` as the human-dispatch staging promotion workflow artifact with candidate SHA/version inputs and evidence gates.
- Added `docs/runbooks/development-deploy-and-staging-promotion.md` for operational procedure, evidence capture, and rollback sequencing.
- Updated status, traceability, and decision-register entries to mark P02-ISS-017 as partial implementation with controlled evidence pending.
- Did not create IaC files, cloud resources, secrets, or runtime infrastructure; deployment workflows remain contract-only and human-gated.
- Preserved manual Git/GitHub governance, Phase 3 as NOT STARTED, and pilot as PILOT-NO-GO.

## 2026-06-30 - P02-ISS-018

- Advanced the Phase 2 backlog to the exit-gate rehearsal and rollback-evidence issue.
- Added the P02-ISS-018 execution plan to define full gate rehearsal sequence and closure evidence expectations.
- Updated status and traceability so P02-ISS-018 is now the active implementation issue and next action.
- Recorded P02-ISS-018 decision-register entries to keep Phase 2 completion blocked until controlled gate evidence exists.
- Did not add new runtime features, IaC resources, cloud mutations, secrets, or production operations.
- Preserved manual Git/GitHub governance, Phase 3 as NOT STARTED, and pilot as PILOT-NO-GO.

## 2026-07-01 - P02-ISS-018 local exit-gate rehearsal evidence

- Started and verified the synthetic local infrastructure on an alternate free port set after loopback port conflicts on the defaults.
- Captured local infra health evidence for Postgres/PostGIS, Valkey, synthetic object storage, and OpenTelemetry collector.
- Captured database migration apply, rollback, and restore evidence against the synthetic stack.
- Confirmed GitHub workflow dispatch evidence for P02-EG-001 and P02-EG-002 remains blocked in this environment because the GitHub workflow page resolves to sign-in/404 and `gh` is unavailable.
- Updated status and traceability to distinguish local rehearsal evidence from the remaining GitHub workflow evidence.

## 2026-07-01 - Cloud provider and deployment model finalization

- Finalized cloud/provider and deployment model choices for Phase 2 foundation and early Phase 3 preparation.
- Recorded Supabase as required primary platform, Hostinger shared hosting as selected web-hosting surface, and Supabase Edge Functions plus scheduled jobs for API/worker runtime.
- Recorded Supabase Storage for signed upload/download URL flow and managed Redis-compatible queue/cache path for shared-hosting constraints.
- Recorded observability baseline as platform logs plus structured application logs, with self-hosted stack deferred.
- Recorded manual deployment steps for the current phase and kept IaC automation as a later decision.
- Updated ADR-P02-005, environment/deployment baseline, decision register, human-gated decisions tracker, open questions, unresolved blocker register, status, and Phase 2 traceability.
- Preserved manual Git/GitHub governance, Phase 3 as NOT STARTED, and pilot as PILOT-NO-GO.
