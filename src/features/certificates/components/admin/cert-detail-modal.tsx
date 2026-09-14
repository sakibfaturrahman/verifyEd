// src/features/certificates/components/cert-detail-modal.tsx
"use client";

import Link from "next/link";
import {
  ShieldCheck,
  ExternalLink,
  X,
  Building2,
  Calendar,
  FileText,
  Lock,
} from "lucide-react";
import { CertificateItem } from "../../hooks/use-admin-certificates";

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
              Audit Integritas Kredensial
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3.5 text-xs">
          <div>
            <span className="text-slate-400 font-medium">
              Nomor Registrasi Sertifikat
            </span>
            <p className="font-mono font-bold text-sm text-[#0e1738] dark:text-zinc-100 mt-0.5">
              {cert.certificate_number}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-slate-400 font-medium">
                Nama Peserta / Penerima
              </span>
              <p className="font-semibold text-slate-800 dark:text-zinc-200 mt-0.5">
                {cert.recipient_name}
              </p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">
                Tanggal Diterbitkan
              </span>
              <p className="font-semibold text-slate-800 dark:text-zinc-200 mt-0.5 font-mono">
                {new Date(cert.issued_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-slate-400 font-medium">
                Agenda Kegiatan
              </span>
              <p className="font-semibold text-slate-800 dark:text-zinc-200 mt-0.5 truncate">
                {cert.events?.name || "Agenda Umum"}
              </p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">
                Instansi Penyelenggara
              </span>
              <p className="font-semibold text-slate-800 dark:text-zinc-200 mt-0.5 truncate">
                {cert.events?.organizer || "-"}
              </p>
            </div>
          </div>

          {/* Cryptographic Hash Display */}
          <div className="p-3 bg-slate-50 dark:bg-zinc-800/60 rounded-xl border border-slate-200 dark:border-zinc-700">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 font-bold uppercase">
              <Lock size={11} className="text-emerald-600" />
              <span>SHA-256 File Checksum (Supabase Storage)</span>
            </div>
            <p className="font-mono text-[11px] text-slate-700 dark:text-zinc-300 break-all mt-1 select-all font-semibold">
              {cert.file_hash || "Belum diekstrak"}
            </p>
          </div>

          {/* Revoke Reason Warning if Revoked */}
          {cert.status === "revoked" && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300">
              <span className="font-bold block text-[11px]">
                Kredensial Ini Telah Dicabut
              </span>
              <p className="mt-0.5 text-[11px] leading-relaxed">
                Alasan:{" "}
                {cert.revoke_reason || "Tidak dicantumkan alasan spesifik."}
              </p>
            </div>
          )}
        </div>

        <div className="pt-2 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs font-semibold text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Tutup
          </button>
          <Link
            href={`/verify/qr/${cert.qr_token}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0e1738] dark:bg-zinc-100 text-white dark:text-[#0e1738] text-xs font-semibold hover:bg-[#1a254d] transition-colors"
          >
            <span>Uji Halaman Publik</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
