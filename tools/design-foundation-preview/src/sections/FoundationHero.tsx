import { MotionReveal, Surface, Button } from "@nelyohealth/ui-foundation";
import { visualDirection } from "@nelyohealth/design-tokens";
export const FoundationHero = () => (
  <MotionReveal className="hero" profile="STANDARD">
    <p className="eyebrow">SYNTHETIC / NONPRODUCTION / DESIGN FOUNDATION PREVIEW</p>
    <h1>NelyoHealth foundation: {visualDirection.name}</h1>
    <p className="hero__copy">
      A warm, precise care grid for accessible healthcare workflows without product feature
      implementation.
    </p>
    <div className="hero__actions">
      <Button>Review foundation</Button>
      <Button variant="secondary">Inspect tokens</Button>
    </div>
    <Surface tone="emphasis" className="hero__note">
      This preview validates visual direction, motion boundaries, content classes, and privacy
      constraints only.
    </Surface>
  </MotionReveal>
);
