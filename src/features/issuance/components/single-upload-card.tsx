"use client";

import { useState } from "react";
import {
  FileUp,
  UploadCloud,
  CheckCircle2,
  FileText,
  Trash2,
  RotateCcw,
  User,
  AlertCircle,
} from "lucide-react";

interface SingleUploadCardProps {
  file: File | null;
  recipientName: string;
  disabled?: boolean;
  onSelectFile: (files: File[]) => void;
  onNameChange: (name: string) => void;
  onBrowseClick: () => void;
  onRemoveFile?: () => void;
}

export function SingleUploadCard({
  file,
  recipientName,
  disabled = false,
  onSelectFile,
  onNameChange,
  onBrowseClick,
  onRemoveFile,
}: SingleUploadCardProps) {
  const [isDragging, setIsDragging] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleClear = () => {
    if (onRemoveFile) {
      onRemoveFile();
    } else {
      onSelectFile([]);
      onNameChange("");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    if (e.dataTransfer.files) {
      onSelectFile(Array.from(e.dataTransfer.files));
    }
  };

  const handleBrowse = () => {
    if (disabled) return;
    onBrowseClick();
  };

  return (
    <div
      className={`w-full bg-white dark:bg-zinc-900 border rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 transition-all ${
        disabled
          ? "border-slate-200/60 dark:border-zinc-800/50 opacity-60"
          : "border-slate-200/90 dark:border-zinc-800"
      }`}
    >
      {/* Header Bagian */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-slate-100 dark:border-zinc-800/80">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <FileUp size={15} className="text-[#122253] dark:text-indigo-400" />
            <span>2. Berkas Sertifikat & Identitas Penerima</span>
          </label>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Unggah berkas PDF sertifikat dan tentukan nama lengkap penerima yang
            akan tercatat resmi.
          </p>
        </div>

        <span className="self-start sm:self-auto text-[11px] font-mono font-bold text-slate-400 bg-slate-100 dark:bg-zinc-800 px-3 py-1 rounded-full">
          Format: PDF (Maks. 15MB)
        </span>
      </div>

      {/* Peringatan jika belum memilih event */}
      {disabled && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 text-xs">
          <AlertCircle size={15} className="shrink-0" />
          <span>
            Pilih agenda kegiatan induk terlebih dahulu pada langkah 1 di atas.
          </span>
        </div>
      )}

      {/* Area Dropzone Horizontal / Full-Width */}
      {!file ? (
        <div
          onClick={handleBrowse}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`w-full border-2 border-dashed rounded-2xl p-6 sm:px-8 sm:py-7 flex flex-col sm:flex-row items-center justify-between gap-5 transition-all select-none ${
            disabled
              ? "border-slate-200 dark:border-zinc-800 bg-slate-50/40 dark:bg-zinc-900/40 cursor-not-allowed"
              : isDragging
                ? "border-[#122253] bg-indigo-50/40 dark:bg-zinc-800/80 scale-[0.99] cursor-pointer"
                : "border-slate-300 dark:border-zinc-700 hover:border-[#122253] hover:bg-slate-50/70 dark:hover:bg-zinc-800/40 bg-[#faf8f5]/60 cursor-pointer"
          }`}
        >
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="w-13 h-13 rounded-2xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 flex items-center justify-center shrink-0 shadow-xs">
              <UploadCloud
                size={24}
                className={
                  disabled
                    ? "text-slate-300 dark:text-zinc-600"
                    : "text-[#122253] dark:text-indigo-300"
                }
              />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-100">
                Pilih atau Tarik Berkas Sertifikat PDF ke Sini
              </h4>
              <p className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">
                Sistem akan otomatis mengekstrak nama berkas menjadi nama
                penerima sertifikat.
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={disabled}
            onClick={(e) => {
              e.stopPropagation();
              handleBrowse();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-bold text-[#122253] dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors shadow-2xs shrink-0 disabled:cursor-not-allowed disabled:opacity-50 text-center"
          >
            Jelajahi Berkas
          </button>
        </div>
      ) : (
        /* Status Kartu Berkas Terunggah (Memanjang Horizontal) */
        <div className="w-full p-4 sm:p-5 rounded-2xl border border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/30 dark:bg-emerald-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <FileText size={20} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-mono text-xs sm:text-sm font-bold text-slate-800 dark:text-zinc-100 truncate">
                  {file.name}
                </h4>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full shrink-0">
                  <CheckCircle2 size={11} /> Siap Diterbitkan
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400 dark:text-zinc-500 mt-0.5">
                Ukuran dokumen: {formatFileSize(file.size)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              type="button"
              disabled={disabled}
              onClick={handleBrowse}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>Ganti Berkas</span>
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={handleClear}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              title="Hapus berkas terpilih"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Editor Input Nama Penerima (Memanjang Full-Width) */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 dark:text-zinc-200 flex items-center gap-1.5">
            <User size={13} className="text-[#122253] dark:text-indigo-400" />
            <span>Nama Lengkap Penerima Sertifikat</span>
          </label>
        </div>

        <div className="relative">
          <input
            type="text"
            required
            disabled={disabled}
            value={recipientName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder={
              disabled
                ? "Pilih agenda kegiatan terlebih dahulu..."
                : "Contoh: VerifyEd"
            }
            className="w-full bg-[#faf8f5] dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-2xl px-4 py-3.5 text-xs sm:text-sm font-semibold text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#122253]/15 transition-all disabled:cursor-not-allowed disabled:bg-slate-100 dark:disabled:bg-zinc-900"
          />
        </div>

        <p className="text-[11px] text-slate-400 dark:text-zinc-500 leading-relaxed">
          Nama ini akan dicatat ke basis data repositori, disematkan ke tanda
          tangan digital, serta diverifikasi melalui pemindaian barcode.
        </p>
      </div>
    </div>
  );
}
