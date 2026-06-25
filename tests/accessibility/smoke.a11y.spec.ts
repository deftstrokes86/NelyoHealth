import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import {
  expectNoBrowserGuardFailures,
  expectNoViewportOverflow,
  installBrowserGuards
} from "../helpers/browser-assertions.js";
import { smokeCopy } from "../helpers/synthetic-smoke-data.js";

test.describe("synthetic accessibility smoke", () => {
  test("passes automated smoke checks and deterministic accessibility assertions", async ({
    page
  }, testInfo) => {
    const guards = installBrowserGuards(page, testInfo);

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    await expect(page.getByRole("heading", { name: smokeCopy.heading, level: 1 })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Smoke sections" })).toBeVisible();
    await expect(page.getByLabel("Synthetic label")).toBeVisible();
    await expect(page.getByRole("button", { name: "Update synthetic status" })).toBeVisible();
    await expect(page.locator("#live-status")).toHaveAttribute("aria-live", "polite");

    await page.getByRole("button", { name: "Submit synthetic form" }).click();
    await expect(page.getByLabel("Synthetic label")).toHaveAttribute(
      "aria-describedby",
      "synthetic-name-help synthetic-name-error"
    );

    await page.getByRole("button", { name: "Open synthetic dialog" }).click();
    await expect(page.getByRole("dialog", { name: smokeCopy.dialogTitle })).toBeVisible();
    await expect(page.getByRole("button", { name: "Close dialog" })).toBeFocused();
    await page.getByRole("button", { name: "Close dialog" }).click();

    await expectNoViewportOverflow(page);

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
    await expectNoBrowserGuardFailures(guards);
  });
});
