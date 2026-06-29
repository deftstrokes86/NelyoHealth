import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { once } from "node:events";
import { describe, expect, it } from "vitest";

const port = 4183;
const baseURL = `http://127.0.0.1:${port}`;

async function waitForServer(): Promise<void> {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(`${baseURL}/api/smoke`);
      if (response.ok) {
        return;
      }
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
  throw new Error("Synthetic smoke server did not become ready.");
}

async function stopServer(server: ChildProcessWithoutNullStreams): Promise<void> {
  if (server.killed) {
    return;
  }
  server.kill("SIGTERM");
  await Promise.race([once(server, "exit"), new Promise((resolve) => setTimeout(resolve, 1500))]);
}

describe("synthetic browser smoke server", () => {
  it("serves only approved local smoke surfaces and endpoint responses", async () => {
    const server = spawn(process.execPath, ["tools/browser-smoke/server.mjs"], {
      env: { ...process.env, SMOKE_HOST: "127.0.0.1", SMOKE_PORT: String(port) }
    });

    try {
      await waitForServer();
      const pageResponse = await fetch(`${baseURL}/`);
      const page = await pageResponse.text();
      expect(pageResponse.headers.get("content-type")).toContain("text/html");
      expect(page).toContain("NelyoHealth Browser Smoke Check");

      const apiResponse = await fetch(`${baseURL}/api/smoke`);
      await expect(apiResponse.json()).resolves.toMatchObject({
        synthetic: true,
        environment: "local-only",
        status: "synthetic-ok"
      });

      const paymentRouteResponse = await fetch(`${baseURL}/api/payment-transition`);
      expect(paymentRouteResponse.headers.get("cache-control")).toContain("no-store");
      await expect(paymentRouteResponse.json()).resolves.toMatchObject({
        data: {
          paymentId: "payment-route-1",
          status: "initiated"
        },
        meta: {
          operationTag: "payment.transition",
          decisionReasonTag: "to:initiated"
        },
        errors: []
      });

      const refundRouteResponse = await fetch(`${baseURL}/api/refund-transition`);
      expect(refundRouteResponse.headers.get("cache-control")).toContain("no-store");
      await expect(refundRouteResponse.json()).resolves.toMatchObject({
        data: {
          refundId: "refund-route-1",
          status: "eligibility-review"
        },
        meta: {
          operationTag: "refund.transition",
          decisionReasonTag: "to:eligibility-review"
        },
        errors: []
      });

      const disclosureRouteResponse = await fetch(
        `${baseURL}/api/disclosure-eligibility?orderId=order-route-1&providerDisplayName=Route%20Provider&paymentStatus=settled&hasAuthorization=true&sameTenant=true`
      );
      expect(disclosureRouteResponse.headers.get("cache-control")).toContain("no-store");
      await expect(disclosureRouteResponse.json()).resolves.toMatchObject({
        data: {
          orderId: "order-route-1",
          status: "eligible",
          reasonCode: "eligible",
          providerDisplayName: "Route Provider"
        },
        meta: {
          operationTag: "provider-disclosure.eligibility.evaluate",
          decisionReasonTag: "eligible"
        },
        errors: []
      });

      const missingResponse = await fetch(`${baseURL}/../package.json`);
      expect(missingResponse.status).toBe(404);
    } finally {
      await stopServer(server);
    }
  });
});
