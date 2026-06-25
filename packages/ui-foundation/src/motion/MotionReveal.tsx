import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { settingsByProfile, type MotionProfile } from "./profiles.js";
export interface MotionRevealProps {
  profile?: MotionProfile;
  children: ReactNode;
  className?: string;
  id?: string;
}
export const MotionReveal = ({
  profile = "STANDARD",
  children,
  className,
  id
}: MotionRevealProps) => {
  const prefersReducedMotion = useReducedMotion();
  const settings = settingsByProfile[prefersReducedMotion ? "REDUCED" : profile];
  return (
    <motion.div
      id={id}
      className={className}
      initial={{ opacity: settings.durationMs === 0 ? 1 : 0, y: settings.distancePx }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: settings.durationMs / 1000, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
};
