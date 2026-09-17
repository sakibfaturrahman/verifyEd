"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  QrCode,
  Move,
  Sliders,
  RefreshCw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";

// Konfigurasi worker pdfjs
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export interface PdfQrPlacementConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  page: number;
  rotation: number;
}

interface RealPdfQrCanvasProps {
  pdfFile: File;
  onChangeConfig: (config: PdfQrPlacementConfig) => void;
}

export function RealPdfQrCanvas({
  pdfFile,
  onChangeConfig,
}: RealPdfQrCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Ukuran asli dokumen PDF dalam point
  const [pdfDimensions, setPdfDimensions] = useState({
    width: 842,
    height: 595,
  });
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingPdf, setIsLoadingPdf] = useState(true);

  // Ukuran QR dalam point PDF
  const [qrSizePdf, setQrSizePdf] = useState(85);

  // Posisi stempel pada DOM (persentase)
  const [posPercent, setPosPercent] = useState({ x: 75, y: 72 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartOffset = useRef({ x: 0, y: 0 });

  // Sinkronisasi kalkulasi balik ke koordinat PDF asli
  const emitCalculatedConfig = useCallback(
    (
      pctX: number,
      pctY: number,
      sizePt: number,
      page: number,
      pdfW: number,
      pdfH: number,
    ) => {
      // Skala persentase DOM ke point PDF
      const pdfX = (pctX / 100) * pdfW;

      // Konversi Y dari web top-left ke PDF bottom-left
      const domPixelBottom = (pctY / 100) * pdfH + sizePt;
      const pdfY = Math.max(pdfH - domPixelBottom, 0);

      onChangeConfig({
        x: Math.round(pdfX),
        y: Math.round(pdfY),
        width: sizePt,
        height: sizePt,
        page,
        rotation: 0,
      });
    },
    [onChangeConfig],
  );

  // Render Berkas PDF Asli ke Canvas
  useEffect(() => {
    let isCancelled = false;

    const renderPdf = async () => {
      try {
        setIsLoadingPdf(true);
        const arrayBuffer = await pdfFile.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;

        if (isCancelled) return;
        setTotalPages(pdf.numPages);

        const page = await pdf.getPage(currentPage);
        const viewport = page.getViewport({ scale: 1.5 }); // Render tajam

        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // Simpan dimensi asli halaman (point 72dpi standard PDF)
        const unscaledViewport = page.getViewport({ scale: 1.0 });
        const realW = unscaledViewport.width;
        const realH = unscaledViewport.height;
        setPdfDimensions({ width: realW, height: realH });

        await page.render({
          canvasContext: context,
          viewport,
          canvas, // <-- Tambahkan referensi elemen canvas ini
        }).promise;

        if (!isCancelled) {
          setIsLoadingPdf(false);
          emitCalculatedConfig(
            posPercent.x,
            posPercent.y,
            qrSizePdf,
            currentPage,
            realW,
            realH,
          );
        }
      } catch (err) {
        console.error("Gagal merender PDF preview:", err);
        setIsLoadingPdf(false);
      }
    };

    renderPdf();

    return () => {
      isCancelled = true;
    };
  }, [
    pdfFile,
    currentPage,
    emitCalculatedConfig,
    posPercent.x,
    posPercent.y,
    qrSizePdf,
  ]);

  // Dragging Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    dragStartOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const rawX = e.clientX - containerRect.left - dragStartOffset.current.x;
    const rawY = e.clientY - containerRect.top - dragStartOffset.current.y;

    const pctX = Math.min(Math.max((rawX / containerRect.width) * 100, 0), 85);
    const pctY = Math.min(Math.max((rawY / containerRect.height) * 100, 0), 85);

    setPosPercent({ x: pctX, y: pctY });
    emitCalculatedConfig(
      pctX,
      pctY,
      qrSizePdf,
      currentPage,
      pdfDimensions.width,
      pdfDimensions.height,
    );
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Presets
  const applyPreset = (
    position: "bottom-right" | "bottom-left" | "bottom-center" | "top-right",
  ) => {
    let newX = 75;
    let newY = 75;

    if (position === "bottom-right") {
      newX = 78;
      newY = 75;
    } else if (position === "bottom-left") {
      newX = 6;
      newY = 75;
    } else if (position === "bottom-center") {
      newX = 42;
      newY = 75;
    } else if (position === "top-right") {
      newX = 78;
      newY = 8;
    }

    setPosPercent({ x: newX, y: newY });
    emitCalculatedConfig(
      newX,
      newY,
      qrSizePdf,
      currentPage,
      pdfDimensions.width,
      pdfDimensions.height,
    );
  };

  // Konversi ukuran stempel visual ke rasio canvas kontainer
  const domStampSize = `${(qrSizePdf / pdfDimensions.width) * 100}%`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Kolom Kiri: Pratinjau Dokumen Asli */}
      <div className="lg:col-span-8 bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
          <div>
            <h3 className="text-sm font-bold text-[#122253] dark:text-zinc-100 flex items-center gap-1.5">
              <Move size={15} className="text-[#122253]" />
              <span>Pratinjau Berkas Asli & Posisi Stempel</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Tarik kotak stempel QR langsung ke letak tanda tangan atau stempel
              yang diinginkan.
            </p>
          </div>

          <span className="text-xs font-mono bg-slate-100 dark:bg-zinc-800 px-2.5 py-1 rounded-lg text-slate-600 dark:text-zinc-300 font-bold">
            {Math.round(pdfDimensions.width)} ×{" "}
            {Math.round(pdfDimensions.height)} pt
          </span>
        </div>

        {/* Viewport Canvas Interaktif */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="relative w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 flex items-center justify-center select-none cursor-crosshair shadow-inner"
        >
          {isLoadingPdf && (
            <div className="absolute inset-0 z-30 bg-white/80 dark:bg-zinc-900/80 flex flex-col items-center justify-center gap-2">
              <RefreshCw size={24} className="animate-spin text-[#122253]" />
              <span className="text-xs font-semibold text-slate-600">
                Memuat Pratinjau Dokumen Asli...
              </span>
            </div>
          )}

          {/* Canvas Render dari PDF Asli */}
          <canvas
            ref={canvasRef}
            className="w-full h-auto object-contain block pointer-events-none"
          />

          {/* Elemen QR yang Bisa Ditarik (Drag) */}
          {!isLoadingPdf && (
            <div
              onMouseDown={handleMouseDown}
              style={{
                left: `${posPercent.x}%`,
                top: `${posPercent.y}%`,
                width: domStampSize,
                minWidth: "48px",
                aspectRatio: "1 / 1",
              }}
              className={`absolute z-20 bg-white/95 border-2 rounded-xl p-1 shadow-2xl flex flex-col items-center justify-center cursor-grab active:cursor-grabbing transition-shadow ${
                isDragging
                  ? "border-indigo-600 shadow-indigo-500/30 scale-105"
                  : "border-[#122253]"
              }`}
            >
              <QrCode className="w-full h-full text-[#122253]" />
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-bold font-mono bg-[#122253] text-white px-2 py-0.5 rounded-full whitespace-nowrap pointer-events-none shadow-sm">
                Geser Saya
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Kolom Kanan: Pengaturan & Presets */}
      <div className="lg:col-span-4 bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5 text-xs">
        <div className="pb-3 border-b border-slate-100 dark:border-zinc-800">
          <h4 className="font-bold text-[#122253] dark:text-zinc-100 flex items-center gap-1.5">
            <Sliders size={15} className="text-[#122253]" />
            <span>Kontrol Posisi Presisi</span>
          </h4>
        </div>

        {/* Preset Cepat */}
        <div className="space-y-2">
          <label className="font-semibold text-slate-600 dark:text-zinc-300">
            Penempatan Instan (Preset):
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "bottom-right", label: "Kanan Bawah" },
              { id: "bottom-left", label: "Kiri Bawah" },
              { id: "bottom-center", label: "Tengah Bawah" },
              { id: "top-right", label: "Kanan Atas" },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPreset(p.id as any)}
                className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 font-bold text-slate-700 dark:text-zinc-200 transition-colors text-center cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Ukuran Barcode */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-zinc-800">
          <div className="flex justify-between font-semibold text-slate-600 dark:text-zinc-300">
            <span>Dimensi Barcode PDF:</span>
            <span className="font-mono font-bold text-[#122253] dark:text-zinc-100">
              {qrSizePdf} × {qrSizePdf} pt
            </span>
          </div>
          <input
            type="range"
            min={45}
            max={140}
            step={5}
            value={qrSizePdf}
            onChange={(e) => {
              const val = Number(e.target.value);
              setQrSizePdf(val);
              emitCalculatedConfig(
                posPercent.x,
                posPercent.y,
                val,
                currentPage,
                pdfDimensions.width,
                pdfDimensions.height,
              );
            }}
            className="w-full accent-[#122253] cursor-pointer"
          />
        </div>

        {/* Halaman Berkas jika Multipage */}
        {totalPages > 1 && (
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-zinc-800">
            <label className="font-semibold text-slate-600 dark:text-zinc-300">
              Terapkan pada Halaman:
            </label>
            <select
              value={currentPage}
              onChange={(e) => setCurrentPage(Number(e.target.value))}
              className="w-full bg-[#faf8f5] dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2 font-semibold text-slate-800 dark:text-zinc-100 focus:outline-none"
            >
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <option key={p} value={p}>
                  Halaman Dokumen {p} dari {totalPages}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Koordinat Realtime Status */}
        <div className="p-4 rounded-2xl bg-[#faf8f5] dark:bg-zinc-800/50 border border-slate-200/80 dark:border-zinc-700/60 space-y-1.5 font-mono text-[11px]">
          <div className="flex justify-between text-slate-500">
            <span>Koordinat X (PDF pt):</span>
            <span className="font-bold text-slate-800 dark:text-zinc-200">
              {Math.round((posPercent.x / 100) * pdfDimensions.width)} pt
            </span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Koordinat Y (PDF pt):</span>
            <span className="font-bold text-slate-800 dark:text-zinc-200">
              {Math.round(
                pdfDimensions.height -
                  ((posPercent.y / 100) * pdfDimensions.height + qrSizePdf),
              )}{" "}
              pt
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
