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
  Users,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

const quickStats = [
  {
    id: "active-certs",
    label: "total sertifikat aktif",
    value: "3.420",
    change: "+12% minggu ini",
    icon: Award,
    color: "text-[#0e1738] dark:text-sky-400",
  },
  {
    id: "verified-docs",
    label: "pemeriksaan berkas lolos",
    value: "14.890",
    change: "akurasi 100%",
    icon: FileCheck2,
    color: "text-emerald-600 dark:text-emerald-400",
  },
  {
    id: "registered-orgs",
    label: "penyelenggara terdaftar",
    value: "84 instansi",
    change: "aktif",
    icon: Users,
    color: "text-sky-600 dark:text-sky-400",
  },
  {
    id: "revoked-docs",
    label: "dokumen dicabut (revoked)",
    value: "6 lembar",
    change: "audit trail",
    icon: AlertTriangle,
    color: "text-amber-600 dark:text-amber-400",
  },
];

export default function AdminDashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#faf8f5] dark:bg-zinc-950 font-sans antialiased">
      {/* 1. Sidebar Responsif (Di monitor 2xl melebar dari w-64 ke w-72) */}
      <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* 2. Workspace Kanan */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <AdminTopNav onOpenSidebar={() => setIsSidebarOpen(true)} />

        {/* Kontainer Fluid dengan Skala Otomatis untuk Monitor */}
        <main className="flex-1 p-4 sm:p-6 2xl:p-10 w-full space-y-4 sm:space-y-6 2xl:space-y-8">
          {/* Welcome Header */}
          <AdminWelcomeHeader adminName="sakib" />

          {/* Kartu Ringkasan Metrik (Padded & Scaled di Monitor) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 2xl:gap-6">
            {quickStats.map((stat) => {
              const Icon = stat.icon;

              return (
                <motion.div
                  key={stat.id}
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 p-4 2xl:p-6 rounded-2xl 2xl:rounded-3xl shadow-xs flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] 2xl:text-xs font-bold text-slate-400 dark:text-zinc-500 lowercase tracking-wide">
                      {stat.label}
                    </span>
                    <div className="p-2 2xl:p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/80">
                      <Icon
                        className={`w-4 h-4 2xl:w-5 2xl:h-5 ${stat.color}`}
                      />
                    </div>
                  </div>

                  <div className="mt-3 2xl:mt-5 flex items-baseline justify-between">
                    <div>
                      <div className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight text-[#0e1738] dark:text-zinc-50">
                        {stat.value}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] 2xl:text-xs text-slate-500 dark:text-zinc-400 font-mono mt-1">
                        <TrendingUp className="w-3 h-3 2xl:w-4 2xl:h-4 text-emerald-500" />
                        <span>{stat.change}</span>
                      </div>
                    </div>

                    <span className="text-[10px] 2xl:text-xs font-mono text-slate-400 dark:text-zinc-600">
                      DETAIL →
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Grid Dua Kolom (Log Audit & Antrean Tugas) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 2xl:gap-6 items-stretch pb-10">
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
