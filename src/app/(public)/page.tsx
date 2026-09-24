import { PublicNavbar } from "@/components/layouts/public-navbar";
import { HeroSection } from "@/components/sections/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { PublicFooter } from "@/components/layouts/public-footer";

export default function GuestLandingPage() {
  return (
    <main className="min-h-screen bg-[#faf8f5] text-[#0e1738] antialiased">
      <PublicNavbar />
      <HeroSection />
      <AboutSection />
      <TestimonialsSection />
      <PublicFooter />
    </main>
  );
}
