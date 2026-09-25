"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Menu,
  Search,
  Bell,
  ExternalLink,
  ChevronDown,
  User as UserIcon,
  LogOut,
  Clock,
  Sun,
  Moon,
  CheckCircle2,
  FileWarning,
  UserPlus,
  Layers,
  Loader2,
  CheckCheck,
  PartyPopper,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/stores/auth-store";
import { useProfileQuery } from "@/features/profile/hooks/use-profile";

export type NotificationType =
  | "tampered_document"
  | "suspicious_activity"
  | "revoked_access"
  | "bulk_issuance"
  | "bulk_revoke"
  | "new_registration"
  | "welcome"
  | "certificate_issued"
  | "bulk_upload_completed"
  | "certificate_revoked"
  | "processing_failed";

export type NotificationSeverity = "high" | "medium" | "low";

interface NotificationItemData {
  id: string;
  user_id: string | null;
  recipient_role: "admin" | "user" | "all";
  title: string;
  message: string;
  type: NotificationType;
  severity: NotificationSeverity;
  is_read: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
}

interface NotificationsApiResponse {
  notifications: NotificationItemData[];
  total: number;
  unreadCount: number;
}

interface AppTopNavProps {
  onOpenSidebar?: () => void;
  roleOverride?: "admin" | "user";
}

