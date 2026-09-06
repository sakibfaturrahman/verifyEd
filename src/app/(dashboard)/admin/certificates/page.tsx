// src/app/(dashboard)/admin/certificates/page.tsx
"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/layouts/admin/admin-sidebar";
import { AdminTopNav } from "@/components/layouts/admin/admin-topnav";
import { RevokeModal } from "@/features/certificates/components/revoke-modal";
import { QrConfigModal } from "@/features/certificates/components/qr-config-modal";
import {
  Award,
  Search,
  Filter,
  Download,
  QrCode,
  RefreshCw,
  Ban,
  FileCheck2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building,
  Hash,
} from "lucide-react";

// Mock data selaras dengan skema PostgreSQL `certificates` join `events`
const mockCertificates = [
  {
    id: "uuid-1",
    certificate_number: "CERT-20260901-7F2A9C01",
    recipient_name: "Muhammad Sakib Faturrahman",
    event_name: "National Tech Hackathon 2026",
    organizer: "Himpunan Mahasiswa Informatika",
    status: "active",
    issued_at: "01 Sep 2026",
    file_hash: "8f92a472c3...9b21f",
    has_generated_file: true,
  },
  {
    id: "uuid-2",
    certificate_number: "CERT-20260828-B410D9E2",
    recipient_name: "Kahfi Muhammad",
    event_name: "Workshop Cloud Native Microservices",
    organizer: "Pusat Riset Komputasi Awan",
    status: "active",
    issued_at: "28 Agu 2026",
    file_hash: "3c81e912f0...4d23a",
    has_generated_file: true,
  },
  {
    id: "uuid-3",
    certificate_number: "CERT-20260815-E882190A",
    recipient_name: "Surya Pratama",
    event_name: "Simposium Keamanan Siber Nasional",
    organizer: "Badan Siber Terpadu",
    status: "revoked",
    issued_at: "15 Agu 2026",
    file_hash: "aa771239c0...118bc",
    has_generated_file: false,
    revoke_reason: "Kesalahan identitas peserta & pergantian nomor induk",
  },
  {
    id: "uuid-4",
    certificate_number: "CERT-20260810-99AC412B",
    recipient_name: "Nopa Nurfadilah",
    event_name: "Seminar Nasional Kecerdasan Buatan",
    organizer: "Fakultas Ilmu Komputer",
    status: "active",
    issued_at: "10 Agu 2026",
    file_hash: "55f019b88a...ee782",
    has_generated_file: true,
  },
];

