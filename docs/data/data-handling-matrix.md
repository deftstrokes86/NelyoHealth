# NelyoHealth Data Handling Matrix

## Document Control

| Field | Value |
|---|---|
| Prompt | P00-06 |
| Complete Breakdown work packages | P00-07; P00-08 |
| Issue IDs | P00-DOM-001; P00-ARC-001 |
| Owner role | Security lead + privacy counsel + QA lead |
| Review state | PROPOSED |
| Last updated | 2026-06-24 |
| Related documents | docs/data/data-classification.md; docs/security/access-intent-matrix.md; docs/security/payer-visibility-matrix.md |

## Matrix Values

| Value | Meaning |
|---|---|
| ALLOWED | Permitted for authorized purpose and actor. |
| CONDITIONAL | Requires policy, authorization, or specific scope. |
| PROHIBITED | Must not occur. |
| MINIMIZED | Only minimum necessary fields. |
| REDACTED | Protected details removed before exposure. |
| ENCRYPTED | Encryption expected at rest/in transit as applicable. |
| TOKENIZED | Surrogate token used instead of sensitive value. |
| AGGREGATED-ONLY | Only aggregate/de-identified output. |
| SYNTHETIC-ONLY | Synthetic data only. |
| REQUIRES-APPROVAL | External owner approval required before use. |

## Handling Channels Covered

This matrix covers Collection, API request, API response, Browser rendering, Browser storage, Browser cache, Mobile-device storage future scope, Server log, Audit log, Analytics, Error reporting, Notification, Email, SMS, Push notification, File export, Download, Object storage, Backup, Lower environment, Test fixture, Screenshot, Browser trace, Video artifact, Support access, Administrative access, Partner integration, Retention, and Deletion or correction.

## Classification Handling Matrix

| Classification | Collection/API request | API response/browser rendering | Browser storage/cache/mobile future | Server log/error reporting | Audit log | Analytics | Notification/email/SMS/push | Export/download/object storage/backup | Lower env/test fixture | Screenshot/trace/video | Support/admin/partner | Retention/deletion-correction |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| PUBLIC | ALLOWED | ALLOWED | ALLOWED | ALLOWED | MINIMIZED | ALLOWED | ALLOWED | ALLOWED | ALLOWED | ALLOWED | ALLOWED | Business correction. |
| INTERNAL | MINIMIZED | CONDITIONAL | REDACTED/MINIMIZED | MINIMIZED | MINIMIZED | AGGREGATED-ONLY | MINIMIZED | CONDITIONAL | SYNTHETIC-ONLY or scrubbed | REDACTED | Need-to-know | Owner correction. |
| CONFIDENTIAL | REQUIRES-APPROVAL | REDACTED/CONDITIONAL | PROHIBITED unless approved | REDACTED | MINIMIZED | AGGREGATED-ONLY | PROHIBITED by default | REQUIRES-APPROVAL | SYNTHETIC-ONLY | REDACTED | Restricted | Legal/business retention. |
| SENSITIVE-PERSONAL-DATA | Purpose-limited | MINIMIZED/authorized | PROHIBITED unless necessary | REDACTED | MINIMIZED | AGGREGATED-ONLY/de-identified | MINIMIZED | REQUIRES-APPROVAL | SYNTHETIC-ONLY | PROHIBITED for production | Need-to-know | Privacy retention/correction. |
| PROTECTED-CLINICAL-DATA | Clinically justified | Authorized care/patient policy | PROHIBITED unless approved | REDACTED; no clinical content | MINIMIZED | Approved de-identified only | MINIMIZED; avoid lock-screen content | Strict approval | SYNTHETIC-ONLY | PROHIBITED for production | Authorized support only | Amend/version finalized records. |
| AUTHENTICATION-SECRET | Necessary only | PROHIBITED except secret exchange controls | PROHIBITED except secure platform mechanism | PROHIBITED | Metadata only | PROHIBITED | PROHIBITED | PROHIBITED | SYNTHETIC-ONLY throwaway | PROHIBITED | Security-only | Rotate/revoke. |
| PAYMENT-DATA | Purpose-limited | MINIMIZED/tokenized | PROHIBITED unless approved | REDACTED/TOKENIZED | MINIMIZED | AGGREGATED-ONLY | Receipt-safe only | REQUIRES-APPROVAL | SYNTHETIC-ONLY | PROHIBITED for production | Finance need-to-know | Ledger/reconciliation correction. |
| PROVIDER-CREDENTIAL-DATA | Verification purpose | REDACTED/authorized | PROHIBITED | REDACTED | MINIMIZED | AGGREGATED-ONLY | Credential notices only | REQUIRES-APPROVAL | SYNTHETIC-ONLY | REDACTED | Credentialing need-to-know | Regulatory retention/amendment. |
| PROVIDER-IDENTITY-LOCATION-DATA | Server-side purpose | Pre-payment REDACTED except providerDisplayName; post-payment CONDITIONAL | Pre-payment PROHIBITED | Pre-payment REDACTED | MINIMIZED disclosure audit | Pre-payment PROHIBITED except aggregate | Pre-payment PROHIBITED except display name where approved | REQUIRES-APPROVAL | SYNTHETIC-ONLY | Pre-payment PROHIBITED | Authorized order only | Owner correction; disclosure incident if leaked. |
| REGULATORY-EVIDENCE | Evidence purpose | Restricted | PROHIBITED | Metadata only | MINIMIZED | AGGREGATED-ONLY | PROHIBITED | REQUIRES-APPROVAL | SYNTHETIC/scrubbed | REDACTED | Compliance/legal | Legal retention/amendment. |
| SECURITY-OPERATIONAL-DATA | Security/support purpose | MINIMIZED | PROHIBITED unless security feature | MINIMIZED | ALLOWED append-only | AGGREGATED-ONLY | Security alert minimum necessary | REQUIRES-APPROVAL | SYNTHETIC/scrubbed | REDACTED; no secrets | Security/support | Append/amend. |
| DEIDENTIFIED-OR-AGGREGATED-DATA | From approved sources | ALLOWED if approved | ALLOWED if no reidentification risk | ALLOWED | Derived audit only | ALLOWED | AGGREGATED-ONLY | CONDITIONAL | ALLOWED if synthetic/approved | ALLOWED if safe | Analytics consumer | Rebuild if source corrected. |

