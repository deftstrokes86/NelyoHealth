import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
  UnauthorizedException
} from "@nestjs/common";
import type { Request } from "express";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { randomUUID } from "node:crypto";
import type { ApiEnvelope } from "../api-envelope.js";
import { createMeta } from "../api-envelope.js";
import { Public } from "../authorization/authorization-metadata.js";
import { resolveActingContext, type ActingContextPorts } from "../../acting-context-resolver.js";
import {
  executePasswordLoginAttempt,
  type PasswordCredentialPorts
} from "../../identity-password-login-service.js";
import type { IdentitySessionPorts } from "../../identity-session-service.js";
import {
  ACTING_CONTEXT_PORTS,
  IDENTITY_SESSION_PORTS,
  PASSWORD_CREDENTIAL_PORTS
} from "./auth-tokens.js";

interface CreateSessionRequestBody {
  email?: string;
  password?: string;
}

interface SessionData {
  sessionId: string;
  requiresChallenge: boolean;
  redirectPath: string;
}

/**
 * Sign-in endpoint (patient-web). Public by necessity: creating a session is
 * how a caller becomes authenticated in the first place — it cannot itself
 * require an existing session.
 *
 * No account-enumeration side channel: an unknown email and a wrong password
 * both resolve to the same generic 401 (delegated entirely to M1.2's
 * executeLoginAttempt / evaluateAuthenticationDecision, unmodified).
 */
@Controller("api/auth")
@ApiTags("auth")
export class AuthSessionsController {
  constructor(
    @Inject(IDENTITY_SESSION_PORTS) private readonly sessionPorts: IdentitySessionPorts,
    @Inject(PASSWORD_CREDENTIAL_PORTS) private readonly credentialPorts: PasswordCredentialPorts,
    @Inject(ACTING_CONTEXT_PORTS) private readonly actingContextPorts: ActingContextPorts
  ) {}

  @Post("sessions")
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create a session (password sign-in)" })
  @ApiOkResponse({ description: "Session envelope" })
  async createSession(
    @Req() req: Request & { requestId?: string; correlationId?: string },
    @Body() body: CreateSessionRequestBody
  ): Promise<ApiEnvelope<SessionData>> {
    const requestId = req.requestId ?? "missing-request-id";
    const correlationId = req.correlationId ?? "missing-correlation-id";

    const email = (body.email ?? "").trim();
    const password = body.password ?? "";
    if (!email || !password) {
      throw new UnauthorizedException("credentials-invalid");
    }

    const outcome = await executePasswordLoginAttempt(this.sessionPorts, this.credentialPorts, {
      loginEmail: email,
      password,
      authRequestId: randomUUID()
    });

    if (outcome.status === "denied") {
      throw new UnauthorizedException(outcome.decision?.reasonCode ?? "credentials-invalid");
    }
    if (outcome.status === "challenge-required") {
      // Unreachable for the patient tier today (MFA only gates privileged
      // tiers) — handled for forward compatibility, not yet exercised.
      throw new UnauthorizedException(outcome.decision.reasonCode);
    }

    const actingContext = await resolveActingContext(this.actingContextPorts, {
      accountId: outcome.session.userAccountId,
      sessionId: outcome.session.id
    });

    // Both workspaces resolve to the same minimal landing page today — no
    // differentiated organization-workspace shell exists yet. Computed from
    // the real ActingContext (not hardcoded) so this is forward-compatible.
    const redirectPath = actingContext.workspace === "organization" ? "/account" : "/account";

    return {
      data: {
        sessionId: outcome.session.id,
        requiresChallenge: false,
        redirectPath
      },
      meta: createMeta(requestId, correlationId, "api.auth.sessions.create", "authenticated"),
      errors: []
    };
  }
}
