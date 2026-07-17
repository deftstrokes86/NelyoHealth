"use client";

import { Quote } from "lucide-react";
import { useContent } from "@nelyohealth/ui-foundation";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";
import { testimonials, type TestimonialSpec } from "./family-health-data";

const TestimonialCard = ({ spec, index }: { spec: TestimonialSpec; index: number }) => {
  const quote = useContent(spec.quoteId);
  const name = useContent(spec.nameId);
  const role = useContent(spec.roleId);
  const initial = name.title.replace(/^(a|an)\s+/i, "").charAt(0).toUpperCase();
  return (
    <Reveal delay={(index % 2) * 0.08}>
      <figure className="nh-fh-testimonial">
        <span className="nh-fh-testimonial__mark" aria-hidden>
          <Quote size={20} strokeWidth={1.8} />
        </span>
        <blockquote className="nh-fh-testimonial__quote">{quote.title}</blockquote>
        <figcaption className="nh-fh-testimonial__cite">
          <span className="nh-fh-testimonial__avatar" aria-hidden>
            {initial}
          </span>
          <span>
            <span className="nh-fh-testimonial__name">{name.title}</span>
            <span className="nh-fh-testimonial__role">{role.title}</span>
          </span>
        </figcaption>
      </figure>
    </Reveal>
  );
};

export const Testimonials = () => {
  const caveat = useContent("marketing-family-health.testimonials.caveat");
  return (
    <section className="nh-fh-testimonials" aria-labelledby="nh-fh-testimonials-heading">
      <div className="nh-fh-testimonials__inner">
        <SectionHeader
          eyebrowId="marketing-family-health.testimonials.eyebrow"
          headlineId="marketing-family-health.testimonials.headline"
          headingId="nh-fh-testimonials-heading"
        />
        <div className="nh-fh-testimonials__grid">
          {testimonials.map((spec, index) => (
            <TestimonialCard key={spec.id} spec={spec} index={index} />
          ))}
        </div>
        <p className="nh-fh-testimonials__caveat">{caveat.title}</p>
      </div>
    </section>
  );
};
