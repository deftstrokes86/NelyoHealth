import { CTASection, HeroBlock } from "@nelyohealth/ui-foundation";
import { marketingMetadata } from "../../src/lib/seo";

export const metadata = marketingMetadata("book-consultation", "/book-consultation");

export default function BookConsultationPage() {
  return (
    <>
      <HeroBlock
        variant="universal"
        eyebrowId="marketing-footer-pages.book-consultation.eyebrow"
        headlineId="marketing-footer-pages.book-consultation.headline"
        bodyId="marketing-footer-pages.book-consultation.body"
        primaryCtaLabelId="marketing-footer-pages.book-consultation.cta"
        primaryCtaHref="/create-account"
        secondaryCtaLabelId="marketing-cta.learn-more"
        secondaryCtaHref="/doctors"
        illustrationId="neutral-placeholder"
      />
      <CTASection
        headlineId="marketing-footer-pages.book-consultation.headline"
        bodyId="marketing-footer-pages.book-consultation.body"
        primaryCtaLabelId="marketing-footer-pages.book-consultation.cta"
        primaryCtaHref="/create-account"
      />
    </>
  );
}
