// src/features/users/components/user-table-toolbar.tsx
"use client";

import { Search, UserPlus } from "lucide-react";

interface UserTableToolbarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: "all" | "active" | "inactive";
  onStatusFilterChange: (val: "all" | "active" | "inactive") => void;
  roleFilter: "all" | "admin" | "user";
  onRoleFilterChange: (val: "all" | "admin" | "user") => void;
}

export function UserTableToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  roleFilter,
  onRoleFilterChange,
}: UserTableToolbarProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
      {/* Input Pencarian */}
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari nama instansi, PIC, atau alamat email..."
          className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-slate-800 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0e1738]/15 dark:focus:ring-white/10 font-medium"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Filter Role */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl text-xs">
          {(["all", "user", "admin"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => onRoleFilterChange(r)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                roleFilter === r
                  ? "bg-white dark:bg-zinc-900 text-[#0e1738] dark:text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              {r === "all" ? "Semua Role" : r === "admin" ? "Admin" : "User"}
            </button>
          ))}
        </div>

        {/* Filter Status Akun */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl text-xs">
          {(["all", "active", "inactive"] as const).map((key) => {
            const labels = {
              all: "Semua Status",
              active: "Aktif",
              inactive: "Nonaktif",
            };
            return (
              <button
                key={key}
                type="button"
                onClick={() => onStatusFilterChange(key)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
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
  );
}
