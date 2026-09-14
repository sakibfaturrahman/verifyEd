"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  ExternalLink,
  Download,
  RotateCw,
  X,
  Lock,
  Loader2,
} from "lucide-react";
import { UserCertificateItem } from "../../hooks/use-user-certificates";

interface UserCertDetailModalProps {
  cert: UserCertificateItem | null;
  onClose: () => void;
  onDownload: (certId: string, num: string) => void;
  onRegenerateFile: (certId: string, file: File) => void;
  isRegenerating?: boolean;
}

export function UserCertDetailModal({
  cert,
  onClose,
  onDownload,
  onRegenerateFile,
  isRegenerating = false,
}: UserCertDetailModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!cert) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onRegenerateFile(cert.id, file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-bold text-[#0e1738] dark:text-zinc-100">
              Rincian Kredensial Penerima
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

        <div className="space-y-3.5 text-xs">
          <div>
            <span className="text-slate-400 font-medium">
              Nomor Sertifikat Resmi
            </span>
            <p className="font-mono font-bold text-sm text-[#0e1738] dark:text-zinc-100 mt-0.5">
              {cert.certificate_number}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-slate-400 font-medium">Nama Penerima</span>
              <p className="font-semibold text-slate-800 dark:text-zinc-200 mt-0.5">
                {cert.recipient_name}
              </p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">
                Waktu Diterbitkan
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

          <div>
            <span className="text-slate-400 font-medium">Agenda Terkait</span>
            <p className="font-semibold text-slate-800 dark:text-zinc-200 mt-0.5">
              {cert.events?.name || "Agenda Terpilih"}
            </p>
          </div>

          {/* SHA-256 Fingerprint */}
          <div className="p-3 bg-slate-50 dark:bg-zinc-800/60 rounded-xl border border-slate-200 dark:border-zinc-700">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 font-bold uppercase">
              <Lock size={11} className="text-emerald-600" />
              <span>Cryptographic File Hash (SHA-256)</span>
            </div>
            <p className="font-mono text-[11px] text-slate-700 dark:text-zinc-300 break-all mt-1 select-all font-semibold">
              {cert.file_hash || "Belum diekstrak"}
            </p>
          </div>

          {cert.status === "revoked" && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300">
              <span className="font-bold block text-[11px]">
                Sertifikat Telah Dicabut
              </span>
              <p className="mt-0.5 text-[11px] leading-relaxed">
                Alasan: {cert.revoke_reason || "Dibatalkan oleh penyelenggara."}
              </p>
            </div>
          )}
        </div>

        {/* Hidden Input for Regenerate File */}
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 dark:border-zinc-800">
          <button
            type="button"
            disabled={isRegenerating}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs font-semibold text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-50"
          >
            {isRegenerating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RotateCw className="w-3.5 h-3.5" />
            )}
            <span>{isRegenerating ? "Memproses..." : "Regenerasi Berkas"}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onDownload(cert.id, cert.certificate_number)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh PDF</span>
            </button>
            <Link
              href={`/verify/qr/${cert.qr_token}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0e1738] dark:bg-zinc-100 text-white dark:text-[#0e1738] text-xs font-semibold hover:bg-[#1a254d] transition-colors"
            >
              <span>Uji Verifikasi</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
