// src/features/profile/components/profile-info-form.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Building2, Mail, Phone, MapPin, FileText, Save } from "lucide-react";

export function ProfileInfoForm() {
  const [formData, setFormData] = useState({
    name: "Universitas Perjuangan",
    email: "akademik@unper.ac.id",
    phone: "+62 812-3456-7890",
    address: "Jl. Pembela Tanah Air No. 177, Tasikmalaya, Jawa Barat",
    description:
      "Institusi pendidikan tinggi terakreditasi pengelola program sertifikasi kompetensi digital dan akademik.",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profil Berhasil Disimpan", {
      description:
        "Data identitas instansi telah diperbarui pada sistem VerifyEd.",
    });
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-6 shadow-xs space-y-6">
      <div className="pb-3 border-b border-slate-100 dark:border-zinc-800">
        <h3 className="text-sm font-bold text-[#0e1738] dark:text-zinc-100">
          Informasi Legalitas & Instansi
        </h3>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
          Nama dan alamat resmi akan dicantumkan pada metadata sertifikat
          penerima.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nama Organisasi */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-zinc-200 flex items-center gap-1.5">
              <Building2 size={13} className="text-slate-400" />
              <span>Nama Lengkap Organisasi / Kampus</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 font-medium text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#0e1738]/15"
            />
          </div>

          {/* Email Kontak Resmi */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-zinc-200 flex items-center gap-1.5">
              <Mail size={13} className="text-slate-400" />
              <span>Alamat Email Resmi</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 font-mono text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#0e1738]/15"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nomor Telepon */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-zinc-200 flex items-center gap-1.5">
              <Phone size={13} className="text-slate-400" />
              <span>Nomor Telepon Kantor / PIC</span>
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 font-medium text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#0e1738]/15"
            />
          </div>

          {/* Alamat Domisili */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-zinc-200 flex items-center gap-1.5">
              <MapPin size={13} className="text-slate-400" />
              <span>Alamat Lengkap Kantor</span>
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 font-medium text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#0e1738]/15"
            />
          </div>
        </div>

        {/* Deskripsi Lembaga */}
        <div className="space-y-1.5">
          <label className="font-bold text-slate-700 dark:text-zinc-200 flex items-center gap-1.5">
            <FileText size={13} className="text-slate-400" />
            <span>Deskripsi / Profil Singkat Instansi</span>
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl p-3 font-medium text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#0e1738]/15 leading-relaxed"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0e1738] dark:bg-zinc-100 text-white dark:text-[#0e1738] text-xs font-semibold hover:bg-[#1a254d] transition-all shadow-xs cursor-pointer"
          >
            <Save size={14} />
            <span>Simpan Informasi Profil</span>
          </button>
        </div>
      </form>
    </div>
  );
}
