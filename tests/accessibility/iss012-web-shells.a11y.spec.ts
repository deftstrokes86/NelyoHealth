import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import {
  expectNoBrowserGuardFailures,
  expectNoProtectedSentinels,
  expectNoViewportOverflow,
  installBrowserGuards
} from "../helpers/browser-assertions.js";

const expectedHeadingByProject: Record<string, string> = {
  "patient-shell-a11y": "Patient Web Shell",
  "provider-shell-a11y": "Provider Web Shell",
  "organization-shell-a11y": "Organization Web Shell",
  "admin-shell-a11y": "Admin Web Shell"
};

test.describe("ISS-012 Next.js web shell accessibility smoke", () => {
  test("passes shell-level accessibility assertions", async ({ page }, testInfo) => {
    const expectedHeading = expectedHeadingByProject[testInfo.project.name];
    const guards = installBrowserGuards(page, testInfo);

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1, name: expectedHeading })).toBeVisible();
    await expect(page.getByText("This shell is synthetic-only", { exact: false })).toBeVisible();
    await expect(page.getByText("Phase 2 Foundation")).toBeVisible();

    await expectNoViewportOverflow(page);
    await expectNoProtectedSentinels(page);

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
    await expectNoBrowserGuardFailures(guards);
  });
});
