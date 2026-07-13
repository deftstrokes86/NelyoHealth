import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import {
  CTASection,
  EmergencyRibbon,
  FAQAccordion,
  HeroBlock,
  IllustrationSlot,
  LegalNoticeStrip,
  PricingMatrix,
  ProofStrip,
  QuoteBlock,
  SegmentGrid,
  SiteFooter,
  SiteHeader,
  StorySection,
  ThemeToggle,
  TrustBar,
  WorkflowStepper
} from "./index.js";
import { PreviewContentProvider, type MarketingContent } from "../hooks/useContent.js";

const entries: MarketingContent[] = [
  { id: "brand", title: "NelyoHealth", body: "Coordinated care." },
  { id: "cta.primary", title: "Get started" },
  { id: "cta.secondary", title: "Sign in" },
  {
    id: "emergency.headline",
    title: "In an emergency, call your local service.",
    body: "This is not emergency care."
  },
  { id: "emergency.action", title: "See emergency guidance" },
  { id: "nav.home", title: "Home" },
  { id: "nav.patients", title: "For patients" },
  {
    id: "hero.eyebrow",
    title: "For everyone"
  },
  {
    id: "hero.headline",
    title: "Care that follows the patient."
  },
  { id: "hero.body", title: "Body", body: "Routing across the care journey." },
  { id: "story.eyebrow", title: "Story eyebrow" },
  { id: "story.headline", title: "A coordinated model" },
  {
    id: "story.body",
    title: "Story body",
    body: "Clinical decisions stay with clinicians."
  },
  { id: "story.cta", title: "Learn more" },
  { id: "trust.privacy", title: "Privacy by design", body: "Consent enforced." },
  { id: "trust.verified", title: "Verified clinicians", body: "Credentialed." },
  { id: "trust.coord", title: "End-to-end", body: "Connected surface." },
  { id: "proof.head", title: "What changes" },
  { id: "proof.a", title: "On-time follow-ups", body: "Reminders that arrive." },
  { id: "proof.b", title: "Fewer handoffs", body: "One chart." },
  { id: "workflow.head", title: "How care moves" },
  { id: "workflow.intake", title: "Intake", body: "Structured intake." },
  { id: "workflow.triage", title: "Triage", body: "Routing by need." },
  { id: "segments.head", title: "Find your path" },
  { id: "segments.patient", title: "Patient", body: "Book and record." },
  { id: "segments.provider", title: "Provider", body: "Single workflow." },
  { id: "faq.head", title: "Common questions" },
  { id: "faq.q1", title: "Who is this for?", body: "Coordinated care users." },
  { id: "faq.q2", title: "Where is my data?", body: "Approved infrastructure." },
  { id: "cta.eyebrow", title: "Ready?" },
  { id: "cta.head", title: "Ready to see it in practice?" },
  {
    id: "cta.body",
    title: "Ready body",
    body: "Walkthrough tailored to your role."
  },
  {
    id: "cta.reassurance",
    title: "Reassurance",
    body: "No card required for a walkthrough."
  },
  { id: "pricing.head", title: "Plans by role" },
  {
    id: "pricing.disclaimer",
    title: "Disclaimer",
    body: "Draft pricing for review."
  },
  { id: "pricing.plan.individual", title: "Individual", body: "For a patient." },
  { id: "pricing.plan.individual.price", title: "₦ TBD" },
  { id: "pricing.plan.family", title: "Family", body: "For families." },
  { id: "pricing.plan.family.price", title: "₦ TBD" },
  { id: "pricing.plan.org", title: "Organization", body: "For payers." },
  { id: "pricing.plan.org.price", title: "Contact us" },
  { id: "pricing.feature.booking", title: "Consult booking" },
  { id: "pricing.feature.records", title: "Records access" },
  { id: "pricing.cta.individual", title: "Choose Individual" },
  { id: "pricing.cta.family", title: "Choose Family" },
  { id: "pricing.cta.org", title: "Talk to us" },
  {
    id: "quote.body",
    title: "",
    body: "The platform routed follow-ups automatically."
  },
  { id: "quote.attribution", title: "Dr. A. Onyema", body: "GP, Lagos" },
  {
    id: "legal.body",
    title: "Terms of service (draft)",
    body: "Synthetic legal notice."
  },
  { id: "footer.brand", title: "NelyoHealth", body: "Coordinated care." },
  {
    id: "footer.legal",
    title: "Legal",
    body: "© NelyoHealth. Draft site."
  },
  { id: "footer.group.platform", title: "Platform" },
  { id: "footer.link.pricing", title: "Pricing" }
];

const wrap = (node: React.ReactNode) => (
  <PreviewContentProvider entries={entries}>{node}</PreviewContentProvider>
);

