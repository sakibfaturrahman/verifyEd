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
  AlertCircle,
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

interface FormErrors {
  name?: string;
  organizer?: string;
  eventDate?: string;
  description?: string;
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

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setOrganizer(initialData.organizer || user?.name || "");
      setEventDate(
        initialData.event_date ? initialData.event_date.split("T")[0] : "",
      );
      setLocation(initialData.location || "");
      setDescription(initialData.description || "");
      setStatus(initialData.status);
    } else {
      setName("");
      setOrganizer(user?.name || "");
      setEventDate(new Date().toISOString().split("T")[0]);
      setLocation("");
      setDescription("");
      setStatus("ongoing");
    }
    setErrors({});
    setTouched({});
  }, [initialData, isOpen, user]);

  if (!isOpen) return null;

  const validateField = (field: string, value: string): string | undefined => {
    switch (field) {
      case "name":
        if (!value.trim()) return "Nama kegiatan wajib diisi.";
        if (value.trim().length < 4) return "Nama kegiatan minimal 4 karakter.";
        return undefined;
      case "organizer":
        if (!value.trim()) return "Lembaga penyelenggara wajib diisi.";
        if (value.trim().length < 3)
          return "Nama penyelenggara minimal 3 karakter.";
        return undefined;
      case "eventDate":
        if (!value) return "Tanggal pelaksanaan acara wajib ditentukan.";
        return undefined;
      default:
        return undefined;
    }
  };

  const handleBlur = (field: keyof FormErrors, value: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errorMsg = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: errorMsg }));
  };

  const handleChange = (
    field: keyof FormErrors,
    value: string,
    setter: (val: string) => void,
  ) => {
    setter(value);
    if (touched[field]) {
      const errorMsg = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: errorMsg }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nameErr = validateField("name", name);
    const orgErr = validateField("organizer", organizer);
    const dateErr = validateField("eventDate", eventDate);

    if (nameErr || orgErr || dateErr) {
      setErrors({
        name: nameErr,
        organizer: orgErr,
        eventDate: dateErr,
      });
      setTouched({
        name: true,
        organizer: true,
        eventDate: true,
      });
      return;
    }

    onSubmit({
      name: name.trim(),
      organizer: organizer.trim(),
      event_date: eventDate,
      location: location.trim(),
      description: description.trim(),
      status,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="relative bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 my-auto">
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800">
          <div>
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-[#0e1738] dark:text-zinc-100">
              {initialData
                ? "Edit Informasi Agenda"
                : "Pendaftaran Agenda Baru"}
            </h3>
            <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5 font-medium">
              Lengkapi rincian kegiatan sebelum sertifikat diterbitkan ke
              publik.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Global Warning Banner jika ada error saat tombol submit ditekan */}
        {Object.values(errors).some(Boolean) && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-semibold animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>
              Mohon periksa dan lengkapi kolom bertanda merah di bawah ini.
            </span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4 text-xs">
          {/* Nama Kegiatan */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-zinc-200 block">
              Nama Kegiatan / Acara <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onBlur={() => handleBlur("name", name)}
              onChange={(e) => handleChange("name", e.target.value, setName)}
              placeholder="Contoh: Workshop / Seminar"
              className={`w-full bg-slate-50/60 dark:bg-zinc-950 border rounded-xl px-3.5 py-2.5 font-medium text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:outline-none transition-all ${
                errors.name
                  ? "border-rose-500 bg-rose-50/20 ring-2 ring-rose-500/20"
                  : "border-slate-200 dark:border-zinc-700/80 focus:bg-white dark:focus:bg-zinc-950 focus:ring-2 focus:ring-[#0e1738]/15"
              }`}
            />
            {errors.name && (
              <p className="flex items-center gap-1.5 text-[11px] font-bold text-rose-600 dark:text-rose-400 mt-1 animate-in fade-in">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.name}</span>
              </p>
            )}
          </div>

          {/* Instansi Penyelenggara */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-zinc-200 flex items-center gap-1.5">
              <Building2 size={13} className="text-slate-400" />
              <span>
                Instansi / Lembaga Penyelenggara{" "}
                <span className="text-rose-500">*</span>
              </span>
            </label>
            <input
              type="text"
              value={organizer}
              onBlur={() => handleBlur("organizer", organizer)}
              onChange={(e) =>
                handleChange("organizer", e.target.value, setOrganizer)
              }
              placeholder="Contoh: Divisi Pengembangan SDM / Panitia Pelaksana"
              className={`w-full bg-slate-50/60 dark:bg-zinc-950 border rounded-xl px-3.5 py-2.5 font-medium text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:outline-none transition-all ${
                errors.organizer
                  ? "border-rose-500 bg-rose-50/20 ring-2 ring-rose-500/20"
                  : "border-slate-200 dark:border-zinc-700/80 focus:bg-white dark:focus:bg-zinc-950 focus:ring-2 focus:ring-[#0e1738]/15"
              }`}
            />
            {errors.organizer && (
              <p className="flex items-center gap-1.5 text-[11px] font-bold text-rose-600 dark:text-rose-400 mt-1 animate-in fade-in">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.organizer}</span>
              </p>
            )}
          </div>

          {/* Tanggal Acara & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-zinc-200 flex items-center gap-1.5">
                <CalendarDays size={13} className="text-slate-400" />
                <span>
                  Tanggal Pelaksanaan <span className="text-rose-500">*</span>
                </span>
              </label>
              <input
                type="date"
                value={eventDate}
                onBlur={() => handleBlur("eventDate", eventDate)}
                onChange={(e) =>
                  handleChange("eventDate", e.target.value, setEventDate)
                }
                className={`w-full bg-slate-50/60 dark:bg-zinc-950 border rounded-xl px-3.5 py-2.5 font-medium text-slate-800 dark:text-zinc-100 focus:outline-none transition-all cursor-pointer ${
                  errors.eventDate
                    ? "border-rose-500 bg-rose-50/20 ring-2 ring-rose-500/20"
                    : "border-slate-200 dark:border-zinc-700/80 focus:bg-white dark:focus:bg-zinc-950 focus:ring-2 focus:ring-[#0e1738]/15"
                }`}
              />
              {errors.eventDate && (
                <p className="flex items-center gap-1.5 text-[11px] font-bold text-rose-600 dark:text-rose-400 mt-1 animate-in fade-in">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.eventDate}</span>
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-zinc-200 block">
                Status Kegiatan
              </label>
              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as "draft" | "ongoing" | "completed")
                }
                className="w-full bg-slate-50/60 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700/80 rounded-xl px-3.5 py-2.5 font-medium text-slate-800 dark:text-zinc-100 focus:outline-none focus:bg-white dark:focus:bg-zinc-950 focus:ring-2 focus:ring-[#0e1738]/15 dark:focus:ring-zinc-400/20 transition-all cursor-pointer"
              >
                <option value="ongoing">Berlangsung</option>
                <option value="completed">Selesai</option>
                <option value="draft">Draf (Konsep)</option>
              </select>
            </div>
          </div>

          {/* Lokasi Pelaksanaan */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-zinc-200 flex items-center gap-1.5">
              <MapPin size={13} className="text-slate-400" />
              <span>Lokasi Pelaksanaan</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Contoh: Gedung Serbaguna / Daring (Platform Video Konferensi)"
              className="w-full bg-slate-50/60 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700/80 rounded-xl px-3.5 py-2.5 font-medium text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:outline-none focus:bg-white dark:focus:bg-zinc-950 focus:ring-2 focus:ring-[#0e1738]/15 dark:focus:ring-zinc-400/20 transition-all"
            />
          </div>

          {/* Deskripsi */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-zinc-200 flex items-center gap-1.5">
              <FileText size={13} className="text-slate-400" />
              <span>Deskripsi Singkat</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan ringkasan materi, tujuan kegiatan, atau catatan sertifikasi..."
              className="w-full bg-slate-50/60 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700/80 rounded-xl p-3.5 font-medium text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:outline-none focus:bg-white dark:focus:bg-zinc-950 focus:ring-2 focus:ring-[#0e1738]/15 dark:focus:ring-zinc-400/20 leading-relaxed transition-all resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-zinc-800">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700/80 text-slate-600 dark:text-zinc-300 font-semibold hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0e1738] dark:bg-zinc-100 text-white dark:text-[#0e1738] font-bold hover:bg-[#1a254d] dark:hover:bg-white transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-50"
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
