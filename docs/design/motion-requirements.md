# P00-14 Motion Requirements

## Document Control

| Field | Value |
| --- | --- |
| Version | 0.1 |
| Status | DRAFT-PENDING-SECURITY-ARCHITECTURE-QA-ACCESSIBILITY-PRIVACY-AND-OPERATIONS-APPROVAL |
| Phase | P00-14 |
| Supplemental work package | P00-14A required before P00-15 |
| Effective status | Not effective until approved by product, design, security, architecture, QA, accessibility, privacy, clinical safety, and operations owners |
| Scope | Motion requirements, controls, validation model, and Phase 1 handoff only |
| Exclusions | No Motion dependency, final motion values, motion tokens, components, routes, design tokens, or production implementation |
| Related decisions | REQ-NFR-056 through REQ-NFR-060, REQ-NFR-075 |

## Official Source Checks

| Source | Issuer | Date checked | Capability confirmed | Version-sensitive detail | Phase 1 verification action | Security or supply-chain concern |
| --- | --- | --- | --- | --- | --- | --- |
| https://motion.dev/docs/react-quick-start | Motion | 2026-06-24 | Motion for React quick start and React import path | Current docs show `motion` package usage through `motion/react` | Re-check before install and pin exact package version | Avoid installing stale or renamed package |
| https://motion.dev/docs/react-motion-config | Motion | 2026-06-24 | `MotionConfig` configuration and reduced-motion management | API may change by version | Verify props and global boundary before implementation | Misconfiguration could fail reduced-motion requirement |
| https://motion.dev/docs/react-use-reduced-motion | Motion | 2026-06-24 | `useReducedMotion` for component-specific alternatives | Hook behavior and import path are version-sensitive | Verify user-preference behavior in browser tests | Reduced-motion users must not receive unsafe motion |
| https://motion.dev/docs/react-animate-presence | Motion | 2026-06-24 | Presence and exit animation support | Exit behavior can retain removed content briefly | Test authorization loss, provider replacement, and DOM/accessibility tree cleanup | Exit animation could retain protected provider details |
| https://motion.dev/docs/react-layout-animations | Motion | 2026-06-24 | Layout animation support | Layout transition behavior is version-sensitive | Test layout shift and interruption behavior | Layout motion can obscure urgent content |
| https://motion.dev/docs/performance | Motion | 2026-06-24 | Performance guidance, including safer animation properties such as transform and opacity | Browser support and recommendations can change | Measure bundle and interaction impact after implementation | Expensive animation can harm low-powered devices |

## Technology Direction

Motion for React is the planned motion library. The current planned package name is `motion`, and React usage is planned through `motion/react`. Exact version must be verified and pinned during Phase 1. No dependency is installed during P00-14. Simple isolated effects may use CSS transitions. Coordinated state, presence, layout, sequencing, and gesture motion should use the approved Motion abstraction. Do not use `framer-motion` as the planned package name unless Phase 1 official documentation requires a compatibility exception.

## Motion Principles

1. Motion communicates cause and effect.
2. Motion reinforces spatial relationships.
3. Motion confirms state changes.
4. Motion must not become decoration without purpose.
5. Motion must never delay an urgent or emergency action.
6. Motion must never hide critical information.
7. Motion must never be required to understand content.
8. Motion must not create nausea, disorientation, or loss of focus.
9. Motion must remain performant on lower-powered devices.
10. Motion behavior must be consistent across applications.

## Requirement Matrix

