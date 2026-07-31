# ADR-0016: Platform Registry Layer — declarative composition, structured capabilities, and the Tool Registry

## Status

ACCEPTED (roadmap M8.3 — architecture-completion arc). Design reviewed and approved with 12
architectural refinements, all folded in below. Delivered in phases; M8.3a shipped the foundation,
M8.3b the collaboration/behavior registries, and M8.3c the composition surface. M8.3c closes the
Design-Freeze gap "Navigation / Dashboard Registries" in `architecture-evolution-report.md`.

## Date

2026-07-31

## Context

M8.3 began as "Navigation & Dashboard registries" and was expanded into a comprehensive **Platform
Registry Layer**: the single, declarative source of truth for how the platform composes dashboards,
navigation, tools, search, reports, workflows, AI, and future mobile experiences. The architecture-
evolution report's central warning governs the design: the platform already resolves Workspace,
Persona, and care-circle capacity **imperatively** (the Context Engine's `WorkspaceKind` /
`ResolvedPersona`; the hardcoded `RELATIONSHIP_CAPACITY` map). Introducing registries "as if greenfield"
would create two architectures describing one platform.

## Decision

### 1. Formalize, don't fork
Every registry is the **declarative formalization** of something the Context Engine already computes,
not a parallel model. The Context Engine remains authoritative for WHO is acting, in which workspace,
as which persona; the registries declare WHAT composes for that resolved context.

### 2. Structured capabilities are the unifying primitive
A **capability** is a structured object — `{ id: resource.action, resource, action, category, scope,
description, metadata }` — not a string, so it is discoverable, groupable, and extensible. Every
registry entry declares the capabilities it requires or contributes. Composition = filter registries by
the capability set the Context Engine resolves (`workspace × persona [× care-circle capacity × PDP]`).
Organization types (hospital, pharmacy, laboratory, employer, insurer, NGO, government, diaspora
household) differ only in **registry data**, never in code branches.

### 3. Registries never grant authorization
The resolved capability set governs what may be **composed/offered**, never what is permitted. The PDP
(Authorization Platform) remains the **sole** authorization decision point and re-decides every action
at the resource door. `resolveComposition` / `resolveCompositionForActingContext` are composition-only
and must never be consulted to authorize a resource operation. This preserves default-deny, explicit
permissions, and auditability.

### 4. A Tool Registry — AI is a consumer, not a parallel platform
There is no separate "AI capability" surface. Capabilities expose **tools**; UI, Mobile, AI,
Automation, and Integration are equal consumers of the **same** Tool Registry through the same
declarative input/output contract. A future AI Context Resolver reads this registry exactly as the UI
does, and the PDP authorizes the underlying capability at invocation.

