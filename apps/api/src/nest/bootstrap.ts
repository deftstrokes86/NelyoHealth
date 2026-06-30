import { INestApplication } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import "reflect-metadata";
import { ApiExceptionFilter } from "./api-exception.filter.js";
import { AppModule } from "./app.module.js";

export async function createNestApiApp(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule, {
    logger: ["error", "warn", "log"]
  });

  app.useGlobalFilters(app.get(ApiExceptionFilter));
  return app;
}
