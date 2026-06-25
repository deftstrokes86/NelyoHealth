# P00-15 Analytics Data Policy

## Document Control

| Field | Value |
|---|---|
| Status | DRAFT-PENDING-PRODUCT-OPERATIONS-CLINICAL-SECURITY-PRIVACY-FINANCE-ACCESSIBILITY-AND-ENGINEERING-APPROVAL |
| Codex prompt ID | P00-15 |
| Complete Breakdown work package | P00-18 |
| Issue ID | P00-OPS-001 |
| Version | 0.1 draft |
| Owner | Operations owner |
| Review state | Draft pending external approval |
| Operational status | Proposed only; not implemented |
| Required reviewers | Product, operations, clinical, security, privacy, finance, accessibility, engineering, regulatory/legal, design, and content reviewers |
| Approval authority | External orchestration and named domain approvers |
| Last updated | 2026-06-25 |
| Effective date | NOT EFFECTIVE UNTIL APPROVED |
| Related decisions | REQ-OPS-001 through REQ-OPS-045 |
| Related open questions | OQ-00-675 through OQ-00-774 |
| Review and change control | Target, threshold, dashboard, queue, stop decision, analytics use, or export changes require external approval before production reliance. |

This document defines proposed metrics, service levels, queues, and pilot gates. It does not constitute an approved SLA, contractual service commitment, clinical response time, statutory or regulatory deadline, or staffing sufficiency statement. Numeric targets remain approval-controlled. Final instrumentation remains Phase 1 or later implementation work.


## Analytics Purpose

Permitted purposes include product health, care-loop completion, clinical-quality operations, patient-safety monitoring, fulfilment operations, financial reconciliation, privacy/security monitoring, accessibility quality, design/content quality, capacity planning, aggregate employer/HMO reporting as future scope, and approved regulatory evidence. Prohibited purposes include autonomous diagnosis, treatment decisions, unapproved profiling, employer/sponsor clinical surveillance, unapproved underwriting, revenue-only provider steering, revealing protected provider locations before payment, selling patient health data, re-identification, and unsupported public claims.

## Analytics Data Zones

| Zone | Purpose | Infrastructure status |
|---|---|---|
| OPERATIONAL-SOURCE | Conceptual analytics zone for approved minimum-necessary operational use | Conceptual only; no infrastructure created in P00-15 |
| OPERATIONAL-READ-MODEL | Conceptual analytics zone for approved minimum-necessary operational use | Conceptual only; no infrastructure created in P00-15 |
| ANALYTICS-INGESTION | Conceptual analytics zone for approved minimum-necessary operational use | Conceptual only; no infrastructure created in P00-15 |
| MINIMIZED-EVENT | Conceptual analytics zone for approved minimum-necessary operational use | Conceptual only; no infrastructure created in P00-15 |
| AGGREGATED-MART | Conceptual analytics zone for approved minimum-necessary operational use | Conceptual only; no infrastructure created in P00-15 |
| RESTRICTED-CLINICAL-QUALITY | Conceptual analytics zone for approved minimum-necessary operational use | Conceptual only; no infrastructure created in P00-15 |
| SECURITY-MONITORING | Conceptual analytics zone for approved minimum-necessary operational use | Conceptual only; no infrastructure created in P00-15 |
| APPROVED-EXPORT | Conceptual analytics zone for approved minimum-necessary operational use | Conceptual only; no infrastructure created in P00-15 |

## Analytics Event Requirements

Every analytics event must define event name, version, purpose, source context, trigger, owner, classifications, allowed/prohibited properties, patient/tenant/provider identifier policy, location policy, clinical-data policy, financial-data policy, retention, access, aggregation, approval, and test.

## Analytics Rules

