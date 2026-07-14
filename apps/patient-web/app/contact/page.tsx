import {
  CTASection,
  HeroBlock,
  LegalNoticeStrip,
  TrustBar
} from "@nelyohealth/ui-foundation";
import { Handshake, LifeBuoy, Newspaper } from "lucide-react";
import { marketingMetadata } from "../../src/lib/seo";

export const metadata = marketingMetadata("contact", "/contact");

const supportIcon = <LifeBuoy size={20} strokeWidth={1.9} aria-hidden />;
const partnerIcon = <Handshake size={20} strokeWidth={1.9} aria-hidden />;
const pressIcon = <Newspaper size={20} strokeWidth={1.9} aria-hidden />;

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
          { id: "marketing-contact.route.patients", icon: supportIcon },
          { id: "marketing-contact.route.partners", icon: partnerIcon },
          { id: "marketing-contact.route.press", icon: pressIcon }
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
