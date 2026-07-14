import { CTASection, HeroBlock, LegalNoticeStrip } from "@nelyohealth/ui-foundation";
import { marketingMetadata } from "../../src/lib/seo";

export const metadata = marketingMetadata("forgot-password", "/forgot-password");

export default function ForgotPasswordPage() {
  return (
    <>
      <HeroBlock
        variant="universal"
        eyebrowId="marketing-microcopy.brand.name"
        headlineId="auth-forgot-password.hero.headline"
        bodyId="auth-forgot-password.hero.body"
        primaryCtaLabelId="marketing-cta.sign-in"
        primaryCtaHref="/sign-in"
        secondaryCtaLabelId="marketing-cta.contact-support"
        secondaryCtaHref="/contact"
        illustrationId="neutral-placeholder"
      />
      <LegalNoticeStrip
        noticeId="auth-forgot-password.note.privacy"
        approvalStatus="approved"
      />
      <CTASection
        headlineId="auth-forgot-password.note.support"
        bodyId="auth-forgot-password.note.support"
        primaryCtaLabelId="marketing-cta.contact-support"
        primaryCtaHref="/contact"
        secondaryCtaLabelId="marketing-cta.back"
        secondaryCtaHref="/sign-in"
      />
    </>
  );
}
