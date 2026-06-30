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

    const message =
      exception instanceof HttpException
        ? this.extractExceptionMessage(exception)
        : "Internal server error";

    response.status(status).json({
      data: null,
      meta: createMeta(requestId, correlationId, "api.request", `http-${status}`),
      errors: [
        {
          code: `HTTP_${status}`,
          message
        }
      ]
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
}
