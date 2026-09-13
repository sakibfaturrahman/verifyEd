// src/features/dashboard/hooks/use-user-dashboard.ts
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export interface UserStats {
  totalEvents: number;
  totalCertificates: number;
  activeCertificates: number;
  revokedCertificates: number;
  totalVerifications: number;
}

export interface UserDashboardResponse {
  stats: UserStats;
  charts?: {
    certificateIssuanceTrend?: Array<{ date: string; count: number }>;
  };
}

export interface UserEventItem {
  id: string;
  name: string;
  eventDate: string;
  status: "draft" | "ongoing" | "completed";
  certificatesCount?: number;
}

export function useUserDashboardQuery() {
  return useQuery<UserDashboardResponse>({
    queryKey: ["user-dashboard-stats"],
    queryFn: async () => {
      const res = await apiClient.get<{ data: UserDashboardResponse }>(
        "/dashboard/user",
      );
      return res.data.data;
    },
    staleTime: 1000 * 60 * 2,
  });
}

export function useRecentEventsQuery() {
  return useQuery<UserEventItem[]>({
    queryKey: ["user-recent-events"],
    queryFn: async () => {
      const res = await apiClient.get<{ data: UserEventItem[] }>("/events", {
        params: { page: 1, limit: 3 },
      });
      return res.data.data;
    },
    staleTime: 1000 * 60 * 2,
  });
}
