# P02-ISS-009 Object Storage Signed URL Adapter

## Status

COMPLETED with deterministic synthetic test evidence.

## Objective

Implement a provider-neutral object-storage port and local S3-compatible signed URL adapter for synthetic upload/download workflows.

## Scope delivered

- Added object-storage port contracts under platform-adapters.
- Added S3-compatible signed URL adapter implementation using AWS SDK v3 pins from ADR-P02-004.
- Added synthetic key safety and signed URL expiry validation.
- Added API storage endpoints for upload URL, download URL, and synthetic cleanup harness.
- Added synthetic test coverage for signed upload, signed download, expiry behavior, cleanup behavior, and privacy-safe payload assertions.
- Regenerated OpenAPI and typed client artifacts to include new storage endpoints.

## Files

- packages/platform-adapters/src/storage/object-storage-port.ts
- packages/platform-adapters/src/storage/s3-signed-url.adapter.ts
- packages/platform-adapters/src/index.ts
- packages/platform-adapters/package.json
- apps/api/src/nest/storage/storage.service.ts
- apps/api/src/nest/storage/storage.controller.ts
- apps/api/src/nest/storage/storage.module.ts
- apps/api/src/nest/app.module.ts
- apps/api/src/nest/openapi-generate.spec.ts
- apps/api/src/nest/openapi-drift.spec.ts
- tests/unit/object-storage-signed-url-adapter.spec.ts
- tests/integration/api-storage-signed-url.spec.ts
- packages/api-client/openapi/openapi.json
- packages/api-client/src/generated/openapi-types.ts
- packages/api-client/src/generated/client.ts

## Validation

```bash
pnpm --filter @nelyohealth/platform-adapters build
pnpm vitest run tests/unit/object-storage-signed-url-adapter.spec.ts
pnpm vitest run tests/integration/api-storage-signed-url.spec.ts
pnpm openapi:generate
pnpm --filter @nelyohealth/api exec vitest run src/nest/openapi-drift.spec.ts
pnpm api-client:generate
```

Expected evidence:

- Signed upload URL issued with bounded expiry.
- Signed download URL issued with bounded expiry.
- Synthetic cleanup endpoint returns cleaned keys/count.
- API payloads exclude protected provider/payment data fields.

## Rollback

- Revert ISS-009 adapter, API route, OpenAPI, and test files.
- Disable synthetic storage endpoints.
- Expire or revoke generated synthetic URLs by configuration and clear synthetic object keys.
