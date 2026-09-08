// src/app/(dashboard)/admin/users/page.tsx
"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { AdminSidebar } from "@/components/layouts/admin/admin-sidebar";
import { AdminTopNav } from "@/components/layouts/admin/admin-topnav";
import { UserTableToolbar } from "@/features/users/components/user-table-toolbar";
import { UserDetailModal } from "@/features/users/components/user-detail-modal";
import { UserOrganizationItem } from "@/features/users/types/user.types";
import {
  Building2,
  Mail,
  Award,
  CheckCircle2,
  XCircle,
  Eye,
  Power,
  ShieldCheck,
} from "lucide-react";

const initialMockUsers: UserOrganizationItem[] = [
  {
    id: "usr-001",
    name: "Universitas Perjuangan",
    email: "akademik@unper.ac.id",
    phone: "+62 812-3456-7890",
    address: "Jl. Pembela Tanah Air No. 177, Tasikmalaya",
    description:
      "Institusi pendidikan tinggi terakreditasi pengelola program sertifikasi kompetensi.",
    role: "user",
    status: "active",
    totalEvents: 6,
    totalCertificates: 2450,
    createdAt: "2026-01-15",
  },
  {
    id: "usr-002",
    name: "GDG Cloud Tasikmalaya",
    email: "lead@gdgtasikmalaya.org",
    phone: "+62 857-1122-3344",
    address: "Tasikmalaya, Jawa Barat",
    description:
      "Komunitas resmi pengembang Google Cloud & AI di wilayah Priangan Timur.",
    role: "user",
    status: "active",
    totalEvents: 3,
    totalCertificates: 420,
    createdAt: "2026-02-10",
  },
  {
    id: "usr-003",
    name: "Tech Academy Indonesia",
    email: "contact@techacademy.id",
    phone: "+62 821-9988-7766",
    address: "Jakarta Selatan",
    description:
      "Platform bootcamp vokasi dan rekayasa perangkat lunak intensif bersertifikat.",
    role: "user",
    status: "inactive",
    totalEvents: 1,
    totalCertificates: 85,
    createdAt: "2026-03-01",
  },
];

export default function AdminUsersPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [users, setUsers] = useState<UserOrganizationItem[]>(initialMockUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  // State Modal
  const [activeDetailUser, setActiveDetailUser] =
    useState<UserOrganizationItem | null>(null);

  // Filter Data
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchQuery =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.address &&
          u.address.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchStatus = statusFilter === "all" || u.status === statusFilter;
      return matchQuery && matchStatus;
    });
  }, [users, searchQuery, statusFilter]);

  // Handler Toggle Status Akun (Aktif / Suspend)
  const handleToggleStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === "active" ? "inactive" : "active";
          toast.success("Status Akun Diperbarui", {
            description: `Akun "${u.name}" sekarang berstatus ${
              nextStatus === "active" ? "Aktif" : "Nonaktif / Dibekukan"
            }.`,
          });
          return { ...u, status: nextStatus };
        }
        return u;
      }),
    );

    if (activeDetailUser && activeDetailUser.id === userId) {
      setActiveDetailUser((prev) =>
        prev
          ? {
              ...prev,
              status: prev.status === "active" ? "inactive" : "active",
            }
          : null,
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#faf8f5] dark:bg-zinc-950 font-sans antialiased">
      {/* 1. Sidebar Nav */}
      <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* 2. Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <AdminTopNav onOpenSidebar={() => setIsSidebarOpen(true)} />

        <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 xl:px-10 2xl:px-12 w-full max-w-[1680px] mx-auto space-y-4 sm:space-y-5">
          {/* Header Banner */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-5 shadow-xs">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0e1738] dark:text-zinc-50">
              Organisasi & Penyelenggara Terdaftar
            </h1>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 font-medium">
              Kelola profil mitra penyelenggara acara, audit izin penerbitan
              berkas, dan kontrol status hak akses.
            </p>
          </div>

          {/* Modular Toolbar */}
          <UserTableToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            onOpenCreateUser={() => {
              toast.info("Pendaftaran Manual", {
                description:
                  "Silakan arahkan pengguna ke portal registrasi resmi.",
              });
            }}
          />

          {/* Data Table */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/30 text-[11px] font-bold text-slate-400 dark:text-zinc-500">
                    <th className="py-3.5 px-4">Nama Instansi & Perwakilan</th>
                    <th className="py-3.5 px-4">Email Akun</th>
                    <th className="py-3.5 px-4 text-center">Total Agenda</th>
                    <th className="py-3.5 px-4 text-center">
                      Sertifikat Terbit
                    </th>
                    <th className="py-3.5 px-4">Status Akun</th>
                    <th className="py-3.5 px-4">Terdaftar Sejak</th>
                    <th className="py-3.5 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 text-xs">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-12 text-center text-slate-400 font-medium"
                      >
                        Tidak ada pengguna atau instansi yang sesuai dengan
                        pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr
                        key={u.id}
                        className="hover:bg-slate-50/70 dark:hover:bg-zinc-800/40 transition-colors"
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-zinc-800 text-[#0e1738] dark:text-zinc-200 flex items-center justify-center font-bold text-xs border border-slate-200 dark:border-zinc-700">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-[#0e1738] dark:text-zinc-100">
                                {u.name}
                              </div>
                              <div className="text-[11px] text-slate-400 line-clamp-1">
                                {u.address || "Domisili belum dicantumkan"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-zinc-300">
                          {u.email}
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-slate-700 dark:text-zinc-200 font-mono">
                          {u.totalEvents} Event
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-slate-700 dark:text-zinc-200 font-mono">
                          {u.totalCertificates.toLocaleString()} Dokumen
                        </td>
                        <td className="py-3.5 px-4">
                          {u.status === "active" ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Aktif</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 px-2.5 py-0.5 rounded-full">
                              <XCircle className="w-3 h-3" />
                              <span>Nonaktif</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-500 dark:text-zinc-400">
                          {u.createdAt}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setActiveDetailUser(u)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-[#0e1738] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                              title="Lihat Detail Profil"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(u.id)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                u.status === "active"
                                  ? "text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                  : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                              }`}
                              title={
                                u.status === "active"
                                  ? "Bekukan Akun"
                                  : "Aktifkan Akun"
                              }
                            >
                              <Power className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Modal Detail User */}
      <UserDetailModal
        user={activeDetailUser}
        onClose={() => setActiveDetailUser(null)}
        onToggleStatus={handleToggleStatus}
      />
    </div>
  );
}
