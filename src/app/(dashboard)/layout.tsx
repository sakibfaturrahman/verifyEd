// src/app/(dashboard)/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 antialiased overflow-hidden">
      {children}
    </div>
  );
}
