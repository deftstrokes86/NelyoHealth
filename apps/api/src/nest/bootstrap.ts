import { INestApplication } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import type { NextFunction, Request, Response } from "express";
import "reflect-metadata";
import { ApiExceptionFilter } from "./api-exception.filter.js";
import { AppModule } from "./app.module.js";

/**
 * Baseline security headers (roadmap M7, ADR-0014 edge hygiene). A hand-rolled,
 * dependency-free equivalent of helmet's core set — the API serves JSON only, so it
 * locks down framing, sniffing, referrer leakage, and cross-origin resource sharing.
 */
function securityHeaders(_req: Request, res: Response, next: NextFunction): void {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
  res.setHeader("X-DNS-Prefetch-Control", "off");
  res.removeHeader("X-Powered-By");
  next();
}

/**
 * CORS allowlist. Locked to the known web-shell dev origins for now (M7.x will add
 * the deployed origins). NOT `*`: credentials-bearing cross-origin reads of patient
 * data must come only from origins we control.
 */
const ALLOWED_ORIGINS = (
  process.env.NELYO_ALLOWED_ORIGINS ?? "http://localhost:4273,http://127.0.0.1:4273"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export async function createNestApiApp(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule, {
    logger: ["error", "warn", "log"]
  });

  app.use(securityHeaders);
  app.enableCors({
    origin: ALLOWED_ORIGINS,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["authorization", "content-type", "idempotency-key", "x-nelyo-session"]
  });
  app.useGlobalFilters(app.get(ApiExceptionFilter));
  return app;
}
