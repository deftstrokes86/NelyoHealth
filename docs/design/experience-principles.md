# P00-14A Experience Principles

## Document Control

| Field | Value |
|---|---|
| Version | 0.1 |
| Status | DRAFT-PENDING-PRODUCT-DESIGN-CONTENT-ACCESSIBILITY-PRIVACY-AND-SECURITY-APPROVAL |
| Effective date | NOT EFFECTIVE FOR PRODUCTION UNTIL APPROVED |
| Owner | Design Owner + Product Owner |
| Required reviewers | Content, Accessibility, Privacy, Security, Clinical Safety, Finance where relevant |
| Approval authority | Product, Design, Content, Accessibility, Privacy, Security, and affected clinical/legal/finance owners |
| Related decisions | REQ-DES-001 through REQ-DES-020 |
| Related open questions | OQ-00-633 through OQ-00-673 |
| Scope | Proposed design and content decisions for P00-14A only |
| Non-implementation notice | This does not constitute implemented UI, accessibility conformance, clinical-content approval, legal/privacy/financial approval, final visual assets, or dependency/font installation. |
| Change control | Changes require decision/open-question updates, owner review, and orchestration acceptance before production use. |
## Principles

| Principle ID | Statement | Why it exists | Product consequence | Visual consequence | Content consequence | Motion consequence | Accessibility consequence | Example of compliance | Example of violation | Related requirement |
|---|---|---|---|---|---|---|---|---|---|---|
| EXP-PRN-001 | Calm before clever | Avoid anxiety and novelty where health or payment decisions are involved | Favors simple flows | Quiet hierarchy and restrained effects | Plain direct words | Subtle transitions only | Reduces cognitive load | Emergency guidance is instantly visible | A decorative reveal hides the next safe step | REQ-DES-002 |
| EXP-PRN-002 | Clarity before decoration | Decoration cannot compete with comprehension | Prioritizes task success | Decor supports hierarchy only | No ornamental copy | Motion explains, not entertains | Color-independent meaning | Payment summary is visually explicit | Gradient-heavy card hides fee detail | REQ-DES-012 |
| EXP-PRN-003 | Trust through consistency | Users move across care, payment, and operations contexts | One reusable platform language | Shared tokens and patterns | Consistent terms | Shared state transitions | Predictable focus and labels | Same locked-provider treatment everywhere | Pharmacy portal feels unrelated | REQ-DES-001 |
| EXP-PRN-004 | Human without being casual about health | Tone should be warm but clinically serious | Supports trust | Refined, not playful | Respectful language | No playful emergency animation | Plain language supports comprehension | Result delay copy is calm and specific | Emoji-based clinical warning | REQ-CNT-029 |
| EXP-PRN-005 | One platform, role-appropriate experiences | Different roles need different density without different products | Supports all portals | Density scales by job | Same state vocabulary | Motion profiles vary by urgency | Screen reader patterns remain consistent | Doctor queue is dense but tokenized | Admin dashboard uses unrelated template | REQ-DES-001 |
| EXP-PRN-006 | Clinical urgency changes the interface | Urgent care must override commercial hierarchy | Emergency actions stay reachable | Urgent visuals override marketing | Direct safety language | Immediate no-delay transitions | Visible, focused, readable | Emergency panel precedes payment tasks | Urgent alert appears below promos | REQ-DES-017 |
| EXP-PRN-007 | Patient autonomy remains visible | Patients must understand choices, consent, and next steps | Explains choices | Action consequences clear | Consent and delegation copy is explicit | State transitions confirm choice | Supports informed decisions | Patient sees who can act for them | Sponsor flow implies clinical control | REQ-CNT-033 |
| EXP-PRN-008 | Financial actions are transparent | Payment and refund actions carry consequence | Avoids hidden commitments | Financial summaries prominent | CTA labels match commitment | Motion confirms state only | Readable amounts and states | Pay CTA shows amount context | Continue hides a charge | REQ-CNT-025 |
| EXP-PRN-009 | Privacy boundaries are understandable | Locked data should be explained without leakage | Builds trust | Locked state is intentional | Boundary copy avoids identifiers | No exit-state retained data | Accessible locked labels are safe | Provider locked card shows name and price only | Tooltip exposes address | REQ-CNT-032 |
| EXP-PRN-010 | Accessibility is part of quality | Beautiful inaccessible UI is failed UI | Accessibility gates block release | Focus, contrast, reflow built in | Plain language | Reduced motion supported | WCAG 2.2 AA target evidence | Keyboard can complete booking | Hover-only menu | REQ-DES-005 |
| EXP-PRN-011 | Mobile is a primary experience | Patients and sponsors may rely on phones | Mobile is not secondary | Mobile-first layout | Short scannable copy | Motion is lighter | Touch targets and reflow | Payment state readable on phone | Desktop table squeezed into phone | REQ-DES-007 |
| EXP-PRN-012 | Connectivity failure is expected | Healthcare flows must degrade safely | Offline/retry states planned | Connection state visible | Actionable failure copy | No misleading loaders | Accessible retry feedback | Draft saved locally as allowed | Spinner without recovery | REQ-DES-008 |
| EXP-PRN-013 | Every state is intentionally designed | Unplanned states create confusion | State coverage required | Dedicated visual state language | State-specific copy | State-specific motion | Announced state changes | Payment failed state explains next step | Generic error with no action | REQ-DES-008 |
| EXP-PRN-014 | Content and interaction agree | Labels must match actual outcomes | CTA contracts required | CTA prominence matches action | Verbs are governed | Motion confirms actual transition | Accessible name matches action | Review result opens correct patient result | View result opens wrong patient | REQ-CNT-025 |
| EXP-PRN-015 | High-impact actions require deliberation | Irreversible and sensitive actions need clarity | Confirmation pattern required | Stronger visual treatment | Explicit consequence copy | No rushed animation | Focus stays in confirmation | Refund confirmation states consequence | Cancel deletes silently | REQ-DES-019 |
| EXP-PRN-016 | Empty space creates comprehension | Whitespace helps health and finance decisions | Avoids overcrowding | Spacing rhythm is functional | Short sections | Motion breathes between states | Supports text zoom | Result review has clear grouping | Nested cards fill all space | REQ-DES-004 |
| EXP-PRN-017 | Data density follows the user job | Clinicians/operators need density; patients need guidance | Role-specific dashboards | Density tiers | Progressive disclosure | Refresh motion restrained | Tables remain accessible | Lab queue dense with filters | Patient dashboard mimics ops queue | REQ-DES-009 |
| EXP-PRN-018 | Motion explains change | Motion clarifies relationships and state | Motion has purpose | Spatial continuity | No motion-only content | Reduced equivalents | No vestibular burden | Drawer motion shows source relation | Animated flourish on emergency alert | REQ-DES-014 |
| EXP-PRN-019 | Error recovery is part of design | Errors should help safe recovery | Recovery paths required | Errors visible and scoped | Actionable, nonblaming copy | No endless loops | Errors announced accessibly | Upload failure offers retry | Something went wrong only | REQ-CNT-028 |
| EXP-PRN-020 | Beauty never hides operational truth | Premium design must not obscure limits | No fake certainty | Honest visual states | No unsupported claims | Motion does not mask delay | Clarity over polish | Unavailable lab state is direct | Polished card implies guarantee | REQ-DES-012 |
