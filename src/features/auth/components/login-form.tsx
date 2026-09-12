// src/features/auth/components/login-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowRight, Mail, Lock, Loader2 } from "lucide-react";
import { useLoginMutation } from "@/features/auth/hooks/use-auth-mutations";
import { useAuthStore } from "@/stores/auth-store";

interface LoginFormProps {
  onSwitchToRegister?: () => void;
}

export function LoginForm({ onSwitchToRegister }: LoginFormProps) {
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

            // Simpan sesi ke Zustand (persist ke localStorage)
            setAuth({ accessToken, refreshToken, expiresAt, user: profile });

            toast.success("Autentikasi Berhasil", {
              description: `Selamat datang kembali, ${profile.name}!`,
            });

            // Role-based redirection
            if (profile.role === "admin") {
              router.push("/admin");
            } else {
              router.push("/user");
            }
          }
        },
        onError: (err) => {
          toast.error("Gagal Masuk", {
            description:
              err.response?.data?.message ||
              "Kombinasi email atau kata sandi tidak cocok.",
          });
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#122253]">
          Masuk Akun
        </h2>
        <p className="text-xs text-slate-500 font-normal leading-relaxed">
          Masukkan kredensial terdaftar untuk mengelola penerbitan sertifikat.
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-3.5 text-xs">
        {/* Email */}
        <div className="space-y-1">
          <label className="font-bold text-[#122253]">Alamat Surel Resmi</label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@lembaga.ac.id"
              className="w-full bg-[#eee9df]/50 border border-transparent focus:border-[#122253]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#122253] placeholder:text-slate-400 focus:outline-none focus:bg-[#eee9df]/80 transition-all pr-9 font-medium"
            />
            <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="font-bold text-[#122253]">Kata Sandi</label>
            <span className="text-[11px] font-semibold text-slate-400 hover:text-[#122253] cursor-pointer">
              Lupa sandi?
            </span>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan kata sandi..."
              className="w-full bg-[#eee9df]/50 border border-transparent focus:border-[#122253]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#122253] placeholder:text-slate-400 focus:outline-none focus:bg-[#eee9df]/80 transition-all pr-9 font-medium"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-[#122253] transition-colors cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Remember me */}
        <div className="flex items-center gap-2 pt-0.5">
          <input
            type="checkbox"
            id="login-remember"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-3.5 w-3.5 rounded border-slate-300 text-[#122253] focus:ring-[#122253]/20 cursor-pointer"
          />
          <label
            htmlFor="login-remember"
            className="text-[11px] text-slate-500 font-medium select-none cursor-pointer"
          >
            Ingat sesi login di perangkat ini
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full mt-2 py-3 rounded-xl bg-[#122253] text-white text-xs font-bold hover:bg-[#0e1738] transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 cursor-pointer"
        >
          {loginMutation.isPending ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Memverifikasi...</span>
            </>
          ) : (
            <>
              <span>Masuk ke Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      {/* Mobile Switcher */}
      <div className="lg:hidden text-center pt-2 text-xs text-slate-500">
        Belum memiliki akun?{" "}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="font-bold text-[#122253] underline cursor-pointer"
        >
          Daftar akun baru
        </button>
      </div>
    </div>
  );
}
