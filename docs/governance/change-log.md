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
  - Added sponsor boundary failure case for attempts to access another beneficiary’s order.
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
