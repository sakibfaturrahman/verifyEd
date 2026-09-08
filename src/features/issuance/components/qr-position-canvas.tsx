// src/features/issuance/components/qr-position-canvas.tsx
"use client";

import { useState } from "react";
import { QrCode, Move, Sliders } from "lucide-react";

interface QrPositionCanvasProps {
  qrConfig: {
    x: number;
    y: number;
    size: number;
  };
  onChange: (config: { x: number; y: number; size: number }) => void;
}

export function QrPositionCanvas({
  qrConfig,
  onChange,
}: QrPositionCanvasProps) {
  const [selectedCorner, setSelectedCorner] = useState<string>("bottom-right");

  const setPresetPosition = (corner: string) => {
    setSelectedCorner(corner);
    switch (corner) {
      case "bottom-right":
        onChange({ ...qrConfig, x: 78, y: 78 });
        break;
      case "bottom-left":
        onChange({ ...qrConfig, x: 8, y: 78 });
        break;
      case "top-right":
        onChange({ ...qrConfig, x: 78, y: 10 });
        break;
      case "bottom-center":
        onChange({ ...qrConfig, x: 43, y: 78 });
        break;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      {/* Area Preview Canvas Sertifikat */}
      <div className="lg:col-span-8 bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
          <span className="text-xs font-bold text-[#0e1738] dark:text-zinc-100">
            Simulasi Tata Letak Stempel pada Sertifikat
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            Ukuran A4 Landscape (Koordinat: {qrConfig.x}%, {qrConfig.y}%)
          </span>
        </div>

        {/* Mock Lembar Sertifikat A4 */}
        <div className="relative aspect-[1.414/1] w-full bg-slate-50 dark:bg-zinc-800/40 border-2 border-dashed border-slate-200 dark:border-zinc-700 rounded-xl overflow-hidden flex flex-col justify-between p-8 select-none">
          {/* Mock Template Border & Content */}
          <div className="absolute inset-3 border border-slate-200/60 dark:border-zinc-700/60 pointer-events-none rounded-lg" />

          <div className="text-center space-y-1 relative z-10 pt-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
              Sertifikat Penghargaan
            </span>
            <h4 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-zinc-100">
              National Tech Hackathon 2026
            </h4>
            <p className="text-xs text-slate-500">
              Diberikan kepada peserta terpilih
            </p>
          </div>

          <div className="text-center relative z-10">
            <div className="h-0.5 w-32 bg-slate-300 dark:bg-zinc-700 mx-auto mb-1" />
            <span className="text-[11px] font-medium text-slate-400">
              Ketua Penyelenggara & Otoritas
            </span>
          </div>

          {/* Stempel QR Mengambang Berdasarkan Koordinat */}
          <div
            style={{
              left: `${qrConfig.x}%`,
              top: `${qrConfig.y}%`,
              width: `${qrConfig.size}px`,
              height: `${qrConfig.size}px`,
            }}
            className="absolute z-20 bg-white border-2 border-indigo-600 rounded-xl p-1.5 shadow-lg flex flex-col items-center justify-center transition-all cursor-move group"
          >
            <QrCode className="w-full h-full text-[#0e1738]" />
            <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono bg-indigo-600 text-white px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              Stempel QR Token
            </span>
          </div>
        </div>
      </div>

      {/* Kontrol Koordinat & Preset */}
      <div className="lg:col-span-4 bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-5 shadow-xs space-y-4 text-xs">
        <div className="pb-2 border-b border-slate-100 dark:border-zinc-800">
          <h4 className="font-bold text-[#0e1738] dark:text-zinc-100 flex items-center gap-1.5">
            <Sliders size={14} className="text-indigo-600" />
            <span>Penyesuaian Posisi Stempel</span>
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
                className={`py-2 px-3 rounded-xl border text-[11px] font-bold transition-all ${
                  selectedCorner === p.id
                    ? "bg-[#0e1738] dark:bg-zinc-100 text-white dark:text-[#0e1738] border-transparent"
                    : "border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Ukuran QR Code */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between font-semibold text-slate-600 dark:text-zinc-300">
            <span>Dimensi Stempel:</span>
            <span className="font-mono font-bold text-[#0e1738] dark:text-zinc-100">
              {qrConfig.size} px
            </span>
          </div>
          <input
            type="range"
            min={48}
            max={120}
            value={qrConfig.size}
            onChange={(e) =>
              onChange({ ...qrConfig, size: Number(e.target.value) })
            }
            className="w-full accent-[#0e1738] dark:accent-zinc-100"
          />
        </div>

        {/* Slider Koordinat X & Y Manual */}
        <div className="space-y-3 pt-2">
          <div className="space-y-1">
            <div className="flex justify-between font-semibold text-slate-600 dark:text-zinc-300">
              <span>Posisi Horisontal (X):</span>
              <span className="font-mono text-slate-500">{qrConfig.x}%</span>
            </div>
            <input
              type="range"
              min={5}
              max={85}
              value={qrConfig.x}
              onChange={(e) =>
                onChange({ ...qrConfig, x: Number(e.target.value) })
              }
              className="w-full accent-[#0e1738] dark:accent-zinc-100"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between font-semibold text-slate-600 dark:text-zinc-300">
              <span>Posisi Vertikal (Y):</span>
              <span className="font-mono text-slate-500">{qrConfig.y}%</span>
            </div>
            <input
              type="range"
              min={5}
              max={85}
              value={qrConfig.y}
              onChange={(e) =>
                onChange({ ...qrConfig, y: Number(e.target.value) })
              }
              className="w-full accent-[#0e1738] dark:accent-zinc-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
