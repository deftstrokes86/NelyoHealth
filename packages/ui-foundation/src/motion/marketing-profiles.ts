export interface MarketingMotionProfile {
  id: string;
  description: string;
  durationMs: number;
  easing: string;
  distancePx: number;
  reducedDurationMs: number;
  reducedDistancePx: number;
}
export const motionHeroEnter: MarketingMotionProfile = {
  id: "motion-hero-enter",
  description: "Hero enter — headline, subhead, CTA slide up and fade in.",
  durationMs: 620,
  easing: "cubic-bezier(0.16, 1, 0.3, 1)",
  distancePx: 24,
  reducedDurationMs: 0,
  reducedDistancePx: 0
};
export const motionScrollReveal: MarketingMotionProfile = {
  id: "motion-scroll-reveal",
  description: "Story sections rise into place as the viewport meets them.",
  durationMs: 480,
  easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
  distancePx: 16,
  reducedDurationMs: 0,
  reducedDistancePx: 0
};
export const motionCrossFade: MarketingMotionProfile = {
  id: "motion-cross-fade",
  description: "Cross-fade between marketing surface states — tabs, hero variants.",
  durationMs: 320,
  easing: "cubic-bezier(0.4, 0, 0.2, 1)",
  distancePx: 0,
  reducedDurationMs: 60,
  reducedDistancePx: 0
};
export const marketingMotionProfiles = [
  motionHeroEnter,
  motionScrollReveal,
  motionCrossFade
] as const;