## Actor Access Summary

This summary does not replace `docs/security/access-intent-matrix.md` or `docs/security/payer-visibility-matrix.md`.

| Actor | Expected handling |
|---|---|
| Patient | Own clinical, payment, and fulfilment data according to policy; no other patient data. |
| Guardian | Scoped policy access only; not automatic for all data. |
| Clinical proxy | Scoped clinical authority only where granted. |
| Family payer | Funding visibility only; no full clinical record by default. |
| Diaspora sponsor | Sponsor/payment visibility only; no clinical access by default. |
| Employer administrator | Aggregate/minimum eligibility and billing data; no clinical notes. |
| HMO administrator | Eligibility/authorization/claim/remittance minimum necessary only. |
| Doctor | Treating-care clinical view; no unrelated patient/provider data. |
| Pharmacist | Prescription fulfilment view only; no full diagnosis unless approved. |
| Laboratory scientist | Diagnostic order/specimen/result workflow view only. |
| Hospital coordinator | Referral/emergency packet minimum necessary only. |
| Delivery participant | Delivery task data only; no diagnosis or full prescription unless policy requires minimum item info. |
| Platform support | Redacted support projection; cannot directly mutate another context storage. |
| Platform finance | Payment/ledger view; no consultation content by default. |
| Compliance | Evidence and audit view by approved purpose. |
| Security | Security logs/incidents; clinical data only when required and audited. |
| Auditor | Approved audit evidence only. |
| Analytics consumer | Aggregated/de-identified outputs only. |

## Pre-Payment Provider Matrix

