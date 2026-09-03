// src/app/(auth)/login/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, CheckCircle2, Lock, Activity } from "lucide-react";
import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#faf8f5]">
      {/* Left Column: Form Section */}
      <div className="lg:col-span-6 flex flex-col justify-between p-6 sm:p-12 lg:p-16">
        {/* Top Brand Logo */}
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0e1738] text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-[#0e1738]">
              Verify<span className="text-[#3b5998]">Ed</span>
            </span>
          </Link>
        </div>

        {/* Center Main Login Form */}
        <div className="py-12">
          <LoginForm />
        </div>

        {/* Bottom Micro Legal */}
        <div className="text-xs font-medium text-slate-400">
          © 2026 VerifyEd Architecture. Seluruh sesi dilindungi enkripsi JWT
          berlapis.
        </div>
      </div>

      {/* Right Column: Periwinkle Canvas with Floating Visual Cards */}
      <div className="hidden lg:flex lg:col-span-6 bg-[#94b5ff] p-12 xl:p-16 flex-col justify-between relative overflow-hidden rounded-l-[48px]">
        {/* Ambient Top Glow */}
        <div className="pointer-events-none absolute -top-12 -right-12 w-96 h-96 bg-white/20 blur-3xl rounded-full" />

        {/* Headline Showcase */}
        <div className="relative z-10 max-w-md space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 backdrop-blur-md text-[#0e1738] text-xs font-bold shadow-xs">
            <Lock className="w-3.5 h-3.5 text-[#0e1738]" />
            <span>Autentikasi Terproteksi</span>
          </div>

          <h2 className="text-4xl xl:text-5xl font-extrabold text-[#0e1738] tracking-tight leading-tight">
            Akses Kendali Penuh Terhadap Portofolio Berkas.
          </h2>

          <p className="text-sm font-medium text-[#0e1738]/80 leading-relaxed">
            Kelola izin akses, pantau statistik verifikasi publik secara
            langsung, dan cabut kredensial bermasalah secara instan.
          </p>
        </div>

        {/* Center Visual Mockup Cards */}
        <div className="relative my-8 h-72 flex items-center justify-center">
          {/* Card 1: Metric Verification Pulse (Tilted Left) */}
          <div className="w-72 bg-white rounded-2xl p-5 shadow-2xl border border-slate-100 -rotate-3 absolute left-6 top-2">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-[10px] font-mono font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">
                AUDIT_STREAM
              </span>
              <Activity className="w-4 h-4 text-sky-600" />
            </div>
            <div className="pt-3 space-y-1">
              <div className="text-[11px] text-slate-400">
                Verifikasi Terakhir
              </div>
              <div className="text-sm font-bold text-[#0e1738]">
                CERT-2026-B812
              </div>
              <div className="text-[10px] font-mono text-emerald-600 font-bold flex items-center gap-1 pt-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Verified via QR Code (127.0.0.1)</span>
              </div>
            </div>
          </div>

          {/* Card 2: Security Notice Badge (Tilted Right) */}
          <div className="w-64 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/60 rotate-2 absolute right-8 bottom-4 z-10">
            <p className="text-xs font-semibold text-slate-700 leading-snug">
              &ldquo;Log audit verifikasi selalu terdata tanpa celah perubahan
              data manual.&rdquo;
            </p>
            <div className="flex items-center gap-2.5 mt-3 pt-2 border-t border-slate-100">
              <div className="relative w-6 h-6 rounded-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  alt="Avatar"
                  fill
                  sizes="24px"
                  className="object-cover"
                />
              </div>
              <span className="text-[11px] font-bold text-[#0e1738]">
                Reza Pratama
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Feature Pill Row */}
        <div className="relative z-10 flex items-center gap-6 pt-6 border-t border-[#0e1738]/10 text-xs font-bold text-[#0e1738]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#0e1738]" />
            <span>RLS Protected</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#0e1738]" />
            <span>Audit Trail Aktif</span>
          </div>
        </div>
      </div>
    </div>
  );
}
