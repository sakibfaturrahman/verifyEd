"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, RefreshCw, X, AlertCircle } from "lucide-react";

interface QrCameraScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onClose?: () => void;
}

export function QrCameraScanner({
  onScanSuccess,
  onClose,
}: QrCameraScannerProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(true);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const elementId = "qr-reader-viewport";

  useEffect(() => {
    const html5QrCode = new Html5Qrcode(elementId);
    scannerRef.current = html5QrCode;

    const startScanner = async () => {
      try {
        setIsStarting(true);
        setErrorMessage(null);

        await html5QrCode.start(
          { facingMode: "environment" }, // Prioritas kamera belakang smartphone
          {
            fps: 15,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
          },
          (decodedText) => {
            // Berhenti memindai setelah mendapatkan hasil pertama
            html5QrCode
              .stop()
              .then(() => {
                onScanSuccess(decodedText);
              })
              .catch(() => {
                onScanSuccess(decodedText);
              });
          },
          () => {
            // Callback saat frame belum menemukan QR (abaikan agar tidak spam error)
          },
        );
        setIsStarting(false);
      } catch (err: unknown) {
        setIsStarting(false);
        setErrorMessage(
          "Izin kamera ditolak atau kamera sedang digunakan aplikasi lain.",
        );
      }
    };

    startScanner();

    // Cleanup kamera saat modal ditutup atau tab berpindah
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, [onScanSuccess]);

  return (
    <div className="relative flex flex-col items-center bg-black/95 text-white p-4 rounded-2xl overflow-hidden max-w-sm mx-auto shadow-xl">
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-30 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
        >
          <X size={16} />
        </button>
      )}

      {/* Target Render Kamera */}
      <div
        id={elementId}
        className="w-full aspect-square rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 relative"
      />

      {isStarting && !errorMessage && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-zinc-950/80 z-20">
          <RefreshCw className="w-6 h-6 animate-spin text-indigo-400" />
          <span className="text-xs font-semibold">Menghubungkan Kamera...</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 mt-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
          <AlertCircle size={15} className="shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      <p className="text-[11px] text-zinc-400 text-center mt-3 leading-relaxed">
        Posisikan kode QR sertifikat di dalam kotak fokus. Sistem akan membaca
        token otomatis.
      </p>
    </div>
  );
}
