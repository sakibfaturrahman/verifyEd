// src/features/events/components/event-detail-modal.tsx
"use client";

import Link from "next/link";
import {
  CalendarDays,
  MapPin,
  Building2,
  Award,
  X,
  ExternalLink,
} from "lucide-react";
import { EventItem } from "../types/event.types";

interface EventDetailModalProps {
  event: EventItem | null;
  onClose: () => void;
}

export function EventDetailModal({ event, onClose }: EventDetailModalProps) {
  if (!event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-bold text-[#0e1738] dark:text-zinc-100">
              Rincian Agenda & Penyelenggara
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

        <div className="space-y-4 text-xs">
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
              <span className="text-slate-400 font-medium">
                Instansi Penyelenggara
              </span>
              <p className="font-semibold text-slate-800 dark:text-zinc-200 mt-0.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{event.organizer}</span>
              </p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Pelaksanaan</span>
              <p className="font-semibold text-slate-800 dark:text-zinc-200 mt-0.5 flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                <span>{event.eventDate}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-slate-400 font-medium">Lokasi</span>
              <p className="font-semibold text-slate-800 dark:text-zinc-200 mt-0.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{event.location}</span>
              </p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">
                Sertifikat Terbit
              </span>
              <p className="font-semibold text-slate-800 dark:text-zinc-200 mt-0.5 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-slate-400" />
                <span>{event.certificatesCount} Lembar</span>
              </p>
            </div>
          </div>

          <div>
            <span className="text-slate-400 font-medium">
              Deskripsi Kegiatan
            </span>
            <p className="text-slate-600 dark:text-zinc-300 mt-1 leading-relaxed bg-slate-50 dark:bg-zinc-800/50 p-3 rounded-xl border border-slate-100 dark:border-zinc-800">
              {event.description}
            </p>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs font-semibold text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Tutup
          </button>
          <Link
            href={`/admin/certificates?event=${event.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0e1738] dark:bg-zinc-100 text-white dark:text-[#0e1738] text-xs font-semibold hover:bg-[#1a254d] transition-colors"
          >
            <span>Lihat Seluruh Sertifikat</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
