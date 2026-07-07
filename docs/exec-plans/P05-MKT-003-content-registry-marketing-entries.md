# P05-MKT-003 Content Registry Marketing Entries

## Objective

Populate `packages/content-registry` with the marketing copy required by the PILOT public pages and non-PILOT scope-caveat pages, add a `public-site` surface to the schema, add the marketing content families, and enforce voice/tone via a lint check that blocks the banned-claim list from `docs/content/public-website-content-blueprint.md`. Every entry ships as `status: "draft"` until Content Owner approval is recorded.

## Existing context

- `packages/content-registry/src/schema.ts` defines the current surface enum (`preview`, `patient-client`, `clinician-client`, `admin-client`, `browser-test`) and content classes (`public`, `operational`, `clinical-sensitive`, `payment-sensitive`, `provider-protected`).
- `packages/content-registry/src/ids.ts` defines content families.
- `packages/content-registry/src/synthetic-preview-content.ts` currently ships 3 entries.
- `packages/content-registry/src/release-policy.ts` gates approval status.
- `packages/content-registry/src/cta-alignment.test.ts` enforces CTA mapping.
- `DEC-P05-MKT-004` mandates registry-sourced marketing copy and voice/tone lint enforcement.

## Scope

- Add `public-site` to `surfaceSchema` in `packages/content-registry/src/schema.ts`. Preserve the existing `preview → syntheticOnly required` rule.
- Add these content families to `packages/content-registry/src/ids.ts`:
  - `marketing-home`
  - `marketing-how-it-works`
  - `marketing-segment-patients`
  - `marketing-segment-family-diaspora`
  - `marketing-segment-doctors`
  - `marketing-segment-pharmacies`
  - `marketing-segment-laboratories`
  - `marketing-segment-employers`
  - `marketing-segment-hmos`
  - `marketing-segment-hospitals`
  - `marketing-segment-home-care`
  - `marketing-trust-and-safety`
  - `marketing-privacy-overview`
  - `marketing-accessibility`
  - `marketing-faq`
  - `marketing-contact`
  - `marketing-legal`
  - `marketing-emergency`
  - `marketing-cta`
  - `marketing-microcopy`
  - `marketing-seo`
  - `marketing-error-pages`
  - `marketing-cookie-consent`
  - `auth-signin`
  - `auth-create-account`
  - `auth-forgot-password`
  - `auth-reset-password`

- Author ~250–300 draft entries under `packages/content-registry/src/entries/marketing/*.ts`, grouped by family. Per PILOT page, at minimum: hero eyebrow + headline + summary + primary CTA + secondary CTA, one entry per section, one entry per FAQ, one entry per trust-bar item, plus per-page SEO metadata (`title`, `description`, `og-title`, `og-description`, `og-image-id`, `canonical`). Non-PILOT pages carry a shorter set with an explicit scope-caveat entry plus SEO metadata.

- Add a dedicated `marketing-seo` family so per-page SEO entries live at `marketing-seo.<page-slug>.title`, `.description`, `.og-title`, `.og-description`, `.og-image-id`, `.canonical`. Consumed by `apps/patient-web/app/<route>/page.tsx` via Next.js `generateMetadata`.

- Add `packages/content-registry/src/voice-tone-lint.ts`:
  - Regex checks for banned claims from `docs/content/public-website-content-blueprint.md`: "best doctors", "best clinicians", "guaranteed" (with tolerated forms of "guarantee" allowed only in explicit privacy/security policy language), "fully licensed", "nationwide service", "instant results", "cheapest care", "complete privacy", "zero risk".
  - Regex checks for generic errors: "something went wrong" (allowed only when a safe recovery link is present in the same entry).
  - Emoji-in-clinical detection.
  - Case-sensitive brand casing: `NelyoHealth` only.
  - Every check fires as a Zod refinement and can be run standalone via a script.

- Add `packages/content-registry/src/voice-tone-lint.test.ts` covering pass and fail cases for each rule.

- Extend `packages/content-registry/src/cta-alignment.test.ts` to cover the new families, ensuring every primary/secondary CTA in a marketing entry maps to an approved CTA ID (`CTA-CREATE-ACCOUNT`, `CTA-SIGN-IN`, `CTA-CONTACT`, `CTA-FAQ`, `CTA-CALL-LOCAL-HELP`, `CTA-CONTACT-SUPPORT`, `CTA-BACK`).

- Update `packages/content-registry/src/index.ts` to export the new entries and the lint utility.

- Add `pnpm content:validate` extension so the voice-tone lint runs in CI.

## Non-goals

- No claim of approved production copy — every entry is `status: "draft"`.
- No page implementation — belongs to P05-MKT-004.
- No component implementation — belongs to P05-MKT-002.
- No content-approval workflow automation — approval remains human-gated per `docs/content/content-approval-workflow.md`.
- No copy for authenticated app surfaces (patient dashboard, etc.) — separate P05-ISS-004 scope.

