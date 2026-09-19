"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { ActivityTableToolbar } from "@/features/logs/components/activity-table-toolbar";
import { ActivityDetailModal } from "@/features/logs/components/activity-detail-modal";
import {
  ActivityLogItem,
  ActivityAction,
} from "@/features/logs/types/activity.types";
import {
  CheckCircle2,
  AlertTriangle,
  Award,
  UserCheck,
  ShieldAlert,
  Eye,
  CalendarDays,
} from "lucide-react";

const initialLogs: ActivityLogItem[] = [
  {
    id: "act-01",
    actor: { name: "Pengunjung Publik", role: "Tamu (Pengecekan Publik)" },
    action: "VERIFICATION_SUCCESS",
    target: "CERT-20260901-A1B2C3D4",
    details: "Pemeriksaan keaslian berkas berhasil melalui pemindaian kode QR.",
    ipAddress: "180.252.164.22",
    timestamp: "08 Sep 2026, 14:32 WIB",
  },
  {
    id: "act-02",
    actor: { name: "Universitas Perjuangan", role: "Penyelenggara Acara" },
    action: "CERTIFICATE_ISSUED",
    target: "National Tech Hackathon 2026",
    details: "Penerbitan massal 240 lembar sertifikat dengan stempel QR resmi.",
    ipAddress: "103.28.12.5",
    timestamp: "08 Sep 2026, 12:15 WIB",
  },
  {
    id: "act-03",
    actor: { name: "Sakib Faturrahman", role: "Pengelola Utama" },
    action: "CERTIFICATE_REVOKED",
    target: "CERT-20260828-I9J0K1L2",
    details: "Pembatalan sertifikat karena penyesuaian data identitas peserta.",
    ipAddress: "114.122.45.89",
    timestamp: "08 Sep 2026, 10:40 WIB",
  },
  {
    id: "act-04",
    actor: { name: "Pengunjung Publik", role: "Tamu (Pengecekan Publik)" },
    action: "VERIFICATION_NOT_FOUND",
    target: "CERT-20260000-INVALID",
    details:
      "Pemeriksaan nomor sertifikat tidak berhasil karena data tidak terdaftar.",
    ipAddress: "36.72.210.104",
    timestamp: "08 Sep 2026, 09:12 WIB",
  },
  {
    id: "act-05",
    actor: { name: "GDG Cloud Tasikmalaya", role: "Penyelenggara Acara" },
    action: "EVENT_CREATED",
    target: "AI & Cloud Architecture Summit 2026",
    details:
      "Pendaftaran agenda acara baru untuk alokasi penerbitan 85 sertifikat.",
    ipAddress: "103.28.12.5",
    timestamp: "07 Sep 2026, 17:05 WIB",
  },
];

export default function AdminLogsPage() {
  const [logs] = useState<ActivityLogItem[]>(initialLogs);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [selectedLog, setSelectedLog] = useState<ActivityLogItem | null>(null);

  const filteredLogs = useMemo(() => {
    return logs.filter((item) => {
      const matchQuery =
        item.actor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.ipAddress.includes(searchQuery);

      const matchAction =
        actionFilter === "all" || item.action.startsWith(actionFilter);

      return matchQuery && matchAction;
    });
  }, [logs, searchQuery, actionFilter]);

  const handleExport = () => {
    toast.success("Catatan Berhasil Diunduh", {
      description: "Berkas riwayat aktivitas sistem telah disimpan.",
    });
  };

  const getActionBadge = (action: ActivityAction) => {
    switch (action) {
      case "VERIFICATION_SUCCESS":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" />
            <span>Pemeriksaan Berhasil</span>
          </span>
        );
      case "VERIFICATION_REVOKED":
      case "CERTIFICATE_REVOKED":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 px-2.5 py-0.5 rounded-full">
            <ShieldAlert className="w-3 h-3" />
            <span>Dokumen Dibatalkan</span>
          </span>
        );
      case "VERIFICATION_NOT_FOUND":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 px-2.5 py-0.5 rounded-full">
            <AlertTriangle className="w-3 h-3" />
            <span>Tidak Ditemukan</span>
          </span>
        );
      case "CERTIFICATE_ISSUED":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 px-2.5 py-0.5 rounded-full">
            <Award className="w-3 h-3" />
            <span>Penerbitan Sertifikat</span>
          </span>
        );
      case "EVENT_CREATED":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 px-2.5 py-0.5 rounded-full">
            <CalendarDays className="w-3 h-3" />
            <span>Agenda Baru</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800 px-2.5 py-0.5 rounded-full">
            <UserCheck className="w-3 h-3" />
            <span>Aktivitas Akun</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-5 shadow-xs">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0e1738] dark:text-zinc-50">
          Riwayat Aktivitas Sistem
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 font-medium">
          Catatan riwayat pengecekan publik, penerbitan sertifikat, dan
          pembatalan dokumen resmi.
        </p>
      </div>

      <ActivityTableToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        actionFilter={actionFilter}
        onActionFilterChange={setActionFilter}
        onExportLogs={handleExport}
      />

      <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/30 text-[11px] font-bold text-slate-400 dark:text-zinc-500">
                <th className="py-3.5 px-4">Waktu</th>
                <th className="py-3.5 px-4">Pelaku Aktivitas</th>
                <th className="py-3.5 px-4">Jenis Kegiatan</th>
                <th className="py-3.5 px-4">Tujuan / Sasaran</th>
                <th className="py-3.5 px-4">Keterangan</th>
                <th className="py-3.5 px-4 font-mono text-center">Alamat IP</th>
                <th className="py-3.5 px-4 text-right">Rincian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 text-xs">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center text-slate-400 font-medium"
                  >
                    Tidak ada catatan aktivitas yang sesuai dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-zinc-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono text-slate-500 dark:text-zinc-400 whitespace-nowrap">
                      {item.timestamp}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#0e1738] dark:text-zinc-100">
                        {item.actor.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        {item.actor.role}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {getActionBadge(item.action)}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800 dark:text-zinc-200">
                      {item.target}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-zinc-400 max-w-xs truncate">
                      {item.details}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-[11px] text-slate-500 dark:text-zinc-400">
                      {item.ipAddress}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedLog(item)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-[#0e1738] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                        title="Lihat Rincian"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ActivityDetailModal
        log={selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
}
