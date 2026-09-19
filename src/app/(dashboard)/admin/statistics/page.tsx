"use client";

import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  QrCode,
  Hash,
  FileText,
  Loader2,
} from "lucide-react";
import { useVerificationLogsQuery } from "@/features/verification/hooks/use-verification-logs";

export default function AdminStatisticsPage() {
  const [page, setPage] = useState(1);
  const { data, isPending } = useVerificationLogsQuery(page, 10);
  const logs = data?.data || [];

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
        <div>
          <h3 className="text-sm font-bold text-[#0e1738] dark:text-zinc-100">
            Log Aktivitas Pengecekan Kredensial
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Rekam jejak seluruh dokumen yang diperiksa oleh publik atau pihak
            ketiga secara real-time.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-zinc-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4">Waktu Pengecekan</th>
              <th className="py-3 px-4">Nomor Kredensial</th>
              <th className="py-3 px-4">Penerima & Agenda</th>
              <th className="py-3 px-4">Metode Uji</th>
              <th className="py-3 px-4">Hasil Status</th>
              <th className="py-3 px-4">Alamat Node IP</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 text-xs">
            {isPending ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-[#122253]" />
                    <span>Memuat log pemeriksaan...</span>
                  </div>
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-slate-400">
                  Belum ada aktivitas verifikasi dokumen yang tercatat.
                </td>
              </tr>
            ) : (
              logs.map((log) => {
                const certNum =
                  log.certificates?.certificate_number || "TIDAK TERDAFTAR";
                const recipient = log.certificates?.recipient_name || "-";
                const eventName = log.certificates?.events?.name || "-";

                return (
                  <tr
                    key={log.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-zinc-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-zinc-300">
                      {new Date(log.created_at).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}{" "}
                      {new Date(log.created_at).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      WIB
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-zinc-100">
                      {certNum}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800 dark:text-zinc-200">
                        {recipient}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {eventName}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {log.method === "qr" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold text-[11px]">
                          <QrCode size={12} />
                          <span>QR Token</span>
                        </span>
                      )}
                      {log.method === "certificate_id" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px]">
                          <Hash size={12} />
                          <span>Nomor ID</span>
                        </span>
                      )}
                      {log.method === "pdf" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-semibold text-[11px]">
                          <FileText size={12} />
                          <span>File PDF</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {log.result === "verified" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold text-[11px]">
                          <CheckCircle2 size={12} />
                          <span>Sah (Verified)</span>
                        </span>
                      )}
                      {log.result === "revoked" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 font-bold text-[11px]">
                          <XCircle size={12} />
                          <span>Dicabut (Revoked)</span>
                        </span>
                      )}
                      {log.result === "not_found" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 font-bold text-[11px]">
                          <AlertTriangle size={12} />
                          <span>Tidak Ditemukan</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 dark:text-zinc-400">
                      {log.ip_address || "127.0.0.1"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
