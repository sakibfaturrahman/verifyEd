// src/features/settings/components/settings-tab-nav.tsx
"use client";

import { ShieldCheck, Sliders, Database, KeyRound, Bell } from "lucide-react";

export type SettingsTabType = "general" | "qr_config" | "security" | "storage";

interface SettingsTabNavProps {
  activeTab: SettingsTabType;
  onTabChange: (tab: SettingsTabType) => void;
}

export function SettingsTabNav({ activeTab, onTabChange }: SettingsTabNavProps) {
  const tabs = [
    { id: "general", label: "Umum & Platform", icon: Sliders },
    { id: "qr_config", label: "Parameter QR & Stempel", icon: ShieldCheck },
    { id: "security", label: "Kunci Akses API", icon: KeyRound },
    { id: "storage", label: "Retensi Ledger & Audit", icon: Database },
  ];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 border-b border-slate-200/90 dark:border-zinc-800">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id as SettingsTabType)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              isActive
                ? "bg-[#0e1738] dark:bg-zinc-100 text-white dark:text-[#0e1738] shadow-xs"
                : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800/60"
            }`}
          >
            <Icon size={14} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}