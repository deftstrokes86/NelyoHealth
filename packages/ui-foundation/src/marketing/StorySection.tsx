import { useContent } from "../hooks/useContent.js";
import { IllustrationSlot, type IllustrationSlotAlign } from "./IllustrationSlot.js";

export interface StorySectionProps {
  eyebrowId?: string;
  headlineId: string;
  bodyId: string;
  illustrationId?: string;
  align?: IllustrationSlotAlign;
  ctaLabelId?: string;
  ctaHref?: string;
  className?: string;
}

export const StorySection = ({
  eyebrowId,
  headlineId,
  bodyId,
  illustrationId,
  align = "right",
  ctaLabelId,
  ctaHref,
  className = ""
}: StorySectionProps) => {
  const eyebrow = eyebrowId ? useContent(eyebrowId) : null;
  const headline = useContent(headlineId);
  const body = useContent(bodyId);
  const cta = ctaLabelId ? useContent(ctaLabelId) : null;
  return (
    <section
      className={`nh-story-section ${className}`.trim()}
      data-align={align}
      data-motion-profile="scroll-reveal"
    >
      <div className="nh-story-section__grid">
        <div className="nh-story-section__body">
          {eyebrow ? (
            <p className="nh-story-section__eyebrow">{eyebrow.title}</p>
          ) : null}
          <h2 className="nh-story-section__headline">{headline.title}</h2>
          <p className="nh-story-section__text">{body.body}</p>
          {cta && ctaHref ? (
            <a href={ctaHref} className="nh-story-section__cta">
              {cta.title}
              <span aria-hidden="true"> →</span>
            </a>
          ) : null}
        </div>
        {illustrationId ? (
          <div className="nh-story-section__visual">
            <IllustrationSlot
              illustrationId={illustrationId}
              align={align}
              label={headline.title}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
};
