"use client";

import Link from "next/link";
import {
  CalendarDays,
  MapPin,
  Award,
  X,
  ExternalLink,
  Edit2,
  Building2,
} from "lucide-react";
import { UserEventItem } from "../../hooks/use-user-events";

interface UserEventDetailModalProps {
  event: UserEventItem | null;
  onClose: () => void;
  onEdit: (event: UserEventItem) => void;
}

export function UserEventDetailModal({
  event,
  onClose,
  onEdit,
}: UserEventDetailModalProps) {
  if (!event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-bold text-[#0e1738] dark:text-zinc-100">
              Rincian Agenda Acara
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

        <div className="space-y-3.5 text-xs">
          <div>
            <span className="text-slate-400 font-medium">
              Nama Agenda Acara
            </span>
            <p className="font-bold text-sm text-[#0e1738] dark:text-zinc-100 mt-0.5">
              {event.name}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-slate-400 font-medium">Penyelenggara</span>
              <p className="font-semibold text-slate-800 dark:text-zinc-200 mt-0.5 flex items-center gap-1.5">
                <Building2 size={13} className="text-slate-400 shrink-0" />
                <span className="truncate">{event.organizer}</span>
              </p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Pelaksanaan</span>
              <p className="font-semibold text-slate-800 dark:text-zinc-200 mt-0.5 flex items-center gap-1.5 font-mono">
                <CalendarDays size={13} className="text-slate-400 shrink-0" />
                <span>
                  {new Date(event.event_date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </p>
            </div>
          </div>

          <div>
            <span className="text-slate-400 font-medium">Lokasi</span>
            <p className="font-semibold text-slate-800 dark:text-zinc-200 mt-0.5 flex items-center gap-1.5">
              <MapPin size={13} className="text-slate-400 shrink-0" />
              <span>{event.location || "Daring / Tidak Ditentukan"}</span>
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-zinc-800/60 rounded-xl border border-slate-200 dark:border-zinc-700 flex items-center justify-between">
            <span className="font-medium text-slate-500">
              Sertifikat Terbit:
            </span>
            <span className="font-mono font-bold text-sm text-[#0e1738] dark:text-zinc-100 flex items-center gap-1.5">
              <Award size={15} className="text-indigo-600" />
              <span>{event.certificatesCount || 0} Dokumen</span>
            </span>
          </div>

          <div>
            <span className="text-slate-400 font-medium">
              Deskripsi Kegiatan
            </span>
            <p className="text-slate-600 dark:text-zinc-300 mt-1 leading-relaxed bg-slate-50 dark:bg-zinc-800/50 p-3 rounded-xl border border-slate-100 dark:border-zinc-800">
              {event.description ||
                "Belum ada keterangan rinci untuk acara ini."}
            </p>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => onEdit(event)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs font-semibold text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <Edit2 size={13} />
            <span>Edit Acara</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs font-semibold text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Tutup
            </button>
            <Link
              href={`/user/certificates?event_id=${event.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0e1738] dark:bg-zinc-100 text-white dark:text-[#0e1738] text-xs font-semibold hover:bg-[#1a254d] transition-colors"
            >
              <span>Lihat Sertifikat</span>
              <ExternalLink size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
