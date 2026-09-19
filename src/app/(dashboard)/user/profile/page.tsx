"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/layouts/dashboard/app-sidebar";
import { AppTopNav } from "@/components/layouts/dashboard/app-topnav";
import { UserGuard } from "@/features/auth/components/user-guard";
import { ProfileIdentityCard } from "@/features/profile/components/profile-identity-card";
import { ProfileInfoForm } from "@/features/profile/components/profile-info-form";
import { ProfileSecurityForm } from "@/features/profile/components/profile-security-form";
import { useProfileQuery } from "@/features/profile/hooks/use-profile";
import { Loader2 } from "lucide-react";

export default function UserProfilePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: profile, isLoading } = useProfileQuery();

  return (
    <UserGuard>
      <div className="flex min-h-screen bg-[#faf8f5] dark:bg-zinc-950 font-sans antialiased selection:bg-[#122253] selection:text-white">
        {/* Sidebar Navigasi */}
        <AppSidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          roleOverride="user"
        />

        {/* Ruang Kerja Utama */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
          <AppTopNav
            onOpenSidebar={() => setIsSidebarOpen(true)}
            roleOverride="user"
          />

          <main className="flex-1 px-4 py-5 sm:px-6 sm:py-7 lg:px-8 xl:px-10 w-full max-w-[1520px] mx-auto space-y-5">
            {/* Header Informasi Halaman */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-5 shadow-xs">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0e1738] dark:text-zinc-50">
                Pengaturan Profil Lembaga
              </h1>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 font-medium">
                Kelola informasi nama instansi, alamat kontak, dan kata sandi
                akun penerbit sertifikat Anda.
              </p>
            </div>

            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-2 text-slate-400">
                <Loader2 size={24} className="animate-spin text-[#122253]" />
                <span className="text-xs">Memuat data profil...</span>
              </div>
            ) : (
              <>
                {/* Kartu Status Lembaga */}
                <ProfileIdentityCard
                  organizationName={
                    profile?.name || "Nama Instansi Belum Diisi"
                  }
                  representativeEmail={profile?.email || "-"}
                  roleBadge={
                    profile?.role === "admin"
                      ? "Pengelola Utama"
                      : "Penyelenggara Terdaftar"
                  }
                  joinedAt={profile?.created_at}
                />

                {/* Formulir Informasi Lembaga & Ganti Sandi */}
                <div className="grid grid-cols-1 gap-5 pb-8">
                  <ProfileInfoForm initialData={profile} />
                  <ProfileSecurityForm />
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </UserGuard>
  );
}
