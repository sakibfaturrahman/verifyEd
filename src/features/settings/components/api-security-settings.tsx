// src/features/settings/components/api-security-settings.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { KeyRound, Copy, Check, RefreshCw } from "lucide-react";

export function ApiSecuritySettings() {
  const [copied, setCopied] = useState(false);
  const apiKey = "ved_live_9a7b8c2d1e0f3456789abcdef1234567";

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    toast.success("API Key Disalin", {
      description: "Kunci server berhasil disalin ke clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRotate = () => {
    toast.warning("Rotasi Kunci Akses", {
      description: "Fitur rotasi kunci akan meregenerasi token autentikasi endpoint[cite: 1].",
    });
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-6 shadow-xs space-y-6">
      <div>
        <h3 className="text-base font-bold text-[#0e1738] dark:text-zinc-100 flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-emerald-600" />
          <span>Kredensial Server & API Gateway</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 font-medium">
          Gunakan token Bearer untuk autentikasi endpoint REST API VerifyEd terproteksi[cite: 1].
        </p>
      </div>

      <div className="space-y-4 text-xs">
        <div>
          <label className="font-bold text-slate-700 dark:text-zinc-200 block mb-1.5">
            Kunci Akses Produksi (Production Secret Key)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="password"
              readOnly
              value={apiKey}
              className="flex-1 bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 font-mono text-slate-700 dark:text-zinc-200 select-all"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 font-semibold transition-colors"
            >
              {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              <span>{copied ? "Tersalin" : "Salin"}</span>
            </button>
            <button
              type="button"
              onClick={handleRotate}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-500 hover:text-slate-800 dark:hover:text-zinc-100 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
              title="Perbarui Kunci Akses"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        <div className="p-3.5 bg-slate-50 dark:bg-zinc-800/50 rounded-xl border border-slate-100 dark:border-zinc-800 leading-relaxed text-slate-500 dark:text-zinc-400">
          Semua endpoint tertutup mewajibkan header <code className="font-mono text-[#0e1738] dark:text-zinc-200">Authorization: Bearer &lt;access-token&gt;</code> sesuai spesifikasi OpenAPI[cite: 1].
        </div>
      </div>
    </div>
  );
}