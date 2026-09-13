// src/features/dashboard/components/user/user-guide-box.tsx
import Link from "next/link";

export function UserGuideBox() {
  const steps = [
    {
      num: "1",
      title: "Tentukan Agenda Acara",
      desc: "Kelompokkan sertifikat berdasarkan kegiatan pelatihan atau seminar Anda.",
    },
    {
      num: "2",
      title: "Unggah File PDF",
      desc: "Unggah berkas dokumen satu per satu atau langsung dalam jumlah banyak (bulk).",
    },
    {
      num: "3",
      title: "Atur Posisi Barcode",
      desc: "Posisikan kode QR verifikasi langsung pada koordinat yang pas pada dokumen.",
    },
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4">
      <div className="pb-2 border-b border-slate-100 dark:border-zinc-800">
        <span className="text-sm font-bold text-[#0e1738] dark:text-zinc-100">
          Alur Mudah Penerbitan Dokumen
        </span>
      </div>

      <div className="space-y-3.5 text-xs">
        {steps.map((step) => (
          <div key={step.num} className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-zinc-800 text-[#0e1738] dark:text-zinc-200 flex items-center justify-center font-bold shrink-0 text-[11px]">
              {step.num}
            </div>
            <div>
              <h5 className="font-bold text-slate-800 dark:text-zinc-200">
                {step.title}
              </h5>
              <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Link
        href="/user/certificates/upload"
        className="w-full py-3 rounded-2xl bg-[#122253] hover:bg-[#0e1738] text-white text-xs font-semibold text-center shadow-xs transition-colors cursor-pointer"
      >
        Mulai Terbitkan Sertifikat
      </Link>
    </div>
  );
}
