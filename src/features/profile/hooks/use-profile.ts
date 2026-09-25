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
  currentPassword?: string;
  newPassword?: string;
  current_password?: string;
  new_password?: string;
}

// 1. Ambil data profil (tetap gunakan /auth/me yang stabil)
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

// 2. Update profil (mengarah ke /users/profile)
export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    UserProfileData,
    AxiosError<{ message: string }>,
    UpdateProfilePayload
  >({
    mutationFn: async (payload) => {
      const res = await apiClient.put<{
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

// 3. Change password (arahkan ke /users/change-password)
export function useChangePasswordMutation() {
  return useMutation<
    void,
    AxiosError<{ message: string }>,
    ChangePasswordPayload
  >({
    mutationFn: async (payload) => {
      await apiClient.post("/users/change-password", {
        currentPassword: payload.currentPassword || payload.current_password,
        newPassword: payload.newPassword || payload.new_password,
      });
    },
  });
}
