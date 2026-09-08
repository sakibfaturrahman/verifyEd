// src/app/(dashboard)/admin/events/page.tsx
"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { AdminSidebar } from "@/components/layouts/admin/admin-sidebar";
import { AdminTopNav } from "@/components/layouts/admin/admin-topnav";
import { EventTableToolbar } from "@/features/events/components/event-table-toolbar";
import { EventDetailModal } from "@/features/events/components/event-detail-modal";
import { EventDeleteModal } from "@/features/events/components/event-delete-modal";
import { EventItem } from "@/features/events/types/event.types";
import {
  CalendarDays,
  MapPin,
  Building2,
  Eye,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";

const initialMockEvents: EventItem[] = [
  {
    id: "evt-001",
    userId: "usr-01",
    name: "National Tech Hackathon 2026",
    organizer: "Universitas Perjuangan",
    description:
      "Kompetisi pemrograman 48 jam tingkat nasional dengan fokus inovasi AI & Web3.",
    eventDate: "2026-09-01",
    location: "Tasikmalaya / Hybrid",
    status: "completed",
    certificatesCount: 240,
    createdAt: "2026-08-10",
  },
  {
    id: "evt-002",
    userId: "usr-02",
    name: "AI & Cloud Architecture Summit 2026",
    organizer: "GDG Cloud Tasikmalaya",
    description:
      "Konferensi praktisi cloud mengenai arsitektur microservices dan serverless computing.",
    eventDate: "2026-09-15",
    location: "Gedung Rektorat Lt. 3",
    status: "ongoing",
    certificatesCount: 85,
    createdAt: "2026-08-20",
  },
  {
    id: "evt-003",
    userId: "usr-03",
    name: "Fullstack Web Development Bootcamp",
    organizer: "Tech Academy Indonesia",
    description:
      "Pelatihan intensif 12 minggu Next.js, Node.js, dan database PostgreSQL.",
    eventDate: "2026-10-01",
    location: "Daring (Zoom Meeting)",
    status: "draft",
    certificatesCount: 0,
    createdAt: "2026-09-02",
  },
];

export default function AdminEventsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [events, setEvents] = useState<EventItem[]>(initialMockEvents);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "draft" | "ongoing" | "completed"
  >("all");

  // State Modal
  const [activeDetailEvent, setActiveDetailEvent] = useState<EventItem | null>(
    null,
  );
  const [activeDeleteEvent, setActiveDeleteEvent] = useState<EventItem | null>(
    null,
  );

  // Filter Data Event
  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      const matchQuery =
        evt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === "all" || evt.status === statusFilter;
      return matchQuery && matchStatus;
    });
  }, [events, searchQuery, statusFilter]);

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setActiveDeleteEvent(null);
    toast.success("Agenda Dihapus", {
      description:
        "Data kegiatan beserta tautan sertifikat berhasil diarsipkan dari sistem.",
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
    <div className="flex min-h-screen bg-[#faf8f5] dark:bg-zinc-950 font-sans antialiased">
      {/* 1. Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* 2. Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <AdminTopNav onOpenSidebar={() => setIsSidebarOpen(true)} />

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
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            onOpenCreateModal={() => {
              toast.info("Fitur Tambah Event", {
                description: "Formulir registrasi event baru siap diisi.",
              });
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
                  {filteredEvents.length === 0 ? (
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
                            {evt.description}
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
                            <span>{evt.eventDate}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 dark:text-zinc-400">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{evt.location}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          {getStatusBadge(evt.status)}
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-slate-800 dark:text-zinc-200 font-mono">
                          {evt.certificatesCount} Dokumen
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setActiveDetailEvent(evt)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-[#0e1738] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                              title="Lihat Detail Agenda"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveDeleteEvent(evt)}
                              className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
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
      />
    </div>
  );
}
