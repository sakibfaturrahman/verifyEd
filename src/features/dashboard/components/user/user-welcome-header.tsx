// src/features/dashboard/components/user-welcome-header.tsx
"use client";

import Link from "next/link";
import { Plus, UploadCloud, Building2, CheckCircle2 } from "lucide-react";

interface UserWelcomeHeaderProps {
  organizationName?: string;
  representativeName?: string;
}

export function UserWelcomeHeader({
  organizationName = "Universitas Perjuangan",
  representativeName = "Aditya Pratama",
}: UserWelcomeHeaderProps) {
  return (
    <section className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xs select-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        {/* Sisi Kiri: Profil Organisasi */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/80 dark:border-indigo-800 text-[11px] font-semibold text-indigo-800 dark:text-indigo-300">
              <Building2 className="w-3.5 h-3.5" />
              <span>Workspace Organisasi</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Akun Terverifikasi</span>
            </span>
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0e1738] dark:text-zinc-50">
              {organizationName}
            </h1>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 font-medium">
              PIC: {representativeName} • Kelola agenda acara dan penerbitan
              sertifikat digital.
            </p>
          </div>
        </div>

        {/* Sisi Kanan: Aksi Utama */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-zinc-800">
          <Link
            href="/dashboard/events/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-slate-500" />
            <span>Buat Agenda Event</span>
          </Link>

          <Link
            href="/dashboard/certificates/upload"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0e1738] hover:bg-[#1a254d] dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-[#0e1738] text-xs font-semibold transition-all shadow-xs"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Terbitkan Dokumen</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