## Source documents

- AGENTS.md
- docs/STATUS.md
- docs/governance/decision-register.md (`DEC-P05-MKT-004`)
- docs/content/public-website-content-blueprint.md
- docs/content/voice-and-tone.md
- docs/content/copy_patterns.md
- docs/content/microcopy-system.md
- docs/content/content-strategy.md
- docs/content/content-alignment-requirements.md
- docs/content/content-approval-workflow.md
- docs/content/error-empty-loading-and-success-copy.md
- docs/content/page-section-content-matrix.md
- docs/design/page-and-state-inventory.md
- NelyoHealth_Build_Implementation_Map_for_Codex.md (Phase 5)

## Locked rules

- No banned claims. Voice-tone lint blocks merge on any hit.
- No emoji as structural or clinical signal.
- No provider-protected copy that names locations, addresses, coordinates, distance, contact, or map data pre-payment.
- Every CTA maps to an approved CTA ID.
- All entries `status: "draft"`, `syntheticOnly: true` for the `preview` surface; `public-site` allows `syntheticOnly: false` only after Content Owner records an approval decision — enforced in the release-policy check.
- Nigerian and diaspora context handled without stereotype; brand pillars from `docs/content/brand.md` apply.

## Files expected to be affected

- packages/content-registry/src/schema.ts (add `public-site` surface; add release-policy hook for approval)
- packages/content-registry/src/ids.ts (add families)
- packages/content-registry/src/entries/marketing/*.ts (new — one file per family)
- packages/content-registry/src/entries/marketing/index.ts (new — aggregate)
- packages/content-registry/src/voice-tone-lint.ts (new)
- packages/content-registry/src/voice-tone-lint.test.ts (new)
- packages/content-registry/src/cta-alignment.test.ts (extend)
- packages/content-registry/src/release-policy.ts (extend for `public-site` approval)
- packages/content-registry/src/release-policy.test.ts (extend)
- packages/content-registry/src/index.ts (re-exports)
- scripts/content-validate.mjs (extend to run lint)
- docs/governance/phase-5-requirements-traceability.md (update `P05-MKT-REQ-003`)
- docs/governance/change-log.md (append)
- docs/STATUS.md (update)

## Dependency changes

None. `zod` and `vitest` are already present.

## Architecture impact

- Content is compiled at build time — no runtime fetch.
- `useContent` in `packages/ui-foundation` consumes the compiled registry; unknown IDs throw in development and are flagged by a boundary test at build.
- Voice-tone lint runs as part of `pnpm content:validate`.

## Data-model impact

None.

## API impact

None.

## UI and browser impact

- No direct UI change here — this issue produces data, not components. Downstream P05-MKT-004 consumes it.

## Privacy and security

- Provider-protected content class blocks pre-payment provider-location details (already enforced in `schema.ts`).
- Legal and privacy entries carry a `DRAFT-PENDING-APPROVAL` marker until Legal/Privacy owners record approval.
- Voice-tone lint blocks the "complete privacy" and "zero risk" claims — the very claims that misrepresent the platform's privacy posture.

## Acceptance criteria

1. `public-site` surface added; existing rules preserved; new release-policy path exercised in tests.
2. All listed content families exist in `ids.ts`.
3. At least 250 draft entries populated across the marketing families (targeting 300 with SEO metadata and error/cookie surfaces included).
4. Voice-tone lint reports zero banned-claim hits across all `public-site` entries; positive and negative unit tests cover every rule.
5. CTA-alignment test covers every marketing entry.
6. `pnpm content:validate` (or offline equivalent) passes.
7. Governance traceability and STATUS updated.

## Validation commands

```bash
git status --short
git diff --check
node ./node_modules/vitest/vitest.mjs run packages/content-registry
node scripts/content-validate.mjs
```

## Rollback

- Revert `packages/content-registry/src/entries/marketing/*` and lint additions.
- Restore `surfaceSchema` and `ids.ts` to HEAD.
- Revert release-policy and cta-alignment extensions.
- Revert traceability and STATUS updates.

## Risks

- Copy fatigue producing thin content. Mitigation: use `docs/content/page-section-content-matrix.md` and `docs/content/copy_patterns.md` as canonical sources; do not paraphrase generic marketing lines.
- Voice-tone lint too strict, blocking legitimate copy. Mitigation: allowlist mechanism inside the lint for legal/privacy quotations that require the flagged word; tests cover the allowlist boundary.
- Draft entries drifting from ID conventions. Mitigation: schema enforces `family.slug` prefix; boundary test on aggregate.

## Decisions trail

- docs/governance/decision-register.md (`DEC-P05-MKT-004`)
- docs/governance/change-log.md
- docs/content/public-website-content-blueprint.md
- docs/content/voice-and-tone.md

## Completion evidence

P05-MKT-003 closes only when acceptance criteria are met and traceability/status records are updated with exact command and artifact evidence.
