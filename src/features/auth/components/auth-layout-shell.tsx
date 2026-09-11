// src/features/auth/components/sliding-auth-container.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  QrCode,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";

interface SlidingAuthContainerProps {
  initialMode?: "login" | "register";
}

export function SlidingAuthContainer({
  initialMode = "login",
}: SlidingAuthContainerProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const isLogin = mode === "login";

  return (
    <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans antialiased selection:bg-[#122253] selection:text-white">
      {/* Container Card Frame */}
      <div className="relative w-full max-w-5xl min-h-[680px] bg-white rounded-[32px] sm:rounded-[40px] border border-slate-200/80 shadow-xl overflow-hidden flex flex-col lg:flex-row">
        {/* ========================================================= */}
        {/* SLOT KIRI (Tampilan Form Login) */}
        {/* ========================================================= */}
        <div
          className={`w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isLogin
              ? "opacity-100 translate-x-0 pointer-events-auto"
              : "opacity-0 -translate-x-8 pointer-events-none absolute lg:static"
          }`}
        >
          <div className="w-full max-w-sm mx-auto">
            <LoginForm onSwitchToRegister={() => setMode("register")} />
          </div>
        </div>

        {/* ========================================================= */}
        {/* SLOT KANAN (Tampilan Form Register) */}
        {/* ========================================================= */}
        <div
          className={`w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            !isLogin
              ? "opacity-100 translate-x-0 pointer-events-auto"
              : "opacity-0 translate-x-8 pointer-events-none absolute lg:static"
          }`}
        >
          <div className="w-full max-w-sm mx-auto">
            <RegisterForm onSwitchToLogin={() => setMode("login")} />
          </div>
        </div>

        {/* ========================================================= */}
        {/* SLIDING OVERLAY PANEL (Flat #94b5ff Minimalist) */}
        {/* ========================================================= */}
        <div
          className={`hidden lg:flex absolute top-3 bottom-3 w-[calc(50%-12px)] rounded-[28px] sm:rounded-[34px] bg-[#94b5ff] text-[#122253] p-10 flex-col justify-between transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] z-20 shadow-md ${
            isLogin
              ? "translate-x-[calc(100%+12px)]" // Posisi Kanan saat Login
              : "translate-x-0" // Posisi Kiri saat Register
          }`}
        >
          {/* Top: Header & Badge */}
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-white text-[#122253] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5 text-[#122253]" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-[#0e1738]">
                Verify<span className="text-[#122253]/80">Ed</span>
              </span>
            </Link>
          </div>

          {/* Middle: Feature Highlights */}
          <div className="space-y-5 my-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/60 border border-[#122253]/10 text-[11px] font-bold text-[#122253]">
              <CheckCircle2 size={13} className="text-[#122253]" />
              <span>
                {isLogin ? "Ruang Kerja Resmi" : "Mulai Mudah & Cepat"}
              </span>
            </div>

            <h3 className="text-2xl xl:text-3xl font-extrabold leading-snug tracking-tight text-[#0e1738]">
              {isLogin
                ? "Kelola & Pantau Semua Sertifikat di Satu Tempat."
                : "Terbitkan Sertifikat Resmi yang Bebas Pemalsuan."}
            </h3>

            <p className="text-xs font-medium text-[#122253]/80 leading-relaxed max-w-sm">
              {isLogin
                ? "Akses kembali berkas acara Anda, unduh dokumen yang sudah jadi, dan lihat berapa kali sertifikat Anda telah dicek oleh peserta."
                : "Bantu peserta membuktikan keaslian sertifikat mereka secara instan lewat pemindaian barcode resmi tanpa proses verifikasi manual yang rumit."}
            </p>

            <div className="pt-2 flex flex-col gap-2.5 text-xs text-[#0e1738]">
              <div className="flex items-center gap-2 font-bold">
                <div className="w-6 h-6 rounded-lg bg-white/60 flex items-center justify-center shrink-0">
                  <Lock size={13} className="text-[#122253]" />
                </div>
                <span>Jaminan Dokumen Asli & Tidak Bisa Diedit</span>
              </div>
              <div className="flex items-center gap-2 font-bold">
                <div className="w-6 h-6 rounded-lg bg-white/60 flex items-center justify-center shrink-0">
                  <QrCode size={13} className="text-[#122253]" />
                </div>
                <span>Cek Keaslian Instan Cukup Lewat Kamera HP</span>
              </div>
            </div>
          </div>

          {/* Bottom: Switcher Callout */}
          <div className="pt-5 border-t border-[#122253]/15 flex items-center justify-between">
            <div className="text-xs">
              <p className="text-[#122253]/70 font-medium">
                {isLogin ? "Belum ada akun?" : "Sudah punya akun?"}
              </p>
              <p className="font-bold text-[#0e1738]">
                {isLogin ? "Daftarkan instansi Anda" : "Masuk ke dasbor"}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setMode(isLogin ? "register" : "login")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#122253] text-white text-xs font-bold hover:bg-[#0e1738] transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <span>{isLogin ? "Daftar" : "Masuk"}</span>
              {isLogin ? <ArrowRight size={13} /> : <ArrowLeft size={13} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
