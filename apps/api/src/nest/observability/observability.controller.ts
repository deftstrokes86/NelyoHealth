import { Body, Controller, Post, Req } from "@nestjs/common";
import type { Request } from "express";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import type { ApiEnvelope } from "../api-envelope.js";
import { createMeta } from "../api-envelope.js";
import { ObservabilityService } from "./observability.service.js";

interface ObservabilityProbeBody {
  syntheticTaskId?: string;
  failUntilAttempt?: number;
  maxAttempts?: number;
}

@Controller("api/observability")
@ApiTags("observability")
export class ObservabilityController {
  constructor(private readonly observabilityService: ObservabilityService) {}

  @Post("probe")
  @ApiOperation({ summary: "Run synthetic API-to-worker observability correlation probe" })
  @ApiOkResponse({ description: "Observability probe envelope" })
  async runProbe(
    @Req() req: Request & { requestId?: string; correlationId?: string },
    @Body() body: ObservabilityProbeBody
  ): Promise<ApiEnvelope<Awaited<ReturnType<ObservabilityService["runCorrelationProbe"]>>>> {
    const requestId = req.requestId ?? "missing-request-id";
    const correlationId = req.correlationId ?? "missing-correlation-id";

    const data = await this.observabilityService.runCorrelationProbe({
      syntheticTaskId: body.syntheticTaskId ?? "iss011-task",
      failUntilAttempt: body.failUntilAttempt ?? 1,
      maxAttempts: body.maxAttempts ?? 3,
      requestId,
      correlationId,
      idempotencyKey: `${requestId}:${correlationId}:observability`
    });

    return {
      data,
      meta: createMeta(requestId, correlationId, "api.observability.probe", "completed"),
      errors: []
    };
  }
}
