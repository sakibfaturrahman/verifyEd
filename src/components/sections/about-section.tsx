"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import {
  QrCode,
  FileCheck2,
  Lock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Search,
} from "lucide-react";

export function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const rows = gsap.utils.toArray<HTMLElement>(".feature-row");
      rows.forEach((row) => {
        const textCol = row.querySelector(".row-text");
        const visualCol = row.querySelector(".row-visual");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: "top 78%",
            toggleActions: "play none none reverse",
          },
        });

        tl.from(textCol, {
          x: row.classList.contains("reverse-col") ? 40 : -40,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        }).from(
          visualCol,
          {
            scale: 0.9,
            opacity: 0,
            duration: 0.8,
            ease: "back.out(1.4)",
          },
          "-=0.5",
        );
      });
    },
    { scope: containerRef },
  );

  return (
    <section
      id="about"
      ref={containerRef}
      className="py-32 px-6 bg-background relative overflow-hidden"
    >
      {/* Dynamic Background Glows */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-primary/5 blur-[160px] rounded-full -z-10" />

      <div className="max-w-6xl mx-auto space-y-36">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Standar Baru Validasi <br />
            <span className="text-primary">Dokumen Digital</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            VerifyEd menggantikan verifikasi manual yang lambat dengan protokol
            kriptografi langsung: <strong>instan</strong>,{" "}
            <strong>transparan</strong>, dan{" "}
            <strong>tidak dapat dimanipulasi</strong>.
          </p>
        </div>

        {/* Row 1: Validasi Instan Tanpa Login */}
        <div className="feature-row grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="row-text lg:col-span-6 space-y-5">
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Pengecekan Langsung Tanpa Perlu Akun
            </h3>

            <div className="inline-block px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
              Akses Terbuka untuk Recruiter & Publik
            </div>

            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Siapapun dapat langsung membuktikan{" "}
              <strong>keaslian berkas penerima</strong> cukup dengan memasukkan{" "}
              <strong>nomor seri</strong> atau <strong>memindai kode</strong>.
              Sistem beroperasi terbuka tanpa biaya maupun kewajiban registrasi
              akun bagi pemeriksa dokumen.
            </p>

            <Link
              href="#verification-portal"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border/80 text-xs font-semibold hover:bg-muted/40 transition-all group"
            >
              <span>Uji Coba Verifikasi</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Visual Kanan */}
          <div className="row-visual lg:col-span-6 flex items-center justify-center relative">
            <div className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-sky-400/20 via-blue-500/10 to-transparent blur-xl" />
              <div className="absolute inset-4 rounded-full border border-primary/20 animate-[spin_40s_linear_infinite]" />
              <div className="absolute inset-16 rounded-full border border-dashed border-primary/30" />
              <div className="absolute inset-28 rounded-full bg-background border border-border shadow-inner flex items-center justify-center">
                <Search className="w-8 h-8 text-primary/70" />
              </div>

              {/* Floating Stat Card Fokus */}
              <div className="absolute -bottom-2 right-4 sm:right-8 bg-card/95 backdrop-blur-xl border border-border/80 rounded-2xl p-4 shadow-xl shadow-black/5 min-w-[200px]">
                <div className="text-[11px] text-muted-foreground font-mono">
                  Kecepatan Lookup
                </div>
                <div className="text-2xl font-extrabold tracking-tight text-foreground flex items-baseline gap-1.5 mt-0.5">
                  0.12s{" "}
                  <span className="text-xs font-bold text-emerald-600">
                    (Instan)
                  </span>
                </div>
                <div className="text-[11px] text-muted-foreground mt-1">
                  Status:{" "}
                  <strong className="text-foreground font-semibold">
                    Terverifikasi Sah
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Alur Kriptografi (Reverse Layout) */}
        <div className="feature-row reverse-col grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Visual Kiri */}
          <div className="row-visual lg:col-span-6 flex items-center justify-center relative order-2 lg:order-1">
            <div className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center">
              <div className="absolute inset-2 rounded-[40px] bg-gradient-to-br from-indigo-500/15 via-primary/10 to-transparent rotate-6 blur-lg" />
              <div className="absolute inset-4 rounded-[36px] bg-muted/30 border border-border/60 -rotate-3" />

              {/* Flow Steps Visual Card */}
              <div className="relative z-10 w-68 bg-card/95 backdrop-blur-xl border border-border/80 rounded-2xl p-5 shadow-2xl shadow-black/5 space-y-4">
                <div className="flex items-center justify-between border-b border-border/50 pb-2">
                  <span className="text-[11px] font-mono font-semibold text-muted-foreground">
                    INTEGRITAS SHA-256
                  </span>
                  <Lock className="w-3.5 h-3.5 text-primary" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/50 border border-border/50 text-xs">
                    <QrCode className="w-4 h-4 text-primary shrink-0" />
                    <span className="font-mono text-[11px] font-medium truncate">
                      qr_tok_8f92a4e...c3
                    </span>
                  </div>
                  <div className="h-4 border-l-2 border-dashed border-border ml-4" />
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Sidik Digital Valid & Terkunci</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row-text lg:col-span-6 space-y-5 order-1 lg:order-2">
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Segel Dokumen Bebas Pemalsuan
            </h3>

            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Setiap sertifikat mengikat <strong>identitas penerima</strong>{" "}
              dengan <strong>checksum biner dokumen</strong>. Perubahan sekecil
              apapun pada nama, tanda tangan, maupun layout grafis secara
              otomatis <strong>menggagalkan status validasi</strong>.
            </p>

            <div className="space-y-2.5 pt-2">
              {[
                "Token QR acak 64-karakter unik di setiap lembar",
                "Deteksi otomatis rekayasa visual atau penyuntingan berkas",
                "Pencatatan riwayat status pencabutan (revocation) transparan",
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 text-xs sm:text-sm font-medium"
                >
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 3: Dasbor Penyelenggara */}
        <div className="feature-row grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="row-text lg:col-span-6 space-y-5">
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Penerbitan Fleksibel Skala Acara
            </h3>

            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Dirancang khusus untuk <strong>panitia kompetisi</strong>,{" "}
              <strong>penyelenggara seminar</strong>, maupun{" "}
              <strong>institusi pendidikan</strong>. Kelola seluruh database
              penerima secara terpusat dan{" "}
              <strong>pantau statistik pemindaian</strong> secara real-time.
            </p>

            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border/80 text-xs font-semibold hover:bg-muted/40 transition-all group"
            >
              <span>Daftar Sebagai Penerbit</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Visual Kanan */}
          <div className="row-visual lg:col-span-6 flex items-center justify-center relative">
            <div className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center">
              <div className="absolute inset-8 rounded-full bg-gradient-to-tr from-emerald-400/20 via-sky-400/10 to-transparent blur-xl" />
              <div className="absolute inset-10 rounded-[32px] bg-muted/20 border border-border/60 rotate-6" />

              {/* Certificate Card Terfokus */}
              <div className="relative z-10 w-72 bg-card/95 backdrop-blur-xl border border-border/80 rounded-2xl p-5 shadow-2xl shadow-black/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    STATUS: AKTIF
                  </span>
                  <FileCheck2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="border-t border-border/40 pt-2 space-y-0.5">
                  <div className="text-[10px] text-muted-foreground">
                    Penerima Resmi
                  </div>
                  <div className="text-sm font-bold text-foreground">
                    Peserta Bootcamp 2026
                  </div>
                  <div className="text-[11px] font-mono font-semibold text-primary">
                    CERT-2026-X89F2
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial / Highlight Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-foreground text-background shadow-2xl relative overflow-hidden -rotate-2 hover:-rotate-1 transition-transform duration-300 ease-out origin-bottom-left max-w-4xl mx-auto">
          <div className="max-w-2xl space-y-4">
            <p className="text-base sm:text-xl font-medium leading-relaxed">
              &ldquo;Integritas data adalah fondasi utama kepercayaan. VerifyEd
              menghilangkan risiko <strong>sertifikat palsu</strong> tanpa
              menambah kerumitan bagi{" "}
              <strong>penerima maupun pemeriksa dokumen</strong>.&rdquo;
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="w-9 h-9 rounded-full bg-background/20 text-background flex items-center justify-center font-bold text-xs">
                VE
              </div>
              <div>
                <div className="text-xs font-bold">
                  Protokol Keamanan Terpadu
                </div>
                <div className="text-[11px] opacity-70">
                  VerifyEd Verification Engine
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
