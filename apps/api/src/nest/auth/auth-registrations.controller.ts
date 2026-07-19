import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
  UnprocessableEntityException
} from "@nestjs/common";
import type { Request } from "express";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { randomUUID } from "node:crypto";
import type { ApiEnvelope } from "../api-envelope.js";
import { createMeta } from "../api-envelope.js";
import { Public } from "../authorization/authorization-metadata.js";
import type { RegistrationPorts } from "../../identity-registration-service.js";
import { REGISTRATION_PORTS } from "./auth-tokens.js";

interface CreateRegistrationRequestBody {
  fullName?: string;
  email?: string;
  password?: string;
}

interface RegistrationData {
  accepted: true;
}

/**
 * Sign-up endpoint (patient-web). Public by necessity (pre-authentication).
 *
 * Always returns the same "accepted" response whether the email was new or
 * already registered — no account-enumeration side channel (see
 * identity-registration-service.ts). Email verification / role-consent
 * onboarding are NOT implemented here — disclosed scope boundary (no email
 * dispatch infrastructure exists in this platform yet).
 */
@Controller("api/auth")
@ApiTags("auth")
export class AuthRegistrationsController {
  constructor(@Inject(REGISTRATION_PORTS) private readonly registrationPorts: RegistrationPorts) {}

  @Post("registrations")
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Register a new account (email + password)" })
  @ApiOkResponse({ description: "Registration envelope" })
  async createRegistration(
    @Req() req: Request & { requestId?: string; correlationId?: string },
    @Body() body: CreateRegistrationRequestBody
  ): Promise<ApiEnvelope<RegistrationData>> {
    const requestId = req.requestId ?? "missing-request-id";
    const correlationId = req.correlationId ?? "missing-correlation-id";

    const outcome = await this.registrationPorts.register({
      fullName: body.fullName ?? "",
      loginEmail: (body.email ?? "").trim(),
      password: body.password ?? "",
      safeContext: {
        requestId,
        correlationId,
        idempotencyKey: randomUUID(),
        operationTag: "identity.registrations.create"
      }
    });

    if (outcome.status === "rejected") {
      throw new UnprocessableEntityException(outcome.reasonCode);
    }

    return {
      data: { accepted: true },
      meta: createMeta(requestId, correlationId, "api.auth.registrations.create", "accepted"),
      errors: []
    };
  }
}
