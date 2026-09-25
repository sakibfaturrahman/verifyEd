"use client";

import { useState } from "react";
import { toast } from "sonner";
import { UserEventToolbar } from "@/features/events/components/user/user-event-toolbar";
import { UserEventFormModal } from "@/features/events/components/user/user-event-form-modal";
import { UserEventDetailModal } from "@/features/events/components/user/user-event-detail-modal";
import { EventDeleteModal } from "@/features/events/components/event-delete-modal";
import {
  useUserEventsListQuery,
  useCreateUserEventMutation,
  useUpdateUserEventMutation,
  useDeleteUserEventMutation,
  UserEventItem,
} from "@/features/events/hooks/use-user-events";
import {
  CalendarDays,
  MapPin,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function UserEventsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "draft" | "ongoing" | "completed"
  >("all");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<UserEventItem | null>(null);
  const [detailEvent, setDetailEvent] = useState<UserEventItem | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<UserEventItem | null>(
    null,
  );

  const {
    data: response,
    isPending,
    isPlaceholderData,
  } = useUserEventsListQuery({
    page,
    limit,
    search: searchQuery,
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  const createMutation = useCreateUserEventMutation();
  const updateMutation = useUpdateUserEventMutation();
  const deleteMutation = useDeleteUserEventMutation();

  const events = response?.data || [];
  const meta = response?.meta || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  };

  const handleFormSubmit = (data: {
    name: string;
    organizer: string;
    event_date: string;
    location: string;
    description: string;
    status: "draft" | "ongoing" | "completed";
  }) => {
    if (editingEvent) {
      updateMutation.mutate(
        { id: editingEvent.id, payload: data },
        {
          onSuccess: (res) => {
            toast.success("Agenda Diperbarui", {
              description: `Perubahan data untuk "${res.data?.name || data.name}" berhasil disimpan.`,
            });
            setFormModalOpen(false);
            setEditingEvent(null);
          },
          onError: (err) => {
            toast.error("Gagal Memperbarui Agenda", {
              description:
                err.response?.data?.message || "Terjadi kendala teknis.",
            });
          },
        },
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: (res) => {
          toast.success("Agenda Didaftarkan", {
            description: `Acara "${res.data?.name || data.name}" berhasil dibuat.`,
          });
          setFormModalOpen(false);
        },
        onError: (err) => {
          toast.error("Gagal Membuat Agenda", {
            description:
              err.response?.data?.message || "Terjadi kendala teknis.",
          });
        },
      });
    }
  };

  const handleDeleteConfirm = (eventId: string) => {
    deleteMutation.mutate(eventId, {
      onSuccess: () => {
        toast.success("Agenda Dihapus", {
          description: "Agenda kegiatan berhasil dihapus dari sistem.",
        });
        setDeletingEvent(null);
      },
      onError: (err) => {
        toast.error("Gagal Menghapus Agenda", {
          description:
            err.response?.data?.message || "Terjadi kesalahan server.",
        });
      },
    });
  };

  const getStatusBadge = (status: UserEventItem["status"]) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-full">
            <CheckCircle2 size={12} />
            <span>Selesai</span>
          </span>
        );
      case "ongoing":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 px-2.5 py-0.5 rounded-full">
            <Clock size={12} />
            <span>Berlangsung</span>
          </span>
        );
      case "draft":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 px-2.5 py-0.5 rounded-full">
            <AlertCircle size={12} />
            <span>Draf</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-5 shadow-xs">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0e1738] dark:text-zinc-50">
          Agenda Acara Lembaga
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 font-medium">
          Kelola daftar seminar, kompetisi, dan pelatihan resmi yang terhubung
          dengan penerbitan sertifikat.
        </p>
      </div>

      <UserEventToolbar
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
        onOpenCreate={() => {
          setEditingEvent(null);
          setFormModalOpen(true);
        }}
      />

      <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/30 text-[11px] font-bold text-slate-400 dark:text-zinc-500">
                <th className="py-3.5 px-4">Nama Agenda Kegiatan</th>
                <th className="py-3.5 px-4">Tanggal Pelaksanaan</th>
                <th className="py-3.5 px-4">Lokasi Acara</th>
                <th className="py-3.5 px-4">Status Acara</th>
                <th className="py-3.5 px-4 text-center">Sertifikat Terbit</th>
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
                      <span>Mengambil data agenda acara Anda...</span>
                    </div>
                  </td>
                </tr>
              ) : events.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-slate-400 font-medium"
                  >
                    Belum ada agenda acara yang terdaftar atau cocok dengan
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
                        {evt.description || "Tidak ada deskripsi tambahan."}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays size={13} className="text-slate-400" />
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
                    <td className="py-3.5 px-4 text-slate-600 dark:text-zinc-300">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={13} className="text-slate-400" />
                        <span>
                          {evt.location || "Daring / Tidak Ditentukan"}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(evt.status)}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-800 dark:text-zinc-200 font-mono">
                      {evt.certificatesCount ??
                        (evt as any).certificates_count ??
                        (evt as any).totalCertificates ??
                        (evt as any).total_certificates ??
                        (evt as any).certificates?.[0]?.count ??
                        0}{" "}
                      Dokumen
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setDetailEvent(evt)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#0e1738] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                          title="Lihat Detail"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingEvent(evt);
                            setFormModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors cursor-pointer"
                          title="Edit Agenda"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingEvent(evt)}
                          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                          title="Hapus Agenda"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs text-slate-500">
          <div>
            Total:{" "}
            <span className="font-bold text-slate-700 dark:text-zinc-200">
              {meta.total}
            </span>{" "}
            Agenda Acara
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

      <UserEventFormModal
        isOpen={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setEditingEvent(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingEvent}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <UserEventDetailModal
        event={detailEvent}
        onClose={() => setDetailEvent(null)}
        onEdit={(e) => {
          setDetailEvent(null);
          setEditingEvent(e);
          setFormModalOpen(true);
        }}
      />

      <EventDeleteModal
        event={deletingEvent}
        onClose={() => setDeletingEvent(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
