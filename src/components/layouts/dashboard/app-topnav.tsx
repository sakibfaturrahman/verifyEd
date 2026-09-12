// src/components/layouts/dashboard/app-topnav.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Menu,
  Search,
  Bell,
  Plus,
  Award,
  CalendarPlus,
  ShieldAlert,
  ExternalLink,
  ChevronDown,
  User as UserIcon,
  Settings,
  LogOut,
  Clock,
  Sun,
  Moon,
  CheckCircle2,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";

interface AppTopNavProps {
  onOpenSidebar?: () => void;
  roleOverride?: "admin" | "user";
}

export function AppTopNav({ onOpenSidebar, roleOverride }: AppTopNavProps) {
  const { user, clearAuth } = useAuthStore();
  const [createOpen, setCreateOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const createRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Tentukan role aktif (prioritas: prop roleOverride -> Zustand -> default user)
  const currentRole =
    roleOverride || (user?.role === "admin" ? "admin" : "user");
  const isAdmin = currentRole === "admin";

  // Data pengguna aktif
  const userName = user?.name || (isAdmin ? "Administrator" : "Penyelenggara");
  const userEmail = user?.email || "akun@verifyed.id";
  const roleLabel = isAdmin ? "Super Admin" : "Organisasi";

  // Inisialisasi status Dark Mode
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

  // Tutup dropdown jika klik di luar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (createRef.current && !createRef.current.contains(target)) {
        setCreateOpen(false);
      }
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

  // Notifikasi kontekstual (Bahasa lebih santai untuk user)
  const notifications = isAdmin
    ? [
        {
          id: 1,
          title: "Verifikasi Berhasil",
          desc: "Dokumen CERT-2026-X89F lolos uji SHA-256 via portal publik.",
          time: "10 menit lalu",
          unread: true,
          type: "success",
        },
        {
          id: 2,
          title: "Pencabutan Kredensial",
          desc: "1 sertifikat ditandai revoked atas permohonan panitia.",
          time: "45 menit lalu",
          unread: true,
          type: "alert",
        },
      ]
    : [
        {
          id: 1,
          title: "Sertifikat Berhasil Diterbitkan",
          desc: "Batch sertifikat seminar Anda telah selesai dan siap diunduh.",
          time: "15 menit lalu",
          unread: true,
          type: "success",
        },
        {
          id: 2,
          title: "Pengecekan Baru",
          desc: "Seseorang baru saja memverifikasi sertifikat peserta Anda.",
          time: "1 jam lalu",
          unread: false,
          type: "info",
        },
      ];

  const handleLogout = () => {
    clearAuth();
    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-slate-200/80 dark:border-zinc-800 px-4 md:px-8 py-2.5 flex items-center justify-between select-none">
      {/* 1. SISI KIRI: Sidebar Toggle & Search Bar */}
      <div className="flex items-center flex-1 max-w-md gap-3 md:gap-4">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="p-2 transition-colors rounded-xl text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 md:hidden"
          aria-label="Buka Menu Navigasi"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Bar Sederhana */}
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

      {/* 2. SISI KANAN: Tanggal, Portal Link, Theme, Notifikasi, Action Button, & Profil */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Tanggal Hari Ini */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-zinc-900 text-[11px] font-medium text-slate-500 dark:text-zinc-400">
          <Clock className="w-3 h-3 text-slate-400" />
          <span>{today}</span>
        </div>

        {/* Link Portal Cek Sertifikat Publik */}
        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs font-semibold text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors"
        >
          <span>Halaman Cek</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {/* Toggle Mode Gelap / Terang */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 transition-colors border rounded-xl border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-900"
          aria-label="Ganti Tema"
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>

        {/* Notifikasi Popover */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 transition-colors border rounded-xl border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-900"
            aria-label="Notifikasi"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white dark:ring-zinc-950" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 z-50 p-3 mt-2 space-y-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xl w-80 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between px-2 py-1 border-b border-slate-100 dark:border-zinc-800">
                <span className="text-xs font-bold text-[#0e1738] dark:text-zinc-100">
                  {isAdmin
                    ? "Aktivitas Ledger Dokumen"
                    : "Pemberitahuan Terbaru"}
                </span>
                <button
                  type="button"
                  className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  Tandai Dibaca
                </button>
              </div>

              <div className="space-y-1 max-h-72 overflow-y-auto no-scrollbar">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-xl text-xs space-y-1 transition-colors ${
                      n.unread
                        ? "bg-indigo-50/60 dark:bg-indigo-950/30"
                        : "hover:bg-slate-50 dark:hover:bg-zinc-800/60"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-[#0e1738] dark:text-zinc-100 text-[11px]">
                      <span className="flex items-center gap-1.5">
                        {n.type === "success" && (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        )}
                        {n.type === "alert" && (
                          <ShieldAlert className="w-3 h-3 text-rose-500" />
                        )}
                        {n.title}
                      </span>
                      <span className="text-[9px] font-normal text-slate-400">
                        {n.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                      {n.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ACTION BUTTON (User: Tombol Langsung; Admin: Dropdown Menu Lengkap) */}
        {isAdmin ? (
          <div className="relative" ref={createRef}>
            <button
              type="button"
              onClick={() => setCreateOpen(!createOpen)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0e1738] hover:bg-[#1a254d] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Aksi Cepat</span>
              <ChevronDown
                className={`w-3 h-3 transition-transform ${
                  createOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {createOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xl p-1.5 space-y-0.5 z-50">
                <Link
                  href="/admin/certificates/new"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800"
                >
                  <Award className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Terbitkan Sertifikat</span>
                </Link>
                <Link
                  href="/admin/events/new"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800"
                >
                  <CalendarPlus className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Tambah Agenda Acara</span>
                </Link>
                <Link
                  href="/admin/certificates/revoke"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                  <span>Cabut Status Sertifikat</span>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/user/certificates/upload"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#122253] hover:bg-[#0e1738] text-white text-xs font-bold transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Buat Sertifikat</span>
          </Link>
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
                href={isAdmin ? "/admin/profile" : "/user/profile"}
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium transition-colors rounded-xl text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800"
              >
                <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                <span>Pengaturan Profil</span>
              </Link>

              <Link
                href={isAdmin ? "/admin/settings" : "/user/settings"}
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium transition-colors rounded-xl text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800"
              >
                <Settings className="w-3.5 h-3.5 text-slate-400" />
                <span>Pengaturan Akun</span>
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

// Export alias untuk kompatibilitas import lama
export const AdminTopNav = (props: AppTopNavProps) => (
  <AppTopNav {...props} roleOverride="admin" />
);

export const UserTopNav = (props: AppTopNavProps) => (
  <AppTopNav {...props} roleOverride="user" />
);
