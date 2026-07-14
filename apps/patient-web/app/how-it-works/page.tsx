import {
  CTASection,
  FAQAccordion,
  HeroBlock,
  WorkflowStepper
} from "@nelyohealth/ui-foundation";
import { marketingMetadata } from "../../src/lib/seo";

export const metadata = marketingMetadata("how-it-works", "/how-it-works");

export default function HowItWorksPage() {
  return (
    <>
      <HeroBlock
        variant="universal"
        eyebrowId="marketing-how-it-works.hero.eyebrow"
        headlineId="marketing-how-it-works.hero.headline"
        bodyId="marketing-how-it-works.hero.body"
        primaryCtaLabelId="marketing-cta.create-account"
        primaryCtaHref="/create-account"
        secondaryCtaLabelId="marketing-cta.book-walkthrough"
        secondaryCtaHref="/contact"
        illustrationId="hero-universal-network"
      />
      <WorkflowStepper
        headingId="marketing-how-it-works.hero.headline"
        steps={[
          { id: "marketing-how-it-works.step.intake", illustrationId: "workflow-intake" },
          { id: "marketing-how-it-works.step.triage", illustrationId: "workflow-triage" },
          { id: "marketing-how-it-works.step.consult", illustrationId: "workflow-consult" },
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
      <FAQAccordion
        headingId="marketing-faq.hero.headline"
        items={[{ id: "marketing-how-it-works.faq.speed" }]}
      />
      <CTASection
        headlineId="marketing-how-it-works.cta.headline"
        bodyId="marketing-how-it-works.hero.body"
        primaryCtaLabelId="marketing-cta.book-walkthrough"
        primaryCtaHref="/contact"
      />
    </>
  );
}
