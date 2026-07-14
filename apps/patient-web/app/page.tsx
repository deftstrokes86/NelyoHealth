import {
  CTASection,
  FAQAccordion,
  HeroBlock,
  ProofStrip,
  SegmentGrid,
  StorySection,
  TrustBar,
  WorkflowStepper
} from "@nelyohealth/ui-foundation";
import { marketingMetadata } from "../src/lib/seo";

export const metadata = marketingMetadata("home", "/");

const trustIcon = (
  <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor">
    <path d="M10 2 L16 5 v5 c0 4.5 -3 7 -6 8 c-3 -1 -6 -3.5 -6 -8 v-5 z" />
  </svg>
);

const verifiedIcon = (
  <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor">
    <path d="M4 11 l4 4 l8 -9 l-2 -2 l-6 7 l-2 -2 z" />
  </svg>
);

const coordinationIcon = (
  <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor">
    <circle cx="10" cy="10" r="3" />
    <circle cx="4" cy="4" r="2" />
    <circle cx="16" cy="4" r="2" />
    <circle cx="4" cy="16" r="2" />
    <circle cx="16" cy="16" r="2" />
  </svg>
);

export default function HomePage() {
  return (
    <>
      <HeroBlock
        variant="universal"
        eyebrowId="marketing-home.hero.eyebrow"
        headlineId="marketing-home.hero.headline"
        bodyId="marketing-home.hero.body"
        primaryCtaLabelId="marketing-cta.create-account"
        primaryCtaHref="/create-account"
        secondaryCtaLabelId="marketing-cta.sign-in"
        secondaryCtaHref="/sign-in"
        illustrationId="hero-universal-network"
      />
      <TrustBar
        items={[
          { id: "marketing-home.trust.privacy", icon: trustIcon },
          { id: "marketing-home.trust.verified", icon: verifiedIcon },
          { id: "marketing-home.trust.coordination", icon: coordinationIcon }
        ]}
      />
      <StorySection
        headlineId="marketing-home.story.a.headline"
        bodyId="marketing-home.story.a.body"
        illustrationId="trust-coordination"
        align="right"
      />
      <WorkflowStepper
        headingId="marketing-how-it-works.hero.headline"
        steps={[
          {
            id: "marketing-how-it-works.step.intake",
            illustrationId: "workflow-intake"
          },
          {
            id: "marketing-how-it-works.step.triage",
            illustrationId: "workflow-triage"
          },
          {
            id: "marketing-how-it-works.step.consult",
            illustrationId: "workflow-consult"
          },
          {
            id: "marketing-how-it-works.step.fulfilment",
            illustrationId: "workflow-fulfilment"
          },
          {
            id: "marketing-how-it-works.step.followup",
            illustrationId: "workflow-followup"
          }
        ]}
      />
      <StorySection
        headlineId="marketing-home.story.b.headline"
        bodyId="marketing-home.story.b.body"
        illustrationId="family-diaspora-narrative"
        align="left"
      />
      <SegmentGrid
        headingId="marketing-home.cta.headline"
        cards={[
          { id: "marketing-segment-patients.hero.headline", href: "/patients" },
          {
            id: "marketing-segment-family-diaspora.hero.headline",
            href: "/diaspora"
          },
          { id: "marketing-segment-doctors.hero.headline", href: "/doctors" },
          {
            id: "marketing-segment-pharmacies.hero.headline",
            href: "/pharmacies"
          },
          {
            id: "marketing-segment-laboratories.hero.headline",
            href: "/laboratories"
          }
        ]}
      />
      <ProofStrip
        items={[
          { id: "marketing-home.trust.privacy", value: "By design" },
          { id: "marketing-home.trust.verified", value: "Credentialed" },
          { id: "marketing-home.trust.coordination", value: "End-to-end" }
        ]}
      />
      <FAQAccordion
        headingId="marketing-faq.hero.headline"
        items={[{ id: "marketing-home.faq.who" }, { id: "marketing-home.faq.data" }]}
      />
      <CTASection
        headlineId="marketing-home.cta.headline"
        bodyId="marketing-home.cta.body"
        primaryCtaLabelId="marketing-cta.create-account"
        primaryCtaHref="/create-account"
        secondaryCtaLabelId="marketing-cta.book-walkthrough"
        secondaryCtaHref="/contact"
      />
    </>
  );
}
