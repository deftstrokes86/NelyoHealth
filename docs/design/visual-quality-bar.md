# Visual Quality Bar

NelyoHealth is a Nigerian-first, Africa-expandable, multi-role coordinated healthcare platform. It is not a simple B2C telemedicine app. The product connects patients, doctors, nurses/triage officers, guardians, minors/adolescents, Care Partners, diaspora sponsors, corporates, HMOs, pharmacies, labs, hospitals, specialists, emergency partners, admins, and super admins into a consent-aware healthcare access and care-coordination layer.

Non-negotiables across every document and feature: RBAC, consent, audit logging, tenant isolation, clinical safety, minor-care protections, emergency escalation, no AI autonomous diagnosis, and test-driven delivery.

## Design Objective

This design document translates the main `design.md` direction into a buildable UI/UX rule set for the topic named in this file. The product must feel trustworthy, calm, clinical, premium, mobile-first, Nigerian-context-aware, and operationally clear.

## Visual Direction

- Clean healthcare-grade interface, not playful consumer wellness fluff.
- Warm trust palette with restrained clinical blues/greens and generous white space.
- Clear hierarchy for urgent vs routine states.
- Dashboards must prioritize action, risk, and status, not decoration.
- Mobile layouts must be first-class.

## Component Requirements

- Cards for summary status.
- Tables for operational lists with filters and search.
- Stepper flows for onboarding, booking, verification, consent, and billing.
- Alert banners for emergency, safeguarding, missing consent, failed payment, and delayed fulfillment.
- Skeletons/loading states for remote data.
- Empty states that explain the next action.
- Forbidden states that explain access limitations without leaking protected data.

## Accessibility

- WCAG-conscious contrast.
- Keyboard navigability.
- Visible focus styles.
- Form labels and error messages.
- Touch-friendly mobile controls.
- No critical information conveyed by color alone.

## UX Safety Rules

- Emergency actions must be visually distinct.
- Consent and privacy screens must be plain-language, not legal fog.
- Minor/adolescent flows must be age-appropriate.
- Care Partner screens must distinguish care coordination from clinical authority.
- Admin destructive actions must require confirmation.

## Completion Standard

A task governed by this document is not complete until:

1. implementation matches the relevant source-of-truth docs,
2. RBAC rules are enforced,
3. consent checks exist anywhere patient data crosses a role boundary,
4. audit events are written for sensitive access or mutation,
5. empty, loading, error, forbidden, and success states exist,
6. unit/integration/E2E tests are added or updated,
7. documentation impacted by the change is updated,
8. the owning agent writes a completion report and hands off integration risks.

