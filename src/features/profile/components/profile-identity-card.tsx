// src/features/profile/components/profile-identity-card.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Building2,
  UploadCloud,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface ProfileIdentityCardProps {
  organizationName: string;
  representativeEmail: string;
  roleBadge: string;
}

export function ProfileIdentityCard({
  organizationName,
  representativeEmail,
  roleBadge,
}: ProfileIdentityCardProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadLogo = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      toast.success("Logo Instansi Diperbarui", {
        description: "Gambar logo berhasil diunggah ke storage cloud.",
      });
    }, 1200);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-5">
      {/* Avatar / Logo Instansi */}
      <div className="relative group shrink-0">
        <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 flex items-center justify-center font-extrabold text-2xl text-[#0e1738] dark:text-zinc-100 shadow-inner">
          {organizationName.charAt(0).toUpperCase()}
        </div>
        <button
          type="button"
          onClick={handleUploadLogo}
          disabled={isUploading}
          className="absolute inset-0 rounded-2xl bg-black/60 text-white flex flex-col items-center justify-center text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:opacity-40"
        >
          <UploadCloud size={16} />
          <span>Ganti</span>
        </button>
      </div>

      {/* Rincian Status Otoritas */}
      <div className="flex-1 text-center sm:text-left space-y-1.5">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
          <h2 className="text-lg sm:text-xl font-bold text-[#0e1738] dark:text-zinc-50">
            {organizationName}
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
            <span>Akun Penyelenggara Resmi</span>
          </span>
          <span className="hidden sm:inline w-1 h-1 rounded-full bg-slate-300 dark:bg-zinc-700" />
          <span>Terdaftar Sejak: Januari 2026</span>
        </div>
      </div>
    </div>
  );
}
