"use client";

import { FAQAccordion, useContent } from "@nelyohealth/ui-foundation";
import { Reveal } from "./Reveal";
import { faqItems } from "./family-health-data";

export const FamilyHealthFaq = () => {
  const eyebrow = useContent("marketing-family-health.faq.eyebrow");
  return (
    <section className="nh-fh-faq" aria-labelledby="marketing-family-health.faq.headline-heading">
      <div className="nh-fh-faq__inner">
        <Reveal className="nh-fh-faq__head">
          <p className="nh-fh-eyebrow">{eyebrow.title}</p>
        </Reveal>
        <FAQAccordion
          headingId="marketing-family-health.faq.headline"
          items={faqItems.map((id) => ({ id }))}
        />
      </div>
    </section>
  );
};
