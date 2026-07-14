"use client";

import { useContent } from "../hooks/useContent.js";

export interface CTASectionProps {
  eyebrowId?: string;
  headlineId: string;
  bodyId: string;
  primaryCtaLabelId: string;
  primaryCtaHref: string;
  secondaryCtaLabelId?: string;
  secondaryCtaHref?: string;
  reassuranceId?: string;
  className?: string;
}

export const CTASection = ({
  eyebrowId,
  headlineId,
  bodyId,
  primaryCtaLabelId,
  primaryCtaHref,
  secondaryCtaLabelId,
  secondaryCtaHref,
  reassuranceId,
  className = ""
}: CTASectionProps) => {
  const eyebrow = eyebrowId ? useContent(eyebrowId) : null;
  const headline = useContent(headlineId);
  const body = useContent(bodyId);
  const primaryCta = useContent(primaryCtaLabelId);
  const secondaryCta = secondaryCtaLabelId ? useContent(secondaryCtaLabelId) : null;
  const reassurance = reassuranceId ? useContent(reassuranceId) : null;
  return (
    <section
      className={`nh-cta-section ${className}`.trim()}
      aria-labelledby={`${headlineId}-heading`}
    >
      <div className="nh-cta-section__inner">
        {eyebrow ? (
          <p className="nh-cta-section__eyebrow">{eyebrow.title}</p>
        ) : null}
        <h2 id={`${headlineId}-heading`} className="nh-cta-section__headline">
          {headline.title}
        </h2>
        <p className="nh-cta-section__body">{body.body}</p>
        <div className="nh-cta-section__ctas">
          <a
            href={primaryCtaHref}
            className="nh-cta-section__cta nh-cta-section__cta--primary"
          >
            {primaryCta.title}
            <span aria-hidden="true"> →</span>
          </a>
          {secondaryCta && secondaryCtaHref ? (
            <a
              href={secondaryCtaHref}
              className="nh-cta-section__cta nh-cta-section__cta--secondary"
            >
              {secondaryCta.title}
            </a>
          ) : null}
        </div>
        {reassurance ? (
          <p className="nh-cta-section__reassurance">{reassurance.body}</p>
        ) : null}
      </div>
    </section>
  );
};
