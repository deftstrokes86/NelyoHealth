# Worker Application Instructions

These instructions apply under `apps/worker/`.

- This directory is boundary-only until P02-ISS-007 implements queue and worker behavior.
- Do not create jobs, queue connections, retries, DLQ behavior, outbox dispatch, containers, or live provider integrations in P02-ISS-002.
- Future jobs must carry correlation IDs and safe synthetic context only.
- Future queue payloads must not contain PHI, raw clinical documents, auth secrets, payment credentials, or protected provider details.
- Vendor queue/client types must stay behind adapter boundaries.
