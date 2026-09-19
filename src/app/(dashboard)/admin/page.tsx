"use client";

import { motion } from "framer-motion";
import { AdminWelcomeHeader } from "@/features/dashboard/components/admin/admin-welcome-header";
import { AdminNotificationsBox } from "@/features/dashboard/components/admin/admin-notifications-box";
import { AdminAssignmentsBox } from "@/features/dashboard/components/admin/admin-assignments-box";
import { useAdminDashboardQuery } from "@/features/dashboard/hooks/use-dashboard-queries";
import {
  Award,
  FileCheck2,
  Building2,
  CalendarDays,
  AlertTriangle,
  ShieldCheck,
  TrendingUp,
  RefreshCw,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { data, isPending, isRefetching, refetch } = useAdminDashboardQuery();

  const stats = data?.stats;

  const metricCards = [
    {
      id: "total-orgs",
      label: "Organisasi Terdaftar",
      value: stats ? stats.totalOrganizations.toLocaleString("id-ID") : "...",
      unit: "Mitra",
      change: "Status Terverifikasi",
      icon: Building2,
      color: "text-sky-600 dark:text-sky-400",
    },
    {
      id: "total-events",
      label: "Total Agenda Acara",
      value: stats ? stats.totalEvents.toLocaleString("id-ID") : "...",
      unit: "Kegiatan",
      change: "Seluruh Periode",
      icon: CalendarDays,
      color: "text-indigo-600 dark:text-indigo-400",
    },
    {
      id: "active-certs",
      label: "Sertifikat Aktif",
      value: stats ? stats.activeCertificates.toLocaleString("id-ID") : "...",
      unit: "Dokumen",
      change: "Keabsahan Terjamin",
      icon: ShieldCheck,
      color: "text-emerald-600 dark:text-emerald-400",
    },
    {
      id: "verified-logs",
      label: "Validasi Lolos Uji",
      value: stats ? stats.totalVerifications.toLocaleString("id-ID") : "...",
      unit: "Pemeriksaan",
      change: "Akurasi Kriptografi 100%",
      icon: FileCheck2,
      color: "text-[#0e1738] dark:text-slate-100",
    },
    {
      id: "revoked-certs",
      label: "Dokumen Dicabut",
      value: stats ? stats.revokedCertificates.toLocaleString("id-ID") : "...",
      unit: "Berkas",
      change: "Status Revoked",
      icon: AlertTriangle,
      color: "text-rose-600 dark:text-rose-400",
    },
    {
      id: "overall-issuance",
      label: "Total Penerbitan",
      value: stats ? stats.totalIssued.toLocaleString("id-ID") : "...",
      unit: "Lembar",
      change: "Ledger Database Sinkron",
      icon: Award,
      color: "text-amber-600 dark:text-amber-400",
    },
  ];

  return (
    <div className="space-y-5 2xl:space-y-7">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <AdminWelcomeHeader />
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isRefetching}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 transition-all shadow-2xs cursor-pointer active:scale-95"
        >
          <RefreshCw
            size={13}
            className={
              isRefetching ? "animate-spin text-indigo-600" : "text-slate-400"
            }
          />
          <span>{isRefetching ? "Menyinkronkan..." : "Perbarui Data"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-3.5 2xl:gap-5">
        {metricCards.map((stat) => {
          const Icon = stat.icon;

          return (
            <motion.div
              key={stat.id}
              whileHover={{ y: -3 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 p-4 2xl:p-5 rounded-2xl 2xl:rounded-3xl shadow-xs flex flex-col justify-between group transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs 2xl:text-sm font-semibold text-slate-500 dark:text-zinc-400">
                  {stat.label}
                </span>
                <div className="p-2 2xl:p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/80 group-hover:scale-105 transition-transform">
                  <Icon className={`w-4 h-4 2xl:w-5 2xl:h-5 ${stat.color}`} />
                </div>
              </div>

              <div className="mt-3 2xl:mt-4">
                <div className="flex items-baseline gap-1.5">
                  {isPending ? (
                    <div className="h-8 w-16 bg-slate-100 dark:bg-zinc-800 animate-pulse rounded-md" />
                  ) : (
                    <span className="text-2xl 2xl:text-3xl font-extrabold tracking-tight text-[#0e1738] dark:text-zinc-50">
                      {stat.value}
                    </span>
                  )}
                  <span className="text-[11px] 2xl:text-xs font-semibold text-slate-400 dark:text-zinc-500">
                    {stat.unit}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] 2xl:text-xs text-slate-500 dark:text-zinc-400 font-mono mt-1.5 pt-2 border-t border-slate-100 dark:border-zinc-800/80">
                  <TrendingUp className="w-3 h-3 2xl:w-3.5 2xl:h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="truncate">{stat.change}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 2xl:gap-7 items-stretch pb-10">
        <div className="lg:col-span-6 flex flex-col">
          <AdminNotificationsBox />
        </div>
        <div className="lg:col-span-6 flex flex-col">
          <AdminAssignmentsBox />
        </div>
      </div>
    </div>
  );
}
