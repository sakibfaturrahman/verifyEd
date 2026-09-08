// src/features/users/components/user-detail-modal.tsx
"use client";

import Link from "next/link";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  CalendarDays,
  X,
  ExternalLink,
  ShieldCheck,
  Power,
} from "lucide-react";
import { UserOrganizationItem } from "../types/user.types";

interface UserDetailModalProps {
  user: UserOrganizationItem | null;
  onClose: () => void;
  onToggleStatus: (userId: string) => void;
}

export function UserDetailModal({
  user,
  onClose,
  onToggleStatus,
}: UserDetailModalProps) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#0e1738] text-white flex items-center justify-center font-bold text-xs">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0e1738] dark:text-zinc-100 leading-tight">
                {user.name}
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">
                {user.role === "admin"
                  ? "Super Administrator"
                  : "Penyelenggara Terverifikasi"}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Informasi Kontak & Detail */}
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

          {/* Stat Mini Kartu */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-slate-50 dark:bg-zinc-800/60 p-3 rounded-xl border border-slate-200 dark:border-zinc-700">
              <span className="text-slate-400 text-[11px]">Total Agenda</span>
              <div className="text-base font-bold text-[#0e1738] dark:text-zinc-100 mt-0.5 flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4 text-slate-400" />
                <span>{user.totalEvents} Event</span>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-zinc-800/60 p-3 rounded-xl border border-slate-200 dark:border-zinc-700">
              <span className="text-slate-400 text-[11px]">
                Sertifikat Diterbitkan
              </span>
              <div className="text-base font-bold text-[#0e1738] dark:text-zinc-100 mt-0.5 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-slate-400" />
                <span>{user.totalCertificates} Dokumen</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls Modal */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => onToggleStatus(user.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
              user.status === "active"
                ? "border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900/60 dark:hover:bg-rose-950/40"
                : "border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-900/60 dark:hover:bg-emerald-950/40"
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>
              {user.status === "active" ? "Bekukan Akun" : "Aktifkan Akun"}
            </span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs font-semibold text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
            >
              Tutup
            </button>
            <Link
              href={`/admin/events?user=${user.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0e1738] dark:bg-zinc-100 text-white dark:text-[#0e1738] text-xs font-semibold hover:bg-[#1a254d] transition-colors"
            >
              <span>Semua Agenda</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
