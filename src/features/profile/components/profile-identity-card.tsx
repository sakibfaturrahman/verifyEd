"use client";

import { Building2, CheckCircle2, ShieldCheck } from "lucide-react";

interface ProfileIdentityCardProps {
  organizationName: string;
  representativeEmail: string;
  roleBadge: string;
  joinedAt?: string;
}

export function ProfileIdentityCard({
  organizationName,
  representativeEmail,
  roleBadge,
  joinedAt,
}: ProfileIdentityCardProps) {
  const formattedDate = joinedAt
    ? new Date(joinedAt).toLocaleDateString("id-ID", {
        month: "long",
        year: "numeric",
      })
    : "Januari 2026";

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-5">
      {/* Inisial Nama Organisasi */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-indigo-50 dark:bg-zinc-800 border border-indigo-100 dark:border-zinc-700 flex items-center justify-center font-extrabold text-2xl text-[#122253] dark:text-zinc-100 shadow-inner shrink-0">
        {organizationName ? organizationName.charAt(0).toUpperCase() : "U"}
      </div>

      {/* Rincian Status Akun */}
      <div className="flex-1 text-center sm:text-left space-y-1.5">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
          <h2 className="text-lg sm:text-xl font-bold text-[#0e1738] dark:text-zinc-50">
            {organizationName || "Nama Instansi Belum Diisi"}
          </h2>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800 px-2.5 py-0.5 rounded-full">
            <ShieldCheck size={12} />
            <span>{roleBadge}</span>
          </span>
        </div>

        <p className="text-xs text-slate-500 dark:text-zinc-400 font-mono">
          {representativeEmail}
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={13} />
            <span>Penyelenggara Resmi Terdaftar</span>
          </span>
          <span className="hidden sm:inline w-1 h-1 rounded-full bg-slate-300 dark:bg-zinc-700" />
          <span>Bergabung Sejak: {formattedDate}</span>
        </div>
      </div>
    </div>
  );
}
