# NelyoHealth Data Classification Model

## Document Control

| Field | Value |
|---|---|
| Prompt | P00-06 |
| Complete Breakdown work packages | P00-07; P00-08 |
| Issue IDs | P00-DOM-001; P00-ARC-001 |
| Owner role | Security lead + privacy counsel |
| Review state | PROPOSED |
| Required reviewers | Privacy, security, clinical, finance, architecture, QA |
| Last updated | 2026-06-24 |
| Related decisions | REQ-DOM-008 through REQ-DOM-012; REQ-ARC-005; REQ-ARC-016 |

## Purpose

Define the classification model and handling precedence for NelyoHealth data before implementation begins.

## Classification Model

- Data may carry more than one classification tag.
- The strictest applicable handling rule controls.
- Field-level restrictions override document-level defaults.
- Data becoming visible to one actor does not make it public.
- Pre-payment `providerDisplayName` is an explicit field-level disclosure allowance.
- The `providerDisplayName` allowance does not make other provider identity or location fields pre-payment accessible.
- Test, browser, analytics, logs, notifications, and exports follow the same classification unless a stricter channel rule applies.

## Classification Definitions

| Classification | Definition | Examples | Typical owners | Authorized purposes | Default access | Collection | Storage | Encryption | Logging | Analytics | Notification | Export | Lower environment | Browser artifact | Retention | Deletion/correction | Incident implications | Required approval |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| PUBLIC | Approved information safe for public release. | Public marketing text. | Product/comms | Public communication. | Public after approval. | Minimized. | Normal integrity controls. | In transit. | Allowed. | Allowed. | Allowed. | Allowed. | Allowed. | Allowed. | Business policy. | Correct inaccurate public content. | Low unless misleading. | Product approval. |
| INTERNAL | Operational information not public. | Internal workflow labels, non-sensitive configuration. | Owning context | Operations and delivery. | Staff need-to-know. | Purpose-limited. | Access controlled. | In transit and at rest where supported. | Minimized. | Aggregated where useful. | Minimized. | Controlled. | Synthetic or scrubbed. | Redacted unless needed. | Business policy. | Correct by owning context. | Operational incident. | Owning context. |
| CONFIDENTIAL | Business-sensitive or partner-sensitive information. | Contracts, pricing policy, unpublished plans. | Product/legal/finance | Business operations. | Restricted. | Purpose-limited. | Restricted repository/storage. | At rest and transit. | Redacted. | Aggregated only. | Avoid. | Requires approval. | Synthetic/scrubbed. | Redacted. | Legal/business policy. | Correct under owner process. | Confidentiality incident. | Owner + legal where needed. |
| SENSITIVE-PERSONAL-DATA | Identifies or relates to a person outside clinical record content. | Name, phone, DOB, address, device ID, IP. | Identity/Patients | Identity, care operations, support. | Need-to-know. | Lawful/purpose-limited. | Access controlled. | At rest and transit. | Redacted/minimized. | De-identified or aggregated. | Minimum necessary. | Requires approval. | Synthetic-only unless approved. | No production artifacts. | Privacy schedule. | Correct through owner process. | Privacy incident. | Privacy/security. |
| PROTECTED-CLINICAL-DATA | Clinical information about a Patient. | History, diagnosis, note, prescription, lab result. | Clinical contexts | Care, clinical safety, authorized review. | Authorized care team/patient policy. | Clinically justified. | Strong access controls. | At rest and transit. | No clinical content in routine logs. | De-identified/approved only. | Minimum necessary; avoid lock screen content. | Strict approval. | Synthetic-only. | No production artifacts. | Clinical/legal policy. | Amend/version finalized records. | Clinical/privacy incident. | Clinical + privacy. |
| AUTHENTICATION-SECRET | Secrets used to authenticate or recover access. | Password hash, MFA secret, session token. | Identity and Access | Authentication/security. | System-only, tightly restricted. | Necessary only. | Secret storage controls. | Strong encryption/secret handling. | Never log. | Never. | Never. | Never. | Synthetic/throwaway only. | Never. | Security policy. | Rotate/revoke, not casually edit. | Security incident. | Security owner. |
| PAYMENT-DATA | Payment, ledger, claim, payout, or financial transaction data. | Amount, token, ledger entry, bank data. | Payments and Ledger/Claims | Payment, refund, settlement, reconciliation. | Finance need-to-know. | Payment purpose only. | PCI/payment policy where applicable. | At rest and transit; tokenized where applicable. | Redacted/tokenized. | Aggregated/minimized. | Receipts only with privacy rules. | Controlled. | Synthetic-only. | No production artifacts. | Finance/legal policy. | Correct via ledger/reconciliation rules. | Financial/security incident. | Finance + security/legal. |
| PROVIDER-CREDENTIAL-DATA | Provider, facility, practitioner credential evidence/status. | Licence, credential evidence, expiry, suspension. | Credentialing | Verification and eligibility. | Credentialing/ops need-to-know. | Verification purpose. | Restricted evidence storage. | At rest and transit. | Redacted. | Aggregate credential metrics. | Credential notices only. | Requires approval. | Synthetic or scrubbed. | Redacted. | Regulatory policy. | Correct with audit. | Regulatory/ops incident. | Credentialing + legal. |
| PROVIDER-IDENTITY-LOCATION-DATA | Provider identity/location data whose disclosure is controlled. | Legal name, branch, address, coordinates, distance, contacts, map data, pickup instructions. | Organizations/Facilities + Marketplace boundary | Matching, fulfilment after authorization, safety workflows. | Server-side/internal until authorized. | Purpose-limited. | Access controlled. | At rest and transit. | Redacted pre-payment. | Prohibited pre-payment; aggregate only. | Prohibited pre-payment except providerDisplayName allowance. | Controlled. | Synthetic-only. | Prohibited pre-payment artifacts. | Business/legal policy. | Correct through owning context. | Disclosure incident if leaked. | Security/privacy/legal. |
| REGULATORY-EVIDENCE | Evidence required for legal/regulatory proof. | Licence source, consent evidence, approval records. | Compliance/legal/owning context | Compliance, audit, review. | Restricted. | Evidence purpose. | Tamper-evident storage where needed. | At rest and transit. | Metadata only unless approved. | Aggregate compliance metrics. | Avoid. | Requires approval. | Synthetic/scrubbed. | Redacted. | Legal retention. | Correct by amendment/addendum. | Regulatory incident. | Legal/compliance. |
| SECURITY-OPERATIONAL-DATA | Security, audit, operational telemetry, incidents. | AuditEvent, IP, device, support case, security incident. | Security/Support/Consent and Audit | Security, audit, support, operations. | Role-restricted. | Purpose-limited. | Append-only where audit. | At rest and transit. | Allowed but minimized. | Aggregated/minimized. | Security alerts minimum necessary. | Controlled. | Synthetic/scrubbed. | Redacted; no secrets. | Security/legal policy. | Correct by append/amend. | Security/privacy incident. | Security owner. |
| DEIDENTIFIED-OR-AGGREGATED-DATA | Data transformed to reduce or remove identifiability. | Aggregate usage count, employer utilization aggregate. | Analytics | Metrics and reporting. | Approved analytics consumers. | From approved sources only. | Separate derived store. | At rest and transit. | Allowed if derived. | Primary use. | Aggregate only. | Controlled. | Synthetic or approved derived. | Allowed if no reidentification risk. | Analytics/privacy policy. | Recompute if source corrected. | Privacy incident if reidentifiable. | Privacy + analytics owner. |

