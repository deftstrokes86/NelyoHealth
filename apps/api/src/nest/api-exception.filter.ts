import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable
} from "@nestjs/common";
import type { Request, Response } from "express";
import { createMeta } from "./api-envelope.js";

@Injectable()
@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request & { requestId?: string; correlationId?: string }>();

    const requestId = request.requestId ?? "missing-request-id";
    const correlationId = request.correlationId ?? "missing-correlation-id";

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    // Surface unexpected (non-HTTP) failures for operability — the response stays a
    // generic 500, but the server records the cause rather than swallowing it.
    if (!(exception instanceof HttpException)) {
      console.error(
        `[api] unhandled exception (${requestId}):`,
        exception instanceof Error ? exception.stack : exception
      );
    }

    const message =
      exception instanceof HttpException
        ? this.extractExceptionMessage(exception)
        : "Internal server error";

    // A resource exception may carry an explicit canonical `code` (+ `details`);
    // otherwise fall back to the bare HTTP status. The canonical code is what keeps
    // the deny/not-found 404s byte-identical (ADR-0014) rather than leaking through
    // differentiated messages the way `HTTP_403` vs `HTTP_404` would.
    const { code, details } = this.extractCodeAndDetails(exception, status);

    response.status(status).json({
      data: null,
      meta: createMeta(requestId, correlationId, "api.request", `http-${status}`),
      errors: [details ? { code, message, details } : { code, message }]
    });
  }

  private extractExceptionMessage(exception: HttpException): string {
    const payload = exception.getResponse();
    if (typeof payload === "string") return payload;
    if (payload && typeof payload === "object" && "message" in payload) {
      const value = (payload as { message: unknown }).message;
      if (Array.isArray(value)) return value.join("; ");
      if (typeof value === "string") return value;
    }
    return exception.message;
  }

  private extractCodeAndDetails(
    exception: unknown,
    status: number
  ): { code: string; details?: string } {
    if (exception instanceof HttpException) {
      const payload = exception.getResponse();
      if (payload && typeof payload === "object") {
        const record = payload as { code?: unknown; details?: unknown };
        const code = typeof record.code === "string" ? record.code : `HTTP_${status}`;
        const details = typeof record.details === "string" ? record.details : undefined;
        return { code, details };
      }
    }
    return { code: `HTTP_${status}` };
  }
}
