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
        y: 40,
        opacity: 0,
        duration: 0.85,
        stagger: 0.12,
      })
        .from(".hero-subtext", { y: 20, opacity: 0, duration: 0.65 }, "-=0.5")
        .from(".hero-cta-group", { y: 20, opacity: 0, duration: 0.55 }, "-=0.4")
        .from(
          ".floating-testi-card",
          {
            y: 45,
            opacity: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "back.out(1.3)",
          },
          "-=0.3",
        )
        .from(
          "#verification-portal",
          {
            y: 35,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.4",
        );

      // Idle float wobble animation
      gsap.to(".card-tilt-left", {
        y: -7,
        rotate: -2.5,
        repeat: -1,
        yoyo: true,
        duration: 3.4,
        ease: "sine.inOut",
      });
      gsap.to(".card-tilt-right", {
        y: -8,
        rotate: 3,
        repeat: -1,
        yoyo: true,
        duration: 4,
        ease: "sine.inOut",
      });
      gsap.to(".card-tilt-bottom", {
        y: 7,
        rotate: -1,
        repeat: -1,
        yoyo: true,
        duration: 3.6,
        ease: "sine.inOut",
      });
    },
    { scope: container },
  );

  return (
    <section
      ref={container}
      className="relative w-full p-2 sm:p-3 md:p-4 bg-[#faf8f5] overflow-visible"
    >
      {/* Canvas Periwinkle: ubah ke overflow-visible agar card bisa overlap ke bawah */}
      <div className="relative w-full bg-[#94b5ff] text-[#0e1738] rounded-[32px] sm:rounded-[40px] md:rounded-[48px] pt-28 sm:pt-36 md:pt-40 pb-16 sm:pb-20 px-6 sm:px-12 md:px-16 overflow-visible flex flex-col justify-between shadow-xs">
        <div className="max-w-7xl mx-auto w-full">
          {/* Top Content: Headline & Deskripsi */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-10 sm:mb-14">
            <div className="lg:col-span-8">
              <h1 className="hero-headline text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.02] text-[#0e1738]">
                Institusi <br />
                terbitkan di <br />
                VerifyEd
              </h1>

              <div className="hero-cta-group flex flex-wrap items-center gap-4 mt-8">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-7 py-4 rounded-full bg-[#0e1738] text-white text-sm sm:text-base font-bold hover:bg-[#1a254d] transition-all shadow-lg shadow-[#0e1738]/15 active:scale-95"
                >
                  Coba Verifikasi Gratis
                </Link>
                <span className="text-xs sm:text-sm font-semibold text-[#0e1738]/85">
                  Akses publik tanpa perlu kartu kredit
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 lg:pt-6">
              <p className="hero-subtext text-lg sm:text-xl lg:text-2xl font-medium text-[#0e1738]/90 leading-relaxed">
                Infrastruktur sertifikasi dokumen legal untuk menerbitkan,
                memverifikasi, dan melindungi kredensial akademik secara instan.
              </p>
            </div>
          </div>

          {/* Floating Testimonial Cards */}
          <div className="relative my-8 sm:my-12 min-h-[380px] lg:min-h-[440px] flex flex-col justify-center">
            {/* Card 1 */}
            <div className="floating-testi-card card-tilt-left w-full sm:w-[380px] lg:w-[430px] bg-white rounded-2xl p-6 shadow-xl border border-slate-100/90 mb-4 sm:mb-0 sm:absolute sm:left-0 sm:top-2 -rotate-2 z-10">
              <p className="text-sm sm:text-[15px] font-semibold text-slate-800 leading-relaxed">
                &ldquo;Sebelumnya kami mengecek ijazah fisik satu per satu.{" "}
                <strong>Dengan VerifyEd, validasi tuntas dalam 1 detik.</strong>
                &rdquo;
              </p>
              <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-100">
                <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden shrink-0">
                  <Image
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                    alt="Reviewer"
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-[#0e1738]">
                    Anindya Putri
                  </div>
                  <div className="text-[11px] sm:text-xs text-slate-500 font-medium">
                    Head of Academic Affairs
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="floating-testi-card card-tilt-right w-full sm:w-[400px] lg:w-[450px] bg-white rounded-2xl p-6 shadow-xl border border-slate-100/90 mb-4 sm:mb-0 sm:absolute sm:right-0 sm:-top-4 rotate-3 z-10">
              <p className="text-sm sm:text-[15px] font-semibold text-slate-800 leading-relaxed">
                &ldquo;VerifyEd memiliki{" "}
                <strong>seluruh fitur integritas penting</strong> tanpa
                kerumitan birokrasi legalitas kuno.&rdquo;
              </p>
              <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-100">
                <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden shrink-0">
                  <Image
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
                    alt="Reviewer"
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-[#0e1738]">
                    Reza Pratama
                  </div>
                  <div className="text-[11px] sm:text-xs text-slate-500 font-medium">
                    Lead Organizer Techfest
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="floating-testi-card card-tilt-bottom w-full sm:w-[440px] lg:w-[490px] bg-white rounded-2xl p-6 sm:p-7 shadow-2xl border border-slate-100/90 mx-auto sm:mt-32 lg:mt-36 -rotate-1 relative z-20">
              <p className="text-sm sm:text-[15px] font-semibold text-slate-800 leading-relaxed">
                &ldquo;Setelah mencoba berbagai platform sertifikat, VerifyEd
                memberikan kepastian orisinalitas tanpa celah pemalsuan.&rdquo;
              </p>
              <div className="flex items-center gap-3.5 mt-4 pt-3 border-t border-slate-100">
                <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden shrink-0">
                  <Image
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80"
                    alt="Reviewer"
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-[#0e1738]">
                    Dimas Bagaskara
                  </div>
                  <div className="text-[11px] sm:text-xs text-slate-500 font-medium">
                    Wakil Rektor Kemahasiswaan
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Verification Dock: Overlapping dengan margin negatif ke bawah */}
          <div
            id="verification-portal"
            className="mt-12 sm:mt-16 -mb-20 sm:-mb-24 relative z-30 max-w-2xl mx-auto px-2 sm:px-0"
          >
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl shadow-[#0e1738]/15 border border-white/90">
              <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-100">
                <div className="flex gap-1.5 p-1 bg-slate-100/80 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setActiveTab("id")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                      activeTab === "id"
                        ? "bg-[#0e1738] text-white shadow-sm"
                        : "text-slate-600 hover:text-black"
                    }`}
                  >
                    ID Sertifikat
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("qr")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                      activeTab === "qr"
                        ? "bg-[#0e1738] text-white shadow-sm"
                        : "text-slate-600 hover:text-black"
                    }`}
                  >
                    Kode QR
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("pdf")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                      activeTab === "pdf"
                        ? "bg-[#0e1738] text-white shadow-sm"
                        : "text-slate-600 hover:text-black"
                    }`}
                  >
                    Unggah PDF
                  </button>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100/90 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Portal Siaga</span>
                </div>
              </div>

              {activeTab === "id" && (
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={certId}
                      onChange={(e) => setCertId(e.target.value)}
                      placeholder="Masukkan Certificate ID (e.g. CERT-2026-XXXX)"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-xs sm:text-sm font-mono font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0e1738]/20 focus:border-[#0e1738] transition-all"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-4" />
                  </div>
                  <button
                    type="button"
                    className="px-6 py-3.5 rounded-xl bg-[#0e1738] text-white text-xs sm:text-sm font-bold hover:bg-[#1a254d] transition-all flex items-center justify-center gap-2 shrink-0 shadow-md shadow-[#0e1738]/10 active:scale-95"
                  >
                    <span>Cek Validitas</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {activeTab === "qr" && (
                <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-slate-400 transition-colors bg-slate-50/80">
                  <QrCode className="w-7 h-7 mx-auto text-[#0e1738] mb-2" />
                  <span className="text-xs sm:text-sm font-bold text-slate-800 block">
                    Arahkan Kamera atau Unggah File QR
                  </span>
                  <span className="text-[11px] text-slate-500 mt-0.5 block">
                    Sistem mendeteksi token terenkripsi dari barcode
                  </span>
                </div>
              )}

              {activeTab === "pdf" && (
                <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-slate-400 transition-colors bg-slate-50/80">
                  <FileCheck2 className="w-7 h-7 mx-auto text-[#0e1738] mb-2" />
                  <span className="text-xs sm:text-sm font-bold text-slate-800 block">
                    Pilih Berkas PDF Asli untuk Uji Checksum
                  </span>
                  <span className="text-[11px] text-slate-500 mt-0.5 block">
                    Validasi integritas berkas secara aman langsung di browser
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
