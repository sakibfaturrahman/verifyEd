import { PublicNavbar } from "@/components/layouts/public-navbar";
import { HeroSection } from "@/features/verification/components/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { OverlappingSteps } from "@/components/sections/overlapping-steps";
import { PublicFooter } from "@/components/layouts/public-footer";

export default function GuestLandingPage() {
  return (
    <main className="min-h-screen bg-[#faf8f5] text-[#0e1738] antialiased">
      <PublicNavbar />
      <HeroSection />
      <AboutSection />

      {/* Testimonials Grid & Bento */}
      <TestimonialsSection />

      <OverlappingSteps />
      <PublicFooter />
    </main>
  );
}
