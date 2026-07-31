# ADR-0016: Platform Registry Layer — declarative composition, structured capabilities, and the Tool Registry

## Status

ACCEPTED (roadmap M8.3 — architecture-completion arc). Design reviewed and approved with 12
architectural refinements, all folded in below. Delivered in phases; M8.3a (this record's first
increment) ships the foundation.

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
  cross-registry validation gate · Context Engine composition resolver. *(this increment)*
- **M8.3b** — Care Circle Registry (first-class) · Workflow Registry · Event Registry.
- **M8.3c** — Navigation · Dashboard · Experience registries + a `composeSurface` read.
- **M8.3d** — Search · Report registries + the Tool-Registry AI/automation consumer contract.

## Consequences

- One extensible composition engine underlies dashboards, navigation, tools, search, reports,
  workflows, AI, and future mobile — org types and personas are data.
- Invariants preserved: Context Engine authoritative; registries never grant; PDP sole decision point;
  derive-don't-persist; context isolation.
- Forward references (persona → dashboards/navigation/search/reports/onboarding/homepage) are modelled
  now and cross-validated as each target registry lands (M8.3c/M8.3d).
- Cost: a new `@nelyohealth/platform-registry` package + a light Context Engine adapter; no existing
  behavior changed in M8.3a.
