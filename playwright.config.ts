import { defineConfig, devices } from "@playwright/test";
const smokePort = Number(process.env.PLAYWRIGHT_SMOKE_PORT ?? 4173);
const designPort = Number(process.env.PLAYWRIGHT_DESIGN_PORT ?? 4273);
export default defineConfig({
  testDir: ".",
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
  use: {
    baseURL: `http://127.0.0.1:${smokePort}`,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 10_000,
    navigationTimeout: 15_000
  },
  webServer: [
    {
      command: `pnpm node scripts/browser-smoke-server.mjs --host 127.0.0.1 --port ${smokePort}`,
      url: `http://127.0.0.1:${smokePort}`,
      reuseExistingServer: !process.env.CI,
      timeout: 20_000
    },
    {
      command: `pnpm --filter @nelyohealth/design-foundation-preview dev -- --host 127.0.0.1 --port ${designPort}`,
      url: `http://127.0.0.1:${designPort}`,
      reuseExistingServer: !process.env.CI,
      timeout: 30_000
    }
  ],
  projects: [
    {
      name: "chromium",
      testMatch: ["tests/e2e/**/*.spec.ts"],
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 1000 } }
    },
    {
      name: "tablet-chromium",
      testMatch: ["tests/e2e/design-foundation-preview.spec.ts"],
      use: { ...devices["iPad Pro 11 landscape"], browserName: "chromium" }
    },
    {
      name: "mobile-chromium",
      testMatch: ["tests/e2e/design-foundation-preview.spec.ts"],
      use: { ...devices["Pixel 7"], browserName: "chromium" }
    },
    {
      name: "accessibility-chromium",
      testMatch: ["tests/accessibility/**/*.spec.ts"],
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 1000 } }
    },
    {
      name: "visual-chromium",
      testMatch: ["tests/visual/**/*.spec.ts"],
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 1000 } }
    }
  ]
});
