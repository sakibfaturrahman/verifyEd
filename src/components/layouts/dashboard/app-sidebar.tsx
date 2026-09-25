"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  CalendarDays,
  Award,
  UploadCloud,
  Building2,
  X,
  PanelLeftClose,
  PanelLeft,
  ShieldCheck,
  Activity,
  BarChart3,
  Bell,
  History,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/stores/auth-store";

export interface NavMenuItem {
  id: string;
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: string | number | null;
}

export interface NavMenuGroup {
  title: string;
  items: NavMenuItem[];
}

export function AppSidebar({
  isOpen,
  setIsOpen,
  roleOverride,
}: {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  roleOverride?: "admin" | "user";
}) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const user = useAuthStore((state) => state.user);

  // Ambil jumlah notifikasi belum dibaca secara real-time
  const { data: notifData } = useQuery<{ unreadCount: number }>({
    queryKey: ["app-notifications"],
    queryFn: async () => {
      const res = await apiClient.get("/notifications", {
        params: { page: 1, limit: 1 },
      });
      const raw = res.data?.data;
      return {
        unreadCount: Number(raw?.unreadCount ?? raw?.unread ?? 0),
      };
    },
    enabled: Boolean(user && user.id),
    refetchInterval: 30000,
  });

  const unreadCount = notifData?.unreadCount || 0;
  const notifBadge =
    unreadCount > 0 ? (unreadCount > 99 ? "99+" : unreadCount) : null;

  // Deteksi role
  const currentRole =
    roleOverride || (user?.role === "admin" ? "admin" : "user");
  const isAdmin = currentRole === "admin";
  const homeHref = isAdmin ? "/admin" : "/user";

  const adminMenuGroups: NavMenuGroup[] = [
    {
      title: "Ikhtisar",
      items: [
        {
          id: "dashboard",
          icon: LayoutGrid,
          label: "Dashboard",
          href: "/admin",
        },
        {
          id: "statistics",
          icon: BarChart3,
          label: "Statistik & Laporan",
          href: "/admin/statistics",
        },
        {
          id: "alerts",
          icon: Bell,
          label: "Notifikasi Sistem",
          href: "/admin/notifications",
          badge: notifBadge,
        },
      ],
    },
    {
      title: "Manajemen Utama",
      items: [
        {
          id: "organizations",
          icon: Building2,
          label: "Organisasi & User",
          href: "/admin/users",
        },
        {
          id: "events",
          icon: CalendarDays,
          label: "Agenda & Event",
          href: "/admin/events",
        },
        {
          id: "certificates",
          icon: Award,
          label: "Daftar Sertifikat",
          href: "/admin/certificates",
        },
      ],
    },
    {
      title: "Audit & Sistem",
      items: [
        {
          id: "logs",
          icon: History,
          label: "Log Verifikasi",
          href: "/admin/logs",
        },
      ],
    },
  ];

  const userMenuGroups: NavMenuGroup[] = [
    {
      title: "Ikhtisar",
      items: [
        {
          id: "dashboard",
          icon: LayoutGrid,
          label: "Dashboard",
          href: "/user",
        },
        {
          id: "notifications",
          icon: Bell,
          label: "Pemberitahuan",
          href: "/user/notifications",
          badge: notifBadge,
        },
      ],
    },
    {
      title: "Manajemen Dokumen",
      items: [
        {
          id: "events",
          icon: CalendarDays,
          label: "Agenda Acara",
          href: "/user/events",
        },
        {
          id: "certificates",
          icon: Award,
          label: "Daftar Sertifikat",
          href: "/user/certificates",
        },
        {
          id: "upload",
          icon: UploadCloud,
          label: "Terbitkan Sertifikat",
          href: "/user/certificates/upload",
        },
      ],
    },
    {
      title: "Akun & Organisasi",
      items: [
        {
          id: "profile",
          icon: Building2,
          label: "Profil Organisasi",
          href: "/user/profile",
        },
      ],
    },
  ];

  const menuGroups = isAdmin ? adminMenuGroups : userMenuGroups;

  const SidebarBody = () => (
    <aside
      className={`relative flex flex-col h-screen bg-white dark:bg-zinc-950 border-r border-slate-200/90 dark:border-zinc-800 select-none z-40 overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isCollapsed ? "w-[76px] 2xl:w-[88px]" : "w-[260px] 2xl:w-[310px]"
      }`}
    >
      {/* 1. Header & Brand */}
      <div className="h-16 2xl:h-20 px-4 2xl:px-6 flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/80 shrink-0">
        <Link
          href={homeHref}
          className="flex items-center gap-3 overflow-hidden"
        >
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
                <span
                  className={`text-[10px] 2xl:text-xs font-semibold px-1.5 py-0.5 rounded ${
                    isAdmin
                      ? "text-slate-600 bg-slate-100 dark:bg-zinc-800 dark:text-zinc-300"
                      : "text-indigo-700 bg-indigo-50 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800"
                  }`}
                >
                  {isAdmin ? "Admin" : "Organisasi"}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>

        {/* Tombol Collapse Desktop */}
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex p-1.5 2xl:p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer"
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
          className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      {/* 2. Navigation Lists */}
      <div className="flex-1 overflow-y-auto px-3 2xl:px-4 py-4 2xl:py-6 space-y-5 2xl:space-y-7 no-scrollbar">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="space-y-1 2xl:space-y-1.5">
            {!isCollapsed ? (
              <p className="text-[11px] 2xl:text-xs font-semibold text-slate-400 dark:text-zinc-500 px-3 2xl:px-4 py-1">
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
                    <div className="relative shrink-0">
                      <Icon
                        className={`transition-colors w-4 h-4 2xl:w-5 2xl:h-5 ${
                          isActive
                            ? "text-white"
                            : "text-slate-400 dark:text-zinc-500 group-hover:text-slate-800 dark:group-hover:text-zinc-200"
                        }`}
                      />
                      {isCollapsed && Boolean(item.badge) && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-600 ring-2 ring-white dark:ring-zinc-950" />
                      )}
                    </div>

                    {!isCollapsed && (
                      <div className="flex items-center justify-between flex-1 truncate">
                        <span className="truncate">{item.label}</span>
                        {item.badge && (
                          <span
                            className={`text-[10px] 2xl:text-xs font-bold px-1.5 2xl:px-2 py-0.5 rounded-full ${
                              isActive
                                ? "bg-rose-600 text-white"
                                : "bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}

                    {isCollapsed && (
                      <div className="absolute left-full ml-3.5 px-2.5 2xl:px-3 py-1.5 rounded-lg bg-[#0e1738] text-white text-xs 2xl:text-sm font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity shadow-lg z-50 flex items-center gap-1.5">
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[9px] font-bold">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* 3. Footer Card */}
      <div className="p-3 2xl:p-4 border-t border-slate-100 dark:border-zinc-800/80 bg-slate-50/60 dark:bg-zinc-900/40">
        {!isCollapsed ? (
          isAdmin ? (
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
            <div className="p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#0e1738] dark:text-zinc-200">
                <span>Status Ledger</span>
                <span className="text-emerald-600">Aktif</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Koneksi repositori terenkripsi & siap menerbitkan dokumen.
              </p>
            </div>
          )
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
      <div className="hidden md:block sticky top-0 h-screen shrink-0 z-40">
        <SidebarBody />
      </div>

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

export const AdminSidebar = (props: {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}) => <AppSidebar {...props} roleOverride="admin" />;

export const UserSidebar = (props: {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}) => <AppSidebar {...props} roleOverride="user" />;
