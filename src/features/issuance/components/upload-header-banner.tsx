"use client";

import { Sparkles } from "lucide-react";

export function UploadHeaderBanner() {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-3xl p-6 shadow-xs">
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#122253] dark:text-zinc-50">
          Unggah Berkas Sertifikat
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
          Pilih agenda kegiatan terdaftar, tentukan metode penerbitan, dan
          verifikasi nama penerima dokumen.
        </p>
      </div>
    </div>
  );
}
