// src/app/(dashboard)/admin/certificates/page.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AppSidebar } from "@/components/layouts/dashboard/app-sidebar";
import { AppTopNav } from "@/components/layouts/dashboard/app-topnav";
import { CertTableToolbar } from "@/features/certificates/components/admin/cert-table-toolbar";
import { CertDetailModal } from "@/features/certificates/components/admin/cert-detail-modal";
import { CertRevokeModal } from "@/features/certificates/components/admin/cert-revoke-modal";
import {
  useAdminCertificatesListQuery,
  useBulkRevokeCertificatesMutation,
  fetchCertificateDownloadUrl,
  CertificateItem,
} from "@/features/certificates/hooks/use-admin-certificates";
import {
  CheckCircle2,
  XCircle,
  Eye,
  Download,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function AdminCertificatesPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "revoked"
  >("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const limit = 10;

  // State Modal
  const [activeDetailCert, setActiveDetailCert] =
    useState<CertificateItem | null>(null);
  const [revokeModalOpen, setRevokeModalOpen] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // TanStack Query: Ambil data sertifikat seluruh instansi
  const {
    data: response,
    isPending,
    isPlaceholderData,
  } = useAdminCertificatesListQuery({
    page,
    limit,
    search: searchQuery,
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  // Mutasi Bulk Revoke
  const bulkRevokeMutation = useBulkRevokeCertificatesMutation();

  const certs = response?.data || [];
  const meta = response?.meta || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  };

  // Checkbox Selection
  const toggleSelectAll = () => {
    if (selectedIds.length === certs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(certs.map((c) => c.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  // Unduh Berkas Tunggal via Signed URL Supabase Storage
  const handleDownloadSingle = async (certId: string, certNumber: string) => {
    try {
      setDownloadingId(certId);
      const url = await fetchCertificateDownloadUrl(certId);
      window.open(url, "_blank");
      toast.success("Mengunduh Berkas", {
        description: `Dokumen ${certNumber}.pdf dibuka di jendela baru.`,
      });
    } catch {
      toast.error("Gagal Memuat Berkas", {
        description:
          "Dokumen asli atau yang bertanda barcode belum tersedia di penyimpanan.",
      });
    } finally {
      setDownloadingId(null);
    }
  };

  // Unduh Banyak Berkas (Buka signed URL secara terurut)
  const handleBulkDownload = async () => {
    toast.loading("Menyiapkan tautan unduhan...", { duration: 1500 });
    for (const id of selectedIds) {
      try {
        const url = await fetchCertificateDownloadUrl(id);
        window.open(url, "_blank");
      } catch {
        // Lanjutkan jika salah satu file tidak ditemukan
      }
    }
    setSelectedIds([]);
  };

  // Eksekusi Pencabutan Massal
  const handleConfirmRevoke = (reason: string) => {
    bulkRevokeMutation.mutate(
      { certificateIds: selectedIds, reason },
      {
        onSuccess: (res) => {
          toast.error("Status Kredensial Dicabut", {
            description: `${res.data?.revoked || selectedIds.length} sertifikat telah ditandai dicabut.`,
          });
          setRevokeModalOpen(false);
          setSelectedIds([]);
        },
        onError: (err) => {
          toast.error("Gagal Mencabut Sertifikat", {
            description:
              err.response?.data?.message || "Terjadi kesalahan server.",
          });
        },
      },
    );
  };

  return (
    <div className="flex min-h-screen bg-[#faf8f5] dark:bg-zinc-950 font-sans antialiased selection:bg-[#0e1738] selection:text-white">
      <AppSidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        roleOverride="admin"
      />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <AppTopNav
          onOpenSidebar={() => setIsSidebarOpen(true)}
          roleOverride="admin"
        />

        <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 xl:px-10 2xl:px-12 w-full max-w-[1680px] mx-auto space-y-4 sm:space-y-5">
          {/* Header Banner */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-5 shadow-xs">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0e1738] dark:text-zinc-50">
              Audit & Pengawasan Sertifikat
            </h1>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 font-medium">
              Panel pantau seluruh sertifikat yang diterbitkan oleh institusi.
              Sebagai admin, Anda bertindak sebagai pengawas integritas berkas
              dan otoritas pencabutan.
            </p>
          </div>

          {/* Modular Toolbar */}
          <CertTableToolbar
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
            selectedCount={selectedIds.length}
            onBulkDownload={handleBulkDownload}
            onOpenBulkRevoke={() => setRevokeModalOpen(true)}
          />

          {/* Data Table */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/30 text-[11px] font-bold text-slate-400 dark:text-zinc-500">
                    <th className="p-4 w-12 text-center">
                      <input
                        type="checkbox"
                        checked={
                          selectedIds.length === certs.length &&
                          certs.length > 0
                        }
                        onChange={toggleSelectAll}
                        className="rounded border-slate-300 text-[#0e1738] focus:ring-[#0e1738]/20 cursor-pointer"
                      />
                    </th>
                    <th className="py-3.5 px-4">Nomor Kredensial</th>
                    <th className="py-3.5 px-4">Nama Penerima</th>
                    <th className="py-3.5 px-4">Agenda & Instansi</th>
                    <th className="py-3.5 px-4">Integritas Hash (SHA-256)</th>
                    <th className="py-3.5 px-4">Status Dokumen</th>
                    <th className="py-3.5 px-4">Tanggal Terbit</th>
                    <th className="py-3.5 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 text-xs">
                  {isPending ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-14 text-center text-slate-400 font-medium"
                      >
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin text-[#122253]" />
                          <span>Mengambil daftar seluruh sertifikat...</span>
                        </div>
                      </td>
                    </tr>
                  ) : certs.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-12 text-center text-slate-400 font-medium"
                      >
                        Tidak ada sertifikat yang cocok dengan parameter
                        pencarian.
                      </td>
                    </tr>
                  ) : (
                    certs.map((cert) => {
                      const isSelected = selectedIds.includes(cert.id);
                      return (
                        <tr
                          key={cert.id}
                          className={`hover:bg-slate-50/70 dark:hover:bg-zinc-800/40 transition-colors ${
                            isSelected
                              ? "bg-indigo-50/30 dark:bg-indigo-950/20"
                              : ""
                          }`}
                        >
                          <td className="p-4 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectOne(cert.id)}
                              className="rounded border-slate-300 text-[#0e1738] focus:ring-[#0e1738]/20 cursor-pointer"
                            />
                          </td>
                          <td className="py-3.5 px-4 font-mono">
                            <div className="font-bold text-[#0e1738] dark:text-zinc-100">
                              {cert.certificate_number}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate max-w-[130px]">
                              Token: {cert.qr_token}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-zinc-200">
                            {cert.recipient_name}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-medium text-slate-800 dark:text-zinc-200">
                              {cert.events?.name || "Agenda Umum"}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {cert.events?.organizer || "-"}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 dark:text-zinc-400">
                            {cert.file_hash ? (
                              <span
                                className="truncate inline-block max-w-[110px]"
                                title={cert.file_hash}
                              >
                                {cert.file_hash.slice(0, 8)}...
                                {cert.file_hash.slice(-6)}
                              </span>
                            ) : (
                              <span className="text-slate-400 italic">
                                Belum di-hash
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            {cert.status === "active" ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-full">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Aktif</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 px-2.5 py-0.5 rounded-full">
                                <XCircle className="w-3 h-3" />
                                <span>Dicabut</span>
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-500 dark:text-zinc-400">
                            {new Date(cert.issued_at).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setActiveDetailCert(cert)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-[#0e1738] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                                title="Lihat Rincian & Hash"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                disabled={downloadingId === cert.id}
                                onClick={() =>
                                  handleDownloadSingle(
                                    cert.id,
                                    cert.certificate_number,
                                  )
                                }
                                className="p-1.5 rounded-lg text-slate-500 hover:text-[#0e1738] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-50"
                                title="Unduh File Sertifikat"
                              >
                                {downloadingId === cert.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Download className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
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
                Sertifikat Terdaftar
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
      <CertDetailModal
        cert={activeDetailCert}
        onClose={() => setActiveDetailCert(null)}
      />
      <CertRevokeModal
        isOpen={revokeModalOpen}
        onClose={() => setRevokeModalOpen(false)}
        selectedCount={selectedIds.length}
        onConfirm={handleConfirmRevoke}
        isRevoking={bulkRevokeMutation.isPending}
      />
    </div>
  );
}
