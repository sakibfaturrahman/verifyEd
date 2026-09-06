// src/components/layouts/admin/admin-sidebar.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  Award,
  CalendarDays,
  ShieldCheck,
  FileCheck2,
  Users2,
  History,
  Settings,
  X,
  Bell,
  PanelLeftClose,
  PanelLeft,
  Activity,
} from "lucide-react";

const menuGroups = [
  {
    title: "Ikhtisar",
    items: [
      {
        id: "dashboard",
        icon: LayoutGrid,
        label: "Ringkasan",
        href: "/admin",
        badge: null,
      },
      {
        id: "alerts",
        icon: Bell,
        label: "Notifikasi",
        href: "/admin/notifikasi",
        badge: "3",
      },
    ],
  },
  {
    title: "Repositori",
    items: [
      {
        id: "certificates",
        icon: Award,
        label: "Antrean Sertifikat",
        href: "/admin/certificates",
        badge: null,
      },
      {
        id: "events",
        icon: CalendarDays,
        label: "Agenda & Instansi",
        href: "/admin/events",
        badge: null,
      },
      {
        id: "verifications",
        icon: FileCheck2,
        label: "Validasi Berkas",
        href: "/admin/verifikasi",
        badge: null,
      },
      {
        id: "logs",
        icon: History,
        label: "Riwayat Audit",
        href: "/admin/logs",
        badge: null,
      },
    ],
  },
  {
    title: "Kendali",
    items: [
      {
        id: "users",
        icon: Users2,
        label: "Kelola Akun",
        href: "/admin/users",
        badge: null,
      },
      {
        id: "security",
        icon: ShieldCheck,
        label: "Kunci Token",
        href: "/admin/keamanan",
        badge: null,
      },
      {
        id: "settings",
        icon: Settings,
        label: "Pengaturan",
        href: "/admin/settings",
        badge: null,
      },
    ],
  },
];

export function AdminSidebar({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const SidebarBody = () => (
    <aside
      className={`relative flex flex-col h-screen bg-white dark:bg-zinc-950 border-r border-slate-200/90 dark:border-zinc-800 select-none z-40 overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isCollapsed ? "w-[76px] 2xl:w-[88px]" : "w-[260px] 2xl:w-[310px]"
      }`}
    >
      {/* 1. Header & Brand */}
      <div className="h-16 2xl:h-20 px-4 2xl:px-6 flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/80 shrink-0">
        <Link href="/admin" className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 2xl:w-11 2xl:h-11 rounded-xl 2xl:rounded-2xl bg-[#0e1738] text-white flex items-center justify-center shrink-0 shadow-sm">
            <ShieldCheck className="w-5 h-5 2xl:w-6 2xl:h-6 text-slate-200" />
          </div>

          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                className="flex items-baseline gap-1.5 whitespace-nowrap"
              >
                <span className="font-extrabold text-base 2xl:text-xl tracking-tight text-[#0e1738] dark:text-zinc-100">
                  Verify<span className="text-[#3b5998]">Ed</span>
                </span>
                <span className="text-[10px] 2xl:text-xs font-semibold text-slate-600 bg-slate-100 dark:bg-zinc-800 dark:text-zinc-300 px-1.5 py-0.5 rounded">
                  Admin
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>

        {/* Tombol Collapse Desktop */}
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex p-1.5 2xl:p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800/60 transition-colors"
          title={isCollapsed ? "Buka Sidebar" : "Ciutkan Sidebar"}
        >
          {isCollapsed ? (
            <PanelLeft className="w-4 h-4 2xl:w-5 2xl:h-5" />
          ) : (
            <PanelLeftClose className="w-4 h-4 2xl:w-5 2xl:h-5" />
          )}
        </button>

        {/* Tombol Tutup Mobile */}
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
        >
          <X size={18} />
        </button>
      </div>

      {/* 2. Navigation Lists */}
      <div className="flex-1 overflow-y-auto px-3 2xl:px-4 py-4 2xl:py-6 space-y-5 2xl:space-y-7 no-scrollbar">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="space-y-1 2xl:space-y-1.5">
            {/* Group Label */}
            {!isCollapsed ? (
              <p className="text-[11px] 2xl:text-xs font-semibold text-slate-400 dark:text-zinc-500 px-3 2xl:px-4 py-1 tracking-normal">
                {group.title}
              </p>
            ) : (
              <div className="w-6 2xl:w-8 h-px bg-slate-200 dark:bg-zinc-800 mx-auto my-2" />
            )}

            <nav className="space-y-0.5 2xl:space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`relative flex items-center ${
                      isCollapsed
                        ? "justify-center px-0 py-2.5 2xl:py-3.5"
                        : "gap-3 2xl:gap-3.5 px-3 2xl:px-4 py-2.5 2xl:py-3"
                    } rounded-xl 2xl:rounded-2xl text-xs 2xl:text-sm font-semibold transition-all group ${
                      isActive
                        ? "bg-[#0e1738] text-white shadow-sm"
                        : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-900/60"
                    }`}
                  >
                    <Icon
                      className={`shrink-0 transition-colors w-4 h-4 2xl:w-5 2xl:h-5 ${
                        isActive
                          ? "text-white"
                          : "text-slate-400 dark:text-zinc-500 group-hover:text-slate-800 dark:group-hover:text-zinc-200"
                      }`}
                    />

                    {/* Label & Badge saat Expanded */}
                    {!isCollapsed && (
                      <div className="flex items-center justify-between flex-1 truncate">
                        <span className="truncate">{item.label}</span>
                        {item.badge && (
                          <span
                            className={`text-[10px] 2xl:text-xs font-bold px-1.5 2xl:px-2 py-0.5 rounded-full ${
                              isActive
                                ? "bg-white/20 text-white"
                                : "bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-300"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Tooltip Hover saat Collapsed */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-3.5 px-2.5 2xl:px-3 py-1.5 rounded-lg bg-[#0e1738] text-white text-xs 2xl:text-sm font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity shadow-lg z-50">
                        {item.label}
                      </div>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* 3. Footer System Status Card */}
      <div className="p-3 2xl:p-4 border-t border-slate-100 dark:border-zinc-800/80 bg-slate-50/60 dark:bg-zinc-900/40">
        {!isCollapsed ? (
          <div className="p-2.5 2xl:p-3.5 rounded-xl 2xl:rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between">
            <div className="flex items-center gap-2.5 2xl:gap-3">
              <span className="w-2 h-2 2xl:w-2.5 2xl:h-2.5 rounded-full bg-emerald-600 shrink-0" />
              <div>
                <p className="text-[11px] 2xl:text-xs font-bold text-[#0e1738] dark:text-zinc-200 leading-tight">
                  Node Primer
                </p>
                <p className="text-[10px] 2xl:text-[11px] text-slate-500">
                  SHA-256 Siaga
                </p>
              </div>
            </div>
            <Activity className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 text-slate-400" />
          </div>
        ) : (
          <div className="flex justify-center py-1 2xl:py-2">
            <span className="w-2 h-2 2xl:w-2.5 2xl:h-2.5 rounded-full bg-emerald-600" />
          </div>
        )}
      </div>
    </aside>
  );

  return (
    <>
      {/* Sidebar Desktop */}
      <div className="hidden md:block sticky top-0 h-screen shrink-0 z-40">
        <SidebarBody />
      </div>

      {/* Drawer Mobile */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative z-10"
            >
              <SidebarBody />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
