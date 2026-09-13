"use client";

import Link from "next/link";
import { Plus, Award, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

interface CertificateItem {
  id: string;
  certificateNumber: string;
  recipientName: string;
  status: "active" | "revoked";
  createdAt: string;
}

export function AdminAssignmentsBox() {
  const { data, isPending } = useQuery<{ data: CertificateItem[] }>({
    queryKey: ["admin-recent-certificates"],
    queryFn: async () => {
      const res = await apiClient.get("/admin/certificates", {
        params: { page: 1, limit: 3 },
      });
      return res.data;
    },
    staleTime: 1000 * 60 * 2,
  });

  const certs = data?.data || [];

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col gap-5 h-full">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
        <span className="text-sm font-bold text-[#0e1738] dark:text-zinc-100">
          Antrean & Penerbitan Dokumen Terbaru
        </span>
        <Link
          href="/admin/certificates"
          className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors font-medium"
        >
          Kelola Semua
        </Link>
      </div>

      <div className="flex flex-col gap-3.5 flex-1">
        {isPending ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2 text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin text-[#122253]" />
            <span className="text-xs">Memuat antrean sertifikat...</span>
          </div>
        ) : certs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center gap-1.5 text-slate-400">
            <Award className="w-8 h-8 stroke-1 text-slate-300 dark:text-zinc-600" />
            <p className="text-xs font-medium">Belum ada penerbitan berkas.</p>
          </div>
        ) : (
          certs.map((task) => (
            <div
              key={task.id}
              className="border border-slate-200/80 dark:border-zinc-800 p-4 rounded-2xl flex flex-col gap-3 bg-white dark:bg-zinc-900 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-semibold text-slate-500 dark:text-zinc-400 truncate max-w-[200px]">
                  {task.certificateNumber}
                </span>
                <span
                  className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                    task.status === "revoked"
                      ? "bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-900/60"
                      : "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-900/60"
                  }`}
                >
                  {task.status === "revoked" ? "Dicabut" : "Aktif"}
                </span>
              </div>

              <p className="text-xs font-semibold text-[#0e1738] dark:text-zinc-100 leading-relaxed">
                Penerima: {task.recipientName}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-zinc-800 text-[11px] text-slate-500">
                <span className="font-medium">
                  {new Date(task.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <div className="w-6 h-6 rounded-full bg-[#0e1738] text-[10px] text-white flex items-center justify-center font-bold">
                  {task.recipientName.slice(0, 2).toUpperCase()}
                </div>
              </div>
            </div>
          ))
        )}

        <Link
          href="/admin/certificates/new"
          className="w-full py-3 border border-dashed border-slate-300 dark:border-zinc-700 rounded-2xl text-xs text-slate-500 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-1.5 mt-auto font-semibold cursor-pointer"
        >
          <Plus size={14} /> Terbitkan Dokumen Baru
        </Link>
      </div>
    </div>
  );
}