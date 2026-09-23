"use client";

import { CheckCheck } from "lucide-react";

interface NotificationFilterProps {
  filter: "all" | "unread";
  onFilterChange: (filter: "all" | "unread") => void;
  unreadCount: number;
  total: number;
  onMarkAllAsRead: () => void;
  isMarkingAll: boolean;
}

export function NotificationFilter({
  filter,
  onFilterChange,
  unreadCount,
  total,
  onMarkAllAsRead,
  isMarkingAll,
}: NotificationFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-zinc-800">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onFilterChange("all")}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
            filter === "all"
              ? "bg-[#0e1738] dark:bg-zinc-100 text-white dark:text-[#0e1738]"
              : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
          }`}
        >
          Semua ({total})
        </button>
        <button
          type="button"
          onClick={() => onFilterChange("unread")}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
            filter === "unread"
              ? "bg-[#0e1738] dark:bg-zinc-100 text-white dark:text-[#0e1738]"
              : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
          }`}
        >
          Belum Dibaca ({unreadCount})
        </button>
      </div>

      {unreadCount > 0 && (
        <button
          type="button"
          onClick={onMarkAllAsRead}
          disabled={isMarkingAll}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-xl transition-colors disabled:opacity-50 cursor-pointer self-start sm:self-auto"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          <span>Tandai Semua Selesai Dibaca</span>
        </button>
      )}
    </div>
  );
}
