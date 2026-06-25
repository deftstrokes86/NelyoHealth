# Admin Web Instructions

These instructions apply under `apps/admin-web/`.

- This directory is boundary-only until P02-ISS-012 implements the Next.js shell.
- Do not create routes, dashboards, auth, support access, operational admin actions, real data access, or production-origin behavior in P02-ISS-002.
- Future admin surfaces must use synthetic data and deny access to patient, clinical, payment, provider, credential, and organization data unless later explicitly authorized.
- Support/admin roles must not bypass bounded-context ownership or locked disclosure rules.
