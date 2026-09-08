// src/features/dashboard/components/admin-notifications-box.tsx
"use client";

import Link from "next/link";
import { ShieldAlert, Clock } from "lucide-react";

export function AdminNotificationsBox() {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col gap-5 h-full">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
        <span className="text-sm font-bold text-[#0e1738] dark:text-zinc-100">
          Log Audit Terkini
        </span>
        <Link
          href="/admin/logs"
          className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors font-medium"
        >
          Lihat Riwayat
        </Link>
      </div>

      <div className="flex flex-col gap-3.5">
        {/* Item 1: Validasi Berhasil */}
        <div className="bg-slate-50/80 dark:bg-zinc-800/40 border border-slate-200/80 dark:border-zinc-700/60 p-4 rounded-2xl relative group">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-[#0e1738] dark:text-zinc-200">
              Verifikasi Publik Berhasil
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-zinc-300 mt-2 leading-relaxed">
            Sertifikat nomor{" "}
            <span className="font-mono font-semibold text-slate-900 dark:text-white">
              CERT-2026-X89F
            </span>{" "}
            lolos uji integritas hash melalui pemindaian QR.
          </p>
          <p className="text-[11px] text-slate-400 mt-3 flex items-center gap-1.5 font-mono">
            <Clock size={11} /> Hari ini • 11:42 WIB
          </p>
        </div>

        {/* Item 2: Pencabutan Berkas */}
        <div className="border border-slate-200/70 dark:border-zinc-800 p-4 rounded-2xl flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <ShieldAlert size={14} className="text-rose-500" />
            <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">
              Pencabutan Akses Berkas
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
            1 dokumen status ditandai{" "}
            <span className="text-rose-600 dark:text-rose-400 font-semibold">
              Revoked
            </span>{" "}
            oleh penyelenggara karena revisi identitas penerima.
          </p>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1.5 font-mono">
            <Clock size={11} /> Kemarin • 16:10 WIB
          </p>
        </div>
      </div>
    </div>
  );
}
