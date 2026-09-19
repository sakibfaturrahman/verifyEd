"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUserEventsListQuery } from "@/features/events/hooks/use-user-events";
import { UploadHeaderBanner } from "@/features/issuance/components/upload-header-banner";
import { EventPickerCard } from "@/features/issuance/components/event-picker-card";
import { SingleUploadCard } from "@/features/issuance/components/single-upload-card";
import { BulkUploadWorkspace } from "@/features/issuance/components/bulk-upload-workspace";
import { useUploadSessionStore } from "@/features/issuance/stores/upload-session-store";
import { ArrowRight } from "lucide-react";

export default function CertificateUploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const setSessionData = useUploadSessionStore((state) => state.setSessionData);

  const { data: eventsData, isPending: isEventsLoading } =
    useUserEventsListQuery({
      limit: 100,
    });
  const events = eventsData?.data || [];

  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [uploadType, setUploadType] = useState<"single" | "bulk">("single");
  const [files, setFiles] = useState<File[]>([]);
  const [recipientNames, setRecipientNames] = useState<string[]>([]);

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

  const handleProceedToQrPlacement = () => {
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

    setSessionData({
      eventId: selectedEventId,
      uploadType,
      files,
      recipientNames,
    });

    router.push("/user/certificates/qr-placement");
  };

  return (
    <div className="space-y-6">
      <UploadHeaderBanner />

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

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        multiple={uploadType === "bulk"}
        className="hidden"
        onChange={handleFileChange}
      />

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
                setRecipientNames((prev) => prev.filter((_, i) => i !== idx));
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
              disabled={files.length === 0}
              onClick={handleProceedToQrPlacement}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-2xl bg-[#122253] text-white text-xs font-bold hover:bg-[#0e1738] transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>Lanjut Atur Posisi QR ({files.length})</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