export default function CertificatesManagementPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "revoked">("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Modals state
  const [isRevokeOpen, setIsRevokeOpen] = useState(false);
  const [isQrConfigOpen, setIsQrConfigOpen] = useState(false);
  const [activeCert, setActiveCert] = useState<typeof mockCertificates[0] | null>(null);

  // Toggle selection
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(mockCertificates.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex min-h-screen bg-[#faf8f5] dark:bg-zinc-950 font-sans antialiased">
      <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <AdminTopNav onOpenSidebar={() => setIsSidebarOpen(true)} />

        <main className="flex-1 px-4 py-5 sm:px-8 lg:px-10 max-w-[1680px] w-full mx-auto space-y-6">
          
          {/* Header Baris Atas */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600">
                  <Award className="w-5 h-5" />
                </span>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#0e1738] dark:text-zinc-50">
                  Manajemen Sertifikat Digital
                </h1>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Daftar terpusat berkas aktif, token pemindai QR, dan riwayat integritas hash SHA-256.
              </p>
            </div>

            {/* Aksi Kolektif / Bulk Actions */}
            <div className="flex items-center gap-2.5">
              {selectedIds.length > 0 && (
                <button
                  onClick={() => {
                    setActiveCert(null);
                    setIsRevokeOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 text-xs font-bold transition-all"
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>Cabut ({selectedIds.length}) Terpilih</span>
                </button>
              )}

              <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0e1738] text-white text-xs font-bold hover:bg-[#1a254d] transition-all shadow-xs">
                <span>Unggah Massal (ZIP/Batch)</span>
              </button>
            </div>
          </div>

          {/* Baris Kontrol Filter & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Input Pencarian */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari ID sertifikat atau nama peserta..."
                className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl pl-10 pr-4 py-2 text-xs font-medium text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {/* Filter Status Selector */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <div className="flex p-1 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setStatusFilter("all")}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    statusFilter === "all" ? "bg-[#0e1738] text-white" : "text-slate-500 hover:text-black"
                  }`}
                >
                  Semua
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("active")}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    statusFilter === "active" ? "bg-[#0e1738] text-white" : "text-slate-500 hover:text-black"
                  }`}
                >
                  Aktif
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("revoked")}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    statusFilter === "revoked" ? "bg-[#0e1738] text-white" : "text-slate-500 hover:text-black"
                  }`}
                >
                  Dicabut
                </button>
              </div>
            </div>
          </div>

          {/* Tabel Sertifikat */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-800/40 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 pl-6 pr-3 w-10">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === mockCertificates.length}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-slate-300 text-[#0e1738]"
                      />
                    </th>
                    <th className="py-3.5 px-4">No. Seri Sertifikat</th>
                    <th className="py-3.5 px-4">Penerima Berkas</th>
                    <th className="py-3.5 px-4">Agenda / Penyelenggara</th>
                    <th className="py-3.5 px-4">Checksum Hash</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 pr-6 pl-4 text-right">Aksi Dokumen</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 text-xs">
                  {mockCertificates.map((cert) => {
                    const isSelected = selectedIds.includes(cert.id);
                    return (
                      <tr
                        key={cert.id}
                        className={`hover:bg-slate-50/60 dark:hover:bg-zinc-800/40 transition-colors ${
                          isSelected ? "bg-indigo-50/30 dark:bg-indigo-950/20" : ""
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="py-4 pl-6 pr-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectOne(cert.id)}
                            className="rounded border-slate-300 text-[#0e1738]"
                          />
                        </td>

                        {/* Certificate Number */}
                        <td className="py-4 px-4 font-mono font-bold text-[#0e1738] dark:text-zinc-100">
                          <div className="flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                            <span>{cert.certificate_number}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-sans font-normal mt-0.5">
                            Terbit: {cert.issued_at}
                          </div>
                        </td>

                        {/* Recipient */}
                        <td className="py-4 px-4 font-semibold text-slate-800 dark:text-zinc-200">
                          {cert.recipient_name}
                        </td>

                        {/* Event & Organizer */}
                        <td className="py-4 px-4">
                          <div className="font-medium text-slate-800 dark:text-zinc-200">
                            {cert.event_name}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Building className="w-3 h-3" />
                            <span>{cert.organizer}</span>
                          </div>
                        </td>

                        {/* Hash Digest */}
                        <td className="py-4 px-4 font-mono text-[11px] text-slate-500">
                          <div className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md w-fit">
                            <Hash className="w-3 h-3 text-slate-400" />
                            <span>{cert.file_hash}</span>
                          </div>
                        </td>

                        {/* Status Badge */}
                        <td className="py-4 px-4">
                          {cert.status === "active" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 text-[11px] font-bold border border-emerald-200 dark:border-emerald-800">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Aktif
                            </span>
                          ) : (
                            <span
                              title={cert.revoke_reason}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 text-[11px] font-bold border border-rose-200 dark:border-rose-800 cursor-help"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                              Dicabut
                            </span>
                          )}
                        </td>

                        {/* Actions Contextual Menu */}
                        <td className="py-4 pr-6 pl-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {/* Tombol Posisi QR */}
                            <button
                              type="button"
                              title="Konfigurasi Koordinat QR"
                              onClick={() => {
                                setActiveCert(cert);
                                setIsQrConfigOpen(true);
                              }}
                              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-indigo-600 transition-colors"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                            </button>

                            {/* Tombol Unduh PDF Berstempel */}
                            <button
                              type="button"
                              title="Unduh Berkas PDF Resmi"
                              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-emerald-600 transition-colors"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>

                            {/* Tombol Regenerasi File */}
                            <button
                              type="button"
                              title="Regenerasi Berkas (Update PDF tanpa ganti ID)"
                              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-sky-600 transition-colors"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                            </button>

                            {/* Tombol Cabut Berkas (Revoke) */}
                            {cert.status === "active" && (
                              <button
                                type="button"
                                title="Cabut Kredensial"
                                onClick={() => {
                                  setActiveCert(cert);
                                  setIsRevokeOpen(true);
                                }}
                                className="p-2 rounded-xl text-slate-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:text-rose-600 transition-colors"
                              >
                                <Ban className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-4 px-6 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs text-slate-500">
              <span>Menampilkan 1-4 dari 3.420 dokumen terdaftar</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled
                  className="p-2 rounded-xl border border-slate-200 dark:border-zinc-800 opacity-40 cursor-not-allowed"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="font-semibold text-slate-700 dark:text-zinc-300">Hal 1 dari 855</span>
                <button
                  type="button"
                  className="p-2 rounded-xl border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </main>
      </div>

      {/* Modal Dialogs */}
      <RevokeModal
        isOpen={isRevokeOpen}
        onClose={() => setIsRevokeOpen(false)}
        targetCount={activeCert ? 1 : selectedIds.length}
        certNumber={activeCert?.certificate_number}
        onConfirm={(reason) => {
          // Siap disambungkan ke `certificateService.revokeCertificate` atau `bulkRevoke`
          setSelectedIds([]);
        }}
      />

      <QrConfigModal
        isOpen={isQrConfigOpen}
        onClose={() => setIsQrConfigOpen(false)}
        certNumber={activeCert?.certificate_number}
      />
    </div>
  );
}