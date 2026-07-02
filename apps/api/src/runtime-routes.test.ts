import { describe, expect, it } from "vitest";
import { createPaymentDraft } from "./payments.js";
import { createRefundDraft } from "./refunds.js";
import {
  handleAuthenticationDecisionRoute,
  handlePaymentTransitionRoute,
  handleProviderDisclosureEligibilityRoute,
  handleRefundTransitionRoute,
  handleTenancyAccessDecisionRoute
} from "./runtime-routes.js";
import { createAuthenticationDraft } from "./authentication.js";
import { createTenancyAccessDraft } from "./tenancy.js";

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
});
