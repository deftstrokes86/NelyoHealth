# @nelyohealth/database

Phase 2 database foundation package for migration, synthetic seed conventions, transaction helpers, and transactional outbox dispatch scaffolding.

## Scope

- Provides shared database command configuration for local and test environments.
- Defines deterministic synthetic seed rows used by Phase 2 infrastructure validation.
- Provides transaction helper and transactional outbox primitives for backend domain-event workflows.
- Uses approved Drizzle and pg dependency pins from ADR-P02-002.

## Safety

- Production reset and seed behavior is prohibited.
- Synthetic seed records are explicitly marked synthetic.
- Transaction helpers explicitly prevent external dispatch calls inside active transactions.
- No patient, provider, clinical, payment, credential, or production data is included.
