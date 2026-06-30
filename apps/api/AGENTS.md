# API Application Instructions

These instructions apply under `apps/api/`.

- P02-ISS-005 has implemented the NestJS API skeleton with health/readiness routes and request conventions.
- Keep scope to skeleton behavior only until later Phase 2 issues authorize more runtime capability.
- Do not add auth, provider matching, payment, clinical, pharmacy, laboratory, or production behavior in P02-ISS-005.
- Future controllers must not access private database tables directly.
- Future external providers must be reached only through ports and adapters.
- Future OpenAPI output must not expose protected provider details, secrets, PHI, real provider data, or payment credentials.
