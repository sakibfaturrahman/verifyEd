// src/features/dashboard/components/user/user-recent-events-box.tsx
"use client";

import Link from "next/link";
import { ArrowUpRight, Clock, Plus, Loader2, CalendarDays } from "lucide-react";
import { useRecentEventsQuery } from "../../hooks/use-user-dashboard";

export function UserRecentEventsBox() {
  const { data: events = [], isPending } = useRecentEventsQuery();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "ongoing":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
        <span className="text-sm font-bold text-[#0e1738] dark:text-zinc-100">
          Agenda Acara Anda
        </span>
        <Link
          href="/user/events"
          className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1"
        >
          <span>Lihat Semua</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-3 flex-1">
        {isPending ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin text-[#122253]" />
            <span className="text-xs">Mengambil agenda acara...</span>
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-slate-400 gap-1.5">
            <CalendarDays className="w-8 h-8 stroke-1 text-slate-300 dark:text-zinc-600" />
            <p className="text-xs font-medium">Belum ada agenda acara aktif.</p>
          </div>
        ) : (
          events.map((evt) => (
            <div
              key={evt.id}
              className="p-4 rounded-2xl border border-slate-200/80 dark:border-zinc-800 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-zinc-800/40 transition-colors"
            >
              <div>
                <h4 className="text-xs font-bold text-[#0e1738] dark:text-zinc-100">
                  {evt.name}
                </h4>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium mt-1">
                  <Clock size={12} />
                  <span>
                    {new Date(evt.eventDate).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span>•</span>
                  <span>{evt.certificatesCount || 0} Sertifikat</span>
                </div>
              </div>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border capitalize ${getStatusBadge(
                  evt.status,
                )}`}
              >
                {evt.status === "completed"
                  ? "Selesai"
                  : evt.status === "ongoing"
                    ? "Berjalan"
                    : "Draf"}
              </span>
            </div>
          ))
        )}
      </div>

      <Link
        href="/user/events/new"
        className="w-full py-3 border border-dashed border-slate-300 dark:border-zinc-700 rounded-2xl text-xs text-slate-500 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-1.5 font-semibold cursor-pointer"
      >
        <Plus size={14} /> Tambah Agenda Acara Baru
      </Link>
    </div>
  );
}
