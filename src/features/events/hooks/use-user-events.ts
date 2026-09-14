import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { AxiosError } from "axios";

export interface UserEventItem {
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

export interface UserEventQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "draft" | "ongoing" | "completed";
}

export interface UserEventsApiResponse {
  success: boolean;
  message: string;
  data: UserEventItem[];
  meta: PaginationMeta;
}

export interface CreateEventPayload {
  name: string;
  organizer: string;
  event_date: string;
  location?: string;
  description?: string;
  status?: "draft" | "ongoing" | "completed";
}

export interface UpdateEventPayload {
  name?: string;
  organizer?: string;
  event_date?: string;
  location?: string;
  description?: string;
  status?: "draft" | "ongoing" | "completed";
}

// 1. Fetching list agenda acara user
export function useUserEventsListQuery(params: UserEventQueryParams) {
  return useQuery<UserEventsApiResponse>({
    queryKey: ["user-events", params],
    queryFn: async () => {
      const res = await apiClient.get<UserEventsApiResponse>("/events", {
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

// 2. Mutasi Buat Event Baru
export function useCreateUserEventMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; message: string; data: UserEventItem },
    AxiosError<{ message: string }>,
    CreateEventPayload
  >({
    mutationFn: async (payload) => {
      const res = await apiClient.post("/events", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-events"] });
      queryClient.invalidateQueries({ queryKey: ["user-dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["user-recent-events"] });
    },
  });
}

// 3. Mutasi Update Event
export function useUpdateUserEventMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; message: string; data: UserEventItem },
    AxiosError<{ message: string }>,
    { id: string; payload: UpdateEventPayload }
  >({
    mutationFn: async ({ id, payload }) => {
      const res = await apiClient.put(`/events/${id}`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-events"] });
      queryClient.invalidateQueries({ queryKey: ["user-dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["user-recent-events"] });
    },
  });
}

// 4. Mutasi Hapus Event
export function useDeleteUserEventMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; message: string },
    AxiosError<{ message: string }>,
    string
  >({
    mutationFn: async (id) => {
      const res = await apiClient.delete(`/events/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-events"] });
      queryClient.invalidateQueries({ queryKey: ["user-dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["user-recent-events"] });
    },
  });
}
