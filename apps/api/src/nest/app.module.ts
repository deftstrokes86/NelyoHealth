import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { ApiExceptionFilter } from "./api-exception.filter.js";
import { AuthModule } from "./auth/auth.module.js";
import { AuthorizationModule } from "./authorization/authorization.module.js";
import { IdempotencyMiddleware } from "./idempotency.middleware.js";
import { ObservabilityModule } from "./observability/observability.module.js";
import { RateLimitMiddleware } from "./rate-limit/rate-limit.middleware.js";
import { RequestContextMiddleware } from "./request-context.middleware.js";
import { ResourceModule } from "./resource/resource.module.js";
import { StorageModule } from "./storage/storage.module.js";
import { SystemModule } from "./system/system.module.js";

@Module({
  imports: [
    AuthorizationModule,
    AuthModule,
    SystemModule,
    StorageModule,
    ObservabilityModule,
    ResourceModule
  ],
  providers: [
    ApiExceptionFilter,
    RequestContextMiddleware,
    RateLimitMiddleware,
    IdempotencyMiddleware
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(RequestContextMiddleware)
      .forRoutes({ path: "*path", method: RequestMethod.ALL });
    // Rate limiting runs before the PEP guard so abusive traffic is shed at the edge.
    consumer.apply(RateLimitMiddleware).forRoutes({ path: "api/*path", method: RequestMethod.ALL });
    consumer
      .apply(IdempotencyMiddleware)
      .forRoutes(
        { path: "api/idempotency/probe", method: RequestMethod.POST },
        { path: "api/*path", method: RequestMethod.PUT },
        { path: "api/*path", method: RequestMethod.PATCH },
        { path: "api/*path", method: RequestMethod.DELETE }
      );
  }
}
