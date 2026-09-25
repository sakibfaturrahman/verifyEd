"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import JSZip from "jszip";
import { saveAs } from "file-saver";
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
  Archive,
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
  const [isZipping, setIsZipping] = useState(false);

  // State untuk Custom Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [targetDeleteCert, setTargetDeleteCert] =
    useState<UserCertificateItem | null>(null);

  const {
    data: response,
    isPending,
    isPlaceholderData,
    refetch,
  } = useUserCertificatesListQuery({
    page,
    limit,
    search: searchQuery,
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  const revokeMutation = useRevokeUserCertMutation();
  const regenerateMutation = useRegenerateCertMutation();

  // Helper untuk me-refresh seluruh data sertifikat & dasbor secara agresif
  const refreshCertificateData = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["user-certificates"],
        exact: false,
      }),
      queryClient.invalidateQueries({
        queryKey: ["user-dashboard"],
        exact: false,
      }),
      refetch(),
    ]);
  };

  // Mutasi Hapus Tunggal / Massal dengan Auto Refetch Seketika
  const deleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(
        ids.map((id) => apiClient.delete(`/certificates/${id}`)),
      );
      return ids;
    },
    onSuccess: async (deletedIds) => {
      toast.success("Penghapusan Berhasil", {
        description: `${deletedIds.length} sertifikat dan berkas fisik berhasil dihapus.`,
      });
      setSelectedIds((prev) => prev.filter((id) => !deletedIds.includes(id)));
      setDeleteModalOpen(false);
      setTargetDeleteCert(null);

      await refreshCertificateData();
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

  // 1. Handler Download Satuan (Nama file sesuai nama penerima asli)
  const handleDownloadSingle = async (
    certId: string,
    certNumber: string,
    recipientName?: string,
  ) => {
    try {
      setDownloadingId(certId);
      toast.loading("Mempersiapkan berkas unduhan...", { id: `dl-${certId}` });

      const url = await fetchUserCertDownloadUrl(certId);
      if (!url) throw new Error("URL berkas tidak ditemukan.");

      // Gunakan proxy lokal agar penamaan file di browser 100% dipatuhi
      const proxyUrl = `/api/proxy-download?url=${encodeURIComponent(url)}`;
      const res = await fetch(proxyUrl);

      // Cari data nama penerima jika argumen recipientName kosong
      const targetCert = certs.find((c) => c.id === certId);
      const actualRecipientName =
        recipientName || targetCert?.recipient_name || "Peserta";

      const cleanRecipient = actualRecipientName
        .replace(/[\\/:*?"<>|]/g, "_")
        .trim();
      const fileName = `Sertifikat - ${cleanRecipient} - ${certNumber}.pdf`;

      if (res.ok) {
        const blob = await res.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      } else {
        // Fallback jika proxy gagal
        window.open(url, "_blank");
      }

      toast.success("Unduhan Berhasil", {
        id: `dl-${certId}`,
        description: `Dokumen "${fileName}" berhasil diunduh.`,
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

  // 2. Handler Unduh Massal ZIP (Nama ZIP menyertakan nama event)
  const handleBulkDownload = async () => {
    if (selectedIds.length === 0) return;

    setIsZipping(true);
    const toastId = toast.loading("Menyiapkan arsip ZIP sertifikat...", {
      description: "0% selesai",
    });

    try {
      const zip = new JSZip();

      // Ambil daftar sertifikat yang diceklis
      const selectedCerts = certs.filter((c) => selectedIds.includes(c.id));

      // Deteksi nama event dari sertifikat terpilih
      const firstEventName =
        selectedCerts[0]?.events?.name ||
        (selectedCerts[0] as any)?.event?.name ||
        "Kegiatan";

      const cleanEventName = firstEventName
        .replace(/[\\/:*?"<>|]/g, "_")
        .trim();
      const folderName = `Sertifikat VerifyEd - ${cleanEventName}`;
      const folder = zip.folder(folderName);

      let completedCount = 0;

      for (const cert of selectedCerts) {
        try {
          const downloadUrl = await fetchUserCertDownloadUrl(cert.id);
          if (!downloadUrl) continue;

          const proxyUrl = `/api/proxy-download?url=${encodeURIComponent(downloadUrl)}`;
          const res = await fetch(proxyUrl);
          if (!res.ok) continue;

          const blob = await res.blob();
          const cleanRecipient = (cert.recipient_name || "Peserta")
            .replace(/[\\/:*?"<>|]/g, "_")
            .trim();

          // Format nama file di dalam zip: Sertifikat - Nama Penerima - NoSertifikat.pdf
          const fileName = `Sertifikat - ${cleanRecipient} - ${cert.certificate_number}.pdf`;

          folder?.file(fileName, blob);
          completedCount++;
        } catch (fetchErr) {
          console.error(
            `Gagal mengemas sertifikat ${cert.certificate_number}:`,
            fetchErr,
          );
        }

        const percent = Math.round(
          (completedCount / selectedCerts.length) * 100,
        );
        toast.loading("Mengemas berkas sertifikat ke ZIP...", {
          id: toastId,
          description: `${percent}% (${completedCount}/${selectedCerts.length} berkas)`,
        });
      }

      if (completedCount === 0) {
        throw new Error("Tidak ada berkas yang berhasil diunduh.");
      }

      toast.loading("Mengompresi arsip ZIP...", { id: toastId });
      const zipContent = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 6 },
      });

      // Nama file arsip: "Sertifikat VerifyEd - [Nama Acara].zip"
      saveAs(zipContent, `Sertifikat VerifyEd - ${cleanEventName}.zip`);

      toast.success("Unduhan ZIP Berhasil", {
        id: toastId,
        description: `${completedCount} sertifikat berhasil dikompresi ke dalam ZIP.`,
      });

      setSelectedIds([]);
    } catch (err: unknown) {
      console.error("ZIP Generation Error:", err);
      toast.error("Gagal Mengunduh ZIP", {
        id: toastId,
        description:
          err instanceof Error ? err.message : "Terjadi kendala kompresi.",
      });
    } finally {
      setIsZipping(false);
    }
  };

  const handleConfirmRevoke = async (reason: string) => {
    if (selectedIds.length === 0) return;

    try {
      await Promise.all(
        selectedIds.map((id) => revokeMutation.mutateAsync({ id, reason })),
      );

      toast.success("Sertifikat Berhasil Dicabut", {
        description: `${selectedIds.length} sertifikat telah dinonaktifkan dari sistem.`,
      });
      setRevokeModalOpen(false);
      setSelectedIds([]);

      await refreshCertificateData();
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
        onSuccess: async (res) => {
          toast.success("Dokumen Berhasil Diperbarui", {
            description: `Berkas PDF baru untuk ${res.data?.certificate_number} berhasil diperbarui dengan penempatan QR terbaru.`,
          });
          setActiveDetailCert(null);

          await refreshCertificateData();
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

  const openSingleDeleteModal = (cert: UserCertificateItem) => {
    setTargetDeleteCert(cert);
    setDeleteModalOpen(true);
  };

  const openBulkDeleteModal = () => {
    setTargetDeleteCert(null);
    setDeleteModalOpen(true);
  };

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
          status keasliannya secara langsung.
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
            <strong className="text-indigo-300 font-bold">
              {selectedIds.length}
            </strong>{" "}
            sertifikat terpilih
          </span>

          <div className="flex items-center gap-2">
            {/* Tombol Unduh ZIP Massal */}
            <button
              type="button"
              disabled={isZipping}
              onClick={handleBulkDownload}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
            >
              {isZipping ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Archive className="w-3.5 h-3.5" />
              )}
              <span>{isZipping ? "Mengompresi..." : "Unduh ZIP"}</span>
            </button>

            {/* Tombol Hapus Massal */}
            <button
              type="button"
              disabled={isZipping || deleteMutation.isPending}
              onClick={openBulkDeleteModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
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
                                cert.recipient_name,
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
