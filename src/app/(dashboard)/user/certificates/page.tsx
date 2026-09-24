"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { UserCertToolbar } from "@/features/certificates/components/user/user-cert-toolbar";
import { UserCertDetailModal } from "@/features/certificates/components/user/user-cert-detail-modal";
import { CertRevokeModal } from "@/features/certificates/components/user/cert-revoke-modal";
import { CertDeleteModal } from "@/features/certificates/components/user/cert-delete-modal";
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
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function UserCertificatesPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "revoked"
  >("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const limit = 10;

  const [activeDetailCert, setActiveDetailCert] =
    useState<UserCertificateItem | null>(null);
  const [revokeModalOpen, setRevokeModalOpen] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // State untuk Custom Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [targetDeleteCert, setTargetDeleteCert] =
    useState<UserCertificateItem | null>(null);

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

  const revokeMutation = useRevokeUserCertMutation();
  const regenerateMutation = useRegenerateCertMutation();

  // Mutasi Hapus Tunggal / Massal
  const deleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      // Hapus berurutan atau paralel
      await Promise.all(ids.map((id) => apiClient.delete(`/certificates/${id}`)));
    },
    onSuccess: (_, deletedIds) => {
      toast.success("Penghapusan Berhasil", {
        description: `${deletedIds.length} sertifikat dan berkas PDF fisik telah dimusnahkan.`,
      });
      setSelectedIds((prev) => prev.filter((id) => !deletedIds.includes(id)));
      setDeleteModalOpen(false);
      setTargetDeleteCert(null);
      queryClient.invalidateQueries({ queryKey: ["user-certificates"] });
      queryClient.invalidateQueries({ queryKey: ["user-dashboard"] });
    },
    onError: (err: unknown) => {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      toast.error("Gagal Menghapus Sertifikat", {
        description:
          axiosErr.response?.data?.message ||
          "Terjadi kesalahan saat memproses penghapusan dokumen.",
      });
    },
  });

  const certs = response?.data || [];
  const meta = response?.meta || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  };

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

  const handleDownloadSingle = async (certId: string, certNumber: string) => {
    try {
      setDownloadingId(certId);
      toast.loading("Mempersiapkan berkas unduhan...", { id: `dl-${certId}` });

      const url = await fetchUserCertDownloadUrl(certId);
      if (!url) throw new Error("URL berkas tidak ditemukan.");

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
          "Berkas sedang dipersiapkan. Silakan coba klik kembali.",
      });
    } finally {
      setDownloadingId(null);
    }
  };

  const handleBulkDownload = async () => {
    toast.loading("Membuka unduhan berkas terpilih...", { duration: 1500 });
    for (const id of selectedIds) {
      try {
        const url = await fetchUserCertDownloadUrl(id);
        window.open(url, "_blank");
      } catch {}
    }
    setSelectedIds([]);
  };

  const handleConfirmRevoke = async (reason: string) => {
    if (selectedIds.length === 0) return;

    try {
      for (const id of selectedIds) {
        await revokeMutation.mutateAsync({ id, reason });
      }

      toast.error("Sertifikat Telah Dibatalkan", {
        description: `${selectedIds.length} sertifikat berhasil dinonaktifkan dari sistem.`,
      });
      setRevokeModalOpen(false);
      setSelectedIds([]);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      toast.error("Gagal Membatalkan Sertifikat", {
        description:
          axiosErr.response?.data?.message ||
          "Terjadi kendala saat membatalkan dokumen.",
      });
    }
  };

  const handleRegenerateFile = (certId: string, file: File) => {
    regenerateMutation.mutate(
      { id: certId, file },
      {
        onSuccess: (res) => {
          toast.success("Dokumen Berhasil Diperbarui", {
            description: `Berkas PDF baru untuk ${res.data?.certificate_number} berhasil dibuat ulang.`,
          });
          setActiveDetailCert(null);
        },
        onError: (err) => {
          toast.error("Gagal Memperbarui Berkas", {
            description:
              err.response?.data?.message || "Format berkas tidak sesuai.",
          });
        },
      },
    );
  };

  // Handler Buka Modal Hapus Tunggal
  const openSingleDeleteModal = (cert: UserCertificateItem) => {
    setTargetDeleteCert(cert);
    setDeleteModalOpen(true);
  };

  // Handler Buka Modal Hapus Massal (berdasarkan ceklis)
  const openBulkDeleteModal = () => {
    setTargetDeleteCert(null);
    setDeleteModalOpen(true);
  };

  // Konfirmasi Eksekusi Hapus
  const handleConfirmDelete = () => {
    if (targetDeleteCert) {
      deleteMutation.mutate([targetDeleteCert.id]);
    } else if (selectedIds.length > 0) {
      deleteMutation.mutate(selectedIds);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-5 shadow-xs">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0e1738] dark:text-zinc-50">
          Daftar Sertifikat Terbit
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 font-medium">
          Pantau seluruh dokumen yang sudah diberi barcode verifikasi dan cek
          status keasliannya kapan saja.
        </p>
      </div>

      {/* Toolbar Tabel */}
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

      {/* Floating Action Bar untuk Sertifikat yang Diceklis */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between p-3.5 px-5 rounded-2xl bg-[#0e1738] dark:bg-zinc-800 text-white shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
          <span className="text-xs font-semibold">
            <strong className="text-indigo-300 font-bold">{selectedIds.length}</strong> sertifikat terpilih
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openBulkDeleteModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Terpilih ({selectedIds.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* Tabel Sertifikat */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/30 text-[11px] font-bold text-slate-400 dark:text-zinc-500">
                <th className="p-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length === certs.length && certs.length > 0
                    }
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 text-[#0e1738] focus:ring-[#0e1738]/20 cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4">Nomor Sertifikat</th>
                <th className="py-3.5 px-4">Nama Penerima</th>
                <th className="py-3.5 px-4">Nama Acara</th>
                <th className="py-3.5 px-4">Tanggal Terbit</th>
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
                    Tidak ada sertifikat yang cocok dengan pencarian Anda.
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
                          Kode: {cert.qr_token}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-zinc-200">
                        {cert.recipient_name}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 dark:text-zinc-300">
                        {cert.events?.name || "Agenda Umum"}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-500">
                        {new Date(cert.issued_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
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
                        <div className="flex items-center justify-end gap-1">
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
                          <button
                            type="button"
                            onClick={() => openSingleDeleteModal(cert)}
                            className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                            title="Hapus Dokumen"
                          >
                            <Trash2 className="w-4 h-4" />
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

        {/* Paginasi */}
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

      {/* Modal Rincian */}
      <UserCertDetailModal
        cert={activeDetailCert}
        onClose={() => setActiveDetailCert(null)}
        onDownload={handleDownloadSingle}
        onRegenerateFile={handleRegenerateFile}
        isRegenerating={regenerateMutation.isPending}
      />

      {/* Modal Pencabutan (Revoke) */}
      <CertRevokeModal
        isOpen={revokeModalOpen}
        onClose={() => setRevokeModalOpen(false)}
        selectedCount={selectedIds.length}
        onConfirm={handleConfirmRevoke}
        isRevoking={revokeMutation.isPending}
      />

      {/* Modal Kustom Penghapusan (Tunggal & Massal) */}
      <CertDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          if (!deleteMutation.isPending) {
            setDeleteModalOpen(false);
            setTargetDeleteCert(null);
          }
        }}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteMutation.isPending}
        certCount={targetDeleteCert ? 1 : selectedIds.length}
        singleCertNumber={targetDeleteCert?.certificate_number}
      />
    </div>
  );
}