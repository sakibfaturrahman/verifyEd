// src/features/events/components/event-table-toolbar.tsx
"use client";

import { Search, Plus } from "lucide-react";

interface EventTableToolbarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: "all" | "draft" | "ongoing" | "completed";
  onStatusFilterChange: (
    val: "all" | "draft" | "ongoing" | "completed",
  ) => void;
  onOpenCreateModal: () => void;
}

export function EventTableToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onOpenCreateModal,
}: EventTableToolbarProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
      {/* Input Pencarian */}
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari nama agenda, lokasi, atau instansi penyelenggara..."
          className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-slate-800 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0e1738]/15 dark:focus:ring-white/10"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Filter Segmented Status */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Status:</span>
          <div className="flex gap-1 bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl">
            {(["all", "draft", "ongoing", "completed"] as const).map((key) => {
              const labels = {
                all: "Semua",
                draft: "Draf",
                ongoing: "Berlangsung",
                completed: "Selesai",
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

        {/* Tombol Buat Agenda Baru */}
        <button
          type="button"
          onClick={onOpenCreateModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0e1738] dark:bg-zinc-100 text-white dark:text-[#0e1738] text-xs font-semibold hover:bg-[#1a254d] transition-all shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Event</span>
        </button>
      </div>
    </div>
  );
}
