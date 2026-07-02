import { describe, expect, it } from "vitest";
import { createPaymentDraft } from "./payments.js";
import { createRefundDraft } from "./refunds.js";
import {
  handleAuthenticationDecisionRoute,
  handleAuthorizationPolicyDecisionRoute,
  handlePaymentTransitionRoute,
  handleProviderDisclosureEligibilityRoute,
  handleRefundTransitionRoute,
  handleTenancyAccessDecisionRoute
} from "./runtime-routes.js";
import { createAuthenticationDraft } from "./authentication.js";
import { createTenancyAccessDraft } from "./tenancy.js";

function createPolicyRouteInput(overrides: Record<string, unknown> = {}) {
  return {
    decisionRequestId: "policy-route-base",
    actorId: "actor-route-base",
    actorRole: "guardian",
    actorType: "guardian",
    organizationId: "tenant-route-1",
    patientId: "patient-route-1",
    relationshipType: "guardian",
    relationship: {
      relationshipId: "rel-route-1",
      relationshipType: "guardian",
      actorId: "actor-route-base",
      patientId: "patient-route-1",
      organizationId: "tenant-route-1",
      lifecycle: {
        status: "active",
        verificationMethod: "legal-document",
        effectiveDate: "2026-01-01T00:00:00.000Z",
        expiryDate: "2027-01-01T00:00:00.000Z",
        permittedActions: ["read", "update-consent"],
        supportingDocuments: [],
        reviewHistory: []
      }
    },
    requestedResource: "clinical-record-summary",
    requestedConsentDomains: ["telemedicine", "provider-data-sharing"],
    consent: {
      consentId: "consent-route-base",
      patientId: "patient-route-1",
      organizationId: "tenant-route-1",
      currentVersion: 1,
      updatedAt: "2026-07-10T12:09:00.000Z",
      versions: [
        {
          version: 1,
          status: "granted",
          grantedDomains: [
            "telemedicine",
            "provider-data-sharing",
            "sponsor-participation",
            "family-participation",
            "caregiver-participation",
            "consultation-participants",
            "recording",
            "marketing",
            "research",
            "cross-border-processing",
            "emergency-access"
          ],
          effectiveDate: "2026-01-01T00:00:00.000Z",
          expiryDate: "2027-01-01T00:00:00.000Z",
          createdAt: "2026-01-01T00:00:00.000Z",
          createdByActorId: "patient-route-1"
        }
      ]
    },
    requestedAction: "read",
    purpose: "care-delivery",
    consentStatus: "granted",
    relationshipStatus: "active",
    sessionStatus: "active",
    activeEncounter: true,
    emergencyStatus: "none",
    sameTenant: true,
    sponsorPaymentOnly: false,
    requiresRelationship: true,
    breakGlassRequested: false,
    impersonationAttempt: false,
    auditEventEditAttempt: false,
    evaluatedAt: "2026-07-10T12:10:00.000Z",
    ...overrides
  };
}

