import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { createNestApiApp } from "./bootstrap.js";

const apiDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const rootDir = path.resolve(apiDir, "../..");
const outputPath = path.join(rootDir, "packages", "api-client", "openapi", "openapi.json");

describe("openapi generation", () => {
  it("generates OpenAPI from Nest source", async () => {
    const app = await createNestApiApp();
    await app.init();

    try {
      const config = new DocumentBuilder()
        .setTitle("NelyoHealth API Skeleton")
        .setDescription("Phase 2 API skeleton OpenAPI contract")
        .setVersion("0.0.0")
        .build();

      const document = SwaggerModule.createDocument(app, config);
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, `${JSON.stringify(document, null, 2)}\n`, "utf8");

      expect(fs.existsSync(outputPath)).toBe(true);
      expect(JSON.stringify(document)).toContain("/api/health");
      expect(JSON.stringify(document)).toContain("/api/ready");
      expect(JSON.stringify(document)).toContain("/api/idempotency/probe");
      expect(JSON.stringify(document)).toContain("/api/storage/signed-url/upload");
      expect(JSON.stringify(document)).toContain("/api/storage/signed-url/download");
      expect(JSON.stringify(document)).toContain("/api/storage/synthetic-objects");
      expect(JSON.stringify(document)).toContain("/api/observability/probe");
    } finally {
      await app.close();
    }
  });
});
