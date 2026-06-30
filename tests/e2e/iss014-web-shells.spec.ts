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
    const shellApp = getIss014ShellAppByProjectName(testInfo.project.name);
    const guards = installBrowserGuards(page, testInfo);

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1, name: shellApp.heading })).toBeVisible();
    await expect(page.getByText("This shell is synthetic-only", { exact: false })).toBeVisible();
    await expect(page.getByText("Phase 2 Foundation")).toBeVisible();

    await expectNoViewportOverflow(page);
    await expectNoUnexpectedStorage(page);
    await expectNoProtectedSentinels(page);
    await expectNoBrowserGuardFailures(guards);
  });
});
