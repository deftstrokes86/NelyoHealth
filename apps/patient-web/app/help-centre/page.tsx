import { CTASection, HeroBlock, TrustBar } from "@nelyohealth/ui-foundation";
import { LifeBuoy, MessageCircleQuestion, ShieldCheck } from "lucide-react";
import { marketingMetadata } from "../../src/lib/seo";

export const metadata = marketingMetadata("help-centre", "/help-centre");

const faqIcon = <MessageCircleQuestion size={20} strokeWidth={1.9} aria-hidden />;
const supportIcon = <LifeBuoy size={20} strokeWidth={1.9} aria-hidden />;
const trustIcon = <ShieldCheck size={20} strokeWidth={1.9} aria-hidden />;

export default function HelpCentrePage() {
  return (
    <>
      <HeroBlock
        variant="universal"
        eyebrowId="marketing-footer-pages.help-centre.eyebrow"
        headlineId="marketing-footer-pages.help-centre.headline"
        bodyId="marketing-footer-pages.help-centre.body"
        primaryCtaLabelId="marketing-footer-pages.help-centre.cta"
        primaryCtaHref="/faq"
        secondaryCtaLabelId="marketing-footer-pages.help-centre.secondary"
        secondaryCtaHref="/contact"
        illustrationId="neutral-placeholder"
      />
      <TrustBar
        items={[
          { id: "marketing-faq.hero.headline", icon: faqIcon },
          { id: "marketing-contact.hero.eyebrow", icon: supportIcon },
          { id: "marketing-trust-and-safety.hero.eyebrow", icon: trustIcon }
        ]}
      />
      <CTASection
        headlineId="marketing-footer-pages.help-centre.headline"
        bodyId="marketing-footer-pages.help-centre.body"
        primaryCtaLabelId="marketing-footer-pages.help-centre.cta"
        primaryCtaHref="/faq"
      />
    </>
  );
}
