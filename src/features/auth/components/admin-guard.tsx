// src/features/auth/components/admin-guard.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { ShieldAlert, Loader2 } from "lucide-react";

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);

  // Tunggu rehidrasi store dari localStorage selesai
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    // Belum login sama sekali -> Arahkan ke /login
    if (!isAuthenticated || !user) {
      router.replace("/login");
      return;
    }

    // Login tapi bukan admin -> Tolak akses dan kembalikan ke workspace user
    if (user.role !== "admin") {
      router.replace("/user");
    }
  }, [isHydrated, isAuthenticated, user, router]);

  // Tampilkan layar loading minimalis saat sesi sedang divalidasi
  if (!isHydrated || !isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#faf8f5] dark:bg-zinc-950 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-sm max-w-sm text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center text-amber-600">
            <ShieldAlert size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-extrabold text-[#0e1738] dark:text-zinc-100">
              Verifikasi Otoritas Admin
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Memeriksa hak akses kredensial akun Anda...
            </p>
          </div>
          <Loader2 className="w-5 h-5 animate-spin text-[#122253] dark:text-zinc-200 mt-2" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
