"use client";

import {
  CheckCircle2,
  ShieldAlert,
  XCircle,
  X,
  Lock,
  Building2,
  Calendar,
  Award,
} from "lucide-react";
import { VerificationResult } from "../hooks/use-verification";

interface VerificationResultModalProps {
  result: VerificationResult | null;
  onClose: () => void;
}

export function VerificationResultModal({
  result,
  onClose,
}: VerificationResultModalProps) {
  if (!result) return null;

  const isVerified = result.status === "verified";
  const isRevoked = result.status === "revoked";
  const isNotFound = result.status === "not_found";
  const cert = result.certificate;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 select-none">
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            {isVerified && (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            )}
            {isRevoked && <ShieldAlert className="w-5 h-5 text-rose-600" />}
            {isNotFound && <XCircle className="w-5 h-5 text-amber-500" />}
            <h3 className="text-base font-bold text-[#0e1738] dark:text-zinc-100">
              Hasil Validasi Integritas Dokumen
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Badge Banner */}
        <div
          className={`p-4 rounded-2xl border flex items-center gap-3.5 ${
            isVerified
              ? "bg-emerald-50/80 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200"
              : isRevoked
                ? "bg-rose-50/80 border-rose-200 dark:bg-rose-950/30 dark:border-rose-800 text-rose-900 dark:text-rose-200"
                : "bg-amber-50/80 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800 text-amber-900 dark:text-amber-200"
          }`}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs bg-white dark:bg-zinc-900">
            {isVerified && (
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            )}
            {isRevoked && <ShieldAlert className="w-6 h-6 text-rose-600" />}
            {isNotFound && <XCircle className="w-6 h-6 text-amber-500" />}
          </div>
          <div>
            <h4 className="text-sm font-extrabold leading-tight">
              {isVerified && "Dokumen Asli & Terverifikasi"}
              {isRevoked && "Dokumen Telah Dicabut (Revoked)"}
              {isNotFound && "Kredensial Tidak Ditemukan / File Berubah"}
            </h4>
            <p className="text-xs opacity-90 mt-0.5">
              {isVerified &&
                "Kredensial sah terdaftar di ledger repositori resmi VerifyEd."}
              {isRevoked &&
                "Otoritas penerbit telah membatalkan keabsahan sertifikat ini."}
              {isNotFound &&
                "Nomor atau hash berkas tidak cocok dengan rekaman sistem."}
            </p>
          </div>
        </div>

        {/* Detail Dokumen (jika ditemukan) */}
        {cert && !isNotFound && (
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 font-medium">
                Nomor Seri Sertifikat
              </span>
              <p className="font-mono font-bold text-sm text-[#0e1738] dark:text-zinc-100 mt-0.5">
                {cert.certificateNumber}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-400 font-medium">
                  Nama Penerima
                </span>
                <p className="font-semibold text-slate-800 dark:text-zinc-200 mt-0.5 text-sm">
                  {cert.recipientName}
                </p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">
                  Waktu Diterbitkan
                </span>
                <p className="font-semibold text-slate-800 dark:text-zinc-200 mt-0.5 font-mono">
                  {new Date(cert.issuedAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-400 font-medium">
                  Kegiatan / Agenda
                </span>
                <p className="font-semibold text-slate-800 dark:text-zinc-200 mt-0.5 truncate">
                  {cert.event}
                </p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">
                  Instansi Penerbit
                </span>
                <p className="font-semibold text-slate-800 dark:text-zinc-200 mt-0.5 truncate">
                  {cert.organization}
                </p>
              </div>
            </div>

            {/* Status Integritas Fisik Dokumen */}
            <div className="p-3 bg-slate-50 dark:bg-zinc-800/60 rounded-xl border border-slate-200 dark:border-zinc-700 flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-500 dark:text-zinc-400">
                <Lock size={12} className="text-[#122253]" />
                <span>Uji Integritas Dokumen (Checksum)</span>
              </div>
              <span
                className={`font-bold font-mono text-[10px] px-2 py-0.5 rounded-md ${
                  cert.documentIntegrity === "valid"
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                    : cert.documentIntegrity === "invalid"
                      ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                      : "bg-slate-200 text-slate-700 dark:bg-zinc-700 dark:text-zinc-300"
                }`}
              >
                {cert.documentIntegrity === "valid"
                  ? "SHA-256 COCOK"
                  : cert.documentIntegrity === "invalid"
                    ? "TAMPERED / BERUBAH"
                    : "BELUM DIUJI FILE"}
              </span>
            </div>

            {/* Keterangan Revoke jika dibatalkan */}
            {isRevoked && cert.revokeReason && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs">
                <span className="font-bold block">Alasan Pembatalan:</span>
                <p className="mt-0.5 leading-relaxed">{cert.revokeReason}</p>
              </div>
            )}
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#0e1738] text-white text-xs font-bold hover:bg-[#1a254d] transition-all shadow-sm cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
