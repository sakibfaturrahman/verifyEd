// src/features/issuance/components/bulk-upload-workspace.tsx
"use client";

import { useState } from "react";
import { UploadCloud, File, FileText, Trash2 } from "lucide-react";

interface BulkUploadWorkspaceProps {
  files: File[];
  recipientNames: string[];
  onSelectFiles: (files: File[]) => void;
  onRemoveFile: (index: number) => void;
  onNameChange: (index: number, value: string) => void;
  onClearAll: () => void;
  onBrowseClick: () => void;
}

export function BulkUploadWorkspace({
  files,
  recipientNames,
  onSelectFiles,
  onRemoveFile,
  onNameChange,
  onClearAll,
  onBrowseClick,
}: BulkUploadWorkspaceProps) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Kolom Kiri: Dropzone & Ringkasan */}
      <div className="lg:col-span-5 bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-5">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <UploadCloud size={14} className="text-[#122253]" />
            <span>2. Unggah Banyak Berkas Sekaligus</span>
          </label>
          <p className="text-xs text-slate-500 mt-0.5">
            Tarik puluhan hingga ratusan berkas PDF sekaligus.
          </p>
        </div>

        {/* Dropzone Box */}
        <div
          onClick={onBrowseClick}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files) {
              onSelectFiles(Array.from(e.dataTransfer.files));
            }
          }}
          className={`border-2 border-dashed rounded-3xl p-7 text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
            isDragging
              ? "border-[#122253] bg-indigo-50/40 scale-[0.99]"
              : "border-slate-300 dark:border-zinc-700 hover:border-[#122253] bg-[#faf8f5]/60 hover:bg-slate-50"
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 flex items-center justify-center mb-2.5 shadow-xs">
            <UploadCloud size={22} className="text-[#122253]" />
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-zinc-100">
            Klik untuk Tambah Berkas PDF
          </h4>
          <p className="text-[10px] text-slate-400 mt-1 max-w-xs">
            Mendukung pemilihan banyak file sekaligus (.pdf)
          </p>
        </div>

        {/* Ringkasan Status */}
        <div className="p-4 rounded-2xl bg-[#faf8f5] dark:bg-zinc-800/50 border border-slate-200/80 dark:border-zinc-700/60 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Total Berkas:</span>
            <span className="font-mono font-bold text-slate-800 dark:text-zinc-100">
              {files.length} Dokumen
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Penerima Terisi:</span>
            <span className="font-mono font-bold text-emerald-600">
              {recipientNames.filter((n) => n.trim()).length} / {files.length}
            </span>
          </div>
        </div>

        {files.length > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="w-full py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors cursor-pointer"
          >
            Kosongkan Semua Berkas
          </button>
        )}
      </div>

      {/* Kolom Kanan: Editor Nama Penerima */}
      <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
          <div>
            <h3 className="text-sm font-bold text-[#122253] dark:text-zinc-100">
              Penetapan Nama Penerima
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Nama otomatis diambil dari nama file. Anda dapat mengubahnya
              langsung.
            </p>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 bg-slate-100 dark:bg-zinc-800 rounded-lg text-slate-600 dark:text-zinc-300">
            {files.length} Berkas
          </span>
        </div>

        {files.length === 0 ? (
          <div className="py-14 text-center text-slate-400 text-xs border border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl flex flex-col items-center justify-center gap-2">
            <File size={22} className="text-slate-300" />
            <span>Belum ada berkas PDF yang dipilih.</span>
          </div>
        ) : (
          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1.5">
            {files.map((file, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-[#faf8f5]/50 dark:bg-zinc-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5 truncate max-w-xs">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center shrink-0">
                    <FileText size={15} />
                  </div>
                  <span className="font-mono text-xs text-slate-700 dark:text-zinc-300 truncate">
                    {file.name}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-1 max-w-sm">
                  <input
                    type="text"
                    required
                    value={recipientNames[idx] || ""}
                    onChange={(e) => onNameChange(idx, e.target.value)}
                    placeholder="Nama lengkap penerima..."
                    className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-[#122253]"
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveFile(idx)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                    title="Hapus berkas ini"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