| Rule ID | Rule | Status | Owner | Related test |
|---|---|---|---|---|
| ANL-POL-001 | Analytics is downstream and non-authoritative for care, finance, credentials, consent, authorization, and provider-detail disclosure. | PROPOSED or REQUIRES_APPROVAL where thresholds, access, exports, or restricted paths are involved | Privacy and analytics governance owners | OPS-TST-301 |
| ANL-POL-002 | Analytics uses minimum-necessary data, aggregation, pseudonymous identifiers, limited dimensions, access controls, retention controls, and export controls. | PROPOSED or REQUIRES_APPROVAL where thresholds, access, exports, or restricted paths are involved | Privacy and analytics governance owners | OPS-TST-302 |
| ANL-POL-003 | Employer and HMO analytics remain aggregate and minimized; no minimum aggregation threshold is set in P00-15. | PROPOSED or REQUIRES_APPROVAL where thresholds, access, exports, or restricted paths are involved | Privacy and analytics governance owners | OPS-TST-303 |
| ANL-POL-004 | Browser analytics uses an explicit allow-list and never authorizes payment, disclosure, clinical completion, results, delivery, refunds, or credential status. | PROPOSED or REQUIRES_APPROVAL where thresholds, access, exports, or restricted paths are involved | Privacy and analytics governance owners | OPS-TST-304 |
| ANL-POL-005 | ProviderDisplayName analytics use requires explicit purpose review and must not be combined with locating dimensions. | PROPOSED or REQUIRES_APPROVAL where thresholds, access, exports, or restricted paths are involved | Privacy and analytics governance owners | OPS-TST-305 |
| ANL-POL-006 | Pre-payment provider address, branch, coordinates, distance, map position, directions, route data, contact details, pickup/collection instructions, internal provider identifiers, location-derived ranking features, patient-provider location pairs, and derived metadata are prohibited. | PROPOSED or REQUIRES_APPROVAL where thresholds, access, exports, or restricted paths are involved | Privacy and analytics governance owners | OPS-TST-306 |
| ANL-POL-007 | After authorized disclosure, analytics still receives no precise provider location by default; operational source systems retain order-specific evidence. | PROPOSED or REQUIRES_APPROVAL where thresholds, access, exports, or restricted paths are involved | Privacy and analytics governance owners | OPS-TST-307 |
| ANL-POL-008 | Full clinical notes, full prescriptions, full laboratory-result values, clinical attachments, and sensitive support transcripts are excluded from general product analytics. | PROPOSED or REQUIRES_APPROVAL where thresholds, access, exports, or restricted paths are involved | Privacy and analytics governance owners | OPS-TST-308 |
| ANL-POL-009 | Raw payment credentials, authentication secrets, session tokens, MFA secrets, and unredacted URL query strings are prohibited. | PROPOSED or REQUIRES_APPROVAL where thresholds, access, exports, or restricted paths are involved | Privacy and analytics governance owners | OPS-TST-309 |
| ANL-POL-010 | Clinical-quality analytics requires restricted access, clinical governance, privacy approval, audit, retention, and purpose limitation. | PROPOSED or REQUIRES_APPROVAL where thresholds, access, exports, or restricted paths are involved | Privacy and analytics governance owners | OPS-TST-310 |
| ANL-POL-011 | Product analytics cannot be used for autonomous diagnosis, treatment decisions, unapproved profiling, surveillance, unapproved underwriting, revenue-only provider steering, data sale, re-identification, or unsupported public claims. | PROPOSED or REQUIRES_APPROVAL where thresholds, access, exports, or restricted paths are involved | Privacy and analytics governance owners | OPS-TST-311 |
| ANL-POL-012 | Synthetic data is used outside production for tests, screenshots, reports, dashboard fixtures, and browser validation. | PROPOSED or REQUIRES_APPROVAL where thresholds, access, exports, or restricted paths are involved | Privacy and analytics governance owners | OPS-TST-312 |
| ANL-POL-013 | Analytics events require version, source context, owner, classification, allowed/prohibited properties, identifier policies, location policy, retention, access, aggregation, approval, and test. | PROPOSED or REQUIRES_APPROVAL where thresholds, access, exports, or restricted paths are involved | Privacy and analytics governance owners | OPS-TST-313 |
| ANL-POL-014 | Data-quality status covers missing, duplicate, late, out-of-order, unknown, schema mismatch, clock skew, time-zone handling, environment, reprocessing, backfill, correction, lineage, and confidence. | PROPOSED or REQUIRES_APPROVAL where thresholds, access, exports, or restricted paths are involved | Privacy and analytics governance owners | OPS-TST-314 |
| ANL-POL-015 | Exports require privacy review, content review, audit, secure delivery, legal-review dependency, and third-party restriction assessment. | PROPOSED or REQUIRES_APPROVAL where thresholds, access, exports, or restricted paths are involved | Privacy and analytics governance owners | OPS-TST-315 |

