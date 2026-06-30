import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { ApiExceptionFilter } from "./api-exception.filter.js";
import { IdempotencyMiddleware } from "./idempotency.middleware.js";
import { RequestContextMiddleware } from "./request-context.middleware.js";
import { StorageModule } from "./storage/storage.module.js";
import { SystemModule } from "./system/system.module.js";

@Module({
  imports: [SystemModule, StorageModule],
  providers: [ApiExceptionFilter, RequestContextMiddleware, IdempotencyMiddleware]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(RequestContextMiddleware)
      .forRoutes({ path: "*path", method: RequestMethod.ALL });
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
