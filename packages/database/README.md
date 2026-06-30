# @nelyohealth/database

Phase 2 database foundation package for migration and synthetic seed conventions.

## Scope

- Provides shared database command configuration for local and test environments.
- Defines deterministic synthetic seed rows used by Phase 2 infrastructure validation.
- Uses approved Drizzle and pg dependency pins from ADR-P02-002.

## Safety

- Production reset and seed behavior is prohibited.
- Synthetic seed records are explicitly marked synthetic.
- No patient, provider, clinical, payment, credential, or production data is included.
