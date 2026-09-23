// src/app/(dashboard)/user/page.tsx
"use client";

import { useState } from "react";
import { UserWelcomeHeader } from "@/features/dashboard/components/user/user-welcome-header";
import { UserMetricsGrid } from "@/features/dashboard/components/user/user-metrics-grid";
import { UserRecentEventsBox } from "@/features/dashboard/components/user/user-recent-events-box";
import { UserGuideBox } from "@/features/dashboard/components/user/user-guide-box";
import { UserGuard } from "@/features/auth/components/user-guard";
import { useUserDashboardQuery } from "@/features/dashboard/hooks/use-user-dashboard";

export default function UserDashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data, isPending } = useUserDashboardQuery();

  return (
    <UserGuard>
      <div className="flex min-h-screen bg-[#faf8f5] dark:bg-zinc-950 font-sans antialiased">
        {/* 1. Sidebar Khusus User */}
       

        {/* 2. Workspace Area */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
          

          <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 xl:px-10 2xl:px-12 w-full max-w-[1680px] mx-auto space-y-4 sm:space-y-5">
            {/* Header Profil Organisasi */}
            <UserWelcomeHeader />

            {/* Grid Kartu Metrik Statistik Real-time */}
            <UserMetricsGrid stats={data?.stats} isPending={isPending} />

            {/* Grid Dua Kolom: Daftar Agenda Acara & Panduan Penerbitan */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch pb-6">
              <div className="lg:col-span-7">
                <UserRecentEventsBox />
              </div>
              <div className="lg:col-span-5">
                <UserGuideBox />
              </div>
            </div>
          </main>
        </div>
      </div>
    </UserGuard>
  );
}
