import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { settingsByProfile, type MotionProfile } from "./profiles.js";
export interface MotionProviderProps {
  profile?: MotionProfile;
  children: ReactNode;
}
export const MotionProvider = ({ profile = "STANDARD", children }: MotionProviderProps) => {
  const settings = settingsByProfile[profile];
  return (
    <MotionConfig
      reducedMotion={settings.reducedMotion}
      transition={{ duration: settings.durationMs / 1000 }}
    >
      {children}
    </MotionConfig>
  );
};
