"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { Loader2 } from "lucide-react";

export function UserGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    // 1. Belum login maka Lempar ke login
    if (!isAuthenticated || !user) {
      router.replace("/login");
      return;
    }

    // 2. Jika Admin mencoba buka halaman User maka Kembalikan ke workspace Admin
    if (user.role === "admin") {
      router.replace("/admin");
    }
  }, [isHydrated, isAuthenticated, user, router]);

  // Cegah rendering konten jika bukan user biasa
  if (!isHydrated || !isAuthenticated || user?.role !== "user") {
    return (
      <div className="min-h-screen bg-[#faf8f5] dark:bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#122253] dark:text-zinc-200" />
      </div>
    );
  }

  return <>{children}</>;
}
