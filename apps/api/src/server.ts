import { Hono } from "hono";
import type { Context } from "hono";
import { handleProviderDisclosureEligibilityRoute } from "./runtime-routes.js";
import { handlePaymentTransitionRoute, handleRefundTransitionRoute } from "./runtime-routes.js";
import type { ProviderDisclosureEligibilityRouteRequest } from "./runtime-routes.js";
import type { PaymentTransitionRouteRequest, RefundTransitionRouteRequest } from "./runtime-routes.js";

export const app = new Hono();

/**
 * POST /api/provider-disclosure-eligibility
 *
 * Evaluate provider disclosure eligibility based on payment and authorization state.
 * Request body contains the eligibility evaluation input.
 * Response is an ApiEnvelope<ProviderDisclosureDecisionDraft>.
 */
app.post("/api/provider-disclosure-eligibility", async (c: Context) => {
  try {
    // Extract request metadata
    const requestId = c.req.header("x-request-id") ?? crypto.randomUUID();
    const correlationId = c.req.header("x-correlation-id") ?? crypto.randomUUID();
    const traceId = c.req.header("x-trace-id");
    const spanId = c.req.header("x-span-id");

    // Parse request body
    const body = await c.req.json();

    // Build route request
    const routeRequest: ProviderDisclosureEligibilityRouteRequest = {
      requestId,
      correlationId,
      input: {
        orderId: body.orderId,
        providerDisplayName: body.providerDisplayName,
        paymentStatus: body.paymentStatus,
        hasAuthorization: body.hasAuthorization,
        sameTenant: body.sameTenant,
        evaluatedAt: body.evaluatedAt ?? new Date().toISOString()
      }
    };

    // Execute route handler
    const response = handleProviderDisclosureEligibilityRoute(routeRequest);

    // Add tracing fields if provided
    if (traceId) response.meta.traceId = traceId;
    if (spanId) response.meta.spanId = spanId;

    // Return envelope
    return c.json(response, 200);
  } catch (error) {
    return c.json(
      {
        data: null,
        meta: {
          requestId: c.req.header("x-request-id") ?? crypto.randomUUID(),
          correlationId: c.req.header("x-correlation-id") ?? crypto.randomUUID(),
          traceId: c.req.header("x-trace-id"),
          spanId: c.req.header("x-span-id"),
          operationTag: "provider-disclosure.eligibility.evaluate",
          decisionReasonTag: "error"
        },
        errors: [
          {
            message: error instanceof Error ? error.message : "Internal server error"
          }
        ]
      },
      500
    );
  }
});

/**
 * POST /api/payment-transition
 *
 * Transition payment status through its lifecycle.
 * Enforces legal transitions and returns envelope with observability tags.
 */
app.post("/api/payment-transition", async (c: Context) => {
  try {
    const requestId = c.req.header("x-request-id") ?? crypto.randomUUID();
    const correlationId = c.req.header("x-correlation-id") ?? crypto.randomUUID();
    const traceId = c.req.header("x-trace-id");
    const spanId = c.req.header("x-span-id");

    const body = await c.req.json();

    const routeRequest: PaymentTransitionRouteRequest = {
      requestId,
      correlationId,
      input: {
        payment: body.payment,
        toStatus: body.toStatus,
        transitionedAt: body.transitionedAt ?? new Date().toISOString()
      }
    };

    const response = handlePaymentTransitionRoute(routeRequest);

    if (traceId) response.meta.traceId = traceId;
    if (spanId) response.meta.spanId = spanId;

    return c.json(response, 200);
  } catch (error) {
    return c.json(
      {
        data: null,
        meta: {
          requestId: c.req.header("x-request-id") ?? crypto.randomUUID(),
          correlationId: c.req.header("x-correlation-id") ?? crypto.randomUUID(),
          traceId: c.req.header("x-trace-id"),
          spanId: c.req.header("x-span-id"),
          operationTag: "payment.transition",
          decisionReasonTag: "error"
        },
        errors: [
          {
            message: error instanceof Error ? error.message : "Internal server error"
          }
        ]
      },
      500
    );
  }
});

/**
 * POST /api/refund-transition
 *
 * Transition refund status through its lifecycle.
 * Enforces legal transitions and returns envelope with observability tags.
 */
app.post("/api/refund-transition", async (c: Context) => {
  try {
    const requestId = c.req.header("x-request-id") ?? crypto.randomUUID();
    const correlationId = c.req.header("x-correlation-id") ?? crypto.randomUUID();
    const traceId = c.req.header("x-trace-id");
    const spanId = c.req.header("x-span-id");

    const body = await c.req.json();

    const routeRequest: RefundTransitionRouteRequest = {
      requestId,
      correlationId,
      input: {
        refund: body.refund,
        toStatus: body.toStatus,
        transitionedAt: body.transitionedAt ?? new Date().toISOString()
      }
    };

    const response = handleRefundTransitionRoute(routeRequest);

    if (traceId) response.meta.traceId = traceId;
    if (spanId) response.meta.spanId = spanId;

    return c.json(response, 200);
  } catch (error) {
    return c.json(
      {
        data: null,
        meta: {
          requestId: c.req.header("x-request-id") ?? crypto.randomUUID(),
          correlationId: c.req.header("x-correlation-id") ?? crypto.randomUUID(),
          traceId: c.req.header("x-trace-id"),
          spanId: c.req.header("x-span-id"),
          operationTag: "refund.transition",
          decisionReasonTag: "error"
        },
        errors: [
          {
            message: error instanceof Error ? error.message : "Internal server error"
          }
        ]
      },
      500
    );
  }
});

/**
 * GET /api/health
 * Simple health check endpoint.
 */
app.get("/api/health", (c: Context) => {
  return c.json({ status: "ok" }, 200);
});

export default app;
