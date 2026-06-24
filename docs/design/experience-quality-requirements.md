# P00-14 Experience Quality Requirements

## Document Control

| Field | Value |
| --- | --- |
| Version | 0.1 |
| Status | DRAFT-PENDING-SECURITY-ARCHITECTURE-QA-ACCESSIBILITY-PRIVACY-AND-OPERATIONS-APPROVAL |
| Phase | P00-14 |
| Supplemental work package | P00-14A required before P00-15 |
| Effective status | Not effective until approved by product, design, security, architecture, QA, accessibility, privacy, clinical safety, and operations owners |
| Scope | Requirements, controls, validation model, and acceptance gates only |
| Exclusions | No final design system, fonts, colors, shadows, radii, illustrations, design tokens, components, routes, fixtures, or production copy |
| Related decisions | REQ-NFR-051 through REQ-NFR-078 |
| Related open questions | OQ-00-592 through OQ-00-631 |

## Non-Assertion Notice

This document does not approve final visual direction, final page design, final content, final brand assets, final theme, or implementation. P00-14A must define the design system and content architecture before P00-15 may begin.

## Experience Character

NelyoHealth must feel trustworthy, calm, contemporary, human, responsive, clear, credible, refined, reassuring, appropriate for healthcare, appropriate for the Nigerian market without stereotypes, and premium without being decorative or exclusionary.

Beauty must emerge from strong hierarchy, deliberate spacing, consistent typography, controlled color, clear state communication, appropriate information density, thoughtful motion, coherent components, excellent responsive behavior, high-quality content, accessibility, and reliable interaction feedback.

Beauty must never weaken clinical urgency, emergency communication, accessibility, privacy, security, comprehension, performance, low-bandwidth behavior, financial transparency, or provider-detail protection.

## Experience Principles

| Principle | Requirement |
| --- | --- |
| Calm before clever | Interfaces must reduce anxiety and avoid novelty that impairs comprehension. |
| Clarity before decoration | Decorative choices must support hierarchy and meaning. |
| Trust through consistency | Cross-portal screens must use one coherent design language. |
| One coherent platform | Patient, clinical, pharmacy, laboratory, finance, sponsor, employer, HMO, support, and compliance surfaces may vary in density but not visual language. |
| Role-appropriate information density | Dense operational dashboards are allowed only where the role benefits from density and readability remains intact. |
| Mobile usability is first-class | Mobile layouts must not be reduced desktop layouts with hidden critical actions. |
| Clinical urgency changes visual priority | Urgent and emergency states override ordinary commercial, marketing, and dashboard hierarchy. |
| Financial information is transparent | Prices, payment state, refund state, and commitments must be visually explicit. |
| Privacy boundaries are visible without revealing protected information | Locked provider detail states must explain the boundary without leaking protected provider details. |
| Accessibility is integral | Accessibility is a design requirement, not a post-build correction. |
| Every state is intentionally designed | Loading, empty, error, offline, locked, payment, emergency, and reduced-motion states require deliberate presentation. |
| Empty space is functional | Whitespace must support grouping, scanning, and comprehension. |
| Actions are proportional to consequence | High-impact actions must carry stronger hierarchy, confirmation, and affordance than low-impact actions. |
| Destructive and high-impact actions require deliberate presentation | Deletion, cancellation, payment, disclosure, clinical signing, and emergency actions require unmistakable framing. |
| Local and human without superficial decoration | Nigerian-market appropriateness must come from language, flow, trust signals, payments, support, and operational realism, not stereotypes. |

## Requirement Matrix

