// src/features/logs/components/activity-detail-modal.tsx
"use client";

import { History, Globe, User, ShieldCheck, X } from "lucide-react";
import { ActivityLogItem } from "../types/activity.types";

interface ActivityDetailModalProps {
  log: ActivityLogItem | null;
  onClose: () => void;
}

export function ActivityDetailModal({
  log,
  onClose,
}: ActivityDetailModalProps) {
  if (!log) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-bold text-[#0e1738] dark:text-zinc-100">
              Audit Forensik Aktivitas
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

        <div className="space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-slate-400 font-medium">
                Inisiator (Aktor)
              </span>
              <p className="font-bold text-slate-800 dark:text-zinc-200 mt-0.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>{log.actor.name}</span>
              </p>
              <span className="text-[10px] text-slate-400 font-mono">
                {log.actor.role}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-medium">
                Waktu Transaksi
              </span>
              <p className="font-mono font-semibold text-slate-800 dark:text-zinc-200 mt-0.5">
                {log.timestamp}
              </p>
            </div>
          </div>

          <div>
            <span className="text-slate-400 font-medium">Target Entitas</span>
            <p className="font-mono font-bold text-sm text-[#0e1738] dark:text-zinc-100 mt-0.5">
              {log.target}
            </p>
          </div>

          <div>
            <span className="text-slate-400 font-medium">
              Deskripsi Muatan Data
            </span>
            <p className="text-slate-600 dark:text-zinc-300 mt-1 leading-relaxed bg-slate-50 dark:bg-zinc-800/50 p-3 rounded-xl border border-slate-100 dark:border-zinc-800 font-mono">
              {log.details}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 bg-slate-50 dark:bg-zinc-800/50 rounded-xl border border-slate-200 dark:border-zinc-700">
              <span className="text-[10px] text-slate-400 font-medium">
                Node IP Origin
              </span>
              <p className="font-mono font-bold text-slate-700 dark:text-zinc-200 mt-0.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>{log.ipAddress}</span>
              </p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-zinc-800/50 rounded-xl border border-slate-200 dark:border-zinc-700">
              <span className="text-[10px] text-slate-400 font-medium">
                Ledger Immutability
              </span>
              <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Tervalidasi SHA-256</span>
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs font-semibold text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
