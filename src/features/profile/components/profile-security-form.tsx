// src/features/profile/components/profile-security-form.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Lock, Eye, EyeOff, KeyRound } from "lucide-react";

export function ProfileSecurityForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Konfirmasi Sandi Gagal", {
        description: "Kata sandi baru dan konfirmasi sandi tidak cocok.",
      });
      return;
    }
    toast.success("Kata Sandi Diperbarui", {
      description: "Kredensial login Anda telah berhasil diamankan.",
    });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-6 shadow-xs space-y-6">
      <div className="pb-3 border-b border-slate-100 dark:border-zinc-800">
        <h3 className="text-sm font-bold text-[#0e1738] dark:text-zinc-100 flex items-center gap-2">
          <KeyRound size={15} className="text-indigo-600" />
          <span>Keamanan Akun & Kata Sandi</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
          Perbarui kata sandi secara berkala untuk menjaga integritas akses
          penerbitan dokumen.
        </p>
      </div>

      <form
        onSubmit={handlePasswordSubmit}
        className="space-y-4 text-xs max-w-xl"
      >
        {/* Kata Sandi Lama */}
        <div className="space-y-1.5">
          <label className="font-bold text-slate-700 dark:text-zinc-200">
            Kata Sandi Saat Ini
          </label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Masukkan sandi saat ini..."
              className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 font-medium text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#0e1738]/15 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-700"
            >
              {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        {/* Kata Sandi Baru */}
        <div className="space-y-1.5">
          <label className="font-bold text-slate-700 dark:text-zinc-200">
            Kata Sandi Baru
          </label>
          <input
            type={showPass ? "text" : "password"}
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Minimal 8 karakter unik..."
            className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 font-medium text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#0e1738]/15"
          />
        </div>

        {/* Konfirmasi Kata Sandi */}
        <div className="space-y-1.5">
          <label className="font-bold text-slate-700 dark:text-zinc-200">
            Ulangi Kata Sandi Baru
          </label>
          <input
            type={showPass ? "text" : "password"}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Ketik ulang sandi baru..."
            className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 font-medium text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#0e1738]/15"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all shadow-xs cursor-pointer"
          >
            <Lock size={14} />
            <span>Perbarui Kata Sandi</span>
          </button>
        </div>
      </form>
    </div>
  );
}
