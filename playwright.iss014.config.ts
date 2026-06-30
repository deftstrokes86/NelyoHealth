import { defineConfig, devices } from "@playwright/test";
import { iss014ShellApps } from "./tests/helpers/iss014-browser-harness.js";

const webServerConfigs = iss014ShellApps.map((shellApp) => ({
  command: `pnpm --filter @nelyohealth/${shellApp.appName} exec next dev --hostname 127.0.0.1 --port ${shellApp.port}`,
  url: `http://127.0.0.1:${shellApp.port}`,
  reuseExistingServer: !process.env.CI,
  timeout: 120_000
}));

const authStateDir = ".artifacts/playwright-auth";

export default defineConfig({
  testDir: ".",
  globalSetup: "./tests/helpers/iss014-global-setup.mjs",
  timeout: 45_000,
  expect: { timeout: 8_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report/iss014" }]],
  use: {
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 10_000,
    navigationTimeout: 20_000
  },
  webServer: webServerConfigs,
  projects: iss014ShellApps.flatMap((shellApp) => [
    {
      name: `${shellApp.appName}-desktop`,
      testMatch: ["tests/e2e/iss014-web-shells.spec.ts"],
      use: {
        ...devices["Desktop Chrome"],
        baseURL: `http://127.0.0.1:${shellApp.port}`,
        storageState: `${authStateDir}/${shellApp.authStateFile}`
      }
    },
    {
      name: `${shellApp.appName}-tablet`,
      testMatch: ["tests/e2e/iss014-web-shells.spec.ts"],
      use: {
        ...devices["iPad Pro 11 landscape"],
        browserName: "chromium",
        baseURL: `http://127.0.0.1:${shellApp.port}`,
        storageState: `${authStateDir}/${shellApp.authStateFile}`
      }
    },
    {
      name: `${shellApp.appName}-mobile`,
      testMatch: ["tests/e2e/iss014-web-shells.spec.ts"],
      use: {
        ...devices["Pixel 7"],
        browserName: "chromium",
        baseURL: `http://127.0.0.1:${shellApp.port}`,
        storageState: `${authStateDir}/${shellApp.authStateFile}`
      }
    },
    {
      name: `${shellApp.appName}-desktop-a11y`,
      testMatch: ["tests/accessibility/iss014-web-shells.a11y.spec.ts"],
      use: {
        ...devices["Desktop Chrome"],
        baseURL: `http://127.0.0.1:${shellApp.port}`,
        storageState: `${authStateDir}/${shellApp.authStateFile}`
      }
    },
    {
      name: `${shellApp.appName}-tablet-a11y`,
      testMatch: ["tests/accessibility/iss014-web-shells.a11y.spec.ts"],
      use: {
        ...devices["iPad Pro 11 landscape"],
        browserName: "chromium",
        baseURL: `http://127.0.0.1:${shellApp.port}`,
        storageState: `${authStateDir}/${shellApp.authStateFile}`
      }
    },
    {
      name: `${shellApp.appName}-mobile-a11y`,
      testMatch: ["tests/accessibility/iss014-web-shells.a11y.spec.ts"],
      use: {
        ...devices["Pixel 7"],
        browserName: "chromium",
        baseURL: `http://127.0.0.1:${shellApp.port}`,
        storageState: `${authStateDir}/${shellApp.authStateFile}`
      }
    }
  ])
});
