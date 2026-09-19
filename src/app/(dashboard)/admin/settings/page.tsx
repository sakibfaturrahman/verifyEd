"use client";

import { useState } from "react";
import {
  SettingsTabNav,
  SettingsTabType,
} from "@/features/settings/components/settings-tab-nav";
import { QrProtocolSettings } from "@/features/settings/components/qr-protocol-settings";
import { ApiSecuritySettings } from "@/features/settings/components/api-security-settings";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTabType>("qr_config");

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-5 shadow-xs">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0e1738] dark:text-zinc-50">
          Konfigurasi Sistem & Protokol
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 font-medium">
          Kelola preferensi stempel verifikasi, integrasi kunci kriptografi, dan
          aturan keamanan platform.
        </p>
      </div>

      <SettingsTabNav activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="pt-1">
        {activeTab === "qr_config" && <QrProtocolSettings />}
        {activeTab === "security" && <ApiSecuritySettings />}
        {activeTab === "general" && (
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-8 text-center text-xs text-slate-400">
            Informasi identitas portal dan kontak redaksi telah terkonfigurasi
            otomatis.
          </div>
        )}
        {activeTab === "storage" && (
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-8 text-center text-xs text-slate-400">
            Retensi log audit verification disetel permanen (ledger tersimpan
            aman).
          </div>
        )}
      </div>
    </div>
  );
}
