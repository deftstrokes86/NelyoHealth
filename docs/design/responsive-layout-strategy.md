# P00-14A Responsive Layout Strategy

## Document Control

| Field | Value |
|---|---|
| Version | 0.1 |
| Status | DRAFT-PENDING-PRODUCT-DESIGN-CONTENT-ACCESSIBILITY-PRIVACY-AND-SECURITY-APPROVAL |
| Effective date | NOT EFFECTIVE FOR PRODUCTION UNTIL APPROVED |
| Owner | Design Owner + Accessibility Reviewer |
| Required reviewers | Product, Design, Content, Accessibility, Privacy, Security, Clinical Safety, Operations, and domain owners where relevant |
| Approval authority | Product, Design, Content, Accessibility, Privacy, Security, and affected domain owners |
| Related decisions | REQ-DES-007, REQ-DES-011 |
| Related open questions | OQ-00-645, OQ-00-646, OQ-00-650 |
| Non-implementation notice | Proposed design/content specification only; no UI, conformance, clinical/legal/privacy/financial approval, assets, dependencies, fonts, or implementation files. |
| Change control | Changes require owner review, register updates, and orchestration acceptance. |
## Strategy

Mobile-first behavior is mandatory. Proposed breakpoints are TOK-BRK-001 through TOK-BRK-005. Containers use readable max-widths and role-specific density. Side navigation collapses to compact drawer or bottom priority navigation only when content order remains safe. Sticky actions are allowed only for active tasks and must not obscure content.

## Responsive Patterns

| Pattern | Mobile | Tablet | Desktop | Safety/accessibility rule |
|---|---|---|---|---|
| Header | Context + primary action | Context + compact nav | Full nav + context | Emergency/help remains reachable |
| Form layout | Single column | Grouped single/two column | Two column only when labels stay clear | No label hidden or placeholder-only labels |
| Table | Card list or disclosure row | Responsive table or drawer | Table with detail drawer | Horizontal scrolling is not default |
| Timeline | Vertical compact | Vertical with metadata | Split detail | Clinical order preserved |
| Map | Hidden pre-payment; detail after auth only | Same | Same | No location UI before authorization |
| Modal/dialog | Full-screen for complex tasks | Dialog/drawer by task | Dialog/drawer | Focus trap and escape behavior required |
| Video room | Primary participant and controls | Participant rail | Full room | Emergency/support control visible |

## Content Priority

Mobile shows safety, active task, required action, current state, and next step first. Tablet adds supporting context. Desktop adds summaries, secondary details, and operational density. Decorative content never precedes safety, active tasks, or required actions.
