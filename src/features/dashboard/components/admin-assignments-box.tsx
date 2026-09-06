// src/features/dashboard/components/admin-assignments-box.tsx
"use client";

import { Plus, ArrowUpRight } from "lucide-react";

const tasks = [
  {
    tags: ["batch 04", "universitas"],
    priority: "penting",
    title: "validasi tanda tangan berkas yudisium 240 mahasiswa angkatan 2026",
    pic: "tim akademik",
    initials: "ta",
  },
  {
    tags: ["seminar nasional", "qr token"],
    priority: "normal",
    title: "pemeriksaan template koordinat stempel qr pada sertifikat pemateri",
    pic: "panitia inti",
    initials: "pi",
  },
];

export function AdminAssignmentsBox() {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col gap-5 h-full">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
        <span className="text-sm font-bold text-[#0e1738] dark:text-zinc-100 lowercase">
          antrean tugas penerbitan
        </span>
        <span className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer lowercase">
          kelola semua
        </span>
      </div>

      <div className="flex flex-col gap-3.5 flex-1">
        {tasks.map((task, idx) => (
          <div
            key={idx}
            className="border border-slate-200/80 dark:border-zinc-800 p-4 rounded-2xl flex flex-col gap-3 bg-white dark:bg-zinc-900"
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2 text-[11px] text-slate-400 font-mono lowercase">
                <span>{task.tags[0]}</span>
                <span>•</span>
                <span>{task.tags[1]}</span>
              </div>
              <span
                className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold lowercase ${
                  task.priority === "penting"
                    ? "bg-rose-50 text-rose-600 border border-rose-200"
                    : "bg-sky-50 text-sky-700 border border-sky-200"
                }`}
              >
                {task.priority}
              </span>
            </div>

            <p className="text-xs font-semibold text-[#0e1738] dark:text-zinc-100 leading-relaxed lowercase">
              {task.title}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-zinc-800 text-[11px] text-slate-500">
              <span className="lowercase font-medium">penanggung jawab: {task.pic}</span>
              <div className="w-6 h-6 rounded-full bg-[#0e1738] text-[10px] text-white flex items-center justify-center uppercase font-bold">
                {task.initials}
              </div>
            </div>
          </div>
        ))}

        <button className="w-full py-3 border border-dashed border-slate-300 dark:border-zinc-700 rounded-2xl text-xs text-slate-500 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-1.5 lowercase mt-auto font-semibold">
          <Plus size={14} /> tambah antrean berkas
        </button>
      </div>
    </div>
  );
}