## Data Examples

| Data example | Classification tags | Handling note |
|---|---|---|
| Person name | SENSITIVE-PERSONAL-DATA | Minimum necessary identity use. |
| Patient phone number | SENSITIVE-PERSONAL-DATA | Notifications require minimized content. |
| Date of birth | SENSITIVE-PERSONAL-DATA | Identity/clinical use only. |
| Government identity evidence | SENSITIVE-PERSONAL-DATA; REGULATORY-EVIDENCE | Restricted evidence storage. |
| Patient address | SENSITIVE-PERSONAL-DATA | Delivery/emergency only when authorized. |
| Emergency location | SENSITIVE-PERSONAL-DATA; SECURITY-OPERATIONAL-DATA | Emergency flow; not marketing/analytics. |
| Medical history | PROTECTED-CLINICAL-DATA | Authorized care only. |
| Allergy | PROTECTED-CLINICAL-DATA | Clinical record. |
| Diagnosis | PROTECTED-CLINICAL-DATA | Clinical record. |
| Consultation note | PROTECTED-CLINICAL-DATA | Finalized note amended/versioned. |
| Prescription | PROTECTED-CLINICAL-DATA | Pharmacy gets minimum fulfilment view only. |
| Laboratory order | PROTECTED-CLINICAL-DATA | Lab gets order-specific view. |
| Laboratory result | PROTECTED-CLINICAL-DATA | Verified/versioned result. |
| Clinical attachment | PROTECTED-CLINICAL-DATA | Strict access and export controls. |
| Payment amount | PAYMENT-DATA | Finance/order context only. |
| Payment token | PAYMENT-DATA; AUTHENTICATION-SECRET-like handling | Tokenized; never logged raw. |
| Raw card data | PAYMENT-DATA; AUTHENTICATION-SECRET-like handling | Not stored by domain unless approved compliant path. |
| Bank account data | PAYMENT-DATA | Restricted finance use. |
| Ledger entry | PAYMENT-DATA | Immutable accounting evidence. |
| HMO member number | SENSITIVE-PERSONAL-DATA; PAYMENT-DATA | Eligibility/claims only. |
| Employer identifier | SENSITIVE-PERSONAL-DATA or INTERNAL | Employer context; no clinical note access. |
| Practitioner licence | PROVIDER-CREDENTIAL-DATA; REGULATORY-EVIDENCE | Credentialing only. |
| Credential evidence | PROVIDER-CREDENTIAL-DATA; REGULATORY-EVIDENCE | Restricted evidence. |
| Pharmacy name | PROVIDER-IDENTITY-LOCATION-DATA | `providerDisplayName` may be pre-payment allowed; legal/branch names not by default. |
| Laboratory name | PROVIDER-IDENTITY-LOCATION-DATA | Same field-level allowance rule. |
| providerDisplayName | PROVIDER-IDENTITY-LOCATION-DATA with explicit pre-payment allowance | Allowed only in PrePaymentProviderOfferView. |
| Pharmacy address | PROVIDER-IDENTITY-LOCATION-DATA | Prohibited pre-payment. |
| Laboratory address | PROVIDER-IDENTITY-LOCATION-DATA | Prohibited pre-payment. |
| Branch identifier | PROVIDER-IDENTITY-LOCATION-DATA | Prohibited pre-payment. |
| Coordinates | PROVIDER-IDENTITY-LOCATION-DATA | Prohibited pre-payment and map requests. |
| Distance | PROVIDER-IDENTITY-LOCATION-DATA | Prohibited pre-payment. |
| Map pin | PROVIDER-IDENTITY-LOCATION-DATA | Prohibited pre-payment. |
| Contact details | PROVIDER-IDENTITY-LOCATION-DATA | Prohibited pre-payment. |
| Pickup instructions | PROVIDER-IDENTITY-LOCATION-DATA | Prohibited pre-payment. |
| Delivery address | SENSITIVE-PERSONAL-DATA | Delivery-only minimum necessary. |
| Audit event | SECURITY-OPERATIONAL-DATA plus affected class | Append-only; minimized. |
| IP address | SECURITY-OPERATIONAL-DATA; SENSITIVE-PERSONAL-DATA | Security use; analytics minimized. |
| Device identifier | SECURITY-OPERATIONAL-DATA; SENSITIVE-PERSONAL-DATA | Security/recovery use. |
| Session token | AUTHENTICATION-SECRET | Never log/export. |
| MFA secret | AUTHENTICATION-SECRET | Never expose. |
| Support ticket | SECURITY-OPERATIONAL-DATA plus any embedded data class | Redact embedded clinical/payment/provider data. |
| Complaint | SECURITY-OPERATIONAL-DATA; possible clinical/privacy | Route by severity. |
| Security incident | SECURITY-OPERATIONAL-DATA | Security owner. |
| De-identified usage count | DEIDENTIFIED-OR-AGGREGATED-DATA | Reidentification risk review. |
| Aggregate employer utilization | DEIDENTIFIED-OR-AGGREGATED-DATA | Must not identify patient or clinical details. |

