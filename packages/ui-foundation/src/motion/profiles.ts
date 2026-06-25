export const motionProfiles = [
  "NONE",
  "REDUCED",
  "SUBTLE",
  "STANDARD",
  "EMPHASIZED",
  "SAFETY-IMMEDIATE"
] as const;
export type MotionProfile = (typeof motionProfiles)[number];
export interface MotionSettings {
  profile: MotionProfile;
  durationMs: number;
  distancePx: number;
  reducedMotion: "always" | "never" | "user";
}
export const settingsByProfile: Record<MotionProfile, MotionSettings> = {
  NONE: { profile: "NONE", durationMs: 0, distancePx: 0, reducedMotion: "always" },
  REDUCED: { profile: "REDUCED", durationMs: 80, distancePx: 0, reducedMotion: "user" },
  SUBTLE: { profile: "SUBTLE", durationMs: 140, distancePx: 4, reducedMotion: "user" },
  STANDARD: { profile: "STANDARD", durationMs: 220, distancePx: 10, reducedMotion: "user" },
  EMPHASIZED: { profile: "EMPHASIZED", durationMs: 320, distancePx: 14, reducedMotion: "user" },
  "SAFETY-IMMEDIATE": {
    profile: "SAFETY-IMMEDIATE",
    durationMs: 40,
    distancePx: 0,
    reducedMotion: "always"
  }
};
