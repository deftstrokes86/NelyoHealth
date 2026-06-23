# Phase 0 Assumptions Register

## Assumption status

- `PROPOSED`: planning assumption not yet approved
- `APPROVED`: approved and safe for execution
- `REJECTED`: rejected and replaced

| Assumption ID | Assumption | Status | Owner | Target decision | Risk if wrong |
|---|---|---|---|---|---|
| ASSUMPT-01 | Initial pilot geography is Lagos-only. | PROPOSED | Product owner | P00-02 | Incorrect launch readiness and legal review scope |
| ASSUMPT-02 | Initial minimum patient age is 18+ with full parent/guardian flow for minors. | PROPOSED | Clinical lead | P00-02 / P00-03 | Minor consent and access policy gaps |
| ASSUMPT-03 | Initial service focus is scheduled consultation plus pharmacy/lab loops before specialist/hospital expansion. | PROPOSED | Clinical lead + operations | P00-02 / P00-05 | Scope mismatch and incomplete closure states |
| ASSUMPT-04 | Native mobile apps are post-pilot and initially out of scope for implementation. | PROPOSED | Product owner | P00-02 / P01 | Overbuild on unplanned surfaces |
| ASSUMPT-05 | Native mobile experience can be deferred until web loops stabilize. | PROPOSED | Product owner | P00-02 / P01 | Missed channel coverage assumptions |
| ASSUMPT-06 | Pre-payment provider identity can use providerDisplayName without location, contacts, branch, map, or derivable data. | REJECTED | Product + privacy + security | P00-00 | Superseded by REQ-LOCK-003 and REQ-LOCK-004 in `docs/governance/decision-register.md`; this rule remains locked there. |
| ASSUMPT-07 | Payment event for unlocking provider details is settlement/capture by default. | PROPOSED | Finance owner + security | P00-13 | Unauthorized disclosure on failed/authorization-only states |
| ASSUMPT-08 | No user-facing features are implemented before P00 completion and gate completion. | APPROVED | Execution lead | P00-00 | Violates planning and safety sequencing |
| ASSUMPT-09 | Browser automation strategy will be validated in Phase 1 only. | APPROVED | Engineering lead | P00-14 / P01 | Over-implementation before base docs done |
| ASSUMPT-10 | Synthetic-only test data for privacy and browser testing, including failure and adverse paths. | APPROVED | QA + security | P00-14 | Personal data exposure and false compliance signals |
| ASSUMPT-11 | One patient record remains the canonical longitudinal identity anchor across all payer/family links. | APPROVED | Product + clinical | P00-00 / P00-03 | Duplicate patient records and wrong access boundaries |
| ASSUMPT-12 | Emergency escalation path remains available regardless of payment, status, or provider comparison outcomes. | APPROVED | Clinical + operations | P00-09 | Clinical safety regression |
