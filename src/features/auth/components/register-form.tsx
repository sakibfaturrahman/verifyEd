// src/features/auth/components/register-form.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  Building2,
  Mail,
  Lock,
  User,
} from "lucide-react";

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"organizer" | "institution">("organizer");

  return (
    <div className="w-full max-w-md mx-auto space-y-7">
      {/* Header Form */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0e1738]">
          Buat Akun Penerbit
        </h1>
        <p className="text-sm text-slate-500 font-medium leading-relaxed">
          Mulai terbitkan sertifikat digital dengan segel integritas yang dapat
          diverifikasi publik.
        </p>
      </div>

      {/* Role Segmented Selector */}
      <div className="grid grid-cols-2 gap-1 p-1 bg-[#eee9df]/80 rounded-2xl border border-slate-200/60">
        <button
          type="button"
          onClick={() => setRole("organizer")}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            role === "organizer"
              ? "bg-white text-[#0e1738] shadow-xs"
              : "text-slate-600 hover:text-[#0e1738]"
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Event Organizer</span>
        </button>
        <button
          type="button"
          onClick={() => setRole("institution")}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            role === "institution"
              ? "bg-white text-[#0e1738] shadow-xs"
              : "text-slate-600 hover:text-[#0e1738]"
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Institusi / Kampus</span>
        </button>
      </div>

      {/* Form Fields */}
      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        {/* Full Name / Organization Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#0e1738]">
            {role === "organizer" ? "Nama Lengkap" : "Nama Institusi / Lembaga"}
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder={
                role === "organizer"
                  ? "e.g. Budi Santoso"
                  : "e.g. Universitas Teknologi Nusantara"
              }
              className="w-full bg-white border border-slate-200/90 rounded-xl px-4 py-3 text-sm font-medium text-[#0e1738] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0e1738]/15 focus:border-[#0e1738] transition-all"
            />
          </div>
        </div>

        {/* Email Address */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#0e1738]">
            Alamat Email Resmi
          </label>
          <div className="relative">
            <input
              type="email"
              placeholder="nama@domain.com"
              className="w-full bg-white border border-slate-200/90 rounded-xl px-4 py-3 text-sm font-medium text-[#0e1738] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0e1738]/15 focus:border-[#0e1738] transition-all pr-10"
            />
            <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#0e1738]">Kata Sandi</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Minimal 8 karakter"
              className="w-full bg-white border border-slate-200/90 rounded-xl px-4 py-3 text-sm font-medium text-[#0e1738] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0e1738]/15 focus:border-[#0e1738] transition-all pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-[#0e1738] transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Policy Checkbox */}
        <div className="flex items-start gap-2.5 pt-1">
          <input
            type="checkbox"
            id="terms"
            className="mt-1 h-4 w-4 rounded border-slate-300 text-[#0e1738] focus:ring-[#0e1738]/20"
          />
          <label
            htmlFor="terms"
            className="text-xs text-slate-500 font-medium leading-relaxed select-none"
          >
            Saya menyetujui{" "}
            <span className="font-bold text-[#0e1738] hover:underline cursor-pointer">
              Syarat & Ketentuan
            </span>{" "}
            serta integritas penjaminan keaslian dokumen VerifyEd.
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-[#0e1738] text-white text-sm font-bold hover:bg-[#1a254d] transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <span>Daftar Akun Penerbit</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Footer Switcher */}
      <div className="text-center pt-2 text-xs font-medium text-slate-500">
        Sudah memiliki akun terdaftar?{" "}
        <Link
          href="/login"
          className="font-bold text-[#0e1738] hover:underline"
        >
          Masuk di sini
        </Link>
      </div>
    </div>
  );
}