## Prohibited Analytics Data

| Prohibited data | Policy |
|---|---|
| Full patient name | Excluded from product analytics unless a separately approved restricted path explicitly permits minimum-necessary use; many are never permitted in general analytics. |
| Patient phone number | Excluded from product analytics unless a separately approved restricted path explicitly permits minimum-necessary use; many are never permitted in general analytics. |
| Patient email | Excluded from product analytics unless a separately approved restricted path explicitly permits minimum-necessary use; many are never permitted in general analytics. |
| Patient address | Excluded from product analytics unless a separately approved restricted path explicitly permits minimum-necessary use; many are never permitted in general analytics. |
| Full date of birth | Excluded from product analytics unless a separately approved restricted path explicitly permits minimum-necessary use; many are never permitted in general analytics. |
| Government identity data | Excluded from product analytics unless a separately approved restricted path explicitly permits minimum-necessary use; many are never permitted in general analytics. |
| Authentication secrets | Excluded from product analytics unless a separately approved restricted path explicitly permits minimum-necessary use; many are never permitted in general analytics. |
| Session tokens | Excluded from product analytics unless a separately approved restricted path explicitly permits minimum-necessary use; many are never permitted in general analytics. |
| MFA secrets | Excluded from product analytics unless a separately approved restricted path explicitly permits minimum-necessary use; many are never permitted in general analytics. |
| Raw payment credentials | Excluded from product analytics unless a separately approved restricted path explicitly permits minimum-necessary use; many are never permitted in general analytics. |
| Full clinical notes | Excluded from product analytics unless a separately approved restricted path explicitly permits minimum-necessary use; many are never permitted in general analytics. |
| Full prescriptions | Excluded from product analytics unless a separately approved restricted path explicitly permits minimum-necessary use; many are never permitted in general analytics. |
| Full laboratory-result values | Excluded from product analytics unless a separately approved restricted path explicitly permits minimum-necessary use; many are never permitted in general analytics. |
| Clinical attachments | Excluded from product analytics unless a separately approved restricted path explicitly permits minimum-necessary use; many are never permitted in general analytics. |
| Provider branch address before authorized disclosure | Excluded from product analytics unless a separately approved restricted path explicitly permits minimum-necessary use; many are never permitted in general analytics. |
| Provider coordinates | Excluded from product analytics unless a separately approved restricted path explicitly permits minimum-necessary use; many are never permitted in general analytics. |
| Provider distance | Excluded from product analytics unless a separately approved restricted path explicitly permits minimum-necessary use; many are never permitted in general analytics. |
| Provider map data | Excluded from product analytics unless a separately approved restricted path explicitly permits minimum-necessary use; many are never permitted in general analytics. |
| Patient-provider location pairs | Excluded from product analytics unless a separately approved restricted path explicitly permits minimum-necessary use; many are never permitted in general analytics. |
| Internal provider matching features | Excluded from product analytics unless a separately approved restricted path explicitly permits minimum-necessary use; many are never permitted in general analytics. |
| Break-glass reason text | Excluded from product analytics unless a separately approved restricted path explicitly permits minimum-necessary use; many are never permitted in general analytics. |
| Guardian-dispute evidence | Excluded from product analytics unless a separately approved restricted path explicitly permits minimum-necessary use; many are never permitted in general analytics. |
| DSR identity evidence | Excluded from product analytics unless a separately approved restricted path explicitly permits minimum-necessary use; many are never permitted in general analytics. |
| Support transcripts containing sensitive data | Excluded from product analytics unless a separately approved restricted path explicitly permits minimum-necessary use; many are never permitted in general analytics. |
| Free-text error payloads | Excluded from product analytics unless a separately approved restricted path explicitly permits minimum-necessary use; many are never permitted in general analytics. |
| Unredacted URL query strings | Excluded from product analytics unless a separately approved restricted path explicitly permits minimum-necessary use; many are never permitted in general analytics. |

## Allowed Dimensions

