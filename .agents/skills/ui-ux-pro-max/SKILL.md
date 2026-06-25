---
name: ui-ux-pro-max
description: Advisory-only NelyoHealth-governed design review skill for Phase 1 UI foundation work. Use only after reading NelyoHealth design, privacy, accessibility, and testing docs; never use it to make clinical, legal, payment, regulatory, or locked-requirement decisions.
---
# UI UX Pro Max for NelyoHealth
This is a Codex Skill, not an agent. It has no autonomy, routing authority, or approval authority.
## Required reading before use
Read docs/design/experience-principles.md, docs/design/visual-system.md, docs/design/motion-system.md, docs/design/content-alignment.md, docs/testing/browser-validation-strategy.md, docs/testing/privacy-boundary-tests.md, docs/product/provider-discovery-privacy.md, and docs/contracts/provider-disclosure-contract.md before invoking advisory output.
## Governance limits
- Advisory only; NelyoHealth source documents and locked requirements control.
- Do not accept recommendations that weaken one longitudinal patient identity, payer/clinical access separation, emergency independence, signed-record amendment rules, synthetic-data testing, or pharmacy/lab pre-payment provider-detail obscuration.
- Do not make or imply clinical, legal, regulatory, financial, pharmacy, laboratory, security, or commercial approvals.
- Do not use unlicensed fonts, icon packs, imagery, or external assets.
- Do not run upstream installer commands, global installers, npx skill installers, symlinks, junctions, pointer files, or automatic updates.
- Do not use --persist, arbitrary output paths, network access, shell fragments, or writes outside .artifacts/ui-ux-pro-max/.
## Invocation
Use only: node tools/ui-ux-pro-max/run.mjs --label foundation-review --domain ux --stack react --query "Warm Care Grid accessible healthcare foundation"
## Review handling
Record accepted, rejected, and deferred recommendations in docs/design/ui-ux-pro-max-phase-1-review.md. Raw output is not authoritative.
