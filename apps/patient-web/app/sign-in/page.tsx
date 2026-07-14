import { CTASection, HeroBlock, LegalNoticeStrip } from "@nelyohealth/ui-foundation";
import { marketingMetadata } from "../../src/lib/seo";

export const metadata = marketingMetadata("signin", "/sign-in");

export default function SignInPage() {
  return (
    <>
      <HeroBlock
        variant="universal"
        eyebrowId="marketing-microcopy.brand.name"
        headlineId="auth-signin.hero.headline"
        bodyId="auth-signin.hero.body"
        primaryCtaLabelId="marketing-cta.sign-in"
        primaryCtaHref="#sign-in"
        secondaryCtaLabelId="marketing-cta.create-account"
        secondaryCtaHref="/create-account"
        illustrationId="neutral-placeholder"
      />
      <LegalNoticeStrip
        noticeId="auth-signin.note.privacy"
        approvalStatus="approved"
      />
      <CTASection
        headlineId="auth-signin.note.recovery"
        bodyId="auth-signin.note.recovery"
        primaryCtaLabelId="marketing-cta.contact-support"
        primaryCtaHref="/contact"
        secondaryCtaLabelId="marketing-cta.back"
        secondaryCtaHref="/"
      />
    </>
  );
}
