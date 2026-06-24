# Provider Disclosure Threat Model

## Document Control

| Field | Value |
|---|---|
| Document title | Provider disclosure threat model |
| Codex prompt ID | P00-08 |
| Complete Breakdown work package | P00-10 Pharmacy and laboratory disclosure contract |
| Issue ID | P00-PRV-001 |
| Owner role | Security lead |
| Review state | PROPOSED |
| Required reviewers | Privacy counsel, Architecture lead, QA lead, Product owner, Finance owner, Pharmacy operations lead, Laboratory operations lead |
| Last updated | 2026-06-24 |

## Scope

This model covers pharmacy and laboratory identity/location disclosure, including provider identity, provider location, branch identity, contact data, selection token, order relationship, financial evidence, patient identity, tenant identity, authorization decision, audit trail, map payload, support-tool view, browser artifact, and partner payloads.

Hospital referral, urgent facility guidance, emergency facility guidance, emergency location handling, and clinically required transfer information are governed by separate clinical safety policies and must not be blocked by this marketplace disclosure model.

## Assets

- Provider identity
- Provider location
- Branch identity
- Contact data
- Selection token
- Order relationship
- Financial evidence
- Patient identity
- Tenant identity
- Authorization decision
- Audit trail
- Map payload
- Support-tool view
- Browser artifact

## Actors

- Legitimate patient
- Curious patient
- Malicious patient
- Sponsor
- Family payer
- Employer administrator
- HMO administrator
- Compromised account
- Support insider
- Platform administrator
- Provider staff
- Delivery participant
- External attacker
- Automated enumerator
- Third-party script
- Map provider
- Analytics provider
- Error-reporting provider
- Session-replay provider
- Compromised external partner

## Trust Boundaries

- Browser
- SSR or application frontend
- API or BFF
- Marketplace and Matching
- Organizations and Facilities
- Pharmacy Fulfilment
- Laboratory Operations
- Payments and Ledger
- Consent and Audit
- Map or geocoding adapter
- Analytics and telemetry
- Support and operations tools
- External partner adapters
- Test and CI artifact storage

## Threat Entry Schema

Each threat entry includes: threat ID, name, threat actor, asset, trust boundary, preconditions, attack path, expected impact, qualitative likelihood, qualitative severity, existing control, required mitigation, detection, audit signal, incident owner, future test IDs, residual risk, and approval status. No numeric risk score is introduced in P00-08.

## Required Threat Cases

