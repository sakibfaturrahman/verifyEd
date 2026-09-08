// src/app/(dashboard)/admin/statistics/page.tsx
"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { AdminSidebar } from "@/components/layouts/admin/admin-sidebar";
import { AdminTopNav } from "@/components/layouts/admin/admin-topnav";
import { StatsSummaryCards } from "@/features/statistics/components/stats-summary-cards";
import { AuditLogToolbar } from "@/features/statistics/components/audit-log-toolbar";
import { VerificationLogItem, PlatformMetrics } from "@/features/statistics/types/stats.types";
import { CheckCircle2, XCircle, AlertTriangle, QrCode, FileCheck2, Hash } from "lucide-react";

const initialMetrics: PlatformMetrics = {
  totalUsers: 84,
  totalEvents: 42,
  totalCertificates: 3420,
  totalVerifications: 14890,
  activeCertificates: 3414,
  revokedCertificates: 6,
};

const initialLogs: VerificationLogItem[] = [
  {
    id: "log-101",
    certificateId: "cert-001",
    certificateNumber: "CERT-20260901-A1B2C3D4",
    recipientName: "Aditya Pratama",
    eventName: "National Tech Hackathon 2026",
    method: "qr",
    result: "verified",
    createdAt: "2026-09-08 14:32 WIB",
    ipAddress: "180.252.164.22",
  },
  {
    id: "log-102",
    certificateId: "cert-003",
    certificateNumber: "CERT-20260828-I9J0K1L2",
    recipientName: "Bambang Pamungkas",
    eventName: "Web Development Bootcamp",
    method: "certificate_id",
    result: "revoked",
    createdAt: "2026-09-08 13:10 WIB",
    ipAddress: "114.122.45.89",
  },
  {
    id: "log-103",
    certificateId: "unknown",
    certificateNumber: "CERT-20260000-INVALID",
    recipientName: "-",
    eventName: "-",
    method: "pdf",
    result: "not_found",
    createdAt: "2026-09-08 11:20 WIB",
    ipAddress: "36.72.210.104",
  },
  {
    id: "log-104",
    certificateId: "cert-002",
    certificateNumber: "CERT-20260902-E5F6G7H8",
    recipientName: "Siti Nurhaliza",
    eventName: "AI & Cloud Summit 2026",
    method: "qr",
    result: "verified",
    createdAt: "2026-09-08 09:45 WIB",
    ipAddress: "103.28.12.5",
  },
];

export default function AdminStatisticsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [metrics] = useState<PlatformMetrics>(initialMetrics);
  const [logs] = useState<VerificationLogItem[]>(initialLogs);
  const [searchQuery, setSearchQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState<"all" | "qr" | "pdf" | "certificate_id">("all");
  const [resultFilter, setResultFilter] = useState<"all" | "verified" | "revoked" | "not_found">("all");

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchQuery =
        log.certificateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.eventName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchMethod = methodFilter === "all" || log.method === methodFilter;
      const matchResult = resultFilter === "all" || log.result === resultFilter;
      return matchQuery && matchMethod && matchResult;
    });
  }, [logs, searchQuery, methodFilter, resultFilter]);

  const handleExportLogs = () => {
    toast.success("Ekspor Log Audit", {
      description: "Berkas log audit pemeriksaan kredensial berhasil diunduh.",
    });
  };

  const getMethodPill = (method: VerificationLogItem["method"]) => {
    switch (method) {
      case "qr":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-slate-700 dark:text-zinc-300 bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
            <QrCode className="w-3 h-3 text-indigo-500" />
            <span>QR Token</span>
          </span>
        );
      case "pdf":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-slate-700 dark:text-zinc-300 bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
            <FileCheck2 className="w-3 h-3 text-sky-500" />
            <span>File PDF</span>
          </span>
        );
      case "certificate_id":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-slate-700 dark:text-zinc-300 bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
            <Hash className="w-3 h-3 text-emerald-500" />
            <span>Nomor ID</span>
          </span>
        );
    }
  };

  const getResultBadge = (result: VerificationLogItem["result"]) => {
    switch (result) {
      case "verified":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" />
            <span>Sah (Verified)</span>
          </span>
        );
      case "revoked":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 px-2.5 py-0.5 rounded-full">
            <XCircle className="w-3 h-3" />
            <span>Dicabut (Revoked)</span>
          </span>
        );
      case "not_found":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 px-2.5 py-0.5 rounded-full">
            <AlertTriangle className="w-3 h-3" />
            <span>Tidak Ditemukan</span>
          </span>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#faf8f5] dark:bg-zinc-950 font-sans antialiased">
      <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <AdminTopNav onOpenSidebar={() => setIsSidebarOpen(true)} />

        <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 xl:px-10 2xl:px-12 w-full max-w-[1680px] mx-auto space-y-4 sm:space-y-5">
          {/* Header Title */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-5 shadow-xs">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0e1738] dark:text-zinc-50">
              Statistik Platform & Log Audit Verifikasi
            </h1>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 font-medium">
              Metrik operasional penerbitan sertifikat digital dan rekam jejak pemeriksaan publik secara langsung.
            </p>
          </div>

          {/* 6 Metrik Kartu Ringkasan Dokumen */}
          <StatsSummaryCards metrics={metrics} />

          {/* Toolbar Log */}
          <AuditLogToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            methodFilter={methodFilter}
            onMethodFilterChange={setMethodFilter}
            resultFilter={resultFilter}
            onResultFilterChange={setResultFilter}
            onExportLogs={handleExportLogs}
          />

          {/* Tabel Log Audit */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/30 text-[11px] font-bold text-slate-400 dark:text-zinc-500">
                    <th className="py-3.5 px-4">Waktu Pengecekan</th>
                    <th className="py-3.5 px-4">Nomor Kredensial</th>
                    <th className="py-3.5 px-4">Penerima & Agenda</th>
                    <th className="py-3.5 px-4">Metode Uji</th>
                    <th className="py-3.5 px-4">Hasil Status</th>
                    <th className="py-3.5 px-4 font-mono text-right">Alamat Node IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 text-xs">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                        Tidak ada catatan log audit yang sesuai dengan filter.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => (
                      <tr
                        key={log.id}
                        className="hover:bg-slate-50/70 dark:hover:bg-zinc-800/40 transition-colors"
                      >
                        <td className="py-3.5 px-4 font-mono text-slate-500 dark:text-zinc-400 whitespace-nowrap">
                          {log.createdAt}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-[#0e1738] dark:text-zinc-100">
                          {log.certificateNumber}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-800 dark:text-zinc-200">
                            {log.recipientName}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {log.eventName}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          {getMethodPill(log.method)}
                        </td>
                        <td className="py-3.5 px-4">
                          {getResultBadge(log.result)}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-[11px] text-slate-400 dark:text-zinc-500">
                          {log.ipAddress || "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}   