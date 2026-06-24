# P00-14A Navigation and Dashboard Models

## Document Control

| Field | Value |
|---|---|
| Version | 0.1 |
| Status | DRAFT-PENDING-PRODUCT-DESIGN-CONTENT-ACCESSIBILITY-PRIVACY-AND-SECURITY-APPROVAL |
| Effective date | NOT EFFECTIVE FOR PRODUCTION UNTIL APPROVED |
| Owner | Design Owner + Product Owner |
| Required reviewers | Product, Design, Content, Accessibility, Privacy, Security, Clinical Safety, Operations, and domain owners where relevant |
| Approval authority | Product, Design, Content, Accessibility, Privacy, Security, and affected domain owners |
| Related decisions | REQ-DES-009, REQ-CNT-021, REQ-CNT-033 |
| Related open questions | OQ-00-644, OQ-00-645, OQ-00-657 |
| Non-implementation notice | Proposed design/content specification only; no UI, conformance, clinical/legal/privacy/financial approval, assets, dependencies, fonts, or implementation files. |
| Change control | Changes require owner review, register updates, and orchestration acceptance. |
## Navigation Models

| Model ID | Application | Behavior | Maximum primary depth | Context switching | Emergency/help access | Unsaved-work warning | Accessibility |
|---|---|---|---|---|---|---|---|
| NAV-MOD-001 | Patient application | Desktop: side/top hybrid; tablet: compact side or top; mobile: priority bottom/top actions | Depth 2 ordinary, deeper by contextual drilldown | Explicit patient/tenant/org switch where allowed | Emergency/help always reachable | Unsaved-work warning required | Keyboard and screen-reader landmarks required |
| NAV-MOD-002 | Doctor portal | Desktop: side/top hybrid; tablet: compact side or top; mobile: priority bottom/top actions | Depth 2 ordinary, deeper by contextual drilldown | Explicit patient/tenant/org switch where allowed | Emergency/help always reachable | Unsaved-work warning required | Keyboard and screen-reader landmarks required |
| NAV-MOD-003 | Pharmacy portal | Desktop: side/top hybrid; tablet: compact side or top; mobile: priority bottom/top actions | Depth 2 ordinary, deeper by contextual drilldown | Explicit patient/tenant/org switch where allowed | Emergency/help always reachable | Unsaved-work warning required | Keyboard and screen-reader landmarks required |
| NAV-MOD-004 | Laboratory portal | Desktop: side/top hybrid; tablet: compact side or top; mobile: priority bottom/top actions | Depth 2 ordinary, deeper by contextual drilldown | Explicit patient/tenant/org switch where allowed | Emergency/help always reachable | Unsaved-work warning required | Keyboard and screen-reader landmarks required |
| NAV-MOD-005 | Organization portal | Desktop: side/top hybrid; tablet: compact side or top; mobile: priority bottom/top actions | Depth 2 ordinary, deeper by contextual drilldown | Explicit patient/tenant/org switch where allowed | Emergency/help always reachable | Unsaved-work warning required | Keyboard and screen-reader landmarks required |
| NAV-MOD-006 | Admin and operations portal | Desktop: side/top hybrid; tablet: compact side or top; mobile: priority bottom/top actions | Depth 2 ordinary, deeper by contextual drilldown | Explicit patient/tenant/org switch where allowed | Emergency/help always reachable | Unsaved-work warning required | Keyboard and screen-reader landmarks required |

## Dashboard Priority Models

| Dashboard | Proposed priority areas | Density |
|---|---|---|
| Patient dashboard | Upcoming care; current actions; follow-ups; prescriptions; lab orders/results; referrals; payments/refunds; family/sponsorship; messages; health profile; emergency guidance | Moderate |
| Doctor dashboard | Today schedule; waiting patients; follow-ups; unsigned records; result reviews; critical results; referrals; credential status; tasks; clinical-safety alerts | High |
| Pharmacy dashboard | New orders; clarifications; reservations; inventory exceptions; accepted orders; dispensing; collection/delivery handoff; failed fulfilment; settlement; credential status | High |
| Laboratory dashboard | New orders; bookings; specimens; processing; results awaiting verification; critical results; corrections; delays; settlement; credential status | High |
| Operations dashboard | Identity; credentials; appointments; payments; refunds; pharmacy/lab exceptions; referrals; emergency follow-up; complaints; incidents; DSRs; audit; regulatory blockers | High |

Dashboards must not display unrelated clinical details merely because space is available.
