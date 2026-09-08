// src/app/layout.tsx
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "VerifyEd - Verifikasi Dokumen Digital",
  description: "Platform integritas dan verifikasi kredensial digital instan.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`h-full antialiased ${jakarta.variable}`}>
      <body className="min-h-full font-sans selection:bg-indigo-100 selection:text-indigo-900">
        {children}
        {/* Toaster Global Sonner */}
        <Toaster richColors position="top-right" closeButton />
      </body>
    </html>
  );
}