| Dimension | Approval controls |
|---|---|
| Scope label | Purpose, re-identification review, small-cell review, owner, and approval required |
| Journey ID | Purpose, re-identification review, small-cell review, owner, and approval required |
| Workflow ID | Purpose, re-identification review, small-cell review, owner, and approval required |
| State category | Purpose, re-identification review, small-cell review, owner, and approval required |
| Error category | Purpose, re-identification review, small-cell review, owner, and approval required |
| Device class | Purpose, re-identification review, small-cell review, owner, and approval required |
| Browser family | Purpose, re-identification review, small-cell review, owner, and approval required |
| Network profile | Purpose, re-identification review, small-cell review, owner, and approval required |
| Service area category | Purpose, re-identification review, small-cell review, owner, and approval required |
| Provider type | Purpose, re-identification review, small-cell review, owner, and approval required |
| Fulfilment type | Purpose, re-identification review, small-cell review, owner, and approval required |
| Payment category | Purpose, re-identification review, small-cell review, owner, and approval required |
| Funding-source category | Purpose, re-identification review, small-cell review, owner, and approval required |
| Accessibility mode | Purpose, re-identification review, small-cell review, owner, and approval required |
| Reduced-motion preference | Purpose, re-identification review, small-cell review, owner, and approval required |
| Synthetic or production environment | Purpose, re-identification review, small-cell review, owner, and approval required |
| Aggregate cohort | Purpose, re-identification review, small-cell review, owner, and approval required |
| Time bucket | Purpose, re-identification review, small-cell review, owner, and approval required |

## Prohibited Dimensions and Joins

Exact patient location, exact provider location, exact branch, rare diagnosis, rare result, small employer cohort, small HMO cohort, patient plus provider plus timestamp combinations, sponsor plus beneficiary clinical state, employee plus clinical event, full medication plus exact location, exact emergency location in product analytics, and re-identifying joins are prohibited or approval-gated.

## Employer and HMO Reporting

Employer and HMO reporting requires aggregate data, minimum cohort question resolution, small-cell suppression approval, no individual diagnosis, prescription, result, consultation note, or precise provider location, plus contract/privacy approval, export audit, and re-identification review. No minimum cohort size is invented.

## Provider-Disclosure Analytics

Before authorized disclosure, providerDisplayName handling requires explicit purpose review and must not be logged with patient location, provider address, branch, coordinates, distance, map requests, internal matching score, opaque token, or enumeration-enabling client identifiers. After authorized disclosure, analytics still receives no precise provider location by default; operational source systems retain order-specific evidence.

## Clinical-Quality Analytics

Clinical-quality analytics is restricted to approved clinical-safety reviews, critical-result monitoring, emergency escalation, prescribing quality, result-review completion, referral closure, and clinical incidents. It requires clinical governance, privacy approval, minimum necessary data, restricted access, purpose limitation, audit, retention, and no general product-analytics access.

## Data Quality, Access, Browser Analytics, Retention, and Export

Data quality, least-privilege access, browser analytics allow-lists, no raw sensitive browser payloads, no session replay by default on sensitive surfaces, retention categories, legal-review dependency, DSR treatment, export approval, secure delivery, and third-party restrictions are required and approval-controlled.

## Future Analytics Privacy Tests

| Test ID | Requirement | Synthetic data only |
|---|---|---|
| OPS-TST-301 | Analytics privacy test for no provider coordinates. | Yes |
| OPS-TST-302 | Analytics privacy test for no provider address. | Yes |
| OPS-TST-303 | Analytics privacy test for no pre-payment provider branch. | Yes |
| OPS-TST-304 | Analytics privacy test for no patient-provider location pair. | Yes |
| OPS-TST-305 | Analytics privacy test for no raw clinical note. | Yes |
| OPS-TST-306 | Analytics privacy test for no raw prescription. | Yes |
| OPS-TST-307 | Analytics privacy test for no raw result. | Yes |
| OPS-TST-308 | Analytics privacy test for no authentication secret. | Yes |
| OPS-TST-309 | Analytics privacy test for no payment credential. | Yes |
| OPS-TST-310 | Analytics privacy test for no employer individual clinical data. | Yes |
| OPS-TST-311 | Analytics privacy test for no hmo unrestricted clinical data. | Yes |
| OPS-TST-312 | Analytics privacy test for small-cell suppression once approved. | Yes |
| OPS-TST-313 | Analytics privacy test for re-identification review. | Yes |
| OPS-TST-314 | Analytics privacy test for export control. | Yes |
| OPS-TST-315 | Analytics privacy test for browser analytics payload inspection. | Yes |
