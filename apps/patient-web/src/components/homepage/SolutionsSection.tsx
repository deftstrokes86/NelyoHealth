"use client";

import "./solutions.css";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion/react";
import { Check } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useContent } from "@nelyohealth/ui-foundation";
import { solutionsAudiences, type SolutionsAudienceSpec } from "./solutions-audiences";

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

interface TabButtonProps {
  spec: SolutionsAudienceSpec;
  index: number;
  isActive: boolean;
  reduced: boolean;
  onSelect: (index: number) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => void;
  tabRef: (node: HTMLButtonElement | null) => void;
}

const TabButton = ({ spec, index, isActive, reduced, onSelect, onKeyDown, tabRef }: TabButtonProps) => {
  const label = useContent(`${spec.contentPrefix}.label`);
  const Icon = spec.icon;
  return (
    <button
      ref={tabRef}
      type="button"
      role="tab"
      id={`nh-solutions-tab-${spec.id}`}
      aria-selected={isActive}
      aria-controls={`nh-solutions-panel-${spec.id}`}
      tabIndex={isActive ? 0 : -1}
      className={"nh-solutions__tab" + (isActive ? " nh-solutions__tab--active" : "")}
      style={{ "--nh-solutions-tab-accent": spec.accentColor } as React.CSSProperties}
      onClick={() => onSelect(index)}
      onKeyDown={(event) => onKeyDown(event, index)}
    >
      <span className="nh-solutions__tab-icon" aria-hidden>
        <Icon size={20} strokeWidth={1.8} />
      </span>
      <span className="nh-solutions__tab-label">{label.title}</span>
      {isActive ? (
        <motion.span
          layoutId="nh-solutions-indicator"
          className="nh-solutions__tab-indicator"
          style={{ background: spec.accentColor }}
          transition={{ duration: reduced ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
      ) : null}
    </button>
  );
};

interface BenefitItemProps {
  contentId: string;
  index: number;
  reduced: boolean;
}

const BenefitItem = ({ contentId, index, reduced }: BenefitItemProps) => {
  const content = useContent(contentId);
  return (
    <motion.li
      className="nh-solutions__benefit"
      initial={reduced ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1], delay: 0.12 + index * 0.06 }}
    >
      <span className="nh-solutions__benefit-icon" aria-hidden>
        <Check size={14} strokeWidth={2.4} />
      </span>
      {content.title}
    </motion.li>
  );
};

interface SolutionsPanelProps {
  spec: SolutionsAudienceSpec;
  reduced: boolean;
}

const SolutionsPanel = ({ spec, reduced }: SolutionsPanelProps) => {
  const headline = useContent(`${spec.contentPrefix}.headline`);
  const body = useContent(`${spec.contentPrefix}.body`);
  const cta = useContent(`${spec.contentPrefix}.cta`);
  const ctaSecondary = useContent("marketing-home.solutions.cta.secondary");
  const Icon = spec.icon;

  return (
    <motion.div
      key={spec.id}
      id={`nh-solutions-panel-${spec.id}`}
      role="tabpanel"
      aria-labelledby={`nh-solutions-tab-${spec.id}`}
      className="nh-solutions__panel"
      style={{ "--nh-solutions-accent": spec.accentColor } as React.CSSProperties}
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduced ? undefined : { opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="nh-solutions__panel-illustration" aria-hidden>
        <span className="nh-solutions__panel-illustration-badge">
          <Icon size={48} strokeWidth={1.5} />
        </span>
      </div>
      <h3 className="nh-solutions__panel-headline">{headline.title}</h3>
      <p className="nh-solutions__panel-body">{body.body}</p>
      <ul className="nh-solutions__panel-benefits">
        {spec.benefitIds.map((contentId, index) => (
          <BenefitItem key={contentId} contentId={contentId} index={index} reduced={reduced} />
        ))}
      </ul>
      <div className="nh-solutions__panel-actions">
        <a className="nh-solutions__panel-cta" href={spec.ctaPrimaryHref}>
          {cta.title}
        </a>
        <a className="nh-solutions__panel-secondary" href={spec.ctaSecondaryHref}>
          {ctaSecondary.title}
        </a>
      </div>
    </motion.div>
  );
};

export const SolutionsSection = () => {
  const eyebrow = useContent("marketing-home.solutions.eyebrow");
  const headline = useContent("marketing-home.solutions.headline");
  const body = useContent("marketing-home.solutions.body");
  const transitionHeadline = useContent("marketing-home.solutions.transition.headline");
  const transitionBody = useContent("marketing-home.solutions.transition.body");
  const transitionCta = useContent("marketing-home.solutions.transition.cta");

  const reducedMotion = useReducedMotion() ?? false;
  const { ref, visible } = useOnceInView(0.1);
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      let nextIndex: number | null = null;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        nextIndex = (index + 1) % solutionsAudiences.length;
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        nextIndex = (index - 1 + solutionsAudiences.length) % solutionsAudiences.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = solutionsAudiences.length - 1;
      }
      if (nextIndex === null) return;
      event.preventDefault();
      setActiveIndex(nextIndex);
      tabRefs.current[nextIndex]?.focus();
    },
    []
  );

  const activeSpec = solutionsAudiences[activeIndex];

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="nh-solutions"
      aria-labelledby="nh-solutions-heading"
    >
      <div className="nh-solutions__inner">
        <header className="nh-solutions__header">
          <motion.p
            className="nh-solutions__eyebrow"
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={
              reducedMotion ? { opacity: 1, y: 0 } : visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }
            }
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {eyebrow.title}
          </motion.p>
          <motion.h2
            id="nh-solutions-heading"
            className="nh-solutions__headline"
            initial={reducedMotion ? false : { opacity: 0, y: 18 }}
            animate={
              reducedMotion ? { opacity: 1, y: 0 } : visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }
            }
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
          >
            {headline.title}
          </motion.h2>
          <motion.p
            className="nh-solutions__body"
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={
              reducedMotion ? { opacity: 1, y: 0 } : visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }
            }
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.16 }}
          >
            {body.body}
          </motion.p>
        </header>

        <div className="nh-solutions__layout">
          <div className="nh-solutions__nav" role="tablist" aria-label="Choose who you are" aria-orientation="vertical">
            {solutionsAudiences.map((spec, index) => (
              <TabButton
                key={spec.id}
                spec={spec}
                index={index}
                isActive={index === activeIndex}
                reduced={reducedMotion}
                onSelect={setActiveIndex}
                onKeyDown={handleKeyDown}
                tabRef={(node) => {
                  tabRefs.current[index] = node;
                }}
              />
            ))}
          </div>

          <div className="nh-solutions__content">
            <AnimatePresence mode="wait">
              <SolutionsPanel key={activeSpec.id} spec={activeSpec} reduced={reducedMotion} />
            </AnimatePresence>
          </div>
        </div>

        <motion.aside
          className="nh-solutions__transition"
          aria-labelledby="nh-solutions-transition-heading"
          initial={reducedMotion ? false : { opacity: 0, y: 18 }}
          animate={
            reducedMotion ? { opacity: 1, y: 0 } : visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }
          }
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        >
          <h3 id="nh-solutions-transition-heading" className="nh-solutions__transition-headline">
            {transitionHeadline.title}
          </h3>
          <p className="nh-solutions__transition-body">{transitionBody.body}</p>
          <a className="nh-solutions__transition-cta" href="/trust-and-safety">
            {transitionCta.title}
          </a>
        </motion.aside>
      </div>
    </section>
  );
};
