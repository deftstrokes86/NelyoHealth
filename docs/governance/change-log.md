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
