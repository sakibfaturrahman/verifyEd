// src/app/(dashboard)/dashboard/events/page.tsx
"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { UserSidebar } from "@/components/layouts/user/user-sidebar";
import { AdminTopNav } from "@/components/layouts/admin/admin-topnav";
import { UserEventToolbar } from "@/features/events/components/user/user-event-toolbar";
import { UserEventFormModal } from "@/features/events/components/user/user-event-form-modal";
import { UserEventDetailModal } from "@/features/events/components/user/user-event-detail-modal";
import { EventDeleteModal } from "@/features/events/components/event-delete-modal";
import { EventItem } from "@/features/events/types/event.types";
import {
  CalendarDays,
  MapPin,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";

const initialOrganizationEvents: EventItem[] = [
  {
    id: "evt-u01",
    userId: "usr-001",
    name: "National Tech Hackathon 2026",
    organizer: "Universitas Perjuangan",
    description:
      "Kompetisi pemrograman intensif berskala nasional tingkat perguruan tinggi.",
    eventDate: "2026-09-01",
    location: "Gedung Rektorat Lt. 3 / Daring",
    status: "completed",
    certificatesCount: 100,
    createdAt: "2026-08-10",
  },
  {
    id: "evt-u02",
    userId: "usr-001",
    name: "Workshop Desain UI/UX & Design System",
    organizer: "Universitas Perjuangan",
    description:
      "Pelatihan penyusunan tokens dan komponen Figma bersama praktisi industri.",
    eventDate: "2026-09-15",
    location: "Laboratorium Komputer Terpadu",
    status: "ongoing",
    certificatesCount: 50,
    createdAt: "2026-08-25",
  },
  {
    id: "evt-u03",
    userId: "usr-001",
    name: "Yudisium Kelulusan Sarjana Semester Genap 2026",
    organizer: "Universitas Perjuangan",
    description:
      "Penerbitan surat kelulusan dan sertifikasi keahlian teknis sarjana komputer.",
    eventDate: "2026-10-10",
    location: "Auditorium Utama Universitas",
    status: "draft",
    certificatesCount: 0,
    createdAt: "2026-09-05",
  },
];

export default function UserEventsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [events, setEvents] = useState<EventItem[]>(initialOrganizationEvents);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "draft" | "ongoing" | "completed"
  >("all");

  // Modal State
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [detailEvent, setDetailEvent] = useState<EventItem | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<EventItem | null>(null);

  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      const matchQuery =
        evt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === "all" || evt.status === statusFilter;
      return matchQuery && matchStatus;
    });
  }, [events, searchQuery, statusFilter]);

  const handleFormSubmit = (data: Partial<EventItem>) => {
    if (editingEvent) {
      setEvents((prev) =>
        prev.map((e) =>
          e.id === editingEvent.id ? ({ ...e, ...data } as EventItem) : e,
        ),
      );
      toast.success("Agenda Diperbarui", {
        description: `Perubahan data untuk "${data.name}" berhasil disimpan.`,
      });
    } else {
      const newEvent: EventItem = {
        id: `evt-${Date.now()}`,
        userId: "usr-001",
        name: data.name || "Agenda Baru",
        organizer: "Universitas Perjuangan",
        description: data.description || "",
        eventDate: data.eventDate || "2026-09-10",
        location: data.location || "Kampus Pusat",
        status: data.status || "ongoing",
        certificatesCount: 0,
        createdAt: "2026-09-09",
      };
      setEvents((prev) => [newEvent, ...prev]);
      toast.success("Agenda Dibuat", {
        description: `Acara "${newEvent.name}" telah berhasil didaftarkan ke sistem.`,
      });
    }
    setFormModalOpen(false);
    setEditingEvent(null);
  };

  const handleDeleteConfirm = (eventId: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
    setDeletingEvent(null);
    toast.success("Agenda Dihapus", {
      description: "Agenda kegiatan berhasil dihapus dari arsip.",
    });
  };

  const getStatusBadge = (status: EventItem["status"]) => {
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
    <div className="flex min-h-screen bg-[#faf8f5] dark:bg-zinc-950 font-sans antialiased">
      {/* Sidebar Nav */}
      <UserSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <AdminTopNav
          onOpenSidebar={() => setIsSidebarOpen(true)}
          user={{
            name: "Aditya Pratama",
            email: "akademik@unper.ac.id",
            role: "Universitas Perjuangan",
          }}
        />

        <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 xl:px-10 2xl:px-12 w-full max-w-[1680px] mx-auto space-y-4 sm:space-y-5">
          {/* Header Banner */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-5 shadow-xs">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0e1738] dark:text-zinc-50">
              Agenda Acara Lembaga
            </h1>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 font-medium">
              Kelola daftar seminar, kompetisi, dan pelatihan resmi yang
              terhubung dengan penerbitan sertifikat[cite: 1].
            </p>
          </div>

          {/* Toolbar */}
          <UserEventToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            onOpenCreate={() => {
              setEditingEvent(null);
              setFormModalOpen(true);
            }}
          />

          {/* Table View */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/30 text-[11px] font-bold text-slate-400 dark:text-zinc-500">
                    <th className="py-3.5 px-4">Nama Agenda Kegiatan</th>
                    <th className="py-3.5 px-4">Pelaksanaan</th>
                    <th className="py-3.5 px-4">Lokasi Acara</th>
                    <th className="py-3.5 px-4">Status Acara</th>
                    <th className="py-3.5 px-4 text-center">
                      Sertifikat Terbit
                    </th>
                    <th className="py-3.5 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 text-xs">
                  {filteredEvents.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-12 text-center text-slate-400 font-medium"
                      >
                        Belum ada agenda acara yang terdaftar atau cocok dengan
                        pencarian[cite: 1].
                      </td>
                    </tr>
                  ) : (
                    filteredEvents.map((evt) => (
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
                            <CalendarDays
                              size={13}
                              className="text-slate-400"
                            />
                            <span>{evt.eventDate}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 dark:text-zinc-300">
                          <div className="flex items-center gap-1.5">
                            <MapPin size={13} className="text-slate-400" />
                            <span>{evt.location}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          {getStatusBadge(evt.status)}
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-slate-800 dark:text-zinc-200 font-mono">
                          {evt.certificatesCount} Dokumen[cite: 1]
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setDetailEvent(evt)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-[#0e1738] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
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
                              className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
                              title="Edit Agenda"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingEvent(evt)}
                              className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
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
          </div>
        </main>
      </div>

      {/* Modals Form, Detail, & Delete */}
      <UserEventFormModal
        isOpen={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setEditingEvent(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingEvent}
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
      />
    </div>
  );
}
