// src/features/dashboard/components/admin-assignments-box.tsx
"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

const tasks = [
  {
    tags: ["Batch 04", "Universitas"],
    priority: "Penting",
    title: "Validasi tanda tangan berkas yudisium 240 mahasiswa angkatan 2026",
    pic: "Tim Akademik",
    initials: "TA",
  },
  {
    tags: ["Seminar Nasional", "QR Token"],
    priority: "Normal",
    title: "Pemeriksaan template koordinat stempel QR pada sertifikat pemateri",
    pic: "Panitia Inti",
    initials: "PI",
  },
];

export function AdminAssignmentsBox() {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col gap-5 h-full">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
        <span className="text-sm font-bold text-[#0e1738] dark:text-zinc-100">
          Antrean Tugas Penerbitan
        </span>
        <Link
          href="/admin/certificates"
          className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors font-medium"
        >
          Kelola Semua
        </Link>
      </div>

      <div className="flex flex-col gap-3.5 flex-1">
        {tasks.map((task, idx) => (
          <div
            key={idx}
            className="border border-slate-200/80 dark:border-zinc-800 p-4 rounded-2xl flex flex-col gap-3 bg-white dark:bg-zinc-900"
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2 text-[11px] text-slate-400 font-mono">
                <span>{task.tags[0]}</span>
                <span>•</span>
                <span>{task.tags[1]}</span>
              </div>
              <span
                className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                  task.priority === "Penting"
                    ? "bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-900/60"
                    : "bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-950/40 dark:border-sky-900/60"
                }`}
              >
                {task.priority}
              </span>
            </div>

            <p className="text-xs font-semibold text-[#0e1738] dark:text-zinc-100 leading-relaxed">
              {task.title}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-zinc-800 text-[11px] text-slate-500">
              <span className="font-medium">Penanggung Jawab: {task.pic}</span>
              <div className="w-6 h-6 rounded-full bg-[#0e1738] text-[10px] text-white flex items-center justify-center font-bold">
                {task.initials}
              </div>
            </div>
          </div>
        ))}

        <Link
          href="/admin/certificates/new"
          className="w-full py-3 border border-dashed border-slate-300 dark:border-zinc-700 rounded-2xl text-xs text-slate-500 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-1.5 mt-auto font-semibold"
        >
          <Plus size={14} /> Tambah Antrean Berkas
        </Link>
      </div>
    </div>
  );
}
