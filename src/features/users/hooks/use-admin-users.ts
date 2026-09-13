import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { AxiosError } from "axios";

export interface UserProfileRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  description: string | null;
  avatar_url: string | null;
  role: "admin" | "user";
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
  totalEvents?: number;
  totalCertificates?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UsersApiResponse {
  success: boolean;
  message: string;
  data: UserProfileRow[];
  meta: PaginationMeta;
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "active" | "inactive";
  role?: "admin" | "user";
}

// 1. Fetching daftar pengguna/organisasi terdaftar
export function useAdminUsersListQuery(params: UserQueryParams) {
  return useQuery<UsersApiResponse>({
    queryKey: ["admin-users", params],
    queryFn: async () => {
      const res = await apiClient.get<UsersApiResponse>("/admin/users", {
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          search: params.search || undefined,
          status: params.status || undefined,
          role: params.role || undefined,
        },
      });
      return res.data;
    },
    staleTime: 1000 * 60 * 2,
  });
}

// 2. Mutasi aktivasi/deaktivasi akun pengguna
export function useUpdateUserStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; message: string; data: UserProfileRow },
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
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard-stats"] });
    },
  });
}

// 3. Mutasi hapus akun pengguna permanen
export function useDeleteUserMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; message: string },
    AxiosError<{ message: string }>,
    string
  >({
    mutationFn: async (userId: string) => {
      const res = await apiClient.delete(`/admin/users/${userId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard-stats"] });
    },
  });
}
