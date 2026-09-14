"use client";

import { useState } from "react";
import { ShieldAlert, X, Loader2 } from "lucide-react";

export interface CertRevokeModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCount: number;
  onConfirm: (reason: string) => Promise<void> | void;
  isRevoking: boolean;
}

export function CertRevokeModal({
  isOpen,
  onClose,
  selectedCount,
  onConfirm,
  isRevoking,
}: CertRevokeModalProps) {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    await onConfirm(reason.trim());
    setReason("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="text-base font-bold text-[#0e1738] dark:text-zinc-100">
              Cabut {selectedCount} Sertifikat
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          Tindakan ini akan membatalkan status keabsahan dokumen secara permanen
          pada portal verifikasi publik (Status: <strong>REVOKED</strong>).
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">
              Alasan Resmi Pencabutan Dokumen
            </label>
            <textarea
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Contoh: Kesalahan identitas penerima atau revisi berkas acara..."
              className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 text-slate-800 dark:text-zinc-100"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              disabled={isRevoking}
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs font-semibold text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isRevoking || !reason.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isRevoking && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{isRevoking ? "Memproses..." : "Konfirmasi Cabut"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