### 5. The registries (declarative, validated, extensible)
Workspace (with lifecycle: status, enablement, feature flags, verification/subscription requirements),
Persona (expanded: capabilities + default dashboards, navigation, search scopes, notification
preferences, reports, onboarding, homepage composition, interaction patterns), Care Circle (first-class
collaboration capabilities; membership stays event-projected — derive-don't-persist), Navigation,
Dashboard, Experience, Search, Report, Event (formalizing the M6 Event Platform), Workflow, and the
Tool Registry. `scopeType` on workspaces aligns with the M8.2 Scope Registry so tenancy and composition
share one scope vocabulary.

### 6. Built for a future platform builder
Everything is data (JSON-serializable) validated by a CI gate enforcing cross-registry referential
integrity, so the layer can eventually be administered through a platform builder rather than only by
developers — any incoherent reference fails the gate.

### Phasing
- **M8.3a** — structured Capability model · Tool Registry · Workspace Registry · Persona Registry ·
  cross-registry validation gate · Context Engine composition resolver. *(delivered)*
- **M8.3b** — Care Circle Registry (first-class) · Workflow Registry · Event Registry. *(delivered)*
- **M8.3c** — Navigation · Dashboard · Experience registries + a `composeSurface` read. *(delivered)*
- **M8.3d** — Search · Report · Integration registries + the Tool-Registry AI/automation
  consumer contract. *(delivered — completes the layer)*

## M8.3b increment — refinements + collaboration/behavior registries

Folded into the layer (no parallel architectures):

- **Capability**: added a business `domain` (clinical, care-coordination, communication,
  identity, administrative, finance, research, government, analytics, platform) and free-form `tags`
  for discovery / AI reasoning / analytics / search.
- **Tool**: replaced the coarse consumer list with a structured `compatibility` block (`supportsUI /
  Mobile / AI / Automation / API / Offline`, `requiresApproval`, `requiresStreaming`) — AI remains a
  consumer, never a parallel registry.
- **Workspace**: added `presentation` (branding, theme, navigation style, landing dashboard, experience
  profile) and `features[]` — a workspace is a complete experience definition.
- **Persona**: added `behavior` (communication style, notification strategy, AI interaction profile,
  preferred landing experience, default search/report preferences).
- **Event Registry**: formalizes the M6 Event Platform as a contract (publishers, subscribers, retry,
  dead-letter, classification, retention, analytics visibility). Other registries reference event ids
  via `produces` / `consumes`, so M6 becomes implementation of a defined contract.
- **Feature Registry**: org-available features (Appointments, Messaging, Care Circle, Labs, Pharmacy,
  AI, Employer/Government portals) — **distinct from feature flags** (flags are the rollout mechanism in
  workspace lifecycle).
- **Workflow Registry**: a GENERIC state/transition engine; each transition declares its capability,
  emitted events, and notification / automation / AI / reporting hooks. New workflows are data.
- **Notification Registry**: declarative routing (event trigger → persona / care-circle-role /
  capability audience → channels → template → classification → priority); Care Circle collaboration and
  workflow transitions route through it, not hardcoded logic.
- **Care Circle Registry**: Care Circle as a first-class construct modelling collaboration
  (responsibilities, communication rules, shared resources, financial sponsorship, emergency
  escalation, AI collaboration, care goals, task ownership). Membership stays event-projected
  (derive-don't-persist). `capacity` is a DECLARATION mirroring the PDP capacity map — **not an
  authorization input**; a role with `capacity: null` (family-member, diaspora-sponsor, household,
  emergency-contact) is declared but PDP-default-denied, exactly as today.

Cross-registry referential integrity (capability / event / feature / persona / care-circle-role /
notification-route references) is enforced by the `gates:registry` validation gate.

## M8.3c increment — the composition surface

The three remaining composition registries plus the read that assembles them. What a persona sees is
now **declared and filtered**, never rendered by per-persona code.

- **Navigation Registry**: items declare route, section, hierarchy (`parentId`), order, workspace
  kinds, required capability, required feature, and a notification-route badge source. An item with an
  empty `route` is a **group**; a group whose children all filter out is **dropped** — a menu entry
  that opens nothing is never offered. Nesting is capped at one level, which also makes parent cycles
  structurally impossible.
- **Dashboard Registry**: a dashboard is a declared set of **widgets**, each with its own capability /
  feature requirement and, where it reads data, the **Tool Registry** tool that supplies it. Widgets
  filter individually, so one dashboard serves several personas (`patient-home` serves patient,
  caregiver, and guardian) instead of a page per persona. A dashboard left with no widget is dropped.
- **Experience Registry**: one id space, three kinds — `onboarding` (an ordered, capability-filtered
  step flow), `homepage-section` (a composable landing section), and `profile` (tone / density /
  motion). One registry keeps a single validated id space and one filter rule while `kind` keeps each
  reference site strict: an onboarding flow can never be used as an experience profile.
- **`composeSurface(workspace, persona)`**: the single composition read. It applies the same three
  filters — capability, feature, workspace kind — uniformly across navigation, dashboards, and
  experiences, resolves the landing dashboard (workspace default, falling back to the first that
  composed) and the experience profile (persona preference overriding the workspace default), and
  fails **closed**: an inactive composition yields an empty surface and any unresolved reference is
  dropped rather than defaulted.

**Forward references closed.** `persona.defaultDashboards / navigation / onboardingFlows /
homepageComposition / behavior.preferredLandingExperience` and `workspace.presentation.landingDashboard
/ experienceProfile` now resolve against live registries in `gates:registry`, with **workspace-kind
coherence** enforced so a persona can never declare a surface it could never compose, and a nested
navigation item can never be declared where a top-level one is required. A widget's
`requiresCapability` must match its tool's capability, so the filter cannot offer a widget the PDP
will refuse. Only `searchScopes` / `reports` remain forward references, until M8.3d.

**Data correction.** The `hospital` workspace baseline previously conferred `consultation.conduct` and
`clinical-record.amend` on **every** persona in the workspace, including an administrator. A workspace
baseline is what every persona composes, so those moved to the `clinician` persona that already
declares them; the baseline is now `timeline.read`. The `personal` workspace gained the
`clinical-records` feature, which its document surfaces require.

**Invariant unchanged.** A surface is what may be **offered**. `composeSurface` must never be consulted
to authorize an operation, and the absence of an item is a UX affordance, not a security control — the
PDP re-decides at the resource door.

## M8.3d increment — search, reports, integrations, and the consumer contract

The last three registries and the second composition read. **The layer now has no forward
references**: every id on every registry resolves against a live registry under `gates:registry`.

- **Search Registry**: a scope declares its resource, reach (`self` / `care-circle` / `organization` /
  `cross-organization`), searchable fields, and — decisively — the **highest classification a result
  may carry**. Free-text search is the surface most likely to leak across a context boundary, so
  cross-organization reach over `PROTECTED-CLINICAL-DATA` or `SENSITIVE-PERSONAL-DATA` is **rejected by
  the schema**, and a scope's capability must cover the resource it searches. The projection layer
  (M8.1) remains the enforcement point on the way out; this registry makes the claim reviewable.
- **Report Registry**: reports are declared projections over the event stream. **ADR-0010 is enforced
  structurally, not by reviewer discipline** — an `analytics` report must be aggregated or
  de-identified and classified `DEIDENTIFIED-OR-AGGREGATED-DATA`, and the gate additionally refuses one
  sourced from any event the Event Registry has not marked `analyticsVisible`. Row-level clinical
  reporting stays expressible as an `operational` or `clinical` report, where it is visible for what it
  is.
- **Integration Registry**: every boundary where data enters or leaves — direction, protocol,
  counterparty, classification, cross-border flag, auth mode, processor agreement. Non-public data may
  not cross an unauthenticated boundary, and anything non-public that *sends* data (or crosses a
  border) requires a processor agreement. This is the machine-readable half of the cross-border and
  subprocessor registers, not a replacement for them.
- **`resolveToolContract(workspace, persona, consumer)`**: the AI / Automation / Integration read,
  delivering refinement 2. UI, Mobile, AI, Automation, API, and Offline call the **same** function over
  the **same** Tool Registry and differ only in the surface they name. It reports **withheld** tools
  with a reason (`capability-not-composed`, `surface-unsupported`, `composition-inactive`) — an agent
  that cannot see why a tool is absent will retry, and an auditor needs the negative answer too. A
  write tool exposed to AI or automation **must** require approval: enforced on the data by the gate
  and re-asserted at resolution so a later data change cannot quietly widen the contract.

`composeSurface` gains `search` and `reports`; a `planned` scope or report never composes.

**Audit findings closed** (from the pre-commit architectural verification of M8.3c): the orphaned
`send-message` tool is now reachable through reply widgets on both messaging dashboards and every tool
is reachable from at least one widget; `caregiver` gained an onboarding flow and `organization-admin`
gained homepage sections, moving both from Partial to Implemented; `clinician` gained
`patient-profile.read`, without which it could not compose the patient search it plainly needs.

**Still true, and unchanged by this increment**: there are **zero runtime consumers**. Neither
`composeSurface` nor `resolveToolContract` is called by any app, controller, or worker, and no
`GET /api/me/surface` exists. See "Known gaps" below.

### Known gaps after M8.3d (recorded, not deferred silently)

1. **No HTTP surface endpoint** — the layer is unreachable from outside the process.
2. **Persona resolution is hardcoded** — `acting-context-resolver.ts` returns `actorRole: "patient"`
   for every personal context, so the caregiver and guardian surfaces are unreachable at runtime.
3. **Care Circle is not an input to composition** — `resolveComposition` reads workspace ∪ persona
   only; `RELATIONSHIP_CAPACITY` remains a separate imperative path. There is no subject dimension, so
   acting for oneself and acting for a ward compose identically.
4. **Workspace id mapping is hardcoded** to `hospital`, so organization sub-types cannot resolve.
5. **Diaspora is a taxonomy entry only** — `diaspora-sponsor`, `family-member`, and `household` exist
   in the Care Circle Registry with `capacity: null`; there is **no** diaspora workspace, persona,
   navigation, dashboard, or experience.

Gaps 1–4 are the "surface wiring" milestone; gap 5 is a product-scope decision that should be made
explicitly rather than inherited.

### Roadmap (not implemented) — Platform Templates
Platform Templates (Hospital, Employer, Insurer, NGO, Government, Research, Diaspora Family, …) are the
**composition layer above the registries** — a template selects and configures workspaces, personas,
features, workflows, and notifications into a ready-to-run deployment. They are intentionally NOT built
yet; the registry design (data-driven, id-referenced, validated) does not preclude them.

## Consequences

- One extensible composition engine underlies dashboards, navigation, tools, search, reports,
  workflows, AI, and future mobile — org types and personas are data.
- Invariants preserved: Context Engine authoritative; registries never grant; PDP sole decision point;
  derive-don't-persist; context isolation.
- Forward references (persona → dashboards/navigation/search/reports/onboarding/homepage) are modelled
  now and cross-validated as each target registry lands; navigation/dashboard/onboarding/homepage
  closed in M8.3c, search/reports remain open until M8.3d.
- Cost: a new `@nelyohealth/platform-registry` package + a light Context Engine adapter; no existing
  behavior changed in M8.3a. M8.3c likewise adds only declarations and a read — no consumer is wired
  to `composeSurface` yet, so no rendered surface changed.