## Provider Identity and Location Subclassification

| Field | Pre-payment handling | Post-payment handling | Notes |
|---|---|---|---|
| providerDisplayName | ALLOWED in approved pre-payment view | ALLOWED for authorized order | Field-level allowance only. |
| Legal organization name | PROHIBITED unless same as approved display and non-identifying | CONDITIONAL | May identify provider beyond display allowance. |
| Facility name | PROHIBITED | CONDITIONAL | May reveal exact facility. |
| Branch name | PROHIBITED | CONDITIONAL | Reveals selected branch. |
| Facility identifier | PROHIBITED if identifying | CONDITIONAL | Internal IDs must not leak. |
| Branch identifier | PROHIBITED | CONDITIONAL | Explicitly locked. |
| Address/address components | PROHIBITED | CONDITIONAL | Exact location. |
| Coordinates | PROHIBITED | CONDITIONAL | No pre-payment map-provider request. |
| Distance | PROHIBITED | CONDITIONAL | Approximate and exact distance prohibited. |
| Contact information | PROHIBITED | CONDITIONAL | Phone/email/web/social prohibited pre-payment. |
| Directions/map data | PROHIBITED | CONDITIONAL | No pins/routes pre-payment. |
| Photographs/external links | PROHIBITED | CONDITIONAL | May identify provider/location. |
| Pickup/collection instructions | PROHIBITED | CONDITIONAL | Released only if authorized after payment. |
| Service area | INTERNAL only before payment if derivable | CONDITIONAL | Must not allow inference. |
| Internal ranking features | SERVER-SIDE ONLY | SERVER-SIDE or minimized audit | Never client-facing pre-payment. |

Emergency hospital guidance follows a separate clinical safety policy and is not blocked by pharmacy/laboratory disclosure protection.

## De-identification and Aggregation

| Term | Meaning | Rule |
|---|---|---|
| Directly identifying data | Data that identifies a person or provider directly. | Treat as sensitive/protected. |
| Pseudonymized data | Identifiers replaced but linkable with key. | Still protected; not anonymous. |
| De-identified data | Reasonable removal/generalization of identifiers. | Requires privacy approval and risk review. |
| Aggregated data | Group-level data. | Must meet minimum-count/suppression policy before sharing. |
| Anonymous data | Data not reasonably reidentifiable. | Do not claim anonymity merely because names were removed. |
