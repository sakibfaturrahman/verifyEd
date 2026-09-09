// src/app/(dashboard)/dashboard/profile/page.tsx
"use client";

import { useState } from "react";
import { UserSidebar } from "@/components/layouts/user/user-sidebar";
import { AdminTopNav } from "@/components/layouts/admin/admin-topnav";
import { ProfileIdentityCard } from "@/features/profile/components/profile-identity-card";
import { ProfileInfoForm } from "@/features/profile/components/profile-info-form";
import { ProfileSecurityForm } from "@/features/profile/components/profile-security-form";

export default function UserProfilePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#faf8f5] dark:bg-zinc-950 font-sans antialiased">
      {/* Sidebar Nav */}
      <UserSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <AdminTopNav onOpenSidebar={() => setIsSidebarOpen(true)} />

        <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 xl:px-10 2xl:px-12 w-full max-w-[1680px] mx-auto space-y-5">
          {/* Header Banner */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-5 shadow-xs">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0e1738] dark:text-zinc-50">
              Pengaturan Profil Lembaga
            </h1>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 font-medium">
              Konfigurasi data identitas organisasi dan kredensial keamanan akun
              penandatangan berkas[cite: 1].
            </p>
          </div>

          {/* Kartu Profil Identitas Utama */}
          <ProfileIdentityCard
            organizationName="Universitas Perjuangan"
            representativeEmail="akademik@unper.ac.id"
            roleBadge="Mitra Kampus Terakreditasi"
          />

          {/* Grid Dua Kolom: Informasi Lembaga & Keamanan Akun */}
          <div className="grid grid-cols-1 gap-5 pb-8">
            <ProfileInfoForm />
            <ProfileSecurityForm />
          </div>
        </main>
      </div>
    </div>
  );
}
