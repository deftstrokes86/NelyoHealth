import {
  CTASection,
  HeroBlock,
  LegalNoticeStrip,
  StorySection,
  TrustBar
} from "@nelyohealth/ui-foundation";
import { marketingMetadata } from "../../src/lib/seo";

export const metadata = marketingMetadata("contact", "/contact");

const iconA = (
  <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor">
    <path d="M2 6 h16 v10 h-16 z M2 6 l8 6 l8 -6" stroke="currentColor" strokeWidth={1.5} fill="none" />
  </svg>
);

export default function ContactPage() {
  return (
    <>
      <HeroBlock
        variant="universal"
        eyebrowId="marketing-contact.hero.eyebrow"
        headlineId="marketing-contact.hero.headline"
        bodyId="marketing-contact.hero.body"
        primaryCtaLabelId="marketing-cta.contact"
        primaryCtaHref="mailto:hello@nelyohealth.example"
        illustrationId="neutral-placeholder"
      />
      <TrustBar
        items={[
          { id: "marketing-contact.route.patients", icon: iconA },
          { id: "marketing-contact.route.partners", icon: iconA },
          { id: "marketing-contact.route.press", icon: iconA }
        ]}
      />
      <LegalNoticeStrip
        noticeId="marketing-contact.note.emergency"
        approvalStatus="approved"
      />
      <CTASection
        headlineId="marketing-contact.cta.headline"
        bodyId="marketing-contact.hero.body"
        primaryCtaLabelId="marketing-cta.contact"
        primaryCtaHref="mailto:hello@nelyohealth.example"
      />
    </>
  );
}
