# P00-14A Microcopy System

## Document Control

| Field | Value |
|---|---|
| Version | 0.1 |
| Status | DRAFT-PENDING-PRODUCT-DESIGN-CONTENT-ACCESSIBILITY-PRIVACY-AND-SECURITY-APPROVAL |
| Effective date | NOT EFFECTIVE FOR PRODUCTION UNTIL APPROVED |
| Owner | Content Owner |
| Required reviewers | Product, Design, Content, Accessibility, Privacy, Security, Clinical Safety, Legal, Finance, Operations, and domain owners where relevant |
| Approval authority | Product, Content, Accessibility, Privacy, Security, and affected domain owners |
| Related decisions | REQ-CNT-025, REQ-CNT-028 |
| Related open questions | OQ-00-668 through OQ-00-671 |
| Non-implementation notice | Proposed content/design specification only; no UI, conformance, clinical/legal/privacy/financial approval, assets, dependencies, fonts, or production copy. |
| Change control | Changes require owner review, register updates, and orchestration acceptance. |
## Conventions

Buttons, links, headings, form labels, helper text, validation, confirmation, destructive actions, loading, payment, refund, appointment, consultation, pharmacy order, laboratory order, results, referral, emergency, consent, security, account recovery, and notifications must use direct language that matches action and state.

## CTA Verb Rules

| Verb | Permitted when | Prohibited use |
|---|---|---|
| View | Allowed for read-only access to authorized content | Must not open wrong patient/order |
| Review | Allowed when user evaluates before action | Must not imply approval |
| Continue | Allowed for non-committal step only | Must not conceal payment or consent commitment |
| Confirm | Allowed for explicit confirmation | Must summarize consequence |
| Submit | Allowed for forms | Must not hide clinical/legal consequence |
| Pay | Allowed only when amount/payment commitment is visible | Must not mean quote-only |
| Approve | Allowed for delegated or operational approval | Must require authority |
| Decline | Allowed for reversible rejection where defined | Must explain consequence |
| Cancel | Allowed for defined cancellation | Must not perform irreversible deletion silently |
| Reschedule | Allowed for appointment changes | Must show affected appointment |
| Join | Allowed only with valid appointment/session | Must not appear without valid context |
| Download | Allowed for authorized documents | Must respect PHI/security |
| Get directions | Allowed only after selected paid order authorizes provider details | Never pre-payment |
| Contact support | Allowed for support escalation | Must not expose protected details in prefilled context |
