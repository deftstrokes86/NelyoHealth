# API Application Instructions

These instructions apply under `apps/api/`.

- This directory is boundary-only until P02-ISS-005 implements the NestJS API skeleton.
- Do not create controllers, routes, DTOs, database access, migrations, auth, provider matching, payment, clinical, pharmacy, laboratory, or production behavior in P02-ISS-002.
- Future controllers must not access private database tables directly.
- Future external providers must be reached only through ports and adapters.
- Future OpenAPI output must not expose protected provider details, secrets, PHI, real provider data, or payment credentials.
