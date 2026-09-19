"use client";

import { ProfileIdentityCard } from "@/features/profile/components/profile-identity-card";
import { ProfileInfoForm } from "@/features/profile/components/profile-info-form";
import { ProfileSecurityForm } from "@/features/profile/components/profile-security-form";
import { useProfileQuery } from "@/features/profile/hooks/use-profile";
import { Loader2 } from "lucide-react";

export default function UserProfilePage() {
  const { data: profile, isLoading } = useProfileQuery();

  return (
    <div className="space-y-5">
      {/* Header Informasi Halaman */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-5 shadow-xs">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0e1738] dark:text-zinc-50">
          Pengaturan Profil Lembaga
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 font-medium">
          Kelola informasi nama instansi, alamat kontak, dan kata sandi akun
          penerbit sertifikat Anda.
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
            organizationName={profile?.name || "Nama Instansi Belum Diisi"}
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
    </div>
  );
}
