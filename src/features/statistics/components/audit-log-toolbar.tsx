// src/features/statistics/components/audit-log-toolbar.tsx
"use client";

import { Search, Download, Filter } from "lucide-react";

interface AuditLogToolbarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  methodFilter: "all" | "qr" | "pdf" | "certificate_id";
  onMethodFilterChange: (val: "all" | "qr" | "pdf" | "certificate_id") => void;
  resultFilter: "all" | "verified" | "revoked" | "not_found";
  onResultFilterChange: (val: "all" | "verified" | "revoked" | "not_found") => void;
  onExportLogs: () => void;
}

export function AuditLogToolbar({
  searchQuery,
  onSearchChange,
  methodFilter,
  onMethodFilterChange,
  resultFilter,
  onResultFilterChange,
  onExportLogs,
}: AuditLogToolbarProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-4 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
      {/* Input Pencarian */}
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari ID sertifikat atau nama penerima pada log..."
          className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-slate-800 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0e1738]/15 dark:focus:ring-white/10 font-medium"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Filter Metode Verifikasi */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-400">Metode:</span>
          <select
            value={methodFilter}
            onChange={(e) => onMethodFilterChange(e.target.value as any)}
            className="bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-zinc-200 focus:outline-none"
          >
            <option value="all">Semua Metode</option>
            <option value="qr">Scan Token QR</option>
            <option value="pdf">Upload File PDF</option>
            <option value="certificate_id">Nomor Sertifikat</option>
          </select>
        </div>

        {/* Filter Hasil Validasi */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-400">Hasil:</span>
          <select
            value={resultFilter}
            onChange={(e) => onResultFilterChange(e.target.value as any)}
            className="bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-zinc-200 focus:outline-none"
          >
            <option value="all">Semua Hasil</option>
            <option value="verified">Verified (Sah)</option>
            <option value="revoked">Revoked (Dicabut)</option>
            <option value="not_found">Not Found</option>
          </select>
        </div>

        {/* Tombol Ekspor CSV */}
        <button
          type="button"
          onClick={onExportLogs}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Ekspor Log (CSV)</span>
        </button>
      </div>
    </div>
  );
}