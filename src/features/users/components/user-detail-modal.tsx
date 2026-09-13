// src/features/users/components/user-detail-modal.tsx
"use client";

import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  X,
  ExternalLink,
  Power,
  Loader2,
  CalendarDays,
} from "lucide-react";
import { UserProfileRow } from "../hooks/use-admin-users";

interface UserDetailModalProps {
  user: UserProfileRow | null;
  onClose: () => void;
  onToggleStatus: (
    userId: string,
    currentStatus: "active" | "inactive",
  ) => void;
  isStatusUpdating: boolean;
}

export function UserDetailModal({
  user,
  onClose,
  onToggleStatus,
  isStatusUpdating,
}: UserDetailModalProps) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0e1738] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0e1738] dark:text-zinc-100 leading-tight">
                {user.name}
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">
                {user.role === "admin"
                  ? "Super Administrator"
                  : "Mitra Penyelenggara / User"}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Info Detail */}
        <div className="space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-slate-400 font-medium">Email Resmi</span>
              <p className="font-semibold text-slate-800 dark:text-zinc-200 mt-0.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{user.email}</span>
              </p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Kontak Telepon</span>
              <p className="font-semibold text-slate-800 dark:text-zinc-200 mt-0.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{user.phone || "-"}</span>
              </p>
            </div>
          </div>

          <div>
            <span className="text-slate-400 font-medium">Alamat Domisili</span>
            <p className="font-semibold text-slate-800 dark:text-zinc-200 mt-0.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{user.address || "Belum diatur"}</span>
            </p>
          </div>

          <div>
            <span className="text-slate-400 font-medium">Profil Instansi</span>
            <p className="text-slate-600 dark:text-zinc-300 mt-1 leading-relaxed bg-slate-50 dark:bg-zinc-800/50 p-3 rounded-xl border border-slate-100 dark:border-zinc-800">
              {user.description || "Tidak ada deskripsi profil tambahan."}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-700/60 flex items-center justify-between">
            <div>
              <span className="text-slate-400 text-[11px] font-medium block">
                Terdaftar Sejak
              </span>
              <span className="font-mono font-bold text-slate-700 dark:text-zinc-200 text-xs mt-0.5 block">
                {new Date(user.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold">
              <span className="text-slate-400">Status:</span>
              <span
                className={
                  user.status === "active"
                    ? "text-emerald-600"
                    : "text-rose-600"
                }
              >
                {user.status === "active" ? "Aktif" : "Nonaktif"}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Tombol Aksi */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-zinc-800">
          <button
            type="button"
            disabled={isStatusUpdating}
            onClick={() => onToggleStatus(user.id, user.status)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer disabled:opacity-50 ${
              user.status === "active"
                ? "border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900/60 dark:hover:bg-rose-950/40"
                : "border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-900/60 dark:hover:bg-emerald-950/40"
            }`}
          >
            {isStatusUpdating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Power className="w-3.5 h-3.5" />
            )}
            <span>
              {user.status === "active" ? "Bekukan Akun" : "Aktifkan Akun"}
            </span>
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
              href={`/admin/events?user=${user.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0e1738] dark:bg-zinc-100 text-white dark:text-[#0e1738] text-xs font-semibold hover:bg-[#1a254d] transition-colors"
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Lihat Agenda</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