function formatRelativeTime(dateString: string): string {
  const diffInSeconds = Math.floor(
    (Date.now() - new Date(dateString).getTime()) / 1000,
  );
  if (diffInSeconds < 60) return "Baru saja";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} menit lalu`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} jam lalu`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} hari lalu`;
}

export function AppTopNav({ onOpenSidebar, roleOverride }: AppTopNavProps) {
  const queryClient = useQueryClient();
  const authStore = useAuthStore();
  const user = authStore.user;
  const token = (authStore as unknown as { token?: string }).token;
  const clearAuth = authStore.clearAuth;

  // Baca profil realtime dari server agar nama langsung sinkron saat di-update
  const { data: profile } = useProfileQuery();

  const [mounted, setMounted] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentRole =
    roleOverride || (profile?.role || user?.role === "admin" ? "admin" : "user");
  const isAdmin = currentRole === "admin";

  // Prioritaskan data profil server, lalu fallback ke auth store
  const userName =
    profile?.name || user?.name || (isAdmin ? "Administrator" : "Penyelenggara");
  const userEmail = profile?.email || user?.email || "akun@verifyed.id";
  const roleLabel = isAdmin ? "Super Admin" : "Organisasi";

  // Notifikasi hanya diaktifkan jika user terautentikasi DAN memiliki role admin
  const shouldFetchNotif = Boolean(
    mounted && isAdmin && user && (user.id || token),
  );

  const { data: notifData, isPending: isNotifLoading } =
    useQuery<NotificationsApiResponse>({
      queryKey: ["app-notifications"],
      queryFn: async () => {
        const res = await apiClient.get("/notifications", {
          params: { page: 1, limit: 10 },
        });
        const raw = res.data?.data;
        return {
          notifications: Array.isArray(raw?.notifications)
            ? raw.notifications
            : Array.isArray(raw?.data)
              ? raw.data
              : Array.isArray(raw)
                ? raw
                : [],
          total: Number(raw?.total ?? 0),
          unreadCount: Number(raw?.unreadCount ?? raw?.unread ?? 0),
        };
      },
      enabled: shouldFetchNotif,
      refetchInterval: 30000,
      staleTime: 1000 * 15,
      retry: (failureCount, error: unknown) => {
        const status = (error as { response?: { status?: number } })?.response
          ?.status;
        if (status === 401 || status === 403) return false;
        return failureCount < 2;
      },
    });

  const notifications = notifData?.notifications || [];
  const unreadCount = notifData?.unreadCount || 0;

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.patch(`/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["app-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["admin-notifications-page"] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      await apiClient.patch("/notifications/read-all");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["app-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["admin-notifications-page"] });
    },
  });

  useEffect(() => {
    const isDarkMode =
      localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (notifRef.current && !notifRef.current.contains(target)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const handleLogout = () => {
    clearAuth();
    window.location.href = "/login";
  };

  const renderNotifIcon = (
    type: NotificationType,
    severity: NotificationSeverity,
  ) => {
    if (
      severity === "high" ||
      type === "tampered_document" ||
      type === "processing_failed"
    ) {
      return <FileWarning className="w-3.5 h-3.5 text-rose-500 shrink-0" />;
    }
    if (
      type === "suspicious_activity" ||
      type === "revoked_access" ||
      type === "certificate_revoked"
    ) {
      return <ShieldAlert className="w-3.5 h-3.5 text-amber-500 shrink-0" />;
    }
    if (
      type === "bulk_issuance" ||
      type === "bulk_revoke" ||
      type === "bulk_upload_completed"
    ) {
      return <Layers className="w-3.5 h-3.5 text-indigo-500 shrink-0" />;
    }
    if (type === "new_registration") {
      return <UserPlus className="w-3.5 h-3.5 text-emerald-500 shrink-0" />;
    }
    if (type === "welcome") {
      return <PartyPopper className="w-3.5 h-3.5 text-fuchsia-500 shrink-0" />;
    }
    return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />;
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-slate-200/80 dark:border-zinc-800 px-4 md:px-8 py-2.5 flex items-center justify-between select-none">
      <div className="flex items-center flex-1 max-w-md gap-3 md:gap-4">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="p-2 transition-colors rounded-xl text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 md:hidden cursor-pointer"
          aria-label="Buka Menu Navigasi"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative hidden w-full sm:block">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            placeholder={
              isAdmin
                ? "Cari ID sertifikat, peserta, atau instansi..."
                : "Cari nama peserta atau judul sertifikat..."
            }
            className="w-full pl-9 pr-10 py-2 rounded-xl text-xs bg-slate-100 dark:bg-zinc-900 border border-transparent focus:border-slate-300 dark:focus:border-zinc-700 text-slate-900 dark:text-zinc-100 placeholder-slate-400 outline-none focus:bg-white dark:focus:bg-zinc-950 transition-all font-medium"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-zinc-900 text-[11px] font-medium text-slate-500 dark:text-zinc-400">
          <Clock className="w-3 h-3 text-slate-400" />
          <span>{today}</span>
        </div>

        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs font-semibold text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors"
        >
          <span>Halaman Cek</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 transition-colors border rounded-xl border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-900 cursor-pointer"
          aria-label="Ganti Tema"
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>

        {/* Dropdown Notifikasi - Khusus Admin */}
        {isAdmin && (
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 transition-colors border rounded-xl border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-900 cursor-pointer"
              aria-label="Notifikasi"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-rose-600 text-[9px] font-bold text-white shadow-xs">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 z-50 p-3 mt-2 space-y-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xl w-80 sm:w-96 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between px-2 py-1 border-b border-slate-100 dark:border-zinc-800">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#0e1738] dark:text-zinc-100">
                      Pemberitahuan
                    </span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 text-[9px] font-extrabold rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/40">
                        {unreadCount} baru
                      </span>
                    )}
                  </div>

                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={() => markAllAsReadMutation.mutate()}
                      disabled={markAllAsReadMutation.isPending}
                      className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer disabled:opacity-50"
                    >
                      <CheckCheck className="w-3 h-3" />
                      <span>Tandai Semua Dibaca</span>
                    </button>
                  )}
                </div>

                <div className="space-y-1.5 max-h-80 overflow-y-auto no-scrollbar">
                  {!mounted || !user ? (
                    <div className="py-8 text-center text-slate-400 text-xs">
                      Silakan masuk untuk melihat pemberitahuan.
                    </div>
                  ) : isNotifLoading ? (
                    <div className="py-8 flex flex-col items-center justify-center gap-2 text-slate-400">
                      <Loader2 className="w-4 h-4 animate-spin text-[#122253] dark:text-zinc-400" />
                      <span className="text-[11px]">
                        Memuat pemberitahuan...
                      </span>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs">
                      Tidak ada notifikasi saat ini.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          if (!n.is_read) markAsReadMutation.mutate(n.id);
                        }}
                        className={`p-2.5 rounded-xl text-xs space-y-1 transition-colors cursor-pointer border ${
                          !n.is_read
                            ? "bg-slate-50/80 dark:bg-zinc-800/60 border-slate-200/80 dark:border-zinc-700/80"
                            : "bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-zinc-800/40 opacity-70"
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold text-[#0e1738] dark:text-zinc-100 text-[11px]">
                          <span className="flex items-center gap-1.5 truncate pr-2">
                            {renderNotifIcon(n.type, n.severity)}
                            <span className="truncate">{n.title}</span>
                          </span>
                          <span className="text-[9px] font-normal text-slate-400 shrink-0">
                            {formatRelativeTime(n.created_at)}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                          {n.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-zinc-800">
                  <Link
                    href="/admin/notifications"
                    onClick={() => setNotifOpen(false)}
                    className="flex items-center justify-center gap-1.5 w-full py-1.5 text-center text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-zinc-800/50 rounded-xl transition-colors"
                  >
                    <span>Buka Halaman Notifikasi</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="h-6 w-px bg-slate-200 dark:bg-zinc-800 mx-0.5 hidden sm:block" />

        {/* Profil Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1 transition-colors rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-900 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#0e1738] dark:bg-zinc-100 text-white dark:text-[#0e1738] flex items-center justify-center font-bold text-xs shadow-xs border border-slate-200 dark:border-zinc-700">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden text-left md:block">
              <span className="block text-xs font-bold leading-tight text-[#0e1738] dark:text-zinc-100">
                {userName}
              </span>
              <span className="block text-[10px] text-slate-400 font-medium">
                {roleLabel}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xl p-1.5 space-y-1 z-50">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-zinc-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Masuk Sebagai
                </span>
                <p className="text-xs font-bold truncate text-[#0e1738] dark:text-zinc-100">
                  {userEmail}
                </p>
              </div>

              <Link
                href={isAdmin ? "/admin/users" : "/user/profile"}
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium transition-colors rounded-xl text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800"
              >
                <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                <span>Pengaturan Profil</span>
              </Link>

              <div className="pt-1 border-t border-slate-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 transition-colors rounded-xl dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar Akun</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export const AdminTopNav = (props: AppTopNavProps) => (
  <AppTopNav {...props} roleOverride="admin" />
);

export const UserTopNav = (props: AppTopNavProps) => (
  <AppTopNav {...props} roleOverride="user" />
);