// src/app/(public)/layout.tsx
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#0e1738] flex flex-col">
      {children}
    </div>
  );
}
