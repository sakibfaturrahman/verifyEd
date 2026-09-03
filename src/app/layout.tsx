import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "VerifyEd - Verifikasi Dokumen Digital",
  description:
    "VerifyEd adalah platform verifikasi dokumen digital yang aman dan terpercaya, menggunakan teknologi blockchain untuk memastikan integritas dan keaslian dokumen.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`h-full antialiased ${jakarta.variable}`}>
      <body className="min-h-full bg-[#fcfcfc] text-[#1a1a1a] font-sans">
        {children}
      </body>
    </html>
  );
}
