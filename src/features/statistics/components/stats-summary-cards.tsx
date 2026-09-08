// src/features/statistics/components/stats-summary-cards.tsx
"use client";

import { Users, CalendarDays, Award, CheckCircle2, ShieldAlert, ScanLine } from "lucide-react";
import { PlatformMetrics } from "../types/stats.types";

interface StatsSummaryCardsProps {
  metrics: PlatformMetrics;
}

export function StatsSummaryCards({ metrics }: StatsSummaryCardsProps) {
  const cards = [
    {
      label: "Total Organisasi / User",
      value: metrics.totalUsers.toLocaleString(),
      desc: "Mitra penerbit aktif",
      icon: Users,
      color: "text-indigo-600 dark:text-indigo-400",
    },
    {
      label: "Total Agenda & Event",
      value: metrics.totalEvents.toLocaleString(),
      desc: "Terkumpul di sistem",
      icon: CalendarDays,
      color: "text-sky-600 dark:text-sky-400",
    },
    {
      label: "Total Sertifikat Terbit",
      value: metrics.totalCertificates.toLocaleString(),
      desc: "Tersegel SHA-256",
      icon: Award,
      color: "text-[#0e1738] dark:text-zinc-100",
    },
    {
      label: "Total Scan & Verifikasi",
      value: metrics.totalVerifications.toLocaleString(),
      desc: "Permintaan validasi publik",
      icon: ScanLine,
      color: "text-violet-600 dark:text-violet-400",
    },
    {
      label: "Sertifikat Aktif (Sah)",
      value: metrics.activeCertificates.toLocaleString(),
      desc: "Lolos uji integritas",
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Sertifikat Dicabut (Revoked)",
      value: metrics.revokedCertificates.toLocaleString(),
      desc: "Akses dibatalkan",
      icon: ShieldAlert,
      color: "text-rose-600 dark:text-rose-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 p-4 rounded-2xl shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 line-clamp-1">
                {card.label}
              </span>
              <Icon size={16} className={card.color} />
            </div>
            <div className="mt-2.5">
              <div className="text-xl sm:text-2xl font-black text-[#0e1738] dark:text-zinc-50">
                {card.value}
              </div>
              <p className="text-[10px] text-slate-500 dark:text-zinc-400 font-medium mt-0.5">
                {card.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}