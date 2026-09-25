import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function VerifyTokenRedirectPage({ params }: PageProps) {
  const { token } = await params;

  // Arahkan otomatis ke halaman result
  redirect(`/verify/result/${encodeURIComponent(token)}`);
}
