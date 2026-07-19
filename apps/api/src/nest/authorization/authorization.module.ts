import { Inject, Module, type OnModuleDestroy } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import type { Pool } from "pg";
import { createDatabasePool } from "@nelyohealth/database";
import { createPgActingContextPorts } from "../../acting-context-resolver.js";
import { AuthorizationGuard } from "./authorization.guard.js";
import { ACTING_CONTEXT_PORTS, DATABASE_POOL } from "./authorization-tokens.js";
import { SessionContextController } from "./session-context.controller.js";

/**
 * Authorization infrastructure module (roadmap M2.3).
 *
 * Wires the mandatory PEP guard globally (APP_GUARD) so every route is
 * default-deny unless declared @Public(), and provides the pooled database
 * access the guard needs to authenticate and resolve the ActingContext. The
 * pool is created lazily (pg connects on first query), so public-only runs
 * without a database still work.
 */
@Module({
  controllers: [SessionContextController],
  providers: [
    { provide: DATABASE_POOL, useFactory: (): Pool => createDatabasePool() },
    {
      provide: ACTING_CONTEXT_PORTS,
      useFactory: (pool: Pool) => createPgActingContextPorts(pool),
      inject: [DATABASE_POOL]
    },
    { provide: APP_GUARD, useClass: AuthorizationGuard }
  ]
})
export class AuthorizationModule implements OnModuleDestroy {
  constructor(@Inject(DATABASE_POOL) private readonly pool: Pool) {}

  async onModuleDestroy(): Promise<void> {
    await this.pool.end();
  }
}
