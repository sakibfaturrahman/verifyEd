"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
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
  ShieldCheck,
  Printer,
  Share2,
  FileCheck2,
  AlertTriangle,
  Lock,
} from "lucide-react";
import { PublicNavbar } from "@/components/layouts/public-navbar";
import { PublicFooter } from "@/components/layouts/public-footer";
import { useVerificationStore } from "@/features/verification/stores/verification-store";
import {
  useVerifyByQrTokenMutation,
  useVerifyByNumberMutation,
  VerificationResult,
} from "@/features/verification/hooks/use-verification";

export default function DynamicVerificationResultPage() {
  const params = useParams();
  const router = useRouter();
  const rawToken = params?.token
    ? decodeURIComponent(params.token as string)
    : "";

  const {
    result: storeResult,
    scannedMethod,
    setVerificationResult,
  } = useVerificationStore();

  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  const verifyByQr = useVerifyByQrTokenMutation();
  const verifyByNumber = useVerifyByNumberMutation();

  const [currentResult, setCurrentResult] = useState<VerificationResult | null>(
    storeResult,
  );
  const [isLoadingDirect, setIsLoadingDirect] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (!storeResult && rawToken) {
      setIsLoadingDirect(true);

      if (rawToken.toUpperCase().startsWith("CERT-")) {
        verifyByNumber.mutate(rawToken, {
          onSuccess: (data) => {
            setCurrentResult(data);
            setVerificationResult(data, "id");
            setIsLoadingDirect(false);
          },
          onError: () => {
            setCurrentResult({ status: "not_found" });
            setIsLoadingDirect(false);
          },
        });
      } else {
        verifyByQr.mutate(rawToken, {
          onSuccess: (data) => {
            setCurrentResult(data);
            setVerificationResult(data, "qr");
            setIsLoadingDirect(false);
          },
          onError: () => {
            setCurrentResult({ status: "not_found" });
            setIsLoadingDirect(false);
          },
        });
      }
    } else if (storeResult) {
      setCurrentResult(storeResult);
    }
  }, [
    rawToken,
    storeResult,
    setVerificationResult,
    verifyByNumber,
    verifyByQr,
  ]);

  if (!mounted || isLoadingDirect) {
    return (
      <div className="min-h-screen bg-[#faf8f5] dark:bg-zinc-950 flex flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#0e1738] flex items-center justify-center text-white shadow-lg animate-pulse">
            <ShieldCheck className="w-6 h-6 text-[#94b5ff]" />
          </div>
          <h3 className="text-sm font-bold text-[#0e1738] dark:text-zinc-100">
            Memeriksa Keaslian Dokumen...
          </h3>
          <p className="text-xs text-slate-500">
            Sedang mencocokkan data sertifikat ke sistem
          </p>
        </div>
      </div>
    );
  }

  if (!currentResult) {
    return (
      <div className="min-h-screen bg-[#faf8f5] dark:bg-zinc-950 flex flex-col font-sans">
        <PublicNavbar />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center pt-28 sm:pt-36">
          <div className="w-16 h-16 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center justify-center mb-4 shadow-xs">
            <AlertTriangle className="w-8 h-8 text-amber-500" />
          </div>
          <h2 className="text-2xl font-black text-[#0e1738] dark:text-zinc-50">
            Dokumen Belum Diperiksa
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mt-1.5 leading-relaxed">
            Tidak ada data pemeriksaan aktif. Silakan masukkan nomor sertifikat
            atau unggah berkas di beranda.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0e1738] text-white text-xs font-bold hover:bg-[#1a254d] transition-all shadow-md active:scale-95"
          >
            <ArrowLeft size={14} />
            <span>Kembali ke Beranda</span>
          </Link>
        </main>
        <PublicFooter />
      </div>
    );
  }

  const isVerified = currentResult.status === "verified";
  const isRevoked = currentResult.status === "revoked";
  const isNotFound = currentResult.status === "not_found";
  const cert = currentResult.certificate;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Berhasil Disalin", {
      description: "Nomor sertifikat tersalin ke papan klip.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share && cert) {
      navigator
        .share({
          title: `Bukti Keaslian Sertifikat: ${cert.recipientName}`,
          text: `Sertifikat resmi atas nama ${cert.recipientName} terbukti asli di VerifyEd.`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Tautan Pemeriksaan Tersalin");
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 flex flex-col font-sans selection:bg-[#0e1738] selection:text-white relative">
      <div className="print:hidden">
        <PublicNavbar />
      </div>

      {/* Jarak aman di bawah navbar fixed */}
      <main className="flex-1 pt-28 sm:pt-36 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-6 sm:space-y-7">
        {/* Tombol Aksi Atas */}
        <div className="flex items-center justify-between print:hidden">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-zinc-400 hover:text-[#0e1738] dark:hover:text-white transition-colors group"
          >
            <ArrowLeft
              size={15}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span>Periksa Sertifikat Lain</span>
          </Link>
        </div>

        {/* Kartu Status Utama */}
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
                {isNotFound && (
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
                  {isNotFound && "Data Sertifikat Tidak Ditemukan"}
                </h1>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed max-w-2xl">
                  {isVerified &&
                    "Dokumen ini resmi dikeluarkan oleh pihak penyelenggara. Seluruh isi dan tanda tangan di dalamnya terbukti asli tanpa ada perubahan apa pun."}
                  {isRevoked &&
                    "Sertifikat ini sebelumnya pernah diterbitkan, tetapi saat ini telah ditarik atau dibatalkan oleh pihak yang berwenang."}
                  {isNotFound &&
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

        {/* Rincian Dokumen */}
        {cert && !isNotFound ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Kartu Kiri: Informasi Pemilik & Acara */}
            <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Informasi Penerima
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(cert.certificateNumber)}
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
                      <Building2
                        size={13}
                        className="text-emerald-600 shrink-0"
                      />
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

            {/* Kartu Kanan: Jaminan Keaslian */}
            <div className="lg:col-span-5 bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-zinc-800">
                  <Lock
                    size={15}
                    className="text-[#0e1738] dark:text-zinc-100"
                  />
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
                      Sistem memeriksa isi berkas secara menyeluruh. Jika ada
                      nama, nilai, atau logo yang diganti, dokumen langsung
                      ditolak secara otomatis.
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
          </div>
        ) : (
          /* Tampilan Jika Tidak Terdaftar */
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center mx-auto border border-amber-200 dark:border-amber-900/60">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-1.5 max-w-md mx-auto">
              <h3 className="text-xl font-black text-[#0e1738] dark:text-zinc-100">
                Dokumen Tidak Terdaftar
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Nomor seri atau berkas yang Anda periksa tidak ditemukan.
                Pastikan Anda memasukkan nomor yang sesuai atau menggunakan
                berkas PDF asli dari panitia penyelenggara.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="px-6 py-2.5 rounded-xl bg-[#0e1738] text-white text-xs font-bold hover:bg-[#1a254d] transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Coba Periksa Ulang
              </button>
            </div>
          </div>
        )}
      </main>

      <div className="print:hidden">
        <PublicFooter />
      </div>
    </div>
  );
}