| Field | Internal matching use | Pre-payment API | Pre-payment browser | Pre-payment logs | Pre-payment analytics | Pre-payment map request | Post-payment authorized order view | Other order | Other patient | Other tenant | Emergency hospital flow |
|---|---|---|---|---|---|---|---|---|---|---|---|
| providerDisplayName | ALLOWED | ALLOWED | ALLOWED | MINIMIZED | MINIMIZED if approved | PROHIBITED as map locator | ALLOWED | PROHIBITED | PROHIBITED | PROHIBITED | Not applicable to hospital guidance. |
| OpaqueSelectionToken | ALLOWED | ALLOWED if non-derivable | ALLOWED if non-derivable | TOKENIZED | TOKENIZED | PROHIBITED | ALLOWED for exact order | PROHIBITED | PROHIBITED | PROHIBITED | Not applicable. |
| Legal name | ALLOWED | PROHIBITED unless approved display field | PROHIBITED | REDACTED | PROHIBITED | PROHIBITED | CONDITIONAL | PROHIBITED | PROHIBITED | PROHIBITED | Separate hospital policy. |
| Facility/branch name | ALLOWED | PROHIBITED | PROHIBITED | REDACTED | PROHIBITED | PROHIBITED | CONDITIONAL | PROHIBITED | PROHIBITED | PROHIBITED | Separate hospital policy. |
| Facility/branch identifier | ALLOWED | PROHIBITED | PROHIBITED | REDACTED | PROHIBITED | PROHIBITED | CONDITIONAL | PROHIBITED | PROHIBITED | PROHIBITED | Separate hospital policy. |
| Address/address components | ALLOWED | PROHIBITED | PROHIBITED | REDACTED | PROHIBITED | PROHIBITED | CONDITIONAL | PROHIBITED | PROHIBITED | PROHIBITED | Emergency facility guidance allowed by safety policy. |
| Coordinates/map pin | ALLOWED | PROHIBITED | PROHIBITED | REDACTED | PROHIBITED | PROHIBITED | CONDITIONAL | PROHIBITED | PROHIBITED | PROHIBITED | Emergency facility guidance allowed by safety policy. |
| Distance/directions | ALLOWED | PROHIBITED | PROHIBITED | REDACTED | PROHIBITED | PROHIBITED | CONDITIONAL | PROHIBITED | PROHIBITED | PROHIBITED | Emergency facility guidance allowed by safety policy. |
| Contact details | ALLOWED | PROHIBITED | PROHIBITED | REDACTED | PROHIBITED | PROHIBITED | CONDITIONAL | PROHIBITED | PROHIBITED | PROHIBITED | Emergency facility guidance allowed by safety policy. |
| Photographs/external links | ALLOWED | PROHIBITED | PROHIBITED | REDACTED | PROHIBITED | PROHIBITED | CONDITIONAL | PROHIBITED | PROHIBITED | PROHIBITED | Separate hospital policy. |
| Pickup/collection instructions | ALLOWED | PROHIBITED | PROHIBITED | REDACTED | PROHIBITED | PROHIBITED | CONDITIONAL | PROHIBITED | PROHIBITED | PROHIBITED | Separate hospital policy. |
| Internal ranking/capability features | ALLOWED | PROHIBITED | PROHIBITED | REDACTED | AGGREGATED-ONLY | PROHIBITED | PROHIBITED unless needed by staff | PROHIBITED | PROHIBITED | PROHIBITED | Not applicable. |

## Notification Content Matrix

| Notification | Allowed content | Prohibited content |
|---|---|---|
| Appointment reminder | Time window, generic appointment label, safe link. | Diagnosis, full notes, unrelated payer/provider data. |
| Payment notification | Amount, status, order reference, safe receipt link. | Clinical note, raw payment credentials, pre-payment provider location. |
| Prescription availability notification | Generic availability status and safe link. | Medicine names on lock screen unless approved, provider address pre-payment. |
| Laboratory-result notification | Result-ready status and safe link. | Result values or critical content in unsecured notification. |
| Referral notification | Referral status and safe link. | Full referral packet in notification. |
| Emergency notification | Safety instruction and urgent contact path where approved. | Payment demands or marketplace comparison. |
| Sponsor approval request | Beneficiary/order amount/category summary. | Full clinical record or provider details pre-payment. |
| Employer eligibility notice | Eligibility/admin status. | Individual clinical details. |
| HMO authorization notice | Authorization status and reference. | Full clinical notes unless approved minimum claim support. |
| Delivery notification | Delivery status and safe link. | Diagnosis or unnecessary prescription detail. |
| Credential-expiry notice | Credential expiry/remediation status. | Patient data. |
| Security alert | Security event and recovery link. | Secrets, clinical record content. |

## Test and Browser Artifact Matrix

| Artifact | Handling |
|---|---|
| Synthetic patient data | ALLOWED in test; must be fake. |
| Synthetic provider data | ALLOWED; protected provider fields may exist only in controlled server-side synthetic seeds to prove non-disclosure. |
| Screenshots | SYNTHETIC-ONLY; must not contain production PHI or pre-payment protected provider details. |
| Traces | SYNTHETIC-ONLY; inspect for prohibited fields. |
| Videos | SYNTHETIC-ONLY; retain/redact by approved policy. |
| Console logs | No secrets, raw payment data, clinical content, or protected pre-payment provider data. |
| Network logs | Required for negative proof; synthetic only. |
| Accessibility snapshots | Must not contain protected provider details pre-payment. |
| Test reports | Synthetic/minimized; no protected provider fields from pre-payment flows. |
| Browser storage snapshots | Synthetic only; protected fields absent pre-payment. |
| Mock payloads | May include server-side protected synthetic fields only where needed to prove filtering; client fixtures must be sanitized. |
| Seed data | Synthetic only; no real providers, patients, payment instruments, or credentials. |

No production data may be copied into tests. Protected provider fields must not be exported to client fixtures, traces, screenshots, logs, reports, browser storage, or accessibility snapshots before payment.