| Requirement ID | Purpose | Affected page or journey class | Affected audience | Design or content owner | Accessibility impact | Privacy impact | Clinical or safety impact | Browser validation | Automated validation | Approval status | Implementation phase | Pilot gate effect |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MOT-NFR-001 | Use Motion for React as planned governed motion library | All React user-facing interfaces | All actors | Design Owner + Architecture Owner | Motion API must support accessibility controls | Motion must not serialize protected content into unsafe artifacts | Motion cannot delay urgent or emergency workflows | Browser motion review | Dependency/version check in Phase 1 | REQUIRES_APPROVAL | Phase 1 after P00-14A | Blocks uncontrolled motion implementation |
| MOT-NFR-002 | Require centralized motion tokens | Buttons, dialogs, navigation, lists, states, dashboards | All actors | Design Owner | Consistent motion reduces cognitive load | Tokens prevent ad hoc privacy-risk transitions | Urgent states can override tokenized defaults | Motion-system browser review | Token usage lint in Phase 1 | REQUIRES_APPROVAL | P00-14A + Phase 1 | Blocks arbitrary motion values |
| MOT-NFR-003 | Respect reduced-motion preferences globally | All animated interfaces | Users with vestibular, cognitive, attention, or device constraints | Accessibility Reviewer + Design Owner | Required for reduced-motion users | Reduced alternatives must still preserve privacy indicators | Emergency instructions remain immediately understandable | Reduced-motion browser review | Reduced-motion automated tests | REQUIRES_APPROVAL | Phase 1 | Blocks pilot if reduced motion fails |
| MOT-NFR-004 | Use `MotionConfig` for global behavior where approved | Application shell and motion boundary | All actors | Architecture Owner + Design Owner | Centralizes reduced-motion and transition control | Prevents inconsistent animation retention | Allows emergency overrides | Browser review of global preference | Configuration test in Phase 1 | REQUIRES_APPROVAL | Phase 1 | Blocks inconsistent motion behavior |
| MOT-NFR-005 | Use `useReducedMotion` where component alternatives are required | Component-specific motion | Reduced-motion users | Accessibility Reviewer + Frontend Owner | Enables non-motion alternatives | Avoids motion-only privacy/status communication | Prevents unsafe motion in clinical states | Component review | Hook behavior test | REQUIRES_APPROVAL | Phase 1 | Blocks unsafe component motion |
| MOT-NFR-006 | Govern presence and layout animation | Modals, drawers, route transitions, lists, provider detail reveal | All actors | Design Owner + Security Owner | Focus and reading order must remain stable | Exit animation must not retain protected details after authorization loss | Critical information must remain visible | Presence/layout browser review | DOM/accessibility-tree cleanup tests | REQUIRES_APPROVAL | Phase 1 | Blocks provider/reveal animation |
| MOT-NFR-007 | Prevent motion from delaying urgent or emergency actions | Urgent and emergency workflows | Patients, clinicians, support | Clinical Safety Owner + Design Owner | Immediate visible instructions required | Emergency states must not expose unrelated private data | Emergency actions appear immediately and never wait for decorative animation | Emergency transition review | Emergency motion tests | REQUIRES_CLINICAL_REVIEW | Phase 1 | Blocks clinical pilot if failed |
| MOT-NFR-008 | Prevent motion-only communication | All states | All actors | Accessibility Reviewer + Content Owner | Meaning must be available through text/semantics | Locked/provider states need textual privacy explanation | State changes must be clear without motion | Accessibility-tree review | Semantic state tests | REQUIRES_APPROVAL | Phase 1 | Blocks inaccessible interactions |
| MOT-NFR-009 | Protect provider-detail disclosure during motion | Provider discovery, payment, pharmacy/lab order | Patients, sponsors where allowed, providers | Privacy Owner + Security Owner | Accessibility tree must not retain stale protected data | No pre-payment entry/exit/render/stale leak | Provider replacement and authorization loss must be safe | Network/DOM/storage/artifact review | Privacy-boundary motion tests | REQUIRES_APPROVAL | Phase 1 | Blocks provider marketplace release |
| MOT-NFR-010 | Maintain motion performance on lower-powered devices | Mobile, tablet, low-bandwidth and low-power profiles | All actors | Architecture Owner + QA Owner | Performance affects accessibility and usability | Performance shortcuts must not cache protected data unsafely | Slow motion cannot block urgent workflows | Mobile and low-power review | Interaction delay and layout shift tests | REQUIRES_APPROVAL | Phase 1 | Blocks poor mobile pilot |

## Central Motion Tokens

P00-14A must define a centralized token system for duration, easing, spring, delay, stagger, distance, scale, opacity, blur, layout transition, entry, exit, emphasis, feedback, and navigation transition. No arbitrary per-component values should be introduced without review. Final values belong to P00-14A and Phase 1 implementation.

## Motion Categories

Motion requirements apply to button feedback, form validation, modal and dialog, drawer, dropdown, tooltip, toast, notification, list insertion and removal, stepper, tabs, route transition, dashboard refresh, loading state, skeleton transition, payment state, appointment state, order state, result state, provider-detail reveal, emergency alert, video-room state, map appearance, and responsive layout change.

## Safety Restrictions

Emergency and urgent interfaces must appear immediately, avoid decorative entrance delay, avoid looping animation, avoid motion that competes with instructions, maintain visible text throughout, and remain understandable with reduced motion enabled.

Provider-detail disclosure motion must not reveal an alternative provider, briefly render protected information before authorization, place protected data in an exit animation, preserve protected content in the DOM after authorization loss, or retain stale location information during provider replacement.

## Reduced Motion

Global reduced-motion handling is mandatory. Planned Phase 1 implementation must evaluate `MotionConfig` with user preference and `useReducedMotion` for component-specific alternatives. Large transforms must be removed or simplified, parallax must be absent for reduced-motion users, decorative autoplaying motion must not run, opacity or immediate state changes should be used where appropriate, and reduced-motion automated tests plus interactive browser review are required.

## Performance

Motion must avoid unnecessary layout animation, excessive simultaneous animations, unreviewed expensive properties, motion-induced layout shift, and nonessential motion while offscreen. Phase 1 must test lower-powered devices, mobile browsers, interaction delay, bundle impact, and approved lazy-loading or bundle-reduction techniques where appropriate.

## Motion Test Requirements

Future tests must cover user reduced-motion preference, project override if later approved, keyboard focus during animation, focus after modal exit, route transition, interruption, repeated action, rapid state changes, async state race, authorization loss during animation, provider replacement, emergency transition, browser back, mobile viewport, low-powered device profile, no content hidden solely through motion, and no protected information retained in the accessibility tree.
