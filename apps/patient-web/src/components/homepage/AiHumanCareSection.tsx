"use client";

import "./ai-human-care.css";
import { motion, useReducedMotion } from "framer-motion/react";
import { useEffect, useRef, useState } from "react";
import { useContent } from "@nelyohealth/ui-foundation";
import {
  aiFeatureGroups,
  aiNetworkCenter,
  aiNetworkSatellites,
  aiTrustBadges,
  type AiFeatureGroupSpec,
  type AiTrustBadgeSpec
} from "./ai-human-care-data";

const useOnceInView = (threshold = 0.15) => {
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

const NETWORK_RADIUS = 38;

const toPosition = (angleDegrees: number) => {
  const radians = (angleDegrees * Math.PI) / 180;
  return {
    x: 50 + NETWORK_RADIUS * Math.cos(radians),
    y: 50 + NETWORK_RADIUS * Math.sin(radians)
  };
};

const AiNetworkIllustration = () => {
  const CenterIcon = aiNetworkCenter.icon;
  return (
    <div
      className="nh-ai__illustration"
      role="img"
      aria-label="Artificial intelligence at the centre, efficiently connecting the patient, doctor, laboratory, pharmacy, and medical records"
    >
      <svg className="nh-ai__illustration-lines" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
        {aiNetworkSatellites.map((spec) => {
          const pos = toPosition(spec.angleDegrees);
          return (
            <line
              key={spec.id}
              x1="50"
              y1="50"
              x2={pos.x}
              y2={pos.y}
              className="nh-ai__illustration-line"
            />
          );
        })}
      </svg>
      <span
        className="nh-ai__illustration-node nh-ai__illustration-node--center"
        style={{ left: "50%", top: "50%" }}
      >
        <span className="nh-ai__illustration-node-icon">
          <CenterIcon size={44} strokeWidth={1.6} />
        </span>
        <span className="nh-ai__illustration-node-label">{aiNetworkCenter.label}</span>
      </span>
      {aiNetworkSatellites.map((spec) => {
        const pos = toPosition(spec.angleDegrees);
        const Icon = spec.icon;
        return (
          <span
            key={spec.id}
            className="nh-ai__illustration-node"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          >
            <span className="nh-ai__illustration-node-icon">
              <Icon size={26} strokeWidth={1.7} />
            </span>
            <span className="nh-ai__illustration-node-label">{spec.label}</span>
          </span>
        );
      })}
    </div>
  );
};

interface BulletItemProps {
  contentId: string;
}

const BulletItem = ({ contentId }: BulletItemProps) => {
  const content = useContent(contentId);
  return <li className="nh-ai__group-bullet">{content.title}</li>;
};

interface FeatureGroupProps {
  spec: AiFeatureGroupSpec;
  index: number;
  visible: boolean;
  reduced: boolean;
}

const FeatureGroup = ({ spec, index, visible, reduced }: FeatureGroupProps) => {
  const headline = useContent(`${spec.contentPrefix}.headline`);
  const body = useContent(`${spec.contentPrefix}.body`);
  const Icon = spec.icon;
  const shouldAnimate = visible && !reduced;
  const delay = 0.1 * index;
  return (
    <motion.article
      className="nh-ai__group"
      initial={reduced ? false : { opacity: 0, y: 20 }}
      animate={
        reduced
          ? { opacity: 1, y: 0 }
          : shouldAnimate
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 20 }
      }
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay }}
    >
      <span className="nh-ai__group-icon" aria-hidden>
        <Icon size={30} strokeWidth={1.6} />
      </span>
      <h3 className="nh-ai__group-headline">{headline.title}</h3>
      <p className="nh-ai__group-body">{body.body}</p>
      <ul className="nh-ai__group-bullets">
        {spec.bulletIds.map((contentId) => (
          <BulletItem key={contentId} contentId={contentId} />
        ))}
      </ul>
    </motion.article>
  );
};

interface TrustBadgeProps {
  spec: AiTrustBadgeSpec;
}

const TrustBadge = ({ spec }: TrustBadgeProps) => {
  const content = useContent(spec.contentId);
  const Icon = spec.icon;
  return (
    <div className="nh-ai__trust-badge">
      <span className="nh-ai__trust-badge-icon" aria-hidden>
        <Icon size={18} strokeWidth={1.8} />
      </span>
      <p className="nh-ai__trust-badge-text">{content.title}</p>
    </div>
  );
};

export const AiHumanCareSection = () => {
  const eyebrow = useContent("marketing-home.ai.eyebrow");
  const headline = useContent("marketing-home.ai.headline");
  const body = useContent("marketing-home.ai.body");
  const trustHeadline = useContent("marketing-home.ai.trust.headline");
  const trustBody = useContent("marketing-home.ai.trust.body");
  const ctaPrimary = useContent("marketing-home.ai.cta.primary");
  const ctaSecondary = useContent("marketing-home.ai.cta.secondary");

  const reducedMotion = useReducedMotion() ?? false;
  const { ref, visible } = useOnceInView(0.15);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="nh-ai"
      aria-labelledby="nh-ai-heading"
    >
      <div className="nh-ai__inner">
        <div className="nh-ai__layout">
          <motion.div
            className="nh-ai__visual"
            initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={
              reducedMotion
                ? { opacity: 1, scale: 1 }
                : visible
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.96 }
            }
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <AiNetworkIllustration />
          </motion.div>

          <div className="nh-ai__content">
            <motion.p
              className="nh-ai__eyebrow"
              initial={reducedMotion ? false : { opacity: 0, y: 12 }}
              animate={
                reducedMotion
                  ? { opacity: 1, y: 0 }
                  : visible
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 12 }
              }
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {eyebrow.title}
            </motion.p>
            <motion.h2
              id="nh-ai-heading"
              className="nh-ai__headline"
              initial={reducedMotion ? false : { opacity: 0, y: 18 }}
              animate={
                reducedMotion
                  ? { opacity: 1, y: 0 }
                  : visible
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 18 }
              }
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
            >
              {headline.title}
            </motion.h2>
            <motion.p
              className="nh-ai__body"
              initial={reducedMotion ? false : { opacity: 0, y: 12 }}
              animate={
                reducedMotion
                  ? { opacity: 1, y: 0 }
                  : visible
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 12 }
              }
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.16 }}
            >
              {body.body}
            </motion.p>

            <div className="nh-ai__groups">
              {aiFeatureGroups.map((spec, index) => (
                <FeatureGroup
                  key={spec.id}
                  spec={spec}
                  index={index}
                  visible={visible}
                  reduced={reducedMotion}
                />
              ))}
            </div>

            <motion.div
              className="nh-ai__trust"
              initial={reducedMotion ? false : { opacity: 0, y: 20 }}
              animate={
                reducedMotion
                  ? { opacity: 1, y: 0 }
                  : visible
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            >
              <h3 className="nh-ai__trust-headline">{trustHeadline.title}</h3>
              <p className="nh-ai__trust-body">{trustBody.body}</p>
              <div className="nh-ai__trust-badges">
                {aiTrustBadges.map((spec) => (
                  <TrustBadge key={spec.id} spec={spec} />
                ))}
              </div>
            </motion.div>

            <div className="nh-ai__cta">
              <a className="nh-ai__cta-primary" href="#nh-ecosystem-heading">
                {ctaPrimary.title}
              </a>
              <a className="nh-ai__cta-secondary" href="/privacy-overview">
                {ctaSecondary.title}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
