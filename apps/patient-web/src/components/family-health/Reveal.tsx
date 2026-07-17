"use client";

import { motion, useReducedMotion } from "framer-motion/react";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  /** Element to render, so the wrapper can be a valid list item where needed. */
  as?: "div" | "li";
}

/** Scroll-reveal wrapper. Honours prefers-reduced-motion by rendering statically. */
export const Reveal = ({ children, className, delay = 0, y = 18, as = "div" }: RevealProps) => {
  const reduced = useReducedMotion();
  if (reduced) {
    return as === "li" ? (
      <li className={className}>{children}</li>
    ) : (
      <div className={className}>{children}</div>
    );
  }
  const MotionEl = as === "li" ? motion.li : motion.div;
  return (
    <MotionEl
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </MotionEl>
  );
};