describe("runtime route handlers", () => {
  it("returns an envelope for valid payment transitions", () => {
    const response = handlePaymentTransitionRoute({
      requestId: "req-1",
      correlationId: "corr-1",
      input: {
        payment: createPaymentDraft({
          paymentId: "payment-route-1",
          orderId: "order-route-1",
          status: "quoted",
          amount: "5000",
          currency: "NGN",
          authorizedAt: null,
          settledAt: null
        }),
        toStatus: "initiated",
        transitionedAt: "2026-07-10T09:00:00.000Z"
      }
    });

    expect(response.data).toMatchObject({
      paymentId: "payment-route-1",
      status: "initiated"
    });
    expect(response.errors).toEqual([]);
  });

  it("returns an error envelope for invalid payment transitions", () => {
    const response = handlePaymentTransitionRoute({
      requestId: "req-2",
      correlationId: "corr-2",
      input: {
        payment: createPaymentDraft({
          paymentId: "payment-route-2",
          orderId: "order-route-2",
          status: "quoted",
          amount: "5000",
          currency: "NGN",
          authorizedAt: null,
          settledAt: null
        }),
        toStatus: "settled",
        transitionedAt: "2026-07-10T09:00:00.000Z"
      }
    });

    expect(response.data).toBeNull();
    expect(response.errors).toMatchObject([
      {
        code: "PAYMENT_TRANSITION_FAILED"
      }
    ]);
    expect(response.meta).toMatchObject({
      operationTag: "payment.transition",
      decisionReasonTag: "transition-denied"
    });
  });

  it("returns an error envelope for invalid refund transitions", () => {
    const response = handleRefundTransitionRoute({
      requestId: "req-2b",
      correlationId: "corr-2b",
      input: {
        refund: createRefundDraft({
          refundId: "refund-route-2",
          paymentId: "payment-route-2",
          orderId: "order-route-2",
          status: "requested",
          amount: "5000",
          currency: "NGN",
          completedAt: null
        }),
        toStatus: "completed",
        transitionedAt: "2026-07-10T09:05:00.000Z"
      }
    });

    expect(response.data).toBeNull();
    expect(response.errors).toMatchObject([
      {
        code: "REFUND_TRANSITION_FAILED"
      }
    ]);
    expect(response.meta).toMatchObject({
      operationTag: "refund.transition",
      decisionReasonTag: "transition-denied"
    });
  });

  it("returns an envelope for valid refund transitions", () => {
    const response = handleRefundTransitionRoute({
      requestId: "req-3",
      correlationId: "corr-3",
      input: {
        refund: createRefundDraft({
          refundId: "refund-route-1",
          paymentId: "payment-route-1",
          orderId: "order-route-1",
          status: "requested",
          amount: "5000",
          currency: "NGN",
          completedAt: null
        }),
        toStatus: "eligibility-review",
        transitionedAt: "2026-07-10T10:00:00.000Z"
      }
    });

    expect(response.data).toMatchObject({
      refundId: "refund-route-1",
      status: "eligibility-review"
    });
    expect(response.errors).toEqual([]);
  });

  it("returns disclosure eligibility envelope with deterministic decision", () => {
    const response = handleProviderDisclosureEligibilityRoute({
      requestId: "req-4",
      correlationId: "corr-4",
      input: {
        orderId: "order-route-4",
        providerDisplayName: "Provider Route",
        paymentStatus: "authorized",
        hasAuthorization: true,
        sameTenant: true,
        evaluatedAt: "2026-07-10T11:00:00.000Z"
      }
    });

    expect(response.data).toMatchObject({
      orderId: "order-route-4",
      status: "not-eligible",
      reasonCode: "payment-not-settled"
    });
    expect(response.errors).toEqual([]);
  });

  it("returns authentication decision envelope for provider login challenge", () => {
    const response = handleAuthenticationDecisionRoute({
      requestId: "req-5",
      correlationId: "corr-5",
      input: {
        authentication: createAuthenticationDraft({
          authRequestId: "auth-route-1",
          accountId: "account-route-1",
          personId: "person-route-1",
          tenantId: "tenant-route-1",
          intent: "login",
          mode: "password",
          tier: "provider",
          loginIdentifier: "provider@example.com",
          requestedAt: "2026-07-10T12:00:00.000Z"
        }),
        loginAttemptCountInWindow: 0,
        maxLoginAttempts: 5,
        passwordVerified: true,
        otpVerified: true,
        mfaVerified: false,
        trustedDevicePresent: false,
        markDeviceTrusted: true,
        accountRecoveryApproved: false,
        phoneChangeOtpVerified: false,
        riskSignals: {
          unfamiliarDevice: false,
          impossibleTravel: false,
          ipReputation: "low"
        },
        evaluatedAt: "2026-07-10T12:01:00.000Z"
      }
    });

    expect(response.data).toMatchObject({
      status: "challenge-required",
      reasonCode: "mfa-required"
    });
    expect(response.errors).toEqual([]);
    expect(response.meta).toMatchObject({
      operationTag: "authentication.decision.evaluate",
      decisionReasonTag: "mfa-required"
    });
  });

  it("returns tenancy access decision envelope for tenant switch challenge", () => {
    const response = handleTenancyAccessDecisionRoute({
      requestId: "req-6",
      correlationId: "corr-6",
      input: {
        access: createTenancyAccessDraft({
          accessRequestId: "access-route-1",
          accountId: "account-route-1",
          activeTenantId: "tenant-1",
          requestedTenantId: "tenant-2",
          requiredRoleCode: "doctor",
          allowTenantSwitch: false,
          memberships: [
            {
              membershipId: "membership-route-1",
              tenantId: "tenant-2",
              status: "active",
              roleScopes: [
                {
                  roleCode: "doctor",
                  status: "active",
                  facilityIds: ["facility-2"]
                }
              ]
            }
          ],
          evaluatedAt: "2026-07-10T12:05:00.000Z"
        })
      }
    });

    expect(response.data).toMatchObject({
      status: "challenge-required",
      reasonCode: "tenant-switch-required"
    });
    expect(response.errors).toEqual([]);
    expect(response.meta).toMatchObject({
      operationTag: "tenancy.access.evaluate",
      decisionReasonTag: "tenant-switch-required"
    });
  });

  it("returns authorization policy envelope for revoked consent", () => {
    const response = handleAuthorizationPolicyDecisionRoute({
      requestId: "req-7",
      correlationId: "corr-7",
      input: {
        decisionRequestId: "policy-route-1",
        actorId: "actor-route-1",
        actorRole: "guardian",
        actorType: "guardian",
        organizationId: "tenant-route-1",
        patientId: "patient-route-1",
        relationshipType: "guardian",
        requestedResource: "clinical-record-summary",
        requestedConsentDomains: ["telemedicine", "provider-data-sharing"],
        consent: {
          consentId: "consent-route-1",
          patientId: "patient-route-1",
          organizationId: "tenant-route-1",
          currentVersion: 1,
          updatedAt: "2026-07-10T12:09:00.000Z",
          versions: [
            {
              version: 1,
              status: "revoked",
              grantedDomains: ["telemedicine", "provider-data-sharing"],
              effectiveDate: "2026-01-01T00:00:00.000Z",
              revokedAt: "2026-07-10T12:00:00.000Z",
              revokedByActorId: "patient-route-1",
              revocationReason: "withdrawn",
              createdAt: "2026-01-01T00:00:00.000Z",
              createdByActorId: "patient-route-1"
            }
          ]
        },
        requestedAction: "read",
        purpose: "care-delivery",
        consentStatus: "revoked",
        relationshipStatus: "active",
        sessionStatus: "active",
        activeEncounter: true,
        emergencyStatus: "none",
        sameTenant: true,
        sponsorPaymentOnly: false,
        requiresRelationship: true,
        breakGlassRequested: false,
        impersonationAttempt: false,
        auditEventEditAttempt: false,
        evaluatedAt: "2026-07-10T12:10:00.000Z"
      }
    });

    expect(response.data).toMatchObject({
      status: "denied",
      reasonCode: "consent-revoked",
      auditIntent: {
        appendOnly: true
      }
    });
    expect(response.errors).toEqual([]);
    expect(response.meta).toMatchObject({
      operationTag: "authorization.policy.evaluate",
      decisionReasonTag: "consent-revoked"
    });
  });

  it("returns authorization policy envelope for stale consent version", () => {
    const response = handleAuthorizationPolicyDecisionRoute({
      requestId: "req-8",
      correlationId: "corr-8",
      input: {
        decisionRequestId: "policy-route-2",
        actorId: "actor-route-2",
        actorRole: "guardian",
        actorType: "guardian",
        organizationId: "tenant-route-1",
        patientId: "patient-route-1",
        relationshipType: "guardian",
        requestedResource: "clinical-record-summary",
        requestedConsentDomains: ["telemedicine"],
        consent: {
          consentId: "consent-route-2",
          patientId: "patient-route-1",
          organizationId: "tenant-route-1",
          currentVersion: 99,
          updatedAt: "2026-07-10T12:09:00.000Z",
          versions: [
            {
              version: 1,
              status: "granted",
              grantedDomains: ["telemedicine"],
              effectiveDate: "2026-01-01T00:00:00.000Z",
              createdAt: "2026-01-01T00:00:00.000Z",
              createdByActorId: "patient-route-1"
            }
          ]
        },
        requestedAction: "read",
        purpose: "care-delivery",
        consentStatus: "granted",
        relationshipStatus: "active",
        sessionStatus: "active",
        activeEncounter: true,
        emergencyStatus: "none",
        sameTenant: true,
        sponsorPaymentOnly: false,
        requiresRelationship: false,
        breakGlassRequested: false,
        impersonationAttempt: false,
        auditEventEditAttempt: false,
        evaluatedAt: "2026-07-10T12:11:00.000Z"
      }
    });

    expect(response.data).toMatchObject({
      status: "denied",
      reasonCode: "consent-version-stale"
    });
    expect(response.errors).toEqual([]);
    expect(response.meta).toMatchObject({
      operationTag: "authorization.policy.evaluate",
      decisionReasonTag: "consent-version-stale"
    });
  });

  it("covers all protected policy endpoints with at least one allowed matrix combination", () => {
    const allowedCases = [
      {
        actorRole: "guardian",
        actorType: "guardian",
        requestedResource: "clinical-record-summary",
        requestedAction: "read",
        purpose: "care-delivery"
      },
      {
        actorRole: "sponsor",
        actorType: "sponsor",
        requestedResource: "billing-ledger",
        requestedAction: "read-billing",
        purpose: "payment-operations",
        requiresRelationship: false,
        relationshipType: "none",
        relationshipStatus: "none",
        relationship: undefined,
        requestedConsentDomains: []
      },
      {
        actorRole: "hmo",
        actorType: "sponsor",
        requestedResource: "payment-status",
        requestedAction: "read-payment-status",
        purpose: "payment-operations",
        requiresRelationship: false,
        relationshipType: "none",
        relationshipStatus: "none",
        relationship: undefined,
        requestedConsentDomains: []
      },
      {
        actorRole: "support",
        actorType: "support",
        requestedResource: "support-case",
        requestedAction: "read-support",
        purpose: "support-operations",
        requiresRelationship: false,
        relationshipType: "none",
        relationshipStatus: "none",
        relationship: undefined,
        requestedConsentDomains: []
      },
      {
        actorRole: "organization-admin",
        actorType: "admin",
        requestedResource: "tenant-membership",
        requestedAction: "manage-tenant-membership",
        purpose: "tenant-administration",
        requiresRelationship: false,
        relationshipType: "none",
        relationshipStatus: "none",
        relationship: undefined,
        requestedConsentDomains: []
      },
      {
        actorRole: "caregiver",
        actorType: "caregiver",
        requestedResource: "consultation-room",
        requestedAction: "read",
        purpose: "care-delivery"
      },
      {
        actorRole: "patient",
        actorType: "patient",
        requestedResource: "consent-preferences",
        requestedAction: "update-consent",
        purpose: "consent-management",
        relationshipType: "none",
        relationshipStatus: "none",
        relationship: undefined,
        requiresRelationship: false,
        requestedConsentDomains: []
      }
    ];

    for (const inputCase of allowedCases) {
      const response = handleAuthorizationPolicyDecisionRoute({
        requestId: "req-policy-allowed",
        correlationId: "corr-policy-allowed",
        input: createPolicyRouteInput(inputCase)
      });

      expect(response.data).toMatchObject({
        status: "allowed",
        reasonCode: "allowed"
      });
      expect(response.meta).toMatchObject({
        operationTag: "authorization.policy.evaluate",
        decisionReasonTag: "allowed"
      });
    }
  });

  it("denies unmapped combinations for protected endpoints by deterministic deny-default", () => {
    const denyCases = [
      {
        actorRole: "payer",
        actorType: "sponsor",
        requestedResource: "clinical-record-summary",
        requestedAction: "read",
        purpose: "care-delivery"
      },
      {
        actorRole: "guardian",
        actorType: "guardian",
        requestedResource: "billing-ledger",
        requestedAction: "read-billing",
        purpose: "payment-operations"
      },
      {
        actorRole: "support",
        actorType: "support",
        requestedResource: "tenant-membership",
        requestedAction: "manage-tenant-membership",
        purpose: "tenant-administration",
        requiresRelationship: false,
        relationshipType: "none",
        relationshipStatus: "none",
        relationship: undefined,
        requestedConsentDomains: []
      },
      {
        actorRole: "sponsor",
        actorType: "sponsor",
        requestedResource: "support-case",
        requestedAction: "read-support",
        purpose: "support-operations",
        requiresRelationship: false,
        relationshipType: "none",
        relationshipStatus: "none",
        relationship: undefined,
        requestedConsentDomains: []
      },
      {
        actorRole: "clinician",
        actorType: "clinician",
        requestedResource: "consultation-room",
        requestedAction: "read",
        purpose: "care-delivery"
      },
      {
        actorRole: "organization-admin",
        actorType: "admin",
        requestedResource: "consent-preferences",
        requestedAction: "update-consent",
        purpose: "consent-management",
        relationshipType: "none",
        relationshipStatus: "none",
        relationship: undefined,
        requiresRelationship: false,
        requestedConsentDomains: []
      }
    ];

    for (const inputCase of denyCases) {
      const response = handleAuthorizationPolicyDecisionRoute({
        requestId: "req-policy-deny",
        correlationId: "corr-policy-deny",
        input: createPolicyRouteInput(inputCase)
      });

      expect(response.data).toMatchObject({
        status: "denied",
        reasonCode: "rbac-policy-unmapped-deny-default"
      });
      expect(response.meta).toMatchObject({
        operationTag: "authorization.policy.evaluate",
        decisionReasonTag: "rbac-policy-unmapped-deny-default"
      });
    }
  });
});
