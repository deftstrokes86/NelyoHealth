import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import { settingsByProfile, type MotionProfile } from "./profiles.js";
export interface MotionPresenceProps {
  present: boolean;
  profile?: MotionProfile;
  children: ReactNode;
}
export const MotionPresence = ({ present, profile = "SUBTLE", children }: MotionPresenceProps) => {
  const settings = settingsByProfile[profile];
  return (
    <AnimatePresence mode="wait">
      {present ? (
        <motion.div
          key="present"
          initial={{ opacity: settings.durationMs === 0 ? 1 : 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: settings.durationMs / 1000 }}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
