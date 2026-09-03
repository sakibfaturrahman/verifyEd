// src/features/verification/components/hero-section.tsx
"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import {
  Search,
  CheckCircle2,
  QrCode,
  FileCheck2,
  ArrowRight,
} from "lucide-react";

export function HeroSection() {
  const container = useRef<HTMLDivElement>(null);
  const [certId, setCertId] = useState("");
  const [activeTab, setActiveTab] = useState<"id" | "qr" | "pdf">("id");

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-headline", {
        y: 35,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
      })
        .from(".hero-subtext", { y: 15, opacity: 0, duration: 0.6 }, "-=0.5")
        .from(".hero-cta-group", { y: 15, opacity: 0, duration: 0.5 }, "-=0.4")
        .from(
          ".floating-testi-card",
          {
            y: 40,
            opacity: 0,
            duration: 0.75,
            stagger: 0.1,
            ease: "back.out(1.3)",
          },
          "-=0.3",
        );

      // Idle float wobble animation
      gsap.to(".card-tilt-left", {
        y: -5,
        rotate: -2,
        repeat: -1,
        yoyo: true,
        duration: 3.2,
        ease: "sine.inOut",
      });
      gsap.to(".card-tilt-right", {
        y: -6,
        rotate: 2.5,
        repeat: -1,
        yoyo: true,
        duration: 3.8,
        ease: "sine.inOut",
      });
      gsap.to(".card-tilt-bottom", {
        y: 5,
        rotate: -1,
        repeat: -1,
        yoyo: true,
        duration: 3.4,
        ease: "sine.inOut",
      });
    },
    { scope: container },
  );

  return (
    /* Outer wrapper dengan border tipis dan mepet */
    <section
      ref={container}
      className="relative w-full p-1.5 sm:p-2.5 bg-[#faf8f5]"
    >
      {/* Giant Canvas Periwinkle Card */}
      <div className="relative w-full bg-[#94b5ff] text-[#0e1738] rounded-[28px] sm:rounded-[25px] pt-24 sm:pt-28 pb-10 px-5 sm:px-10 overflow-hidden flex flex-col justify-between shadow-xs">
        <div className="max-w-6xl mx-auto w-full">
          {/* Top Content: Headline & Deskripsi */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-6 sm:mb-8">
            {/* Main Headline (Kiri) */}
            <div className="lg:col-span-8">
              <h1 className="hero-headline text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.02] text-[#0e1738]">
                Institusi <br />
                terbitkan di <br />
                VerifyEd
              </h1>

              {/* CTA Group */}
              <div className="hero-cta-group flex flex-wrap items-center gap-3.5 mt-5">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#0e1738] text-white text-xs sm:text-sm font-bold hover:bg-[#1a254d] transition-all shadow-md active:scale-95"
                >
                  Coba Verifikasi Gratis
                </Link>
                <span className="text-xs font-semibold text-[#0e1738]/80">
                  Akses publik tanpa perlu kartu kredit
                </span>
              </div>
            </div>

            {/* Subtext Paragraph (Kanan) */}
            <div className="lg:col-span-4 lg:pt-4">
              <p className="hero-subtext text-sm sm:text-base font-medium text-[#0e1738]/85 leading-relaxed">
                Infrastruktur sertifikasi dokumen legal untuk menerbitkan,
                memverifikasi, dan melindungi kredensial akademik secara instan.
              </p>
            </div>
          </div>

          {/* Floating Testimonial Cards Layout Padat */}
          <div className="relative my-4 sm:my-6 min-h-[290px] flex flex-col justify-center">
            {/* Card 1 (Kiri Atas) */}
            <div className="floating-testi-card card-tilt-left w-full sm:w-[350px] bg-white rounded-xl p-4 shadow-lg border border-slate-100/90 mb-3 sm:mb-0 sm:absolute sm:left-2 sm:top-1 -rotate-2 z-10">
              <p className="text-xs sm:text-[13px] font-semibold text-slate-800 leading-snug">
                &ldquo;Sebelumnya kami mengecek ijazah fisik satu per satu.{" "}
                <strong>Dengan VerifyEd, validasi tuntas dalam 1 detik.</strong>
                &rdquo;
              </p>
              <div className="flex items-center gap-2.5 mt-3 pt-2 border-t border-slate-50">
                <div className="relative w-7 h-7 rounded-full overflow-hidden shrink-0">
                  <Image
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                    alt="Reviewer"
                    fill
                    sizes="28px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0e1738]">
                    Anindya Putri
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    Head of Academic Affairs
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 (Kanan Atas) */}
            <div className="floating-testi-card card-tilt-right w-full sm:w-[370px] bg-white rounded-2xl p-4 shadow-lg border border-slate-100/90 mb-3 sm:mb-0 sm:absolute sm:right-2 sm:-top-3 rotate-2 z-10">
              <p className="text-xs sm:text-[13px] font-semibold text-slate-800 leading-snug">
                &ldquo;VerifyEd memiliki{" "}
                <strong>seluruh fitur integritas penting</strong> tanpa
                kerumitan birokrasi legalitas kuno.&rdquo;
              </p>
              <div className="flex items-center gap-2.5 mt-3 pt-2 border-t border-slate-50">
                <div className="relative w-7 h-7 rounded-full overflow-hidden shrink-0">
                  <Image
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                    alt="Reviewer"
                    fill
                    sizes="28px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0e1738]">
                    Reza Pratama
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    Lead Organizer Techfest
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3 (Tengah Bawah) */}
            <div className="floating-testi-card card-tilt-bottom w-full sm:w-[390px] bg-white rounded-2xl p-4 sm:p-5 shadow-xl border border-slate-100/90 mx-auto sm:mt-16 -rotate-1 relative z-20">
              <p className="text-xs sm:text-[13px] font-semibold text-slate-800 leading-snug">
                &ldquo;Setelah mencoba berbagai platform sertifikat, VerifyEd
                memberikan kepastian orisinalitas tanpa celah pemalsuan.&rdquo;
              </p>
              <div className="flex items-center gap-2.5 mt-3 pt-2 border-t border-slate-50">
                <div className="relative w-7 h-7 rounded-full overflow-hidden shrink-0">
                  <Image
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
                    alt="Reviewer"
                    fill
                    sizes="28px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0e1738]">
                    Dimas Bagaskara
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    Wakil Rektor Kemahasiswaan
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Verification Dock */}
          <div id="verification-portal" className="mt-6 max-w-xl mx-auto">
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-white/80">
              <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-slate-100">
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab("id")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      activeTab === "id"
                        ? "bg-[#0e1738] text-white"
                        : "text-slate-600 hover:text-black"
                    }`}
                  >
                    ID Sertifikat
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("qr")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      activeTab === "qr"
                        ? "bg-[#0e1738] text-white"
                        : "text-slate-600 hover:text-black"
                    }`}
                  >
                    Kode QR
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("pdf")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      activeTab === "pdf"
                        ? "bg-[#0e1738] text-white"
                        : "text-slate-600 hover:text-black"
                    }`}
                  >
                    Unggah PDF
                  </button>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Portal Siaga</span>
                </div>
              </div>

              {activeTab === "id" && (
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={certId}
                      onChange={(e) => setCertId(e.target.value)}
                      placeholder="Masukkan Certificate ID (e.g. CERT-2026-XXXX)"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0e1738]/20 focus:border-[#0e1738]"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3" />
                  </div>
                  <button
                    type="button"
                    className="px-4 py-2.5 rounded-xl bg-[#0e1738] text-white text-xs font-bold hover:bg-[#1a254d] transition-all flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <span>Cek Validitas</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {activeTab === "qr" && (
                <div className="p-4 text-center border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-slate-400 transition-colors bg-slate-50">
                  <QrCode className="w-5 h-5 mx-auto text-[#0e1738] mb-1" />
                  <span className="text-xs font-bold text-slate-700">
                    Arahkan Kamera atau Unggah File QR
                  </span>
                </div>
              )}

              {activeTab === "pdf" && (
                <div className="p-4 text-center border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-slate-400 transition-colors bg-slate-50">
                  <FileCheck2 className="w-5 h-5 mx-auto text-[#0e1738] mb-1" />
                  <span className="text-xs font-bold text-slate-700">
                    Pilih Berkas PDF Asli untuk Uji Checksum
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
