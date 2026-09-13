
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Calendar,
  Plus,
  Download,
  FileCheck2,
  CheckCircle2,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";

interface AdminWelcomeHeaderProps {
  roleTitle?: string;
}

export function AdminWelcomeHeader({
  roleTitle = "Super Administrator & Pengawas Integritas",
}: AdminWelcomeHeaderProps) {
  const user = useAuthStore((state) => state.user);
  const adminName = user?.name || "Administrator";
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const formatted = new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    setCurrentDate(formatted);
  }, []);

  return (
    <section className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xs select-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        {/* Sisi Kiri */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950/50 border border-sky-200/80 dark:border-sky-800 text-[11px] font-semibold text-sky-800 dark:text-sky-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Portal Otoritas Resmi</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Layanan Terverifikasi</span>
            </span>
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0e1738] dark:text-zinc-50">
              Selamat Datang, {adminName}
            </h1>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 font-medium">
              {roleTitle} • Kendali terpusat verifikasi kredensial digital.
            </p>
          </div>
        </div>

        {/* Sisi Kanan: Tanggal & Aksi Cepat */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-zinc-800">
          <div className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-700/60 text-xs font-medium text-slate-600 dark:text-zinc-300">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="capitalize">{currentDate || "Memuat Tanggal..."}</span>
          </div>

          <Link
            href="/admin/certificates/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0e1738] hover:bg-[#1a254d] dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-[#0e1738] text-xs font-semibold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Terbitkan Dokumen</span>
          </Link>
        </div>
      </div>

      {/* Baris Bawah */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-[11px] font-medium text-slate-500 dark:text-zinc-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Koneksi Ledger: Stabil</span>
          </span>
          <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-slate-300" />
          <span className="hidden sm:inline">SHA-256 Otomatis Aktif</span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-400">
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>Sinkronisasi otomatis setiap penerbitan baru</span>
        </div>
      </div>
    </section>
  );
}