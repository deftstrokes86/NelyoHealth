"use client";

import "./care-journey.css";
import { motion, useReducedMotion } from "framer-motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useContent } from "@nelyohealth/ui-foundation";
import { careJourneySteps, type CareJourneyStepSpec } from "./care-journey-steps";

const useOnceInView = (threshold = 0.2) => {
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

const useStepCopy = (spec: CareJourneyStepSpec) => {
  const headline = useContent(`${spec.contentPrefix}.headline`);
  const body = useContent(`${spec.contentPrefix}.body`);
  const cta = useContent(`${spec.contentPrefix}.cta`);
  return {
    headline: headline.title,
    body: body.body,
    ctaLabel: cta.title
  };
};

interface RailTabProps {
  spec: CareJourneyStepSpec;
  index: number;
  isActive: boolean;
  onSelect: (index: number) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => void;
  tabRef: (node: HTMLButtonElement | null) => void;
}

const RailTab = ({ spec, index, isActive, onSelect, onKeyDown, tabRef }: RailTabProps) => {
  const headline = useContent(`${spec.contentPrefix}.headline`);
  return (
    <button
      ref={tabRef}
      type="button"
      role="tab"
      id={`nh-journey-tab-${spec.id}`}
      aria-selected={isActive}
      aria-controls={`nh-journey-panel-${spec.id}`}
      tabIndex={isActive ? 0 : -1}
      className={"nh-journey__milestone" + (isActive ? " nh-journey__milestone--active" : "")}
      onClick={() => onSelect(index)}
      onKeyDown={(event) => onKeyDown(event, index)}
    >
      <span className="nh-journey__milestone-number" aria-hidden>
        {index + 1}
      </span>
      <span className="nh-journey__milestone-label">{headline.title}</span>
    </button>
  );
};

interface DesktopRailProps {
  activeIndex: number;
  onSelect: (index: number) => void;
}

const DesktopRail = ({ activeIndex, onSelect }: DesktopRailProps) => {
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      let nextIndex: number | null = null;
      if (event.key === "ArrowRight") nextIndex = Math.min(index + 1, careJourneySteps.length - 1);
      else if (event.key === "ArrowLeft") nextIndex = Math.max(index - 1, 0);
      else if (event.key === "Home") nextIndex = 0;
      else if (event.key === "End") nextIndex = careJourneySteps.length - 1;
      if (nextIndex === null) return;
      event.preventDefault();
      onSelect(nextIndex);
      tabRefs.current[nextIndex]?.focus();
    },
    [onSelect]
  );

  const progress = (activeIndex / (careJourneySteps.length - 1)) * 100;

  return (
    <div
      className="nh-journey__rail"
      role="tablist"
      aria-label="Care journey steps"
      style={{ "--nh-journey-progress": `${progress}%` } as React.CSSProperties}
    >
      <div className="nh-journey__rail-line" aria-hidden>
        <span className="nh-journey__rail-line-fill" />
      </div>
      {careJourneySteps.map((spec, index) => (
        <RailTab
          key={spec.id}
          spec={spec}
          index={index}
          isActive={index === activeIndex}
          onSelect={onSelect}
          onKeyDown={handleKeyDown}
          tabRef={(node) => {
            tabRefs.current[index] = node;
          }}
        />
      ))}
    </div>
  );
};

interface DesktopPanelProps {
  spec: CareJourneyStepSpec;
  index: number;
  reduced: boolean;
}

