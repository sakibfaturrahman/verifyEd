import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { AxiosError } from "axios";

export interface UserCertificateItem {
  id: string;
  event_id: string;
  certificate_number: string;
  recipient_name: string;
  original_file: string | null;
  generated_file: string | null;
  file_hash: string | null;
  qr_token: string;
  qr_config: {
    x: number;
    y: number;
    width: number;
    height: number;
    page: number;
  } | null;
  status: "active" | "revoked";
  issued_at: string;
  revoked_at: string | null;
  revoke_reason: string | null;
  created_at: string;
  updated_at: string;
  events?: {
    id: string;
    name: string;
    organizer: string;
    event_date: string;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UserCertQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "active" | "revoked";
  event_id?: string;
}

export interface UserCertsApiResponse {
  success: boolean;
  message: string;
  data: UserCertificateItem[];
  meta: PaginationMeta;
}

// 1. Fetching daftar sertifikat milik user yang terautentikasi
export function useUserCertificatesListQuery(params: UserCertQueryParams) {
  return useQuery<UserCertsApiResponse>({
    queryKey: ["user-certificates", params],
    queryFn: async () => {
      // Tambahkan timestamp query parameter agar browser dan proxy tidak pernah menyimpan cache GET
      const res = await apiClient.get<UserCertsApiResponse>("/certificates", {
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          search: params.search || undefined,
          status: params.status || undefined,
          event_id: params.event_id || undefined,
          _t: Date.now(), // Cache buster
        },
      });
      return res.data;
    },
    staleTime: 0, // 👈 UBAH INI: Langsung anggap stale agar refetch instan terjadi saat invalidasi
    refetchOnMount: "always",
  });
}

// 2. Fetch URL Unduhan Resmi (Signed URL dari Supabase Storage)
export async function fetchUserCertDownloadUrl(
  certId: string,
): Promise<string> {
  const res = await apiClient.get<{ data: { url: string; expiresIn: number } }>(
    `/certificates/${certId}/download`,
  );
  return res.data.data.url;
}

// 3. Mutasi Cabut Kredensial Tunggal
export function useRevokeUserCertMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; message: string; data: UserCertificateItem },
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
      queryClient.invalidateQueries({
        queryKey: ["user-certificates"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["user-dashboard"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["user-dashboard-stats"],
        exact: false,
      });
    },
  });
}

// 4. Mutasi Regenerasi Berkas Sertifikat
export function useRegenerateCertMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; message: string; data: UserCertificateItem },
    AxiosError<{ message: string }>,
    { id: string; file: File }
  >({
    mutationFn: async ({ id, file }) => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await apiClient.post(
        `/certificates/${id}/regenerate`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-certificates"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["user-dashboard"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["user-dashboard-stats"],
        exact: false,
      });
    },
  });
}