describe("marketing components (content resolution)", () => {
  it("EmergencyRibbon renders headline + action from the content registry", () => {
    const html = renderToStaticMarkup(
      wrap(
        <EmergencyRibbon
          headlineId="emergency.headline"
          actionLabelId="emergency.action"
          actionHref="/trust-safety"
        />
      )
    );
    expect(html).toContain("In an emergency, call your local service.");
    expect(html).toContain("See emergency guidance");
    expect(html).toContain('data-motion-profile="SAFETY-IMMEDIATE"');
    expect(html).toContain('href="/trust-safety"');
  });

  it("SiteHeader renders nav items via content IDs", () => {
    const html = renderToStaticMarkup(
      wrap(
        <SiteHeader
          brandId="brand"
          navItems={[
            { id: "nav.home", href: "/", segment: "general" },
            { id: "nav.patients", href: "/patient", segment: "patient" }
          ]}
          primaryCtaLabelId="cta.primary"
          primaryCtaHref="/register"
          secondaryCtaLabelId="cta.secondary"
          secondaryCtaHref="/login"
        />
      )
    );
    expect(html).toContain("NelyoHealth");
    expect(html).toContain("Home");
    expect(html).toContain("For patients");
    expect(html).toContain("Get started");
    expect(html).toContain("Sign in");
  });

  it("SiteFooter renders link groups", () => {
    const html = renderToStaticMarkup(
      wrap(
        <SiteFooter
          brandId="footer.brand"
          legalNoticeId="footer.legal"
          groups={[
            {
              id: "footer.group.platform",
              links: [{ id: "footer.link.pricing", href: "/pricing" }]
            }
          ]}
        />
      )
    );
    expect(html).toContain("Platform");
    expect(html).toContain("Pricing");
    expect(html).toContain("Draft site");
  });

  it("HeroBlock renders headline + illustration slot", () => {
    const html = renderToStaticMarkup(
      wrap(
        <HeroBlock
          eyebrowId="hero.eyebrow"
          headlineId="hero.headline"
          bodyId="hero.body"
          primaryCtaLabelId="cta.primary"
          primaryCtaHref="/register"
          illustrationId="hero-universal-network"
        />
      )
    );
    expect(html).toContain("Care that follows the patient.");
    expect(html).toContain("For everyone");
    expect(html).toContain("Routing across the care journey.");
    expect(html).toContain('data-variant="universal"');
    expect(html).toContain('data-illustration="hero-universal-network"');
  });

  it("StorySection swaps illustration alignment", () => {
    const left = renderToStaticMarkup(
      wrap(
        <StorySection
          headlineId="story.headline"
          bodyId="story.body"
          illustrationId="trust-coordination"
          align="left"
        />
      )
    );
    expect(left).toContain('data-align="left"');
    const right = renderToStaticMarkup(
      wrap(
        <StorySection
          headlineId="story.headline"
          bodyId="story.body"
          illustrationId="trust-coordination"
          align="right"
        />
      )
    );
    expect(right).toContain('data-align="right"');
  });

  it("TrustBar exposes each item's title from the registry", () => {
    const html = renderToStaticMarkup(
      wrap(
        <TrustBar
          items={[
            {
              id: "trust.privacy",
              icon: <span data-testid="icon-privacy" />
            }
          ]}
        />
      )
    );
    expect(html).toContain("Privacy by design");
    expect(html).toContain("Consent enforced.");
  });

  it("ProofStrip renders values and content bodies", () => {
    const html = renderToStaticMarkup(
      wrap(
        <ProofStrip
          headingId="proof.head"
          items={[
            { id: "proof.a", value: "3× on-time" },
            { id: "proof.b", value: "Fewer errors" }
          ]}
        />
      )
    );
    expect(html).toContain("3× on-time");
    expect(html).toContain("Fewer errors");
    expect(html).toContain("On-time follow-ups");
  });

  it("WorkflowStepper enumerates steps 01, 02, ...", () => {
    const html = renderToStaticMarkup(
      wrap(
        <WorkflowStepper
          headingId="workflow.head"
          steps={[
            { id: "workflow.intake", illustrationId: "workflow-intake" },
            { id: "workflow.triage", illustrationId: "workflow-triage" }
          ]}
        />
      )
    );
    expect(html).toContain("Intake");
    expect(html).toContain("Triage");
    expect(html).toContain("01");
    expect(html).toContain("02");
  });

  it("SegmentGrid renders one link per card", () => {
    const html = renderToStaticMarkup(
      wrap(
        <SegmentGrid
          headingId="segments.head"
          cards={[
            { id: "segments.patient", href: "/patient" },
            { id: "segments.provider", href: "/for-doctors" }
          ]}
        />
      )
    );
    expect(html).toContain('href="/patient"');
    expect(html).toContain('href="/for-doctors"');
    expect(html).toContain("Patient");
    expect(html).toContain("Provider");
  });

  it("FAQAccordion renders every question", () => {
    const html = renderToStaticMarkup(
      wrap(
        <FAQAccordion
          headingId="faq.head"
          items={[{ id: "faq.q1" }, { id: "faq.q2" }]}
        />
      )
    );
    expect(html).toContain("Who is this for?");
    expect(html).toContain("Where is my data?");
  });

  it("CTASection renders reassurance line", () => {
    const html = renderToStaticMarkup(
      wrap(
        <CTASection
          headlineId="cta.head"
          bodyId="cta.body"
          primaryCtaLabelId="cta.primary"
          primaryCtaHref="/register"
          reassuranceId="cta.reassurance"
        />
      )
    );
    expect(html).toContain("Ready to see it in practice?");
    expect(html).toContain("No card required for a walkthrough.");
  });

  it("PricingMatrix renders every plan, feature, and disclaimer", () => {
    const html = renderToStaticMarkup(
      wrap(
        <PricingMatrix
          headingId="pricing.head"
          disclaimerId="pricing.disclaimer"
          plans={[
            {
              id: "pricing.plan.individual",
              priceLabelId: "pricing.plan.individual.price",
              ctaLabelId: "pricing.cta.individual",
              ctaHref: "/register"
            },
            {
              id: "pricing.plan.family",
              emphasized: true,
              priceLabelId: "pricing.plan.family.price",
              ctaLabelId: "pricing.cta.family",
              ctaHref: "/register"
            }
          ]}
          features={[
            {
              id: "pricing.feature.booking",
              cells: [
                {
                  planId: "pricing.plan.individual",
                  value: "Included"
                },
                {
                  planId: "pricing.plan.family",
                  value: "Included"
                }
              ]
            }
          ]}
        />
      )
    );
    expect(html).toContain("Individual");
    expect(html).toContain("Family");
    expect(html).toContain("Consult booking");
    expect(html).toContain("Draft pricing for review.");
    expect(html).toContain('data-emphasized="true"');
  });

  it("QuoteBlock renders synthetic caveat by default", () => {
    const html = renderToStaticMarkup(
      wrap(
        <QuoteBlock
          quoteId="quote.body"
          attributionId="quote.attribution"
        />
      )
    );
    expect(html).toContain("Synthetic quote for preview only");
    expect(html).toContain("The platform routed follow-ups automatically.");
    expect(html).toContain("Dr. A. Onyema");
  });

  it("LegalNoticeStrip shows the DRAFT ribbon while pending", () => {
    const html = renderToStaticMarkup(
      wrap(
        <LegalNoticeStrip
          noticeId="legal.body"
          approvalStatus="draft"
          effectiveDate="TBD"
        />
      )
    );
    expect(html).toContain("DRAFT — PENDING APPROVAL");
    expect(html).toContain("Terms of service (draft)");
    expect(html).toContain("Effective date: TBD");
  });

  it("LegalNoticeStrip hides the ribbon once approved", () => {
    const html = renderToStaticMarkup(
      wrap(
        <LegalNoticeStrip
          noticeId="legal.body"
          approvalStatus="approved"
        />
      )
    );
    expect(html).not.toContain("DRAFT — PENDING APPROVAL");
  });

  it("IllustrationSlot falls back to neutral-placeholder for unknown IDs", () => {
    const html = renderToStaticMarkup(
      <IllustrationSlot illustrationId="does-not-exist" />
    );
    expect(html).toContain('data-illustration="neutral-placeholder"');
    expect(html).toContain('data-fallback="true"');
  });

  it("ThemeToggle renders as a button reflecting the system preference", () => {
    const html = renderToStaticMarkup(<ThemeToggle />);
    expect(html).toContain("nh-theme-toggle");
    expect(html).toContain('data-preference="system"');
    expect(html).toContain('aria-pressed="false"');
  });
});

