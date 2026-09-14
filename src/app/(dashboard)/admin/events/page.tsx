// src/app/(dashboard)/admin/events/page.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AppSidebar } from "@/components/layouts/dashboard/app-sidebar";
import { AppTopNav } from "@/components/layouts/dashboard/app-topnav";
import { EventTableToolbar } from "@/features/events/components/event-table-toolbar";
import { EventDetailModal } from "@/features/events/components/event-detail-modal";
import { EventDeleteModal } from "@/features/events/components/event-delete-modal";
import {
  useAdminEventsListQuery,
  useDeleteEventMutation,
  EventItem,
} from "@/features/events/hooks/use-admin-events";
import {
  CalendarDays,
  MapPin,
  Building2,
  Eye,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function AdminEventsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "draft" | "ongoing" | "completed"
  >("all");
  const [page, setPage] = useState(1);
  const limit = 10;

  // State Modal
  const [activeDetailEvent, setActiveDetailEvent] = useState<EventItem | null>(
    null,
  );
  const [activeDeleteEvent, setActiveDeleteEvent] = useState<EventItem | null>(
    null,
  );

  // TanStack Query: Fetch Events Real-time
  const {
    data: response,
    isPending,
    isPlaceholderData,
  } = useAdminEventsListQuery({
    page,
    limit,
    search: searchQuery,
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  // Mutasi Hapus Event
  const deleteMutation = useDeleteEventMutation();

  const events = response?.data || [];
  const meta = response?.meta || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  };

  const handleDeleteEvent = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Agenda Acara Dihapus", {
          description: "Data kegiatan berhasil dihapus dari sistem.",
        });
        setActiveDeleteEvent(null);
      },
      onError: (err) => {
        toast.error("Gagal Menghapus Agenda", {
          description:
            err.response?.data?.message || "Terjadi kesalahan server.",
        });
      },
    });
  };

  const getStatusBadge = (status: EventItem["status"]) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" />
            <span>Selesai</span>
          </span>
        );
      case "ongoing":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 px-2.5 py-0.5 rounded-full">
            <Clock className="w-3 h-3" />
            <span>Berlangsung</span>
          </span>
        );
      case "draft":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 px-2.5 py-0.5 rounded-full">
            <AlertCircle className="w-3 h-3" />
            <span>Draf</span>
          </span>
        );
    }
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
              Agenda Acara & Instansi
            </h1>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 font-medium">
              Daftar seluruh agenda pelatihan, kompetisi, dan seminar terdaftar
              dari seluruh organisasi penerbit.
            </p>
          </div>

          {/* Modular Toolbar */}
          <EventTableToolbar
            searchQuery={searchQuery}
            onSearchChange={(val) => {
              setSearchQuery(val);
              setPage(1);
            }}
            statusFilter={statusFilter}
            onStatusFilterChange={(val) => {
              setStatusFilter(val);
              setPage(1);
            }}
          />

          {/* Data Table */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/30 text-[11px] font-bold text-slate-400 dark:text-zinc-500">
                    <th className="py-3.5 px-4">Nama Agenda</th>
                    <th className="py-3.5 px-4">Instansi Penyelenggara</th>
                    <th className="py-3.5 px-4">Tanggal Acara</th>
                    <th className="py-3.5 px-4">Lokasi Pelaksanaan</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-center">
                      Sertifikat Terbit
                    </th>
                    <th className="py-3.5 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 text-xs">
                  {isPending ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-14 text-center text-slate-400 font-medium"
                      >
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin text-[#122253]" />
                          <span>Mengambil daftar agenda acara...</span>
                        </div>
                      </td>
                    </tr>
                  ) : events.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-12 text-center text-slate-400 font-medium"
                      >
                        Tidak ada agenda acara yang cocok dengan kriteria
                        pencarian.
                      </td>
                    </tr>
                  ) : (
                    events.map((evt) => (
                      <tr
                        key={evt.id}
                        className="hover:bg-slate-50/70 dark:hover:bg-zinc-800/40 transition-colors"
                      >
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-[#0e1738] dark:text-zinc-100">
                            {evt.name}
                          </div>
                          <div className="text-[11px] text-slate-400 line-clamp-1 max-w-sm">
                            {evt.description || "Tidak ada rincian keterangan"}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-zinc-200">
                          <div className="flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{evt.organizer}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-zinc-400">
                          <div className="flex items-center gap-1.5">
                            <CalendarDays className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>
                              {new Date(evt.event_date).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 dark:text-zinc-400">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{evt.location || "Online"}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          {getStatusBadge(evt.status)}
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-slate-800 dark:text-zinc-200 font-mono">
                          {evt.certificatesCount || 0} Dokumen
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setActiveDetailEvent(evt)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-[#0e1738] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                              title="Lihat Detail Agenda"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveDeleteEvent(evt)}
                              className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                              title="Hapus Agenda"
                            >
                              <Trash2 className="w-4 h-4" />
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
                Agenda Kegiatan
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

      {/* Modals */}
      <EventDetailModal
        event={activeDetailEvent}
        onClose={() => setActiveDetailEvent(null)}
      />
      <EventDeleteModal
        event={activeDeleteEvent}
        onClose={() => setActiveDeleteEvent(null)}
        onConfirm={handleDeleteEvent}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
