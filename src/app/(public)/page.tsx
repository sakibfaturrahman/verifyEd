import { PublicNavbar } from "@/components/layouts/public-navbar";
import { HeroSection } from "@/features/verification/components/hero-section";
import { VelocityScroll } from "@/components/animations/velocity-scroll";
import { AboutSection } from "@/components/sections/about-section";
import { OverlappingSteps } from "@/components/sections/overlapping-steps";
import { PublicFooter } from "@/components/layouts/public-footer";

export default function GuestLandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
      <PublicNavbar />
      <HeroSection />
      <VelocityScroll
        items={["Digital Verification", "Zero Tampering", "Instant Lookup"]}
        baseVelocity={1.2}
      />

      {/* Section About Baru */}
      <AboutSection />

      <OverlappingSteps />
      <PublicFooter />
    </main>
  );
}
