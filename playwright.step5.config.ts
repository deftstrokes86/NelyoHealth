import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report/step5" }]],
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 10_000,
    navigationTimeout: 15_000
  },
  projects: [
    {
      name: "chromium",
      testMatch: ["tests/e2e/identity-tenancy-journeys.spec.ts"],
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 1000 } }
    },
    {
      name: "tablet-chromium",
      testMatch: ["tests/e2e/identity-tenancy-journeys.spec.ts"],
      use: { ...devices["iPad Pro 11 landscape"], browserName: "chromium" }
    },
    {
      name: "mobile-chromium",
      testMatch: ["tests/e2e/identity-tenancy-journeys.spec.ts"],
      use: { ...devices["Pixel 7"], browserName: "chromium" }
    },
    {
      name: "accessibility-chromium",
      testMatch: ["tests/accessibility/identity-tenancy-journeys.a11y.spec.ts"],
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 1000 } }
    },
    {
      name: "accessibility-tablet-chromium",
      testMatch: ["tests/accessibility/identity-tenancy-journeys.a11y.spec.ts"],
      use: { ...devices["iPad Pro 11 landscape"], browserName: "chromium" }
    },
    {
      name: "accessibility-mobile-chromium",
      testMatch: ["tests/accessibility/identity-tenancy-journeys.a11y.spec.ts"],
      use: { ...devices["Pixel 7"], browserName: "chromium" }
    }
  ]
});
