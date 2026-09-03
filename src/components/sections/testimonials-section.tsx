// src/components/sections/testimonials-section.tsx
"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { ShieldCheck } from "lucide-react";

interface Testimonial {
  quote: React.ReactNode;
  name: string;
  role: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    quote: (
      <>
        VerifyEd menangani seluruh penerbitan berkas kami{" "}
        <span className="text-[#3b5998] font-bold">tanpa hambatan</span>, dengan kontrol tata letak
        QR hingga koordinat piksel terkecil.
      </>
    ),
    name: "Alex Garrett-Smith",
    role: "Lead Instructor, Codecourse",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
  },
  {
    quote: (
      <>
        Kami pernah mencoba verifikasi tanda tangan manual.{" "}
        <span className="text-[#3b5998] font-bold">Tidak ada yang secepat VerifyEd, 100/100.</span>
      </>
    ),
    name: "Brent Roose",
    role: "Developer Advocate",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
  },
  {
    quote: (
      <>
        Semua yang Anda butuhkan dari sebuah platform integritas sertifikat digital 🎓 🔒
      </>
    ),
    name: "Dries Vints",
    role: "Open Source Contributor",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
  },
  {
    quote: (
      <>
        VerifyEd memiliki <span className="font-bold">semua fitur yang benar-benar esensial</span>{" "}
        tanpa beban sistem yang lambat atau birokrasi berlebih.
      </>
    ),
    name: "Jack McDade",
    role: "Founder, Statamic",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80",
  },
  {
    quote: (
      <>
        Kami mengintegrasikan API VerifyEd ke sistem kelulusan multi-tenant kami dan{" "}
        <span className="text-[#3b5998] font-bold">hasilnya sangat memuaskan</span> bagi panitia.
      </>
    ),
    name: "Luke Abell",
    role: "Chief Technology Officer",
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80",
  },
  {
    quote: (
      <>
        Antarmuka paling bersih dan ramah pengguna. Menjaga verifikasi berkas{" "}
        <span className="text-[#3b5998] font-bold">tetap terpercaya dan mudah diaudit</span> 👏
      </>
    ),
    name: "Mattias Geniar",
    role: "Security & Infrastructure Lead",
    avatar:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80",
  },
  {
    quote: (
      <>
        Sangat tepat sasaran: panitia non-teknis bisa langsung unggah, sementara pengembang dapat{" "}
        <span className="text-[#3b5998] font-bold">mengotomasi via REST API</span> secara terpadu.
      </>
    ),
    name: "Menno",
    role: "Early Adopter Organizer",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80",
  },
  {
    quote: (
      <>
        Menggunakannya sejak rilis uji coba awal, dan ini pertama kalinya tim verifikator kami{" "}
        <span className="text-[#3b5998] font-bold">tidak menerima komplain dokumen palsu</span>.
      </>
    ),
    name: "Nuno Maduro",
    role: "Software Architect",
    avatar:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120&auto=format&fit=crop&q=80",
  },
  {
    quote: (
      <>
        Setelah mencoba berbagai sistem akreditasi, VerifyEd adalah{" "}
        <span className="text-[#3b5998] font-bold">angin segar untuk dunia sertifikasi</span>.
      </>
    ),
    name: "Simon Hamp",
    role: "Freelance Software Engineer",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
  },
  {
    quote: (
      <>
        VerifyEd adalah salah satu platform verifikasi digital{" "}
        <span className="text-[#3b5998] font-bold">terbaik dan paling solid</span> yang pernah kami uji!
      </>
    ),
    name: "Zacharias Creutznacher",
    role: "CTO, Digital Ecosystem",
    avatar:
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80",
  },
];

export function TestimonialsSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".testi-item", {
        y: 35,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".featured-bento", {
        scale: 0.96,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".featured-bento",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="py-28 px-6 bg-white text-[#0e1738]">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-3">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#0e1738]">
            You&apos;re in good company
          </h2>
          <p className="text-sm sm:text-base text-slate-500 font-medium leading-relaxed">
            Bergabung bersama jaringan institusi pendidikan, penyelenggara kompetisi, dan komunitas
            teknologi yang mempercayakan integritas sertifikat mereka di VerifyEd.
          </p>
        </div>

        {/* 3-Column Minimalist Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-14 mb-28">
          {testimonials.map((item, idx) => (
            <div key={idx} className="testi-item flex flex-col justify-between space-y-4">
              <p className="text-[13px] sm:text-sm font-medium leading-relaxed text-slate-700">
                {item.quote}
              </p>

              <div className="flex items-center gap-3 pt-1">
                <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border border-slate-200">
                  <Image
                    src={item.avatar}
                    alt={item.name}
                    fill
                    sizes="36px"
                    className="object-cover"
                  />
                </div>
                <div className="leading-tight">
                  <div className="text-xs font-bold text-[#0e1738]">{item.name}</div>
                  <div className="text-[11px] text-slate-500 font-medium">{item.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Featured Creator Bento Card (Persis Bagian Bawah Gambar) */}
        <div className="featured-bento bg-[#f6f4ee] rounded-[36px] p-8 sm:p-14 text-center max-w-4xl mx-auto space-y-6">
          {/* Brand Tag Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-[#146375] text-white text-xs font-black tracking-widest uppercase shadow-sm">
            <ShieldCheck className="w-4 h-4" />
            <span>VERIFYED PROTOCOL</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0e1738] tracking-tight">
            Built by engineers, we know what makes a trusted credential
          </h3>

          <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed max-w-2xl mx-auto">
            &ldquo;Seluruh standar arsitektur kami lahir dari kebutuhan nyata akan keabsahan
            dokumen tanpa celah. Kami membangun VerifyEd untuk para penyelenggara, lembaga, dan
            pengembang independen yang mengutamakan integritas di atas segalanya.&rdquo;
          </p>

          {/* Author Footnote */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
              <Image
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                alt="Lead Architect"
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            <div className="text-left leading-tight">
              <div className="text-xs font-bold text-[#0e1738]">Core Engineering Team</div>
              <div className="text-[11px] text-slate-500 font-medium">VerifyEd Architecture</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}