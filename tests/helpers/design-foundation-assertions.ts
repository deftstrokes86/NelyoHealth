import { expect, type Page, type Request } from "@playwright/test";
export const designPreviewUrl =
  "http://127.0.0.1:" + (process.env.PLAYWRIGHT_DESIGN_PORT ?? "4273");
export const protectedSentinels = [
  "PROTECTED_ADDRESS_SENTINEL",
  "PROTECTED_COORDINATE_SENTINEL",
  "PROTECTED_DISTANCE_SENTINEL",
  "PROTECTED_BRANCH_SENTINEL",
  "PROTECTED_PHONE_SENTINEL",
  "PROTECTED_PICKUP_SENTINEL",
  "PROTECTED_MAP_SENTINEL"
];
export const attachFoundationGuards = async (page: Page) => {
  const externalRequests: string[] = [];
  const failedRequests: string[] = [];
  const consoleErrors: string[] = [];
  page.on("request", (request: Request) => {
    const url = request.url();
    if (!url.startsWith(designPreviewUrl) && !url.startsWith("data:") && !url.startsWith("blob:"))
      externalRequests.push(url);
  });
  page.on("requestfailed", (request) =>
    failedRequests.push(request.method() + " " + request.url())
  );
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  return { externalRequests, failedRequests, consoleErrors };
};
export const expectNoProtectedSentinels = async (page: Page) => {
  const html = await page.content();
  const source = await page.locator("body").evaluate((body) => body.innerHTML);
  const storage = await page.evaluate(() =>
    JSON.stringify({ local: { ...localStorage }, session: { ...sessionStorage } })
  );
  for (const sentinel of protectedSentinels) {
    expect(html, sentinel + " must not appear in HTML").not.toContain(sentinel);
    expect(source, sentinel + " must not appear in source output").not.toContain(sentinel);
    expect(storage, sentinel + " must not appear in browser storage").not.toContain(sentinel);
  }
};
