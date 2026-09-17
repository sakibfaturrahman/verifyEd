"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  CheckCircle2,
  ShieldAlert,
  XCircle,
  Copy,
  Check,
  Building2,
  Calendar,
  Award,
  Lock,
  Printer,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { VerificationResult } from "../hooks/use-verification";

interface InlineVerificationResultProps {
  result: VerificationResult;
  scannedMethod: "id" | "qr" | "pdf";
  onReset: () => void;
}

export function InlineVerificationResult({
  result,
  scannedMethod,
  onReset,
}: InlineVerificationResultProps) {
  const [copied, setCopied] = useState(false);

  const isVerified = result.status === "verified";
  const isRevoked = result.status === "revoked";
  const isNotFound = result.status === "not_found";
  const cert = result.certificate;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Tersalin", {
      description: "Nomor registrasi sertifikat disalin ke papan klip.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full mt-6 space-y-4 animate-in fade-in slide-in-from-top-6 duration-400 ease-out select-none">
      {/* 1. Header Banner Status Integritas */}
      <div
        className={`relative p-5 sm:p-7 rounded-2xl sm:rounded-3xl border transition-all shadow-md overflow-hidden ${
          isVerified
            ? "bg-emerald-50/90 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100"
            : isRevoked
              ? "bg-rose-50/90 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-950 dark:text-rose-100"
              : "bg-amber-50/90 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-100"
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white dark:bg-zinc-900 border border-white/80 dark:border-zinc-800 shadow-sm flex items-center justify-center shrink-0">
              {isVerified && (
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              )}
              {isRevoked && <ShieldAlert className="w-6 h-6 text-rose-600" />}
              {isNotFound && <XCircle className="w-6 h-6 text-amber-600" />}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-bold font-mono uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/70 dark:bg-zinc-900/70 border border-white/80 dark:border-zinc-800">
                  Audit:{" "}
                  {scannedMethod === "pdf"
                    ? "SHA-256 Checksum"
                    : scannedMethod === "qr"
                      ? "QR Token"
                      : "Nomor Seri"}
                </span>
                <span className="text-[10px] font-extrabold font-mono">
                  {isVerified
                    ? "STATUS: ASLI"
                    : isRevoked
                      ? "STATUS: DICABUT"
                      : "STATUS: TIDAK VALID"}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold tracking-tight">
                {isVerified && "Sertifikat Ini Terbukti Asli & Terdaftar"}
                {isRevoked && "Status: Dokumen Telah Dibatalkan"}
                {isNotFound && "Kredensial Tidak Ditemukan / Berkas Berubah"}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/80 dark:bg-zinc-900/80 hover:bg-white dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-semibold text-slate-700 dark:text-zinc-200 transition-colors shadow-2xs cursor-pointer self-end sm:self-auto"
          >
            <RotateCcw size={13} />
            <span>Tutup & Cek Lain</span>
          </button>
        </div>
      </div>

      {/* 2. Rincian Data Kredensial & Audit Trail (Jika Ditemukan) */}
      {cert && !isNotFound ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
          {/* Sisi Kiri: Biodata Penerima & Penyelenggara */}
          <div className="md:col-span-7 bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-zinc-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                Identitas Penerima
              </span>
              <button
                type="button"
                onClick={() => handleCopy(cert.certificateNumber)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                <span>{copied ? "Tersalin" : "Salin No. Seri"}</span>
              </button>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 font-medium">
                Nama Pemilik Dokumen
              </span>
              <h4 className="text-base font-black text-[#0e1738] dark:text-zinc-50 mt-0.5">
                {cert.recipientName}
              </h4>
              <div className="font-mono text-xs font-bold text-slate-700 dark:text-zinc-300 mt-1 bg-slate-50 dark:bg-zinc-800/60 px-2.5 py-1 rounded-lg border border-slate-100 dark:border-zinc-800 inline-block">
                {cert.certificateNumber}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-800">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Award size={12} className="text-indigo-600" />
                  <span>Agenda Acara</span>
                </span>
                <p className="font-bold text-slate-800 dark:text-zinc-200 mt-0.5 truncate">
                  {cert.event}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-800">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Building2 size={12} className="text-emerald-600" />
                  <span>Penyelenggara</span>
                </span>
                <p className="font-bold text-slate-800 dark:text-zinc-200 mt-0.5 truncate">
                  {cert.organization}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-zinc-800 text-[11px]">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Calendar size={12} /> Tanggal Diterbitkan Resmi
              </span>
              <span className="font-semibold text-slate-700 dark:text-zinc-300 font-mono">
                {new Date(cert.issuedAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>

            {isRevoked && cert.revokeReason && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs space-y-0.5">
                <span className="font-bold block">Alasan Pembatalan:</span>
                <p>{cert.revokeReason}</p>
              </div>
            )}
          </div>

          {/* Sisi Kanan: Kriptografi & Segel Biner */}
          <div className="md:col-span-5 bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-5 space-y-3.5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 pb-2.5 border-b border-slate-100 dark:border-zinc-800">
                <Lock size={13} className="text-[#0e1738] dark:text-zinc-100" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Segel Digital & Kriptografi
                </span>
              </div>

              <div className="mt-3 space-y-2.5">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                  <span className="text-slate-500 font-medium text-[11px]">
                    Uji Checksum File
                  </span>
                  <span
                    className={`font-mono font-bold text-[9px] px-2 py-0.5 rounded-md ${
                      cert.documentIntegrity === "valid"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : cert.documentIntegrity === "invalid"
                          ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                          : "bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400"
                    }`}
                  >
                    {cert.documentIntegrity === "valid"
                      ? "SHA-256 MATCH"
                      : cert.documentIntegrity === "invalid"
                        ? "TAMPERED / BERUBAH"
                        : "VIA TOKEN / NO. SERI"}
                  </span>
                </div>

                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Fingerprint kriptografi menjamin berkas ini bebas dari
                  rekayasa teks, nama, maupun tanda tangan digital.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 size={13} /> Dokumen Sah
              </span>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-zinc-300 hover:text-black cursor-pointer"
              >
                <Printer size={12} />
                <span>Cetak Hasil</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Fallback Jika Tidak Ada di Database */
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-6 text-center space-y-2 shadow-xs">
          <p className="text-xs text-slate-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
            Nomor sertifikat atau file yang Anda periksa tidak cocok dengan
            rekaman institusi resmi di VerifyEd. Pastikan Anda menggunakan
            berkas PDF asli tanpa modifikasi.
          </p>
        </div>
      )}
    </div>
  );
}