describe("marketing package boundaries", () => {
  const marketingDir = join(__dirname);

  const collect = (dir: string): string[] => {
    const out: string[] = [];
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        out.push(...collect(full));
        continue;
      }
      if (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts")) {
        if (entry.name.endsWith(".test.tsx") || entry.name.endsWith(".test.ts"))
          continue;
        out.push(full);
      }
    }
    return out;
  };

  const files = collect(marketingDir);

  it("does not import from apps/*", () => {
    const offenders: string[] = [];
    for (const file of files) {
      const source = readFileSync(file, "utf8");
      if (/from\s+["']\.{0,2}\/{0,2}apps\//.test(source)) offenders.push(file);
      if (/from\s+["'][^"']*\/apps\//.test(source)) offenders.push(file);
    }
    expect(offenders).toEqual([]);
  });

  it("does not name a domain identifier from the locked invariants", () => {
    const forbidden = [
      "Patient",
      "PatientRecord",
      "OrderFundingSecured",
      "providerDisplayName",
      "UserAccount",
      "PharmacyOrder",
      "LaboratoryOrder"
    ];
    const offenders: Array<{ file: string; term: string }> = [];
    for (const file of files) {
      const source = readFileSync(file, "utf8");
      for (const term of forbidden) {
        const pattern = new RegExp(`\\b${term}\\b`);
        if (pattern.test(source)) offenders.push({ file, term });
      }
    }
    expect(offenders).toEqual([]);
  });
});
