// src/features/certificates/components/cert-detail-modal.tsx
"use client";

import Link from "next/link";
import { ShieldCheck, ExternalLink, X } from "lucide-react";
import { CertificateItem } from "../../types/cert.types";

interface CertDetailModalProps {
  cert: CertificateItem | null;
  onClose: () => void;
}

export function CertDetailModal({ cert, onClose }: CertDetailModalProps) {
  if (!cert) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-bold text-[#0e1738] dark:text-zinc-100">
              Detail Integritas Kredensial
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3.5 text-xs">
          <div>
            <span className="text-slate-400 font-medium">
              Nomor Unik Sertifikat
            </span>
            <p className="font-mono font-bold text-sm text-[#0e1738] dark:text-zinc-100 mt-0.5">
              {cert.certificateNumber}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-slate-400 font-medium">Nama Penerima</span>
              <p className="font-semibold text-slate-800 dark:text-zinc-200 mt-0.5">
                {cert.recipientName}
              </p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">
                Tanggal Diterbitkan
              </span>
              <p className="font-semibold text-slate-800 dark:text-zinc-200 mt-0.5">
                {cert.issuedAt}
              </p>
            </div>
          </div>

          <div>
            <span className="text-slate-400 font-medium">Agenda Acara</span>
            <p className="font-semibold text-slate-800 dark:text-zinc-200 mt-0.5">
              {cert.eventName} ({cert.organizer})
            </p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-zinc-800/60 rounded-xl border border-slate-200 dark:border-zinc-700">
            <span className="text-[10px] font-mono text-slate-400">
              SHA-256 Checksum (File Fisik)
            </span>
            <p className="font-mono text-[11px] text-slate-700 dark:text-zinc-300 break-all mt-1 select-all">
              {cert.fileHash}
            </p>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs font-semibold text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Tutup
          </button>
          <Link
            href={`/verify/${cert.qrToken}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0e1738] dark:bg-zinc-100 text-white dark:text-[#0e1738] text-xs font-semibold hover:bg-[#1a254d] transition-colors"
          >
            <span>Verifikasi Publik</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
