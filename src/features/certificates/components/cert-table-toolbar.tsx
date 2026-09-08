// src/features/certificates/components/cert-table-toolbar.tsx
"use client";

import { Search, Download, ShieldAlert } from "lucide-react";

interface CertTableToolbarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: "all" | "active" | "revoked";
  onStatusFilterChange: (val: "all" | "active" | "revoked") => void;
  selectedCount: number;
  onBulkDownload: () => void;
  onOpenBulkRevoke: () => void;
}

export function CertTableToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  selectedCount,
  onBulkDownload,
  onOpenBulkRevoke,
}: CertTableToolbarProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
      {/* Input Pencarian */}
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari ID sertifikat, nama penerima, atau agenda..."
          className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-slate-800 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0e1738]/15 dark:focus:ring-white/10"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Bulk Actions Capsule */}
        {selectedCount > 0 && (
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-zinc-800 px-3 py-1 rounded-xl border border-slate-200 dark:border-zinc-700 animate-in fade-in">
            <span className="text-xs font-bold text-[#0e1738] dark:text-zinc-200">
              {selectedCount} Terpilih
            </span>
            <div className="h-4 w-px bg-slate-300 dark:bg-zinc-700 mx-0.5" />
            <button
              type="button"
              onClick={onBulkDownload}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:text-black dark:hover:text-white px-2 py-0.5 rounded transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh ZIP</span>
            </button>
            <button
              type="button"
              onClick={onOpenBulkRevoke}
              className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 px-2 py-0.5 rounded transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Cabut Massal</span>
            </button>
          </div>
        )}

        {/* Segmented Filter Status */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Status:</span>
          <div className="flex gap-1 bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl">
            {(["all", "active", "revoked"] as const).map((key) => {
              const labels = {
                all: "Semua",
                active: "Aktif",
                revoked: "Dicabut",
              };
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => onStatusFilterChange(key)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    statusFilter === key
                      ? "bg-white dark:bg-zinc-900 text-[#0e1738] dark:text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {labels[key]}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
