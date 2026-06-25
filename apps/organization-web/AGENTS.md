# Organization Web Instructions

These instructions apply under `apps/organization-web/`.

- This directory is boundary-only until P02-ISS-012 implements the Next.js shell.
- Do not create routes, dashboards, auth, employer/HMO benefits, claims, organization administration, real organization data, or production-origin behavior in P02-ISS-002.
- Future browser-visible work must use synthetic data, deterministic Playwright coverage, interactive browser inspection, accessibility checks, and privacy assertions.
- Organization context must not grant clinical-record access by implication.
