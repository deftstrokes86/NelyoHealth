import { describe, expect, it } from "vitest";
import {
  createPaymentTransitionRouteRequestDto,
  createProviderDisclosureEligibilityRouteRequestDto,
  createRefundTransitionRouteRequestDto
} from "./runtime-routes.js";

describe("api client runtime route request dto", () => {
  it("creates a payment transition route request dto", () => {
    const dto = createPaymentTransitionRouteRequestDto({
      requestId: "req-dto-1",
      correlationId: "corr-dto-1",
      paymentId: "payment-dto-1",
      toStatus: "authorized",
      transitionedAt: "2026-07-10T12:00:00.000Z"
    });

    expect(dto).toMatchObject({
      requestId: "req-dto-1",
      correlationId: "corr-dto-1",
      paymentId: "payment-dto-1",
      toStatus: "authorized",
      transitionedAt: "2026-07-10T12:00:00.000Z"
    });
  });

  it("creates a refund transition route request dto", () => {
    const dto = createRefundTransitionRouteRequestDto({
      requestId: "req-dto-2",
      correlationId: "corr-dto-2",
      refundId: "refund-dto-2",
      toStatus: "processing",
      transitionedAt: "2026-07-10T12:10:00.000Z"
    });

    expect(dto).toMatchObject({
      requestId: "req-dto-2",
      correlationId: "corr-dto-2",
      refundId: "refund-dto-2",
      toStatus: "processing",
      transitionedAt: "2026-07-10T12:10:00.000Z"
    });
  });

  it("creates a provider disclosure eligibility route request dto", () => {
    const dto = createProviderDisclosureEligibilityRouteRequestDto({
      requestId: "req-dto-3",
      correlationId: "corr-dto-3",
      orderId: "order-dto-3",
      paymentStatus: "settled",
      hasAuthorization: true,
      sameTenant: true
    });

    expect(dto).toMatchObject({
      requestId: "req-dto-3",
      correlationId: "corr-dto-3",
      orderId: "order-dto-3",
      paymentStatus: "settled",
      hasAuthorization: true,
      sameTenant: true
    });
  });
});
