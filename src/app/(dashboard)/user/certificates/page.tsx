"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AppSidebar } from "@/components/layouts/dashboard/app-sidebar";
import { AppTopNav } from "@/components/layouts/dashboard/app-topnav";
import { UserCertToolbar } from "@/features/certificates/components/user/user-cert-toolbar";
import { UserCertDetailModal } from "@/features/certificates/components/user/user-cert-detail-modal";
import { CertRevokeModal } from "@/features/certificates/components/user/cert-revoke-modal";
import { UserGuard } from "@/features/auth/components/user-guard";
import {
  useUserCertificatesListQuery,
  useRevokeUserCertMutation,
  useRegenerateCertMutation,
  fetchUserCertDownloadUrl,
  UserCertificateItem,
} from "@/features/certificates/hooks/use-user-certificates";
import {
  CheckCircle2,
  XCircle,
  Eye,
  Download,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function UserCertificatesPage() {
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
    useState<UserCertificateItem | null>(null);
  const [revokeModalOpen, setRevokeModalOpen] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // TanStack Query: Fetching Sertifikat Milik User
  const {
    data: response,
    isPending,
    isPlaceholderData,
  } = useUserCertificatesListQuery({
    page,
    limit,
    search: searchQuery,
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  // Mutasi
  const revokeMutation = useRevokeUserCertMutation();
  const regenerateMutation = useRegenerateCertMutation();

  const certs = response?.data || [];
  const meta = response?.meta || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  };

  // Checkbox Handlers
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

  // Unduh Berkas Tunggal
  const handleDownloadSingle = async (certId: string, certNumber: string) => {
    try {
      setDownloadingId(certId);
      toast.loading("Mempersiapkan tautan unduhan...", { id: `dl-${certId}` });

      const url = await fetchUserCertDownloadUrl(certId);
      if (!url) throw new Error("URL berkas tidak ditemukan.");

      // Gunakan tag anchor tersembunyi untuk unduhan langsung tanpa blokir popup
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.download = `${certNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Unduhan Berhasil", {
        id: `dl-${certId}`,
        description: `Dokumen ${certNumber}.pdf berhasil diunduh.`,
      });
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      toast.error("Gagal Mengunduh", {
        id: `dl-${certId}`,
        description:
          axiosErr.response?.data?.message ||
          "Berkas masih dalam proses finalisasi penyimpanan. Silakan klik kembali.",
      });
    } finally {
      setDownloadingId(null);
    }
  };

  // Unduh Terpilih
  const handleBulkDownload = async () => {
    toast.loading("Membuka unduhan berkas terpilih...", { duration: 1500 });
    for (const id of selectedIds) {
      try {
        const url = await fetchUserCertDownloadUrl(id);
        window.open(url, "_blank");
      } catch {
        // Lanjutkan unduhan item berikutnya
      }
    }
    setSelectedIds([]);
  };

  // Konfirmasi Pencabutan Kredensial
  const handleConfirmRevoke = async (reason: string) => {
    if (selectedIds.length === 0) return;

    try {
      // Eksekusi revoke untuk setiap sertifikat yang dipilih
      for (const id of selectedIds) {
        await revokeMutation.mutateAsync({ id, reason });
      }

      toast.error("Sertifikat Telah Dicabut", {
        description: `${selectedIds.length} sertifikat telah dinonaktifkan di portal publik.`,
      });
      setRevokeModalOpen(false);
      setSelectedIds([]);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      toast.error("Gagal Mencabut Sertifikat", {
        description:
          axiosErr.response?.data?.message ||
          "Terjadi kendala saat membatalkan dokumen.",
      });
    }
  };

  // Regenerasi Berkas
  const handleRegenerateFile = (certId: string, file: File) => {
    regenerateMutation.mutate(
      { id: certId, file },
      {
        onSuccess: (res) => {
          toast.success("Dokumen Berhasil Diperbarui", {
            description: `File PDF baru untuk ${res.data?.certificate_number} berhasil digenerasi ulang.`,
          });
          setActiveDetailCert(null);
        },
        onError: (err) => {
          toast.error("Gagal Memperbarui Berkas", {
            description:
              err.response?.data?.message || "Format berkas tidak valid.",
          });
        },
      },
    );
  };

  return (
    <UserGuard>
      <div className="flex min-h-screen bg-[#faf8f5] dark:bg-zinc-950 font-sans antialiased selection:bg-[#122253] selection:text-white">
        {/* Sidebar Nav (User Mode) */}
        <AppSidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          roleOverride="user"
        />

        {/* Workspace Area */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
          <AppTopNav
            onOpenSidebar={() => setIsSidebarOpen(true)}
            roleOverride="user"
          />

          <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 xl:px-10 2xl:px-12 w-full max-w-[1680px] mx-auto space-y-4 sm:space-y-5">
            {/* Header Banner */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-5 shadow-xs">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0e1738] dark:text-zinc-50">
                Portofolio Sertifikat Diterbitkan
              </h1>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 font-medium">
                Kelola dokumen yang telah dibubuhi barcode verifikasi dan pantau
                status keabsahannya secara langsung.
              </p>
            </div>

            {/* Modular Toolbar */}
            <UserCertToolbar
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
                      <th className="py-3.5 px-4">Agenda Terkait</th>
                      <th className="py-3.5 px-4">Tanggal Diterbitkan</th>
                      <th className="py-3.5 px-4">Status</th>
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
                            <span>Mengambil data sertifikat...</span>
                          </div>
                        </td>
                      </tr>
                    ) : certs.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-12 text-center text-slate-400 font-medium"
                        >
                          Belum ada sertifikat yang cocok dengan kriteria
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
                            <td className="py-3.5 px-4 text-slate-700 dark:text-zinc-300">
                              {cert.events?.name || "Agenda Umum"}
                            </td>
                            <td className="py-3.5 px-4 font-mono text-slate-500">
                              {new Date(cert.issued_at).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
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
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setActiveDetailCert(cert)}
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-[#0e1738] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                                  title="Lihat Rincian"
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
                                  title="Unduh Berkas"
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
                  Sertifikat
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
        <UserCertDetailModal
          cert={activeDetailCert}
          onClose={() => setActiveDetailCert(null)}
          onDownload={handleDownloadSingle}
          onRegenerateFile={handleRegenerateFile}
          isRegenerating={regenerateMutation.isPending}
        />
        <CertRevokeModal
          isOpen={revokeModalOpen}
          onClose={() => setRevokeModalOpen(false)}
          selectedCount={selectedIds.length}
          onConfirm={handleConfirmRevoke}
          isRevoking={revokeMutation.isPending}
        />
      </div>
    </UserGuard>
  );
}
