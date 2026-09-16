// src/features/issuance/components/qr-position-canvas.tsx
"use client";

import { useState } from "react";
import { QrCode, Sliders, Layers } from "lucide-react";

export interface BackendQrConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  page?: number;
  rotation?: number;
}

interface QrPositionCanvasProps {
  qrConfig: BackendQrConfig;
  onChange: (config: BackendQrConfig) => void;
  totalPages?: number;
}

export function QrPositionCanvas({
  qrConfig,
  onChange,
  totalPages = 1,
}: QrPositionCanvasProps) {
  const [selectedCorner, setSelectedCorner] = useState<string>("bottom-right");

  // Preset koordinat absolut PDF A4 Landscape standar (842 x 595 pt)
  const setPresetPosition = (corner: string) => {
    setSelectedCorner(corner);
    const size = qrConfig.width || 80;

    switch (corner) {
      case "bottom-right":
        onChange({ ...qrConfig, x: 700, y: 460, width: size, height: size });
        break;
      case "bottom-left":
        onChange({ ...qrConfig, x: 60, y: 460, width: size, height: size });
        break;
      case "bottom-center":
        onChange({ ...qrConfig, x: 381, y: 460, width: size, height: size });
        break;
      case "top-right":
        onChange({ ...qrConfig, x: 700, y: 50, width: size, height: size });
        break;
      case "top-left":
        onChange({ ...qrConfig, x: 60, y: 50, width: size, height: size });
        break;
    }
  };

  // Konversi koordinat PDF (842 x 595) ke persentase visual pratinjau
  const previewLeftPercent = Math.min(Math.max((qrConfig.x / 842) * 100, 2), 88);
  const previewTopPercent = Math.min(Math.max((qrConfig.y / 595) * 100, 2), 85);
  const previewSizePx = Math.round((qrConfig.width / 842) * 520);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      {/* Canvas Pratinjau Sertifikat */}
      <div className="lg:col-span-8 bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
          <span className="text-xs font-bold text-[#122253] dark:text-zinc-100">
            Simulasi Tata Letak Stempel pada Lembar Dokumen
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            PDF A4 (x: {Math.round(qrConfig.x)}, y: {Math.round(qrConfig.y)}, {qrConfig.width}×{qrConfig.height} pt)
          </span>
        </div>

        {/* Mock Lembar Sertifikat A4 Landscape */}
        <div className="relative aspect-[1.414/1] w-full bg-[#faf8f5] dark:bg-zinc-800/40 border-2 border-dashed border-slate-300 dark:border-zinc-700 rounded-xl overflow-hidden flex flex-col justify-between p-8 select-none">
          <div className="absolute inset-3 border border-slate-300/80 dark:border-zinc-700/60 pointer-events-none rounded-lg" />

          {/* Dummy Isi Sertifikat */}
          <div className="text-center space-y-1 relative z-10 pt-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
              Sertifikat Kredensial Resmi
            </span>
            <h4 className="text-lg sm:text-xl font-bold text-[#122253] dark:text-zinc-100">
              Workshop & Sertifikasi Kompetensi
            </h4>
            <p className="text-xs text-slate-500">
              Diberikan atas partisipasi dan pencapaian kompetensi terverifikasi
            </p>
          </div>

          <div className="text-center relative z-10 pb-2">
            <div className="h-0.5 w-32 bg-slate-300 dark:bg-zinc-700 mx-auto mb-1" />
            <span className="text-[11px] font-medium text-slate-400">
              Tanda Tangan & Otoritas Lembaga
            </span>
          </div>

          {/* Stempel Barcode Mengambang */}
          <div
            style={{
              left: `${previewLeftPercent}%`,
              top: `${previewTopPercent}%`,
              width: `${Math.max(previewSizePx, 44)}px`,
              height: `${Math.max(previewSizePx, 44)}px`,
            }}
            className="absolute z-20 bg-white border-2 border-[#122253] rounded-xl p-1.5 shadow-md flex flex-col items-center justify-center transition-all cursor-move group"
          >
            <QrCode className="w-full h-full text-[#122253]" />
            <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono bg-[#122253] text-white px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Posisi QR Token
            </span>
          </div>
        </div>
      </div>

      {/* Kontrol Penyetelan Koordinat */}
      <div className="lg:col-span-4 bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-5 shadow-xs space-y-4 text-xs">
        <div className="pb-2 border-b border-slate-100 dark:border-zinc-800">
          <h4 className="font-bold text-[#122253] dark:text-zinc-100 flex items-center gap-1.5">
            <Sliders size={14} className="text-[#122253]" />
            <span>Konfigurasi Stempel Barcode</span>
          </h4>
        </div>

        {/* Preset Cepat */}
        <div className="space-y-1.5">
          <label className="font-semibold text-slate-600 dark:text-zinc-300">
            Penempatan Cepat (Preset)
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: "bottom-right", label: "Kanan Bawah" },
              { id: "bottom-left", label: "Kiri Bawah" },
              { id: "bottom-center", label: "Tengah Bawah" },
              { id: "top-right", label: "Kanan Atas" },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPresetPosition(p.id)}
                className={`py-2 px-3 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                  selectedCorner === p.id
                    ? "bg-[#122253] text-white border-transparent shadow-xs"
                    : "border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Ukuran Barcode */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between font-semibold text-slate-600 dark:text-zinc-300">
            <span>Dimensi Barcode:</span>
            <span className="font-mono font-bold text-[#122253] dark:text-zinc-100">
              {qrConfig.width} × {qrConfig.height} pt
            </span>
          </div>
          <input
            type="range"
            min={50}
            max={140}
            step={5}
            value={qrConfig.width}
            onChange={(e) => {
              const val = Number(e.target.value);
              onChange({ ...qrConfig, width: val, height: val });
            }}
            className="w-full accent-[#122253] cursor-pointer"
          />
        </div>

        {/* Halaman Penempatan */}
        {totalPages > 1 && (
          <div className="space-y-1.5 pt-1">
            <label className="font-semibold text-slate-600 dark:text-zinc-300 flex items-center gap-1">
              <Layers size={13} className="text-slate-400" />
              <span>Halaman Penempatan:</span>
            </label>
            <select
              value={qrConfig.page || 1}
              onChange={(e) =>
                onChange({ ...qrConfig, page: Number(e.target.value) })
              }
              className="w-full bg-[#faf8f5] dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2 font-medium text-slate-800 dark:text-zinc-100 focus:outline-none"
            >
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <option key={p} value={p}>
                  Halaman {p}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Slider Koordinat X & Y */}
        <div className="space-y-3 pt-1">
          <div className="space-y-1">
            <div className="flex justify-between font-semibold text-slate-600 dark:text-zinc-300">
              <span>Koordinat Horisontal (X):</span>
              <span className="font-mono text-slate-500">{Math.round(qrConfig.x)} pt</span>
            </div>
            <input
              type="range"
              min={20}
              max={740}
              value={qrConfig.x}
              onChange={(e) => {
                setSelectedCorner("");
                onChange({ ...qrConfig, x: Number(e.target.value) });
              }}
              className="w-full accent-[#122253] cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between font-semibold text-slate-600 dark:text-zinc-300">
              <span>Koordinat Vertikal (Y):</span>
              <span className="font-mono text-slate-500">{Math.round(qrConfig.y)} pt</span>
            </div>
            <input
              type="range"
              min={20}
              max={500}
              value={qrConfig.y}
              onChange={(e) => {
                setSelectedCorner("");
                onChange({ ...qrConfig, y: Number(e.target.value) });
              }}
              className="w-full accent-[#122253] cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}