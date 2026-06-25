import { MotionProvider } from "@nelyohealth/ui-foundation";
import { FoundationHero } from "./sections/FoundationHero";
import { TokenGallery } from "./sections/TokenGallery";
import { ContentAndDisclosure } from "./sections/ContentAndDisclosure";
import { MotionAndSafety } from "./sections/MotionAndSafety";
import { ResponsiveAccessibility } from "./sections/ResponsiveAccessibility";
export const App = () => (
  <MotionProvider profile="STANDARD">
    <main>
      <FoundationHero />
      <TokenGallery />
      <ContentAndDisclosure />
      <MotionAndSafety />
      <ResponsiveAccessibility />
    </main>
  </MotionProvider>
);
