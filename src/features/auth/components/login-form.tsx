// src/features/auth/components/login-form.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowRight, Mail, Lock, Loader2 } from "lucide-react";
import { useLoginMutation } from "@/features/auth/hooks/use-auth-mutations";
import { useAuthStore } from "@/stores/auth-store";

export function LoginForm() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const loginMutation = useLoginMutation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (response) => {
          if (response.data) {
            const { accessToken, refreshToken, expiresAt, profile } =
              response.data;

            setAuth({
              accessToken,
              refreshToken,
              expiresAt,
              user: profile,
            });

            toast.success("Autentikasi Berhasil", {
              description: `Selamat datang kembali, ${profile.name}!`,
            });

            router.push("/dashboard");
          }
        },
        onError: (err) => {
          const errMsg =
            err.response?.data?.message ||
            "Kombinasi email atau kata sandi tidak valid.";
          toast.error("Gagal Masuk", {
            description: errMsg,
          });
        },
      },
    );
  };

  return (
    <div className="space-y-7">
      {/* Header Form */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0e1738] dark:text-zinc-50">
          Selamat Datang Kembali
        </h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium leading-relaxed">
          Masuk ke workspace Anda untuk mengelola acara, menerbitkan berkas, dan
          memantau log verifikasi.
        </p>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleLogin} className="space-y-4">
        {/* Email Address */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#0e1738] dark:text-zinc-200">
            Alamat Email
          </label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@domain.com"
              className="w-full bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-medium text-[#0e1738] dark:text-zinc-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0e1738]/15 focus:border-[#0e1738] transition-all pr-10"
            />
            <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#0e1738] dark:text-zinc-200">
              Kata Sandi
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-slate-500 dark:text-zinc-400 hover:text-[#0e1738] dark:hover:text-zinc-200 transition-colors"
            >
              Lupa sandi?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan kata sandi..."
              className="w-full bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-medium text-[#0e1738] dark:text-zinc-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0e1738]/15 focus:border-[#0e1738] transition-all pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-[#0e1738] dark:hover:text-zinc-200 transition-colors cursor-pointer"
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
            className="text-xs text-slate-600 dark:text-zinc-400 font-medium select-none cursor-pointer"
          >
            Ingat sesi saya di perangkat ini
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-[#0e1738] dark:bg-zinc-100 text-white dark:text-[#0e1738] text-sm font-bold hover:bg-[#1a254d] transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loginMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Memverifikasi Akses...</span>
            </>
          ) : (
            <>
              <span>Masuk ke Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Footer Switcher */}
      <div className="text-center pt-2 text-xs font-medium text-slate-500 dark:text-zinc-400">
        Belum memiliki akun penerbit?{" "}
        <Link
          href="/register"
          className="font-bold text-[#0e1738] dark:text-zinc-200 hover:underline"
        >
          Daftar sekarang
        </Link>
      </div>
    </div>
  );
}
