// src/components/layouts/admin-topnav.tsx
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
  User,
  Settings,
  LogOut,
  Clock,
  Sun,
  Moon,
  CheckCircle2,
} from "lucide-react";

interface AdminTopNavProps {
  onOpenSidebar?: () => void;
  user?: {
    name?: string;
    email?: string;
    avatarUrl?: string;
    role?: string;
  };
}

export function AdminTopNav({ onOpenSidebar, user }: AdminTopNavProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const createRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Inisialisasi status Dark Mode dari DOM / LocalStorage
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

  // Toggle Mode Gelap / Terang
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

  // Tutup dropdown saat pengguna klik di luar area
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

  // Format Tanggal Redaksi Sistem
  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const notifications = [
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
    {
      id: 3,
      title: "Sinkronisasi Ledger Selesai",
      desc: "Snapshot audit 120 berkas wisuda berhasil diarsipkan.",
      time: "2 jam lalu",
      unread: false,
      type: "info",
    },
  ];

  const adminName = user?.name || "Sakib Faturrahman";
  const adminEmail = user?.email || "sakib@verifyed.id";
  const adminRole = user?.role || "Super Admin";

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-slate-200/80 dark:border-zinc-800 px-4 md:px-8 py-2.5 flex items-center justify-between select-none">
      {/* 1. SISI KIRI: Sidebar Toggle & Search Input Bar */}
      <div className="flex items-center flex-1 max-w-md gap-3 md:gap-4">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="p-2 transition-colors rounded-xl text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 md:hidden"
          aria-label="Buka Menu Navigasi"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Bar dengan Shortcut ⌘K */}
        <div className="relative hidden w-full sm:block">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            placeholder="Cari ID sertifikat, nama penerima, atau instansi..."
            className="w-full pl-9 pr-14 py-2 rounded-xl text-xs bg-slate-100 dark:bg-zinc-900 border border-transparent focus:border-slate-300 dark:focus:border-zinc-700 text-slate-900 dark:text-zinc-100 placeholder-slate-400 outline-none focus:bg-white dark:focus:bg-zinc-950 transition-all font-medium"
          />
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
            <kbd className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 rounded border border-slate-300 dark:border-zinc-700">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* 2. SISI KANAN: Tanggal, Web Portal, Theme, Notifikasi, Aksi Buat, & Profil */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Status Tanggal Sistem */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-zinc-900 text-[11px] font-medium text-slate-500 dark:text-zinc-400">
          <Clock className="w-3 h-3 text-slate-400" />
          <span>{today}</span>
        </div>

        {/* Live Portal Publik Link */}
        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs font-semibold text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors"
        >
          <span>Portal Publik</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {/* Toggle Dark / Light Theme */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 transition-colors border rounded-xl border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-900"
          aria-label="Ganti Tema Tampilan"
          title={isDark ? "Beralih ke Mode Terang" : "Beralih ke Mode Gelap"}
        >
          {isDark ? (
            <Sun className="w-4 h-4 transition-transform duration-300 text-amber-400 hover:rotate-90" />
          ) : (
            <Moon className="w-4 h-4 transition-transform duration-300 text-slate-600 hover:-rotate-12" />
          )}
        </button>

        {/* Dropdown Notifikasi */}
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
            <div className="absolute right-0 z-50 p-3 mt-2 space-y-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xl w-80 sm:w-88 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between px-2 py-1 border-b border-slate-100 dark:border-zinc-800">
                <span className="text-xs font-bold text-[#0e1738] dark:text-zinc-100">
                  Aktivitas Ledger Dokumen
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

        {/* Dropdown "+ Buat Baru" */}
        <div className="relative" ref={createRef}>
          <button
            type="button"
            onClick={() => setCreateOpen(!createOpen)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0e1738] hover:bg-[#1a254d] dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-[#0e1738] text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Terbitkan</span>
            <ChevronDown
              className={`w-3 h-3 transition-transform ${
                createOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {createOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xl p-1.5 space-y-0.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <Link
                href="/admin/certificates/new"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <Award className="w-3.5 h-3.5 text-indigo-600" />
                <span>Terbitkan Sertifikat</span>
              </Link>
              <Link
                href="/admin/events/new"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <CalendarPlus className="w-3.5 h-3.5 text-emerald-600" />
                <span>Tambah Agenda Acara</span>
              </Link>
              <Link
                href="/admin/certificates/revoke"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                <span>Cabut Status Kredensial</span>
              </Link>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-slate-200 dark:bg-zinc-800 mx-0.5 hidden sm:block" />

        {/* Dropdown Profil Administrator */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1 transition-colors rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-900"
          >
            <div className="w-8 h-8 rounded-full bg-[#0e1738] text-white flex items-center justify-center font-bold text-xs shadow-xs border border-slate-200 dark:border-zinc-700">
              {adminName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden text-left md:block">
              <span className="block text-xs font-bold leading-tight text-[#0e1738] dark:text-zinc-100">
                {adminName}
              </span>
              <span className="block text-[10px] text-slate-400 font-medium lowercase">
                {adminRole}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xl p-1.5 space-y-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-zinc-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Otoritas Terverifikasi
                </span>
                <p className="text-xs font-bold truncate text-[#0e1738] dark:text-zinc-100">
                  {adminEmail}
                </p>
              </div>

              <Link
                href="/admin/profile"
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium transition-colors rounded-xl text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800"
              >
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Pengaturan Profil</span>
              </Link>

              <Link
                href="/admin/settings"
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium transition-colors rounded-xl text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800"
              >
                <Settings className="w-3.5 h-3.5 text-slate-400" />
                <span>Konfigurasi Server</span>
              </Link>

              <div className="pt-1 border-t border-slate-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => {
                    // Penanganan logout sesi auth
                    window.location.href = "/login";
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 transition-colors rounded-xl dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar Sesi</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
