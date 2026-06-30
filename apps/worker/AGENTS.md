# Worker Application Instructions

These instructions apply under `apps/worker/`.

- P02-ISS-007 authorizes synthetic queue processing, retry policy, DLQ behavior, and worker health snapshots.
- Keep worker implementation scoped to queue foundation only; outbox dispatch and full observability remain future issues.
- Future jobs must carry correlation IDs and safe synthetic context only.
- Future queue payloads must not contain PHI, raw clinical documents, auth secrets, payment credentials, or protected provider details.
- Vendor queue/client types must stay behind adapter boundaries.
