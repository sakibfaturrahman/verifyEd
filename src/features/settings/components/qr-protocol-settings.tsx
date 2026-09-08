// src/features/settings/components/qr-protocol-settings.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ShieldCheck, Save, HelpCircle } from "lucide-react";

export function QrProtocolSettings() {
  const [errorCorrection, setErrorCorrection] = useState<"L" | "M" | "Q" | "H">(
    "H",
  );
  const [qrSize, setQrSize] = useState("120");
  const [includeLabel, setIncludeLabel] = useState(true);
  const [hashAlgorithm, setHashAlgorithm] = useState("SHA-256");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Konfigurasi QR Disimpan", {
      description:
        "Standar stempel dan verifikasi kriptografis berhasil diperbarui.",
    });
  };

  return (
    <form onSubmit={handleSave} className="space-y-5">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-6 shadow-xs space-y-6">
        <div>
          <h3 className="text-base font-bold text-[#0e1738] dark:text-zinc-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>Spesifikasi Stempel QR & Integritas Dokumen</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 font-medium">
            Atur parameter default saat sistem membubuhkan QR Code pada dokumen
            sertifikat baru[cite: 1].
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          {/* Algoritma Kriptografi */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-zinc-200 flex items-center gap-1.5">
              <span>Algoritma Hashing Dokumen</span>
              <HelpCircle size={13} className="text-slate-400" />
            </label>
            <input
              type="text"
              disabled
              value={hashAlgorithm}
              className="w-full bg-slate-100 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 font-mono text-slate-500 font-semibold cursor-not-allowed"
            />
            <p className="text-[11px] text-slate-400">
              Standar baku ledger VerifyEd menggunakan SHA-256[cite: 1].
            </p>
          </div>

          {/* Tingkat Error Correction */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-zinc-200">
              Error Correction Level (ECC)
            </label>
            <select
              value={errorCorrection}
              onChange={(e) => setErrorCorrection(e.target.value as any)}
              className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 font-semibold text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#0e1738]/15"
            >
              <option value="L">Level L (Toleransi Kerusakan 7%)</option>
              <option value="M">Level M (Toleransi Kerusakan 15%)</option>
              <option value="Q">Level Q (Toleransi Kerusakan 25%)</option>
              <option value="H">
                Level H (Toleransi Kerusakan 30% - Rekomendasi)
              </option>
            </select>
            <p className="text-[11px] text-slate-400">
              Menjaga QR tetap terbaca meskipun dokumen dicetak atau terlipat
              fisik.
            </p>
          </div>

          {/* Ukuran Default Pixel */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-zinc-200">
              Ukuran Stempel Default (Pixel)
            </label>
            <input
              type="number"
              value={qrSize}
              onChange={(e) => setQrSize(e.target.value)}
              className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 font-medium text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#0e1738]/15"
            />
          </div>

          {/* Opsi Teks Tambahan */}
          <div className="space-y-1.5 flex flex-col justify-center">
            <label className="font-bold text-slate-700 dark:text-zinc-200">
              Visual Label Kredensial
            </label>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="includeLabel"
                checked={includeLabel}
                onChange={(e) => setIncludeLabel(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[#0e1738] focus:ring-[#0e1738]/20"
              />
              <label
                htmlFor="includeLabel"
                className="text-slate-600 dark:text-zinc-300 select-none"
              >
                Sertakan teks &quot;Pindai untuk Verifikasi Keaslian&quot; di
                bawah QR
              </label>
            </div>
          </div>
        </div>

        <div className="pt-3 flex justify-end border-t border-slate-100 dark:border-zinc-800">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0e1738] dark:bg-zinc-100 text-white dark:text-[#0e1738] text-xs font-semibold hover:bg-[#1a254d] transition-colors shadow-xs"
          >
            <Save size={14} />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </div>
    </form>
  );
}
