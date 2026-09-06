// src/features/certificates/components/revoke-modal.tsx
"use client";

import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";

interface RevokeModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetCount: number;
  certNumber?: string;
  onConfirm: (reason: string) => void;
}

export function RevokeModal({
  isOpen,
  onClose,
  targetCount,
  certNumber,
  onConfirm,
}: RevokeModalProps) {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs select-none animate-in fade-in duration-150">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5">
        <div className="flex items-start justify-between">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center border border-rose-100 dark:border-rose-900">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-lg font-bold text-[#0e1738] dark:text-zinc-100">
            Cabut Status Sertifikat
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
            {targetCount > 1
              ? `Anda akan mencabut ${targetCount} sertifikat terpilih. Status dokumen akan langsung berubah menjadi revoked di seluruh portal publik.`
              : `Anda akan mencabut sertifikat ${certNumber || ""}. Tindakan ini akan tercatat dalam riwayat audit.`}
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
            Alasan Pencabutan Berkas <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Contoh: Kesalahan penulisan gelar akademik atau pembatalan status kelulusan peserta..."
            className="w-full bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 rounded-xl p-3 text-xs text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs font-semibold text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={!reason.trim()}
            onClick={() => {
              onConfirm(reason);
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
          >
            Konfirmasi Pencabutan
          </button>
        </div>
      </div>
    </div>
  );
}
