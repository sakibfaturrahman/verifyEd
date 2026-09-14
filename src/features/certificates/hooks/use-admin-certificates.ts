// src/features/certificates/hooks/use-admin-certificates.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { AxiosError } from "axios";

export interface CertificateItem {
  id: string;
  event_id: string;
  certificate_number: string;
  recipient_name: string;
  original_file: string | null;
  generated_file: string | null;
  file_hash: string | null;
  qr_token: string;
  status: "active" | "revoked";
  issued_at: string;
  revoked_at: string | null;
  revoke_reason: string | null;
  created_at: string;
  updated_at: string;
  events: {
    id: string;
    name: string;
    organizer: string;
    event_date: string;
    user_id: string;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CertQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "active" | "revoked";
  event_id?: string;
}

export interface CertsApiResponse {
  success: boolean;
  message: string;
  data: CertificateItem[];
  meta: PaginationMeta;
}

// 1. Fetching daftar seluruh sertifikat (Admin Scope)
export function useAdminCertificatesListQuery(params: CertQueryParams) {
  return useQuery<CertsApiResponse>({
    queryKey: ["admin-certificates", params],
    queryFn: async () => {
      const res = await apiClient.get<CertsApiResponse>("/admin/certificates", {
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          search: params.search || undefined,
          status: params.status || undefined,
          event_id: params.event_id || undefined,
        },
      });
      return res.data;
    },
    staleTime: 1000 * 60 * 2,
  });
}

// 2. Fetch URL unduhan bertanda tangan (Signed URL 1 jam)
export async function fetchCertificateDownloadUrl(
  certId: string,
): Promise<string> {
  const res = await apiClient.get<{ data: { url: string; expiresIn: number } }>(
    `/certificates/${certId}/download`,
  );
  return res.data.data.url;
}

// 3. Mutasi Cabut Status Kredensial Tunggal
export function useRevokeCertificateMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; message: string },
    AxiosError<{ message: string }>,
    { id: string; reason: string }
  >({
    mutationFn: async ({ id, reason }) => {
      const res = await apiClient.patch(`/certificates/${id}/revoke`, {
        reason,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-certificates"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard-stats"] });
    },
  });
}

// 4. Mutasi Pencabutan Massal (Bulk Revoke)
export function useBulkRevokeCertificatesMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; message: string; data: { revoked: number } },
    AxiosError<{ message: string }>,
    { certificateIds: string[]; reason: string }
  >({
    mutationFn: async ({ certificateIds, reason }) => {
      const res = await apiClient.post("/admin/certificates/bulk-revoke", {
        certificateIds,
        reason,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-certificates"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard-stats"] });
    },
  });
}
