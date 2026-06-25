import { defineConfig, devices } from "@playwright/test";

const smokePort = Number(process.env.SMOKE_PORT ?? 4173);
const smokeHost = process.env.SMOKE_HOST ?? "127.0.0.1";
const baseURL = `http://${smokeHost}:${smokePort}`;

export default defineConfig({
  testDir: ".",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 30_000,
  expect: {
    timeout: 5_000
  },
  outputDir: ".artifacts/playwright/test-results",
  reporter: [
    ["list"],
    ["html", { outputFolder: ".artifacts/playwright/html-report", open: "never" }]
  ],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
    ignoreHTTPSErrors: false
  },
  webServer: {
    command: "node tools/browser-smoke/server.mjs",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 15_000,
    env: {
      SMOKE_HOST: smokeHost,
      SMOKE_PORT: String(smokePort)
    }
  },
  projects: [
    {
      name: "chromium-desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
        colorScheme: "light"
      }
    },
    {
      name: "chromium-tablet",
      use: {
        browserName: "chromium",
        viewport: { width: 820, height: 1180 },
        isMobile: true,
        hasTouch: true,
        deviceScaleFactor: 2,
        userAgent:
          "Mozilla/5.0 (Linux; Android 13; Synthetic Tablet) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        colorScheme: "light"
      }
    },
    {
      name: "chromium-mobile",
      use: {
        ...devices["Pixel 7"],
        browserName: "chromium",
        colorScheme: "light"
      }
    }
  ]
});
