import { describe, expect, it } from "vitest";
import { createPaymentDraft } from "../../apps/api/src/payments.js";
import { createPaymentDraftDto } from "../../packages/api-client/src/payments.js";
import { createProviderDisclosureDecisionDraft } from "../../apps/api/src/provider-disclosure.js";
import { createProviderDisclosureDecisionDraftDto } from "../../packages/api-client/src/provider-disclosure.js";
import { createRefundDraft } from "../../apps/api/src/refunds.js";
import { createRefundDraftDto } from "../../packages/api-client/src/refunds.js";

describe("api and api-client contract parity", () => {
  it("keeps payment draft keys aligned between API and API client DTOs", () => {
    const apiContract = createPaymentDraft({
      paymentId: "payment-parity-1",
      orderId: "order-parity-1",
      status: "settled",
      amount: "9900",
      currency: "NGN",
      authorizedAt: "2026-07-05T01:00:00.000Z",
      settledAt: "2026-07-05T01:03:00.000Z"
    });

    const clientContract = createPaymentDraftDto({
      paymentId: "payment-parity-1",
      orderId: "order-parity-1",
      status: "settled",
      amount: "9900",
      currency: "NGN",
      authorizedAt: "2026-07-05T01:00:00.000Z",
      settledAt: "2026-07-05T01:03:00.000Z"
    });

    expect(Object.keys(clientContract).sort()).toEqual(Object.keys(apiContract).sort());
  });

  it("keeps provider disclosure keys aligned between API and API client DTOs", () => {
    const apiContract = createProviderDisclosureDecisionDraft({
      orderId: "order-parity-2",
      status: "eligible",
      reasonCode: "eligible",
      providerDisplayName: "Provider D",
      authorizedAt: "2026-07-06T01:00:00.000Z"
    });

    const clientContract = createProviderDisclosureDecisionDraftDto({
      orderId: "order-parity-2",
      status: "eligible",
      reasonCode: "eligible",
      providerDisplayName: "Provider D",
      authorizedAt: "2026-07-06T01:00:00.000Z"
    });

    expect(Object.keys(clientContract).sort()).toEqual(Object.keys(apiContract).sort());
  });

  it("keeps refund draft keys aligned between API and API client DTOs", () => {
    const apiContract = createRefundDraft({
      refundId: "refund-parity-1",
      paymentId: "payment-parity-2",
      orderId: "order-parity-3",
      status: "completed",
      amount: "15000",
      currency: "NGN",
      completedAt: "2026-07-08T10:00:00.000Z"
    });

    const clientContract = createRefundDraftDto({
      refundId: "refund-parity-1",
      paymentId: "payment-parity-2",
      orderId: "order-parity-3",
      status: "completed",
      amount: "15000",
      currency: "NGN",
      completedAt: "2026-07-08T10:00:00.000Z"
    });

    expect(Object.keys(clientContract).sort()).toEqual(Object.keys(apiContract).sort());
  });
});
