// src/app/(dashboard)/admin/users/page.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AppSidebar } from "@/components/layouts/dashboard/app-sidebar";
import { AppTopNav } from "@/components/layouts/dashboard/app-topnav";
import { UserTableToolbar } from "@/features/users/components/user-table-toolbar";
import { UserDetailModal } from "@/features/users/components/user-detail-modal";
import {
  useAdminUsersListQuery,
  useUpdateUserStatusMutation,
  UserProfileRow,
} from "@/features/users/hooks/use-admin-users";
import {
  CheckCircle2,
  XCircle,
  Eye,
  Power,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";

export default function AdminUsersPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "user">("all");
  const [page, setPage] = useState(1);
  const limit = 10;

  // State Modal Detail
  const [activeDetailUser, setActiveDetailUser] =
    useState<UserProfileRow | null>(null);

  // TanStack Query: Fetch data user riil dari backend
  const {
    data: response,
    isPending,
    isPlaceholderData,
  } = useAdminUsersListQuery({
    page,
    limit,
    search: searchQuery,
    status: statusFilter === "all" ? undefined : statusFilter,
    role: roleFilter === "all" ? undefined : roleFilter,
  });

  // Mutasi: Ubah Status User
  const updateStatusMutation = useUpdateUserStatusMutation();

  const users = response?.data || [];
  const meta = response?.meta || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  };

  const handleToggleStatus = (
    userId: string,
    currentStatus: "active" | "inactive",
  ) => {
    const nextStatus: "active" | "inactive" =
      currentStatus === "active" ? "inactive" : "active";

    updateStatusMutation.mutate(
      { userId, status: nextStatus },
      {
        onSuccess: (res) => {
          toast.success("Status Akun Diperbarui", {
            description:
              res.message ||
              `Status akun berhasil diubah menjadi ${nextStatus}.`,
          });
          if (activeDetailUser && activeDetailUser.id === userId) {
            setActiveDetailUser((prev) =>
              prev ? { ...prev, status: nextStatus } : null,
            );
          }
        },
        onError: (err) => {
          toast.error("Gagal Memperbarui Status", {
            description:
              err.response?.data?.message || "Terjadi kesalahan pada server.",
          });
        },
      },
    );
  };

  return (
    <div className="flex min-h-screen bg-[#faf8f5] dark:bg-zinc-950 font-sans antialiased selection:bg-[#0e1738] selection:text-white">
      {/* 1. Sidebar Nav */}
      <AppSidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        roleOverride="admin"
      />

      {/* 2. Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <AppTopNav
          onOpenSidebar={() => setIsSidebarOpen(true)}
          roleOverride="admin"
        />

        <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 xl:px-10 2xl:px-12 w-full max-w-[1680px] mx-auto space-y-4 sm:space-y-5">
          {/* Header Banner */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-5 shadow-xs">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0e1738] dark:text-zinc-50">
              Organisasi & Pengguna Terdaftar
            </h1>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 font-medium">
              Kelola profil mitra penyelenggara acara, audit hak akses instansi,
              dan kelola status akun.
            </p>
          </div>

          {/* Modular Toolbar */}
          <UserTableToolbar
            searchQuery={searchQuery}
            onSearchChange={(val) => {
              setSearchQuery(val);
              setPage(1); // Reset ke halaman pertama saat mencari
            }}
            statusFilter={statusFilter}
            onStatusFilterChange={(val) => {
              setStatusFilter(val);
              setPage(1);
            }}
            roleFilter={roleFilter}
            onRoleFilterChange={(val) => {
              setRoleFilter(val);
              setPage(1);
            }}
          />

          {/* Data Table */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/30 text-[11px] font-bold text-slate-400 dark:text-zinc-500">
                    <th className="py-3.5 px-4">Nama Instansi / User</th>
                    <th className="py-3.5 px-4">Email Resmi</th>
                    <th className="py-3.5 px-4 text-center">
                      Hak Akses (Role)
                    </th>
                    <th className="py-3.5 px-4">Status Akun</th>
                    <th className="py-3.5 px-4">Tanggal Bergabung</th>
                    <th className="py-3.5 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 text-xs">
                  {isPending ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-14 text-center text-slate-400 font-medium"
                      >
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin text-[#122253]" />
                          <span>Mengambil data pengguna...</span>
                        </div>
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-12 text-center text-slate-400 font-medium"
                      >
                        Tidak ada pengguna atau instansi yang cocok dengan
                        kriteria pencarian.
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr
                        key={u.id}
                        className="hover:bg-slate-50/70 dark:hover:bg-zinc-800/40 transition-colors"
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-zinc-800 text-[#0e1738] dark:text-zinc-200 flex items-center justify-center font-bold text-xs border border-slate-200 dark:border-zinc-700 shrink-0">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-[#0e1738] dark:text-zinc-100">
                                {u.name}
                              </div>
                              <div className="text-[11px] text-slate-400 line-clamp-1">
                                {u.address || "Domisili belum ditentukan"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-zinc-300">
                          {u.email}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              u.role === "admin"
                                ? "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-800"
                                : "bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300"
                            }`}
                          >
                            {u.role === "admin"
                              ? "Administrator"
                              : "Penyelenggara"}
                          </span>
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
                          {new Date(u.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setActiveDetailUser(u)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-[#0e1738] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                              title="Lihat Detail Profil"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              disabled={updateStatusMutation.isPending}
                              onClick={() => handleToggleStatus(u.id, u.status)}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50 ${
                                u.status === "active"
                                  ? "text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                  : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                              }`}
                              title={
                                u.status === "active"
                                  ? "Nonaktifkan Akun"
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

            {/* Pagination Controls */}
            <div className="px-4 py-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs text-slate-500">
              <div>
                Total:{" "}
                <span className="font-bold text-slate-700 dark:text-zinc-200">
                  {meta.total}
                </span>{" "}
                Organisasi / Pengguna
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1 || isPlaceholderData}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft size={15} />
                </button>
                <span className="font-medium text-slate-600 dark:text-zinc-300">
                  Halaman {meta.page} dari {meta.totalPages || 1}
                </span>
                <button
                  type="button"
                  disabled={page >= meta.totalPages || isPlaceholderData}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal Detail User */}
      <UserDetailModal
        user={activeDetailUser}
        onClose={() => setActiveDetailUser(null)}
        onToggleStatus={handleToggleStatus}
        isStatusUpdating={updateStatusMutation.isPending}
      />
    </div>
  );
}
