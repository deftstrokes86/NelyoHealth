import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const APP_ROOT = join(__dirname, "..", "..", "apps", "patient-web", "app");

const collectRouteFiles = (dir: string, acc: string[] = []) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "_gallery" || entry.name.startsWith("_")) continue;
      collectRouteFiles(full, acc);
      continue;
    }
    if (entry.name === "page.tsx" || entry.name === "layout.tsx") acc.push(full);
  }
  return acc;
};

const routeFiles = collectRouteFiles(APP_ROOT);

const stripAllowedText = (source: string) => {
  let cleaned = source.replace(/\/\/.*$/gm, "");
  cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, "");
  cleaned = cleaned.replace(/"(?:[^"\\]|\\.)*"/g, '""');
  cleaned = cleaned.replace(/'(?:[^'\\]|\\.)*'/g, "''");
  cleaned = cleaned.replace(/`(?:[^`\\]|\\.)*`/g, "``");
  return cleaned;
};

const findJsxTextViolations = (source: string): string[] => {
  const cleaned = stripAllowedText(source);
  const pattern = />(?:\s|\r|\n)*([A-Za-z][A-Za-z][A-Za-z]+[^<{]*)</g;
  const violations: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(cleaned)) !== null) {
    const text = match[1].trim();
    if (text.length === 0) continue;
    violations.push(text);
  }
  return violations;
};

describe("marketing pages boundary — no inline strings", () => {
  it("collects the expected route files", () => {
    expect(routeFiles.length).toBeGreaterThan(0);
    expect(routeFiles.some((path) => path.endsWith("layout.tsx"))).toBe(true);
    expect(routeFiles.filter((path) => path.endsWith("page.tsx")).length).toBeGreaterThanOrEqual(
      15
    );
  });

  for (const file of routeFiles) {
    const label = relative(join(__dirname, "..", ".."), file).replaceAll("\\", "/");
    it(`${label} has no inline human-readable JSX text`, () => {
      const source = readFileSync(file, "utf8");
      const violations = findJsxTextViolations(source);
      expect(violations, `Inline strings in ${label}: ${JSON.stringify(violations)}`).toEqual([]);
    });
  }
});

describe("marketing redirects boundary", () => {
  const nextConfig = readFileSync(
    join(APP_ROOT, "..", "next.config.mjs"),
    "utf8"
  );

  const expectedRedirects: Array<[string, string]> = [
    ["/for-diaspora", "/diaspora"],
    ["/for-doctors", "/doctors"],
    ["/for-care-partners", "/family-plans"],
    ["/for-pharmacies", "/pharmacies"],
    ["/for-labs", "/laboratories"],
    ["/for-employers", "/employers"],
    ["/for-hmos", "/hmos"],
    ["/for-hospitals", "/hospitals-and-referrals"],
    ["/trust-safety", "/trust-and-safety"],
    ["/login", "/sign-in"],
    ["/register", "/create-account"],
    ["/help", "/contact"],
    ["/patient", "/patients"]
  ];

  for (const [source, destination] of expectedRedirects) {
    it(`redirects ${source} to ${destination}`, () => {
      const escaped = source.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const destinationEscaped = destination.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const pattern = new RegExp(
        `source:\\s*["']${escaped}["'][\\s\\S]{0,200}destination:\\s*["']${destinationEscaped}["']`
      );
      expect(pattern.test(nextConfig), `${source} -> ${destination} redirect missing`).toBe(true);
    });
  }

  it("marks every redirect as permanent (301)", () => {
    const permanentMatches = nextConfig.match(/permanent:\s*true/g) ?? [];
    expect(permanentMatches.length).toBeGreaterThanOrEqual(expectedRedirects.length);
  });

  it("does not redirect into a loop", () => {
    const map = new Map(expectedRedirects);
    for (const source of map.keys()) {
      let cursor = source;
      const visited = new Set<string>();
      let steps = 0;
      while (map.has(cursor)) {
        if (visited.has(cursor)) {
          throw new Error(`Redirect loop detected starting at ${source}`);
        }
        visited.add(cursor);
        cursor = map.get(cursor) as string;
        steps += 1;
        if (steps > 10) throw new Error(`Runaway redirects from ${source}`);
      }
    }
  });
});
