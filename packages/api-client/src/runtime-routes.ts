export interface RuntimeRouteMetaDto {
  requestId: string;
  correlationId: string;
}

export interface PaymentTransitionRouteRequestDto extends RuntimeRouteMetaDto {
  paymentId: string;
  toStatus: "quoted" | "initiated" | "authorized" | "settled" | "failed";
  transitionedAt: string;
}

export interface RefundTransitionRouteRequestDto extends RuntimeRouteMetaDto {
  refundId: string;
  toStatus:
    | "requested"
    | "eligibility-review"
    | "approved"
    | "processing"
    | "completed"
    | "failed";
  transitionedAt: string;
}

export interface ProviderDisclosureEligibilityRouteRequestDto extends RuntimeRouteMetaDto {
  orderId: string;
  paymentStatus: "quoted" | "initiated" | "authorized" | "settled" | "failed";
  refundStatus?:
    | "requested"
    | "eligibility-review"
    | "approved"
    | "processing"
    | "completed"
    | "failed";
  hasAuthorization: boolean;
  sameTenant: boolean;
}

export function createPaymentTransitionRouteRequestDto(
  input: PaymentTransitionRouteRequestDto
): PaymentTransitionRouteRequestDto {
  return {
    requestId: input.requestId,
    correlationId: input.correlationId,
    paymentId: input.paymentId,
    toStatus: input.toStatus,
    transitionedAt: input.transitionedAt
  };
}

export function createRefundTransitionRouteRequestDto(
  input: RefundTransitionRouteRequestDto
): RefundTransitionRouteRequestDto {
  return {
    requestId: input.requestId,
    correlationId: input.correlationId,
    refundId: input.refundId,
    toStatus: input.toStatus,
    transitionedAt: input.transitionedAt
  };
}

export function createProviderDisclosureEligibilityRouteRequestDto(
  input: ProviderDisclosureEligibilityRouteRequestDto
): ProviderDisclosureEligibilityRouteRequestDto {
  return {
    requestId: input.requestId,
    correlationId: input.correlationId,
    orderId: input.orderId,
    paymentStatus: input.paymentStatus,
    refundStatus: input.refundStatus,
    hasAuthorization: input.hasAuthorization,
    sameTenant: input.sameTenant
  };
}
