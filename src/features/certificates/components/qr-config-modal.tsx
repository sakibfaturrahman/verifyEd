// src/features/certificates/components/qr-config-modal.tsx
"use client";

import { useState } from "react";
import { QrCode, X, Move, Maximize2, RotateCw } from "lucide-react";

interface QrConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  certNumber?: string;
}

export function QrConfigModal({
  isOpen,
  onClose,
  certNumber,
}: QrConfigModalProps) {
  const [config, setConfig] = useState({
    x: 450,
    y: 700,
    width: 90,
    height: 90,
    page: 1,
    rotation: 0,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs select-none animate-in fade-in duration-150">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center border border-indigo-100 dark:border-indigo-900">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0e1738] dark:text-zinc-100">
                Pengaturan Posisi QR Dokumen
              </h3>
              <p className="text-[11px] font-mono text-slate-400">
                {certNumber}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dummy Canvas Preview Lembar PDF */}
        <div className="relative w-full h-44 rounded-2xl bg-slate-100 dark:bg-zinc-800/50 border border-dashed border-slate-300 dark:border-zinc-700 flex items-center justify-center overflow-hidden">
          <div className="text-[11px] text-slate-400 font-medium">
            Pratinjau Koordinat Canvas Halaman {config.page}
          </div>

          {/* Stiker Penanda Titik QR */}
          <div
            style={{
              width: `${config.width * 0.6}px`,
              height: `${config.height * 0.6}px`,
              transform: `rotate(${config.rotation}deg)`,
            }}
            className="absolute right-8 bottom-6 bg-indigo-600 text-white rounded-lg flex items-center justify-center shadow-lg font-mono text-[9px] font-bold transition-all"
          >
            QR
          </div>
        </div>

        {/* Form Input Koordinat */}
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
              <Move className="w-3 h-3" /> Posisi X & Y
            </label>
            <div className="flex gap-1">
              <input
                type="number"
                value={config.x}
                onChange={(e) =>
                  setConfig({ ...config, x: Number(e.target.value) })
                }
                className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2 text-xs font-mono"
                placeholder="X"
              />
              <input
                type="number"
                value={config.y}
                onChange={(e) =>
                  setConfig({ ...config, y: Number(e.target.value) })
                }
                className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2 text-xs font-mono"
                placeholder="Y"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
              <Maximize2 className="w-3 h-3" /> Dimensi (px)
            </label>
            <div className="flex gap-1">
              <input
                type="number"
                value={config.width}
                onChange={(e) =>
                  setConfig({ ...config, width: Number(e.target.value) })
                }
                className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2 text-xs font-mono"
                placeholder="W"
              />
              <input
                type="number"
                value={config.height}
                onChange={(e) =>
                  setConfig({ ...config, height: Number(e.target.value) })
                }
                className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2 text-xs font-mono"
                placeholder="H"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
              <RotateCw className="w-3 h-3" /> Rotasi & Hal
            </label>
            <div className="flex gap-1">
              <input
                type="number"
                value={config.rotation}
                onChange={(e) =>
                  setConfig({ ...config, rotation: Number(e.target.value) })
                }
                className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2 text-xs font-mono"
                placeholder="Rot°"
              />
              <input
                type="number"
                value={config.page}
                onChange={(e) =>
                  setConfig({ ...config, page: Number(e.target.value) })
                }
                className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2 text-xs font-mono"
                placeholder="Hal"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs font-semibold text-slate-600 dark:text-zinc-300 hover:bg-slate-50"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#0e1738] text-white text-xs font-semibold hover:bg-[#1a254d]"
          >
            Simpan Posisi QR
          </button>
        </div>
      </div>
    </div>
  );
}
