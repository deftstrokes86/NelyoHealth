import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import {
  expectNoBrowserGuardFailures,
  expectNoProtectedSentinels,
  expectNoViewportOverflow,
  installBrowserGuards
} from "../helpers/browser-assertions.js";
import { getIss014ShellAppByProjectName } from "../helpers/iss014-browser-harness.js";

test.describe("ISS-014 browser harness shell accessibility smoke", () => {
  test("passes accessibility checks for each web shell project", async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name === "accessibility-chromium",
      "ISS-014 shell harness accessibility checks expect per-shell project names."
    );

    const shellApp = getIss014ShellAppByProjectName(testInfo.project.name);
    const guards = installBrowserGuards(page, testInfo);

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1, name: shellApp.heading })).toBeVisible();
    await expect(page.getByText("This shell is synthetic-only", { exact: false })).toBeVisible();
    await expect(page.getByText("Phase 2 Foundation")).toBeVisible();

    await expectNoViewportOverflow(page);
    await expectNoProtectedSentinels(page);

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
    await expectNoBrowserGuardFailures(guards);
  });
});
