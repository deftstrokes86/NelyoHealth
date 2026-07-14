"use client";

import { useContent } from "../hooks/useContent.js";
import { IllustrationSlot } from "./IllustrationSlot.js";

export type HeroBlockVariant =
  | "universal"
  | "patient"
  | "family-diaspora"
  | "provider"
  | "organization";

export interface HeroBlockProps {
  variant?: HeroBlockVariant;
  eyebrowId: string;
  headlineId: string;
  bodyId: string;
  primaryCtaLabelId: string;
  primaryCtaHref: string;
  secondaryCtaLabelId?: string;
  secondaryCtaHref?: string;
  illustrationId: string;
  className?: string;
}

export const HeroBlock = ({
  variant = "universal",
  eyebrowId,
  headlineId,
  bodyId,
  primaryCtaLabelId,
  primaryCtaHref,
  secondaryCtaLabelId,
  secondaryCtaHref,
  illustrationId,
  className = ""
}: HeroBlockProps) => {
  const eyebrow = useContent(eyebrowId);
  const headline = useContent(headlineId);
  const body = useContent(bodyId);
  const primaryCta = useContent(primaryCtaLabelId);
  const secondaryCta = secondaryCtaLabelId ? useContent(secondaryCtaLabelId) : null;
  return (
    <section
      className={`nh-hero-block ${className}`.trim()}
      data-variant={variant}
      data-motion-profile="hero-enter"
      aria-labelledby={`${headlineId}-heading`}
    >
      <div className="nh-hero-block__grid">
        <div className="nh-hero-block__body">
          <p className="nh-hero-block__eyebrow">{eyebrow.title}</p>
          <h1 id={`${headlineId}-heading`} className="nh-hero-block__headline">
            {headline.title}
          </h1>
          <p className="nh-hero-block__lead">{body.body}</p>
          <div className="nh-hero-block__ctas">
            <a
              href={primaryCtaHref}
              className="nh-hero-block__cta nh-hero-block__cta--primary"
            >
              {primaryCta.title}
              <span aria-hidden="true"> →</span>
            </a>
            {secondaryCta && secondaryCtaHref ? (
              <a
                href={secondaryCtaHref}
                className="nh-hero-block__cta nh-hero-block__cta--secondary"
              >
                {secondaryCta.title}
              </a>
            ) : null}
          </div>
        </div>
        <div className="nh-hero-block__visual">
          <IllustrationSlot
            illustrationId={illustrationId}
            align="center"
            tone="warm"
            label={headline.title}
          />
        </div>
      </div>
    </section>
  );
};
