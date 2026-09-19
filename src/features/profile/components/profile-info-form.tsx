"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  Save,
  Loader2,
} from "lucide-react";
import {
  UserProfileData,
  useUpdateProfileMutation,
} from "../hooks/use-profile";

interface ProfileInfoFormProps {
  initialData?: UserProfileData;
}

export function ProfileInfoForm({ initialData }: ProfileInfoFormProps) {
  const updateMutation = useUpdateProfileMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    description: "",
  });

  // Isi form secara otomatis saat data pengguna berhasil dimuat
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        address: initialData.address || "",
        description: initialData.description || "",
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Nama Masih Kosong", {
        description: "Silakan isi nama instansi atau penyelenggara acara.",
      });
      return;
    }

    updateMutation.mutate(
      {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        description: formData.description.trim(),
      },
      {
        onSuccess: () => {
          toast.success("Perubahan Tersimpan", {
            description: "Informasi instansi Anda berhasil diperbarui.",
          });
        },
        onError: (err) => {
          toast.error("Gagal Menyimpan", {
            description:
              err.response?.data?.message ||
              "Terjadi kendala saat menyimpan data.",
          });
        },
      },
    );
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-6 shadow-xs space-y-6">
      <div className="pb-3 border-b border-slate-100 dark:border-zinc-800">
        <h3 className="text-sm font-bold text-[#0e1738] dark:text-zinc-100">
          Informasi Lembaga / Penyelenggara
        </h3>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
          Nama dan kontak ini akan tercatat sebagai pihak yang resmi
          mengeluarkan sertifikat.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nama Organisasi */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-zinc-200 flex items-center gap-1.5">
              <Building2 size={13} className="text-slate-400" />
              <span>Nama Lengkap Instansi / Kampus / Komunitas</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Contoh: Universitas Perjuangan"
              className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 font-medium text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#0e1738]/15"
            />
          </div>

          {/* Email Utama (Read-only karena sebagai ID Akun) */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-zinc-200 flex items-center gap-1.5">
              <Mail size={13} className="text-slate-400" />
              <span>Alamat Email Utama (Tidak Dapat Diubah)</span>
            </label>
            <input
              type="email"
              disabled
              value={formData.email}
              className="w-full bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 font-mono text-slate-500 dark:text-zinc-400 cursor-not-allowed"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nomor WhatsApp / Telepon */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-zinc-200 flex items-center gap-1.5">
              <Phone size={13} className="text-slate-400" />
              <span>Nomor WhatsApp / Telepon Narahubung</span>
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="Contoh: 0812-3456-7890"
              className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 font-medium text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#0e1738]/15"
            />
          </div>

          {/* Alamat Kantor */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-zinc-200 flex items-center gap-1.5">
              <MapPin size={13} className="text-slate-400" />
              <span>Alamat Lengkap Kantor / Sekretariat</span>
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              placeholder="Contoh: Jl. Pembela Tanah Air No. 177, Tasikmalaya"
              className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 font-medium text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#0e1738]/15"
            />
          </div>
        </div>

        {/* Keterangan / Bio Singkat */}
        <div className="space-y-1.5">
          <label className="font-bold text-slate-700 dark:text-zinc-200 flex items-center gap-1.5">
            <FileText size={13} className="text-slate-400" />
            <span>Deskripsi / Profil Singkat Penyelenggara</span>
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Jelaskan secara singkat mengenai kampus, lembaga, atau organisasi Anda..."
            className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl p-3 font-medium text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#0e1738]/15 leading-relaxed"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0e1738] dark:bg-zinc-100 text-white dark:text-[#0e1738] text-xs font-semibold hover:bg-[#1a254d] transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save size={14} />
                <span>Simpan Perubahan</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
