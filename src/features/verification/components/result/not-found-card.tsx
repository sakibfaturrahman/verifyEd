// src/features/verification/components/result/not-found-card.tsx
"use client";

import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";

export function NotFoundCard() {
  const router = useRouter();

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-xs">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center mx-auto border border-amber-200 dark:border-amber-900/60">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <div className="space-y-1.5 max-w-md mx-auto">
        <h3 className="text-xl font-black text-[#0e1738] dark:text-zinc-100">
          Dokumen Tidak Terdaftar
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Nomor seri atau berkas yang Anda periksa tidak ditemukan. Pastikan
          Anda memasukkan nomor yang sesuai atau menggunakan berkas PDF asli
          dari panitia penyelenggara.
        </p>
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="px-6 py-2.5 rounded-xl bg-[#0e1738] text-white text-xs font-bold hover:bg-[#1a254d] transition-all shadow-md active:scale-95 cursor-pointer"
        >
          Coba Periksa Ulang
        </button>
      </div>
    </div>
  );
}
