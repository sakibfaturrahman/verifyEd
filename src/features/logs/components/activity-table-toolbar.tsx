// src/features/logs/components/activity-table-toolbar.tsx
"use client";

import { Search, Download } from "lucide-react";

interface ActivityTableToolbarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  actionFilter: string;
  onActionFilterChange: (val: string) => void;
  onExportLogs: () => void;
}

export function ActivityTableToolbar({
  searchQuery,
  onSearchChange,
  actionFilter,
  onActionFilterChange,
  onExportLogs,
}: ActivityTableToolbarProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
      {/* Input Pencarian */}
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari aktor, nomor sertifikat, agenda, atau node IP..."
          className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-slate-800 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0e1738]/15 dark:focus:ring-white/10 font-medium"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Filter Kategori Aksi */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-400">Aksi:</span>
          <select
            value={actionFilter}
            onChange={(e) => onActionFilterChange(e.target.value)}
            className="bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-zinc-200 focus:outline-none"
          >
            <option value="all">Semua Aktivitas</option>
            <option value="VERIFICATION">Uji Verifikasi</option>
            <option value="CERTIFICATE">Penerbitan & Pencabutan</option>
            <option value="SECURITY">Otoritas & Hak Akses</option>
          </select>
        </div>

        {/* Tombol Ekspor */}
        <button
          type="button"
          onClick={onExportLogs}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Ekspor CSV</span>
        </button>
      </div>
    </div>
  );
}
