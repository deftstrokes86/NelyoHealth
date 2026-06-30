import { expect, type Page, type Request, type TestInfo } from "@playwright/test";
import {
  approvedSyntheticStorageKeys,
  approvedSyntheticStorageKeyPrefixes,
  forbiddenProtectedSentinels,
  localOriginAllowList
} from "./synthetic-smoke-data.js";

export interface BrowserGuardState {
  consoleErrors: string[];
  pageErrors: string[];
  failedRequests: string[];
  externalRequests: string[];
  unexpectedMessages: string[];
}

function isAllowedLocalUrl(rawUrl: string): boolean {
  try {
    const url = new URL(rawUrl);
    return (
      localOriginAllowList.some((origin) => rawUrl.startsWith(origin)) && url.protocol === "http:"
    );
  } catch {
    return false;
  }
}

function requestSummary(request: Request): string {
  return `${request.method()} ${request.url()}`;
}

export function installBrowserGuards(page: Page, testInfo?: TestInfo): BrowserGuardState {
  const state: BrowserGuardState = {
    consoleErrors: [],
    pageErrors: [],
    failedRequests: [],
    externalRequests: [],
    unexpectedMessages: []
  };

  page.on("console", (message) => {
    if (message.type() === "error") {
      state.consoleErrors.push(message.text());
    }
  });

  page.on("pageerror", (error) => {
    state.pageErrors.push(error.message);
  });

  page.on("request", (request) => {
    if (!isAllowedLocalUrl(request.url())) {
      state.externalRequests.push(requestSummary(request));
    }
  });

  page.on("requestfailed", (request) => {
    state.failedRequests.push(
      `${requestSummary(request)} ${request.failure()?.errorText ?? "failed"}`
    );
  });

  testInfo?.annotations.push({
    type: "browser-guards",
    description: "local-only synthetic guard active"
  });
  return state;
}

export async function expectNoBrowserGuardFailures(state: BrowserGuardState): Promise<void> {
  expect.soft(state.consoleErrors, "unexpected console errors").toEqual([]);
  expect.soft(state.pageErrors, "uncaught browser exceptions").toEqual([]);
  expect.soft(state.failedRequests, "failed first-party requests").toEqual([]);
  expect.soft(state.externalRequests, "unexpected external requests").toEqual([]);
  expect(state.unexpectedMessages, "unexpected browser messages").toEqual([]);
}

export async function expectNoProtectedSentinels(page: Page): Promise<void> {
  const html = await page.content();
  const lowerHtml = html.toLowerCase();
  for (const sentinel of forbiddenProtectedSentinels) {
    expect(lowerHtml, `protected sentinel must be absent: ${sentinel}`).not.toContain(sentinel);
  }
}

export async function expectNoUnexpectedStorage(page: Page): Promise<void> {
  const storage = await page.evaluate(
    async ({ approvedKeys, approvedPrefixes }) => {
      const isApproved = (key: string) =>
        approvedKeys.includes(key) || approvedPrefixes.some((prefix) => key.startsWith(prefix));

      const localKeys = Object.keys(localStorage);
      const sessionKeys = Object.keys(sessionStorage);
      const indexedDbNames =
        "databases" in indexedDB
          ? (await indexedDB.databases()).map((database) => database.name ?? "")
          : [];
      const serviceWorkers =
        "serviceWorker" in navigator ? await navigator.serviceWorker.getRegistrations() : [];
      return {
        localKeys,
        sessionKeys,
        indexedDbNames,
        serviceWorkerCount: serviceWorkers.length,
        unexpectedLocalKeys: localKeys.filter((key) => !isApproved(key)),
        unexpectedSessionKeys: sessionKeys.filter((key) => !isApproved(key))
      };
    },
    {
      approvedKeys: approvedSyntheticStorageKeys,
      approvedPrefixes: approvedSyntheticStorageKeyPrefixes
    }
  );

  expect(storage.unexpectedLocalKeys, "unexpected localStorage keys").toEqual([]);
  expect(storage.unexpectedSessionKeys, "unexpected sessionStorage keys").toEqual([]);
  expect(storage.indexedDbNames, "unexpected IndexedDB databases").toEqual([]);
  expect(storage.serviceWorkerCount, "unexpected service workers").toBe(0);
}

export async function expectNoViewportOverflow(page: Page): Promise<void> {
  const overflow = await page.evaluate(() => ({
    horizontal: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth
  }));
  expect(
    overflow.horizontal,
    `viewport overflow ${overflow.scrollWidth}/${overflow.clientWidth}`
  ).toBe(false);
}

export async function expectVisibleFocus(page: Page): Promise<void> {
  await page.keyboard.press("Tab");
  const outline = await page.evaluate(() => {
    const active = document.activeElement;
    if (!active) {
      return "";
    }
    const style = getComputedStyle(active);
    return `${style.outlineStyle} ${style.outlineWidth}`;
  });
  expect(outline).not.toContain("none 0px");
}
