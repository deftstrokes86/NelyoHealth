"use client";

import { motion, useReducedMotion } from "framer-motion/react";
import { useContent } from "@nelyohealth/ui-foundation";

export const FamilyHealthHero = () => {
  const eyebrow = useContent("marketing-family-health.hero.eyebrow");
  const headline = useContent("marketing-family-health.hero.headline");
  const body = useContent("marketing-family-health.hero.body");
  const primary = useContent("marketing-family-health.hero.cta.primary");
  const secondary = useContent("marketing-family-health.hero.cta.secondary");
  const reduced = useReducedMotion();

  return (
    <section className="nh-fh-hero" aria-labelledby="nh-fh-hero-heading">
      <div className="nh-fh-hero__inner">
        <div className="nh-fh-hero__copy">
          <motion.p
            className="nh-fh-hero__eyebrow"
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {eyebrow.title}
          </motion.p>
          <motion.h1
            id="nh-fh-hero-heading"
            className="nh-fh-hero__headline"
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
          >
            {headline.title}
          </motion.h1>
          <motion.p
            className="nh-fh-hero__body"
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.16 }}
          >
            {body.body}
          </motion.p>
          <motion.div
            className="nh-fh-hero__ctas"
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.24 }}
          >
            <a className="nh-fh-btn nh-fh-btn--primary" href="#choose-journey">
              {primary.title}
            </a>
            <a className="nh-fh-btn nh-fh-btn--ghost" href="#care-circle">
              {secondary.title}
            </a>
          </motion.div>
        </div>

        <motion.div
          className="nh-fh-hero__visual"
          initial={reduced ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          <img
            className="nh-fh-hero__illustration"
            src="/assets/family-health-1.png"
            alt="A family coordinating healthcare together across generations and distance."
            width={1536}
            height={1024}
            loading="eager"
          />
        </motion.div>
      </div>
    </section>
  );
};