| Threat ID | Name | Actor | Asset | Boundary | Preconditions | Attack path | Impact | Likelihood | Severity | Existing control | Required mitigation | Detection | Audit signal | Owner | Test | Residual risk | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| PRV-THR-001 | Inspect network response | Curious patient | Provider payload | Browser/API | Pre-payment offer exists | Inspect response body | Provider leak | Medium | High | Server projection | Allow-list serializer | API/browser assertions | DisclosureDenied if blocked | Security lead | PRV-TST-001 | None if filtered | APPROVED |
| PRV-THR-002 | Inspect page source | Curious patient | HTML/source | SSR/frontend | Pre-payment page rendered | View source | Provider leak | Medium | High | Server projection | Do not embed protected fields | Source scan | Leak incident | Security lead | PRV-TST-002 | None if filtered | APPROVED |
| PRV-THR-003 | Inspect hydration payload | Curious patient | Hydration data | SSR/frontend | SSR hydration exists | Read serialized payload | Provider leak | Medium | High | Server projection | Sanitize before serialization | Browser inspection | Leak incident | Security lead | PRV-TST-002 | None if filtered | APPROVED |
| PRV-THR-004 | Inspect JavaScript state | Curious patient | Client state | Browser | App state exists | Inspect devtools state | Provider leak | Medium | High | No full object | Store only allow-list | Browser inspection | Leak incident | Security lead | PRV-TST-016 | None if filtered | APPROVED |
| PRV-THR-005 | Inspect hidden DOM | Curious patient | DOM | Browser | Hidden elements exist | Inspect hidden nodes | Provider leak | Medium | High | No frontend hiding | No hidden protected DOM | DOM/a11y tests | Leak incident | Security lead | PRV-TST-025 | None if absent | APPROVED |
| PRV-THR-006 | Inspect accessibility tree | Curious patient | Accessibility tree | Browser | Screen-reader tree exists | Inspect a11y nodes | Provider leak | Medium | High | No hidden protected fields | A11y tree assertions | Accessibility tests | Leak incident | QA lead | PRV-TST-025 | None if absent | APPROVED |
| PRV-THR-007 | Read browser storage | Curious patient | Storage | Browser | Storage available | Read local/session/IndexedDB | Provider leak | Medium | High | Storage prohibition | Store no protected fields | Storage inspection | Leak incident | Security lead | PRV-TST-016 | None if absent | APPROVED |
| PRV-THR-008 | Read service-worker cache | Curious patient | Cache | Browser/service worker | Service worker exists | Inspect cache | Provider leak | Low | High | Cache prohibition | No protected service-worker cache | Cache tests | Leak incident | Security lead | PRV-TST-018 | None if absent | APPROVED |
| PRV-THR-009 | Use browser back after logout | Curious patient | Prior page | Browser | User logs out | Back navigation | Stale disclosure | Medium | High | Revalidation | Clear state/no-store | Browser test | SessionEnded | Security lead | PRV-TST-015 | Authorized screenshots remain residual | APPROVED |
| PRV-THR-010 | Open stale authenticated tab | Curious patient | Prior page | Browser | Session/context changed | Use stale tab | Stale disclosure | Medium | High | Recompute policy | Fresh authorization | Browser test | DisclosureRecomputed | Security lead | PRV-TST-015 | None if revalidated | APPROVED |
| PRV-THR-011 | Guess provider ID | Malicious patient | Provider identity | API | Provider IDs exist internally | Request by guessed ID | IDOR | Medium | High | No provider-ID endpoint | Order-based retrieval only | API negative test | WrongProviderAttempt | Security lead | PRV-TST-030 | None if unavailable | APPROVED |
| PRV-THR-012 | Guess facility ID | Malicious patient | Facility identity | API | Facility IDs exist internally | Request by guessed ID | IDOR | Medium | High | No facility-ID endpoint | Order-based retrieval only | API negative test | WrongProviderAttempt | Security lead | PRV-TST-030 | None if unavailable | APPROVED |
| PRV-THR-013 | Guess branch ID | Malicious patient | Branch identity | API | Branch IDs exist internally | Request by guessed ID | IDOR | Medium | High | No branch-ID endpoint | Order-based retrieval only | API negative test | WrongProviderAttempt | Security lead | PRV-TST-030 | None if unavailable | APPROVED |
| PRV-THR-014 | Guess order ID | Malicious patient | Order relationship | API | Orders exist | Request guessed order | IDOR | Medium | High | Actor/patient/tenant checks | Non-enumerable denial | API negative test | WrongOrderAttempt | Security lead | PRV-TST-030 | None if denied | APPROVED |
| PRV-THR-015 | Change order ID | Malicious patient | Order/provider binding | API | Own session exists | Modify order ID | Wrong-order disclosure | Medium | High | Exact-order policy | Match order/version/provider | API negative test | WrongOrderAttempt | Security lead | PRV-TST-005 | None if denied | APPROVED |
| PRV-THR-016 | Change patient context | Malicious patient | Patient identity | API/browser | Multiple contexts possible | Switch patient context | Cross-patient leak | Medium | Critical | Patient binding | Recompute context | API/browser test | WrongPatientAttempt | Security lead | PRV-TST-007 | None if denied | APPROVED |
| PRV-THR-017 | Change tenant context | Malicious patient | Tenant identity | API/browser | Tenant contexts exist | Switch tenant | Cross-tenant leak | Medium | Critical | Tenant binding | Recompute context | API/browser test | WrongTenantAttempt | Security lead | PRV-TST-008 | None if denied | APPROVED |
| PRV-THR-018 | Use another patient account | Compromised account | Patient/order | API/browser | Compromised credentials | Access another order | Cross-account leak | Medium | Critical | Actor binding | Exact authorization | API/browser test | WrongActorAttempt | Security lead | PRV-TST-006 | Account compromise residual | APPROVED |
| PRV-THR-019 | Use sponsor account | Sponsor | Provider details | API/browser | Sponsor paid | Retrieve details | Payer overreach | Medium | High | Payer separation | Deny unless delegated | Actor test | DisclosureDenied | Security lead | PRV-TST-006 | Policy approval pending | APPROVED |
| PRV-THR-020 | Use family administrator account | Family payer | Provider details | API/browser | Family payer exists | Retrieve member order | Payer overreach | Medium | High | Payer separation | Deny unless delegated | Actor test | DisclosureDenied | Security lead | PRV-TST-006 | Policy approval pending | APPROVED |
| PRV-THR-021 | Use employer administrator account | Employer admin | Provider details | API/browser | Employer relationship exists | Retrieve employee order | Employer overreach | Low | High | Role separation | Deny by default | Actor test | DisclosureDenied | Security lead | PRV-TST-006 | Deferred runtime | APPROVED |
| PRV-THR-022 | Use HMO administrator account | HMO admin | Provider details | API/browser | HMO relationship exists | Retrieve member order | HMO overreach | Low | High | Role separation | Deny by default | Actor test | DisclosureDenied | Security lead | PRV-TST-006 | Deferred runtime | APPROVED |
| PRV-THR-023 | Use support operator account | Support insider | Support view | Support tools | Support account exists | Browse unrelated order | Insider leak | Medium | High | Purpose access | Reason + order scope + audit | Support audit | SupportAccessDenied | Operations lead | PRV-TST-024 | Insider residual | APPROVED |
| PRV-THR-024 | Use platform administrator account | Platform admin | Provider details | Admin tools | Admin account exists | Browse order | Admin overreach | Medium | High | No universal access | Purpose-specific access | Admin audit | SupportAccessDenied | Security lead | PRV-TST-024 | Insider residual | APPROVED |
| PRV-THR-025 | Replay payment webhook | External attacker | Financial evidence | Payments | Webhook endpoint exists later | Replay callback | False eligibility | Medium | High | Evidence deferred | Authenticated idempotent callbacks | Integration tests | ReconciliationReview | Finance owner | PRV-TST-011 | P00-13 dependency | REQUIRES_APPROVAL |
| PRV-THR-026 | Forge client-side paid flag | Malicious patient | Disclosure decision | Browser/API | Client state exists | Set local paid flag | False unlock | Medium | High | Server policy | Ignore client paid flag | Browser/API test | DisclosureDenied | Security lead | PRV-TST-011 | None if ignored | APPROVED |
| PRV-THR-027 | Navigate directly to success route | Curious patient | Route state | Browser | Success route exists later | Direct route | False unlock | Medium | High | Server policy | No route-based unlock | Browser test | DisclosureDenied | Security lead | PRV-TST-029 | None if ignored | APPROVED |
| PRV-THR-028 | Reuse opaque selection token | Curious patient | Selection token | API | Token issued | Replay token | Wrong order/provider | Medium | High | Token scoping | Single purpose + expiry | API test | TokenDenied | Security lead | PRV-TST-010 | None if scoped | APPROVED |
| PRV-THR-029 | Tamper with selection token | Malicious patient | Selection token | API | Token issued | Modify token | Provider enumeration | Medium | High | Opaque token | Server validation | API test | TokenDenied | Security lead | PRV-TST-010 | Token crypto deferred | APPROVED |
| PRV-THR-030 | Race provider replacement against disclosure | Curious patient | Provider binding | Marketplace | Replacement in progress | Retrieve stale provider | Wrong provider leak | Medium | High | Provider version check | Recompute decision | Integration test | ProviderReplacement | Operations lead | PRV-TST-013 | Policy nuance pending | APPROVED |
| PRV-THR-031 | Race cancellation against disclosure | Curious patient | Order state | Marketplace | Cancellation in progress | Retrieve stale order | Wrong disclosure | Medium | High | Order version check | Recompute decision | Integration test | DisclosureRecomputed | Operations lead | PRV-TST-013 | None if recomputed | APPROVED |
| PRV-THR-032 | Use refunded transaction | Curious patient | Financial state | Payments | Refund exists | Retrieve details | Future access ambiguity | Medium | High | Recompute | REVIEW-REQUIRED/deny pending P00-13 | Integration test | RefundDisclosureReview | Finance owner | PRV-TST-012 | P00-13 dependency | REQUIRES_APPROVAL |
| PRV-THR-033 | Use reversed transaction | Curious patient | Financial state | Payments | Reversal exists | Retrieve details | Future access ambiguity | Medium | High | Recompute | REVIEW-REQUIRED/deny pending P00-13 | Integration test | RefundDisclosureReview | Finance owner | PRV-TST-012 | P00-13 dependency | REQUIRES_APPROVAL |
| PRV-THR-034 | Use chargeback transaction | Curious patient | Financial state | Payments | Chargeback exists | Retrieve details | Future access ambiguity | Medium | High | Recompute | REVIEW-REQUIRED/deny pending P00-13 | Integration test | RefundDisclosureReview | Finance owner | PRV-TST-012 | P00-13 dependency | REQUIRES_APPROVAL |
| PRV-THR-035 | Exploit reconciliation mismatch | Curious patient | Financial/order state | Payments/Marketplace | Mismatch exists | Retrieve during exception | Wrong disclosure | Medium | High | Reconciliation state | REVIEW-REQUIRED/deny | Integration test | ReconciliationReview | Finance owner | PRV-TST-011 | P00-13 dependency | REQUIRES_APPROVAL |
| PRV-THR-036 | Exploit shared CDN cache | External attacker | Cache | CDN | CDN exists later | Shared cache hit | Protected leak | Low | Critical | No-store | Disable shared cache | Cache test | Leak incident | Security lead | PRV-TST-017 | None if no-store | APPROVED |
| PRV-THR-037 | Exploit SSR cache | Curious patient | SSR cache | SSR | SSR cache exists | Cache hit | Protected leak | Medium | High | No-store/private | Context-aware cache bypass | Cache test | Leak incident | Security lead | PRV-TST-017 | None if no-store | APPROVED |
| PRV-THR-038 | Exploit browser cache | Curious patient | Browser cache | Browser | Browser cached page | Open stale page | Protected leak | Medium | High | No-store | Clear/revalidate | Cache test | SessionEnded | Security lead | PRV-TST-017 | Authorized screenshots residual | APPROVED |
| PRV-THR-039 | Exploit service-worker cache | Curious patient | Service-worker cache | Browser | Service worker exists | Cache read | Protected leak | Low | High | Cache prohibition | Do not cache protected payload | Cache test | Leak incident | Security lead | PRV-TST-018 | None if absent | APPROVED |
| PRV-THR-040 | Infer location from map requests | Curious patient | Map payload | Map adapter | Map code exists | Inspect map request | Location leak | Medium | High | No pre-payment map call | Block provider map request pre-payment | Browser/network test | MapDenied | Security lead | PRV-TST-019 | None if absent | APPROVED |
| PRV-THR-041 | Infer location from route request | Curious patient | Route payload | Map adapter | Route code exists | Inspect route request | Location leak | Medium | High | No route before allow | Route only after ALLOW | Browser/network test | MapDenied | Security lead | PRV-TST-019 | Map vendor residual after allow | APPROVED |
| PRV-THR-042 | Infer location from viewport or map bounds | Curious patient | Map bounds | Browser/map | Map viewport exists | Inspect bounds | Location inference | Medium | High | No provider bounds | Generic non-identifying visual only | Browser test | MapDenied | Security lead | PRV-TST-019 | None if generic | APPROVED |
| PRV-THR-043 | Infer location from distance | Curious patient | Distance | Browser/API | Distance exists | Compare proximity | Location inference | Medium | High | Distance denied | No distance/bearing | Contract test | Leak incident | Security lead | PRV-TST-001 | None if absent | APPROVED |
| PRV-THR-044 | Infer location from opening hours | Curious patient | Branch metadata | API/browser | Hours exist | Match hours externally | Branch inference | Low | Medium | Hours denied pre-payment | Generalized window only | Contract test | Leak incident | Security lead | PRV-TST-001 | Residual display-name lookup | APPROVED |
| PRV-THR-045 | Infer location from branch name | Curious patient | Display name | Browser | Branch text in name | Search branch | Location inference | Medium | High | Display-name validation | Ambiguous names require approval | Contract test | DisplayNameReview | Privacy counsel | PRV-TST-001 | External lookup residual | REQUIRES_APPROVAL |
| PRV-THR-046 | Infer location from image metadata | Curious patient | Image metadata | Browser | Image shown | Inspect metadata | Location leak | Low | High | Photos denied | No photos/logos with metadata pre-payment | Contract test | Leak incident | Security lead | PRV-TST-001 | None if absent | APPROVED |
| PRV-THR-047 | Infer location from URL or referrer | Third party | URL/referrer | Browser/external | URL includes data | Inspect URL/referrer | Location leak | Medium | High | URL prohibition | No protected URL state | Browser test | Leak incident | Security lead | PRV-TST-016 | None if absent | APPROVED |
| PRV-THR-048 | Read analytics payload | Analytics provider | Analytics event | Telemetry | Analytics exists later | Inspect event | Provider leak | Medium | High | Minimization | Analytics allow-list | Observability test | TelemetryPurgeReview | Privacy counsel | PRV-TST-020 | Vendor policy pending | APPROVED |
| PRV-THR-049 | Read session-replay payload | Replay provider | Replay artifact | Telemetry | Replay exists later | Replay page | Provider leak | Medium | High | Replay masking/disable | Disable/mask disclosure surfaces | Observability test | TelemetryPurgeReview | Privacy counsel | PRV-TST-022 | Policy pending | REQUIRES_APPROVAL |
| PRV-THR-050 | Read error-reporting payload | Error provider | Error payload | Telemetry | Error occurs | Inspect raw payload | Provider leak | Medium | High | Error minimization | Strip payloads | Observability test | TelemetryPurgeReview | Security lead | PRV-TST-021 | None if filtered | APPROVED |
| PRV-THR-051 | Read console output | Curious patient | Console log | Browser | Debug log exists | Inspect console | Provider leak | Medium | High | Console logging prohibition | No contract payload logs | Browser test | Leak incident | Security lead | PRV-TST-023 | None if absent | APPROVED |
| PRV-THR-052 | Read application logs | Support insider | Logs | Observability | Logs exist | Search logs | Provider leak | Medium | High | Structured allow-list | Minimize location details | Log inspection | TelemetryPurgeReview | Security lead | PRV-TST-023 | Retention pending | APPROVED |
| PRV-THR-053 | Read browser trace | QA/support | Browser artifact | Test storage | Trace exists | Open trace | Provider leak | Medium | High | Synthetic-only | Redact/control artifacts | Artifact test | TelemetryPurgeReview | QA lead | PRV-TST-023 | Retention pending | REQUIRES_APPROVAL |
| PRV-THR-054 | Read screenshot or video artifact | QA/support | Browser artifact | Test storage | Artifact exists | View artifact | Provider leak | Medium | High | Synthetic-only | Sensitive retention controls | Artifact test | TelemetryPurgeReview | QA lead | PRV-TST-023 | Authorized screenshots residual | REQUIRES_APPROVAL |
| PRV-THR-055 | Exploit GraphQL overfetching if later used | Malicious patient | GraphQL response | API | GraphQL later exists | Select protected fields | Provider leak | Medium | High | Same contract applies | Schema allow-list + tests | API test | Leak incident | Security lead | PRV-TST-032 | GraphQL deferred | APPROVED |
| PRV-THR-056 | Exploit full-object serialization | Developer error | Provider object | Backend | Mapper exists | Serialize full object | Provider leak | Medium | Critical | Projection boundary | Allow-list serializer | Contract regression | Leak incident | Architecture lead | PRV-TST-032 | None if tested | APPROVED |
| PRV-THR-057 | Exploit object spread or mapper default | Developer error | Provider object | Backend/frontend | Mapper exists | Spread object | Provider leak | Medium | Critical | Separate resource rule | Reject object spread | Contract regression | Leak incident | Architecture lead | PRV-TST-032 | None if tested | APPROVED |
| PRV-THR-058 | Exploit unreviewed new contract field | Developer error | Contract field | Governance | New field added | Add risky field | Provider leak | Medium | High | Field gate | Required review/test update | Contract test | ContractRollback | Product owner | PRV-TST-032 | Governance risk | APPROVED |
| PRV-THR-059 | Exploit support export | Support insider | Export | Support tools | Export exists later | Export payload | Provider leak | Medium | High | Purpose access | Export policy/redaction | Support test | SupportAccessDenied | Operations lead | PRV-TST-024 | Policy pending | REQUIRES_APPROVAL |
| PRV-THR-060 | Exploit order-history export | Patient/support | Export | Product/support | History exists later | Export order | Over-retention | Medium | High | Recompute policy | Order-history retention rule | Contract test | DisclosureRecomputed | Privacy counsel | PRV-TST-024 | Retention pending | REQUIRES_APPROVAL |
| PRV-THR-061 | Exploit print or download function | Patient/support | Print/export | Browser/product | Print exists later | Print protected view | Uncontrolled copy | Medium | Medium | Policy pending | Print/export review | Product test | DisclosureAllowed | Privacy counsel | PRV-TST-024 | Authorized copy residual | REQUIRES_APPROVAL |
| PRV-THR-062 | Exploit partner payload passthrough | Partner/system | Partner payload | Adapter/API | Partner sends full data | Pass through to client | Provider leak | Medium | Critical | Boundary filtering | Adapter allow-list | Integration test | Leak incident | Security lead | PRV-TST-033 | Partner risk | APPROVED |
| PRV-THR-063 | Exploit source maps or embedded fixtures | Developer/attacker | Source/test fixture | Build/test | Fixture exists | Inspect build/artifact | Provider leak | Medium | High | Synthetic-only | No protected client fixtures | Artifact test | Leak incident | QA lead | PRV-TST-032 | None if absent | APPROVED |
| PRV-THR-064 | Use search-engine cache or preview metadata | External search | Metadata | Search/indexing | Page indexed | Search preview | Provider leak | Low | High | Auth + no index | No metadata/sitemap/previews | Search test | Leak incident | Security lead | PRV-TST-034 | Search controls supplemental | APPROVED |
| PRV-THR-065 | Abuse providerDisplayName for independent external lookup | Curious patient | Display name | Outside platform | Name visible | Search externally | External discovery | High | Medium | Name allowed by rule | Do not add metadata | Threat rehearsal | None unless platform added data | Product owner | PRV-TST-035 | Inherent residual | APPROVED |

