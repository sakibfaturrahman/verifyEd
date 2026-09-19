"use client";

import { IssuancePreferencesForm } from "@/features/settings/components/user/issuance-preferences-form";
import { AccountDangerZone } from "@/features/settings/components/user/account-danger-zone";

export default function UserSettingsPage() {
  return (
    <div className="space-y-5 pb-8">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-5 shadow-xs">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0e1738] dark:text-zinc-50">
          Pengaturan Akun & Preferensi Sistem
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 font-medium">
          Konfigurasi pola nomor sertifikat, kanal pemberitahuan audit, dan
          kontrol akses organisasi.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5">
        <IssuancePreferencesForm />
        <AccountDangerZone />
      </div>
    </div>
  );
}
