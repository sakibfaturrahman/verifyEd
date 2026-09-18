"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, AlertTriangle, ShieldCheck } from "lucide-react";
import { PublicNavbar } from "@/components/layouts/public-navbar";
import { PublicFooter } from "@/components/layouts/public-footer";
import { useVerificationStore } from "@/features/verification/stores/verification-store";
import {
  useVerifyByQrTokenMutation,
  useVerifyByNumberMutation,
  VerificationResult,
} from "@/features/verification/hooks/use-verification";
import { ResultHeaderActions } from "@/features/verification/components/result/result-header-actions";
import { ResultStatusCard } from "@/features/verification/components/result/result-status-card";
import { RecipientInfoCard } from "@/features/verification/components/result/recipient-info-card";
import { AuthenticityGuaranteeCard } from "@/features/verification/components/result/authenticity-guarantee-card";
import { NotFoundCard } from "@/features/verification/components/result/not-found-card";

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

      <main className="flex-1 pt-28 sm:pt-36 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-6 sm:space-y-7">
        {/* 1. Header Actions (Back, Print, Share) */}
        <ResultHeaderActions onShare={handleShare} />

        {/* 2. Status Card Banner */}
        <ResultStatusCard
          status={currentResult.status}
          scannedMethod={scannedMethod}
        />

        {/* 3. Detail Content */}
        {cert && !isNotFound ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7">
              <RecipientInfoCard
                cert={cert}
                isRevoked={isRevoked}
                copied={copied}
                onCopy={handleCopy}
              />
            </div>
            <div className="lg:col-span-5">
              <AuthenticityGuaranteeCard cert={cert} />
            </div>
          </div>
        ) : (
          <NotFoundCard />
        )}
      </main>

      <div className="print:hidden">
        <PublicFooter />
      </div>
    </div>
  );
}
