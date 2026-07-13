import { describe, expect, it } from "vitest";
import { syntheticPreviewContent } from "./synthetic-preview-content";
import { assertNoProtectedProviderLeakage } from "./validation";
import { marketingContentEntries } from "./entries/marketing/index";
import { approvedCtaIds, isApprovedCtaId } from "./cta-ids";
import { assertVoiceToneClean, lintContentRegistry } from "./voice-tone-lint";
import { validateContentRegistry } from "./validation";

describe("CTA alignment", () => {
  it("keeps CTAs aligned with locked requirements", () => {
    assertNoProtectedProviderLeakage(syntheticPreviewContent);
    expect(
      syntheticPreviewContent.find((entry) => entry.id === "emergency-escalation.always-available")
        ?.body
    ).toMatch(/never blocked/i);
  });

  it("every marketing-cta entry references an approved CTA-ID", () => {
    const ctas = marketingContentEntries.filter(
      (entry) => entry.family === "marketing-cta"
    );
    expect(ctas.length).toBeGreaterThan(0);
    for (const entry of ctas) {
      expect(entry.cta, `marketing-cta.${entry.id} must set the cta field`).toBeDefined();
      expect(
        isApprovedCtaId(entry.cta),
        `${entry.id}.cta="${entry.cta}" not in approvedCtaIds`
      ).toBe(true);
    }
  });

  it("covers each approved CTA-ID at least once", () => {
    const seen = new Set(
      marketingContentEntries
        .filter((entry) => entry.family === "marketing-cta")
        .map((entry) => entry.cta)
    );
    for (const id of approvedCtaIds) {
      expect(seen.has(id), `Approved CTA-ID ${id} has no marketing-cta entry`).toBe(true);
    }
  });
});

describe("marketing registry integrity", () => {
  it("parses under contentRegistrySchema", () => {
    const parsed = validateContentRegistry(marketingContentEntries);
    expect(parsed.length).toBe(marketingContentEntries.length);
  });

  it("ships >=250 draft marketing entries", () => {
    expect(marketingContentEntries.length).toBeGreaterThanOrEqual(250);
  });

  it("every marketing entry stays draft, syntheticOnly, public-site", () => {
    for (const entry of marketingContentEntries) {
      expect(entry.status, `${entry.id} status`).toBe("draft");
      expect(entry.syntheticOnly, `${entry.id} syntheticOnly`).toBe(true);
      expect(entry.surface, `${entry.id} surface`).toBe("public-site");
    }
  });

  it("reports zero voice-tone violations across marketing entries", () => {
    const violations = lintContentRegistry(marketingContentEntries);
    expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
    assertVoiceToneClean(marketingContentEntries);
  });

  it("does not leak protected provider details", () => {
    assertNoProtectedProviderLeakage(marketingContentEntries);
  });
});
