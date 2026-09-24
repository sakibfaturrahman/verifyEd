"use client";

import Link from "next/link";
import { ShieldCheck, ArrowRight, ShieldAlert } from "lucide-react";
import { useAdminDashboardQuery } from "@/features/dashboard/hooks/use-dashboard-queries";

export function AdminNotificationsBox() {
  const { data } = useAdminDashboardQuery();
  const vStats = data?.verificationStats;

  const successfulVerifications = vStats?.successfulVerifications ?? 0;
  const totalScans = vStats?.totalScans ?? 0;
  const tamperedDetections = vStats?.tamperedDetections ?? 0;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl 2xl:rounded-3xl p-5 2xl:p-6 shadow-xs flex flex-col justify-between h-full">
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-100 dark:border-emerald-900/30">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0e1738] dark:text-zinc-100">
                Audit Integritas Verifikasi
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                Pemeriksaan validitas hash SHA-256 dokumen
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300">
            Realtime
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
              Verifikasi Sukses
            </span>
            <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {successfulVerifications.toLocaleString("id-ID")} Lolos
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-zinc-300 mt-2 leading-relaxed">
            Total pemindaian publik tercatat sebanyak{" "}
            <strong className="font-bold text-[#0e1738] dark:text-zinc-100">
              {totalScans.toLocaleString("id-ID")}
            </strong>{" "}
            kali dengan indikasi ketidakcocokan / gagal sebanyak{" "}
            <strong className="font-bold text-rose-600 dark:text-rose-400">
              {tamperedDetections.toLocaleString("id-ID")}
            </strong>{" "}
            kejadian.
          </p>
        </div>

        {tamperedDetections > 0 && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-rose-700 dark:text-rose-400 leading-snug">
              Terdeteksi adanya percobaan verifikasi dokumen yang tidak valid atau telah dimodifikasi.
            </p>
          </div>
        )}
      </div>

      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-zinc-800">
        <Link
          href="/admin/notifications"
          className="inline-flex items-center justify-between w-full text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors"
        >
          <span>Buka Pusat Peringatan Keamanan</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}