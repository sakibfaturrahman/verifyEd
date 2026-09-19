"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUploadSessionStore } from "@/features/issuance/stores/upload-session-store";
import { PdfQrPlacementConfig } from "@/features/issuance/components/real-pdf-qr-canvas";
import { apiClient } from "@/lib/api-client";
import { ArrowLeft, CheckCircle2, Loader2, QrCode } from "lucide-react";

// Muat RealPdfQrCanvas khusus client-side untuk mencegah pdfjs-dist crash di SSR
const RealPdfQrCanvas = dynamic(
  () =>
    import("@/features/issuance/components/real-pdf-qr-canvas").then(
      (mod) => mod.RealPdfQrCanvas,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-96 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-7 h-7 animate-spin text-[#122253]" />
        <span className="text-xs font-semibold text-slate-500">
          Menyiapkan kanvas dokumen...
        </span>
      </div>
    ),
  },
);

export default function QrPlacementPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    eventId,
    uploadType,
    previewFile,
    files,
    recipientNames,
    clearSession,
  } = useUploadSessionStore();

  const [qrConfig, setQrConfig] = useState<PdfQrPlacementConfig>({
    x: 700,
    y: 460,
    width: 85,
    height: 85,
    page: 1,
    rotation: 0,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Cegah render sebelum mount di client
  if (!mounted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#122253]" />
      </div>
    );
  }

  // Jika sesi kosong (misal pengguna me-refresh browser secara manual)
  if (!previewFile || !eventId || files.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-[#122253] dark:text-zinc-100">
          Sesi Dokumen Kedaluwarsa
        </h2>
        <p className="text-xs text-slate-500 max-w-sm mt-1">
          Silakan pilih agenda dan unggah berkas sertifikat terlebih dahulu.
        </p>
        <button
          type="button"
          onClick={() => router.push("/user/certificates/upload")}
          className="mt-5 px-5 py-2.5 rounded-xl bg-[#122253] text-white text-xs font-semibold cursor-pointer"
        >
          Kembali ke Unggah Berkas
        </button>
      </div>
    );
  }

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    const toastId = toast.loading(
      "Menerapkan stempel & mengomputasi hash SHA-256...",
    );

    try {
      if (uploadType === "single") {
        const formData = new FormData();
        formData.append("event_id", eventId);
        formData.append("recipient_name", recipientNames[0].trim());
        formData.append("qr_config", JSON.stringify(qrConfig));
        formData.append("file", files[0]);

        await apiClient.post("/certificates/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        toast.success("Dokumen Berhasil Diterbitkan", {
          id: toastId,
          description: "1 sertifikat resmi telah disimpan ke repositori.",
        });
      } else {
        const formData = new FormData();
        formData.append("event_id", eventId);
        formData.append("recipient_names", JSON.stringify(recipientNames));
        formData.append("qr_config", JSON.stringify(qrConfig));
        files.forEach((file) => {
          formData.append("files", file);
        });

        await apiClient.post("/certificates/upload/bulk", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        toast.success("Penerbitan Massal Selesai", {
          id: toastId,
          description: `${files.length} sertifikat telah disegel dengan stempel QR presisi.`,
        });
      }

      clearSession();
      router.push("/user/certificates");
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      toast.error("Gagal Menyimpan Dokumen", {
        id: toastId,
        description:
          axiosErr.response?.data?.message ||
          "Terjadi kendala saat memproses berkas.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Title */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
            <QrCode size={13} />
            <span>Tata Letak Stempel Presisi</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#122253] dark:text-zinc-50">
            Atur Penempatan Kode QR
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
            Pratinjau diambil langsung dari berkas asli:{" "}
            <strong className="text-slate-800 dark:text-zinc-200">
              {previewFile.name}
            </strong>
          </p>
        </div>

        <span className="text-xs font-mono font-bold bg-[#122253] text-white px-3.5 py-1.5 rounded-xl self-start sm:self-auto">
          Total {files.length} Sertifikat
        </span>
      </div>

      {/* Canvas Pratinjau Dokumen Asli */}
      <RealPdfQrCanvas pdfFile={previewFile} onChangeConfig={setQrConfig} />

      {/* Action Footer */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => router.push("/user/certificates/upload")}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-2xl border border-slate-200 dark:border-zinc-700 text-xs font-semibold text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Kembali ke Pemilihan Berkas</span>
        </button>

        <button
          type="button"
          disabled={isSubmitting}
          onClick={handleFinalSubmit}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              <span>Menerapkan Stempel QR...</span>
            </>
          ) : (
            <>
              <CheckCircle2 size={15} />
              <span>Selesai & Terbitkan Dokumen</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
