// src/components/layouts/public-navbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  ChevronDown,
  ArrowRight,
  Sparkles,
  FileCheck2,
  QrCode,
  Building2,
  HelpCircle,
} from "lucide-react";

export function PublicNavbar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-4 px-4 sm:px-8 pointer-events-none flex justify-center">
      <div className="pointer-events-auto w-full max-w-5xl rounded-full bg-white/80 dark:bg-[#0e1738]/80 backdrop-blur-xl border border-white/60 dark:border-white/10 px-3.5 py-2 shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300">
        <div className="flex items-center justify-between">
          {/* Brand Logo with Soft Interactive Hover */}
          <Link href="/" className="flex items-center gap-2 pl-2 pr-3 group">
            <div className="w-8 h-8 rounded-xl bg-[#0e1738] dark:bg-white text-white dark:text-[#0e1738] flex items-center justify-center shadow-sm group-hover:rotate-6 transition-transform duration-300">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-[#0e1738] dark:text-white">
              Verify<span className="text-primary font-black">Ed</span>
            </span>
          </Link>

          {/* Center Navigation Links with Dropdown Panels */}
          <nav className="hidden md:flex items-center gap-1 text-[13px] font-semibold text-[#0e1738]/70 dark:text-zinc-300 relative">
            {/* Dropdown 1: Platform */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("platform")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full hover:text-[#0e1738] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all cursor-pointer"
              >
                <span>Fitur</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === "platform" ? "rotate-180 text-primary" : "opacity-60"}`}
                />
              </button>

              {/* Flyout Menu */}
              {activeDropdown === "platform" && (
                <div className="absolute top-full left-0 pt-3 w-64">
                  <div className="bg-white/95 dark:bg-[#0e1738]/95 backdrop-blur-2xl rounded-2xl p-2.5 border border-slate-200/80 dark:border-white/10 shadow-xl space-y-1">
                    <Link
                      href="#verification-portal"
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                    >
                      <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                        <QrCode className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#0e1738] dark:text-white">
                          QR & ID Resolver
                        </div>
                        <div className="text-[11px] text-muted-foreground font-normal">
                          Validasi berkas lewat token unik
                        </div>
                      </div>
                    </Link>

                    <Link
                      href="#verification-portal"
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                    >
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                        <FileCheck2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#0e1738] dark:text-white">
                          Uji Integritas Dokumen
                        </div>
                        <div className="text-[11px] text-muted-foreground font-normal">
                          Deteksi manipulasi file fisik
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Dropdown 2: Solusi */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("solutions")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full hover:text-[#0e1738] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all cursor-pointer"
              >
                <span>Solusi</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === "solutions" ? "rotate-180 text-primary" : "opacity-60"}`}
                />
              </button>

              {activeDropdown === "solutions" && (
                <div className="absolute top-full left-0 pt-3 w-60">
                  <div className="bg-white/95 dark:bg-[#0e1738]/95 backdrop-blur-2xl rounded-2xl p-2.5 border border-slate-200/80 dark:border-white/10 shadow-xl space-y-1">
                    <Link
                      href="/register"
                      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                    >
                      <Building2 className="w-4 h-4 text-primary" />
                      <span className="text-xs font-bold text-[#0e1738] dark:text-white">
                        Kampus & Sekolah
                      </span>
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-indigo-500" />
                      <span className="text-xs font-bold text-[#0e1738] dark:text-white">
                        Kompetisi & Bootcamp
                      </span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="#about"
              className="px-3.5 py-1.5 rounded-full hover:text-[#0e1738] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all"
            >
              Keunggulan
            </Link>

            <Link
              href="#verification-portal"
              className="px-3.5 py-1.5 rounded-full hover:text-[#0e1738] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all"
            >
              Uji Cepat
            </Link>
          </nav>

          {/* Right Action Group */}
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="text-xs font-bold text-[#0e1738] dark:text-white hover:text-primary px-3.5 py-2 rounded-full transition-colors hidden sm:inline-block"
            >
              Masuk
            </Link>

            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 text-xs font-extrabold px-4 py-2 rounded-full bg-[#0e1738] text-white hover:bg-black transition-all shadow-md active:scale-95 group"
            >
              <span>Daftar Penerbit</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
