// src/components/sections/overlapping-steps.tsx
"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { Fingerprint, Cpu, FileBadge } from "lucide-react";

const cards = [
  {
    step: "01",
    title: "Penerbitan Terenkripsi",
    desc: "Setiap lembar sertifikat yang di-generate diberikan UUID unik, public QR token acak 64-karakter, dan hash SHA-256 dari byte file dokumen.",
    icon: Fingerprint,
    badge: "Cryptography",
  },
  {
    step: "02",
    title: "Penyimpanan Desentral",
    desc: "File fisik tersimpan aman di private storage bucket berpagar RLS (Row Level Security), mencegah akses tanpa token download tersumpah.",
    icon: Cpu,
    badge: "Integrity",
  },
  {
    step: "03",
    title: "Validasi Publik Tanpa Autentikasi",
    desc: "Pihak ketiga (perusahaan, recruiter, kampus) dapat langsung membuktikan orisinalitas tanpa perlu membuat akun atau login ke portal.",
    icon: FileBadge,
    badge: "Public Audit",
  },
];

export function OverlappingSteps() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cardElements = gsap.utils.toArray<HTMLElement>(".stacked-card");

      cardElements.forEach((card, i) => {
        ScrollTrigger.create({
          trigger: card,
          start: "top top+=120",
          end: "bottom top+=120",
          pin: true,
          pinSpacing: false,
          scrub: true,
        });

        if (i > 0) {
          gsap.from(card, {
            y: 80,
            opacity: 0.7,
            scale: 0.95,
            scrollTrigger: {
              trigger: card,
              start: "top bottom-=100",
              end: "top top+=140",
              scrub: true,
            },
          });
        }
      });
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="py-28 px-6 bg-background relative z-10"
    >
      <div className="max-w-4xl mx-auto mb-16 text-center">
        <span className="text-xs font-mono uppercase tracking-widest text-primary">
          Infrastruktur Integritas
        </span>
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mt-3 mb-4">
          Tiga Lapisan Proteksi Dokumen
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto">
          Arsitektur verifikasi dirancang untuk menutup celah pemalsuan
          sertifikat secara matematis.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-12 pb-32">
        {cards.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="stacked-card sticky top-28 bg-card border border-border/80 rounded-2xl p-8 sm:p-10 shadow-xl shadow-black/5 flex flex-col md:flex-row gap-6 md:items-center justify-between"
            >
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground">
                    {item.step}
                  </span>
                  <span className="text-xs font-mono text-primary font-medium tracking-wide">
                    {item.badge}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="h-16 w-16 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                <Icon className="w-8 h-8" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
