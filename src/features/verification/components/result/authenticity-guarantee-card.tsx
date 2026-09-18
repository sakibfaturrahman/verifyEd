"use client";

import { CheckCircle2, Lock } from "lucide-react";
import { PublicCertificate } from "../../hooks/use-verification";

interface AuthenticityGuaranteeCardProps {
  cert: PublicCertificate;
}

export function AuthenticityGuaranteeCard({
  cert,
}: AuthenticityGuaranteeCardProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 flex flex-col justify-between">
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-zinc-800">
          <Lock size={15} className="text-[#0e1738] dark:text-zinc-100" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Pemeriksaan Keaslian Berkas
          </span>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-4 rounded-2xl bg-[#faf8f5] dark:bg-zinc-800/40 border border-slate-200/80 dark:border-zinc-700/60 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 dark:text-zinc-200">
                Kondisi Berkas Dokumen
              </span>
              <span
                className={`font-bold px-2 py-0.5 rounded-md text-[10px] ${
                  cert.documentIntegrity === "valid"
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                    : cert.documentIntegrity === "invalid"
                      ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                      : "bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400"
                }`}
              >
                {cert.documentIntegrity === "valid"
                  ? "FILE TIDAK DIUBAH"
                  : cert.documentIntegrity === "invalid"
                    ? "FILE SUDAH DIEDIT"
                    : "DIPERIKSA LEWAT NOMOR/QR"}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Sistem memeriksa isi berkas secara menyeluruh. Jika ada nama,
              nilai, atau logo yang diganti, dokumen langsung ditolak secara
              otomatis.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#faf8f5] dark:bg-zinc-800/40 border border-slate-200/80 dark:border-zinc-700/60 space-y-2">
            <span className="text-[11px] font-semibold text-slate-700 dark:text-zinc-200 block">
              Informasi Keamanan Sistem
            </span>
            <div className="space-y-1.5 text-[11px] text-slate-500">
              <div className="flex justify-between">
                <span>Pemeriksaan Berkas:</span>
                <span className="font-bold text-slate-800 dark:text-zinc-300">
                  Otomatis & Akurat
                </span>
              </div>
              <div className="flex justify-between">
                <span>Penyimpanan Data:</span>
                <span className="font-bold text-slate-800 dark:text-zinc-300">
                  Terkunci Permanen
                </span>
              </div>
              <div className="flex justify-between">
                <span>Akses Verifikasi:</span>
                <span className="font-bold text-emerald-600">
                  Bebas Biaya & Terbuka
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
        <CheckCircle2 size={16} className="shrink-0" />
        <span>Dokumen Resmi & Terverifikasi Bebas Palsu</span>
      </div>
    </div>
  );
}
