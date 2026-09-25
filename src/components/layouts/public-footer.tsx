// src/components/layouts/public-footer.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, ArrowRight } from "lucide-react";

export function PublicFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail("");
      setSubscribed(false);
    }, 3000);
  };

  return (
    <footer className="bg-[#faf8f5] text-[#0e1738] pt-12 pb-16 px-6">
      <div className="max-w-7xl mx-auto space-y-24">
        {/* Upper Big Card: Ready to get started Banner */}
        <div className="bg-[#122253] text-white rounded-[40px] sm:rounded-[48px] px-8 py-20 sm:py-24 text-center max-w-6xl mx-auto shadow-2xl relative overflow-hidden">
          {/* Subtle Ambient Radial Highlight */}
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-sky-500/10 blur-[120px] rounded-full" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
              Ready to get started?
            </h2>

            <p className="text-sm sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
              Terbitkan dan verifikasi sertifikat digital dengan standar
              integritas tinggi. Dirancang untuk institusi pendidikan,
              penyelenggara acara, dan pemeriksa berkas independen.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/register"
                className="px-8 py-3.5 rounded-full bg-white text-[#122253] text-sm font-bold hover:bg-slate-100 transition-all shadow-md active:scale-95"
              >
                Mulai Uji Coba Gratis
              </Link>
              <Link
                href="/"
                className="px-8 py-3.5 rounded-full bg-transparent border border-white/60 text-white text-sm font-bold hover:bg-white/10 transition-all active:scale-95"
              >
                Coba Verifikasi
              </Link>
            </div>
          </div>
        </div>

        {/* Middle Row: Brand Logo & Newsletter Input */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pt-4">
          {/* Left Brand */}
          <div className="lg:col-span-5 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#122253] text-white flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-[#122253]">
              Verify<span className="text-[#3b5998]">Ed</span>
            </span>
          </div>

          {/* Right Newsletter */}
          <div className="lg:col-span-7 space-y-3">
            <h4 className="text-base sm:text-lg font-bold text-[#122253]">
              Get informed of new and updated features
            </h4>

            <form onSubmit={handleSubscribe} className="relative max-w-xl">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="w-full bg-[#eee9df]/70 border border-transparent focus:border-[#122253]/30 rounded-2xl px-5 py-3.5 text-sm text-[#122253] placeholder:text-slate-500/80 focus:outline-none focus:bg-[#eee9df] transition-all pr-32 font-medium"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 px-5 rounded-xl bg-transparent text-xs font-bold text-[#122253] hover:opacity-75 transition-opacity flex items-center gap-1.5"
              >
                <span>{subscribed ? "Subscribed!" : "Subscribe"}</span>
                {!subscribed && <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </form>

            <p className="text-xs text-slate-500 font-medium">
              No spam, just occasional product updates.
            </p>
          </div>
        </div>

        {/* Link Columns Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 pt-8">
          {/* Col 1 */}
          <div className="space-y-4 text-xs font-medium">
            <div className="font-bold text-[#122253] text-[13px]">
              Get started
            </div>
            <ul className="space-y-2.5 text-slate-600">
              <li>
                <Link
                  href="/"
                  className="hover:text-[#122253] transition-colors"
                >
                  Homepage
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="hover:text-[#122253] transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="hover:text-[#122253] transition-colors"
                >
                  Free Sandbox
                </Link>
              </li>
              <li>
                <Link
                  href="#about"
                  className="hover:text-[#122253] transition-colors"
                >
                  Features
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2 */}
          <div className="space-y-4 text-xs font-medium">
            <div className="font-bold text-[#122253] text-[13px]">Platform</div>
            <ul className="space-y-2.5 text-slate-600">
              <li>
                <Link
                  href="/verify"
                  className="hover:text-[#122253] transition-colors"
                >
                  Portal Verifikasi
                </Link>
              </li>
              <li>
                <Link
                  href="#features"
                  className="hover:text-[#122253] transition-colors"
                >
                  Automations
                </Link>
              </li>
              <li>
                <Link
                  href="#features"
                  className="hover:text-[#122253] transition-colors"
                >
                  Batch Issuance
                </Link>
              </li>
              <li>
                <Link
                  href="/api/docs"
                  className="hover:text-[#122253] transition-colors"
                >
                  REST API
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-4 text-xs font-medium">
            <div className="font-bold text-[#122253] text-[13px]">
              Solutions
            </div>
            <ul className="space-y-2.5 text-slate-600">
              <li>
                <span className="hover:text-[#122253] cursor-pointer transition-colors">
                  For Universities
                </span>
              </li>
              <li>
                <span className="hover:text-[#122253] cursor-pointer transition-colors">
                  For Bootcamps
                </span>
              </li>
              <li>
                <span className="hover:text-[#122253] cursor-pointer transition-colors">
                  For Organizers
                </span>
              </li>
              <li>
                <span className="hover:text-[#122253] cursor-pointer transition-colors">
                  For Verifiers
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-4 text-xs font-medium">
            <div className="font-bold text-[#122253] text-[13px]">
              Developers
            </div>
            <ul className="space-y-2.5 text-slate-600">
              <li>
                <Link
                  href="/api/docs"
                  className="hover:text-[#122253] transition-colors"
                >
                  API Reference
                </Link>
              </li>
              <li>
                <span className="hover:text-[#122253] cursor-pointer transition-colors">
                  SDK Client
                </span>
              </li>
              <li>
                <span className="hover:text-[#122253] cursor-pointer transition-colors">
                  Webhooks
                </span>
              </li>
            </ul>
          </div>

          {/* Col 5 */}
          <div className="space-y-4 text-xs font-medium">
            <div className="font-bold text-[#122253] text-[13px]">
              Resources
            </div>
            <ul className="space-y-2.5 text-slate-600">
              <li>
                <span className="hover:text-[#122253] cursor-pointer transition-colors">
                  Documentation
                </span>
              </li>
              <li>
                <span className="hover:text-[#122253] cursor-pointer transition-colors">
                  Integrations
                </span>
              </li>
              <li>
                <span className="hover:text-[#122253] cursor-pointer transition-colors">
                  Security Model
                </span>
              </li>
              <li>
                <span className="hover:text-[#122253] cursor-pointer transition-colors">
                  System Status
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Micro Bar: Protocol Tag & Legal Badges */}
        <div className="max-w-6xl mx-auto pt-10 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-6 text-[12px] font-medium text-slate-500">
          <div className="flex flex-wrap items-center gap-6">
            <span className="px-3 py-1 rounded bg-[#146375] text-white font-extrabold text-[11px] tracking-wider uppercase">
              VERIFYED
            </span>

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[#122253] font-semibold">
                Service status: Operational
              </span>
            </div>

            <span className="hover:text-[#122253] cursor-pointer transition-colors">
              Terms of Use
            </span>
            <span className="hover:text-[#122253] cursor-pointer transition-colors">
              Privacy Policy
            </span>
            <span className="hover:text-[#122253] cursor-pointer transition-colors">
              Security Protocol
            </span>
          </div>

          <div className="flex items-center gap-4 text-[#122253] font-semibold">
            <span className="hover:opacity-75 cursor-pointer transition-opacity">
              © 2026 VerifyEd Protocol
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
