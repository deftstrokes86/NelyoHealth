import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  NotFoundException
} from "@nestjs/common";

/**
 * Resource-tier HTTP translation (roadmap M7, ADR-0014).
 *
 * The non-enumeration contract: resource-tier DENIED and NOT-FOUND collapse to ONE
 * canonical 404 with a byte-identical body — a caller learns nothing about a
 * resource's existence from the boundary, for reads AND writes (a denied cancel is
 * a 404, not a 403). The true allowed/denied/not-found distinction lives only in
 * the server audit trail. This deliberately departs from REST convention; that is
 * the point.
 *
 * The exception payload carries an explicit `code` (a stable, closed set the client
 * branches on) so the exception filter emits a canonical error code rather than a
 * bare HTTP status — and, for 404, a FIXED message that never names the resource.
 */
export const RESOURCE_UNAVAILABLE = {
  code: "RESOURCE_UNAVAILABLE",
  message: "The requested resource is unavailable."
} as const;

/** Reads AND writes: denied or not-found → this single opaque 404 (ADR-0014). */
export class ResourceUnavailableException extends NotFoundException {
  constructor() {
    super({ code: RESOURCE_UNAVAILABLE.code, message: RESOURCE_UNAVAILABLE.message });
  }
}

/**
 * 409 for a write state conflict (invalid transition / raced conditional write).
 * Reachable ONLY after authorization passes, so surfacing the state-machine reason
 * here never leaks state to an unauthorized actor (the HTTP image of the M6.4
 * "authz before validity" invariant). It may carry a machine-readable reason.
 */
export class StateConflictException extends ConflictException {
  constructor(reasonCode: string) {
    super({
      code: "STATE_CONFLICT",
      message: "The resource is not in a state that permits this operation.",
      details: reasonCode
    });
  }
}

/** 400 for a malformed request the client can fix (e.g. a tampered timeline cursor). */
export class RequestValidationException extends BadRequestException {
  constructor(details: string) {
    super({ code: "VALIDATION_FAILED", message: "The request could not be processed.", details });
  }
}

/** 429 with Retry-After, uniform body (the limiter must not itself be an oracle). */
export class RateLimitedException extends HttpException {
  constructor(retryAfterSeconds: number) {
    super(
      {
        code: "RATE_LIMITED",
        message: "Too many requests.",
        details: `retry-after=${retryAfterSeconds}`
      },
      HttpStatus.TOO_MANY_REQUESTS
    );
  }
}
