
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { AxiosError } from "axios";

export interface EventItem {
  id: string;
  user_id: string;
  name: string;
  organizer: string;
  description: string | null;
  event_date: string;
  location: string | null;
  status: "draft" | "ongoing" | "completed";
  created_at: string;
  updated_at: string;
  certificatesCount?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface EventQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "draft" | "ongoing" | "completed";
}

export interface EventsApiResponse {
  success: boolean;
  message: string;
  data: EventItem[];
  meta: PaginationMeta;
}

// 1. Fetching daftar seluruh acara (Admin Scope)
export function useAdminEventsListQuery(params: EventQueryParams) {
  return useQuery<EventsApiResponse>({
    queryKey: ["admin-events", params],
    queryFn: async () => {
      const res = await apiClient.get<EventsApiResponse>("/admin/events", {
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          search: params.search || undefined,
          status: params.status || undefined,
        },
      });
      return res.data;
    },
    staleTime: 1000 * 60 * 2,
  });
}

// 2. Mutasi Hapus Event
export function useDeleteEventMutation() {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message: string }, AxiosError<{ message: string }>, string>({
    mutationFn: async (eventId: string) => {
      const res = await apiClient.delete(`/events/${eventId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard-stats"] });
    },
  });
}