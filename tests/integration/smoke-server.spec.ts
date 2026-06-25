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

      const missingResponse = await fetch(`${baseURL}/../package.json`);
      expect(missingResponse.status).toBe(404);
    } finally {
      await stopServer(server);
    }
  });
});
