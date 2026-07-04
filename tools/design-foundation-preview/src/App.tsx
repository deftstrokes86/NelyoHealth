import { MotionProvider } from "@nelyohealth/ui-foundation";
import { FoundationHero } from "./sections/FoundationHero";
import { TokenGallery } from "./sections/TokenGallery";
import { ContentAndDisclosure } from "./sections/ContentAndDisclosure";
import { MotionAndSafety } from "./sections/MotionAndSafety";
import { ResponsiveAccessibility } from "./sections/ResponsiveAccessibility";
import { SiteHeader } from "./components/header/Header";
export const App = () => (
  <MotionProvider profile="STANDARD">
    <>
      <SiteHeader
        logoLabel="NelyoHealth"
        navItems={[
          { label: "Foundation", href: "#", active: true },
          { label: "Tokens", href: "#token-system" },
          { label: "Disclosure", href: "#content-disclosure" },
          { label: "Motion", href: "#motion-safety" },
          { label: "Accessibility", href: "#responsive-accessibility" }
        ]}
        authActions={[
          { label: "Sign in", href: "#" },
          { label: "Create account", href: "#", tone: "solid" }
        ]}
      />
      <main>
        <FoundationHero />
        <TokenGallery />
        <ContentAndDisclosure />
        <MotionAndSafety />
        <ResponsiveAccessibility />
      </main>
    </>
  </MotionProvider>
);
