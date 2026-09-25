"use client";

import { useState, useEffect } from "react";
import {
  X,
  CalendarDays,
  MapPin,
  FileText,
  Save,
  Building2,
  Loader2,
} from "lucide-react";
import { UserEventItem } from "../../hooks/use-user-events";
import { useAuthStore } from "@/stores/auth-store";

interface UserEventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    organizer: string;
    event_date: string;
    location: string;
    description: string;
    status: "draft" | "ongoing" | "completed";
  }) => void;
  initialData?: UserEventItem | null;
  isSubmitting?: boolean;
}

export function UserEventFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting = false,
}: UserEventFormModalProps) {
  const user = useAuthStore((state) => state.user);
  const [name, setName] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"draft" | "ongoing" | "completed">(
    "ongoing",
  );

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setOrganizer(initialData.organizer || user?.name || "");
      // Ambil format YYYY-MM-DD
      setEventDate(
        initialData.event_date ? initialData.event_date.split("T")[0] : "",
      );
      setLocation(initialData.location || "");
      setDescription(initialData.description || "");
      setStatus(initialData.status);
    } else {
      setName("");
      setOrganizer(user?.name || "Universitas Perjuangan");
      setEventDate(new Date().toISOString().split("T")[0]);
      setLocation("");
      setDescription("");
      setStatus("ongoing");
    }
  }, [initialData, isOpen, user]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      organizer,
      event_date: eventDate,
      location,
      description,
      status,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
          <h3 className="text-base font-bold text-[#0e1738] dark:text-zinc-100">
            {initialData ? "Edit Informasi Agenda" : "Pendaftaran Agenda Baru"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-zinc-200">
              Nama Kegiatan / Acara
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Seminar"
              className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 font-medium text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#0e1738]/15"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-zinc-200 flex items-center gap-1">
              <Building2 size={13} className="text-slate-400" />
              <span>Instansi / Lembaga Penyelenggara</span>
            </label>
            <input
              type="text"
              required
              value={organizer}
              onChange={(e) => setOrganizer(e.target.value)}
              placeholder="Contoh: Universitas Perjuangan"
              className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 font-medium text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#0e1738]/15"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-zinc-200 flex items-center gap-1">
                <CalendarDays size={13} className="text-slate-400" />
                <span>Tanggal Acara</span>
              </label>
              <input
                type="date"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 font-medium text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#0e1738]/15"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-zinc-200">
                Status Kegiatan
              </label>
              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as "draft" | "ongoing" | "completed")
                }
                className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 font-medium text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#0e1738]/15"
              >
                <option value="ongoing">Berlangsung</option>
                <option value="completed">Selesai</option>
                <option value="draft">Draf</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-zinc-200 flex items-center gap-1">
              <MapPin size={13} className="text-slate-400" />
              <span>Lokasi Pelaksanaan</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Contoh: Gedung Auditorium / Daring (Zoom)"
              className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 font-medium text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#0e1738]/15"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-zinc-200 flex items-center gap-1">
              <FileText size={13} className="text-slate-400" />
              <span>Deskripsi Agenda</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ringkasan tema kegiatan dan tujuan sertifikasi..."
              className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl p-3 font-medium text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#0e1738]/15 leading-relaxed"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-zinc-800">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 font-semibold hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0e1738] dark:bg-zinc-100 text-white dark:text-[#0e1738] font-semibold hover:bg-[#1a254d] transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save size={14} />
              )}
              <span>{initialData ? "Simpan Perubahan" : "Simpan Agenda"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
