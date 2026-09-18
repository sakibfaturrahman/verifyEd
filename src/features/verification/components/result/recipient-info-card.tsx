"use client";

import { Award, Building2, Calendar, Copy, Check } from "lucide-react";
import { PublicCertificate } from "../../hooks/use-verification";

interface RecipientInfoCardProps {
  cert: PublicCertificate;
  isRevoked: boolean;
  copied: boolean;
  onCopy: (text: string) => void;
}

export function RecipientInfoCard({
  cert,
  isRevoked,
  copied,
  onCopy,
}: RecipientInfoCardProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Informasi Penerima
        </span>
        <button
          type="button"
          onClick={() => onCopy(cert.certificateNumber)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0e1738] dark:text-indigo-400 hover:opacity-75 transition-opacity cursor-pointer"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          <span>{copied ? "Tersalin" : "Salin Nomor"}</span>
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <span className="text-xs text-slate-400 font-medium">
            Nama Lengkap Pemilik
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0e1738] dark:text-zinc-50 tracking-tight mt-0.5">
            {cert.recipientName}
          </h2>
        </div>

        <div>
          <span className="text-xs text-slate-400 font-medium">
            Nomor Seri Sertifikat
          </span>
          <div className="font-mono text-sm sm:text-base font-extrabold text-[#0e1738] dark:text-zinc-100 mt-1 bg-slate-50 dark:bg-zinc-800/70 p-3 rounded-2xl border border-slate-200/80 dark:border-zinc-700/60 flex items-center justify-between">
            <span>{cert.certificateNumber}</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
              RESMI TERDAFTAR
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          <div className="p-4 rounded-2xl bg-[#faf8f5] dark:bg-zinc-800/40 border border-slate-200/80 dark:border-zinc-700/60 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
              <Award size={13} className="text-indigo-600 shrink-0" />
              <span>Nama Acara / Kegiatan</span>
            </span>
            <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-zinc-200 leading-snug">
              {cert.event}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#faf8f5] dark:bg-zinc-800/40 border border-slate-200/80 dark:border-zinc-700/60 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
              <Building2 size={13} className="text-emerald-600 shrink-0" />
              <span>Penyelenggara / Penerbit</span>
            </span>
            <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-zinc-200 leading-snug">
              {cert.organization}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-zinc-800 text-xs">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Calendar size={13} /> Tanggal Diterbitkan
          </span>
          <span className="font-semibold text-slate-700 dark:text-zinc-300">
            {new Date(cert.issuedAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>

        {isRevoked && cert.revokeReason && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs space-y-1 text-rose-900 dark:text-rose-200">
            <span className="font-bold block">Alasan Pembatalan:</span>
            <p className="leading-relaxed">{cert.revokeReason}</p>
            {cert.revokedAt && (
              <span className="text-[11px] text-rose-500 block pt-1">
                Waktu pembatalan:{" "}
                {new Date(cert.revokedAt).toLocaleString("id-ID")}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
