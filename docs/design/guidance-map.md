# Finalized Design Guidance Map

This document resolves design-document conflicts for current implementation work.

## Effective Date

2026-07-03

## Purpose

- Establish one practical precedence order for implementation.
- Reconcile naming, scope, and policy differences across design files.
- Keep locked privacy, consent, RBAC, and safety constraints intact.

## Source Precedence For Implementation

1. Locked repository invariants in [AGENTS.md](../../AGENTS.md).
2. Current owner-approved execution/governance docs.
3. Route inventory in [screens.md](screens.md).
4. Scope gates in [page-and-state-inventory.md](page-and-state-inventory.md).
5. Design-system and experience constraints in:
   - [design-system-specification.md](design-system-specification.md)
   - [experience-principles.md](experience-principles.md)
   - [responsive-layout-strategy.md](responsive-layout-strategy.md)
   - [navigation-and-dashboard-models.md](navigation-and-dashboard-models.md)
   - [visual-quality-bar.md](visual-quality-bar.md)
6. Advisory-only design intelligence governance in [ui-ux-pro-max-governance.md](ui-ux-pro-max-governance.md).

## Conflict Resolutions

### 1) Product Naming

- Canonical product name for current implementation and repository docs is NelyoHealth.
- Existing "MediReach" text in [screens.md](screens.md) is treated as legacy copy.
- Route IDs and route paths in [screens.md](screens.md) remain authoritative.

### 2) Route Coverage vs Phase Scope

- [screens.md](screens.md) remains the complete route source for scaffolding.
- [page-and-state-inventory.md](page-and-state-inventory.md) controls scope labels:
  - PILOT and LEGAL-REQUIRED: implement now.
  - DESIGN-NOW-IMPLEMENT-LATER, POST-PILOT, Future: scaffold placeholder only.

### 3) Duplicate Guidance Files

- [visual-quality-bar.md](visual-quality-bar.md) is the canonical operational quality checklist.
- [layout-rules.md](layout-rules.md) is retained only as a compatibility alias and points to [visual-quality-bar.md](visual-quality-bar.md).

### 4) Motion Library Naming

- Motion policy follows [motion-requirements.md](motion-requirements.md) and [motion-system.md](motion-system.md).
- Transitional rule for current codebase:
  - Existing motion wrappers may remain during ongoing work.
  - New motion usage should align with the approved motion direction.
  - Full migration and package normalization is tracked as a dedicated follow-up task.

### 5) UI UX Pro Max Authority

- UI UX Pro Max output is advisory only per [ui-ux-pro-max-governance.md](ui-ux-pro-max-governance.md).
- It cannot override locked privacy, clinical, legal, consent, accessibility, or security constraints.

## Mandatory Cross-Document Rules

- Never disclose protected provider details pre-authorization.
- Emergency actions and guidance must remain immediately reachable.
- Every implemented screen must define loading, empty/populated, error, offline, forbidden/unauthorized, and success states.
- Mobile-first behavior is required for all user journeys.
- Synthetic data only for test evidence.

## Implementation Output Standard

Each scaffolded screen must include:

- Screen ID and route mapping to [screens.md](screens.md).
- Scope label from [page-and-state-inventory.md](page-and-state-inventory.md) where applicable.
- Explicit privacy/safety boundary messaging for locked or restricted states.
- Testability hooks for deterministic browser and accessibility checks.

## Change Control

If any referenced source changes materially, update this guidance map in the same change set and record the reason in governance change logs.