const DesktopPanel = ({ spec, index, reduced }: DesktopPanelProps) => {
  const copy = useStepCopy(spec);
  const Illustration = spec.illustrationIcon;
  return (
    <motion.div
      key={spec.id}
      id={`nh-journey-panel-${spec.id}`}
      role="tabpanel"
      aria-labelledby={`nh-journey-tab-${spec.id}`}
      className="nh-journey__panel"
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduced ? undefined : { opacity: 0, y: -12 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="nh-journey__panel-illustration" aria-hidden>
        <span className="nh-journey__glyph-badge nh-journey__glyph-badge--lg">
          <Illustration size={64} strokeWidth={1.5} />
        </span>
      </div>
      <div className="nh-journey__panel-content">
        <p className="nh-journey__panel-step">
          Step {index + 1} of {careJourneySteps.length}
        </p>
        <h3 className="nh-journey__panel-headline">{copy.headline}</h3>
        <p className="nh-journey__panel-body">{copy.body}</p>
        <div className="nh-journey__panel-icons" aria-hidden>
          {spec.icons.map(({ icon: Icon, label }) => (
            <span key={label} className="nh-journey__panel-icon">
              <Icon size={16} strokeWidth={1.9} />
              {label}
            </span>
          ))}
        </div>
        <a className="nh-journey__panel-cta" href={spec.ctaHref}>
          {copy.ctaLabel}
        </a>
      </div>
    </motion.div>
  );
};

interface StageCardProps {
  spec: CareJourneyStepSpec;
  index: number;
  visible: boolean;
  reduced: boolean;
}

const StageCard = ({ spec, index, visible, reduced }: StageCardProps) => {
  const copy = useStepCopy(spec);
  const Illustration = spec.illustrationIcon;
  const shouldAnimate = visible && !reduced;
  const delay = 0.08 * index;
  return (
    <motion.article
      className="nh-journey__stage"
      initial={reduced ? false : { opacity: 0, y: 24 }}
      animate={
        reduced
          ? { opacity: 1, y: 0 }
          : shouldAnimate
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 24 }
      }
      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1], delay }}
    >
      <div className="nh-journey__stage-marker" aria-hidden>
        <span className="nh-journey__stage-number">{index + 1}</span>
      </div>
      <div className="nh-journey__stage-illustration" aria-hidden>
        <span className="nh-journey__glyph-badge nh-journey__glyph-badge--sm">
          <Illustration size={40} strokeWidth={1.6} />
        </span>
      </div>
      <p className="nh-journey__stage-step">
        Step {index + 1} of {careJourneySteps.length}
      </p>
      <h3 className="nh-journey__stage-headline">{copy.headline}</h3>
      <p className="nh-journey__stage-body">{copy.body}</p>
      <div className="nh-journey__stage-icons" aria-hidden>
        {spec.icons.map(({ icon: Icon, label }) => (
          <span key={label} className="nh-journey__stage-icon">
            <Icon size={16} strokeWidth={1.9} />
            {label}
          </span>
        ))}
      </div>
      <a className="nh-journey__stage-cta" href={spec.ctaHref}>
        {copy.ctaLabel}
      </a>
    </motion.article>
  );
};

export const CareJourneySection = () => {
  const eyebrow = useContent("marketing-home.journey.eyebrow");
  const headline = useContent("marketing-home.journey.headline");
  const body = useContent("marketing-home.journey.body");
  const transitionHeadline = useContent("marketing-home.journey.transition.headline");
  const transitionBody = useContent("marketing-home.journey.transition.body");
  const transitionCta = useContent("marketing-home.journey.transition.cta");

  const reducedMotion = useReducedMotion() ?? false;
  const { ref, visible } = useOnceInView(0.15);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleStackScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const el = event.currentTarget;
    const max = el.scrollWidth - el.clientWidth;
    setScrollProgress(max > 0 ? (el.scrollLeft / max) * 100 : 0);
  }, []);

  const activeStep = careJourneySteps[activeIndex];

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="nh-journey"
      aria-labelledby="nh-journey-heading"
    >
      <div className="nh-journey__inner">
        <header className="nh-journey__header">
          <motion.p
            className="nh-journey__eyebrow"
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
            id="nh-journey-heading"
            className="nh-journey__headline"
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
            className="nh-journey__body"
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
        </header>

        <div className="nh-journey__desktop">
          <DesktopRail activeIndex={activeIndex} onSelect={setActiveIndex} />
          <DesktopPanel spec={activeStep} index={activeIndex} reduced={reducedMotion} />
        </div>

        <div className="nh-journey__stack-wrap">
          <div className="nh-journey__stack-progress" aria-hidden>
            <span
              className="nh-journey__stack-progress-fill"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
          <div
            className="nh-journey__stack"
            role="list"
            onScroll={handleStackScroll}
          >
            {careJourneySteps.map((spec, index) => (
              <div key={spec.id} role="listitem" className="nh-journey__stage-slot">
                <StageCard spec={spec} index={index} visible={visible} reduced={reducedMotion} />
              </div>
            ))}
          </div>
        </div>

        <motion.aside
          className="nh-journey__transition"
          aria-labelledby="nh-journey-transition-heading"
          initial={reducedMotion ? false : { opacity: 0, y: 18 }}
          animate={
            reducedMotion
              ? { opacity: 1, y: 0 }
              : visible
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 18 }
          }
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.64 }}
        >
          <h3 id="nh-journey-transition-heading" className="nh-journey__transition-headline">
            {transitionHeadline.title}
          </h3>
          <p className="nh-journey__transition-body">{transitionBody.body}</p>
          <a
            className="nh-journey__transition-cta"
            href="#nh-ai-heading"
          >
            {transitionCta.title}
          </a>
        </motion.aside>
      </div>
    </section>
  );
};
