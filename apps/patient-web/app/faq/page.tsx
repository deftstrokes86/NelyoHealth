import { CTASection, FAQAccordion, HeroBlock } from "@nelyohealth/ui-foundation";
import { marketingMetadata } from "../../src/lib/seo";

export const metadata = marketingMetadata("faq", "/faq");

export default function FaqPage() {
  return (
    <>
      <HeroBlock
        variant="universal"
        eyebrowId="marketing-faq.hero.eyebrow"
        headlineId="marketing-faq.hero.headline"
        bodyId="marketing-faq.hero.body"
        primaryCtaLabelId="marketing-cta.contact"
        primaryCtaHref="/contact"
        illustrationId="trust-coordination"
      />
      <FAQAccordion
        headingId="marketing-faq.hero.headline"
        items={[
          { id: "marketing-faq.q.who" },
          { id: "marketing-faq.q.data" },
          { id: "marketing-faq.q.payment" },
          { id: "marketing-faq.q.emergency" },
          { id: "marketing-faq.q.family" },
          { id: "marketing-faq.q.provider-details" }
        ]}
        type="multiple"
      />
      <CTASection
        headlineId="marketing-faq.cta.headline"
        bodyId="marketing-faq.hero.body"
        primaryCtaLabelId="marketing-cta.contact"
        primaryCtaHref="/contact"
      />
    </>
  );
}
