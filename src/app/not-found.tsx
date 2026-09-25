"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex items-center justify-center p-4 selection:bg-[#0e1738] selection:text-white relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[500px] h-[500px] rounded-full border border-slate-200/60 dark:border-zinc-800/40 opacity-40 blur-xs" />
        <div className="w-[700px] h-[700px] rounded-full border border-slate-200/40 dark:border-zinc-800/20 opacity-30" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative z-10 max-w-lg w-full text-center space-y-6 bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/40 dark:shadow-none"
      >
        {/* Brand Badge & Icon */}
        <div className="inline-flex items-center justify-center p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30">
          <ShieldAlert className="w-8 h-8" />
        </div>

        {/* 404 Headline */}
        <div className="space-y-2">
          <span className="text-5xl sm:text-6xl font-black tracking-tight text-[#0e1738] dark:text-zinc-50 font-mono">
            404
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-800 dark:text-zinc-100">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
            Tautan yang Anda tuju mungkin telah kedaluwarsa, dipindahkan, atau
            nomor sertifikat yang Anda cari tidak terdaftar di sistem VerifyEd.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs font-bold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>
        </div>

        {/* Footer Support Info */}
        <div className="pt-4 border-t border-slate-100 dark:border-zinc-800/80">
          <p className="text-[11px] text-slate-400">
            Ingin memverifikasi keaslian dokumen?{" "}
            <Link
              href="/"
              className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Cek Validitas QR di Beranda
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
