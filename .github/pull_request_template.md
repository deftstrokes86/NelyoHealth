# Pull Request

## Summary

## Scope

## Issue or work-package reference

## Files or areas changed

## Non-goals

## Risk and dependency impact

## Architecture or ADR impact

## Security impact

## Privacy impact

## Clinical-safety impact

## Financial impact

## Accessibility impact

## Design and content impact

## Provider-disclosure impact

Confirm whether this change affects pharmacy or laboratory provider disclosure. If affected, explain how pre-payment responses avoid address, coordinates, distance, branch identity, contact details, map data, directions, pickup instructions, internal identifying metadata, or other protected provider details.

## Test evidence

List commands and results.

## Browser evidence, when UI is affected

- Interactive browser evidence:
- Deterministic Playwright evidence:
- Desktop evidence:
- Tablet evidence:
- Mobile evidence:
- Console/network capture:

## Motion evidence, when Motion is affected

- Reduced-motion evidence:
- Safety-immediate behavior:

## Documentation updates

## Changeset status

## Screenshot or artifact path

Use synthetic data only. Do not attach screenshots, traces, videos, logs, storage snapshots, or reports containing real patient, provider, clinical, financial, organization, credential, or production data.

## Rollback

## Checklist

- [ ] The change stays within the bounded prompt or work package.
- [ ] Phase 2 is not started by this change unless an explicit Phase 2 prompt authorizes it.
- [ ] Pilot launch remains PILOT-NO-GO.
- [ ] No real patient, provider, clinical, payment, organization, credential, or production data is included.
- [ ] No production origin, credential, database, deployment, release, or publication path is added.
- [ ] One longitudinal patient identity is preserved.
- [ ] Payer status does not grant clinical-record access.
- [ ] Pre-payment pharmacy/laboratory provider-detail non-disclosure is preserved.
- [ ] Payment-triggered disclosure, if relevant, remains scoped to the selected authorized order.
- [ ] Emergency escalation independence is preserved.
- [ ] Signed clinical records remain amendment/versioning-only.
- [ ] Browser and accessibility evidence is included where relevant.
- [ ] Documentation and governance registers are updated where relevant.
- [ ] Required external approvals are recorded or marked pending with owners.
