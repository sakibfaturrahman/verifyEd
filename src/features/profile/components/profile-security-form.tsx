"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Lock, Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
import { useChangePasswordMutation } from "../hooks/use-profile";

export function ProfileSecurityForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const changePasswordMutation = useChangePasswordMutation();

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      toast.error("Kata Sandi Kurang Panjang", {
        description: "Kata sandi baru minimal harus terdiri dari 8 karakter.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Sandi Baru Tidak Cocok", {
        description:
          "Pastikan ketikan kata sandi baru dan konfirmasinya sama persis.",
      });
      return;
    }

    changePasswordMutation.mutate(
      {
        current_password: currentPassword,
        new_password: newPassword,
      },
      {
        onSuccess: () => {
          toast.success("Kata Sandi Berhasil Diperbarui", {
            description:
              "Gunakan kata sandi baru Anda saat masuk kembali ke aplikasi.",
          });
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
        onError: (err) => {
          toast.error("Gagal Memperbarui Sandi", {
            description:
              err.response?.data?.message ||
              "Kata sandi saat ini tidak tepat. Silakan periksa kembali.",
          });
        },
      },
    );
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-6 shadow-xs space-y-6">
      <div className="pb-3 border-b border-slate-100 dark:border-zinc-800">
        <h3 className="text-sm font-bold text-[#0e1738] dark:text-zinc-100 flex items-center gap-2">
          <KeyRound size={15} className="text-indigo-600" />
          <span>Ganti Kata Sandi Akun</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
          Ganti kata sandi secara rutin agar akun penerbit sertifikat Anda
          selalu aman dari penyalahgunaan.
        </p>
      </div>

      <form
        onSubmit={handlePasswordSubmit}
        className="space-y-4 text-xs max-w-xl"
      >
        {/* Kata Sandi Lama */}
        <div className="space-y-1.5">
          <label className="font-bold text-slate-700 dark:text-zinc-200">
            Kata Sandi yang Digunakan Sekarang
          </label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Masukkan kata sandi saat ini..."
              className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 font-medium text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#0e1738]/15 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 cursor-pointer"
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
            placeholder="Minimal 8 huruf atau angka..."
            className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 font-medium text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#0e1738]/15"
          />
        </div>

        {/* Konfirmasi Kata Sandi */}
        <div className="space-y-1.5">
          <label className="font-bold text-slate-700 dark:text-zinc-200">
            Ketik Ulang Kata Sandi Baru
          </label>
          <input
            type={showPass ? "text" : "password"}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Ketik persis sama dengan kata sandi baru..."
            className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 font-medium text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#0e1738]/15"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={changePasswordMutation.isPending}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            {changePasswordMutation.isPending ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Memperbarui Sandi...</span>
              </>
            ) : (
              <>
                <Lock size={14} />
                <span>Ganti Kata Sandi</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
