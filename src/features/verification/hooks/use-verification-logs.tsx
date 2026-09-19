import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export interface VerificationLogRow {
  id: string;
  method: "qr" | "pdf" | "certificate_id";
  result: "verified" | "revoked" | "not_found";
  ip_address: string;
  created_at: string;
  certificates?: {
    certificate_number: string;
    recipient_name: string;
    events?: {
      name: string;
    };
  } | null;
}

export interface VerificationLogsResponse {
  data: VerificationLogRow[];
  total: number;
}

export function useVerificationLogsQuery(page = 1, limit = 10) {
  return useQuery<VerificationLogsResponse>({
    queryKey: ["verification-logs", page, limit],
    queryFn: async () => {
      const res = await apiClient.get<{
        success: boolean;
        data: VerificationLogsResponse;
      }>("/admin/verification-logs", {
        params: { page, limit },
      });
      return res.data.data;
    },
  });
}
