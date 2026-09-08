// src/app/(dashboard)/dashboard/certificates/upload/page.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UserSidebar } from "@/components/layouts/user/user-sidebar";
import { AdminTopNav } from "@/components/layouts/admin/admin-topnav";
import { WizardStepper } from "@/features/issuance/components/wizard-stepper";
import { QrPositionCanvas } from "@/features/issuance/components/qr-position-canvas";
import {
  CalendarDays,
  UploadCloud,
  FileText,
  Trash2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

const steps = [
  "Pilih Agenda",
  "Unggah Dokumen",
  "Atur Stempel QR",
  "Penerbitan",
];

const mockEvents = [
  { id: "evt-01", name: "National Tech Hackathon 2026", date: "01 Sep 2026" },
  { id: "evt-02", name: "Workshop UI/UX & Design System", date: "15 Sep 2026" },
];

export default function CertificateUploadWizardPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [selectedEventId, setSelectedEventId] = useState(mockEvents[0].id);
  const [uploadType, setUploadType] = useState<"single" | "bulk">("single");
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([
    "Sertifikat_Aditya_Pratama.pdf",
  ]);
  const [qrConfig, setQrConfig] = useState({
    x: 78,
    y: 78,
    size: 64,
  });

  const handleNextStep = () => {
    if (currentStep === 1 && !selectedEventId) {
      toast.error("Pilih Agenda", {
        description: "Pilih salah satu agenda acara terdaftar.",
      });
      return;
    }
    if (currentStep === 2 && uploadedFiles.length === 0) {
      toast.error("Unggah Berkas", {
        description: "Unggah minimal 1 berkas PDF sertifikat.",
      });
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleExecuteIssuance = () => {
    toast.loading("Menyematkan Segel Kriptografi...", { duration: 1800 });
    setTimeout(() => {
      toast.success("Penerbitan Berhasil", {
        description: `${uploadedFiles.length} sertifikat telah disegel dengan SHA-256 dan siap diverifikasi.`,
      });
      router.push("/dashboard/certificates");
    }, 1800);
  };

  return (
    <div className="flex min-h-screen bg-[#faf8f5] dark:bg-zinc-950 font-sans antialiased">
      <UserSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <AdminTopNav onOpenSidebar={() => setIsSidebarOpen(true)} />

        <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 xl:px-10 2xl:px-12 w-full max-w-[1680px] mx-auto space-y-5">
          {/* Header Title */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-5 shadow-xs">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0e1738] dark:text-zinc-50">
              Penerbitan Sertifikat & Stempel QR
            </h1>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 font-medium">
              Alur penandatanganan dokumen digital otomatis dengan verifikasi
              token QR instan.
            </p>
          </div>

          {/* Stepper Wizard */}
          <WizardStepper currentStep={currentStep} steps={steps} />

          {/* STEP 1: Pilih Agenda Event */}
          {currentStep === 1 && (
            <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-6 shadow-xs space-y-4 max-w-2xl mx-auto">
              <div>
                <h3 className="text-sm font-bold text-[#0e1738] dark:text-zinc-100">
                  Langkah 1: Tentukan Agenda Acara Induk
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Setiap dokumen yang diterbitkan wajib memiliki relasi ke
                  agenda acara terdaftar.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                {mockEvents.map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => setSelectedEventId(evt.id)}
                    className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      selectedEventId === evt.id
                        ? "border-[#0e1738] bg-slate-50 dark:border-zinc-100 dark:bg-zinc-800/80 ring-1 ring-[#0e1738] dark:ring-zinc-100"
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
                          {evt.date}
                        </span>
                      </div>
                    </div>
                    {selectedEventId === evt.id && (
                      <CheckCircle2
                        size={16}
                        className="text-[#0e1738] dark:text-zinc-100"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Unggah Berkas PDF */}
          {currentStep === 2 && (
            <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-6 shadow-xs space-y-5 max-w-3xl mx-auto text-xs">
              <div>
                <h3 className="text-sm font-bold text-[#0e1738] dark:text-zinc-100">
                  Langkah 2: Unggah Dokumen PDF
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pilih mode unggah tunggal atau massal untuk dokumen yang siap
                  diberi stempel.
                </p>
              </div>

              {/* Mode Selector */}
              <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl max-w-xs">
                <button
                  type="button"
                  onClick={() => setUploadType("single")}
                  className={`py-1.5 px-3 rounded-lg font-bold transition-all ${
                    uploadType === "single"
                      ? "bg-white dark:bg-zinc-900 text-[#0e1738] dark:text-white shadow-xs"
                      : "text-slate-500"
                  }`}
                >
                  Single Upload
                </button>
                <button
                  type="button"
                  onClick={() => setUploadType("bulk")}
                  className={`py-1.5 px-3 rounded-lg font-bold transition-all ${
                    uploadType === "bulk"
                      ? "bg-white dark:bg-zinc-900 text-[#0e1738] dark:text-white shadow-xs"
                      : "text-slate-500"
                  }`}
                >
                  Bulk Upload
                </button>
              </div>

              {/* Dropzone */}
              <div className="border-2 border-dashed border-slate-200 dark:border-zinc-700 rounded-2xl p-8 text-center space-y-2 hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors cursor-pointer">
                <UploadCloud className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="font-bold text-[#0e1738] dark:text-zinc-200">
                  Tarik berkas PDF ke area ini atau klik untuk memilih
                </p>
                <p className="text-[11px] text-slate-400">
                  Format yang didukung: Dokumen PDF (Maks. 15MB per file)
                </p>
              </div>

              {/* Daftar Berkas Terpilih */}
              <div className="space-y-2 pt-2">
                <span className="font-semibold text-slate-500">
                  Berkas Terunggah ({uploadedFiles.length}):
                </span>
                {uploadedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-slate-200 dark:border-zinc-800 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-800/30"
                  >
                    <div className="flex items-center gap-2">
                      <FileText size={15} className="text-indigo-600" />
                      <span className="font-medium text-slate-800 dark:text-zinc-200">
                        {file}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setUploadedFiles([])}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Konfigurasi Stempel QR Visual */}
          {currentStep === 3 && (
            <QrPositionCanvas qrConfig={qrConfig} onChange={setQrConfig} />
          )}

          {/* STEP 4: Konfirmasi Akhir */}
          {currentStep === 4 && (
            <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-6 shadow-xs space-y-5 max-w-xl mx-auto text-xs text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto">
                <ShieldCheck size={24} />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#0e1738] dark:text-zinc-100">
                  Konfirmasi Penerbitan Dokumen
                </h3>
                <p className="text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Sistem akan mengomputasi hash integritas SHA-256 dan mencetak
                  QR code verifikasi secara permanen pada dokumen.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-slate-200 dark:border-zinc-700 text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Berkas:</span>
                  <span className="font-bold text-[#0e1738] dark:text-zinc-100">
                    {uploadedFiles.length} Sertifikat
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Dimensi Stempel:</span>
                  <span className="font-mono text-slate-700 dark:text-zinc-300">
                    {qrConfig.size}x{qrConfig.size} px
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Metode Validasi:</span>
                  <span className="font-bold text-emerald-600">
                    QR Token + Checksum PDF
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Navigasi Tombol Wizard (Prev / Next) */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              disabled={currentStep === 1}
              onClick={handlePrevStep}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs font-semibold text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Sebelumnya</span>
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#0e1738] dark:bg-zinc-100 text-white dark:text-[#0e1738] text-xs font-semibold hover:bg-[#1a254d] transition-all shadow-xs"
              >
                <span>Lanjutkan</span>
                <ArrowRight size={14} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleExecuteIssuance}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-all shadow-xs"
              >
                <CheckCircle2 size={14} />
                <span>Terbitkan Sekarang</span>
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
