"use client";

import Link from "next/link";
import { ArrowLeft, Printer, Share2 } from "lucide-react";

interface ResultHeaderActionsProps {
  onShare: () => void;
}

export function ResultHeaderActions({ onShare }: ResultHeaderActionsProps) {
  return (
    <div className="flex items-center justify-between print:hidden">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-zinc-400 hover:text-[#0e1738] dark:hover:text-white transition-colors group"
      >
        <ArrowLeft
          size={15}
          className="group-hover:-translate-x-1 transition-transform"
        />
        <span>Periksa Sertifikat Lain</span>
      </Link>
    </div>
  );
}
