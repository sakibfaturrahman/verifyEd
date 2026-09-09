// src/app/(dashboard)/dashboard/certificates/page.tsx
"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { UserSidebar } from "@/components/layouts/user/user-sidebar";
import { AdminTopNav } from "@/components/layouts/admin/admin-topnav";
import { UserCertToolbar } from "@/features/certificates/components/user/user-cert-toolbar";
import { UserCertDetailModal } from "@/features/certificates/components/user/user-cert-detail-modal";
import { CertRevokeModal } from "@/features/certificates/components/admin/cert-revoke-modal";
import { CertificateItem } from "@/features/certificates/types/cert.types";
import {
  CheckCircle2,
  XCircle,
  Eye,
  Download,
  ShieldAlert,
} from "lucide-react";

const initialUserCertificates: CertificateItem[] = [
  {
    id: "cert-u01",
    certificateNumber: "CERT-20260901-A1B2C3D4",
    recipientName: "Aditya Pratama",
    eventName: "National Tech Hackathon 2026",
    organizer: "Universitas Perjuangan",
    fileHash:
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    qrToken: "tok_8f92a1c0d4e5f67890abcdef12345678",
    status: "active",
    issuedAt: "2026-09-01",
    verificationCount: 24,
  },
  {
    id: "cert-u02",
    certificateNumber: "CERT-20260901-X9Y8Z7W6",
    recipientName: "Rani Widyaningsih",
    eventName: "National Tech Hackathon 2026",
    organizer: "Universitas Perjuangan",
    fileHash:
      "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
    qrToken: "tok_aabbccddeeff00112233445566778899",
    status: "active",
    issuedAt: "2026-09-01",
    verificationCount: 12,
  },
  {
    id: "cert-u03",
    certificateNumber: "CERT-20260815-M3N4O5P6",
    recipientName: "Farhan Ardiansyah",
    eventName: "Workshop UI/UX & Design System",
    organizer: "Universitas Perjuangan",
    fileHash:
      "ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d",
    qrToken: "tok_99887766554433221100aabbccddeeff",
    status: "revoked",
    issuedAt: "2026-08-15",
    verificationCount: 5,
  },
];

export default function UserCertificatesPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [certs, setCerts] = useState<CertificateItem[]>(
    initialUserCertificates,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "revoked"
  >("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modal State
  const [activeDetailCert, setActiveDetailCert] =
    useState<CertificateItem | null>(null);
  const [revokeModalOpen, setRevokeModalOpen] = useState(false);

  // Filter Data
  const filteredCerts = useMemo(() => {
    return certs.filter((cert) => {
      const matchQuery =
        cert.certificateNumber
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        cert.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.eventName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus =
        statusFilter === "all" || cert.status === statusFilter;
      return matchQuery && matchStatus;
    });
  }, [certs, searchQuery, statusFilter]);

  // Checkbox Handlers
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredCerts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCerts.map((c) => c.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  // Toast Actions
  const handleDownloadSingle = (certNumber: string) => {
    toast.success("Mempersiapkan Berkas", {
      description: `Dokumen ${certNumber}.pdf berhasil diunduh ke perangkat Anda.`,
    });
  };

  const handleBulkDownload = () => {
    toast.loading("Mengompresi Dokumen...", { duration: 1500 });
    setTimeout(() => {
      toast.success("Unduhan Selesai", {
        description: `Arsip ZIP untuk ${selectedIds.length} sertifikat berhasil diunduh.`,
      });
      setSelectedIds([]);
    }, 1500);
  };

  const handleConfirmRevoke = (reason: string) => {
    setCerts((prev) =>
      prev.map((c) =>
        selectedIds.includes(c.id) ? { ...c, status: "revoked" } : c,
      ),
    );
    setRevokeModalOpen(false);
    toast.error("Sertifikat Telah Dicabut", {
      description: `${selectedIds.length} sertifikat telah dibatalkan dengan alasan: "${reason}".`,
    });
    setSelectedIds([]);
  };

  const handleRegenerate = (cert: CertificateItem) => {
    toast.info("Regenerasi Stempel", {
      description: `Stempel QR untuk dokumen ${cert.certificateNumber} berhasil dikonfigurasi ulang.`,
    });
    setActiveDetailCert(null);
  };

  return (
    <div className="flex min-h-screen bg-[#faf8f5] dark:bg-zinc-950 font-sans antialiased">
      <UserSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <AdminTopNav onOpenSidebar={() => setIsSidebarOpen(true)} />

        <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 xl:px-10 2xl:px-12 w-full max-w-[1680px] mx-auto space-y-4 sm:space-y-5">
          {/* Header Banner */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-5 shadow-xs">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0e1738] dark:text-zinc-50">
              Portofolio Sertifikat Diterbitkan
            </h1>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 font-medium">
              Kelola dokumen yang telah dibubuhi stempel QR token dan pantau
              status validitas di portal publik.
            </p>
          </div>

          {/* Modular Toolbar */}
          <UserCertToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
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
                          selectedIds.length === filteredCerts.length &&
                          filteredCerts.length > 0
                        }
                        onChange={toggleSelectAll}
                        className="rounded border-slate-300 text-[#0e1738] focus:ring-[#0e1738]/20"
                      />
                    </th>
                    <th className="py-3.5 px-4">Nomor Kredensial</th>
                    <th className="py-3.5 px-4">Nama Penerima</th>
                    <th className="py-3.5 px-4">Agenda Terkait</th>
                    <th className="py-3.5 px-4">Tanggal Diterbitkan</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-center">Verifikasi Scan</th>
                    <th className="py-3.5 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 text-xs">
                  {filteredCerts.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-12 text-center text-slate-400 font-medium"
                      >
                        Belum ada sertifikat yang cocok dengan kriteria
                        pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredCerts.map((cert) => {
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
                              className="rounded border-slate-300 text-[#0e1738] focus:ring-[#0e1738]/20"
                            />
                          </td>
                          <td className="py-3.5 px-4 font-mono">
                            <div className="font-bold text-[#0e1738] dark:text-zinc-100">
                              {cert.certificateNumber}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate max-w-[130px]">
                              {cert.qrToken}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-zinc-200">
                            {cert.recipientName}
                          </td>
                          <td className="py-3.5 px-4 text-slate-700 dark:text-zinc-300">
                            {cert.eventName}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-500">
                            {cert.issuedAt}
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
                          <td className="py-3.5 px-4 text-center font-bold text-slate-700 dark:text-zinc-300 font-mono">
                            {cert.verificationCount} kali
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setActiveDetailCert(cert)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-[#0e1738] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                                title="Lihat Rincian"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleDownloadSingle(cert.certificateNumber)
                                }
                                className="p-1.5 rounded-lg text-slate-500 hover:text-[#0e1738] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                                title="Unduh Berkas"
                              >
                                <Download className="w-4 h-4" />
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
          </div>
        </main>
      </div>

      {/* Modals */}
      <UserCertDetailModal
        cert={activeDetailCert}
        onClose={() => setActiveDetailCert(null)}
        onDownload={handleDownloadSingle}
        onRegenerate={handleRegenerate}
      />
      <CertRevokeModal
        isOpen={revokeModalOpen}
        onClose={() => setRevokeModalOpen(false)}
        selectedCount={selectedIds.length}
        onConfirm={handleConfirmRevoke}
      />
    </div>
  );
}
