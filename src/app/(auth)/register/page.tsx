// src/app/(auth)/register/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, CheckCircle2, Award, QrCode } from "lucide-react";
import { RegisterForm } from "@/features/auth/components/register-form";

export default function RegisterPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#faf8f5]">
      {/* Left Column: Form Section */}
      <div className="lg:col-span-6 flex flex-col justify-between p-6 sm:p-12 lg:p-16">
        {/* Top Minimal Logo */}
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

        {/* Center Main Form */}
        <div className="py-12">
          <RegisterForm />
        </div>

        {/* Bottom Micro Legal */}
        <div className="text-xs font-medium text-slate-400">
          © 2026 VerifyEd Architecture. Terhubung ke register resmi penerbit.
        </div>
      </div>

      {/* Right Column: Mailcoach Style Periwinkle Canvas with Floating Visuals */}
      <div className="hidden lg:flex lg:col-span-6 bg-[#94b5ff] p-12 xl:p-16 flex-col justify-between relative overflow-hidden rounded-l-[48px]">
        {/* Ambient Top Glow */}
        <div className="pointer-events-none absolute -top-12 -right-12 w-96 h-96 bg-white/20 blur-3xl rounded-full" />

        {/* Headline Showcase */}
        <div className="relative z-10 max-w-md space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 backdrop-blur-md text-[#0e1738] text-xs font-bold shadow-xs">
            <Award className="w-3.5 h-3.5 text-[#0e1738]" />
            <span>Penerbitan Terverifikasi</span>
          </div>

          <h2 className="text-4xl xl:text-5xl font-extrabold text-[#0e1738] tracking-tight leading-tight">
            Berikan Kredibilitas Absolut Pada Tiap Peserta Anda.
          </h2>

          <p className="text-sm font-medium text-[#0e1738]/80 leading-relaxed">
            Platform penerbitan instan dengan dukungan QR Code dinamis dan
            pemeriksaan integritas file tanpa birokrasi legalitas kuno.
          </p>
        </div>

        {/* Center Showcase Visual Cards */}
        <div className="relative my-8 h-72 flex items-center justify-center">
          {/* Certificate Badge Card (Tilted Left) */}
          <div className="w-72 bg-white rounded-2xl p-5 shadow-2xl border border-slate-100 -rotate-3 absolute left-4 top-2">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                ACTIVE_ISSUANCE
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="pt-3 space-y-1">
              <div className="text-[11px] text-slate-400">Penerbit Acara</div>
              <div className="text-xs font-bold text-[#0e1738]">
                National Tech Hackathon 2026
              </div>
              <div className="text-[10px] font-mono text-slate-500 pt-1">
                CERT-2026-X77A
              </div>
            </div>
          </div>

          {/* Floating Testimonial Pill (Tilted Right) */}
          <div className="w-64 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/60 rotate-3 absolute right-6 bottom-4 z-10">
            <p className="text-xs font-semibold text-slate-700 leading-snug">
              &ldquo;Proses upload massal dan penempatan QR selesai dalam
              hitungan menit.&rdquo;
            </p>
            <div className="flex items-center gap-2.5 mt-3 pt-2 border-t border-slate-100">
              <div className="relative w-6 h-6 rounded-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Avatar"
                  fill
                  sizes="24px"
                  className="object-cover"
                />
              </div>
              <span className="text-[11px] font-bold text-[#0e1738]">
                Fajar Ramadhan
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Micro Feature List */}
        <div className="relative z-10 flex items-center gap-6 pt-6 border-t border-[#0e1738]/10 text-xs font-bold text-[#0e1738]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#0e1738]" />
            <span>Tanpa Biaya Setup</span>
          </div>
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-[#0e1738]" />
            <span>QR Token Otomatis</span>
          </div>
        </div>
      </div>
    </div>
  );
}
