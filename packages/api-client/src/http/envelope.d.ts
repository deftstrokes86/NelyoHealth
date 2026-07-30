/**
 * HTTP response envelope — the client-side mirror of the API's `ApiEnvelope`
 * (roadmap M7). Every endpoint returns this shape; the shells depend on this
 * contract rather than reverse-engineering the wire format.
 *
 * The error `code` is a small closed set so a client can branch on it without
 * parsing prose. Resource-tier denial and absence deliberately collapse to a
 * single `RESOURCE_UNAVAILABLE` (HTTP 404) — the caller learns nothing about a
 * resource's existence from the boundary (ADR-0014). The true allowed/denied
 * distinction lives only in the server audit trail.
 */
export type ApiErrorCode = "RESOURCE_UNAVAILABLE" | "STATE_CONFLICT" | "VALIDATION_FAILED" | "IDEMPOTENCY_DUPLICATE" | "RATE_LIMITED" | "UNAUTHENTICATED" | "STEP_UP_REQUIRED" | "FORBIDDEN" | "INTERNAL";
export interface ApiErrorItem {
    code: ApiErrorCode | string;
    message: string;
    details?: string;
}
export interface ApiMeta {
    requestId: string;
    correlationId: string;
    operationTag: string;
    decisionReasonTag: string;
}
export interface ApiEnvelope<TData> {
    data: TData | null;
    meta: ApiMeta;
    errors: ApiErrorItem[];
}
//# sourceMappingURL=envelope.d.ts.map