"use client";

import { useState } from "react";
import { AppSidebar } from "./app-sidebar";
import { AppTopNav } from "./app-topnav";

interface DashboardShellProps {
  children: React.ReactNode;
  role: "admin" | "user";
}

export function DashboardShell({ children, role }: DashboardShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#faf8f5] dark:bg-zinc-950 font-sans antialiased selection:bg-[#122253] selection:text-white">
      <AppSidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        roleOverride={role}
      />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <AppTopNav
          onOpenSidebar={() => setIsSidebarOpen(true)}
          roleOverride={role}
        />

        <main className="flex-1 px-4 py-5 sm:px-6 sm:py-7 lg:px-8 xl:px-10 w-full max-w-[1520px] mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
