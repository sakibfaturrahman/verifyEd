
"use client";

import Link from "next/link";
import { ShieldAlert, Clock, CheckCircle2, ShieldCheck } from "lucide-react";
import { useAdminDashboardQuery } from "@/features/dashboard/hooks/use-dashboard-queries";

export function AdminNotificationsBox() {
  const { data } = useAdminDashboardQuery();
  const vStats = data?.verificationStats;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col gap-5 h-full">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
        <span className="text-sm font-bold text-[#0e1738] dark:text-zinc-100">
          Ringkasan Audit Verifikasi Publik
        </span>
        <Link
          href="/admin/logs"
          className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors font-medium"
        >
          Lihat Riwayat
        </Link>
      </div>

      <div className="flex flex-col gap-3.5">
        {/* Item 1: Total Verifikasi Berhasil */}
        <div className="bg-slate-50/80 dark:bg-zinc-800/40 border border-slate-200/80 dark:border-zinc-700/60 p-4 rounded-2xl relative group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-[#0e1738] dark:text-zinc-200">
                Pemeriksaan Publik Berhasil
              </span>
            </div>
            <span className="text-xs font-bold font-mono text-emerald-600">
              {vStats ? vStats.successfulVerifications.toLocaleString("id-ID") : "0"} Lolos
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-zinc-300 mt-2 leading-relaxed">
            Berkas berhasil diverifikasi keabsahannya melalui pemindaian QR token dan pencocokan nomor seri resmi.
          </p>
          <p className="text-[11px] text-slate-400 mt-3 flex items-center gap-1.5 font-mono">
            <Clock size={11} /> Sinkronisasi berkala dari database
          </p>
        </div>

        {/* Item 2: Deteksi Integritas Mismatch / Revoked */}
        <div className="border border-slate-200/70 dark:border-zinc-800 p-4 rounded-2xl flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert size={14} className="text-rose-500" />
              <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                Peringatan Anomali / File Berubah
              </span>
            </div>
            <span className="text-xs font-bold font-mono text-rose-600">
              {vStats ? vStats.tamperedDetections.toLocaleString("id-ID") : "0"} Kasus
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
            Deteksi dokumen dengan hash SHA-256 yang tidak cocok atau sertifikat yang telah dicabut oleh instansi penerbit.
          </p>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1.5 font-mono">
            <ShieldCheck size={11} className="text-sky-500" /> Pengawasan aktif 24/7
          </p>
        </div>
      </div>
    </div>
  );
}