"use client";

import "./final-cta.css";
import { motion, useReducedMotion } from "framer-motion/react";
import { useEffect, useRef, useState } from "react";
import { useContent } from "@nelyohealth/ui-foundation";
import { finalCtaCards, type FinalCtaCardSpec } from "./final-cta-data";

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

interface CardSecondaryLinkProps {
  contentId: string;
  href: string;
}

const CardSecondaryLink = ({ contentId, href }: CardSecondaryLinkProps) => {
  const content = useContent(contentId);
  return (
    <a className="nh-final-cta__card-secondary" href={href}>
      {content.title}
    </a>
  );
};

interface ActionCardProps {
  spec: FinalCtaCardSpec;
  index: number;
  visible: boolean;
  reduced: boolean;
}

const ActionCard = ({ spec, index, visible, reduced }: ActionCardProps) => {
  const headline = useContent(spec.headlineId);
  const body = useContent(spec.bodyId);
  const cta = useContent(spec.ctaId);
  const Icon = spec.icon;
  const shouldAnimate = visible && !reduced;

  return (
    <motion.article
      className="nh-final-cta__card"
      initial={reduced ? false : { opacity: 0, y: 18 }}
      animate={
        reduced ? { opacity: 1, y: 0 } : shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }
      }
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.08 * index }}
    >
      <span className="nh-final-cta__card-icon" aria-hidden>
        <Icon size={26} strokeWidth={1.6} />
      </span>
      <p className="nh-final-cta__card-audience">{spec.audience}</p>
      <h3 className="nh-final-cta__card-headline">{headline.title}</h3>
      <p className="nh-final-cta__card-body">{body.body}</p>
      <a className="nh-final-cta__card-cta" href={spec.ctaHref}>
        {cta.title}
      </a>
      {spec.secondaryId && spec.secondaryHref ? (
        <CardSecondaryLink contentId={spec.secondaryId} href={spec.secondaryHref} />
      ) : null}
    </motion.article>
  );
};

export const FinalCtaSection = () => {
  const eyebrow = useContent("marketing-home.final-cta.eyebrow");
  const headline = useContent("marketing-home.final-cta.headline");
  const body = useContent("marketing-home.final-cta.body");
  const reassuranceHeadline = useContent("marketing-home.final-cta.reassurance.headline");
  const reassuranceBody = useContent("marketing-home.final-cta.reassurance.body");
  const reassurancePrimary = useContent("marketing-home.final-cta.reassurance.cta.primary");
  const reassuranceSecondary = useContent("marketing-home.final-cta.reassurance.cta.secondary");
  const statementHeadline = useContent("marketing-home.final-cta.statement.headline");
  const statementBody = useContent("marketing-home.final-cta.statement.body");

  const reducedMotion = useReducedMotion() ?? false;
  const { ref, visible } = useOnceInView(0.1);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="nh-final-cta"
      aria-labelledby="nh-final-cta-heading"
    >
      <div className="nh-final-cta__inner">
        <motion.div
          className="nh-final-cta__container"
          initial={reducedMotion ? false : { opacity: 0, y: 18 }}
          animate={
            reducedMotion ? { opacity: 1, y: 0 } : visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }
          }
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="nh-final-cta__bg-circle nh-final-cta__bg-circle--a" aria-hidden />
          <span className="nh-final-cta__bg-circle nh-final-cta__bg-circle--b" aria-hidden />

          <header className="nh-final-cta__header">
            <p className="nh-final-cta__eyebrow">{eyebrow.title}</p>
            <h2 id="nh-final-cta-heading" className="nh-final-cta__headline">
              {headline.title}
            </h2>
            <p className="nh-final-cta__body">{body.body}</p>
          </header>

          <div className="nh-final-cta__cards" role="list">
            {finalCtaCards.map((spec, index) => (
              <div key={spec.id} role="listitem">
                <ActionCard spec={spec} index={index} visible={visible} reduced={reducedMotion} />
              </div>
            ))}
          </div>

          <div className="nh-final-cta__reassurance">
            <h3 className="nh-final-cta__reassurance-headline">{reassuranceHeadline.title}</h3>
            <p className="nh-final-cta__reassurance-body">{reassuranceBody.body}</p>
            <div className="nh-final-cta__reassurance-actions">
              <a className="nh-final-cta__reassurance-primary" href="/how-it-works">
                {reassurancePrimary.title}
              </a>
              <a className="nh-final-cta__reassurance-secondary" href="/contact">
                {reassuranceSecondary.title}
              </a>
            </div>
          </div>

          <div className="nh-final-cta__statement">
            <h3 className="nh-final-cta__statement-headline">{statementHeadline.title}</h3>
            <p className="nh-final-cta__statement-body">{statementBody.body}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