## Abuse Cases

| Abuse case | Narrative | Required control | Test reference |
|---|---|---|---|
| IDOR against post-payment endpoint | Actor changes order ID or context to retrieve another patient's selected provider details. | Exact actor, patient, tenant, order, provider, version, and policy binding. | PRV-TST-005 |
| Forged client payment success | Browser navigates to success route or sets a client paid flag. | Server-side financial evidence only; route and client flags ignored. | PRV-TST-011 |
| Payment-webhook replay | Duplicate or forged callback attempts to create disclosure eligibility. | Authenticated idempotent callbacks; P00-13 evidence still required. | PRV-TST-011 |
| Shared-cache disclosure | Protected view is served to another actor from CDN, SSR, browser, or service-worker cache. | Private no-store responses and context revalidation. | PRV-TST-017 |
| Provider-coordinate leak through map requests | Pre-payment map component sends provider coordinates or bounds. | No provider map call before authorization. | PRV-TST-019 |
| Analytics or session-replay leak | Payload records address, coordinates, branch, or route. | Telemetry allow-list and masking/disablement on disclosure surfaces. | PRV-TST-020, PRV-TST-022 |
| Sponsor attempting access | Sponsor who funded tries to retrieve pharmacy/lab details. | Funding does not grant provider-detail or clinical access. | PRV-TST-006 |
| Support insider browsing unrelated orders | Support user opens arbitrary order without purpose. | Purpose-specific order access, reason capture, audit, denial by default. | PRV-TST-024 |
| Provider replacement race | Provider changes while stale authorization is reused. | Fresh policy decision with selected provider version/replacement status. | PRV-TST-013 |
| Pre-payment provider object serialized | Mapper spreads full provider into quote. | Contract regression test and allow-list serializer. | PRV-TST-032 |
| New frontend field without privacy review | Pre-payment field reveals branch, distance, hours, or locality. | Field expansion gate and negative test update. | PRV-TST-032 |

