"use client";

import "./trust-safety.css";
import { motion, useReducedMotion } from "framer-motion/react";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useContent } from "@nelyohealth/ui-foundation";
import {
  privacyChainNodes,
  trustCards,
  trustFinalLineIds,
  trustGovernancePrincipleIds,
  trustMetrics,
  type TrustCardSpec
} from "./trust-safety-data";

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

interface TrustCardProps {
  spec: TrustCardSpec;
  index: number;
  visible: boolean;
  reduced: boolean;
  expanded: boolean;
  onToggle: (id: string) => void;
}

const TrustCard = ({ spec, index, visible, reduced, expanded, onToggle }: TrustCardProps) => {
  const headline = useContent(spec.headlineId);
  const body = useContent(spec.bodyId);
  const expandedContent = useContent(spec.expandedId);
  const Icon = spec.icon;
  const shouldAnimate = visible && !reduced;
  const detailId = `nh-trust-detail-${spec.id}`;

  return (
    <motion.article
      className="nh-trust__card"
      initial={reduced ? false : { opacity: 0, y: 18 }}
      animate={
        reduced ? { opacity: 1, y: 0 } : shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }
      }
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.06 * index }}
    >
      <span className="nh-trust__card-icon" aria-hidden>
        <Icon size={28} strokeWidth={1.6} />
      </span>
      <h3 className="nh-trust__card-headline">{headline.title}</h3>
      <p className="nh-trust__card-body">{body.body}</p>
      <button
        type="button"
        className="nh-trust__card-toggle"
        aria-expanded={expanded}
        aria-controls={detailId}
        onClick={() => onToggle(spec.id)}
      >
        {expanded ? "Show less" : "Learn more"}
        <ChevronDown
          size={16}
          strokeWidth={2}
          className={"nh-trust__card-toggle-icon" + (expanded ? " nh-trust__card-toggle-icon--open" : "")}
          aria-hidden
        />
      </button>
      <div id={detailId} className="nh-trust__card-detail" data-expanded={expanded}>
        <div>
          <p>{expandedContent.body}</p>
        </div>
      </div>
    </motion.article>
  );
};

interface MetricCardProps {
  spec: (typeof trustMetrics)[number];
  index: number;
  visible: boolean;
  reduced: boolean;
}

const MetricCard = ({ spec, index, visible, reduced }: MetricCardProps) => {
  const value = useContent(spec.valueId);
  const label = useContent(spec.labelId);
  const shouldAnimate = visible && !reduced;
  return (
    <motion.div
      className="nh-trust__metric"
      initial={reduced ? false : { opacity: 0, y: 14 }}
      animate={
        reduced ? { opacity: 1, y: 0 } : shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }
      }
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.08 * index }}
    >
      <p className="nh-trust__metric-value">{value.title}</p>
      <p className="nh-trust__metric-label">{label.title}</p>
    </motion.div>
  );
};

interface FinalLineProps {
  contentId: string;
  index: number;
  visible: boolean;
  reduced: boolean;
}

