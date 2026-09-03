// src/components/layouts/public-footer.tsx
"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
  Globe2,
  Terminal,
  Fingerprint,
  Check,
  Copy,
} from "lucide-react";

export function PublicFooter() {
  const [copied, setCopied] = useState(false);
  const contractAddress = "0x7F2...VERIFY_ED_2026";

  const handleCopy = () => {
    navigator.clipboard.writeText("VERIFYED_NETWORK_ID_0x7F2A");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="relative overflow-hidden bg-background text-foreground pt-24 pb-12 border-t border-border/50">
      {/* Dynamic Ambient Blur Glows */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[850px] h-[350px] bg-gradient-to-tr from-primary/20 via-indigo-500/15 to-emerald-400/15 blur-[160px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Upper Grid: Playful Bento Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-16 border-b border-border/40">
          {/* Bento Card 1: Kinetic Brand Capsule */}
          <div className="lg:col-span-6 flex flex-col justify-between p-8 sm:p-10 rounded-3xl bg-white/40 dark:bg-card/40 backdrop-blur-2xl border border-white/50 dark:border-white/10 shadow-xl shadow-black/5 relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full pointer-events-none" />

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground text-background text-xs font-mono mb-6">
                <Terminal className="w-3.5 h-3.5" />
                <span>BUILD_EDITION // 2026</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                Membangun Standar Baru <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-500 to-emerald-500">
                  Keabsahan Dokumen.
                </span>
              </h2>

              <p className="text-sm sm:text-base text-muted-foreground mt-4 max-w-md leading-relaxed">
                Eksplorasi antarmuka verifikasi yang memadukan kecepatan
                komputasi instan dengan transparansi data desentral.
              </p>
            </div>

            {/* Interactive Token Strip */}
            <div className="mt-8 pt-6 border-t border-border/50 flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-xl bg-background/80 hover:bg-background border border-border/60 transition-all cursor-pointer group/btn"
              >
                <Fingerprint className="w-3.5 h-3.5 text-primary" />
                <span>NODE_REF: {contractAddress}</span>
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-muted-foreground group-hover/btn:text-foreground" />
                )}
              </button>

              <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>ALL SYSTEMS OPERATIONAL</span>
              </div>
            </div>
          </div>

          {/* Bento Card 2: Visual Eccentric Stickers & Micro Navigation */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Sticker 1: Protocol Explorer */}
            <div className="p-6 rounded-3xl bg-muted/30 border border-border/60 flex flex-col justify-between hover:border-foreground/30 transition-all group">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1">
                  Architecture
                </div>
                <h3 className="text-lg font-bold">Verifikasi Instan</h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Pengecekan integritas langsung tanpa alur birokrasi berbelit.
                </p>
              </div>

              <Link
                href="/verify"
                className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-foreground group-hover:text-primary transition-colors"
              >
                <span>Buka Portal</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>

            {/* Sticker 2: Playful Interactive Badge */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-background to-background border border-indigo-500/20 flex flex-col justify-between relative overflow-hidden group">
              {/* Playful Tilted Tag */}
              <div className="absolute top-4 right-4 rotate-6 group-hover:rotate-0 transition-transform">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-foreground text-background px-2.5 py-1 rounded-full shadow-md">
                  V.1.0_BETA
                </span>
              </div>

              <div>
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1">
                  Ecosystem
                </div>
                <h3 className="text-lg font-bold">Akses Penyelenggara</h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Workspace untuk menerbitkan sertifikat terenkripsi.
                </p>
              </div>

              <Link
                href="/login"
                className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-foreground group-hover:text-indigo-500 transition-colors"
              >
                <span>Masuk Dashboard</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>

            {/* Sticker 3 (Spans 2 columns on mobile/tablet): Manifesto Capsule */}
            <div className="sm:col-span-2 p-6 rounded-3xl bg-white/40 dark:bg-card/40 backdrop-blur-xl border border-white/60 dark:border-white/10 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                  <Globe2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold">
                    Terbuka untuk Semua Dokumen
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Mendukung verifikasi lintas institusi & komunitas digital.
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-muted/60 text-[11px] font-mono text-muted-foreground">
                  ID_RESOLVER
                </span>
                <span className="px-3 py-1 rounded-full bg-muted/60 text-[11px] font-mono text-muted-foreground">
                  PDF_INTEGRITY
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section: Oversized Kinetic Branding */}
        <div className="py-12 select-none pointer-events-none">
          <div className="text-center font-extrabold tracking-tighter text-[15vw] sm:text-[16vw] leading-none text-muted-foreground/10 dark:text-muted-foreground/5 uppercase font-mono">
            VERIFYED
          </div>
        </div>

        {/* Lower Row: Minimalist Legal & Status Details */}
        <div className="pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary" />
            <span>PROJECT VERIFYED // HACKATHON PROTOCOL 2026</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="hover:text-foreground cursor-pointer transition-colors">
              SANDBOX_ENVIRONMENT
            </span>
            <span className="hover:text-foreground cursor-pointer transition-colors">
              IMMUTABLE_CORE
            </span>
            <span>NO TRACKERS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
