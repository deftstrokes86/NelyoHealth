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
