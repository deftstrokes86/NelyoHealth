import { expect, test } from "@playwright/test";
import {
  expectNoBrowserGuardFailures,
  expectNoProtectedSentinels,
  expectNoUnexpectedStorage,
  expectNoViewportOverflow,
  installBrowserGuards
} from "../helpers/browser-assertions.js";
import { getIss014ShellAppByProjectName } from "../helpers/iss014-browser-harness.js";

test.describe("ISS-014 browser harness shell smoke", () => {
  test("renders each web shell with per-app storage state and privacy guards", async ({
    page
  }, testInfo) => {
    test.skip(
      testInfo.project.name === "chromium",
      "ISS-014 shell harness expects per-shell project names and storage states."
    );

    const shellApp = getIss014ShellAppByProjectName(testInfo.project.name);
    const guards = installBrowserGuards(page, testInfo);

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1, name: shellApp.heading })).toBeVisible();
    await expect(page.getByText("This shell is synthetic-only", { exact: false })).toBeVisible();
    await expect(page.getByText("Phase 2 Foundation")).toBeVisible();
    await expect(page.getByText("Phase 5 Foundation")).toBeVisible();

    const shellStates = page.locator("[data-shell-state]");
    await expect(shellStates).toHaveCount(6);
    await expect(page.locator('[data-shell-state="loading"]')).toBeVisible();
    await expect(page.locator('[data-shell-state="empty"]')).toBeVisible();
    await expect(page.locator('[data-shell-state="error"]')).toBeVisible();
    await expect(page.locator('[data-shell-state="unauthorized"]')).toBeVisible();
    await expect(page.locator('[data-shell-state="offline"]')).toBeVisible();
    await expect(page.locator('[data-shell-state="reduced-motion"]')).toBeVisible();

    await expectNoViewportOverflow(page);
    await expectNoUnexpectedStorage(page);
    await expectNoProtectedSentinels(page);
    await expectNoBrowserGuardFailures(guards);
  });
});
