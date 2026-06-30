import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import type { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { createNestApiApp } from "./bootstrap.js";

const apiDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const rootDir = path.resolve(apiDir, "../..");
const openApiPath = path.join(rootDir, "packages", "api-client", "openapi", "openapi.json");

function normalize(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((entry) => normalize(entry));
  }
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return Object.fromEntries(
      Object.keys(record)
        .sort((a, b) => a.localeCompare(b))
        .map((key) => [key, normalize(record[key])])
    );
  }
  return value;
}

function stableStringify(value: unknown): string {
  return JSON.stringify(normalize(value), null, 2);
}

describe("OpenAPI contract drift", () => {
  let app: INestApplication | undefined;

  afterEach(async () => {
    if (app) {
      await app.close();
      app = undefined;
    }
  });

  it("matches the generated OpenAPI snapshot and excludes protected provider details", async () => {
    expect(fs.existsSync(openApiPath)).toBe(true);

    app = await createNestApiApp();
    await app.init();

    const config = new DocumentBuilder()
      .setTitle("NelyoHealth API Skeleton")
      .setDescription("Phase 2 API skeleton OpenAPI contract")
      .setVersion("0.0.0")
      .build();

    const generated = SwaggerModule.createDocument(app, config);
    const committed = JSON.parse(fs.readFileSync(openApiPath, "utf8")) as Record<string, unknown>;

    expect(stableStringify(committed)).toBe(stableStringify(generated));

    const serialized = JSON.stringify(committed);
    expect(serialized).not.toContain("providerId");
    expect(serialized).not.toContain("providerAddress");
    expect(serialized).toContain("/api/health");
    expect(serialized).toContain("/api/ready");
    expect(serialized).toContain("/api/idempotency/probe");
  });
});
