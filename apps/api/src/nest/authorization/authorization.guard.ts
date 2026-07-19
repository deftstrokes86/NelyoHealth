import {
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Request } from "express";
import {
  resolveActingContext,
  type ActingContext,
  type ActingContextPorts
} from "../../acting-context-resolver.js";
import {
  AUTHORIZATION_REQUIREMENT_KEY,
  PUBLIC_ENDPOINT_KEY,
  type AuthorizationRequirement
} from "./authorization-metadata.js";
import { ACTING_CONTEXT_PORTS } from "./authorization-tokens.js";
import { decidePlatformPolicy } from "./policy-decision.js";

export interface AuthenticatedRequest extends Request {
  requestId?: string;
  correlationId?: string;
  actingContext?: ActingContext;
}

/**
 * Mandatory Policy Enforcement Point / PEP (roadmap M2.3).
 *
 * Registered as a global guard (APP_GUARD), it stands in front of every route
 * and completes the request lifecycle up to execution:
 *   Authenticate -> Resolve ActingContext -> Authorize (-> Execute).
 *
 * Default-deny: any route not explicitly marked @Public() is protected. The
 * platform decision itself is delegated to the centralized PDS
 * (decidePlatformPolicy) — the guard only enforces its allowed | denied |
 * challenge-required outcome and never encodes policy of its own.
 */
@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(ACTING_CONTEXT_PORTS) private readonly ports: ActingContextPorts
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_ENDPOINT_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    // Authenticate: the session credential is an opaque session id.
    const token = extractSessionCredential(request);
    if (!token) {
      throw new UnauthorizedException("unauthenticated");
    }
    const session = await this.ports.getSessionById(token);
    if (!session) {
      throw new UnauthorizedException("unauthenticated");
    }

    // Resolve ActingContext (derived; validates the session tenant claim).
    const actingContext = await resolveActingContext(this.ports, {
      accountId: session.userAccountId,
      sessionId: session.id
    });

    // Authorize via the centralized platform PDS.
    const requirement =
      this.reflector.getAllAndOverride<AuthorizationRequirement>(AUTHORIZATION_REQUIREMENT_KEY, [
        context.getHandler(),
        context.getClass()
      ]) ?? {};
    const decision = decidePlatformPolicy(actingContext, requirement);

    if (decision.status === "allowed") {
      request.actingContext = actingContext;
      return true;
    }
    if (decision.status === "challenge-required") {
      // 401: the caller can recover by re-authenticating or stepping up.
      throw new UnauthorizedException(decision.reasonCode);
    }
    // denied -> 403: authenticated but not permitted.
    throw new ForbiddenException(decision.reasonCode);
  }
}

function extractSessionCredential(request: Request): string | null {
  const authorization = request.header("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.slice("bearer ".length).trim() || null;
  }
  const sessionHeader = request.header("x-nelyo-session");
  return sessionHeader ? sessionHeader.trim() || null : null;
}
