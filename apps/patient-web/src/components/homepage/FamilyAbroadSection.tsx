"use client";

import "./family-abroad.css";
import { motion, useReducedMotion } from "framer-motion/react";
import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useContent } from "@nelyohealth/ui-foundation";
import {
  familyAbroadCards,
  familyAbroadStoryLineIds,
  familyAbroadTrustBadgeIds
} from "./family-abroad-data";
import type { FamilyAbroadCardSpec } from "./family-abroad-data";

const useOnceInView = (threshold = 0.12) => {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible };
};

interface StoryLineProps {
  contentId: string;
  index: number;
  visible: boolean;
  reduced: boolean;
}

const StoryLine = ({ contentId, index, visible, reduced }: StoryLineProps) => {
  const content = useContent(contentId);
  const shouldAnimate = visible && !reduced;
  return (
    <motion.p
      className="nh-family-abroad__story-line"
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={
        reduced ? { opacity: 1, y: 0 } : shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }
      }
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: 0.05 * index }}
    >
      {content.title}
    </motion.p>
  );
};

interface FeatureCardProps {
  spec: FamilyAbroadCardSpec;
  index: number;
  visible: boolean;
  reduced: boolean;
}

const FeatureCard = ({ spec, index, visible, reduced }: FeatureCardProps) => {
  const headline = useContent(spec.headlineId);
  const body = useContent(spec.bodyId);
  const Icon = spec.icon;
  const shouldAnimate = visible && !reduced;
  return (
    <motion.article
      className="nh-family-abroad__card"
      initial={reduced ? false : { opacity: 0, y: 18 }}
      animate={
        reduced ? { opacity: 1, y: 0 } : shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }
      }
      transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1], delay: 0.06 * index }}
    >
      <span className="nh-family-abroad__card-icon" aria-hidden>
        <Icon size={22} strokeWidth={1.7} />
      </span>
      <h3 className="nh-family-abroad__card-headline">{headline.title}</h3>
      <p className="nh-family-abroad__card-body">{body.body}</p>
    </motion.article>
  );
};

interface TrustBadgeProps {
  contentId: string;
}

const TrustBadge = ({ contentId }: TrustBadgeProps) => {
  const content = useContent(contentId);
  return (
    <div className="nh-family-abroad__trust-badge">
      <span className="nh-family-abroad__trust-badge-icon" aria-hidden>
        <Check size={14} strokeWidth={2.4} />
      </span>
      <p className="nh-family-abroad__trust-badge-text">{content.title}</p>
    </div>
  );
};

export const FamilyAbroadSection = () => {
  const eyebrow = useContent("marketing-home.family-abroad.eyebrow");
  const headline = useContent("marketing-home.family-abroad.headline");
  const body = useContent("marketing-home.family-abroad.body");
  const storyTitle = useContent("marketing-home.family-abroad.story.title");
  const trustHeadline = useContent("marketing-home.family-abroad.trust.headline");
  const trustBody = useContent("marketing-home.family-abroad.trust.body");
  const ctaPrimary = useContent("marketing-home.family-abroad.cta.primary");
  const ctaSecondary = useContent("marketing-home.family-abroad.cta.secondary");

  const reducedMotion = useReducedMotion() ?? false;
  const { ref, visible } = useOnceInView(0.12);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="nh-family-abroad"
      aria-labelledby="nh-family-abroad-heading"
    >
      <div className="nh-family-abroad__inner">
        <div className="nh-family-abroad__layout">
          <motion.div
            className="nh-family-abroad__visual"
            initial={reducedMotion ? false : { opacity: 0, scale: 0.97 }}
            animate={
              reducedMotion
                ? { opacity: 1, scale: 1 }
                : visible
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.97 }
            }
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <img
              className="nh-family-abroad__illustration"
              src="/images/diaspora-illustration.png"
              alt=""
              aria-hidden="true"
              loading="lazy"
              width={1536}
              height={1024}
            />
          </motion.div>

          <div className="nh-family-abroad__content">
            <header className="nh-family-abroad__header">
              <motion.p
                className="nh-family-abroad__eyebrow"
                initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                animate={
                  reducedMotion ? { opacity: 1, y: 0 } : visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }
                }
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                {eyebrow.title}
              </motion.p>
              <motion.h2
                id="nh-family-abroad-heading"
                className="nh-family-abroad__headline"
                initial={reducedMotion ? false : { opacity: 0, y: 18 }}
                animate={
                  reducedMotion ? { opacity: 1, y: 0 } : visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }
                }
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
              >
                {headline.title}
              </motion.h2>
              <motion.p
                className="nh-family-abroad__body"
                initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                animate={
                  reducedMotion ? { opacity: 1, y: 0 } : visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }
                }
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.16 }}
              >
                {body.body}
              </motion.p>
            </header>

            <div className="nh-family-abroad__story" aria-labelledby="nh-family-abroad-story-heading">
              <h3 id="nh-family-abroad-story-heading" className="nh-family-abroad__story-title">
                {storyTitle.title}
              </h3>
              {familyAbroadStoryLineIds.map((contentId, index) => (
                <StoryLine
                  key={contentId}
                  contentId={contentId}
                  index={index}
                  visible={visible}
                  reduced={reducedMotion}
                />
              ))}
            </div>

            <div className="nh-family-abroad__cards" role="list">
              {familyAbroadCards.map((spec, index) => (
                <div key={spec.id} role="listitem">
                  <FeatureCard spec={spec} index={index} visible={visible} reduced={reducedMotion} />
                </div>
              ))}
            </div>

            <div className="nh-family-abroad__trust">
              <h3 className="nh-family-abroad__trust-headline">{trustHeadline.title}</h3>
              <p className="nh-family-abroad__trust-body">{trustBody.body}</p>
              <div className="nh-family-abroad__trust-badges">
                {familyAbroadTrustBadgeIds.map((contentId) => (
                  <TrustBadge key={contentId} contentId={contentId} />
                ))}
              </div>
            </div>

            <div className="nh-family-abroad__cta">
              <a className="nh-family-abroad__cta-primary" href="/create-account">
                {ctaPrimary.title}
              </a>
              <a className="nh-family-abroad__cta-secondary" href="/diaspora">
                {ctaSecondary.title}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
