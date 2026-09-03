// src/features/auth/components/login-form.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, Mail, Lock } from "lucide-react";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto space-y-7">
      {/* Header Form */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0e1738]">
          Selamat Datang Kembali
        </h1>
        <p className="text-sm text-slate-500 font-medium leading-relaxed">
          Masuk ke workspace Anda untuk mengelola acara, menerbitkan berkas, dan
          memantau log verifikasi.
        </p>
      </div>

      {/* Form Fields */}
      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        {/* Email Address */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#0e1738]">
            Alamat Email
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
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#0e1738]">
              Kata Sandi
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-slate-500 hover:text-[#0e1738] transition-colors"
            >
              Lupa sandi?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan kata sandi..."
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

        {/* Remember Me Checkbox */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="remember"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-[#0e1738] focus:ring-[#0e1738]/20 cursor-pointer"
          />
          <label
            htmlFor="remember"
            className="text-xs text-slate-600 font-medium select-none cursor-pointer"
          >
            Ingat sesi saya di perangkat ini
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-[#0e1738] text-white text-sm font-bold hover:bg-[#1a254d] transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <span>Masuk ke Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Footer Switcher */}
      <div className="text-center pt-2 text-xs font-medium text-slate-500">
        Belum memiliki akun penerbit?{" "}
        <Link
          href="/register"
          className="font-bold text-[#0e1738] hover:underline"
        >
          Daftar sekarang
        </Link>
      </div>
    </div>
  );
}
