"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { Loader2 } from "lucide-react";

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

  // Tampilkan hanya loading spinner saat sesi sedang divalidasi
  if (!isHydrated || !isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#faf8f5] dark:bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#122253] dark:text-zinc-200" />
      </div>
    );
  }

  return <>{children}</>;
}