const FinalLine = ({ contentId, index, visible, reduced }: FinalLineProps) => {
  const content = useContent(contentId);
  const shouldAnimate = visible && !reduced;
  return (
    <motion.p
      className="nh-trust__final-line"
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

const PrivacyChainIllustration = () => (
  <div
    className="nh-trust__chain"
    role="img"
    aria-label="Patient grants permission, which connects them to their doctor and, in turn, their family"
  >
    {privacyChainNodes.map((node, index) => {
      const Icon = node.icon;
      return (
        <div className="nh-trust__chain-item" key={node.id}>
          <div className="nh-trust__chain-node">
            <span className="nh-trust__chain-icon">
              <Icon size={24} strokeWidth={1.7} />
            </span>
            <span className="nh-trust__chain-label">{node.label}</span>
          </div>
          {index < privacyChainNodes.length - 1 ? (
            <span className="nh-trust__chain-connector" aria-hidden />
          ) : null}
        </div>
      );
    })}
  </div>
);

interface GovernancePrincipleProps {
  contentId: string;
}

const GovernancePrinciple = ({ contentId }: GovernancePrincipleProps) => {
  const content = useContent(contentId);
  return <li className="nh-trust__governance-principle">{content.title}</li>;
};

export const TrustSafetySection = () => {
  const eyebrow = useContent("marketing-home.trust-safety.eyebrow");
  const headline = useContent("marketing-home.trust-safety.headline");
  const body = useContent("marketing-home.trust-safety.body");
  const governanceHeadline = useContent("marketing-home.trust-safety.governance.headline");
  const governanceBody = useContent("marketing-home.trust-safety.governance.body");
  const privacyHeadline = useContent("marketing-home.trust-safety.privacy.headline");
  const privacyBody = useContent("marketing-home.trust-safety.privacy.body");
  const finalHeadline = useContent("marketing-home.trust-safety.final.headline");
  const ctaPrimary = useContent("marketing-home.trust-safety.cta.primary");
  const ctaSecondary = useContent("marketing-home.trust-safety.cta.secondary");

  const reducedMotion = useReducedMotion() ?? false;
  const { ref, visible } = useOnceInView(0.1);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const handleToggle = (id: string) => {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="nh-trust"
      aria-labelledby="nh-trust-heading"
    >
      <div className="nh-trust__inner">
        <header className="nh-trust__header">
          <motion.p
            className="nh-trust__eyebrow"
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={
              reducedMotion ? { opacity: 1, y: 0 } : visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }
            }
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {eyebrow.title}
          </motion.p>
          <motion.h2
            id="nh-trust-heading"
            className="nh-trust__headline"
            initial={reducedMotion ? false : { opacity: 0, y: 18 }}
            animate={
              reducedMotion ? { opacity: 1, y: 0 } : visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }
            }
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
          >
            {headline.title}
          </motion.h2>
          <motion.p
            className="nh-trust__body"
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={
              reducedMotion ? { opacity: 1, y: 0 } : visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }
            }
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.16 }}
          >
            {body.body}
          </motion.p>
        </header>

        <div className="nh-trust__grid" role="list">
          {trustCards.map((spec, index) => (
            <div key={spec.id} role="listitem">
              <TrustCard
                spec={spec}
                index={index}
                visible={visible}
                reduced={reducedMotion}
                expanded={expandedIds.has(spec.id)}
                onToggle={handleToggle}
              />
            </div>
          ))}
        </div>

        <div className="nh-trust__governance">
          <h3 className="nh-trust__governance-headline">{governanceHeadline.title}</h3>
          <p className="nh-trust__governance-body">{governanceBody.body}</p>
          <ul className="nh-trust__governance-principles">
            {trustGovernancePrincipleIds.map((contentId) => (
              <GovernancePrinciple key={contentId} contentId={contentId} />
            ))}
          </ul>
        </div>

        <div className="nh-trust__privacy">
          <h3 className="nh-trust__privacy-headline">{privacyHeadline.title}</h3>
          <p className="nh-trust__privacy-body">{privacyBody.body}</p>
          <PrivacyChainIllustration />
        </div>

        <div className="nh-trust__metrics">
          {trustMetrics.map((spec, index) => (
            <MetricCard key={spec.id} spec={spec} index={index} visible={visible} reduced={reducedMotion} />
          ))}
        </div>

        <div className="nh-trust__final">
          <h3 className="nh-trust__final-headline">{finalHeadline.title}</h3>
          <div className="nh-trust__final-lines">
            {trustFinalLineIds.map((contentId, index) => (
              <FinalLine
                key={contentId}
                contentId={contentId}
                index={index}
                visible={visible}
                reduced={reducedMotion}
              />
            ))}
          </div>
          <div className="nh-trust__final-cta">
            <a className="nh-trust__cta-primary" href="/trust-and-safety">
              {ctaPrimary.title}
            </a>
            <a className="nh-trust__cta-secondary" href="/privacy-overview">
              {ctaSecondary.title}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
