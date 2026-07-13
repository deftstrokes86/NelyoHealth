import { describe, expect, it } from "vitest";
import { lintContentEntry } from "./voice-tone-lint";
import type { ContentEntry } from "./schema";

const draft = (overrides: Partial<ContentEntry>): ContentEntry => ({
  id: "marketing-home.example",
  family: "marketing-home",
  status: "draft",
  contentClass: "public",
  surface: "public-site",
  title: overrides.title ?? "Example",
  body: overrides.body ?? "Example body.",
  evidence: [],
  syntheticOnly: false,
  ...overrides
});

describe("voice-tone lint", () => {
  it("flags 'best doctors'", () => {
    const violations = lintContentEntry(
      draft({
        title: "Meet the best doctors in Lagos"
      })
    );
    expect(violations.map((v) => v.ruleId)).toContain("banned-best-doctors");
  });

  it("passes clean copy", () => {
    const violations = lintContentEntry(
      draft({
        title: "Care that follows the patient",
        body: "Routing across the care journey without losing context."
      })
    );
    expect(violations).toEqual([]);
  });

  it("flags 'guaranteed'", () => {
    const violations = lintContentEntry(
      draft({
        body: "Consult results are guaranteed within 24 hours."
      })
    );
    expect(violations.map((v) => v.ruleId)).toContain("banned-guaranteed");
  });

  it("allows a quoted 'guarantee' inside legal/privacy policy language", () => {
    const violations = lintContentEntry(
      draft({
        family: "marketing-privacy-overview",
        body: 'The Data Protection Act uses the phrase "we guarantee lawful processing" in section 4.'
      })
    );
    expect(violations.map((v) => v.ruleId)).not.toContain("banned-guaranteed");
  });

  it("flags 'fully licensed'", () => {
    const violations = lintContentEntry(
      draft({
        title: "Fully licensed clinicians serving your community"
      })
    );
    expect(violations.map((v) => v.ruleId)).toContain("banned-fully-licensed");
  });

  it("flags 'nationwide service'", () => {
    const violations = lintContentEntry(
      draft({
        body: "We offer nationwide service across every state."
      })
    );
    expect(violations.map((v) => v.ruleId)).toContain("banned-nationwide");
  });

  it("flags 'instant results'", () => {
    const violations = lintContentEntry(
      draft({
        body: "Get instant results after your consultation."
      })
    );
    expect(violations.map((v) => v.ruleId)).toContain("banned-instant-results");
  });

  it("flags 'cheapest care'", () => {
    const violations = lintContentEntry(
      draft({
        title: "The cheapest care in Nigeria"
      })
    );
    expect(violations.map((v) => v.ruleId)).toContain("banned-cheapest");
  });

  it("flags 'complete privacy'", () => {
    const violations = lintContentEntry(
      draft({
        body: "We offer complete privacy to every user."
      })
    );
    expect(violations.map((v) => v.ruleId)).toContain("banned-complete-privacy");
  });

  it("flags 'zero risk'", () => {
    const violations = lintContentEntry(
      draft({
        body: "Care with zero risk of complications."
      })
    );
    expect(violations.map((v) => v.ruleId)).toContain("banned-zero-risk");
  });

  it("flags generic 'something went wrong' without recovery guidance", () => {
    const violations = lintContentEntry(
      draft({
        title: "Something went wrong",
        body: "Please wait."
      })
    );
    expect(violations.map((v) => v.ruleId)).toContain("generic-error");
  });

  it("allows 'something went wrong' when paired with recovery guidance", () => {
    const violations = lintContentEntry(
      draft({
        family: "marketing-error-pages",
        title: "Something went wrong",
        body: "Try again or contact support if the issue persists.",
        cta: "Retry"
      })
    );
    expect(violations.map((v) => v.ruleId)).not.toContain("generic-error");
  });

  it("flags emoji inside emergency content", () => {
    const violations = lintContentEntry(
      draft({
        family: "marketing-emergency",
        contentClass: "clinical-sensitive",
        title: "In an emergency 🚨",
        body: "Call your local emergency service."
      })
    );
    expect(violations.map((v) => v.ruleId)).toContain("emoji-in-clinical");
  });

  it("permits emoji inside non-clinical marketing content", () => {
    const violations = lintContentEntry(
      draft({
        family: "marketing-microcopy",
        title: "Say hi 👋",
        body: "This is a lighthearted microcopy line."
      })
    );
    expect(violations.map((v) => v.ruleId)).not.toContain("emoji-in-clinical");
  });

  it("flags incorrect brand casing", () => {
    const violations = lintContentEntry(
      draft({
        body: "Welcome to nelyohealth."
      })
    );
    expect(violations.map((v) => v.ruleId)).toContain("brand-casing");
  });

  it("permits correct brand casing", () => {
    const violations = lintContentEntry(
      draft({
        body: "Welcome to NelyoHealth."
      })
    );
    expect(violations.map((v) => v.ruleId)).not.toContain("brand-casing");
  });
});
