"use client";
import { CheckCircle2, ShieldAlert, XCircle } from "lucide-react";

interface ResultStatusCardProps {
  status: "verified" | "revoked" | "not_found";
  scannedMethod: "id" | "qr" | "pdf";
}

export function ResultStatusCard({
  status,
  scannedMethod,
}: ResultStatusCardProps) {
  const isVerified = status === "verified";
  const isRevoked = status === "revoked";

  return (
    <div
      className={`relative rounded-[28px] sm:rounded-[36px] p-6 sm:p-9 border shadow-xl overflow-hidden transition-all ${
        isVerified
          ? "bg-[#94b5ff]/35 dark:bg-emerald-950/25 border-[#94b5ff]/70 dark:border-emerald-800/40 text-[#0e1738] dark:text-zinc-50"
          : isRevoked
            ? "bg-rose-50 dark:bg-rose-950/25 border-rose-200 dark:border-rose-900/50 text-rose-950 dark:text-rose-100"
            : "bg-amber-50 dark:bg-amber-950/25 border-amber-200 dark:border-amber-900/50 text-amber-950 dark:text-amber-100"
      }`}
    >
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4 sm:gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white dark:bg-zinc-900 border border-white/80 dark:border-zinc-800 shadow-md flex items-center justify-center shrink-0">
            {isVerified && (
              <CheckCircle2 className="w-9 h-9 sm:w-11 sm:h-11 text-emerald-600" />
            )}
            {isRevoked && (
              <ShieldAlert className="w-9 h-9 sm:w-11 sm:h-11 text-rose-600" />
            )}
            {!isVerified && !isRevoked && (
              <XCircle className="w-9 h-9 sm:w-11 sm:h-11 text-amber-600" />
            )}
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 dark:bg-zinc-900/80 border border-white/60 dark:border-zinc-700/60 text-[11px] font-semibold text-slate-700 dark:text-zinc-300 backdrop-blur-xs shadow-2xs">
              <span>
                Diperiksa melalui:{" "}
                {scannedMethod === "pdf"
                  ? "Unggah Dokumen PDF"
                  : scannedMethod === "qr"
                    ? "Pemindaian Barcode QR"
                    : "Nomor Sertifikat"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
              {isVerified && "Sertifikat Asli & Terdaftar"}
              {isRevoked && "Sertifikat Sudah Dibatalkan"}
              {!isVerified && !isRevoked && "Data Sertifikat Tidak Ditemukan"}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed max-w-2xl">
              {isVerified &&
                "Dokumen ini resmi dikeluarkan oleh pihak penyelenggara. Seluruh isi dan tanda tangan di dalamnya terbukti asli tanpa ada perubahan apa pun."}
              {isRevoked &&
                "Sertifikat ini sebelumnya pernah diterbitkan, tetapi saat ini telah ditarik atau dibatalkan oleh pihak yang berwenang."}
              {!isVerified &&
                !isRevoked &&
                "Data sertifikat ini tidak ditemukan di sistem. Kemungkinan isi berkas sudah diedit, nomor salah ketik, atau sertifikat belum pernah didaftarkan."}
            </p>
          </div>
        </div>

        <div className="shrink-0 flex sm:flex-col items-start sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-black/10 dark:border-white/10 gap-1">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-zinc-400 font-bold">
            Status Dokumen
          </span>
          <span
            className={`text-xs font-bold px-3.5 py-1 rounded-full border shadow-2xs ${
              isVerified
                ? "bg-emerald-500 text-white border-emerald-600"
                : isRevoked
                  ? "bg-rose-600 text-white border-rose-700"
                  : "bg-amber-500 text-white border-amber-600"
            }`}
          >
            {isVerified
              ? "STATUS: AKTIF"
              : isRevoked
                ? "STATUS: DICABUT"
                : "STATUS: TIDAK VALID"}
          </span>
        </div>
      </div>
    </div>
  );
}
