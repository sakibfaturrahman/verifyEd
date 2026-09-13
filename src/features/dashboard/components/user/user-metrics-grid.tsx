// src/features/dashboard/components/user/user-metrics-grid.tsx
"use client";

import {
  CalendarDays,
  Award,
  CheckCircle2,
  ShieldAlert,
  ScanLine,
} from "lucide-react";
import { UserStats } from "../../hooks/use-user-dashboard";

interface UserMetricsGridProps {
  stats?: UserStats;
  isPending: boolean;
}

export function UserMetricsGrid({ stats, isPending }: UserMetricsGridProps) {
  const metrics = [
    {
      label: "Total Agenda Event",
      value: stats ? stats.totalEvents.toLocaleString("id-ID") : "0",
      desc: "Acara aktif & selesai",
      icon: CalendarDays,
      color: "text-sky-600 dark:text-sky-400",
    },
    {
      label: "Total Sertifikat Terbit",
      value: stats ? stats.totalCertificates.toLocaleString("id-ID") : "0",
      desc: "Telah diberi barcode resmi",
      icon: Award,
      color: "text-[#0e1738] dark:text-zinc-100",
    },
    {
      label: "Sertifikat Sah (Aktif)",
      value: stats ? stats.activeCertificates.toLocaleString("id-ID") : "0",
      desc: "Lolos uji keabsahan",
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Sertifikat Dicabut",
      value: stats ? stats.revokedCertificates.toLocaleString("id-ID") : "0",
      desc: "Status dibatalkan",
      icon: ShieldAlert,
      color: "text-rose-600 dark:text-rose-400",
    },
    {
      label: "Total Scan Verifikasi",
      value: stats ? stats.totalVerifications.toLocaleString("id-ID") : "0",
      desc: "Pengecekan oleh publik",
      icon: ScanLine,
      color: "text-indigo-600 dark:text-indigo-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
      {metrics.map((metric, idx) => {
        const Icon = metric.icon;
        return (
          <div
            key={idx}
            className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 p-4 sm:p-5 rounded-2xl shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500">
                {metric.label}
              </span>
              <Icon size={16} className={metric.color} />
            </div>
            <div className="mt-3">
              {isPending ? (
                <div className="h-7 w-16 bg-slate-100 dark:bg-zinc-800 animate-pulse rounded-md" />
              ) : (
                <div className="text-xl sm:text-2xl font-black text-[#0e1738] dark:text-zinc-50">
                  {metric.value}
                </div>
              )}
              <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium mt-0.5">
                {metric.desc}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
