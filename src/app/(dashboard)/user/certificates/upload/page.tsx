// src/app/(dashboard)/user/certificates/upload/page.tsx
"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/layouts/dashboard/app-sidebar";
import { AppTopNav } from "@/components/layouts/dashboard/app-topnav";
import { WizardStepper } from "@/features/issuance/components/wizard-stepper";
import {
  QrPositionCanvas,
  BackendQrConfig,
} from "@/features/issuance/components/qr-position-canvas";
import { UserGuard } from "@/features/auth/components/user-guard";
import { useUserEventsListQuery } from "@/features/events/hooks/use-user-events";
import { apiClient } from "@/lib/api-client";
import {
  CalendarDays,
  UploadCloud,
  FileText,
  Trash2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Loader2,
  AlertCircle,
} from "lucide-react";

const steps = [
  "Pilih Agenda",
  "Unggah Dokumen",
  "Atur Stempel QR",
  "Penerbitan",
];

export default function CertificateUploadWizardPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // 1. State Agenda Acara (Ambil data riil dari backend)
  const { data: eventsData, isPending: isEventsLoading } = useUserEventsListQuery({
    limit: 50,
  });
  const events = eventsData?.data || [];
  const [selectedEventId, setSelectedEventId] = useState<string>("");

  // 2. State Berkas Fisik & Penerima
  const [uploadType, setUploadType] = useState<"single" | "bulk">("single");
  const [files, setFiles] = useState<File[]>([]);
  const [recipientNames, setRecipientNames] = useState<string[]>([]);

  // 3. State Konfigurasi QR (Koordinat Absolut PDF A4 Landscape)
  const [qrConfig, setQrConfig] = useState<BackendQrConfig>({
    x: 700,
    y: 460,
    width: 80,
    height: 80,
    page: 1,
    rotation: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper untuk membersihkan nama file menjadi nama penerima default
  const cleanFileNameToName = (fileName: string): string => {
    return fileName
      .replace(/\.pdf$/i, "")
      .replace(/^[_-]+|[_-]+$/g, "")
      .replace(/[_-]+/g, " ")
      .replace(/\b(sertifikat|certificate)\b/gi, "")
      .trim();
  };

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []).filter(
      (f) => f.type === "application/pdf" || f.name.endsWith(".pdf")
    );

    if (selected.length === 0) {
      toast.error("Format Berkas Tidak Valid", {
        description: "Hanya dokumen berformat PDF yang dapat diproses.",
      });
      return;
    }

    if (uploadType === "single") {
      const file = selected[0];
      setFiles([file]);
      setRecipientNames([cleanFileNameToName(file.name) || "Peserta Terpilih"]);
    } else {
      setFiles(selected);
      setRecipientNames(
        selected.map(
          (f, idx) => cleanFileNameToName(f.name) || `Penerima ${idx + 1}`
        )
      );
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== index));
    setRecipientNames((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleRecipientNameChange = (index: number, val: string) => {
    setRecipientNames((prev) => {
      const updated = [...prev];
      updated[index] = val;
      return updated;
    });
  };

  // Navigasi Langkah Wizard
  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!selectedEventId) {
        toast.error("Agenda Acara Belum Dipilih", {
          description: "Silakan pilih salah satu agenda kegiatan induk.",
        });
        return;
      }
    }

    if (currentStep === 2) {
      if (files.length === 0) {
        toast.error("Dokumen Belum Diunggah", {
          description: "Unggah minimal satu berkas sertifikat PDF.",
        });
        return;
      }

      const emptyName = recipientNames.some((n) => !n.trim());
      if (emptyName) {
        toast.error("Nama Penerima Kosong", {
          description: "Pastikan seluruh nama peserta/penerima telah terisi.",
        });
        return;
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Eksekusi API Penerbitan Dokumen (Single atau Bulk)
  const handleExecuteIssuance = async () => {
    if (!selectedEventId || files.length === 0) return;

    setIsSubmitting(true);
    const toastId = toast.loading("Mengomputasi segel kriptografi SHA-256...");

    try {
      if (uploadType === "single") {
        const formData = new FormData();
        formData.append("event_id", selectedEventId);
        formData.append("recipient_name", recipientNames[0].trim());
        formData.append("qr_config", JSON.stringify(qrConfig));
        formData.append("file", files[0]);

        await apiClient.post("/certificates/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        toast.success("Penerbitan Berhasil", {
          id: toastId,
          description: "1 sertifikat resmi telah terbit dan siap diverifikasi.",
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
          description: `${files.length} sertifikat telah disegel dan siap diunduh.`,
        });
      }

      router.push("/user/certificates");
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      toast.error("Penerbitan Gagal", {
        id: toastId,
        description:
          axiosErr.response?.data?.message ||
          "Terjadi kendala saat menyimpan berkas ke repositori.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedEvent = events.find((e) => e.id === selectedEventId);

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

          <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 xl:px-10 2xl:px-12 w-full max-w-[1680px] mx-auto space-y-5">
            {/* Header Title */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-5 shadow-xs">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0e1738] dark:text-zinc-50">
                Penerbitan Sertifikat & Stempel QR
              </h1>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 font-medium">
                Alur penandatanganan dokumen digital otomatis dengan verifikasi token QR instan dan fingerprint SHA-256.
              </p>
            </div>

            {/* Stepper Navigasi */}
            <WizardStepper
              currentStep={currentStep}
              steps={steps}
              onStepClick={(step) => setCurrentStep(step)}
            />

            {/* ========================================================= */}
            {/* STEP 1: Pilih Agenda Acara Induk                         */}
            {/* ========================================================= */}
            {currentStep === 1 && (
              <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-6 shadow-xs space-y-4 max-w-2xl mx-auto">
                <div>
                  <h3 className="text-sm font-bold text-[#0e1738] dark:text-zinc-100">
                    Langkah 1: Tentukan Agenda Acara Induk
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Setiap sertifikat yang diterbitkan wajib terikat ke agenda acara terdaftar di bawah institusi Anda.
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  {isEventsLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-2 text-slate-400">
                      <Loader2 className="w-5 h-5 animate-spin text-[#122253]" />
                      <span className="text-xs">Memuat agenda acara Anda...</span>
                    </div>
                  ) : events.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 dark:border-zinc-800 rounded-xl space-y-2">
                      <AlertCircle className="w-8 h-8 mx-auto text-slate-300" />
                      <p className="text-xs font-semibold text-slate-600 dark:text-zinc-300">
                        Belum ada agenda acara aktif
                      </p>
                      <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                        Silakan buat agenda acara terlebih dahulu sebelum menerbitkan dokumen.
                      </p>
                      <button
                        type="button"
                        onClick={() => router.push("/user/events")}
                        className="mt-2 px-4 py-2 bg-[#122253] text-white rounded-xl text-xs font-semibold cursor-pointer"
                      >
                        Buka Manajemen Agenda
                      </button>
                    </div>
                  ) : (
                    events.map((evt) => (
                      <div
                        key={evt.id}
                        onClick={() => setSelectedEventId(evt.id)}
                        className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          selectedEventId === evt.id
                            ? "border-[#122253] bg-indigo-50/40 dark:border-zinc-100 dark:bg-zinc-800/80 ring-1 ring-[#122253]"
                            : "border-slate-200 dark:border-zinc-800 hover:bg-slate-50/50 dark:hover:bg-zinc-800/40"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
                            <CalendarDays size={16} />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-[#0e1738] dark:text-zinc-100">
                              {evt.name}
                            </h4>
                            <span className="text-[11px] text-slate-400 font-mono">
                              {new Date(evt.event_date).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}{" "}
                              • {evt.location || "Online"}
                            </span>
                          </div>
                        </div>
                        {selectedEventId === evt.id && (
                          <CheckCircle2
                            size={18}
                            className="text-[#122253] dark:text-zinc-100"
                          />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* STEP 2: Unggah Berkas Fisik & Identitas Penerima          */}
            {/* ========================================================= */}
            {currentStep === 2 && (
              <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-6 shadow-xs space-y-5 max-w-3xl mx-auto text-xs">
                <div>
                  <h3 className="text-sm font-bold text-[#0e1738] dark:text-zinc-100">
                    Langkah 2: Unggah Dokumen PDF
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pilih mode unggah tunggal atau massal untuk dokumen yang siap diproses.
                  </p>
                </div>

                {/* Mode Selector */}
                <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl max-w-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setUploadType("single");
                      setFiles([]);
                      setRecipientNames([]);
                    }}
                    className={`py-1.5 px-3 rounded-lg font-bold transition-all cursor-pointer ${
                      uploadType === "single"
                        ? "bg-white dark:bg-zinc-900 text-[#0e1738] dark:text-white shadow-xs"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    Unggah Tunggal
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadType("bulk");
                      setFiles([]);
                      setRecipientNames([]);
                    }}
                    className={`py-1.5 px-3 rounded-lg font-bold transition-all cursor-pointer ${
                      uploadType === "bulk"
                        ? "bg-white dark:bg-zinc-900 text-[#0e1738] dark:text-white shadow-xs"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    Unggah Massal (Bulk)
                  </button>
                </div>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  multiple={uploadType === "bulk"}
                  className="hidden"
                  onChange={handleFileSelection}
                />

                {/* Dropzone Area */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 dark:border-zinc-700 rounded-2xl p-8 text-center space-y-2 hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors cursor-pointer"
                >
                  <UploadCloud className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="font-bold text-[#0e1738] dark:text-zinc-200">
                    Klik untuk memilih berkas PDF {uploadType === "bulk" ? "sekaligus" : ""}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Dokumen PDF standar A4 Landscape/Portrait (Maks. 15MB per file)
                  </p>
                </div>

                {/* List Berkas Terpilih & Input Nama Penerima */}
                {files.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <span className="font-semibold text-slate-600 dark:text-zinc-300">
                      Daftar Berkas Terpilih ({files.length}):
                    </span>
                    <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                      {files.map((file, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl border border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-zinc-800/30"
                        >
                          <div className="flex items-center gap-2.5 truncate max-w-xs">
                            <FileText size={16} className="text-indigo-600 shrink-0" />
                            <span className="font-mono text-slate-800 dark:text-zinc-200 truncate">
                              {file.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 flex-1 max-w-sm">
                            <span className="text-[11px] text-slate-400 shrink-0">
                              Penerima:
                            </span>
                            <input
                              type="text"
                              required
                              value={recipientNames[idx] || ""}
                              onChange={(e) =>
                                handleRecipientNameChange(idx, e.target.value)
                              }
                              placeholder="Nama lengkap peserta..."
                              className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-[#122253]"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveFile(idx)}
                            className="text-slate-400 hover:text-rose-600 p-1 self-end sm:self-auto cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ========================================================= */}
            {/* STEP 3: Konfigurasi Stempel QR Visual                     */}
            {/* ========================================================= */}
            {currentStep === 3 && (
              <QrPositionCanvas qrConfig={qrConfig} onChange={setQrConfig} />
            )}

            {/* ========================================================= */}
            {/* STEP 4: Konfirmasi Akhir & Ringkasan Dokumen             */}
            {/* ========================================================= */}
            {currentStep === 4 && (
              <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-6 shadow-xs space-y-5 max-w-xl mx-auto text-xs text-center">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto">
                  <ShieldCheck size={26} />
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#0e1738] dark:text-zinc-100">
                    Konfirmasi Penerbitan Dokumen Resmi
                  </h3>
                  <p className="text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Sistem akan menyematkan barcode verifikasi pada koordinat yang ditentukan dan mencatat file hash SHA-256 ke database.
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-slate-200 dark:border-zinc-700 text-left space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Agenda Acara:</span>
                    <span className="font-bold text-[#0e1738] dark:text-zinc-100 truncate max-w-[240px]">
                      {selectedEvent?.name || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Berkas:</span>
                    <span className="font-bold text-[#0e1738] dark:text-zinc-100">
                      {files.length} Dokumen Sertifikat
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Dimensi Stempel:</span>
                    <span className="font-mono text-slate-700 dark:text-zinc-300">
                      {qrConfig.width} × {qrConfig.height} pt (x: {Math.round(qrConfig.x)}, y: {Math.round(qrConfig.y)})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Metode Verifikasi:</span>
                    <span className="font-bold text-emerald-600">
                      QR Token + SHA-256 Checksum
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* Navigasi Tombol Wizard (Prev / Next)                      */}
            {/* ========================================================= */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                disabled={currentStep === 1 || isSubmitting}
                onClick={handlePrevStep}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs font-semibold text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Sebelumnya</span>
              </button>

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#122253] text-white text-xs font-semibold hover:bg-[#0e1738] transition-all shadow-xs cursor-pointer"
                >
                  <span>Lanjutkan</span>
                  <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleExecuteIssuance}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-all shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyematkan Segel...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={14} />
                      <span>Terbitkan Sekarang</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </main>
        </div>
      </div>
    </UserGuard>
  );
}