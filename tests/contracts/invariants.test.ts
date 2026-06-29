import { describe, expect, it } from "vitest";
import { createProviderSearchResponseWithProtectedFields } from "../../apps/api/src/providers.js";
import { createPaymentDraft } from "../../apps/api/src/payments.js";
import { createProviderDisclosureDecisionDraft } from "../../apps/api/src/provider-disclosure.js";
import { createRefundDraft } from "../../apps/api/src/refunds.js";

describe("contract invariants", () => {
  it("does not expose protected provider fields in pre-payment search responses", () => {
    const response = createProviderSearchResponseWithProtectedFields({
      providerId: "provider-1",
      providerDisplayName: "Provider A",
      serviceName: "Teleconsultation",
      price: 12000,
      currency: "NGN",
      availabilityStatus: "available",
      address: "Hidden Street",
      phoneNumber: "+2348000000000",
      branchId: "branch-1"
    });

    expect(response).toMatchObject({
      providerId: "provider-1",
      providerDisplayName: "Provider A",
      serviceName: "Teleconsultation",
      price: 12000,
      currency: "NGN",
      availabilityStatus: "available"
    });
    expect(response).not.toHaveProperty("address");
    expect(response).not.toHaveProperty("phoneNumber");
    expect(response).not.toHaveProperty("branchId");
  });

  it("keeps payment boundary free from provider-detail fields", () => {
    const payment = createPaymentDraft({
      paymentId: "payment-locked-1",
      orderId: "order-locked-1",
      status: "initiated",
      amount: "12000",
      currency: "NGN",
      authorizedAt: null,
      settledAt: null
    });

    expect(payment).toMatchObject({
      paymentId: "payment-locked-1",
      orderId: "order-locked-1",
      status: "initiated",
      amount: "12000",
      currency: "NGN",
      authorizedAt: null,
      settledAt: null
    });
    expect(payment).not.toHaveProperty("providerId");
    expect(payment).not.toHaveProperty("providerDisplayName");
    expect(payment).not.toHaveProperty("address");
  });

  it("keeps provider disclosure boundary pre-payment safe with display-name-only output", () => {
    const decision = createProviderDisclosureDecisionDraft({
      orderId: "order-locked-2",
      status: "not-eligible",
      reasonCode: "payment-not-settled",
      providerDisplayName: "Provider Safe",
      authorizedAt: null,
      providerId: "provider-hidden-2",
      providerAddress: "Hidden Address",
      providerPhone: "+2348111111111"
    });

    expect(decision).toMatchObject({
      orderId: "order-locked-2",
      status: "not-eligible",
      reasonCode: "payment-not-settled",
      providerDisplayName: "Provider Safe",
      authorizedAt: null
    });
    expect(decision).not.toHaveProperty("providerId");
    expect(decision).not.toHaveProperty("providerAddress");
    expect(decision).not.toHaveProperty("providerPhone");
  });

  it("keeps refund boundary free from provider-detail fields", () => {
    const refund = createRefundDraft({
      refundId: "refund-locked-1",
      paymentId: "payment-locked-2",
      orderId: "order-locked-3",
      status: "eligibility-review",
      amount: "8000",
      currency: "NGN",
      completedAt: null
    });

    expect(refund).toMatchObject({
      refundId: "refund-locked-1",
      paymentId: "payment-locked-2",
      orderId: "order-locked-3",
      status: "eligibility-review",
      amount: "8000",
      currency: "NGN",
      completedAt: null
    });
    expect(refund).not.toHaveProperty("providerId");
    expect(refund).not.toHaveProperty("providerDisplayName");
    expect(refund).not.toHaveProperty("address");
  });
});
