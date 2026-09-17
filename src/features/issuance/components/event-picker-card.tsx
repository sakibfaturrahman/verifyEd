"use client";

import { useState, useMemo } from "react";
import {
  CalendarDays,
  ChevronDown,
  Search,
  Check,
  Loader2,
  User,
  Users,
  Layers,
} from "lucide-react";
import { UserEventItem } from "@/features/events/hooks/use-user-events";

interface EventPickerCardProps {
  events: UserEventItem[];
  isLoading: boolean;
  selectedEventId: string;
  onSelectEvent: (eventId: string) => void;
  uploadType: "single" | "bulk";
  onTypeChange: (type: "single" | "bulk") => void;
}

export function EventPickerCard({
  events,
  isLoading,
  selectedEventId,
  onSelectEvent,
  uploadType,
  onTypeChange,
}: EventPickerCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredEvents = useMemo(() => {
    return events.filter(
      (e) =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        (e.location && e.location.toLowerCase().includes(search.toLowerCase())),
    );
  }, [events, search]);

  const selectedEvent = events.find((e) => e.id === selectedEventId);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
      {/* Label Header */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <CalendarDays size={14} className="text-[#122253]" />
          <span>1. Tentukan Agenda Kegiatan Induk</span>
        </label>
        {selectedEvent && (
          <span className="text-[11px] font-mono text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full font-bold">
            Agenda Terkunci
          </span>
        )}
      </div>

      {/* Selector Box */}
      <div className="relative">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
            selectedEvent
              ? "border-[#122253]/40 bg-indigo-50/20 dark:bg-zinc-800/50"
              : "border-slate-200 dark:border-zinc-800 hover:bg-slate-50/60"
          }`}
        >
          {selectedEvent ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#122253] text-white flex items-center justify-center shrink-0 shadow-xs">
                <CalendarDays size={18} />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#122253] dark:text-zinc-100">
                  {selectedEvent.name}
                </h4>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                  {new Date(selectedEvent.event_date).toLocaleDateString(
                    "id-ID",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    },
                  )}{" "}
                  • {selectedEvent.location || "Online"}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-slate-400">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
                <CalendarDays size={18} />
              </div>
              <span className="text-xs sm:text-sm font-medium">
                Klik untuk memilih agenda acara terdaftar...
              </span>
            </div>
          )}

          <ChevronDown
            size={16}
            className={`text-slate-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>

        {/* Dropdown Menu Pencarian Agenda */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 z-40 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xl p-3 space-y-2 animate-in fade-in zoom-in-95">
            <div className="relative">
              <Search
                size={14}
                className="text-slate-400 absolute left-3 top-3 pointer-events-none"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama agenda atau lokasi..."
                className="w-full pl-9 pr-4 py-2 bg-[#faf8f5] dark:bg-zinc-800/80 rounded-xl text-xs font-medium text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#122253]"
              />
            </div>

            <div className="max-h-56 overflow-y-auto space-y-1 pr-1">
              {isLoading ? (
                <div className="py-6 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                  <Loader2 size={14} className="animate-spin text-[#122253]" />
                  <span>Memuat agenda...</span>
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  Tidak ditemukan agenda acara yang cocok.
                </div>
              ) : (
                filteredEvents.map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => {
                      onSelectEvent(evt.id);
                      setIsOpen(false);
                    }}
                    className={`p-3 rounded-xl flex items-center justify-between text-xs cursor-pointer transition-colors ${
                      selectedEventId === evt.id
                        ? "bg-[#122253] text-white font-bold"
                        : "hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-200"
                    }`}
                  >
                    <div className="truncate pr-2">
                      <p className="truncate font-semibold">{evt.name}</p>
                      <span
                        className={`text-[10px] font-mono ${
                          selectedEventId === evt.id
                            ? "text-indigo-200"
                            : "text-slate-400"
                        }`}
                      >
                        {new Date(evt.event_date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    {selectedEventId === evt.id && (
                      <Check size={14} className="shrink-0" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Collapse Section: Tampil Otomatis Setelah Event Dipilih */}
      {selectedEvent && (
        <div className="pt-4 border-t border-slate-100 dark:border-zinc-800/80 space-y-3 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-zinc-200 flex items-center gap-1.5">
                <Layers size={14} className="text-[#122253]" />
                <span>Pilih Metode Penerbitan</span>
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Pilih apakah sertifikat diunggah untuk satu penerima atau
                sekaligus banyak.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Opsi Tunggal */}
            <div
              onClick={() => onTypeChange("single")}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                uploadType === "single"
                  ? "border-[#122253] bg-indigo-50/40 dark:bg-zinc-800 ring-1 ring-[#122253]"
                  : "border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    uploadType === "single"
                      ? "bg-[#122253] text-white shadow-xs"
                      : "bg-slate-100 dark:bg-zinc-800 text-slate-500"
                  }`}
                >
                  <User size={16} />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-[#122253] dark:text-zinc-100">
                    Sertifikat Tunggal
                  </h5>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    1 Berkas PDF untuk 1 penerima khusus
                  </p>
                </div>
              </div>
              {uploadType === "single" && (
                <div className="w-5 h-5 rounded-full bg-[#122253] text-white flex items-center justify-center shrink-0">
                  <Check size={12} />
                </div>
              )}
            </div>

            {/* Opsi Massal */}
            <div
              onClick={() => onTypeChange("bulk")}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                uploadType === "bulk"
                  ? "border-[#122253] bg-indigo-50/40 dark:bg-zinc-800 ring-1 ring-[#122253]"
                  : "border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    uploadType === "bulk"
                      ? "bg-[#122253] text-white shadow-xs"
                      : "bg-slate-100 dark:bg-zinc-800 text-slate-500"
                  }`}
                >
                  <Users size={16} />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-[#122253] dark:text-zinc-100">
                    Penerbitan Massal (Bulk)
                  </h5>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Banyak file PDF sekaligus dengan batching
                  </p>
                </div>
              </div>
              {uploadType === "bulk" && (
                <div className="w-5 h-5 rounded-full bg-[#122253] text-white flex items-center justify-center shrink-0">
                  <Check size={12} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