| Requirement ID | Purpose | Affected page or journey class | Affected audience | Design or content owner | Accessibility impact | Privacy impact | Clinical or safety impact | Browser validation | Automated validation | Approval status | Implementation phase | Pilot gate effect |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| DES-NFR-001 | Make visual quality a release requirement | All user-facing surfaces | All actors | Design Owner + Product Owner | Requires hierarchy, contrast, focus, and readable density | Must not reveal sensitive data through visual shortcuts | Must not reduce emergency or clinical clarity | Desktop/tablet/mobile design review | Visual and content gates | REQUIRES_APPROVAL | P00-14A + Phase 1 | Blocks pilot if major surfaces are generic or inconsistent |
| DES-NFR-002 | Enforce one coherent design language | All portals and dashboards | Patients, clinicians, operators, sponsors, employers, HMOs | Design Owner | Consistent patterns reduce cognitive load | Consistent privacy indicators reduce leakage risk | Consistent critical-state patterns reduce safety confusion | Cross-portal browser review | Design-system conformance checks | REQUIRES_APPROVAL | P00-14A + Phase 1 | Blocks release if portals feel unrelated |
| DES-NFR-003 | Require deliberate typography hierarchy | Marketing, app, dashboard, clinical, finance | All readers | Design Owner + Content Owner | Heading hierarchy and readable scale required | Avoids hiding protected state context in small text | Clinical warnings and results must be scannable | Typography and heading browser review | Heading hierarchy checks | REQUIRES_APPROVAL | P00-14A | Blocks surfaces with unclear hierarchy |
| DES-NFR-004 | Require spacing, grid, alignment, width, and density rules | All layouts | All actors | Design Owner | Predictable spacing improves keyboard and magnification use | Prevents accidental proximity that implies unauthorized relationships | Reduces misread clinical/payment states | Responsive layout review | Layout overflow checks | REQUIRES_APPROVAL | P00-14A | Blocks inconsistent or cramped layouts |
| DES-NFR-005 | Govern elevation, borders, radii, iconography, imagery, and illustration | Cards, dialogs, dashboards, empty states, marketing | All actors | Design Owner | Icons and imagery require text alternatives | Imagery must not expose provider details or patient data | Imagery must not trivialize clinical situations | Visual review | Asset and alt-text scans | REQUIRES_APPROVAL | P00-14A | Blocks unapproved visual language |
| DES-NFR-006 | Govern data visualization, tables, timelines, maps, status indicators, and financial summaries | Dashboards, results, orders, claims, settlement | Clinicians, operators, payers, patients | Design Owner + Domain Owner | Tables/charts require accessible structure | Maps must not appear before authorized provider disclosure | Results and status indicators must not mislead | Browser review of dense states | Table/chart accessibility checks | REQUIRES_APPROVAL | P00-14A + Phase 1 | Blocks unsafe dashboards |
| DES-NFR-007 | Govern clinical result and consultation-room presentation | Consultation, clinical records, results | Patients, clinicians, lab operators | Clinical Safety Owner + Design Owner | Critical values and focus order must be clear | PHI must not leak through previews or notifications | Clinical urgency has highest visual priority | Clinical browser review | Clinical state tests | REQUIRES_CLINICAL_REVIEW | P00-14A + Phase 1 | Blocks clinical pilot |
| DES-NFR-008 | Govern loading skeletons and async feedback | All async journeys | All actors | Design Owner + QA Owner | Loading states must be perceivable | Skeletons must not reveal protected provider shapes or stale details | Clinical drafts and emergency paths must show safe progress | Loading/error/offline browser review | Async-state tests | REQUIRES_APPROVAL | P00-14A + Phase 1 | Blocks poor async UX |
| DES-NFR-009 | Require responsive composition as a release gate | Registration, onboarding, booking, payment, consultation, provider matching | Mobile, tablet, desktop users | Design Owner + QA Owner | Reflow, touch, focus, and zoom support required | Mobile truncation must not hide privacy boundaries | Emergency and urgent actions must remain visible | Desktop/tablet/mobile browser review | Viewport tests | REQUIRES_APPROVAL | P00-14A + Phase 1 | Blocks pilot if mobile is degraded |
| DES-NFR-010 | Require alternative or dark theme review only if approved | Any alternate theme | All actors | Design Owner + Accessibility Reviewer | Contrast and focus must be revalidated | Theme cannot mask locked disclosure indicators | Urgent/emergency colors must remain meaningful | Theme browser review if theme exists | Theme contrast checks | REQUIRES_APPROVAL | P00-14A or later | Blocks alternate theme release only |

## Required UI States

Every major surface must intentionally specify loading, skeleton, empty, populated, partial, success, warning, error, offline, reconnecting, unauthorized, forbidden, locked, expired, cancelled, suspended, under review, awaiting approval, pending payment, payment failed, refund pending, no match, provider replaced, urgent, emergency, and reduced-motion states.

## Role-Specific Experience

| Role | Quality expectation |
| --- | --- |
| Patient | Calm, clear, mobile-first, low anxiety, strong next-step clarity, visible privacy/payment boundaries. |
| Doctor | Efficient clinical scanning, safe note/result emphasis, clear escalation and amendment states. |
| Pharmacist | Order fulfilment clarity, inventory/authorization state clarity, protected disclosure boundaries. |
| Laboratory scientist | Order/result lifecycle clarity, critical-result escalation, specimen and result status precision. |
| Hospital coordinator | Referral, appointment, escalation, and patient handoff visibility without excess clinical access. |
| Family administrator | Funding and delegation clarity without implied clinical visibility. |
| Diaspora sponsor | Transparent funding, limited visibility, and clear consent/privacy boundaries. |
| Employer administrator | Population/benefit operations without individual clinical overexposure. |
| HMO operator | Coverage and claims visibility without unauthorized clinical access. |
| Support operator | Safe exception handling with privacy-preserving context and escalation paths. |
| Finance operator | Ledger, refund, settlement, and reconciliation clarity without clinical overreach. |
| Compliance reviewer | Audit, approval, source, and exception clarity. |
| Platform administrator | System health and configuration clarity with no universal bypass assumption. |

## Visual Review Gate

Every major implemented surface must later pass UI UX Pro Max design review, design-system compliance, desktop browser review, tablet browser review, mobile browser review, keyboard review, accessibility-tree review, reduced-motion review, loading and error-state review, content-alignment review, visual hierarchy review, overflow and truncation review, alternate-theme review if approved, and product-owner or design-owner approval.
