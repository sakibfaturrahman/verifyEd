// src/features/settings/components/account-danger-zone.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Bell, AlertTriangle, Download, Power } from "lucide-react";

export function AccountDangerZone() {
  const [notifScan, setNotifScan] = useState(true);
  const [notifRevoke, setNotifRevoke] = useState(true);

  const handleExportData = () => {
    toast.success("Mempersiapkan Arsip", {
      description:
        "Seluruh data agenda dan log sertifikat instansi sedang diekspor.",
    });
  };

  const handleDeactivate = () => {
    toast.error("Pembekuan Akun", {
      description: "Permintaan pembekuan akun diajukan ke Super Administrator.",
    });
  };

  return (
    <div className="space-y-5">
      {/* Notifikasi Email */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="pb-3 border-b border-slate-100 dark:border-zinc-800">
          <h3 className="text-sm font-bold text-[#0e1738] dark:text-zinc-100 flex items-center gap-2">
            <Bell size={15} className="text-sky-600" />
            <span>Preferensi Pemberitahuan Surel</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Atur pengiriman surel otomatis saat terjadi aktivitas pada dokumen
            Anda[cite: 1].
          </p>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-800 dark:text-zinc-200">
                Peringatan Verifikasi Publik
              </p>
              <span className="text-slate-400 text-[11px]">
                Kirim email rangkuman mingguan jumlah dokumen yang dipindai
                publik[cite: 1].
              </span>
            </div>
            <input
              type="checkbox"
              checked={notifScan}
              onChange={(e) => setNotifScan(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-[#0e1738] focus:ring-[#0e1738]/20 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-zinc-800">
            <div>
              <p className="font-bold text-slate-800 dark:text-zinc-200">
                Pemberitahuan Pencabutan Berkas
              </p>
              <span className="text-slate-400 text-[11px]">
                Kirim notifikasi instan saat ada sertifikat yang dicabut status
                validitasnya[cite: 1].
              </span>
            </div>
            <input
              type="checkbox"
              checked={notifRevoke}
              onChange={(e) => setNotifRevoke(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-[#0e1738] focus:ring-[#0e1738]/20 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white dark:bg-zinc-900 border border-rose-200/80 dark:border-rose-900/50 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="pb-3 border-b border-rose-100 dark:border-rose-900/30">
          <h3 className="text-sm font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <AlertTriangle size={15} />
            <span>Tindakan Sensitif & Arsip Lembaga</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Operasi berkas cadangan dan pengelolaan status akses
            organisasi[cite: 1].
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div>
            <p className="font-bold text-slate-800 dark:text-zinc-200">
              Cadangkan Seluruh Arsip Dokumen
            </p>
            <p className="text-slate-400 text-[11px]">
              Unduh rekapitulasi data sertifikat, hash file, dan event dalam
              format arsip terenkripsi.
            </p>
          </div>
          <button
            type="button"
            onClick={handleExportData}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors whitespace-nowrap self-start sm:self-auto cursor-pointer"
          >
            <Download size={14} />
            <span>Ekspor Arsip ZIP</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs pt-3 border-t border-rose-100 dark:border-rose-900/30">
          <div>
            <p className="font-bold text-rose-600 dark:text-rose-400">
              Nonaktifkan Akun Organisasi
            </p>
            <p className="text-slate-400 text-[11px]">
              Menangguhkan izin penerbitan sertifikat baru sementara waktu[cite:
              1].
            </p>
          </div>
          <button
            type="button"
            onClick={handleDeactivate}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-900 text-xs font-semibold hover:bg-rose-100 transition-colors whitespace-nowrap self-start sm:self-auto cursor-pointer"
          >
            <Power size={14} />
            <span>Bekukan Akun</span>
          </button>
        </div>
      </div>
    </div>
  );
}
