# P02-ISS-006 OpenAPI Generation and Typed Client Contract

## Objective

Generate an OpenAPI contract from the approved NestJS API skeleton and generate a typed frontend client package for later web/mobile shells.

## Scope implemented

- Added `@nestjs/swagger` to API package.
- Added source-based OpenAPI generation flow through `pnpm openapi:generate`.
- Added typed client generation flow through `pnpm api-client:generate` and `packages/api-client/scripts/generate-client.mjs`.
- Generated OpenAPI artifact at `packages/api-client/openapi/openapi.json`.
- Generated typed client artifacts under `packages/api-client/src/generated/`.
- Added drift validation ensuring generated OpenAPI remains aligned with API source and excludes protected provider details.
- Updated api-client package boundary documentation to reflect implemented contract generation.

## Validation evidence

Validated on 2026-06-30:

- `pnpm openapi:generate` passed.
- `pnpm --filter @nelyohealth/api-client exec node scripts/generate-client.mjs` passed.
- `pnpm --filter @nelyohealth/api exec vitest run src/nest/openapi-drift.spec.ts` passed.
- `pnpm exec vitest run tests/contracts/contract-parity.test.ts` passed.

## Known validation gap

- Full API workspace build/typecheck still has pre-existing legacy errors outside the ISS-006 contract path.
- ISS-006 generation avoids those unrelated failures by generating from the validated Nest source path directly.

## Out of scope

- No authenticated or domain-rich OpenAPI surface yet.
- No frontend shell consumption yet.
- No Git or GitHub write.
