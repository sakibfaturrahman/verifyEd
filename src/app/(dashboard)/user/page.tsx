// src/app/(dashboard)/dashboard/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { AppSidebar } from "@/components/layouts/dashboard/app-sidebar";
import { AppTopNav } from "@/components/layouts/dashboard/app-topnav";
import { UserWelcomeHeader } from "@/features/dashboard/components/user/user-welcome-header";
import { useAuthStore } from "@/stores/auth-store";
import {
  CalendarDays,
  Award,
  CheckCircle2,
  ShieldAlert,
  ScanLine,
  ArrowUpRight,
  Clock,
  Plus,
} from "lucide-react";

// Mock Metrik User (Total Event, Total Certificate, Active, Revoked, Total Verification)
const userMetrics = [
  {
    label: "Total Agenda Event",
    value: "6",
    desc: "Acara aktif & selesai",
    icon: CalendarDays,
    color: "text-sky-600 dark:text-sky-400",
  },
  {
    label: "Total Sertifikat Terbit",
    value: "150",
    desc: "Telah diberi barcode resmi",
    icon: Award,
    color: "text-[#0e1738] dark:text-zinc-100",
  },
  {
    label: "Sertifikat Sah (Aktif)",
    value: "148",
    desc: "Lolos verifikasi",
    icon: CheckCircle2,
    color: "text-emerald-600 dark:text-emerald-400",
  },
  {
    label: "Sertifikat Dicabut",
    value: "2",
    desc: "Status dibatalkan",
    icon: ShieldAlert,
    color: "text-rose-600 dark:text-rose-400",
  },
  {
    label: "Total Scan Verifikasi",
    value: "840",
    desc: "Pengecekan oleh publik",
    icon: ScanLine,
    color: "text-indigo-600 dark:text-indigo-400",
  },
];

const recentEvents = [
  {
    id: "evt-1",
    name: "National Tech Hackathon 2026",
    date: "01 Sep 2026",
    certificates: 100,
    status: "Selesai",
  },
  {
    id: "evt-2",
    name: "Workshop Desain UI/UX & Design System",
    date: "15 Sep 2026",
    certificates: 50,
    status: "Berlangsung",
  },
];

export default function UserDashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex min-h-screen bg-[#faf8f5] dark:bg-zinc-950 font-sans antialiased">
      {/* 1. Unified Sidebar */}
      <AppSidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        roleOverride="user"
      />

      {/* 2. Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <AppTopNav
          onOpenSidebar={() => setIsSidebarOpen(true)}
          roleOverride="user"
        />

        <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 xl:px-10 2xl:px-12 w-full max-w-[1680px] mx-auto space-y-4 sm:space-y-5">
          {/* Welcome Banner Dinamis dari Akun Login */}
          <UserWelcomeHeader
            organizationName={user?.name || "Lembaga Terdaftar"}
            representativeName={user?.name?.split(" ")[0] || "Penyelenggara"}
          />

          {/* Kartu Metrik Ringkasan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
            {userMetrics.map((metric, idx) => {
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
                    <div className="text-xl sm:text-2xl font-black text-[#0e1738] dark:text-zinc-50">
                      {metric.value}
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium mt-0.5">
                      {metric.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Grid Dua Kolom: Agenda Acara Terkini & Panduan Alur */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch pb-6">
            {/* Kolom Kiri: Agenda Acara Terbaru */}
            <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
                <span className="text-sm font-bold text-[#0e1738] dark:text-zinc-100">
                  Agenda Acara Anda
                </span>
                <Link
                  href="/user/events"
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1"
                >
                  <span>Lihat Semua</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-3 flex-1">
                {recentEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-4 rounded-2xl border border-slate-200/80 dark:border-zinc-800 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-zinc-800/40 transition-colors"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-[#0e1738] dark:text-zinc-100">
                        {evt.name}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium mt-1">
                        <Clock size={12} />
                        <span>{evt.date}</span>
                        <span>•</span>
                        <span>{evt.certificates} Sertifikat</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {evt.status}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                href="/user/events/new"
                className="w-full py-3 border border-dashed border-slate-300 dark:border-zinc-700 rounded-2xl text-xs text-slate-500 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-1.5 font-semibold"
              >
                <Plus size={14} /> Tambah Agenda Acara Baru
              </Link>
            </div>

            {/* Kolom Kanan: Panduan Alur Penerbitan */}
            <div className="lg:col-span-5 bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4">
              <div className="pb-2 border-b border-slate-100 dark:border-zinc-800">
                <span className="text-sm font-bold text-[#0e1738] dark:text-zinc-100">
                  Alur Mudah Penerbitan Dokumen
                </span>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-zinc-800 text-[#0e1738] dark:text-zinc-200 flex items-center justify-center font-bold shrink-0 text-[11px]">
                    1
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800 dark:text-zinc-200">
                      Tentukan Agenda Acara
                    </h5>
                    <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                      Kelompokkan sertifikat berdasarkan kegiatan resmi
                      pelatihan atau seminar Anda.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-zinc-800 text-[#0e1738] dark:text-zinc-200 flex items-center justify-center font-bold shrink-0 text-[11px]">
                    2
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800 dark:text-zinc-200">
                      Unggah File PDF
                    </h5>
                    <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                      Unggah berkas sertifikat satu per satu atau langsung
                      sekaligus banyak (bulk upload).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-zinc-800 text-[#0e1738] dark:text-zinc-200 flex items-center justify-center font-bold shrink-0 text-[11px]">
                    3
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800 dark:text-zinc-200">
                      Atur Posisi Barcode
                    </h5>
                    <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                      Geser dan posisikan kode QR verifikasi langsung pada
                      lembar sertifikat.
                    </p>
                  </div>
                </div>
              </div>

              <Link
                href="/user/certificates/upload"
                className="w-full py-3 rounded-2xl bg-[#122253] hover:bg-[#0e1738] text-white text-xs font-semibold text-center shadow-xs transition-colors"
              >
                Mulai Terbitkan Sertifikat
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
