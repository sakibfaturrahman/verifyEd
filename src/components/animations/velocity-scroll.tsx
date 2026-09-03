// src/components/animations/velocity-scroll.tsx
"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";

interface VelocityScrollProps {
  items: string[];
  baseVelocity?: number;
}

export function VelocityScroll({
  items,
  baseVelocity = 1,
}: VelocityScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track) return;

      let xPercent = 0;
      let direction = -1;

      const anim = gsap.to(track, {
        xPercent: -50,
        ease: "none",
        duration: 25 / baseVelocity,
        repeat: -1,
        onRepeat: () => {
          gsap.set(track, { xPercent: 0 });
        },
      });

      ScrollTrigger.create({
        onUpdate: (self) => {
          const vel = Math.abs(self.getVelocity() / 300);
          // Mempercepat rotasi marquee saat user scroll kencang
          gsap.to(anim, {
            timeScale: (1 + vel) * direction,
            duration: 0.3,
            overwrite: "auto",
            onComplete: () => {
              gsap.to(anim, { timeScale: 1 * direction, duration: 0.8 });
            },
          });
        },
      });
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="overflow-hidden whitespace-nowrap select-none py-6 border-y border-border/40 bg-muted/20"
    >
      <div ref={trackRef} className="inline-flex gap-8 will-change-transform">
        {[...items, ...items, ...items, ...items].map((text, i) => (
          <div
            key={i}
            className="flex items-center gap-8 text-xs md:text-sm uppercase font-mono tracking-widest text-muted-foreground/70"
          >
            <span>{text}</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary/40" />
          </div>
        ))}
      </div>
    </div>
  );
}
