"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  CheckCircle2,
  ShieldAlert,
  XCircle,
  Copy,
  Check,
  ArrowLeft,
  Building2,
  Calendar,
  Award,
  Lock,
  Printer,
  Share2,
  Search,
  Sparkles,
} from "lucide-react";
import { useVerificationStore } from "@/features/verification/stores/verification-store";

export default function VerificationResultPage() {
  const router = useRouter();
  const { result, scannedMethod } = useVerificationStore();
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Tampilan jika pengguna langsung membuka URL tanpa mengecek dokumen terlebih dahulu
  if (!result) {
    return (
      <main className="min-h-screen bg-[#faf8f5] dark:bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 flex items-center justify-center mb-4 shadow-sm">
          <Search className="w-7 h-7 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-[#0e1738] dark:text-zinc-100">
          Belum Ada Dokumen yang Diperiksa
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 max-w-sm mt-1.5 leading-relaxed">
          Silakan masukkan nomor sertifikat, scan kode QR, atau unggah file PDF
          Anda di halaman utama untuk melihat keasliannya.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0e1738] text-white text-xs font-bold hover:bg-[#1a254d] transition-all shadow-md shadow-[#0e1738]/10 active:scale-95"
        >
          <ArrowLeft size={15} />
          <span>Kembali ke Halaman Utama</span>
        </Link>
      </main>
    );
  }

  const isVerified = result.status === "verified";
  const isRevoked = result.status === "revoked";
  const isNotFound = result.status === "not_found";
  const cert = result.certificate;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Berhasil Disalin", {
      description: "Nomor sertifikat telah disalin ke papan klip.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share && cert) {
      navigator
        .share({
          title: `Bukti Keaslian Sertifikat: ${cert.recipientName}`,
          text: `Sertifikat resmi atas nama ${cert.recipientName} telah terbukti asli di VerifyEd.`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      handleCopy(window.location.href);
    }
  };

  return (
    <main className="min-h-screen bg-[#faf8f5] dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 p-3 sm:p-6 md:p-10 selection:bg-[#0e1738] selection:text-white relative overflow-hidden">
      {/* Pendar Cahaya Lembut Latar Belakang */}
      <div className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#94b5ff]/20 dark:bg-indigo-950/20 blur-[140px] rounded-full -z-10" />

      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {/* Navigasi Atas */}
        <div className="flex items-center justify-between pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 dark:text-zinc-400 hover:text-[#0e1738] dark:hover:text-white transition-colors group"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            <span>Cek Sertifikat Lain</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xs text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors shadow-2xs cursor-pointer"
            >
              <Printer size={14} />
              <span className="hidden sm:inline">Cetak Halaman</span>
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0e1738] text-white text-xs font-semibold hover:bg-[#1a254d] transition-colors shadow-2xs cursor-pointer active:scale-95"
            >
              <Share2 size={14} />
              <span>Bagikan</span>
            </button>
          </div>
        </div>

        {/* Hero Kartu Status Utama (Warna pastel lembut ala Hero Canvas) */}
        <div
          className={`relative rounded-[28px] sm:rounded-[36px] p-6 sm:p-10 border transition-all shadow-xl shadow-black/5 overflow-hidden ${
            isVerified
              ? "bg-[#94b5ff]/35 dark:bg-emerald-950/20 border-[#94b5ff]/60 dark:border-emerald-800/40 text-[#0e1738] dark:text-zinc-50"
              : isRevoked
                ? "bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50 text-rose-950 dark:text-rose-100"
                : "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50 text-amber-950 dark:text-amber-100"
          }`}
        >
          {/* Badge Metode Pemeriksaan */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 dark:bg-zinc-900/60 border border-white/60 dark:border-zinc-700/60 text-[11px] font-semibold text-slate-700 dark:text-zinc-300 backdrop-blur-xs shadow-2xs">
              <span>
                Diperiksa melalui:{" "}
                {scannedMethod === "pdf"
                  ? "File PDF Asli"
                  : scannedMethod === "qr"
                    ? "Scan Kode QR"
                    : "Nomor Sertifikat"}
              </span>
            </span>

            <span
              className={`text-[11px] font-bold px-3 py-1 rounded-full border ${
                isVerified
                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
                  : isRevoked
                    ? "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20"
                    : "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20"
              }`}
            >
              {isVerified
                ? "STATUS: AKTIF"
                : isRevoked
                  ? "STATUS: DICABUT"
                  : "STATUS: TIDAK VALID"}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white dark:bg-zinc-900 border border-white/80 dark:border-zinc-700/80 shadow-md flex items-center justify-center shrink-0">
              {isVerified && (
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              )}
              {isRevoked && <ShieldAlert className="w-8 h-8 text-rose-600" />}
              {isNotFound && <XCircle className="w-8 h-8 text-amber-600" />}
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0e1738] dark:text-zinc-50">
                {isVerified && "Sertifikat Ini Terbukti Asli"}
                {isRevoked && "Sertifikat Ini Sudah Dibatalkan"}
                {isNotFound && "Data Sertifikat Tidak Cocok"}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed max-w-xl">
                {isVerified &&
                  "Dokumen ini resmi terdaftar di database kami. Isi dokumen dan tanda tangannya sesuai dengan data asli dari pihak penyelenggara tanpa ada perubahan."}
                {isRevoked &&
                  "Sertifikat ini sebelumnya pernah terbit, namun saat ini telah resmi ditarik atau dibatalkan oleh pihak yang berwenang."}
                {isNotFound &&
                  "Kami tidak menemukan sertifikat yang sesuai. Kemungkinan file ini telah diedit, nomor salah ketik, atau belum pernah didaftarkan secara resmi."}
              </p>
            </div>
          </div>
        </div>

        {/* Rincian Dokumen & Bukti Keaslian */}
        {cert && !isNotFound ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
            {/* Bagian Kiri: Biodata & Info Acara */}
            <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
                <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                  Informasi Penerima Dokumen
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(cert.certificateNumber)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0e1738] dark:text-indigo-400 hover:opacity-75 transition-opacity cursor-pointer"
                >
                  {copied ? (
                    <Check size={13} className="text-emerald-600" />
                  ) : (
                    <Copy size={13} />
                  )}
                  <span>{copied ? "Tersalin" : "Salin Nomor"}</span>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-xs text-slate-400 dark:text-zinc-500 font-medium">
                    Nama Pemilik Sertifikat
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-[#0e1738] dark:text-zinc-50 mt-0.5">
                    {cert.recipientName}
                  </h3>
                </div>

                <div>
                  <span className="text-xs text-slate-400 dark:text-zinc-500 font-medium">
                    Nomor Resmi Sertifikat
                  </span>
                  <div className="font-mono text-sm sm:text-base font-bold text-slate-800 dark:text-zinc-200 mt-0.5 bg-slate-50 dark:bg-zinc-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-zinc-800 inline-block">
                    {cert.certificateNumber}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-800 space-y-1">
                    <span className="text-[11px] text-slate-400 dark:text-zinc-500 font-medium flex items-center gap-1.5">
                      <Award size={13} className="text-indigo-600" />
                      <span>Nama Acara / Kegiatan</span>
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-zinc-200 leading-snug">
                      {cert.event}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-800 space-y-1">
                    <span className="text-[11px] text-slate-400 dark:text-zinc-500 font-medium flex items-center gap-1.5">
                      <Building2 size={13} className="text-emerald-600" />
                      <span>Lembaga Penerbit</span>
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

                {/* Keterangan Tambahan Jika Status Dicabut */}
                {isRevoked && cert.revokeReason && (
                  <div className="p-4 rounded-2xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-xs space-y-1 text-rose-900 dark:text-rose-200">
                    <span className="font-bold block">Alasan Pembatalan:</span>
                    <p className="leading-relaxed">{cert.revokeReason}</p>
                    {cert.revokedAt && (
                      <span className="text-[11px] text-rose-500 block pt-1">
                        Dibatalkan pada:{" "}
                        {new Date(cert.revokedAt).toLocaleString("id-ID")}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Bagian Kanan: Penjelasan Keamanan Dokumen */}
            <div className="lg:col-span-5 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-zinc-800">
                  <Lock
                    size={15}
                    className="text-[#0e1738] dark:text-zinc-100"
                  />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                    Jaminan Keamanan Dokumen
                  </span>
                </div>

                <div className="space-y-3 text-xs leading-relaxed text-slate-600 dark:text-zinc-400">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-700 dark:text-zinc-200">
                        Keaslian File Asli
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
                            : "BELUM DIUJI FILE"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      Sistem memeriksa isi file secara otomatis. Jika ada
                      tulisan, nama, atau logo yang diganti, sistem akan
                      langsung menandainya sebagai file yang sudah diubah.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-800 space-y-1">
                    <span className="font-semibold text-slate-700 dark:text-zinc-200 block">
                      Segel Digital Permanen
                    </span>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      Setiap kali sertifikat diterbitkan, kodenya terkunci
                      otomatis di sistem sehingga tidak bisa diduplikasi atas
                      nama orang lain.
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Footer Kecil */}
              <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                <CheckCircle2 size={16} className="shrink-0" />
                <span>Dokumen Sah Terdaftar di VerifyEd</span>
              </div>
            </div>
          </div>
        ) : (
          /* Tampilan Jika Tidak Ditemukan / Tidak Cocok */
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center mx-auto border border-amber-200 dark:border-amber-900/60">
              <ShieldAlert className="w-7 h-7" />
            </div>

            <div className="space-y-1.5 max-w-md mx-auto">
              <h3 className="text-xl font-bold text-[#0e1738] dark:text-zinc-100">
                Dokumen Tidak Ditemukan
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
                Nomor sertifikat atau file yang Anda periksa tidak terdaftar di
                sistem kami. Pastikan Anda memasukkan nomor yang benar atau
                mengunggah file PDF asli langsung dari panitia penyelenggara.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="px-6 py-2.5 rounded-full bg-[#0e1738] text-white text-xs font-semibold hover:bg-[#1a254d] transition-all shadow-md shadow-[#0e1738]/10 cursor-pointer active:scale-95"
              >
                Coba Periksa Ulang
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
