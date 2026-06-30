import { Controller, Get, Post, Req } from "@nestjs/common";
import type { Request } from "express";
import type { ApiEnvelope } from "../api-envelope.js";
import { createMeta } from "../api-envelope.js";
import { ReadinessService } from "./readiness.service.js";

interface HealthData {
  status: "ok";
  service: string;
  checkedAt: string;
}

interface IdempotencyProbeData {
  accepted: true;
}

@Controller("api")
export class SystemController {
  constructor(private readonly readinessService: ReadinessService) {}

  @Get("health")
  getHealth(@Req() req: Request & { requestId?: string; correlationId?: string }): ApiEnvelope<HealthData> {
    return {
      data: {
        status: "ok",
        service: "@nelyohealth/api",
        checkedAt: new Date().toISOString()
      },
      meta: createMeta(
        req.requestId ?? "missing-request-id",
        req.correlationId ?? "missing-correlation-id",
        "api.health",
        "ok"
      ),
      errors: []
    };
  }

  @Get("ready")
  async getReady(
    @Req() req: Request & { requestId?: string; correlationId?: string }
  ): Promise<ApiEnvelope<Awaited<ReturnType<ReadinessService["getReadiness"]>>>> {
    const readiness = await this.readinessService.getReadiness();
    return {
      data: readiness,
      meta: createMeta(
        req.requestId ?? "missing-request-id",
        req.correlationId ?? "missing-correlation-id",
        "api.readiness",
        readiness.ready ? "ready" : "not-ready"
      ),
      errors: []
    };
  }

  @Post("idempotency/probe")
  probeIdempotency(
    @Req() req: Request & { requestId?: string; correlationId?: string }
  ): ApiEnvelope<IdempotencyProbeData> {
    return {
      data: {
        accepted: true
      },
      meta: createMeta(
        req.requestId ?? "missing-request-id",
        req.correlationId ?? "missing-correlation-id",
        "api.idempotency.probe",
        "accepted"
      ),
      errors: []
    };
  }
}
