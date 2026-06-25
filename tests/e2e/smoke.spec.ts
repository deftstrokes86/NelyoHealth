import { expect, test } from "@playwright/test";
import {
  expectNoBrowserGuardFailures,
  expectNoProtectedSentinels,
  expectNoUnexpectedStorage,
  expectNoViewportOverflow,
  expectVisibleFocus,
  installBrowserGuards
} from "../helpers/browser-assertions.js";
import { smokeCopy } from "../helpers/synthetic-smoke-data.js";

test.describe("synthetic browser smoke", () => {
  test("loads, interacts, preserves focus, and avoids protected data", async ({
    page
  }, testInfo) => {
    const guards = installBrowserGuards(page, testInfo);

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    await expect(page.getByRole("heading", { name: smokeCopy.heading, level: 1 })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Smoke sections" })).toBeVisible();
    await expectNoViewportOverflow(page);
    await expectVisibleFocus(page);

    await page.getByRole("button", { name: "Update synthetic status" }).click();
    await expect(
      page.getByRole("status").filter({ hasText: smokeCopy.updatedStatus })
    ).toBeVisible();

    await page.getByRole("button", { name: "Submit synthetic form" }).click();
    const input = page.getByLabel("Synthetic label");
    await expect(input).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByText(smokeCopy.validationError)).toBeVisible();
    await expect(input).toBeFocused();

    await input.fill("ready");
    await page.getByRole("button", { name: "Submit synthetic form" }).click();
    await expect(page.getByText(smokeCopy.validationError)).toBeHidden();

    await page.getByRole("button", { name: "Open synthetic dialog" }).click();
    await expect(page.getByRole("dialog", { name: smokeCopy.dialogTitle })).toBeVisible();
    await expect(page.getByRole("button", { name: "Close dialog" })).toBeFocused();
    await page.getByRole("button", { name: "Close dialog" }).click();
    await expect(page.getByRole("button", { name: "Open synthetic dialog" })).toBeFocused();

    const requestPromise = page.waitForResponse((response) =>
      response.url().endsWith("/api/smoke")
    );
    await page.getByRole("button", { name: "Run same-origin check" }).click();
    await expect(page.getByText(smokeCopy.asyncLoading)).toBeVisible();
    const response = await requestPromise;
    expect(response.ok()).toBe(true);
    await expect(page.getByText(smokeCopy.asyncSuccess)).toBeVisible();

    await page.getByRole("button", { name: "Show synthetic error state" }).click();
    await expect(page.getByText(smokeCopy.asyncError)).toBeVisible();

    await expectNoUnexpectedStorage(page);
    await expectNoProtectedSentinels(page);
    await expectNoBrowserGuardFailures(guards);
  });
});
