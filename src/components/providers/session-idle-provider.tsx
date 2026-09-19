"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useIdleTimer } from "@/hooks/use-idle-timer";
import { apiClient } from "@/lib/api-client";

export function SessionIdleProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleSessionExpired = async () => {
    try {
      // Panggil endpoint logout backend untuk menghapus cookie/session jika ada
      await apiClient.post("/auth/logout").catch(() => {});
    } finally {
      // Bersihkan local storage / session storage
      localStorage.removeItem("auth-storage");
      sessionStorage.clear();

      toast.error("Sesi Berakhir", {
        description: "Anda tidak aktif selama 30 menit. Silakan masuk kembali.",
      });

      router.replace("/login?expired=true");
    }
  };

  // Aktifkan pemantau 30 menit
  useIdleTimer({
    timeoutInMinutes: 30,
    onTimeout: handleSessionExpired,
  });

  return <>{children}</>;
}
