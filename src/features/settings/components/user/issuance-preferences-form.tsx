// src/features/settings/components/issuance-preferences-form.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Hash, Sliders, Save } from "lucide-react";

export function IssuancePreferencesForm() {
  const [prefix, setPrefix] = useState("CERT");
  const [useYear, setUseYear] = useState(true);
  const [useRandomSuffix, setUseRandomSuffix] = useState(true);
  const [timezone, setTimezone] = useState("Asia/Jakarta");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Preferensi Penerbitan Disimpan", {
      description: "Format penomoran dokumen baru berhasil diperbarui.",
    });
  };

  const previewNumber = `${prefix}-${useYear ? "20260909" : "001"}-${
    useRandomSuffix ? "A1B2C3D4" : "0001"
  }`;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-6 shadow-xs space-y-6">
      <div className="pb-3 border-b border-slate-100 dark:border-zinc-800">
        <h3 className="text-sm font-bold text-[#0e1738] dark:text-zinc-100 flex items-center gap-2">
          <Hash size={15} className="text-indigo-600" />
          <span>Format Nomor Dokumen Otomatis</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
          Tentukan pola identifikasi unik yang dicetak pada setiap sertifikat
          baru.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-4 text-xs">
        {/* Pratinjau Nomor */}
        <div className="p-3.5 bg-slate-50 dark:bg-zinc-800/60 rounded-xl border border-slate-200 dark:border-zinc-700">
          <span className="text-[11px] font-medium text-slate-400">
            Pratinjau Hasil Nomor Sertifikat:
          </span>
          <p className="font-mono font-bold text-sm text-[#0e1738] dark:text-zinc-100 mt-1">
            {previewNumber}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-zinc-200">
              Awalan Dokumen (Prefix)
            </label>
            <input
              type="text"
              required
              value={prefix}
              onChange={(e) => setPrefix(e.target.value.toUpperCase())}
              className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 font-mono font-semibold text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#0e1738]/15"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-zinc-200">
              Zona Waktu Stempel Digital
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 font-medium text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#0e1738]/15"
            >
              <option value="Asia/Jakarta">WIB (Asia/Jakarta - UTC+7)</option>
              <option value="Asia/Makassar">
                WITA (Asia/Makassar - UTC+8)
              </option>
              <option value="Asia/Jayapura">WIT (Asia/Jayapura - UTC+9)</option>
            </select>
          </div>
        </div>

        {/* Checkbox Atribut */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="useYear"
              checked={useYear}
              onChange={(e) => setUseYear(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-[#0e1738] focus:ring-[#0e1738]/20"
            />
            <label
              htmlFor="useYear"
              className="text-slate-600 dark:text-zinc-300 font-medium select-none"
            >
              Sertakan format tanggal penerbitan (YYYYMMDD) pada nomor
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="useRandomSuffix"
              checked={useRandomSuffix}
              onChange={(e) => setUseRandomSuffix(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-[#0e1738] focus:ring-[#0e1738]/20"
            />
            <label
              htmlFor="useRandomSuffix"
              className="text-slate-600 dark:text-zinc-300 font-medium select-none"
            >
              Gunakan akhiran hash acak 8-karakter (Mencegah tebakan nomor)
            </label>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0e1738] dark:bg-zinc-100 text-white dark:text-[#0e1738] text-xs font-semibold hover:bg-[#1a254d] transition-all shadow-xs cursor-pointer"
          >
            <Save size={14} />
            <span>Simpan Format</span>
          </button>
        </div>
      </form>
    </div>
  );
}
