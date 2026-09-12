// src/features/auth/components/register-form.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Building2,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  FileText,
  Loader2,
} from "lucide-react";
import { useRegisterMutation } from "@/features/auth/hooks/use-auth-mutations";

interface RegisterFormProps {
  onSwitchToLogin?: () => void;
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [role, setRole] = useState<"organizer" | "institution">("organizer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const registerMutation = useRegisterMutation();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreed) {
      toast.error("Persetujuan Dibutuhkan", {
        description: "Silakan centang persetujuan ketentuan layanan.",
      });
      return;
    }

    if (password.length < 8) {
      toast.error("Kata Sandi Kurang Kuat", {
        description:
          "Kata sandi minimal 8 karakter dengan kombinasi angka dan huruf.",
      });
      return;
    }

    registerMutation.mutate(
      {
        name,
        email,
        password,
        phone: phone.trim() || undefined,
        address: address.trim() || undefined,
        description: description.trim() || undefined,
      },
      {
        onSuccess: (data) => {
          toast.success("Pendaftaran Berhasil", {
            description:
              data.message || "Akun instansi berhasil dibuat. Silakan masuk.",
          });
          if (onSwitchToLogin) onSwitchToLogin();
        },
        onError: (err) => {
          toast.error("Registrasi Gagal", {
            description:
              err.response?.data?.message ||
              "Terjadi kendala pada pendaftaran.",
          });
        },
      },
    );
  };

  return (
    <div className="space-y-4 max-h-[580px] overflow-y-auto pr-1">
      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#122253]">
          Buat Akun
        </h2>
        <p className="text-xs text-slate-500 font-normal leading-relaxed">
          Lengkapi data instansi penyelenggara untuk penerbitan sertifikat
          digital resmi.
        </p>
      </div>

      {/* Segmented Selector Role */}
      <div className="grid grid-cols-2 gap-1 p-1 bg-[#eee9df]/80 rounded-xl">
        <button
          type="button"
          onClick={() => setRole("organizer")}
          className={`py-1.5 px-3 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            role === "organizer"
              ? "bg-white text-[#122253] shadow-xs"
              : "text-slate-600 hover:text-[#122253]"
          }`}
        >
          <User className="w-3 h-3" />
          <span>Organizer</span>
        </button>
        <button
          type="button"
          onClick={() => setRole("institution")}
          className={`py-1.5 px-3 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            role === "institution"
              ? "bg-white text-[#122253] shadow-xs"
              : "text-slate-600 hover:text-[#122253]"
          }`}
        >
          <Building2 className="w-3 h-3" />
          <span>Institusi / Kampus</span>
        </button>
      </div>

      <form onSubmit={handleRegister} className="space-y-3 text-xs">
        {/* Row 1: Nama Penyelenggara & No. Telepon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="space-y-1">
            <label className="font-bold text-[#122253]">
              {role === "organizer" ? "Nama Penyelenggara" : "Nama Lembaga"}
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={
                  role === "organizer"
                    ? "Budi Santoso"
                    : "Universitas Perjuangan"
                }
                className="w-full bg-[#eee9df]/50 border border-transparent focus:border-[#122253]/30 rounded-xl px-3 py-2 text-xs text-[#122253] placeholder:text-slate-400 focus:outline-none focus:bg-[#eee9df]/80 transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#122253]">
              No. Telepon / WhatsApp
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0812-xxxx-xxxx"
                className="w-full bg-[#eee9df]/50 border border-transparent focus:border-[#122253]/30 rounded-xl px-3 py-2 text-xs text-[#122253] placeholder:text-slate-400 focus:outline-none focus:bg-[#eee9df]/80 transition-all pr-8 font-medium"
              />
              <Phone className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
            </div>
          </div>
        </div>

        {/* Row 2: Email Resmi & Password */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="space-y-1">
            <label className="font-bold text-[#122253]">
              Alamat Surel Resmi
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@lembaga.ac.id"
                className="w-full bg-[#eee9df]/50 border border-transparent focus:border-[#122253]/30 rounded-xl px-3 py-2 text-xs text-[#122253] placeholder:text-slate-400 focus:outline-none focus:bg-[#eee9df]/80 transition-all pr-8 font-medium"
              />
              <Mail className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#122253]">Kata Sandi</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 karakter"
                className="w-full bg-[#eee9df]/50 border border-transparent focus:border-[#122253]/30 rounded-xl px-3 py-2 text-xs text-[#122253] placeholder:text-slate-400 focus:outline-none focus:bg-[#eee9df]/80 transition-all pr-8 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-[#122253] transition-colors cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-3.5 h-3.5" />
                ) : (
                  <Eye className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Row 3: Alamat Domisili */}
        <div className="space-y-1">
          <label className="font-bold text-[#122253]">
            Alamat Domisili Lembaga
          </label>
          <div className="relative">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Contoh: Jl. Pembela Tanah Air No. 177, Kota Tasikmalaya"
              className="w-full bg-[#eee9df]/50 border border-transparent focus:border-[#122253]/30 rounded-xl px-3 py-2 text-xs text-[#122253] placeholder:text-slate-400 focus:outline-none focus:bg-[#eee9df]/80 transition-all pr-8 font-medium"
            />
            <MapPin className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
          </div>
        </div>

        {/* Row 4: Deskripsi Singkat */}
        <div className="space-y-1">
          <label className="font-bold text-[#122253]">
            Deskripsi / Profil Lembaga
          </label>
          <div className="relative">
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan bidang kegiatan atau institusi penyelenggara..."
              className="w-full bg-[#eee9df]/50 border border-transparent focus:border-[#122253]/30 rounded-xl p-2.5 text-xs text-[#122253] placeholder:text-slate-400 focus:outline-none focus:bg-[#eee9df]/80 transition-all font-medium resize-none leading-relaxed"
            />
            <FileText className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Checkbox Terms */}
        <div className="flex items-start gap-2 pt-0.5">
          <input
            type="checkbox"
            id="reg-terms"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-[#122253] focus:ring-[#122253]/20 cursor-pointer"
          />
          <label
            htmlFor="reg-terms"
            className="text-[11px] text-slate-500 font-medium select-none cursor-pointer leading-tight"
          >
            Saya menyetujui ketentuan verifikasi integritas berkas resmi
            VerifyEd.
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full mt-1.5 py-2.5 rounded-xl bg-[#122253] text-white text-xs font-bold hover:bg-[#0e1738] transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 cursor-pointer"
        >
          {registerMutation.isPending ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Memproses Akun...</span>
            </>
          ) : (
            <>
              <span>Daftar Akun Penerbit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      {/* Mobile Switcher */}
      <div className="lg:hidden text-center pt-1 text-xs text-slate-500">
        Sudah memiliki akun?{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-bold text-[#122253] underline cursor-pointer"
        >
          Masuk di sini
        </button>
      </div>
    </div>
  );
}
