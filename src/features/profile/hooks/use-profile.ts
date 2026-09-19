import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { AxiosError } from "axios";

export interface UserProfileData {
  id: string;
  name: string;
  email: string;
  role: string;
  organization?: string;
  phone?: string;
  address?: string;
  description?: string;
  created_at: string;
}

interface UpdateProfilePayload {
  name: string;
  phone?: string;
  address?: string;
  description?: string;
}

interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
}

export function useProfileQuery() {
  return useQuery<UserProfileData, AxiosError<{ message: string }>>({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const res = await apiClient.get<{
        success: boolean;
        data: UserProfileData;
      }>("/auth/me");
      return res.data.data;
    },
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    UserProfileData,
    AxiosError<{ message: string }>,
    UpdateProfilePayload
  >({
    mutationFn: async (payload) => {
      const res = await apiClient.patch<{
        success: boolean;
        data: UserProfileData;
      }>("/users/profile", payload);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      queryClient.invalidateQueries({ queryKey: ["auth-session"] });
    },
  });
}

export function useChangePasswordMutation() {
  return useMutation<
    void,
    AxiosError<{ message: string }>,
    ChangePasswordPayload
  >({
    mutationFn: async (payload) => {
      await apiClient.post("/auth/change-password", payload);
    },
  });
}
