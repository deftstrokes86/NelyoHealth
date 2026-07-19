import { Inject, Module, type OnModuleDestroy } from "@nestjs/common";
import type { Pool } from "pg";
import { createDatabasePool } from "@nelyohealth/database";
import { createPgActingContextPorts } from "../../acting-context-resolver.js";
import { createPgIdentitySessionPorts } from "../../identity-session-service.js";
import { createPgPasswordCredentialPorts } from "../../identity-password-login-service.js";
import { createPgRegistrationPorts } from "../../identity-registration-service.js";
import { AuthRegistrationsController } from "./auth-registrations.controller.js";
import { AuthSessionsController } from "./auth-sessions.controller.js";
import {
  ACTING_CONTEXT_PORTS,
  DATABASE_POOL,
  IDENTITY_SESSION_PORTS,
  PASSWORD_CREDENTIAL_PORTS,
  REGISTRATION_PORTS
} from "./auth-tokens.js";

/**
 * Auth HTTP module (patient-web sign-in/sign-up).
 *
 * Both routes are @Public() — creating/registering a session is necessarily
 * pre-authentication. A dedicated lazy pool keeps this module independent of
 * AuthorizationModule's pool (pg Pools don't connect until first query, so
 * this costs nothing when unused).
 */
@Module({
  controllers: [AuthSessionsController, AuthRegistrationsController],
  providers: [
    { provide: DATABASE_POOL, useFactory: (): Pool => createDatabasePool() },
    {
      provide: IDENTITY_SESSION_PORTS,
      useFactory: (pool: Pool) => createPgIdentitySessionPorts(pool),
      inject: [DATABASE_POOL]
    },
    {
      provide: PASSWORD_CREDENTIAL_PORTS,
      useFactory: (pool: Pool) => createPgPasswordCredentialPorts(pool),
      inject: [DATABASE_POOL]
    },
    {
      provide: ACTING_CONTEXT_PORTS,
      useFactory: (pool: Pool) => createPgActingContextPorts(pool),
      inject: [DATABASE_POOL]
    },
    {
      provide: REGISTRATION_PORTS,
      useFactory: (pool: Pool) => createPgRegistrationPorts(pool),
      inject: [DATABASE_POOL]
    }
  ]
})
export class AuthModule implements OnModuleDestroy {
  constructor(@Inject(DATABASE_POOL) private readonly pool: Pool) {}

  async onModuleDestroy(): Promise<void> {
    await this.pool.end();
  }
}
