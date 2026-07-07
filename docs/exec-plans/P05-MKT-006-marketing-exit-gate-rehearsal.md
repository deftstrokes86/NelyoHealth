# P05-MKT-006 Marketing Exit-Gate Rehearsal and Governance Close

## Objective

Rehearse the full P05-MKT exit-gate matrix, capture deterministic evidence, and close the marketing track by updating governance records. Mirrors the pattern used for P02-ISS-018 (Phase 2 exit-gate rehearsal).

## Existing context

- P05-MKT-001..005 are complete: visual language + tokens, marketing components + illustrations, content registry populated + lint enforced, PILOT pages built, non-PILOT scope-caveat pages built.
- `docs/governance/phase-5-requirements-traceability.md` contains the `P05-MKT-REQ-001..007` requirement map and `P05-MKT-EG-001..006` exit-gate map from the authorization decision.

## Scope

Run and record the following evidence:

**Visual + accessibility matrix:**

- Playwright over every PILOT page × 3 viewports (390 / 768 / 1440).
- Playwright over every non-PILOT page × 3 viewports.
- Playwright over the marketing component gallery × 3 viewports.
- axe-core accessibility audit on every page + every gallery route.
- Reduced-motion project run over every marketing page.
- Text-resize at 200% run over every marketing page.

**Emergency accessibility:**

- Emergency ribbon is the first tab stop on every public page — asserted per page.
- Emergency page motion profile is SAFETY-IMMEDIATE — snapshot test.

**Content discipline:**

- Voice-tone lint reports zero banned-claim hits across all `public-site` entries.
- CTA-alignment test covers every marketing entry; zero unmapped CTAs.
- Inline-string boundary test reports zero inline strings across marketing pages.
- Every non-PILOT page contains the exact scope-caveat copy.

**Performance:**

- Home page LCP ≤ 2.0s, CLS = 0 on desktop (1440) and mobile (390) local traces.
- Home page JS payload ≤ 200KB gzipped over the wire; measured in a build report.

**Boundary:**

- `packages/ui-foundation` and `packages/content-registry` import no `apps/*` code.
- No domain identifiers appear in marketing packages.

**Redirects:**

- Every renamed route (`/for-diaspora → /diaspora`, etc.) 301-redirects; verified via Playwright + `next.config` snapshot.

**Documentation close:**

- Update `docs/governance/phase-5-requirements-traceability.md` — flip `P05-MKT-REQ-001..007` to COMPLETED; flip `P05-MKT-EG-001..006` to COMPLETED; append evidence-command index.
- Update `docs/STATUS.md` — set P05-MKT track to COMPLETED; update `Next action` pointer.
- Append `docs/governance/change-log.md` entry with evidence links and command outputs.
- Append `docs/governance/decision-register.md` with a `DEC-P05-MKT-006` recording the rehearsal-passed state; keep it as ACCEPTED (not APPROVED for production — Phase 5 marketing is still evidence-first, not pilot approval).

## Non-goals

- No new features.
- No new components, no new content entries, no new pages.
- No production approval or pilot go/no-go change — Pilot remains PILOT-NO-GO.
- No production PHI, payment, or provider-detail data introduced anywhere.
- No cloud deployment.

## Source documents

- AGENTS.md
- docs/STATUS.md
- docs/governance/decision-register.md (`DEC-P05-MKT-001..005`)
- docs/governance/phase-5-requirements-traceability.md
- docs/exec-plans/P02-ISS-018-phase-2-exit-gate-rehearsal-and-rollback-evidence.md (pattern reference)
- docs/design/design-qa-and-visual-review.md
- docs/design/visual-quality-bar.md
- docs/design/experience-quality-requirements.md

## Locked rules

- Synthetic data only.
- No production browser profile, no real credentials, no external origins.
- Rollback plan must exist and be exercised in dry-run.
- Evidence commands recorded verbatim in the change-log with output summaries.

## Files expected to be affected

- docs/governance/phase-5-requirements-traceability.md (flip statuses)
- docs/governance/change-log.md (append rehearsal entry)
- docs/governance/decision-register.md (append `DEC-P05-MKT-006`)
- docs/STATUS.md (update)
- docs/exec-plans/P05-MKT-006-marketing-exit-gate-rehearsal.md (this doc; closed with evidence)
- tests/e2e/p05-mkt-006-exit-gate.spec.ts (aggregate suite; may compose existing suites via config)
- playwright.p05-mkt-006.config.ts (aggregate config)
- .artifacts/p05-mkt-006/ (evidence bundle: Playwright HTML report, axe-core summaries, LCP/CLS traces, redirect table)

## Dependency changes

None.

## Architecture impact

None. This issue closes the marketing track; it does not extend architecture.

## Data-model impact

None.

## API impact

None.

## UI and browser impact

- No new UI. This issue verifies existing UI holds the exit-gate contract across viewports, motion profiles, and text resize.

## Privacy and security

- Verified through boundary tests: no PHI, no provider details, no payment data, no PII in marketing pages.
- Redirect table verified for absence of open redirect vectors.

## Acceptance criteria

1. Full Playwright matrix passes across all viewports, all pages, all motion profiles, and 200% text resize.
2. axe-core reports zero critical or serious issues on every audited page.
3. Voice-tone lint, CTA-alignment, and inline-string boundary reports are clean.
4. Home LCP ≤ 2.0s and CLS = 0 on desktop and mobile.
5. Every renamed route 301-redirects.
6. Marketing packages import no `apps/*` and contain no domain identifiers.
7. `docs/governance/phase-5-requirements-traceability.md` flips `P05-MKT-REQ-001..007` and `P05-MKT-EG-001..006` to COMPLETED with evidence links.
8. `docs/STATUS.md`, `docs/governance/change-log.md`, and `docs/governance/decision-register.md` reflect the closure.
9. Evidence bundle materializes under `.artifacts/p05-mkt-006/` and is referenced in the change-log entry.

## Validation commands

```bash
git status --short
git diff --check
node ./node_modules/vitest/vitest.mjs run packages/content-registry packages/ui-foundation packages/design-tokens
node ./node_modules/@playwright/test/cli.js test --config playwright.p05-mkt-006.config.ts
node scripts/content-validate.mjs
```

## Rollback

- Revert traceability, STATUS, decision-register, and change-log updates.
- Rollback does not touch code — this issue is evidence + documentation.
- If evidence fails, open follow-up issues under `P05-MKT-006-followups` rather than editing prior issues.

## Risks

- Evidence bundle churn from Playwright flakiness. Mitigation: retry policy configured in `playwright.p05-mkt-006.config.ts`; deterministic waits, no arbitrary timeouts.
- LCP regression from illustration weight. Mitigation: SVG optimization pass; illustration budget in the visual-language doc.
- Over-claiming production readiness. Mitigation: the rehearsal doc explicitly states this is not a pilot approval; Pilot remains PILOT-NO-GO in STATUS.

## Decisions trail

- docs/governance/decision-register.md (`DEC-P05-MKT-001..005`, and `DEC-P05-MKT-006` recorded by this issue)
- docs/governance/change-log.md
- docs/governance/phase-5-requirements-traceability.md

## Completion evidence

P05-MKT-006 closes only when acceptance criteria are met and traceability/status records are updated with exact command and artifact evidence, and the evidence bundle exists under `.artifacts/p05-mkt-006/`.
