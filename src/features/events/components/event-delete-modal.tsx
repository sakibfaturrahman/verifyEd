// src/features/events/components/event-delete-modal.tsx
"use client";

import { AlertTriangle, X, Loader2 } from "lucide-react";
import { EventItem } from "../hooks/use-admin-events";

interface EventDeleteModalProps {
  event: EventItem | null;
  onClose: () => void;
  onConfirm: (eventId: string) => void;
  isDeleting: boolean;
}

export function EventDeleteModal({
  event,
  onClose,
  onConfirm,
  isDeleting,
}: EventDeleteModalProps) {
  if (!event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-base font-bold text-[#0e1738] dark:text-zinc-100">
              Hapus Agenda Acara
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          Apakah Anda yakin ingin menghapus agenda{" "}
          <strong className="text-slate-900 dark:text-white">
            &ldquo;{event.name}&rdquo;
          </strong>
          ? Seluruh data kegiatan ini akan dihapus permanen dari sistem.
        </p>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs font-semibold text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={() => onConfirm(event.id)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{isDeleting ? "Menghapus..." : "Konfirmasi Hapus"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
