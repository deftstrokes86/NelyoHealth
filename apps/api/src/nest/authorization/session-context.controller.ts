import { Controller, Get, Req } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import type { ApiEnvelope } from "../api-envelope.js";
import { createMeta } from "../api-envelope.js";
import { Authorize } from "./authorization-metadata.js";
import type { AuthenticatedRequest } from "./authorization.guard.js";

interface SessionContextData {
  accountId: string;
  personId: string;
  workspace: string;
  persona: { kind: string; actorRole: string; actorRoles: string[] };
  activeTenantId: string | null;
  activeTenantValid: boolean;
  sessionStatus: string;
  authLevel: string;
}

/**
 * Platform session-context endpoint (roadmap M2.3). Protected: it returns the
 * caller's resolved ActingContext, exercising the full request lifecycle
 * (Authenticate -> Resolve -> Authorize -> Execute). This is platform
 * infrastructure ("who am I / what is my workspace"), not application policy.
 */
@Controller("api/session")
@ApiTags("session")
export class SessionContextController {
  @Get("context")
  @Authorize()
  @ApiOperation({ summary: "Resolved acting-context for the authenticated session" })
  @ApiOkResponse({ description: "Acting-context envelope" })
  getContext(@Req() request: AuthenticatedRequest): ApiEnvelope<SessionContextData> {
    // The guard guarantees an acting context on an allowed request.
    const context = request.actingContext!;
    return {
      data: {
        accountId: context.identity.accountId,
        personId: context.identity.personId,
        workspace: context.workspace,
        persona: context.persona,
        activeTenantId: context.activeTenantId,
        activeTenantValid: context.activeTenantValid,
        sessionStatus: context.sessionStatus,
        authLevel: context.authLevel
      },
      meta: createMeta(
        request.requestId ?? "missing-request-id",
        request.correlationId ?? "missing-correlation-id",
        "api.session.context",
        "resolved"
      ),
      errors: []
    };
  }
}
