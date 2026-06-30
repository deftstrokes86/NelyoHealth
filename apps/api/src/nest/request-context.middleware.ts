import { Injectable, NestMiddleware } from "@nestjs/common";
import type { NextFunction, Request, Response } from "express";
import { randomUUID } from "node:crypto";

export interface ApiRequestWithContext extends Request {
  requestId?: string;
  correlationId?: string;
}

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(req: ApiRequestWithContext, res: Response, next: NextFunction): void {
    const requestId = req.header("x-request-id") ?? randomUUID();
    const correlationId = req.header("x-correlation-id") ?? randomUUID();

    req.requestId = requestId;
    req.correlationId = correlationId;

    res.setHeader("x-request-id", requestId);
    res.setHeader("x-correlation-id", correlationId);

    next();
  }
}
