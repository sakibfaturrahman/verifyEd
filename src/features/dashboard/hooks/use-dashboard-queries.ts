import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { AxiosError } from "axios";

export interface AdminDashboardStats {
  totalOrganizations: number;
  totalEvents: number;
  activeCertificates: number;
  totalVerifications: number;
  revokedCertificates: number;
  totalIssued: number;
}

export interface VerificationStats {
  totalScans: number;
  successfulVerifications: number;
  tamperedDetections: number;
}

export interface AdminDashboardResponse {
  stats: AdminDashboardStats;
  verificationStats: VerificationStats;
}

// Hook Fetch Data Statistik Admin
export function useAdminDashboardQuery() {
  return useQuery<AdminDashboardResponse>({
    queryKey: ["admin-dashboard-stats"],
    queryFn: async () => {
      const res = await apiClient.get<{ data: AdminDashboardResponse }>(
        "/dashboard/admin",
      );
      return res.data.data;
    },
    staleTime: 1000 * 60 * 3, // Cache 3 menit
  });
}

// Hook Mutasi Ubah Status Akun User
export function useUpdateUserStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    { message: string },
    AxiosError<{ message: string }>,
    { userId: string; status: "active" | "inactive" }
  >({
    mutationFn: async ({ userId, status }) => {
      const res = await apiClient.patch(`/admin/users/${userId}/status`, {
        status,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin-users-list"] });
    },
  });
}

// Hook Mutasi Bulk Revoke Sertifikat
export function useBulkRevokeCertificatesMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    { message: string; data: { revoked: number } },
    AxiosError<{ message: string }>,
    { certificateIds: string[]; reason: string }
  >({
    mutationFn: async (payload) => {
      const res = await apiClient.post(
        "/admin/certificates/bulk-revoke",
        payload,
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin-certificates-list"] });
    },
  });
}
