"use client";

import "./fragmented-reality.css";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion/react";
import { useEffect, useRef, useState, type ReactElement } from "react";
import { useContent } from "@nelyohealth/ui-foundation";
import {
  DisconnectedNodesIllustration,
  MemoryToPathwayIllustration,
  RecordCarrierIllustration,
  RepeatLoopIllustration
} from "./fragmented-reality-illustrations";

interface RealityCardSpec {
  key: string;
  titleId: string;
  bodyId: string;
  illustration: () => ReactElement;
}

const cards: RealityCardSpec[] = [
  {
    key: "record",
    titleId: "marketing-home.fragmented.card.record.title",
    bodyId: "marketing-home.fragmented.card.record.body",
    illustration: RecordCarrierIllustration
  },
  {
    key: "repeat",
    titleId: "marketing-home.fragmented.card.repeat.title",
    bodyId: "marketing-home.fragmented.card.repeat.body",
    illustration: RepeatLoopIllustration
  },
  {
    key: "disconnect",
    titleId: "marketing-home.fragmented.card.disconnect.title",
    bodyId: "marketing-home.fragmented.card.disconnect.body",
    illustration: DisconnectedNodesIllustration
  },
  {
    key: "memory",
    titleId: "marketing-home.fragmented.card.memory.title",
    bodyId: "marketing-home.fragmented.card.memory.body",
    illustration: MemoryToPathwayIllustration
  }
];

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

interface RealityCardProps {
  spec: RealityCardSpec;
  index: number;
  visible: boolean;
  reduced: boolean;
}

const RealityCard = ({ spec, index, visible, reduced }: RealityCardProps) => {
  const title = useContent(spec.titleId);
  const body = useContent(spec.bodyId);
  const Illustration = spec.illustration;
  const shouldAnimate = visible && !reduced;
  const delay = 0.08 * index;
  return (
    <motion.article
      className="nh-reality-card"
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
      <div className="nh-reality-card__glyph-wrap" aria-hidden>
        <Illustration />
      </div>
      <h3 className="nh-reality-card__title">{title.title}</h3>
      <p className="nh-reality-card__body">{body.body}</p>
    </motion.article>
  );
};

export const FragmentedRealitySection = () => {
  const eyebrow = useContent("marketing-home.fragmented.eyebrow");
  const headline = useContent("marketing-home.fragmented.headline");
  const body = useContent("marketing-home.fragmented.body");
  const transitionHeadline = useContent("marketing-home.fragmented.transition.headline");
  const transitionBody = useContent("marketing-home.fragmented.transition.body");

  const reducedMotion = useReducedMotion() ?? false;
  const { ref, visible } = useOnceInView(0.2);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="nh-reality"
      aria-labelledby="nh-reality-heading"
    >
      <div className="nh-reality__inner">
        <header className="nh-reality__header">
          <motion.p
            className="nh-reality__eyebrow"
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
            id="nh-reality-heading"
            className="nh-reality__headline"
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
            className="nh-reality__body"
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

        <div className="nh-reality__cards" role="list">
          <AnimatePresence>
            {cards.map((spec, index) => (
              <div key={spec.key} role="listitem" className="nh-reality__card-slot">
                <RealityCard
                  spec={spec}
                  index={index}
                  visible={visible}
                  reduced={reducedMotion}
                />
              </div>
            ))}
          </AnimatePresence>
        </div>

        <motion.aside
          className="nh-reality__transition"
          aria-labelledby="nh-reality-transition-heading"
          initial={reducedMotion ? false : { opacity: 0, y: 18 }}
          animate={
            reducedMotion
              ? { opacity: 1, y: 0 }
              : visible
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 18 }
          }
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.56 }}
        >
          <h3
            id="nh-reality-transition-heading"
            className="nh-reality__transition-headline"
          >
            {transitionHeadline.title}
          </h3>
          <p className="nh-reality__transition-body">{transitionBody.body}</p>
        </motion.aside>
      </div>
    </section>
  );
};