## Residual Risk Register

| Residual risk | Status | Control |
|---|---|---|
| Provider-name external lookup | ACCEPTED AS RESIDUAL OF LOCKED NAME DISPLAY | Do not add location or metadata that makes lookup easier |
| Authorized user screenshots | RESIDUAL | Minimize disclosure before authorization and control platform artifacts |
| Authorized user sharing | RESIDUAL | Audit disclosure and show minimum necessary details |
| External map provider after legitimate disclosure | REQUIRES_APPROVAL | Send minimum selected-order data only; vendor policy later |
| Operational staff with legitimate order access | REQUIRES_APPROVAL | Purpose-specific access, audit, minimization |
| Legal disclosure requirements not yet confirmed | REQUIRES LEGAL AND REGULATORY REVIEW | OQ-00-152 and OQ-00-153 |

## Incident Triggers

- Privacy incident: protected detail reaches a patient-facing pre-payment channel, client artifact, telemetry, support view, or unauthorized actor.
- Security incident: IDOR, enumeration, forged payment, token abuse, cache disclosure, or support misuse is detected.
- Support case: patient cannot access details after an approved allow decision, provider replacement is unresolved, or payment state is inconsistent.
- Clinical or safety review: emergency or urgent guidance is blocked by marketplace/payment state.
- Contract rollback: unreviewed field expansion appears in MarketplaceQuoteView.
- Feature disablement: systemic leak risk is found in maps, telemetry, cache, serialization, or partner passthrough.
- Cache purge: any shared or service-worker cache may hold protected provider details.
- Telemetry purge review: analytics, error, replay, trace, screenshot, video, or report artifacts include protected details.
- Legal notification review: counsel determines notification or regulator engagement may be required.


## P00-13 Finance Alignment

- `OrderFundingSecured` is the PROPOSED finance input to provider-disclosure evaluation, not an approved implementation event and not a provider-detail response.
- `ProviderDetailDisclosureDecision` remains the separate access authority and must evaluate exact order, selected provider, actor, patient, tenant, current authorization, no-store handling, deny-by-default behavior, and policy version server-side.
- `ProviderDetailDisclosureEligibilityEstablished` remains separate from payment, ledger, browser success, redirect, webhook, authorization, settlement, claim, remittance, and payout state.
- Refund, reversal, chargeback, cancellation, provider replacement, reconciliation exception, and legal/safety/support purpose changes trigger recomputation; final post-refund retrieval outcomes remain approval-gated.
- No finance event, ledger entry, analytics event, log, trace, screenshot, browser payload, map request, cache entry, hidden DOM, or accessibility tree may contain protected pre-payment provider details.
- P00-12 legal conflict around provider display and minimum disclosure remains unresolved and launch-gated; P00-13 does not alter the locked providerDisplayName-only pre-payment rule.
