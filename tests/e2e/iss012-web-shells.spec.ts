import { expect, test } from "@playwright/test";
import {
  expectNoBrowserGuardFailures,
  expectNoProtectedSentinels,
  expectNoUnexpectedStorage,
  expectNoViewportOverflow,
  installBrowserGuards
} from "../helpers/browser-assertions.js";

const expectedHeadingByProject: Record<string, string> = {
  "patient-shell-smoke": "Patient Web Shell",
  "provider-shell-smoke": "Provider Web Shell",
  "organization-shell-smoke": "Organization Web Shell",
  "admin-shell-smoke": "Admin Web Shell"
};

test.describe("ISS-012 Next.js web shell smoke", () => {
  test("renders synthetic-only shell without protected provider details", async ({
    page
  }, testInfo) => {
    const expectedHeading = expectedHeadingByProject[testInfo.project.name];
    const guards = installBrowserGuards(page, testInfo);

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1, name: expectedHeading })).toBeVisible();
    await expect(page.getByText("This shell is synthetic-only", { exact: false })).toBeVisible();
    await expect(page.getByText("Phase 2 Foundation")).toBeVisible();

    await expectNoViewportOverflow(page);
    await expectNoUnexpectedStorage(page);
    await expectNoProtectedSentinels(page);
    await expectNoBrowserGuardFailures(guards);
  });
});
