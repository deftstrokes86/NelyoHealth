import { expect, test } from "@playwright/test";
import {
  attachFoundationGuards,
  designPreviewUrl,
  expectNoProtectedSentinels
} from "../helpers/design-foundation-assertions";

async function waitForStableLayout(page: import("@playwright/test").Page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
    );
  });
}

test.describe("design foundation visual contract", () => {
  test("keeps the synthetic foundation visually stable without screenshot baselines", async ({
    page
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const guards = await attachFoundationGuards(page);

    await page.goto(designPreviewUrl, { waitUntil: "networkidle" });
    await page.addStyleTag({
      content:
        "*, *::before, *::after { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; scroll-behavior: auto !important; }"
    });
    await waitForStableLayout(page);

    await expect(page.getByRole("heading", { name: /Warm Care Grid/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Token system/i })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Content registry and provider-disclosure boundary/i })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Motion profiles and safety immediacy/i })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Responsive and accessibility foundation/i })
    ).toBeVisible();

    const visualState = await page.evaluate(() => {
      function tokenColor(name: string) {
        const probe = document.createElement("span");
        probe.style.color = `var(${name})`;
        document.body.append(probe);
        const color = getComputedStyle(probe).color;
        probe.remove();
        return color;
      }
      const root = document.documentElement;
      const main = document.querySelector("main") as HTMLElement | null;
      const h1 = document.querySelector("h1") as HTMLElement | null;
      const majorRegions = Array.from(document.querySelectorAll("main > *"));
      const boxes = majorRegions.map((region) => region.getBoundingClientRect());
      const overlaps = boxes.some((box, index) =>
        boxes
          .slice(index + 1)
          .some(
            (other) =>
              box.left < other.right &&
              box.right > other.left &&
              box.top < other.bottom &&
              box.bottom > other.top
          )
      );
      return {
        majorRegionCount: majorRegions.length,
        horizontalOverflow: root.scrollWidth > root.clientWidth + 1,
        mainWidth: main?.getBoundingClientRect().width ?? 0,
        viewportWidth: window.innerWidth,
        h1Color: h1 ? getComputedStyle(h1).color : "",
        expectedInk: tokenColor("--nh-color-ink-900"),
        bodyBackground: getComputedStyle(document.body).backgroundImage,
        overlaps,
        reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches
      };
    });

    expect(visualState.majorRegionCount).toBeGreaterThanOrEqual(5);
    expect(visualState.horizontalOverflow).toBe(false);
    expect(visualState.mainWidth).toBeLessThanOrEqual(visualState.viewportWidth);
    expect(visualState.h1Color).toBe(visualState.expectedInk);
    expect(visualState.bodyBackground).toContain("gradient");
    expect(visualState.overlaps).toBe(false);
    expect(visualState.reducedMotion).toBe(true);

    await page.getByRole("button", { name: /Toggle emergency panel/i }).click();
    await expect(page.getByRole("alert", { name: /Emergency escalation/i })).toBeVisible();
    await expectNoProtectedSentinels(page);
    expect(guards.externalRequests).toEqual([]);
    expect(guards.failedRequests).toEqual([]);
    expect(guards.consoleErrors).toEqual([]);
  });
});
