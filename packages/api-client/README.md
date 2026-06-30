# @nelyohealth/api-client

Generated typed OpenAPI client package for Phase 2 contract work.

## Public API

- Exports generated OpenAPI types from `src/generated/openapi-types.ts`.
- Exports `createApiClient` from `src/generated/client.ts`.
- Preserves DTO parity modules used by existing contract tests.

## Safety

- Generated contract currently exposes only the approved API skeleton routes.
- Contract must not expose protected provider details, secrets, PHI, real provider data, or payment credentials.
- No hand-authored domain logic belongs in generated client files.
