// src/app/(dashboard)/user/certificates/upload/page.tsx
"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/layouts/dashboard/app-sidebar";
import { AppTopNav } from "@/components/layouts/dashboard/app-topnav";
import { UserGuard } from "@/features/auth/components/user-guard";
import { useUserEventsListQuery } from "@/features/events/hooks/use-user-events";
import { UploadHeaderBanner } from "@/features/issuance/components/upload-header-banner";
import { EventPickerCard } from "@/features/issuance/components/event-picker-card";
import { SingleUploadCard } from "@/features/issuance/components/single-upload-card";
import { BulkUploadWorkspace } from "@/features/issuance/components/bulk-upload-workspace";
import { apiClient } from "@/lib/api-client";
import { ArrowRight, Loader2 } from "lucide-react";

export default function CertificateUploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Query Agenda Acara
  const { data: eventsData, isPending: isEventsLoading } =
    useUserEventsListQuery({
      limit: 100,
    });
  const events = eventsData?.data || [];

  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [uploadType, setUploadType] = useState<"single" | "bulk">("single");
  const [files, setFiles] = useState<File[]>([]);
  const [recipientNames, setRecipientNames] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cleanFileNameToName = (fileName: string): string => {
    return fileName
      .replace(/\.pdf$/i, "")
      .replace(/^[_-]+|[_-]+$/g, "")
      .replace(/[_-]+/g, " ")
      .replace(/\b(sertifikat|certificate|dokumen|piagam)\b/gi, "")
      .trim();
  };

  const handleFiles = (incomingFiles: File[]) => {
    const validPdfFiles = incomingFiles.filter(
      (f) =>
        f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"),
    );

    if (validPdfFiles.length === 0) {
      toast.error("Format Berkas Ditolak", {
        description: "Hanya dokumen berformat PDF yang dapat diproses.",
      });
      return;
    }

    if (uploadType === "single") {
      const singleFile = validPdfFiles[0];
      setFiles([singleFile]);
      setRecipientNames([cleanFileNameToName(singleFile.name) || ""]);
    } else {
      setFiles((prev) => [...prev, ...validPdfFiles]);
      setRecipientNames((prev) => [
        ...prev,
        ...validPdfFiles.map((f) => cleanFileNameToName(f.name) || ""),
      ]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
      e.target.value = "";
    }
  };

  const handleSubmitUpload = async () => {
    if (!selectedEventId) {
      toast.error("Agenda Acara Belum Dipilih", {
        description: "Silakan tentukan agenda kegiatan terlebih dahulu.",
      });
      return;
    }

    if (files.length === 0) {
      toast.error("Berkas Belum Dipilih", {
        description: "Pilih atau tarik berkas sertifikat PDF terlebih dahulu.",
      });
      return;
    }

    const hasEmptyName = recipientNames.some((name) => !name.trim());
    if (hasEmptyName) {
      toast.error("Nama Penerima Belum Lengkap", {
        description: "Mohon lengkapi seluruh kolom nama penerima sertifikat.",
      });
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading(
      "Mengunggah dan memproses dokumen sertifikat...",
    );

    try {
      if (uploadType === "single") {
        const formData = new FormData();
        formData.append("event_id", selectedEventId);
        formData.append("recipient_name", recipientNames[0].trim());
        formData.append("file", files[0]);

        await apiClient.post("/certificates/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        toast.success("Dokumen Berhasil Diterbitkan", {
          id: toastId,
          description:
            "1 sertifikat resmi telah tersimpan dan siap diverifikasi.",
        });
      } else {
        const formData = new FormData();
        formData.append("event_id", selectedEventId);
        formData.append("recipient_names", JSON.stringify(recipientNames));
        files.forEach((file) => {
          formData.append("files", file);
        });

        await apiClient.post("/certificates/upload/bulk", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        toast.success("Penerbitan Massal Berhasil", {
          id: toastId,
          description: `${files.length} sertifikat telah berhasil diunggah.`,
        });
      }

      router.push("/user/certificates");
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      toast.error("Gagal Memproses Berkas", {
        id: toastId,
        description:
          axiosErr.response?.data?.message ||
          "Terjadi kendala saat menyimpan berkas ke repositori.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <UserGuard>
      <div className="flex min-h-screen bg-[#faf8f5] dark:bg-zinc-950 font-sans antialiased selection:bg-[#122253] selection:text-white">
        <AppSidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          roleOverride="user"
        />

        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
          <AppTopNav
            onOpenSidebar={() => setIsSidebarOpen(true)}
            roleOverride="user"
          />

          <main className="flex-1 px-4 py-5 sm:px-6 sm:py-7 lg:px-8 xl:px-10 w-full max-w-[1520px] mx-auto space-y-6">
            {/* 1. Header Banner Bersih */}
            <UploadHeaderBanner />

            {/* 2. Selektor Agenda Kegiatan + Mode Switcher Otomatis */}
            <EventPickerCard
              events={events}
              isLoading={isEventsLoading}
              selectedEventId={selectedEventId}
              onSelectEvent={(id) => {
                setSelectedEventId(id);
                setFiles([]);
                setRecipientNames([]);
              }}
              uploadType={uploadType}
              onTypeChange={(type) => {
                setUploadType(type);
                setFiles([]);
                setRecipientNames([]);
              }}
            />

            {/* Hidden Native File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              multiple={uploadType === "bulk"}
              className="hidden"
              onChange={handleFileChange}
            />

            {/* 3. Area Upload (Aktif otomatis setelah event dipilih) */}
            {selectedEventId && (
              <div className="animate-in fade-in slide-in-from-bottom-3 duration-200 space-y-6">
                {uploadType === "single" ? (
                  <SingleUploadCard
                    file={files[0] || null}
                    recipientName={recipientNames[0] || ""}
                    onSelectFile={handleFiles}
                    onNameChange={(name) => setRecipientNames([name])}
                    onBrowseClick={() => fileInputRef.current?.click()}
                  />
                ) : (
                  <BulkUploadWorkspace
                    files={files}
                    recipientNames={recipientNames}
                    onSelectFiles={handleFiles}
                    onRemoveFile={(idx) => {
                      setFiles((prev) => prev.filter((_, i) => i !== idx));
                      setRecipientNames((prev) =>
                        prev.filter((_, i) => i !== idx),
                      );
                    }}
                    onNameChange={(idx, val) => {
                      setRecipientNames((prev) => {
                        const copy = [...prev];
                        copy[idx] = val;
                        return copy;
                      });
                    }}
                    onClearAll={() => {
                      setFiles([]);
                      setRecipientNames([]);
                    }}
                    onBrowseClick={() => fileInputRef.current?.click()}
                  />
                )}

                {/* 4. Action Footer */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => router.push("/user/certificates")}
                    className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-slate-200 dark:border-zinc-700 text-xs font-semibold text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-center"
                  >
                    Batal
                  </button>

                  <button
                    type="button"
                    disabled={files.length === 0 || isSubmitting}
                    onClick={handleSubmitUpload}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-2xl bg-[#122253] text-white text-xs font-bold hover:bg-[#0e1738] transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        <span>Memproses Dokumen...</span>
                      </>
                    ) : (
                      <>
                        <span>Terbitkan Sertifikat ({files.length})</span>
                        <ArrowRight size={15} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </UserGuard>
  );
}
