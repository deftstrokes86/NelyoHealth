# ADRs — two tracks, one reconciliation

This directory holds Architecture Decision Records from **two historically-separate tracks** that
overlapped in numbering. This note is the reconciliation (roadmap M6.3b, per Chief Architect review).
**No existing ADR is renumbered** — reviewed decisions keep their identifiers.

## The two tracks

1. **Governance / product ADRs — register: [`ADR-index.md`](./ADR-index.md).**
   Phase-0 (P00-16) product/governance decisions, tabulated in the register. Identifiers there include
   bare `ADR-00NN` (e.g. `ADR-0009` video deferral, `ADR-0010` "no PHI in analytics") and `ADR-P0X-NNN`
   (e.g. `ADR-P02-004`). **`ADR-index.md` is the authority for governance ADR numbers.**

2. **Engineering / implementation ADRs — standalone slug files `ADR-NNNN-slug.md`.**
   Detailed, code-level decisions written alongside the platform build, e.g.
   [`ADR-0010-event-consumer-projection-pattern.md`](./ADR-0010-event-consumer-projection-pattern.md)
   (M6.1) and
   [`ADR-0011-patient-profile-create-authorization.md`](./ADR-0011-patient-profile-create-authorization.md)
   (M6.3). **The slug files are the authority for the engineering ADR series.**

## The overlap (grandfathered)

`ADR-0010` and `ADR-0011` exist in **both** tracks — the governance register rows and the engineering
slug files are **different decisions that happen to share a number**. This is historical and is left
in place (the engineering files were already reviewed/accepted). Disambiguate by **track + filename**:
a slug file (`ADR-0011-patient-profile-create-authorization.md`) is always the engineering ADR; a bare
row in `ADR-index.md` is always the governance ADR.

## Going forward (collision-free)

- **New governance ADRs** use the `ADR-P0X-NNN` scheme in `ADR-index.md` (not new bare `ADR-00NN`).
- **New engineering ADRs** continue the slug-file convention, next number **`ADR-0012-slug.md`**.

Because new governance ADRs take the `P0X` form and engineering ADRs are always slug files, the two
series no longer collide after `ADR-0011`.
