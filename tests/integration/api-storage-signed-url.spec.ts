import { afterEach, describe, expect, it } from "vitest";
import type { INestApplication } from "@nestjs/common";
import type { AddressInfo } from "node:net";
import { createNestApiApp } from "../../apps/api/src/nest/bootstrap.js";

async function startApp(app: INestApplication): Promise<number> {
  await app.init();
  const server = app.getHttpServer();
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", () => resolve()));
  return (server.address() as AddressInfo).port;
}

describe("api synthetic storage signed URL runtime", () => {
  let app: INestApplication | undefined;

  afterEach(async () => {
    if (app) {
      await app.close();
      app = undefined;
    }
  });

  it("issues upload/download URLs and supports synthetic cleanup", async () => {
    app = await createNestApiApp();
    const port = await startApp(app);

    const uploadRes = await fetch(`http://127.0.0.1:${port}/api/storage/signed-url/upload`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-request-id": "req-iss009-upload",
        "x-correlation-id": "corr-iss009-upload"
      },
      body: JSON.stringify({
        syntheticDocumentId: "iss009-doc",
        contentType: "application/octet-stream",
        expiresInSeconds: 180
      })
    });

    expect(uploadRes.status).toBe(201);
    const uploadBody = await uploadRes.json();
    expect(uploadBody).toMatchObject({
      data: {
        operation: "upload",
        method: "PUT",
        key: "synthetic/documents/iss009-doc/source.bin",
        expiresInSeconds: 180,
        bucket: "nelyohealth-synthetic"
      },
      meta: {
        operationTag: "api.storage.signed-url.upload"
      }
    });
    expect(uploadBody.data.url).toContain("X-Amz-Expires=180");

    const downloadRes = await fetch(`http://127.0.0.1:${port}/api/storage/signed-url/download`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        syntheticDocumentId: "iss009-doc",
        expiresInSeconds: 120
      })
    });

    expect(downloadRes.status).toBe(201);
    const downloadBody = await downloadRes.json();
    expect(downloadBody.data.method).toBe("GET");
    expect(downloadBody.data.url).toContain("X-Amz-Expires=120");

    const cleanupRes = await fetch(`http://127.0.0.1:${port}/api/storage/synthetic-objects`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        syntheticDocumentIdPrefix: "iss009-doc"
      })
    });

    expect(cleanupRes.status).toBe(200);
    const cleanupBody = await cleanupRes.json();
    expect(cleanupBody.data.cleanedCount).toBeGreaterThanOrEqual(1);
    expect(cleanupBody.data.cleanedKeys[0]).toContain("synthetic/documents/iss009-doc/");

    const serialized = JSON.stringify({ uploadBody, downloadBody, cleanupBody });
    expect(serialized).not.toContain("providerAddress");
    expect(serialized).not.toContain("paymentCard");
  });
});
