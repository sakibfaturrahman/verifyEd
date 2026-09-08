// src/app/(dashboard)/admin/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AdminSidebar } from "@/components/layouts/admin/admin-sidebar";
import { AdminTopNav } from "@/components/layouts/admin/admin-topnav";
import { AdminWelcomeHeader } from "@/features/dashboard/components/admin-welcome-header";
import { AdminNotificationsBox } from "@/features/dashboard/components/admin-notifications-box";
import { AdminAssignmentsBox } from "@/features/dashboard/components/admin-assignments-box";
import {
  Award,
  FileCheck2,
  Building2,
  CalendarDays,
  AlertTriangle,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

const quickStats = [
  {
    id: "total-orgs",
    label: "Organisasi Terdaftar",
    value: "84",
    unit: "Mitra",
    change: "+4 Institusi Baru",
    icon: Building2,
    color: "text-sky-600 dark:text-sky-400",
    badgeColor: "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300",
  },
  {
    id: "total-events",
    label: "Total Agenda Acara",
    value: "192",
    unit: "Kegiatan",
    change: "12 Sedang Berjalan",
    icon: CalendarDays,
    color: "text-indigo-600 dark:text-indigo-400",
    badgeColor:
      "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300",
  },
  {
    id: "active-certs",
    label: "Sertifikat Aktif",
    value: "3.420",
    unit: "Dokumen",
    change: "+12% Minggu Ini",
    icon: ShieldCheck,
    color: "text-emerald-600 dark:text-emerald-400",
    badgeColor:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
  },
  {
    id: "verified-logs",
    label: "Validasi Lolos Uji",
    value: "14.890",
    unit: "Pemeriksaan",
    change: "Akurasi 100%",
    icon: FileCheck2,
    color: "text-[#0e1738] dark:text-slate-100",
    badgeColor:
      "bg-slate-100 text-slate-800 dark:bg-zinc-800 dark:text-zinc-200",
  },
  {
    id: "revoked-certs",
    label: "Dokumen Dicabut",
    value: "6",
    unit: "Berkas",
    change: "Audit Status Revoked",
    icon: AlertTriangle,
    color: "text-rose-600 dark:text-rose-400",
    badgeColor:
      "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",
  },
  {
    id: "overall-issuance",
    label: "Total Penerbitan",
    value: "3.426",
    unit: "Lembar",
    change: "Ledger Sinkron",
    icon: Award,
    color: "text-amber-600 dark:text-amber-400",
    badgeColor:
      "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  },
];

export default function AdminDashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#faf8f5] dark:bg-zinc-950 font-sans antialiased selection:bg-[#0e1738] selection:text-white">
      {/* 1. Sidebar Navigasi */}
      <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* 2. Workspace Kanan (Fluid & Scaled) */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <AdminTopNav onOpenSidebar={() => setIsSidebarOpen(true)} />

        {/* Kontainer Utama Adaptif */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 2xl:p-10 w-full max-w-[1720px] mx-auto space-y-5 2xl:space-y-7">
          {/* Welcome Header Formal */}
          <AdminWelcomeHeader
            adminName="Sakib Faturrahman"
            roleTitle="Super Administrator & Pengawas Integritas"
          />

          {/* Grid Metrik Eksekutif (6 Kartu Terstruktur Sesuai Schema Docs) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-3.5 2xl:gap-5">
            {quickStats.map((stat) => {
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
                      <Icon
                        className={`w-4 h-4 2xl:w-5 2xl:h-5 ${stat.color}`}
                      />
                    </div>
                  </div>

                  <div className="mt-3 2xl:mt-4">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl 2xl:text-3xl font-extrabold tracking-tight text-[#0e1738] dark:text-zinc-50">
                        {stat.value}
                      </span>
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

          {/* Grid Interaktif Bawah: Log Audit & Antrean Tugas */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 2xl:gap-7 items-stretch pb-10">
            <div className="lg:col-span-6 flex flex-col">
              <AdminNotificationsBox />
            </div>
            <div className="lg:col-span-6 flex flex-col">
              <AdminAssignmentsBox />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
