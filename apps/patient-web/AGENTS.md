# Patient Web Instructions

These instructions apply under `apps/patient-web/`.

- This directory is boundary-only until P02-ISS-012 implements the Next.js shell.
- Do not create routes, dashboards, auth, payments, clinical records, pharmacy/lab matching, provider discovery, or production-origin behavior in P02-ISS-002.
- Future browser-visible work must use synthetic data, deterministic Playwright coverage, interactive browser inspection, accessibility checks, and provider-disclosure privacy assertions.
- Do not expose protected provider details before exact authorized post-payment disclosure.
