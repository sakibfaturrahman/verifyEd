"use client";

import {
  FileWarning,
  ShieldAlert,
  Layers,
  UserPlus,
  CheckCircle2,
  Clock,
  Check,
  Globe,
  Hash,
} from "lucide-react";
import { AppNotification } from "@/types/notification";

interface NotificationItemProps {
  notification: AppNotification;
  onMarkAsRead: (id: string) => void;
  isPending: boolean;
}

function formatRelativeTime(dateString: string): string {
  const diffInSeconds = Math.floor(
    (Date.now() - new Date(dateString).getTime()) / 1000,
  );
  if (diffInSeconds < 60) return "Baru saja";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} menit lalu`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} jam lalu`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} hari lalu`;
}

export function NotificationItem({
  notification,
  onMarkAsRead,
  isPending,
}: NotificationItemProps) {
  const { id, title, message, severity, type, is_read, created_at, metadata } =
    notification;

  const getIcon = () => {
    if (severity === "high" || type === "tampered_document") {
      return (
        <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/40">
          <FileWarning className="w-5 h-5" />
        </div>
      );
    }
    if (type === "suspicious_activity" || type === "revoked_access") {
      return (
        <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/40">
          <ShieldAlert className="w-5 h-5" />
        </div>
      );
    }
    if (type === "bulk_issuance" || type === "bulk_revoke") {
      return (
        <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-900/40">
          <Layers className="w-5 h-5" />
        </div>
      );
    }
    if (type === "new_registration") {
      return (
        <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/40">
          <UserPlus className="w-5 h-5" />
        </div>
      );
    }
    return (
      <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
        <CheckCircle2 className="w-5 h-5" />
      </div>
    );
  };

  const getSeverityBadge = () => {
    switch (severity) {
      case "high":
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50">
            Prioritas Tinggi
          </span>
        );
      case "medium":
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50">
            Peringatan
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700">
            Informasi
          </span>
        );
    }
  };

  return (
    <div
      className={`p-4 sm:p-5 rounded-2xl border transition-all duration-150 flex flex-col sm:flex-row items-start justify-between gap-4 ${
        !is_read
          ? "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 shadow-sm ring-1 ring-slate-100 dark:ring-zinc-800/80"
          : "bg-slate-50/50 dark:bg-zinc-950/40 border-slate-200/60 dark:border-zinc-850 opacity-75"
      }`}
    >
      <div className="flex items-start gap-3.5 flex-1 min-w-0">
        {getIcon()}
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-sm text-[#0e1738] dark:text-zinc-100">
              {title}
            </span>
            {getSeverityBadge()}
            {!is_read && (
              <span className="w-2 h-2 rounded-full bg-indigo-600 ring-4 ring-indigo-50 dark:ring-indigo-950/40" />
            )}
          </div>
          <p className="text-xs sm:text-[13px] text-slate-600 dark:text-zinc-400 leading-relaxed break-words">
            {message}
          </p>

          {metadata && Object.keys(metadata).length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500 dark:text-zinc-400 font-medium">
              {Boolean(metadata.ip) && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800">
                  <Globe className="w-3 h-3 text-slate-400" />
                  IP: {String(metadata.ip)}
                </span>
              )}
              {Boolean(metadata.certificateNumber) && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800">
                  <Hash className="w-3 h-3 text-slate-400" />
                  No: {String(metadata.certificateNumber)}
                </span>
              )}
            </div>
          )}

          <div className="flex items-center gap-1.5 pt-1 text-[11px] text-slate-400 font-medium">
            <Clock className="w-3 h-3" />
            <span>{formatRelativeTime(created_at)}</span>
          </div>
        </div>
      </div>

      {!is_read && (
        <button
          type="button"
          onClick={() => onMarkAsRead(id)}
          disabled={isPending}
          className="self-end sm:self-center inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-700/80 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
        >
          <Check className="w-3.5 h-3.5 text-emerald-600" />
          <span>Tandai Dibaca</span>
        </button>
      )}
    </div>
  );
}
