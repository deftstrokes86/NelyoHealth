import { Injectable, NestMiddleware } from "@nestjs/common";
import type { NextFunction, Response } from "express";
import type { ApiRequestWithContext } from "./request-context.middleware.js";
import { createMeta } from "./api-envelope.js";

const unsafeMethods = new Set(["POST", "PUT", "PATCH", "DELETE"]);

@Injectable()
export class IdempotencyMiddleware implements NestMiddleware {
  private readonly seenKeys = new Set<string>();

  use(req: ApiRequestWithContext, res: Response, next: NextFunction): void {
    if (!unsafeMethods.has(req.method.toUpperCase())) {
      next();
      return;
    }

    const idempotencyKey = req.header("idempotency-key");
    if (!idempotencyKey) {
      next();
      return;
    }

    const fingerprint = `${req.method.toUpperCase()}::${req.path}::${idempotencyKey}`;
    if (this.seenKeys.has(fingerprint)) {
      const requestId = req.requestId ?? "missing-request-id";
      const correlationId = req.correlationId ?? "missing-correlation-id";
      res.status(409).json({
        data: null,
        meta: createMeta(requestId, correlationId, "api.idempotency.check", "duplicate-request"),
        errors: [
          {
            code: "IDEMPOTENCY_DUPLICATE",
            message: "Duplicate idempotency-key for the same method and route."
          }
        ]
      });
      return;
    }

    this.seenKeys.add(fingerprint);
    next();
  }
}
