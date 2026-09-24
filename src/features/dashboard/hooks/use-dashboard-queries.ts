import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { AxiosError } from "axios";

export interface BackendAdminStats {
  totalUsers?: number;
  activeUsers?: number;
  totalEvents?: number;
  totalCertificates?: number;
  activeCertificates?: number;
  revokedCertificates?: number;
  totalVerifications?: number;
}

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
      // Mengarah ke endpoint yang benar (/admin/dashboard)
      const res = await apiClient.get<{
        success: boolean;
        data: {
          stats: BackendAdminStats;
          verificationStats: Partial<VerificationStats> & Record<string, unknown>;
        };
      }>("/admin/dashboard");

      const raw = res.data?.data;
      const rawStats = raw?.stats || {};
      const rawVStats = raw?.verificationStats || {};

      // Petakan properti agar sesuai dengan tipe yang dikonsumsi oleh metricCards
      const mappedStats: AdminDashboardStats = {
        totalOrganizations: Number(rawStats.totalUsers ?? 0),
        totalEvents: Number(rawStats.totalEvents ?? 0),
        activeCertificates: Number(rawStats.activeCertificates ?? 0),
        totalVerifications: Number(rawStats.totalVerifications ?? 0),
        revokedCertificates: Number(rawStats.revokedCertificates ?? 0),
        totalIssued: Number(rawStats.totalCertificates ?? 0),
      };

      const mappedVerificationStats: VerificationStats = {
        totalScans: Number(
          rawVStats.totalScans ??
          rawVStats.total ??
          rawStats.totalVerifications ??
          0,
        ),
        successfulVerifications: Number(
          rawVStats.successfulVerifications ??
          rawVStats.verified ??
          0,
        ),
        tamperedDetections: Number(
          rawVStats.tamperedDetections ??
          rawVStats.tampered ??
          rawVStats.failed ??
          0,
        ),
      };

      return {
        stats: mappedStats,
        verificationStats: mappedVerificationStats,
      };
    },
    staleTime: 1000 * 60 * 3, // 3 menit
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